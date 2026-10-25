#!/usr/bin/env node
// PostToolUse: fast lint/syntax check of files changed since the last check.
// Change detection uses git state, not the tool name, so edits made through
// Bash (sed -i, redirects, codegen), subagents or commits are covered too.
// Exit 2 = the failure goes back to Claude as feedback (the tool already ran).
import path from 'node:path';
import {
  expand, gitTop, loadConfig, loadState, packageFor, readInput, relTo, run, saveState,
  sessionChanges, stateDir, withLock,
} from './lib.mjs';

function main() {
  const input = readInput();
  const top = gitTop(input);
  if (!top) return 0;
  const config = loadConfig();
  const dir = stateDir(top);
  const failures = [];
  withLock(dir, () => {
    const state = loadState(dir, input.session_id);
    state.quick ||= {};
    const changes = sessionChanges(top, state, config);
    const pending = changes.filter((c) => c.fp !== 'deleted' && c.fp !== 'dir' && state.quick[c.path]?.fp !== c.fp);
    const byPkg = new Map();
    for (const c of pending) {
      const pkg = packageFor(c.path, config);
      if (!pkg || !new RegExp(pkg.match).test(c.path)) {
        state.quick[c.path] = { fp: c.fp, ok: null };
        continue;
      }
      if (!byPkg.has(pkg)) byPkg.set(pkg, []);
      byPkg.get(pkg).push(c);
    }
    for (const [pkg, items] of byPkg) {
      const files = items.map((c) => relTo(pkg.root, c.path));
      let ok = true;
      for (const tmpl of pkg.quick || []) {
        for (const cmd of expand(tmpl, files)) {
          const r = run(cmd, path.join(top, pkg.root), Math.min(config.commandTimeoutSec || 120, 120));
          if (r.timedOut) {
            // Not a pass: the stop gate re-runs the full checks.
            failures.push(`[${pkg.name}] timed out (not verified): ${cmd}`);
            ok = false;
          } else if (r.code !== 0) {
            failures.push(`[${pkg.name}] exit ${r.code}: ${cmd}\n${r.tail}`);
            ok = false;
          }
        }
      }
      for (const c of items) state.quick[c.path] = { fp: c.fp, ok };
    }
    saveState(dir, input.session_id, state);
  });
  if (failures.length) {
    process.stderr.write(
      `Post-edit check FAILED on files changed in this session. Fix before continuing:\n${failures.join('\n\n')}\n`,
    );
    return 2;
  }
  return 0;
}

try {
  process.exitCode = main();
} catch (e) {
  // Non-blocking: the stop gate repeats every check, so a broken quick check
  // cannot turn into a reported success.
  process.stderr.write(`post-tool-check internal error: ${e?.stack || e}\n`);
  process.exitCode = 1;
}
