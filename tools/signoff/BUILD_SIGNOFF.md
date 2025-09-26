# Final Build Sign-off

## Must-pass gates
- Monorepo build green: `pnpm -r run build`
- Typecheck: `pnpm -r run typecheck`
- Unit tests: `pnpm -r run test` (tolerant until coverage raised)
- Budgets check (web apps): `pnpm -r --filter './app/*' run perf:enforce`
- Security gates: CodeQL + Dependency Audit
- SBOM + Signed images (if CD configured)
