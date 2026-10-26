#!/usr/bin/env node
// Stop / SubagentStop gate: Claude may not end its turn with unverified changes
// presented as done. For every package this session changed it runs the full
// checks (typecheck, lint) and the related tests. Results:
//   PASS     -> stop allowed.
//   FAIL     -> stop blocked until fixed, or until the final message declares
//               the failure with a line `CHECKS: FAILED` (honest report).
//   NOT_RUN  -> a required check could not run (timeout, missing tool,
//               0 tests executed, no check configured). Stop blocked unless the
//               final message declares `CHECKS: NOT RUN` or `CHECKS: FAILED`.
// An honest report ends the turn: the marker plus a message with no sentence
// that claims success without naming a failure. There is no override cap: an
// unverified stop is never let through, the declaration is the only exit.
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  expand, gitTop, headSha, loadConfig, loadState, packageFor, readInput, relTo, run, saveState,
  sessionChanges, stateDir, withLock, emit,
} from './lib.mjs';

// A declaration is honest only if the message does not also claim success.
// Honest-report rule. With checks FAIL/NOT_RUN the final message is blocked only for
//  (a) an OVERALL success claim: all/every/everything/both + tests/checks/green/pass/works,
//      "ready to merge", "CI is green", "no errors/failures", N/N passed, "done"/"complete",
//      whatever else the clause says, and
//  (b) a claim that a check the gate reports FAIL/NOT_RUN passes (matched by package or
//      command name). Narrow claims about checks that passed or are not named are allowed.
// Claims are judged per clause, so "lint passes, typecheck fails" is not one claim.
const SUCCESS_WORD = /\b(?:pass(?:es|ed|ing)?|green|works?|working|ok(?:ay)?|fine|clean|fixed|resolved|succe(?:ss|ssful|eded)|good)\b/i;
const OVERALL = [
  /\b(?:all|every|everything|both)\b[^.\n]{0,40}\b(?:tests?|checks?|green|pass(?:es|ed|ing)?|works?|working|good|fine|ok|done|complete[d]?|clean)\b/i,
  /\bready(?:\s+to\s+(?:merge|ship))?\b/i,
  /\bci\b[^.\n]{0,15}\bgreen\b/i,
  /\bno\s+(?:\w+\s+)?(?:errors?|failures?)\b/i,
  /\d+\s*\/\s*\d+\s*(?:tests?\s*)?pass(?:ed)?/i,
  /\b(?:done|complete[d]?|finished)\b/i,
  /همه[^.\n]{0,30}(?:موفق|سبز)/,
];
const NEGATOR = /^(?:not|no|never|cannot|without|unable|isn't|aren't|don't|doesn't|didn't|couldn't|can't|won't|wasn't|weren't)$|n't$/i;
const CLAUSE_BREAK = /\.(?=\s|$)|[,;:!?()\n]|\b(?:and|but|so|then|now|although|though)\b/gi;
function negated(before) {
  let last = 0;
  for (const m of before.matchAll(CLAUSE_BREAK)) last = m.index + m[0].length;
  return before.slice(last).trim().split(/\s+/).filter(Boolean).slice(-4).some((w) => NEGATOR.test(w));
}
const esc = (x) => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const STOP_TOKENS = new Set(['node', 'pnpm', 'exec', 'npx', 'yarn', 'run', 'tests', 'test', 'json', 'files', 'file', 'tap', 'reporter', 'outputFile', 'forceExit', 'passWithNoTests']);
/** Name patterns of the checks the gate reports as FAIL or NOT_RUN. */
function failingNames(ev) {
  const out = [];
  for (const r of ev.results || []) {
    if (r.status === 'PASS') continue;
    if (r.name && !r.name.startsWith('(')) out.push(esc(r.name));
    for (const st of r.steps || []) {
      if (st.status === 'PASS') continue;
      const cmd = st.cmd || '';
      if (/\btsc\b/.test(cmd)) out.push('typecheck', 'type[- ]?check', 'tsc');
      if (/\beslint\b/.test(cmd)) out.push('lint', 'eslint');
      if (/\bjest\b|--test\b|related tests/.test(cmd)) out.push('tests?', 'specs?', 'jest');
      for (const t of cmd.split(/[^\w.-]+/)) if (t.length >= 4 && !STOP_TOKENS.has(t) && !t.startsWith('-') && !t.startsWith('{')) out.push(esc(t));
    }
  }
  return [...new Set(out)];
}
/** The first clause that breaks the rule above, or null. */
function successSentence(text, ev) {
  const clean = text.replace(/CHECKS:\s*(FAILED|NOT[ _]RUN)/gi, ' ').replace(/کنترل‌?ها:\s*(ناموفق|اجرا\s*نشد)/g, ' ');
  const names = failingNames(ev);
  const nameRe = names.length ? new RegExp(`(?<![\\w-])(?:${names.join('|')})(?![\\w-])`, 'i') : null;
  const clauses = [];
  let start = 0;
  for (const m of clean.matchAll(CLAUSE_BREAK)) {
    clauses.push(clean.slice(start, m.index));
    start = m.index + (/^[a-z]/i.test(m[0]) ? 0 : m[0].length);
  }
  clauses.push(clean.slice(start));
  for (const clause of clauses) {
    for (const re of OVERALL) {
      const m = re.exec(clause);
      if (m && !negated(clause.slice(0, m.index))) return clause.trim();
    }
    if (nameRe && nameRe.test(clause)) {
      const m = SUCCESS_WORD.exec(clause);
      if (m && !negated(clause.slice(0, m.index))) return clause.trim();
    }
  }
  return null;
}
function declares(text, ev) {
  const marked = DECLARE.FAILED.some((re) => re.test(text)) || (ev.overall === 'NOT_RUN' && DECLARE.NOT_RUN.some((re) => re.test(text)));
  if (!marked) return { ok: false, claim: null };
  const claim = successSentence(text, ev);
  return { ok: !claim, claim };
}
const DECLARE = {
  FAILED: [/^\s*[*_`]*CHECKS:\s*FAILED\b/im, /کنترل‌?ها:\s*ناموفق/],
  NOT_RUN: [/^\s*[*_`]*CHECKS:\s*NOT[ _]RUN\b/im, /کنترل‌?ها:\s*اجرا\s*نشد/],
};

function lastAssistantText(input) {
  if (typeof input.last_assistant_message === 'string') return input.last_assistant_message;
  if (input.last_assistant_message && typeof input.last_assistant_message === 'object') {
    return JSON.stringify(input.last_assistant_message);
  }
  try {
    const lines = fs.readFileSync(input.transcript_path, 'utf8').trim().split('\n');
    for (let i = lines.length - 1; i >= 0; i--) {
      const e = JSON.parse(lines[i]);
      const msg = e.message || e;
      if ((e.type === 'assistant' || msg.role === 'assistant') && msg.content) {
        const parts = Array.isArray(msg.content) ? msg.content : [{ type: 'text', text: msg.content }];
        const text = parts.filter((p) => p.type === 'text').map((p) => p.text).join('\n');
        if (text) return text;
      }
    }
  } catch {
    /* no transcript: treated as no declaration */
  }
  return '';
}

function testCounts(pkg, r, jsonFile) {
  if (pkg.testsFormat === 'tap') {
    const n = (k) => Number((r.out.match(new RegExp(`^# ${k} (\\d+)`, 'm')) || [])[1] ?? NaN);
    const tests = n('tests');
    if (Number.isNaN(tests)) return null;
    // node:test reports a test file that defines no tests as one passing
    // top-level test named after the file. That is not an executed test.
    const emptyFiles = (r.out.match(/^ok \d+ - \S+\.[cm]?js\s*$/gm) || []).length;
    return { total: tests - emptyFiles, failed: n('fail'), skipped: (n('skipped') || 0) + (n('todo') || 0) };
  }
  try {
    const j = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));
    return { total: j.numTotalTests, failed: j.numFailedTests, skipped: j.numPendingTests + (j.numTodoTests || 0) };
  } catch {
    return null;
  }
}

function checkPackage(top, pkg, items, config) {
  const timeout = config.commandTimeoutSec || 300;
  const cwd = path.join(top, pkg.root);
  const steps = [];
  for (const cmd of pkg.full || []) {
    const r = run(cmd, cwd, timeout);
    if (r.timedOut || r.code === 127 || r.spawnError) {
      steps.push({ cmd, status: 'NOT_RUN', why: r.timedOut ? `timed out after ${timeout}s` : `could not run (${r.spawnError || 'exit 127'})`, tail: r.tail });
    } else {
      steps.push({ cmd, status: r.code === 0 ? 'PASS' : 'FAIL', code: r.code, tail: r.code === 0 ? '' : r.tail });
    }
  }
  if (pkg.tests) {
    const src = items.filter((c) => c.fp !== 'deleted' && new RegExp(pkg.match).test(c.path)).map((c) => relTo(pkg.root, c.path));
    if (!src.length && !pkg.testsRunAll) {
      steps.push({ cmd: '(related tests)', status: 'PASS', note: 'no changed source files to relate tests to' });
    } else {
      const jsonFile = path.join(os.tmpdir(), `arman-gate-${process.pid}-${pkg.name}.json`);
      fs.rmSync(jsonFile, { force: true });
      const [cmd] = expand(pkg.tests, src, jsonFile);
      const r = run(cmd, cwd, timeout);
      const counts = testCounts(pkg, r, jsonFile);
      fs.rmSync(jsonFile, { force: true });
      const executed = counts ? counts.total - counts.skipped : 0;
      let status;
      let why;
      if (r.timedOut) [status, why] = ['NOT_RUN', `timed out after ${timeout}s`];
      else if (r.code === 127 || r.spawnError) [status, why] = ['NOT_RUN', 'test runner could not start'];
      else if (r.code !== 0 || (counts && counts.failed > 0)) [status, why] = ['FAIL', `exit ${r.code}`];
      else if (!counts) [status, why] = ['NOT_RUN', 'test counts unreadable, cannot prove tests ran'];
      else if (executed <= 0) [status, why] = ['NOT_RUN', '0 tests executed for the changed files (zero tests is not a pass)'];
      else status = 'PASS';
      steps.push({ cmd, status, why, counts, tail: status === 'PASS' ? '' : r.tail });
    }
  }
  const worst = steps.some((s) => s.status === 'FAIL') ? 'FAIL' : steps.some((s) => s.status === 'NOT_RUN') ? 'NOT_RUN' : 'PASS';
  return { status: worst, steps };
}

function evaluate(top, state, config) {
  const changes = sessionChanges(top, state, config);
  const codeRe = new RegExp(config.codePattern);
  const byPkg = new Map();
  const unconfigured = [];
  for (const c of changes) {
    const pkg = packageFor(c.path, config);
    if (pkg) {
      if (!byPkg.has(pkg.name)) byPkg.set(pkg.name, { pkg, items: [] });
      byPkg.get(pkg.name).items.push(c);
    } else if (codeRe.test(c.path) && c.fp !== 'deleted') unconfigured.push(c.path);
  }
  state.full ||= {};
  const results = [];
  for (const { pkg, items } of byPkg.values()) {
    const key = createHash('sha1').update(items.map((c) => `${c.path}:${c.fp}`).join('\n')).digest('hex');
    const cached = state.full[pkg.name];
    let res;
    if (cached && cached.key === key && cached.status === 'PASS') res = { ...cached, cached: true };
    else {
      res = { ...checkPackage(top, pkg, items, config), key };
      state.full[pkg.name] = res;
    }
    results.push({ name: pkg.name, files: items.length, ...res });
  }
  if (unconfigured.length) {
    results.push({
      name: '(no configured check)',
      files: unconfigured.length,
      status: 'NOT_RUN',
      steps: [{ cmd: '-', status: 'NOT_RUN', why: `no check configured in .claude/hooks/checks.json for: ${unconfigured.slice(0, 10).join(', ')}${unconfigured.length > 10 ? ' …' : ''}` }],
    });
  }
  const overall = results.some((r) => r.status === 'FAIL') ? 'FAIL' : results.some((r) => r.status === 'NOT_RUN') ? 'NOT_RUN' : 'PASS';
  const changeKey = createHash('sha1').update(changes.map((c) => `${c.path}:${c.fp}`).join('\n')).digest('hex');
  return { overall, results, changes: changes.length, changeKey };
}

function report(top, sha, ev) {
  const lines = [`# Stop gate report`, ``, `HEAD ${sha}, ${new Date().toISOString()}, overall **${ev.overall}**, ${ev.changes} changed files`, ``];
  for (const r of ev.results) {
    lines.push(`## ${r.name}: ${r.status}${r.cached ? ' (cached for identical files)' : ''} (${r.files} files)`);
    for (const s of r.steps || []) {
      const c = s.counts ? ` tests total=${s.counts.total} failed=${s.counts.failed} skipped=${s.counts.skipped}` : '';
      lines.push(`- ${s.status} \`${s.cmd}\`${s.code !== undefined ? ` exit ${s.code}` : ''}${c}${s.why ? ` (${s.why})` : ''}${s.note ? ` (${s.note})` : ''}`);
      if (s.tail) lines.push('', '```', s.tail.trim().split('\n').slice(-25).join('\n'), '```', '');
    }
  }
  return lines.join('\n');
}

function summary(ev) {
  return ev.results
    .map((r) => {
      const bad = (r.steps || []).filter((s) => s.status !== 'PASS');
      const tests = (r.steps || []).find((s) => s.counts);
      const t = tests ? `, tests ${tests.counts.total - tests.counts.skipped} run / ${tests.counts.failed} failed / ${tests.counts.skipped} skipped` : '';
      return `${r.name} ${r.status}${t}${bad.length ? `: ${bad.map((s) => `${s.cmd} ${s.why || `exit ${s.code}`}`).join('; ')}` : ''}`;
    })
    .join(' | ');
}

const input = readInput();

function main() {
  const top = gitTop(input);
  if (!top) return;
  const dir = stateDir(top);
  withLock(dir, () => {
    const state = loadState(dir, input.session_id);
    let ev;
    try {
      ev = evaluate(top, state, loadConfig());
    } catch (e) {
      ev = { overall: 'NOT_RUN', changes: -1, changeKey: 'error', results: [{ name: 'stop-gate', status: 'NOT_RUN', steps: [{ cmd: 'evaluate', status: 'NOT_RUN', why: `internal error: ${e?.message || e}` }] }] };
    }
    const sha = headSha(top);
    fs.writeFileSync(path.join(dir, 'gate-report.md'), report(top, sha, ev));
    const reportPath = path.relative(top, path.join(dir, 'gate-report.md'));
    if (ev.overall === 'PASS') {
      state.blocks = 0;
      saveState(dir, input.session_id, state);
      if (ev.results.length) emit({ systemMessage: `Stop gate PASS at ${sha}: ${summary(ev)}` });
      return;
    }
    const text = lastAssistantText(input);
    const decl = declares(text, ev);
    const declared = decl.ok;
    if (declared) {
      state.blocks = 0;
      saveState(dir, input.session_id, state);
      emit({ systemMessage: `Stop gate ${ev.overall} at ${sha}, declared in the final message: ${summary(ev)}. Report: ${reportPath}` });
      return;
    }
    state.blocks = state.lastBlockKey === ev.changeKey ? (state.blocks || 0) + 1 : 1;
    state.lastBlockKey = ev.changeKey;
    // No override: an unverified stop is never let through. The honest exit is
    // a declaration that does not claim success.
    saveState(dir, input.session_id, state);
    const marker = ev.overall === 'FAIL' ? 'CHECKS: FAILED' : 'CHECKS: NOT RUN';
    emit({
      decision: 'block',
      reason:
        `Stop gate: required checks are ${ev.overall} for files changed in this session (HEAD ${sha}). ${summary(ev)}. ` +
        `Full output: ${reportPath}. ${decl.claim ? `Your final message has the marker but claims success: "${decl.claim}". Failed or unrun checks are listed above. ` : ''}Fix the cause and finish again (block #${state.blocks}). If it cannot be fixed here (for example an environment problem), ` +
        `end with a final message that does not claim success and contains a line \`${marker}\` naming the check and the reason. A message that also claims the checks pass is rejected.`,
    });
  });
}

try {
  main();
} catch (e) {
  // Lock busy or state unwritable: block with an honest reason instead of
  // silently allowing a stop that was never verified, unless the final
  // message already reports it.
  const text = lastAssistantText(input);
  if ([...DECLARE.FAILED, ...DECLARE.NOT_RUN].some((re) => re.test(text))) {
    emit({ systemMessage: `Stop gate could not run (${e?.message || e}), declared in the final message.` });
  } else emit({ decision: 'block', reason: `Stop gate could not run (${e?.message || e}). If this persists, end with a line \`CHECKS: NOT RUN\` and the reason.` });
}
