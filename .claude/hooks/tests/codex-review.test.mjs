// Regression tests for the two Codex review findings on PR 64 (head 8b3e650).
// Each test fails if its fix is removed.
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { tapExecuted } from '../tap-executed.mjs';

const HOOKS = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function sh(cwd, cmd) {
  const r = spawnSync('bash', ['-c', cmd], { cwd, encoding: 'utf8' });
  if (r.status !== 0) throw new Error(`${cmd}: ${r.stderr}`);
}

function fixture() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'arman-hooks-codex-'));
  const w = (p, s) => {
    fs.mkdirSync(path.dirname(path.join(dir, p)), { recursive: true });
    fs.writeFileSync(path.join(dir, p), s);
  };
  w('pkg/src/a.js', 'export const a = 1;\n');
  w('pkg/src/b.js', 'export const b = 2;\n');
  w('pkg/package.json', '{"type":"module"}\n');
  w('.gitignore', '.claude/.hook-state/\n');
  // The test command would FAIL if it ran: proves the gate never ran it before the fix.
  w('config.json', JSON.stringify({
    commandTimeoutSec: 60,
    codePattern: '\\.(js|mjs)$',
    ignore: ['^\\.claude/\\.hook-state/', '^config\\.json$'],
    packages: [{
      name: 'pkg', root: 'pkg', match: '\\.(js|mjs)$',
      quick: [], full: [],
      tests: 'node -e "process.exit(1)" {files}', testsFormat: 'tap',
    }],
  }));
  sh(dir, 'git init -q && git -c user.email=t@t -c user.name=t add -A && git -c user.email=t@t -c user.name=t commit -qm init');
  return dir;
}

function hook(dir, script, extra = {}) {
  const r = spawnSync(process.execPath, [path.join(HOOKS, script)], {
    input: JSON.stringify({ session_id: 'codex-session', cwd: dir, ...extra }),
    encoding: 'utf8',
    env: { ...process.env, ARMAN_HOOKS_CONFIG: path.join(dir, 'config.json') },
  });
  return { code: r.status, json: r.stdout.trim() ? JSON.parse(r.stdout) : null };
}

test('Codex P2: a deletion-only session is NOT_RUN, not PASS', () => {
  const dir = fixture();
  hook(dir, 'pre-tool-guard.mjs', { hook_event_name: 'PreToolUse', tool_name: 'Bash', tool_input: { command: 'true' } });
  fs.rmSync(path.join(dir, 'pkg/src/b.js'));
  const s = hook(dir, 'stop-gate.mjs', { hook_event_name: 'Stop', last_assistant_message: 'Done.' });
  assert.equal(s.json?.decision, 'block');
  assert.match(s.json.reason, /NOT_RUN/);
  assert.doesNotMatch(s.json.reason, /overall PASS/);
});

const tap = (lines) => lines.join('\n') + '\n';

test('Codex P2: skipped, TODO and empty-file entries are not executed tests', () => {
  assert.deepEqual(tapExecuted(tap(['ok 1 - a # SKIP', 'ok 2 - b # TODO', '# tests 2', '# pass 0'])), { executed: 0, emptyFiles: [] });
  const empty = tapExecuted(tap(['# Subtest: e.test.mjs', 'ok 1 - e.test.mjs', 'ok 2 - real']));
  assert.equal(empty.executed, 1);
  assert.deepEqual(empty.emptyFiles, ['e.test.mjs']);
  assert.equal(tapExecuted(tap(['ok 1 - real', '    ok 1 - nested', 'not ok 2 - broken'])).executed, 2);
});

test('Codex P2: the CI checker exits 1 for a skipped-only or empty-file report and 0 for a real one', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'arman-tap-'));
  const run = (lines) => {
    const f = path.join(dir, `r${Math.random()}.tap`);
    fs.writeFileSync(f, tap(lines));
    return spawnSync(process.execPath, [path.join(HOOKS, 'tap-executed.mjs'), f], { encoding: 'utf8' }).status;
  };
  assert.equal(run(['ok 1 - a # SKIP', '# tests 1']), 1);
  assert.equal(run(['ok 1 - e.test.mjs', '# tests 1', '# pass 1']), 1);
  assert.equal(run(['ok 1 - real', '# tests 1', '# pass 1']), 0);
});
