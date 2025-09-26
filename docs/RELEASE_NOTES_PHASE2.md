# Release Notes — Phase 2 (Vitrin SEO/Schema + Notifications Subscriptions)
Date: 2025-08-19

## Vitrin
- App Router layout with SEO metadata, OpenGraph & Twitter cards
- Organization & FAQ JSON-LD
- Pages: /pricing, /faq, /about, /contact
- Dynamic sitemap/robots
- Placeholder OG/Logo assets (replace in /public)

## Backend
- GraphQL subscriptions enabled via `graphql-ws`
- Notifications module wired with PubSub and `notificationReceived` subscription

## Next
- Add animated narrative sections and image optimization (WebP/AVIF)
- Integrate media-worker for transcoding & signed URLs
