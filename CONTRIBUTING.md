# Contributing

## Workflow
- Create a branch from `main`: `feat/*`, `fix/*`, `chore/*`.
- Write Conventional Commits: `feat: ...`, `fix: ...`.
- Open PR; Required checks must pass: typecheck, lint, tests, coverage threshold, security scans, codeql, lighthouse (webs).

## Development
- Node 20.x, pnpm 9.x
- `pnpm -r typecheck` / `pnpm -r lint` / `pnpm -r test`

## Code Style & Quality
- TypeScript **strict** is enforced across the repo.
- ESLint root config is required; no warnings allowed in CI.
- Avoid `any`; prefer explicit types and Zod/DTO for validation.

## Security
- No real secrets in repo or tests.
- CORS limited via `CORS_ORIGIN` env; JWT via `JWT_SECRET` with rotation and `kid` (see ADR).

## Releases
- CI automates releases via Release Please. Use conventional commit messages.
