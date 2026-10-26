# Claude Code hooks: automatic feedback and the stop gate

Registered in `.claude/settings.json` (project scope, applies to every Claude Code session and
subagent in this repo). Event names, input fields, exit codes and JSON output follow the
official reference for the installed Claude Code (2.1.310, checked 2026-10-25):
https://code.claude.com/docs/en/hooks and https://code.claude.com/docs/en/hooks-guide

| Hook | Event / matcher | What it does | On failure |
|---|---|---|---|
| `pre-tool-guard.mjs` | PreToolUse `Bash\|Edit\|Write\|MultiEdit\|NotebookEdit`, 10 s | Denies destructive operations that are never part of an agent mission (force push, push to `main`, `git reset --hard`, `git clean`, discarding all changes, `--no-verify`, `prisma migrate reset`, destructive SQL, `rm -rf /`, `curl \| sh`, writing `.env` / keys / `.git/`, hand edits of `pnpm-lock.yaml`). Asks a human before control files change: `.claude/settings*.json`, `.claude/hooks/**`, `.github/workflows/**`, `CODEOWNERS`, through Edit/Write or the shell. | `onFailure: block` |
| `post-tool-check.mjs` | PostToolUse `Bash\|Edit\|Write\|MultiEdit\|NotebookEdit\|Agent\|Task`, 600 s | Finds files this session changed from git state (worktree, index, commits since the session baseline, untracked), so shell edits, codegen, subagents and commits are covered, not only Edit/Write. Runs the cheap `quick` check (eslint or `node --check`) only on files whose content changed since the last check. Exit 2 sends the error back to Claude. | non-blocking, the stop gate repeats the checks |
| `stop-gate.mjs` | Stop and SubagentStop, 3600 s | For every package with changed files runs `full` (typecheck, lint) and the related tests. PASS → stop. FAIL → blocked unless the final message contains a line `CHECKS: FAILED`. NOT_RUN (timeout, tool missing, 0 tests executed, unreadable counts, code outside any configured package) → blocked unless it contains `CHECKS: NOT RUN` or `CHECKS: FAILED`. Persian markers `کنترل‌ها: ناموفق` and `کنترل‌ها: اجرا نشد` also count. Report: `.claude/.hook-state/gate-report.md`. | internal errors become NOT_RUN, never PASS |

Checks per package live in `checks.json` (`quick`, `full`, `tests`). Commands call the tools
directly (`pnpm exec eslint`, `pnpm exec tsc`) instead of package scripts that mask failures.

## Guarantees and limits
- **No false success.** The gate never allows a stop after failing or unrun checks unless the
  final message says so with the marker, and a declared `NOT RUN` does not excuse a real
  `FAIL`. Zero executed tests is NOT_RUN, never PASS (node:test counts a file without tests as
  one passing test, the gate subtracts it).
- **Honest environment problems are not blocked.** Declaring the failure ends the turn.
- **No silent override.** The gate keeps blocking an unverified stop, however many times. The exit
  is an honest final message with `CHECKS: FAILED` or `CHECKS: NOT RUN` that does not also claim
  the checks pass (a declaration next to a success claim is rejected).
- **Baseline before the first tool.** `baseline.mjs` (SessionStart, SubagentStart) and the
  PreToolUse guard record HEAD and pre-existing dirty files before any tool runs, so the
  session's first edit is checked. `.claude/.hook-state` is deny-listed for agents.
- **Cost.** Change detection is two git commands (~50 ms). Quick checks run only for changed
  files. Full checks run at stop and are cached per package for identical file contents.
- **Concurrency.** Parallel hook runs serialize on `.claude/.hook-state/lock` (stale after 15 min).
- **Other people's work.** Files already dirty when the session started are recorded in the
  baseline and are not attributed to the agent unless their content changes again.
- **Limits.** The guard is pattern based and can be evaded by an obfuscated command, so it is
  defense in depth next to permissions and branch protection, not a sandbox. Remote writes
  through MCP (for example GitHub `create_or_update_file`) do not touch local files and are not
  seen by the post-edit check or the gate, CI is the control there. Checking out another branch
  inside a session makes the whole branch diff count as session changes.

## Tests
`node --test --test-reporter=tap .claude/hooks/tests/*.test.mjs` runs the real hook processes
against throwaway git repos (injected error caught and fed back, false success blocked, honest
failure allowed, committed changes still checked, zero tests, timeout, cache, lock).
CI runs the same command in the `claude-hooks` job of `backend-e2e.yml`.

Known limit: while checks are FAIL or NOT_RUN, any success-sounding word in the final message (pass, green, works, fixed, ready) blocks the stop unless tightly negated, so a partial report such as «lint passes, typecheck fails» may need rewording.
