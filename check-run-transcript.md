# Check-Run Transcript (condensed)
- pnpm -r exec -- node -e "/* scan packages */"
- pnpm -r typecheck
- pnpm -r lint
- pnpm -r test -- --coverage
- pnpm -r build --no-cache
- cyclonedx-npm --output artifacts/sbom.json
- gitleaks detect
- trivy image <images>
- lighthouse-ci autorun --collect.url=https://localhost:3000

Note: In this environment, tools were not executed; CI must run these commands and attach real outputs.
