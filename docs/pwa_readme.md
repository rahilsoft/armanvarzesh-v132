
# PWA Activation Notes

## vitrin-site (Next.js)
- Added `next-pwa` and wrapped Next config with `withPWA({ dest: 'public', register: true, skipWaiting: true })`.
- Ensure to run: `pnpm -w -C app/vitrin-site install && pnpm -w -C app/vitrin-site build`.
- Lighthouse should now detect installable PWA (manifest + SW).

## admin (Vite)
- Added `vite-plugin-pwa` with `registerType: 'autoUpdate'` and Workbox runtime caching.
- Build with: `pnpm -w -C app/armanfit-admin build` (plugin generates service worker).

## Mobile (EAS)
- Workflow `.github/workflows/eas-build-multi.yml` added. Set `EXPO_TOKEN` in repo secrets and run workflow.
