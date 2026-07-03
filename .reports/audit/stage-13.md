# Stage 13 — Dependency Audit

**Source of truth:** repository only.

---

## Findings

### P1-01 — Lockfile authenticity is self-declared as fake
**Evidence:** `LOCKFILE_NOTE.txt` states verbatim: *"This is NOT a real pnpm-lock.yaml. In this offline environment … generating a real lockfile is impossible. ACTION REQUIRED … Then commit the generated pnpm-lock.yaml."* Meanwhile `pnpm-lock.yaml` exists at 1.36 MB.
**Why it is a problem:** Either the note is stale (lockfile is real) or the 1.36 MB lockfile is not a faithfully-resolved lock. Per audit rules I cannot trust the note *or* assume the lock is valid — this is **NOT VERIFIED** and must be treated as a supply-chain integrity gap. A non-authoritative lockfile means `--frozen-lockfile` installs are unreliable and builds are not reproducible.
**Production impact:** Non-reproducible builds; unpinned transitive deps; supply-chain drift.
**Recommended fix:** Regenerate `pnpm-lock.yaml` with network access, verify `--frozen-lockfile` passes in CI, delete `LOCKFILE_NOTE.txt`.
**Effort:** S. **Risk:** High.

### P1-02 — Major-version conflict: NestJS 10 declared, 11 force-overridden
**Evidence:** `package.json` `pnpm.overrides` forces `@nestjs/common/core/platform-express = 11.1.4`, `@nestjs/graphql = 13.1.0`, `@nestjs/apollo = 13.1.0`. But individual services declare `"@nestjs/core": "^10.3.0"`, `"^10.3.10"`, `"^10.3.2"`, `"^10.4.0"` (multiple distinct 10.x specs across services).
**Why it is a problem:** Code written/typed against NestJS 10 is force-resolved to NestJS 11 at install. NestJS 10→11 has breaking changes (Express 5, RxJS, decorator metadata). Type-checking against 10 while running 11 causes latent runtime failures the compiler won't catch.
**Production impact:** Runtime incompatibilities not caught at build; fragile upgrades.
**Recommended fix:** Align all service manifests to `^11`; remove version skew.
**Effort:** M. **Risk:** High.

### P2-03 — 35 forced `pnpm.overrides` mask underlying conflicts
**Evidence:** `package.json` `pnpm.overrides` has ~35 pins (`@nestjs/*`, `graphql`, `prisma`, `jest`, `typescript`, `eslint`, `jsonwebtoken`, `express-rate-limit`, `helmet`, `compression`, …).
**Why it is a problem:** A large override block is a smell that the dependency graph has genuine conflicts being papered over. Overrides silence peer-dependency warnings that may indicate real incompatibilities.
**Production impact:** Hidden incompatibilities; harder upgrades.
**Recommended fix:** Reconcile declared versions so overrides shrink to a minimum.
**Effort:** M. **Risk:** Medium.

### P2-04 — Deprecated/ancient `node-fetch@^1.0.0`
**Evidence:** `services/content-service/package.json:62` (Stage 03 P2-03). `node-fetch@1.x` (2016) is EOL with known CVEs.
**Recommended fix:** Native `fetch` or `node-fetch@3`.
**Effort:** S. **Risk:** Medium.

### P2-05 — Duplicate dependency-automation configs
**Evidence:** `dependabot.yml` (root) **and** `.github/dependabot.yml` **and** `renovate.json` all present. Only `.github/dependabot.yml` and `renovate.json` are honored; root `dependabot.yml` is dead. Running both Dependabot and Renovate causes duplicate PRs.
**Recommended fix:** Pick one; delete the others.
**Effort:** S. **Risk:** Low.

### P3-06 — MIT LICENSE has empty copyright holder
**Evidence:** `LICENSE` → `Copyright (c)` (no name/year).
**Why it is a problem:** Legally incomplete license notice.
**Recommended fix:** Fill holder + year.
**Effort:** S. **Risk:** Low.

---

## Positives (verified)
- Central version pinning for security-critical libs (`jsonwebtoken>=9`, `helmet ^7.1`, `prisma 5.22`).
- SBOM tooling wired (`sbom` scripts, `sbom.yml` workflow, `@cyclonedx/cyclonedx-npm`).
- `pnpm audit` scripts + Trivy/Grype/gitleaks/trufflehog workflows.

## Stage score: **44/100** (Dependencies)
Lockfile authenticity + NestJS 10/11 skew are the dominant risks.
