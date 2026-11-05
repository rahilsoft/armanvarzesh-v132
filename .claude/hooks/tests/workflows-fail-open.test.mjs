// REV-20261021-04 (reopened 2026-11-05): a green workflow must not hide a
// failing build, test, coverage, lint or typecheck step behind `|| true` or
// `|| echo`. This test scans every workflow GitHub executes and fails when such
// a step appears again.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const wfDir = join(root, '.github', 'workflows');

// A gate step: a package runner or test tool invoked for build/test/coverage/lint/typecheck.
const GATE_CMD = /\b(pnpm|npm|npx|yarn|turbo|nx|jest|eslint|tsc|vitest|playwright)\b[^|#]*\b(build|test|tests|coverage(:\w+)?|lint|typecheck|eslint|tsc)\b|^\s*(-\s*)?(run:\s*)?(eslint|tsc|jest|vitest)\b/;
const MASK = /\|\|\s*(true|:|echo\b)/;

export function findFailOpen(text) {
  const hits = [];
  text.split('\n').forEach((line, i) => {
    const code = line.replace(/^\s*-?\s*/, '');
    if (code.startsWith('#')) return;
    const beforeComment = line.split(' #')[0];
    if (GATE_CMD.test(beforeComment) && MASK.test(beforeComment)) hits.push({ line: i + 1, text: line.trim() });
  });
  return hits;
}

test('detector flags masked gate steps and ignores comments', () => {
  const bad = [
    '      - run: pnpm -w run build || true',
    '      - run: pnpm -w run test || true',
    '        run: eslint . || echo "no eslint"',
    '      - run: pnpm -w run coverage:check || :',
  ].join('\n');
  assert.equal(findFailOpen(bad).length, 4);
  const ok = [
    '      # the old step was `pnpm test || true`',
    '      - run: pnpm --filter ./apps/web-site run build',
    '      - run: find . -name lcov.info -exec cp {} coverage-artifacts/ \\; || true',
  ].join('\n');
  assert.deepEqual(findFailOpen(ok), []);
});

test('phase1-ci.yml (fail-open duplicate of ci-matrix and coverage) is removed', () => {
  assert.equal(existsSync(join(wfDir, 'phase1-ci.yml')), false);
});

test('no executed workflow masks a build, test, coverage, lint or typecheck step', () => {
  const files = readdirSync(wfDir).filter((f) => /\.ya?ml$/.test(f));
  assert.ok(files.length > 0, 'no workflow files found');
  const found = [];
  for (const f of files) {
    for (const h of findFailOpen(readFileSync(join(wfDir, f), 'utf8'))) found.push(`${f}:${h.line} ${h.text}`);
  }
  assert.deepEqual(found, []);
});
