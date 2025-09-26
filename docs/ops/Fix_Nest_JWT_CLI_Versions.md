
# Fix: @nestjs/jwt and @nestjs/cli versions

CI failed with errors similar to:
- `ERR_PNPM_NO_MATCHING_VERSION No matching version found for @nestjs/jwt@^10.3.2`
- `ERR_PNPM_NO_OFFLINE_META Failed to resolve @nestjs/cli@>=10.3.2 <11.0.0-0`

**What changed**
- Bumped `@nestjs/jwt` to `^11.0.0`.
- Bumped `@nestjs/cli` to `^11.0.0`.
- Enforced via root `pnpm.overrides` so workspace resolves consistently.
- CI guard updated to validate these versions.

> If you prefer to stay on Nest 10-compatible plugins, adjust versions and overrides accordingly and regenerate the lockfile.
