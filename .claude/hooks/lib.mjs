// Shared helpers for the Arman Varzesh Claude Code hooks.
// Contract and rationale: .claude/hooks/README.md
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const HOOKS_DIR = path.dirname(fileURLToPath(import.meta.url));

/** Read the hook's JSON input from stdin. Bad or empty input gives {}. */
export function readInput() {
  try {
    const raw = fs.readFileSync(0, 'utf8');
    return raw.trim() ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function git(top, args) {
  const r = spawnSync('git', ['-C', top, ...args], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  return { code: r.status ?? 1, out: r.stdout ?? '', err: r.stderr ?? '' };
}

/** Git top level for the directory the agent works in (a worktree has its own). */
export function gitTop(input) {
  const cwd = input.cwd || process.env.CLAUDE_PROJECT_DIR || process.cwd();
  const r = git(cwd, ['rev-parse', '--show-toplevel']);
  return r.code === 0 ? r.out.trim() : null;
}

export function loadConfig() {
  const file = process.env.ARMAN_HOOKS_CONFIG || path.join(HOOKS_DIR, 'checks.json');
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

export function fingerprint(abs) {
  try {
    const st = fs.lstatSync(abs);
    if (st.isDirectory()) return 'dir';
    return createHash('sha1').update(fs.readFileSync(abs)).digest('hex');
  } catch {
    return 'deleted';
  }
}

export function stateDir(top) {
  const dir = path.join(top, '.claude', '.hook-state');
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

function sleep(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

/**
 * Serialize hook runs that share one state file (parallel tool calls fire
 * PostToolUse concurrently). A lock older than staleMs is taken over, so a
 * killed hook cannot wedge later runs.
 */
export function withLock(dir, fn, { waitMs = 30000, staleMs = 15 * 60 * 1000 } = {}) {
  const lock = path.join(dir, 'lock');
  const start = Date.now();
  for (;;) {
    try {
      fs.mkdirSync(lock);
      break;
    } catch {
      let age = 0;
      try {
        age = Date.now() - fs.statSync(lock).mtimeMs;
      } catch {
        continue;
      }
      if (age > staleMs) {
        fs.rmSync(lock, { recursive: true, force: true });
        continue;
      }
      if (Date.now() - start > waitMs) throw new Error(`hook state lock busy for ${waitMs} ms: ${lock}`);
      sleep(200);
    }
  }
  try {
    return fn();
  } finally {
    fs.rmSync(lock, { recursive: true, force: true });
  }
}

function safeId(id) {
  return String(id || 'no-session').replace(/[^A-Za-z0-9_-]/g, '_').slice(0, 80);
}

export function loadState(dir, sessionId) {
  try {
    return JSON.parse(fs.readFileSync(path.join(dir, `${safeId(sessionId)}.json`), 'utf8'));
  } catch {
    return {};
  }
}

export function saveState(dir, sessionId, state) {
  const file = path.join(dir, `${safeId(sessionId)}.json`);
  fs.writeFileSync(`${file}.tmp`, JSON.stringify(state, null, 1));
  fs.renameSync(`${file}.tmp`, file);
}

function splitZ(out) {
  return out.split('\0').filter(Boolean);
}

/** Paths that differ from HEAD (staged, unstaged) plus untracked files. */
function dirtyPaths(top) {
  const out = new Set();
  for (const p of splitZ(git(top, ['diff', '--name-only', '-z', 'HEAD']).out)) out.add(p);
  for (const p of splitZ(git(top, ['ls-files', '--others', '--exclude-standard', '-z']).out)) out.add(p);
  return out;
}

/**
 * Files this session changed, whatever tool changed them (Edit, Write, a shell
 * command, a subagent, a commit). The first call records a baseline: HEAD and
 * the fingerprint of every file that was already dirty, so other people's
 * uncommitted work is never attributed to the agent.
 */
export function ensureBaseline(top, state) {
  if (state.baseline) return false;
  const head = git(top, ['rev-parse', 'HEAD']).out.trim() || null;
  const dirty = {};
  for (const p of dirtyPaths(top)) dirty[p] = fingerprint(path.join(top, p));
  state.baseline = { head, dirty, at: new Date().toISOString() };
  return true;
}

export function sessionChanges(top, state, config) {
  // Normally the baseline already exists: PreToolUse and SessionStart take it
  // before any tool runs. This is only the fallback.
  ensureBaseline(top, state);
  const { head, dirty } = state.baseline;
  const paths = new Set(dirtyPaths(top));
  if (head) {
    const r = git(top, ['diff', '--name-only', '-z', head]);
    if (r.code === 0) for (const p of splitZ(r.out)) paths.add(p);
  }
  for (const p of Object.keys(dirty)) paths.add(p);
  const ignore = (config.ignore || []).map((s) => new RegExp(s));
  const changes = [];
  for (const p of [...paths].sort()) {
    if (ignore.some((re) => re.test(p))) continue;
    const fp = fingerprint(path.join(top, p));
    if (dirty[p] !== undefined && dirty[p] === fp) continue; // untouched pre-existing change
    if (dirty[p] === undefined && head) {
      // Back to its baseline content (edited, then reverted) is not a change.
      const atHead = git(top, ['rev-parse', '--verify', '-q', `${head}:${p}`]).out.trim();
      const now = fp === 'deleted' ? null : git(top, ['hash-object', '--', p]).out.trim();
      if (atHead && now && atHead === now) continue;
    }
    changes.push({ path: p, fp });
  }
  return changes;
}

export function packageFor(p, config) {
  let best = null;
  for (const pkg of config.packages) {
    const root = pkg.root.replace(/\/$/, '');
    if (p === root || p.startsWith(`${root}/`)) {
      if (!best || root.length > best.root.length) best = pkg;
    }
  }
  return best;
}

export function shq(s) {
  return `'${String(s).replace(/'/g, `'\\''`)}'`;
}

/** Run a shell command, keep its real exit code, return the output tail. */
export function run(cmd, cwd, timeoutSec) {
  const env = { ...process.env, CI: process.env.CI || '1', FORCE_COLOR: '0' };
  // Set when the hook itself runs under `node --test`; a nested runner would
  // then switch to its machine protocol and print no TAP summary.
  delete env.NODE_TEST_CONTEXT;
  const r = spawnSync('bash', ['-c', cmd], {
    cwd,
    encoding: 'utf8',
    timeout: timeoutSec * 1000,
    killSignal: 'SIGKILL',
    maxBuffer: 64 * 1024 * 1024,
    env,
  });
  const timedOut = r.error?.code === 'ETIMEDOUT' || r.signal === 'SIGKILL';
  const out = `${r.stdout || ''}${r.stderr || ''}`
    .split('\n')
    .filter((l) => !/WARN\s+Issue while reading .*\.npmrc/.test(l))
    .join('\n');
  return { code: r.status, timedOut, spawnError: r.error && !timedOut ? String(r.error.message) : null, out, tail: out.slice(-3500) };
}

/** Expand {files}/{file}/{json}; {file} yields one command per file. */
export function expand(cmd, files, json) {
  const withJson = json ? cmd.replaceAll('{json}', shq(json)) : cmd;
  if (withJson.includes('{file}')) return files.map((f) => withJson.replaceAll('{file}', shq(f)));
  return [withJson.replaceAll('{files}', files.map(shq).join(' '))];
}

export function relTo(root, p) {
  return path.posix.relative(root.replace(/\/$/, ''), p);
}

export function headSha(top) {
  return git(top, ['rev-parse', '--short=12', 'HEAD']).out.trim() || 'unknown';
}

export function emit(obj) {
  process.stdout.write(`${JSON.stringify(obj)}\n`);
}
