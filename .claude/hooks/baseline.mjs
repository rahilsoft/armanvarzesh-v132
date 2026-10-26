#!/usr/bin/env node
// SessionStart / SubagentStart: record the baseline before the first tool runs.
import { ensureBaseline, gitTop, loadState, readInput, saveState, stateDir, withLock } from './lib.mjs';

try {
  const input = readInput();
  const top = gitTop(input);
  if (top) {
    const dir = stateDir(top);
    withLock(dir, () => {
      const state = loadState(dir, input.session_id);
      if (ensureBaseline(top, state)) saveState(dir, input.session_id, state);
    });
  }
} catch (e) {
  process.stderr.write(`baseline internal error: ${e?.message || e}\n`);
}
