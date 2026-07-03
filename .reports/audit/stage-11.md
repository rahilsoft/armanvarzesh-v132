# Stage 11 — Infrastructure Audit

**Source of truth:** repository only.

---

## Inventory (verified)
- Dockerfiles: **81** named `Dockerfile` (85 incl. variants). **73/81 declare `USER`** (non-root) — 8 run as root.
- Compose: `docker-compose.yml` (12 image/build entries) + `.dev`, `.elite`, `.redis` overlays + `docker-bake.hcl`.
- Kubernetes: `k8s/` (deployments, HPA, ingress, network policies, servicemonitor, canary, external-secrets, secrets).
- Helm: 6 charts (`armanfit`, `armanfit-backend`, `armanfit-admin`, `armanfit-mobile`, `graphql-gateway`, `users-service`).
- Terraform: `infra/terraform/base/` + `modules/rds/`.
- CI: **31** workflows in `.github/workflows/` **plus** a duplicate `workflows/` dir at repo root (6 more).

---

## Findings

### P1-01 — Two workflow directories; CI source of truth ambiguous
**Evidence:** `.github/workflows/` (31 files: `ci-unified.yml`, `ci-matrix.yml`, `full-pipeline.yml`, `phase1-ci.yml`, `release.yml`, `security.yml`, `codeql.yml`, `trivy-scan.yml`, `zap-baseline.yml`, …) **and** a root `workflows/` (`ci.yml`, `security.yml`, `security-trivy.yml`, `release.yml`, `lighthouse.yml`, `dependency-audit.yml`). GitHub only executes `.github/workflows/`; root `workflows/` is dead.
**Why it is a problem:** Multiple overlapping CI pipelines (`ci-unified`, `ci-matrix`, `full-pipeline`, `phase1-ci`) with unclear precedence; the root `workflows/` files are never run but look authoritative.
**Production impact:** Confusion about which gates actually enforce; dead security workflows may create false assurance.
**Recommended fix:** Delete root `workflows/`; consolidate to one CI + one release + security suite.
**Effort:** M. **Risk:** Medium.

### P1-02 — Secrets committed as K8s manifests alongside ExternalSecrets (Stage 05 P2-09)
**Evidence:** `k8s/secrets/*.yaml` plaintext-shaped `Secret` manifests coexist with `k8s/external-secrets/`.
**Why it is a problem:** Anti-pattern; one un-redacted commit leaks all service secrets.
**Recommended fix:** ExternalSecrets/SealedSecrets only.
**Effort:** S. **Risk:** Medium.

### P2-03 — 8 Dockerfiles run as root
**Evidence:** `grep -L USER` over Dockerfiles → 8 without a `USER` directive.
**Why it is a problem:** Container breakout / privilege escalation surface; violates CIS/Pod Security "restricted".
**Production impact:** Larger blast radius on container compromise.
**Recommended fix:** Add non-root `USER` to the remaining 8.
**Effort:** S. **Risk:** Medium.

### P2-04 — Rollback/blue-green/canary only partially present
**Evidence:** Only `k8s/canary/ingress-canary-example.yaml` (an *example*) references canary; no Argo Rollouts / Flagger; no blue-green manifests; no documented rollback automation beyond Helm's implicit rollback. `grep rollback|canary|blue-green` across CI returns essentially nothing actionable.
**Why it is a problem:** No progressive-delivery or automated rollback strategy for a millions-user service.
**Production impact:** Risky big-bang deploys; manual rollback only.
**Recommended fix:** Adopt Argo Rollouts/Flagger with canary + auto-rollback on SLO breach.
**Effort:** L. **Risk:** Medium.

### P2-05 — Compose/K8s/Helm topology may not match the 34-service reality
**Evidence:** `docker-compose.yml` has 12 build/image entries; `k8s/` has ~19 `svc-*.yaml` service manifests; there are 34 `services/*`. Helm covers only 6 charts.
**Why it is a problem:** Not every service is deployable via the committed infra; deployment coverage is partial and inconsistent across compose/k8s/helm.
**Production impact:** Some services have no deploy path; drift between three IaC representations.
**Recommended fix:** Single generated deployment manifest set covering all deployable services.
**Effort:** M. **Risk:** Medium.

---

## Positives (verified)
- Strong CI security surface exists: `codeql.yml`, `trivy-scan.yml`, `grype.yml`, `gitleaks.yml`, `trufflehog.yml`, `zap-baseline.yml`, `sbom.yml`.
- **90%** of Dockerfiles are non-root.
- Terraform for RDS; NetworkPolicies; ServiceMonitor; HPA present.
- Observability stack: `grafana/`, `observability/`, `otel-config.yaml`, OTEL registration in services.

## Stage score: **55/100** (DevOps/Infra)
Good tooling breadth; undermined by duplicated CI dirs, committed secret manifests, and partial deploy coverage.
