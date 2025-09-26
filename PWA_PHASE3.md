# PWA Readiness (Phase 3)

This app is configured with **next-pwa**:
- `public/manifest.json` with icons (maskable).
- `next.config.js` integrates next-pwa with sensible runtime caching.
- Offline page at `pages/_offline.tsx` (pages router).
- Lighthouse CI budget enforces PWA score ≥ 0.9 (see `lighthouserc.js`).

## Dev
```
pnpm dev
```

## Build
```
pnpm build && pnpm start
```

## Notes
- Adjust `images.domains` in `next.config.js` for production domains.
- Replace placeholder icons with branded assets.
