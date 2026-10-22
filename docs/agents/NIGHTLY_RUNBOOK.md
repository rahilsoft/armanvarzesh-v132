# Nightly runbook — 22:00 to 00:00 (Asia/Tehran)

**Owner plan 2026-10-22 (supersedes the cadence below):** two work packages per day, at 10:02 and 22:02 Tehran, each at most 60 minutes. Check the quota before and after each package and apply the rules in CLAUDE.md «Quota budget». The rest of this runbook describes the content of a package.

Hard limit: **two hours** (owner instruction 2026-10-21, replaces the 21:00–24:00 window of 2026-10-20).
Work in rounds of plan → build → review → merge (about 30–45 min each, 2 rounds per night). Stop
starting new build work at 23:15, finish review + integration sweep by 23:45, report by 23:55. If
the clock says it is past 00:00 Tehran time when the shift starts, report and stop.

## 1. Prepare (≤ 5 min)
0. Start the rtk token filter build **in the background** (≈ 5 min, runs while you plan):
   `command -v rtk || (cargo install --git https://github.com/rtk-ai/rtk --no-default-features --locked --root "$HOME/.local" > /tmp/rtk-build.log 2>&1 &)`
   then use `$HOME/.local/bin/rtk` once it exists (Apache-2.0 edition, no telemetry needed).
   Follow the «Token budget rules» in `CLAUDE.md` for the whole session.
1. `git fetch origin && git checkout develop && git pull --ff-only` (create `develop` from `main` only if it does not exist).
2. Read `CLAUDE.md`, `docs/agents/COLLABORATION_GPT.md`, `docs/agents/STATUS.md`, `docs/agents/ROADMAP.md`.
2b. **GPT findings first:** read the latest comment and all open `REV-…` findings in the issue
   `Independent technical review — GPT / Claude handoff`. Reply on the issue to each one: accepted + plan,
   fixed + commit + test result, rejected + evidence, or blocked + blocker + action. Confirmed P0/P1
   findings are this shift's first tasks.
3. `pnpm install --frozen-lockfile --ignore-scripts` (fall back to `pnpm install --ignore-scripts` and note it), then `sh scripts/agents/prisma-generate-offline.sh` (Prisma engine downloads are blocked in the sandbox; this is enough for typecheck and unit tests).

## 2. Plan (≤ 5 min) — coordinator-architect
- Pick the highest-priority unblocked ROADMAP items that fit one round (about 45 minutes of parallel work), then plan the next round after merging.
- Choose a model per task (CLAUDE.md «Token budget rules» 6): haiku / sonnet / opus by difficulty.
- Give every agent a non-overlapping file scope. Not every agent must work every night,
  but `security-reviewer` and `qa-test-engineer` run whenever code changed.

## 3. Build (≈ 45 min per round) — agents in parallel
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

## 4b. Integration sweep (every shift) — `qa-test-engineer` (integration owner)
Follow CLAUDE.md «Integration». List every open PR (`mcp__github__list_pull_requests`), check
draft state, reviews, required checks, mergeability and dependencies between PRs. Decide merge
order (security/backend fixes first, then `develop → main` release when develop is green, then
safe dependency bumps one by one). Fix what is fixable, merge what is ready without bypassing
branch protection, then check CI on the target branch. Record each PR as merged / blocked
(number, exact blocker, action needed) in STATUS.md «Integration». «PR created» is not done.

## 5. Report (≤ 5 min)
- Update `docs/agents/STATUS.md`: new session entry (done / in progress / blocked, commands and
  results), gates table, «Secrets needed». Tick verified ROADMAP items. Commit + push `develop`.
- Write the handoff report `docs/agents/reports/<YYYY-MM-DD>.md` (date = shift START date) in Persian (no «؛»), pushed before 23:55 for the 00:05 GPT review. It must contain: final SHAs of `develop` and `main`, merged / open / blocked PRs with reasons, features completed and still incomplete, test commands with real results, skipped / not-run tests and why, link to the CI run of the delivered SHA, known issues, DB changes (migrations), configuration needs, replies given to GPT findings, decisions + why, next shift plan, deploy readiness, owner-only items (secrets, money, legal). Do not ask the owner questions.
- Send the owner a short Persian notification (≤ 200 chars, no «؛»): what was finished tonight,
  what is next, and whether the project is READY FOR DEPLOY.
- Integration result: list merged PRs and blocked PRs with blocker + action in the owner report.
- When all gates are green: tell the owner it is ready to deploy with the `develop` and `main` commits.
