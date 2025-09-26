/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern: ({url}) => url.origin === self.location.origin,
      handler: 'StaleWhileRevalidate',
      options: { cacheName: 'static-resources' },
    },
    {
      urlPattern: ({url}) => url.pathname.startsWith('/api/'),
      handler: 'NetworkFirst',
      options: { cacheName: 'api-cache', networkTimeoutSeconds: 5 },
    },
    {
      urlPattern: ({url}) => /\.(?:png|jpg|jpeg|svg|gif|webp)$/.test(url.pathname),
      handler: 'CacheFirst',
      options: { cacheName: 'images', expiration: { maxEntries: 100, maxAgeSeconds: 7*24*3600 } },
    },
  ],
});

const nextConfig = {
  reactStrictMode: true,
  images: { domains: ['localhost'] },
};

module.exports = withPWA(nextConfig);