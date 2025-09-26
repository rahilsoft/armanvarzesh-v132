
# Version Hardening (Nest packages)

To prevent Codemagic from failing with `ERR_PNPM_NO_MATCHING_VERSION`:
- We fixed explicit versions where needed:
  - `@nestjs/config` → `^4.0.2`
  - `@nestjs/passport` → `^11.0.5`
- Root `package.json` now contains `pnpm.overrides` enforcing those versions for the whole workspace.
- CI helper: `scripts/ci/check-nest-versions.js` — run it in CI to ensure no future PR introduces wrong ranges.

## Run check locally
```bash
node scripts/ci/check-nest-versions.js
```
