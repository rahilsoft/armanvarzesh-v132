# Release Notes — Phase 4 (Realtime Notifications in User App)
Date: 2025-08-19

## Mobile (user-app)
- Apollo Client upgraded to support subscriptions via graphql-ws
- New subscription: `notificationReceived`
- Notifications screen now queries initial list + live-updates in real-time

## Backend
- Ensure GraphQL WS is enabled (see Phase 2 notes)

## Env (Expo)
- `EXPO_PUBLIC_GRAPHQL_HTTP` (default: http://localhost:4000/graphql)
- `EXPO_PUBLIC_GRAPHQL_WS` (default: ws://localhost:4000/graphql)
