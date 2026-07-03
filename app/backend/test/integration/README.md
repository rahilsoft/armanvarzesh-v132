# Integration layer (DB-backed)

Suites here run against a real PostgreSQL (`DATABASE_URL`) — Prisma queries,
migrations, transactional behaviour. No HTTP; that's `test/e2e/`.

Currently empty by design: the first suites land with the CI runtime-validation
workstream (G2 gate in `.reports/architecture/BASELINE-v0.3/RETIREMENT-MATRIX.md`),
which proves each folded domain against real Postgres before its DEPRECATED
service is physically retired. `npm run test:integration` uses
`--passWithNoTests` until then.
