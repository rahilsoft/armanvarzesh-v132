# Nightly runbook — 22:00 to 23:00 (Asia/Tehran)

Hard limit: **one hour**. Stop starting new work at 22:40, finish integration by 22:50,
report by 22:55. If the clock says it is past 23:00 Tehran time, report and stop.

## 1. Prepare (≤ 5 min)
0. Start the rtk token filter build **in the background** (≈ 5 min, runs while you plan):
   `command -v rtk || (cargo install --git https://github.com/rtk-ai/rtk --no-default-features --locked --root "$HOME/.local" > /tmp/rtk-build.log 2>&1 &)`
   then use `$HOME/.local/bin/rtk` once it exists (Apache-2.0 edition, no telemetry needed).
   Follow the «Token budget rules» in `CLAUDE.md` for the whole session.
1. `git fetch origin && git checkout develop && git pull --ff-only` (create `develop` from `main` only if it does not exist).
2. Read `CLAUDE.md`, `docs/agents/STATUS.md`, `docs/agents/ROADMAP.md`.
3. `pnpm install --frozen-lockfile --ignore-scripts` (fall back to `pnpm install --ignore-scripts` and note it), then `sh scripts/agents/prisma-generate-offline.sh` (Prisma engine downloads are blocked in the sandbox; this is enough for typecheck and unit tests).

## 2. Plan (≤ 5 min) — coordinator-architect
- Pick the highest-priority unblocked ROADMAP items that fit about 30 minutes of parallel work.
- Choose a model per task (CLAUDE.md «Token budget rules» 6): haiku / sonnet / opus by difficulty.
- Give every agent a non-overlapping file scope. Not every agent must work every night,
  but `security-reviewer` and `qa-test-engineer` run whenever code changed.

## 3. Build (≈ 30 min) — agents in parallel
- Each agent works in its own git worktree on branch `agent/<agent-name>/<short-slug>`
  created from `develop`. If the agent tool does not know the agent type by name, start a
  general-purpose agent and paste the full content of `.claude/agents/<agent-name>.md`
  as its instructions, plus the task and file scope.
- Each agent commits small Conventional Commits and runs typecheck, lint and tests for what it touched.

## 4. Review & integrate (≈ 10 min)
- `security-reviewer` reviews each branch diff. `qa-test-engineer` runs the relevant suites.
- Merge into `develop` only APPROVED + green branches (`git merge --no-ff`), re-run the
  backend gate after merging. Push `develop` and any unmerged agent branches to origin.
- Never push to `main`.

## 5. Report (≤ 5 min)
- Update `docs/agents/STATUS.md`: new session entry (done / in progress / blocked, commands and
  results), gates table, «Secrets needed». Tick verified ROADMAP items. Commit + push `develop`.
- Write the owner report `docs/agents/reports/<YYYY-MM-DD>.md` in Persian (no «؛»): done tonight (verified), decisions taken + why, problems, next night's plan, deploy readiness, anything that needs the owner (secrets, money, legal). Max one screen.
- Send the owner a short Persian notification (≤ 200 chars, no «؛»): what was finished tonight,
  what is next, and whether the project is READY FOR DEPLOY.
- When all gates are green: open a release PR `develop → main` (or write its description in
  STATUS.md if PR creation is unavailable) and tell the owner it is ready to deploy.
