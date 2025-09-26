# Auth Integration (Phase 4)
1) Import `AuthModule` in `AppModule`.
2) Protect routes with `@UseGuards(JwtAuthGuard)`.
3) Set `JWT_SECRET` (or `ADMIN_JWT_SECRET`) in env.
