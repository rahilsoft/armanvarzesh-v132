# Makefile shortcuts
install:
	pnpm install
dev:
	cd apps/site-web && pnpm dev
test:
	pnpm vitest run
e2e:
	npx playwright test
lint:
	pnpm eslint .
smoke:
	node tools/smoke/smoke.mjs
env-check:
	node tools/env/validate.mjs
