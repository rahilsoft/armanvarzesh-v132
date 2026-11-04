// Counts tests that really executed in a node --test TAP report (CI gate for claude-hooks).
// A file with no tests shows up as a passing top-level entry named after the file, and
// skipped or TODO tests are reported as "ok", so "# tests N" alone proves nothing.
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

export function tapExecuted(tap) {
  let executed = 0;
  const emptyFiles = [];
  for (const line of tap.split('\n')) {
    const m = /^(not ok|ok) \d+ - (.*)$/.exec(line);
    if (!m) continue;
    const name = m[2];
    if (/#\s*(SKIP|TODO)\b/i.test(name)) continue;
    if (/\.test\.m?js$/.test(name.trim())) {
      emptyFiles.push(name.trim());
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
