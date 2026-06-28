/** @type {import('next').NextConfig} */

// NOTE: next-pwa@5.x forces Next into Babel mode, which is incompatible with the
// Next 13 App Router used here (it breaks transpilation of workspace source
// packages). PWA is disabled for now; re-introduce via a App-Router-compatible
// plugin (e.g. @ducanh2912/next-pwa) when needed. The service worker is still
// registered client-side from app/layout.tsx and pages/_app.tsx.

const nextConfig = {
  reactStrictMode: true,
  images: { domains: ['localhost'] },
  // eslint-config-next is not installed in this workspace; linting runs as a
  // separate CI step, so it should not block the production build.
  eslint: { ignoreDuringBuilds: true },
  // The vitrine consumes several workspace packages as TypeScript source via
  // the @arman/* path mapping; Next must transpile them.
  transpilePackages: [
    '@arman/ui',
    '@arman/ui-components',
    '@arman/ui-tokens',
    '@arman/utils',
    '@arman/state',
    '@arman/async-utils',
    '@arman/http-client',
  ],
};

module.exports = nextConfig;
