# ⚠️ DEPRECATED — superseded by the modular monolith

The canonical **Orders/Marketplace** capability lives in the modular monolith
at `app/backend/src/marketplace` (`MarketplaceModule`, wired in `app.module`),
per `.reports/architecture/DOMAIN-OWNERSHIP.md` and
`.reports/architecture/PHASE-4-MARKETPLACE-MIGRATION.md`.

This service was an **in-memory stub with no Prisma schema**. Its `Item`
concept folded into the canonical `Marketplace` model (+`type`/`createdBy`,
migration `20260702000010`); its `Purchase` concept is intentionally NOT a
new model — purchases go through the canonical Payments `Product`/`Order`
flow. Retirement gated (**MARKETPLACE-RETIRE**). Do not add features here.
