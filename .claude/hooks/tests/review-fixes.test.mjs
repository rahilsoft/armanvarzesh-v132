// Regression tests for the independent review of PR 64 (findings P0, P1).
// Each test failed on head 0e396fb and must keep failing if its fix is removed.
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { checkCommand, checkPath } from '../pre-tool-guard.mjs';

const HOOKS = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const verdict = (cmd) => checkCommand(cmd)?.decision ?? 'allow';

function sh(cwd, cmd) {
  const r = spawnSync('bash', ['-c', cmd], { cwd, encoding: 'utf8' });
  if (r.status !== 0) throw new Error(`${cmd}: ${r.stderr}`);
}

function fixture() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'arman-hooks-rev-'));
  const w = (p, s) => {
    fs.mkdirSync(path.dirname(path.join(dir, p)), { recursive: true });
    fs.writeFileSync(path.join(dir, p), s);
  };
  w('pkg/src/a.js', 'export const a = 1;\n');
  w('pkg/check.cjs', `const fs=require('fs');for(const f of fs.readdirSync('src')){if(fs.readFileSync('src/'+f,'utf8').includes('TYPE_ERROR')){console.error('bad '+f);process.exit(1)}}\n`);
  w('pkg/test/a.test.mjs', `import {test} from 'node:test';test('a',()=>{});\n`);
  w('pkg/package.json', '{"type":"module"}\n');
  w('.gitignore', '.claude/.hook-state/\n');
  w('config.json', JSON.stringify({
    commandTimeoutSec: 60,
    codePattern: '\\.(js|mjs)$',
    ignore: ['^\\.claude/\\.hook-state/', '^config\\.json$'],
    packages: [{
      name: 'pkg', root: 'pkg', match: '\\.(js|mjs)$',
      quick: ['node --check {file}'], full: ['node check.cjs'],
      tests: 'node --test --test-reporter=tap test/*.test.mjs', testsFormat: 'tap', testsRunAll: true,
    }],
  }));
  sh(dir, 'git init -q && git -c user.email=t@t -c user.name=t add -A && git -c user.email=t@t -c user.name=t commit -qm init');
  return dir;
}

function hook(dir, script, extra = {}, session = 'rev-session') {
  const input = { session_id: session, cwd: dir, ...extra };
  const r = spawnSync(process.execPath, [path.join(HOOKS, script)], {
    input: JSON.stringify(input),
    encoding: 'utf8',
    env: { ...process.env, ARMAN_HOOKS_CONFIG: path.join(dir, 'config.json') },
  });
  return { code: r.status, json: r.stdout.trim() ? JSON.parse(r.stdout) : null, stderr: r.stderr };
}
const stop = (dir, msg) => hook(dir, 'stop-gate.mjs', { hook_event_name: 'Stop', last_assistant_message: msg });
const pre = (dir, tool, input) => hook(dir, 'pre-tool-guard.mjs', { hook_event_name: 'PreToolUse', tool_name: tool, tool_input: input });
const breakIt = (dir) => fs.writeFileSync(path.join(dir, 'pkg/src/a.js'), 'export const a = TYPE_ERROR;\n');

test('P0: the session first edit is checked (baseline is taken before any tool runs)', () => {
  const dir = fixture();
  pre(dir, 'Write', { file_path: path.join(dir, 'pkg/src/a.js') });
  breakIt(dir);
  hook(dir, 'post-tool-check.mjs', { hook_event_name: 'PostToolUse', tool_name: 'Write' });
  const s = stop(dir, 'Done.');
  assert.equal(s.json?.decision, 'block');
  assert.match(s.json.reason, /FAIL/);
});

test('P0: a one-edit session with no PostToolUse run is still gated at Stop', () => {
  const dir = fixture();
  pre(dir, 'Bash', { command: 'sed -i s/1/TYPE_ERROR/ pkg/src/a.js' });
  breakIt(dir);
  assert.equal(stop(dir, 'Done.').json?.decision, 'block');
});

test('P1: CHECKS: FAILED next to a success claim is not an honest declaration', () => {
  const dir = fixture();
  pre(dir, 'Bash', { command: 'true' });
  breakIt(dir);
  const s = stop(dir, 'Every check is green and all tests pass.\n\nCHECKS: FAILED');
  assert.equal(s.json?.decision, 'block');
});

test('P1: repeated false-success stops are never let through', () => {
  const dir = fixture();
  pre(dir, 'Bash', { command: 'true' });
  breakIt(dir);
  for (let i = 0; i < 8; i++) {
    assert.equal(stop(dir, 'All done, everything passes.').json?.decision, 'block', `stop #${i + 1}`);
  }
});

test('P1: the hook state dir cannot be erased or rewritten by the agent', () => {
  for (const cmd of [
    'rm -rf .claude/.hook-state',
    'rm -rf /repo/.claude/.hook-state/x.json',
    'echo {} > .claude/.hook-state/rev-session.json',
    `python3 -c "import shutil;shutil.rmtree('.claude/.hook-state')"`,
    'mv .claude/.hook-state /tmp/x',
  ]) assert.equal(verdict(cmd), 'deny', cmd);
  assert.equal(checkPath('.claude/.hook-state/s.json', '/repo', 'Write')?.decision, 'deny');
  assert.equal(verdict('cat .claude/.hook-state/gate-report.md'), 'allow');
});

test('P1: control files cannot be changed through interpreters, cd or git apply', () => {
  for (const cmd of [
    `python3 -c "open('.claude/settings.json','w').write('{}')"`,
    `node -e "require('fs').writeFileSync('.claude/hooks/lib.mjs','')"`,
    `cd .claude && sed -i 's/a/b/' settings.json`,
    'git apply fix.patch .claude/hooks/lib.mjs',
    `echo '{"disableAllHooks":true}' > .claude/settings.local.json`,
    `jq '.disableAllHooks=true' x > y && mv y .claude/settings.local.json`,
  ]) assert.notEqual(verdict(cmd), 'allow', cmd);
});

test('P1: destructive command variants are denied', () => {
  for (const cmd of [
    'rm -rf -- /',
    'rm -rf "$HOME"',
    'git -C . reset --hard',
    'git -c x=y push -f origin develop',
    'git commit -n -m x',
    'find . -delete',
    'git checkout -- app',
    'cp x .env.production',
  ]) assert.equal(verdict(cmd), 'deny', cmd);
  for (const cmd of ['git -C app status', 'git commit -m "feat: x"', 'find . -name "*.log"', 'git checkout -b agent/x']) {
    assert.equal(verdict(cmd), 'allow', cmd);
  }
});

test('P1: every jest test command in checks.json passes with no tests so the gate reports NOT_RUN, not FAIL', () => {
  const cfg = JSON.parse(fs.readFileSync(path.join(HOOKS, 'checks.json'), 'utf8'));
  const jest = cfg.packages.filter((p) => /\bjest\b/.test(p.tests || ''));
  assert.ok(jest.length >= 4);
  for (const p of jest) assert.match(p.tests, /--passWithNoTests/, p.name);
});
