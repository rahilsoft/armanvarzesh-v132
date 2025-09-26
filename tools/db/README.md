# DB Migrations (Phase 1)

This monorepo uses **Prisma**. We provided two helper scripts:

- `tools/db/migrate-all.sh`: runs `prisma generate` and `prisma migrate deploy` for all detected `schema.prisma` files.
- `tools/db/seed-all.sh`: placeholder. Add per-service Prisma seed (e.g. `prisma/seed.ts`) and wire via package.json.

## Usage

```bash
chmod +x tools/db/migrate-all.sh tools/db/seed-all.sh
./tools/db/migrate-all.sh
./tools/db/seed-all.sh
```

## CI Integration

Add a step before app rollout:

```yaml
- name: DB Migrate (deploy)
  run: |
    chmod +x tools/db/migrate-all.sh
    ./tools/db/migrate-all.sh
```
