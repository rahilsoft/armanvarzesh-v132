# Stage 01 — Repository Health

**Audit date:** 2026-07-03
**Auditor role:** Independent Production Readiness Auditor
**Source of truth:** repository only. Every claim below is backed by an on-disk path.

---

## Topology (verified)

- Package manager: `pnpm@10.0.0` (`package.json` line 5), monorepo.
- Workspace globs (`pnpm-workspace.yaml`): `app/*`, `apps/web-site`, `apps/admin-web`, `apps/mobile-user`, `packages/*`, `packages/*/*`, `services/*`.
- Repo working-tree size: **37 MB** (`du -sh .`).
- `node_modules` **not** committed (verified: no `node_modules` directory on disk outside `.git`). GOOD.
- Largest tracked file: `pnpm-lock.yaml` (**1.36 MB**, 1,364,851 bytes). Only tracked file > 1 MB. GOOD.
- TypeScript source: **1,909** `.ts` + **508** `.tsx` files.
- `package.json` files: **78**.
- Microservices under `services/`: **34** directories.
- Additional backend surfaces under `app/`: `backend`, `bff`, `gateway`, `media-worker`, plus 5 subgraphs (`activity`, `social`, `physio`, `live`) and `android`/`ios`.

---

## Findings

### P2-01 — Two parallel, overlapping backend topologies (`app/` and `services/`)
**Evidence:** `app/backend/` is a NestJS monolith exposing `auth`, `payments`, `courses`, `nutrition`, `medical`, `chat`, `notifications`, etc. (`ls app/backend/src`), while `services/` contains 34 standalone microservices for the *same* domains (`auth-service`, `payments-service`, `courses-service`, `nutrition-service`, `medical-service`, `chat-service`, `notifications-service`, …).
**Why it is a problem:** Two competing implementations of the same bounded contexts. Impossible to tell from the repo which is the deployment target. Doubles maintenance and security surface; a fix applied in one is silently missing in the other (confirmed in Stage 05 — auth is hardened in `services/auth-service` but bypassable in `services/content-service`).
**Production impact:** Divergent behavior, duplicated bugs, ambiguous deploy artifact.
**Recommended fix:** Pick one topology; delete or archive the other. Document in an ADR.
**Effort:** L (weeks). **Risk:** High.

### P2-02 — Massive root-level documentation/report sprawl
**Evidence (root):** `COMPREHENSIVE_AUDIT_REPORT_45_PHASES.md` (35 KB), `audit_report.md` (25 KB), `restructure-report.json` (**120 KB**), `merge-report.json`, `report.json`, `MONOREPO_MAP.json` (16 KB), plus 14 `CHANGES_*.md` / `STEP*_*.md` / `SECURITY_*` / `PHASE_*` markdown files, `GUZARESH-NAHAEI.md`, `V133_RC1_RELEASE_NOTES.md`, and duplicate READMEs (`README.md`, `README.txt`, `README-DEVEX.md`, `README-codemagic.md`).
**Why it is a problem:** These are stale generated audit artifacts committed to the repo root. `restructure-report.json` alone is 120 KB. The task brief explicitly says *never trust previous reports* — their presence is noise and invites confusion.
**Production impact:** None runtime; hurts maintainability and repository legibility.
**Recommended fix:** Move to `docs/history/` or delete. Keep one canonical README.
**Effort:** S. **Risk:** Low.

### P2-03 — Duplicate / conflicting tool configs at root
**Evidence:** Three ESLint legacy configs **plus** a flat config coexist: `.eslintrc.cjs`, `.eslintrc.js`, `.eslintrc.json`, `eslint.config.js`. Two Prettier configs: `.prettierrc`, `.prettierrc.json`. Five Lighthouse configs: `lighthouserc.base.json`, `.js`, `.json`, `.main.json`, `.pr.json`. Multiple Jest configs: `jest.config.base.js`, `jest.config.ts`, `jest.preset.base.ts`, `jest.preset.js`, `jest.backend.config.cjs`.
**Why it is a problem:** ESLint resolves exactly one config; having `.eslintrc.*` **and** `eslint.config.js` is undefined behavior across ESLint versions and commonly means lint silently runs a different ruleset than intended.
**Production impact:** Lint/format gates may be a no-op — false confidence in CI.
**Recommended fix:** Consolidate to one ESLint (flat) + one Prettier config.
**Effort:** S. **Risk:** Medium (gate may be ineffective today).

### P3-04 — Stray/experimental gitignore and duplicate ignore files
**Evidence:** `.gitignore.prev-round` (tracked), `gitleaks.toml` **and** `.gitleaks.toml` (two copies), `.eslintignore` + `.prettierignore` + `.dockerignore` all present. `.gitignore` itself contains duplicated blocks (`.env` / `.env.*` appear twice, lines under "Environment & Secrets" and again under "Phase0 audit hardening").
**Why it is a problem:** Redundant, drift-prone. `.gitignore.prev-round` is a leftover.
**Production impact:** None runtime. Housekeeping.
**Recommended fix:** Delete `.gitignore.prev-round`, de-dupe.
**Effort:** S. **Risk:** Low.

### P3-05 — Committed HTML/coverage stub
**Evidence:** `COVERAGE.html` (76 bytes) tracked at root; `reports/`, `coverage/`, `artifacts/` are gitignored but `COVERAGE.html` slipped in.
**Recommended fix:** Remove.
**Effort:** S. **Risk:** Low.

---

## Positives
- No `node_modules`, `dist/`, `.next/`, build artifacts, or large binaries committed.
- `.gitignore` is comprehensive for env/secret/artifact classes.
- Working tree clean (`git status --short` empty).

## Stage score: **62/100** (Repository Health)
Clean of build-artifact leakage, but heavy documentation debris and duplicate-config ambiguity that can neuter CI gates.
