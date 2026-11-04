// Counts tests that really executed in a node --test TAP report (CI gate for claude-hooks).
// A file with no tests shows up as a passing top-level entry named after the file, and
// skipped or TODO tests are reported as "ok", so "# tests N" alone proves nothing.
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

export function tapExecuted(tap) {
  // Test points at any depth. A describe() suite is reported as its own passing point with
  // `type: 'suite'` in its YAML block, so suites are skipped and only real tests count.
  let executed = 0;
  const emptyFiles = [];
  const lines = tap.split('\n');
  for (let i = 0; i < lines.length; i += 1) {
    const m = /^(\s*)(not ok|ok) \d+ - (.*)$/.exec(lines[i]);
    if (!m) continue;
    const name = m[3].trim();
    let type = 'test';
    if (/^\s*---\s*$/.test(lines[i + 1] || '')) {
      for (let j = i + 2; j < lines.length && !/^\s*\.\.\.\s*$/.test(lines[j]); j += 1) {
        const t = /^\s*type:\s*'?(\w+)'?/.exec(lines[j]);
        if (t) type = t[1];
      }
    }
    if (type === 'suite') continue;
    if (/#\s*(SKIP|TODO)\b/i.test(name)) continue;
    if (!m[1] && /\.test\.m?js$/.test(name)) {
      emptyFiles.push(name);
      continue;
    }
    executed += 1;
  }
  return { executed, emptyFiles };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { executed, emptyFiles } = tapExecuted(fs.readFileSync(process.argv[2], 'utf8'));
  if (emptyFiles.length) {
    console.log(`::error::test file(s) with no executed test or a load error: ${emptyFiles.join(', ')}`);
    process.exit(1);
  }
  if (executed <= 0) {
    console.log('::error::0 hook tests executed (skipped and TODO tests do not count)');
    process.exit(1);
  }
  console.log(`executed hook tests: ${executed}`);
}
