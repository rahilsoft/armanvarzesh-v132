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
// The gate never blocks an honest report of a problem it cannot fix, and after
// BLOCK_CAP blocks without new changes it lets the turn end with a visible
// warning instead of looping.
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  expand, gitTop, headSha, loadConfig, loadState, packageFor, readInput, relTo, run, saveState,
  sessionChanges, stateDir, withLock, emit,
} from './lib.mjs';

// A declaration is honest only if the message does not also claim success.
const SUCCESS_CLAIM = /\b(all|every)\b[^.\n]{0,40}\b(green|pass(es|ed|ing)?|succe(ss|ssful|eded)|ok)\b|\b(checks?|tests?|build|typecheck|lint)\s+(is|are|now|all)\s+(green|passing|passed|pass(es)?)\b|همه[^.\n]{0,30}(موفق|سبز)/i;
function declares(text, ev) {
  const marked = DECLARE.FAILED.some((re) => re.test(text)) || (ev.overall === 'NOT_RUN' && DECLARE.NOT_RUN.some((re) => re.test(text)));
  if (!marked) return false;
  const rest = text.split('\n').filter((l) => !/CHECKS:|کنترل‌?ها:/i.test(l)).join('\n');
  return !SUCCESS_CLAIM.test(rest);
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
    const declared = declares(text, ev);
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
        `Full output: ${reportPath}. Fix the cause and finish again (block #${state.blocks}). If it cannot be fixed here (for example an environment problem), ` +
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
