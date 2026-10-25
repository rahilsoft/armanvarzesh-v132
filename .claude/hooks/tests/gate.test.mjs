// Behavioural tests for post-tool-check.mjs and stop-gate.mjs. Each test runs
// the real hook processes against a throwaway git repo with a tiny package
// whose "typecheck" fails when a source file contains TYPE_ERROR.
import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const HOOKS = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function sh(cwd, cmd) {
  const r = spawnSync('bash', ['-c', cmd], { cwd, encoding: 'utf8' });
  if (r.status !== 0) throw new Error(`${cmd}: ${r.stderr}`);
  return r.stdout;
}

function fixture({ timeoutSec = 60, tests = 'one' } = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'arman-hooks-'));
  const w = (p, s) => {
    fs.mkdirSync(path.dirname(path.join(dir, p)), { recursive: true });
    fs.writeFileSync(path.join(dir, p), s);
  };
  w('pkg/src/a.js', 'export const a = 1;\n');
  w('pkg/check.js', `const fs=require('fs');for(const f of fs.readdirSync('src')){if(fs.readFileSync('src/'+f,'utf8').includes('TYPE_ERROR')){console.error('src/'+f+': error TS2322 (fixture)');process.exit(1)}}\n`);
  w('pkg/slow.js', 'setTimeout(()=>{}, 5000);\n');
  if (tests === 'one') w('pkg/test/a.test.mjs', `import {test} from 'node:test';import assert from 'node:assert';test('a',async()=>{const m=await import('../src/a.js');assert.equal(typeof m.a,'number')});\n`);
  else w('pkg/test/empty.test.mjs', '// no tests yet\n');
  w('pkg/package.json', '{"type":"module"}\n');
  w('.gitignore', '.claude/.hook-state/\n');
  w('config.json', JSON.stringify({
    commandTimeoutSec: timeoutSec,
    codePattern: '\\.(js|mjs|ts)$',
    ignore: ['^\\.claude/\\.hook-state/', '^config\\.json$'],
    packages: [{
      name: 'pkg', root: 'pkg', match: '\\.(js|mjs)$',
      quick: ['node --check {file}'],
      full: ['node check.cjs'],
      tests: 'node --test --test-reporter=tap test/*.test.mjs',
      testsFormat: 'tap', testsRunAll: true,
    }],
  }));
  fs.renameSync(path.join(dir, 'pkg/check.js'), path.join(dir, 'pkg/check.cjs'));
  sh(dir, 'git init -q && git -c user.email=t@t -c user.name=t add -A && git -c user.email=t@t -c user.name=t commit -qm init');
  return dir;
}

function hook(dir, name, extra = {}) {
  const input = { session_id: 'test-session', cwd: dir, hook_event_name: name === 'stop-gate' ? 'Stop' : 'PostToolUse', ...extra };
  const r = spawnSync(process.execPath, [path.join(HOOKS, `${name}.mjs`)], {
    input: JSON.stringify(input),
    encoding: 'utf8',
    env: { ...process.env, ARMAN_HOOKS_CONFIG: path.join(dir, 'config.json'), ARMAN_STOP_GATE_BLOCK_CAP: '2' },
  });
  const json = r.stdout.trim() ? JSON.parse(r.stdout) : null;
  return { code: r.status, json, stderr: r.stderr };
}
const stop = (dir, msg = 'Done.') => hook(dir, 'stop-gate', { last_assistant_message: msg, stop_hook_active: false });
const post = (dir) => hook(dir, 'post-tool-check', { tool_name: 'Bash', tool_input: { command: 'sed -i …' } });
const write = (dir, p, s) => fs.writeFileSync(path.join(dir, p), s);

test('no changes: stop is allowed silently', () => {
  const dir = fixture();
  const r = stop(dir);
  assert.equal(r.code, 0);
  assert.equal(r.json, null);
});

test('uncommitted work that existed before the session is not attributed to the agent', () => {
  const dir = fixture();
  write(dir, 'pkg/src/a.js', 'export const a = TYPE_ERROR;\n'); // someone else's dirty file
  assert.equal(post(dir).code, 0, 'first call records the baseline');
  assert.equal(stop(dir).json, null);
});

test('injected error via a shell edit is caught, fed back, blocks a success claim, and passes after the fix', () => {
  const dir = fixture();
  post(dir); // baseline: clean tree
  // Shell edit (no Edit/Write tool involved): syntax error.
  write(dir, 'pkg/src/a.js', 'export const a = ;\n');
  const p1 = post(dir);
  assert.equal(p1.code, 2, 'PostToolUse exit 2 sends the failure back to Claude');
  assert.match(p1.stderr, /Post-edit check FAILED/);
  assert.match(p1.stderr, /src\/a\.js/);
  // Valid syntax, but the package check (typecheck stand-in) fails.
  write(dir, 'pkg/src/a.js', 'export const a = TYPE_ERROR;\n');
  assert.equal(post(dir).code, 0, 'syntax ok, quick check passes');
  const s1 = stop(dir, 'All checks pass, tests are green. Done.');
  assert.equal(s1.json?.decision, 'block', 'a false success claim cannot end the turn');
  assert.match(s1.json.reason, /FAIL/);
  assert.match(s1.json.reason, /node check\.cjs/);
  assert.match(fs.readFileSync(path.join(dir, '.claude/.hook-state/gate-report.md'), 'utf8'), /error TS2322/);
  // Fix it.
  write(dir, 'pkg/src/a.js', 'export const a = 2;\n');
  const s2 = stop(dir, 'Fixed.');
  assert.equal(s2.code, 0);
  assert.equal(s2.json?.decision, undefined);
  assert.match(s2.json.systemMessage, /Stop gate PASS/);
  assert.match(s2.json.systemMessage, /tests 1 run \/ 0 failed/);
});

test('an honest failure report is allowed to end the turn', () => {
  const dir = fixture();
  post(dir);
  write(dir, 'pkg/src/a.js', 'export const a = TYPE_ERROR;\n');
  const r = stop(dir, 'I could not make the typecheck pass.\n\nCHECKS: FAILED — node check.cjs reports TS2322 in src/a.js.');
  assert.equal(r.json?.decision, undefined);
  assert.match(r.json.systemMessage, /declared in the final message/);
  const fa = stop(dir, 'نتیجه: کنترل‌ها: ناموفق، خطای تایپ باقی است.');
  assert.equal(fa.json?.decision, undefined);
});

test('a NOT RUN declaration does not excuse a real failure', () => {
  const dir = fixture();
  post(dir);
  write(dir, 'pkg/src/a.js', 'export const a = TYPE_ERROR;\n');
  assert.equal(stop(dir, 'CHECKS: NOT RUN').json?.decision, 'block');
});

test('committed changes are still verified (clean git status is not a pass)', () => {
  const dir = fixture();
  post(dir);
  write(dir, 'pkg/src/a.js', 'export const a = TYPE_ERROR;\n');
  sh(dir, 'git -c user.email=t@t -c user.name=t commit -qam "feat: done"');
  assert.equal(sh(dir, 'git status --porcelain'), '');
  assert.equal(stop(dir).json?.decision, 'block');
});

test('zero executed tests is NOT RUN, never a pass', () => {
  const dir = fixture({ tests: 'none' });
  post(dir);
  write(dir, 'pkg/src/a.js', 'export const a = 3;\n');
  const r = stop(dir, 'Done, all good.');
  assert.equal(r.json?.decision, 'block');
  assert.match(r.json.reason, /NOT_RUN/);
  assert.match(r.json.reason, /0 tests executed|counts unreadable/);
  assert.equal(stop(dir, 'Tests could not be proven.\nCHECKS: NOT RUN (0 tests for pkg)').json?.decision, undefined);
});

test('a check that times out is NOT RUN, not PASS', () => {
  const dir = fixture({ timeoutSec: 1 });
  const cfg = JSON.parse(fs.readFileSync(path.join(dir, 'config.json'), 'utf8'));
  cfg.packages[0].full = ['node slow.js'];
  fs.writeFileSync(path.join(dir, 'config.json'), JSON.stringify(cfg));
  post(dir);
  write(dir, 'pkg/src/a.js', 'export const a = 4;\n');
  const r = stop(dir);
  assert.equal(r.json?.decision, 'block');
  assert.match(r.json.reason, /timed out/);
});

test('code outside any configured package is reported as unchecked', () => {
  const dir = fixture();
  post(dir);
  fs.mkdirSync(path.join(dir, 'services/x'), { recursive: true });
  write(dir, 'services/x/index.js', 'module.exports = 1;\n');
  const r = stop(dir);
  assert.equal(r.json?.decision, 'block');
  assert.match(r.json.reason, /no check configured/);
});

test('repeated blocks without new work end with a visible override, not an endless loop', () => {
  const dir = fixture();
  post(dir);
  write(dir, 'pkg/src/a.js', 'export const a = TYPE_ERROR;\n');
  assert.equal(stop(dir).json?.decision, 'block');
  assert.equal(stop(dir).json?.decision, 'block');
  const third = stop(dir); // cap is 2 in tests
  assert.equal(third.json?.decision, undefined);
  assert.match(third.json.systemMessage, /STOP GATE OVERRIDDEN/);
  assert.match(third.json.systemMessage, /unverified/);
});

test('a passing result is cached for identical files', () => {
  const dir = fixture();
  post(dir);
  write(dir, 'pkg/src/a.js', 'export const a = 5;\n');
  assert.match(stop(dir).json.systemMessage, /PASS/);
  stop(dir);
  assert.match(fs.readFileSync(path.join(dir, '.claude/.hook-state/gate-report.md'), 'utf8'), /cached for identical files/);
});

test('parallel PostToolUse runs serialize on the state lock', async () => {
  const dir = fixture();
  post(dir);
  write(dir, 'pkg/src/a.js', 'export const a = 6;\n');
  const once = () =>
    new Promise((resolve) => {
      const c = spawn(process.execPath, [path.join(HOOKS, 'post-tool-check.mjs')], {
        env: { ...process.env, ARMAN_HOOKS_CONFIG: path.join(dir, 'config.json') },
      });
      c.stdin.end(JSON.stringify({ session_id: 'test-session', cwd: dir }));
      c.on('exit', resolve);
    });
  const codes = await Promise.all([once(), once(), once(), once()]);
  assert.deepEqual(codes, [0, 0, 0, 0]);
  const state = JSON.parse(fs.readFileSync(path.join(dir, '.claude/.hook-state/test-session.json'), 'utf8'));
  assert.equal(state.quick['pkg/src/a.js'].ok, true);
  assert.equal(fs.existsSync(path.join(dir, '.claude/.hook-state/lock')), false);
});
