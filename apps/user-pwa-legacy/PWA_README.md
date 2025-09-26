# PWA Readiness for @arman/user-pwa
- Added `public/manifest.webmanifest`, `public/icons/*`, and a minimal `public/sw.js`.
- To fully enable PWA in Next.js, ensure in `_document.tsx` or `<Head>`:
  ```html
  <link rel="manifest" href="/manifest.webmanifest"/>
  ```
  and register service worker in a client entry:
  ```js
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js'));
  }
  ```
