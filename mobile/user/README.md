# ArmanVarzesh - User Mobile App

React Native mobile application for ArmanVarzesh users (athletes/clients) built with Expo.

## Features

- 🔐 **Authentication**: Login, Register, Biometric (Face ID/Touch ID)
- 💪 **Workouts**: View and track workout plans, log exercises
- 🥗 **Nutrition**: Track meals, calories, and macros
- 💬 **Chat**: Real-time messaging with coaches via WebSocket
- 📊 **Progress**: Track body metrics, photos, and achievements
- 📅 **Calendar**: Schedule and view upcoming sessions
- 🔔 **Notifications**: Push notifications for reminders and messages
- 🌙 **Dark Mode**: Automatic/manual theme switching
- 🌐 **i18n**: Persian and English language support

## Tech Stack

- **Framework**: Expo SDK 52 + React Native 0.76
- **Navigation**: React Navigation (Native Stack + Bottom Tabs)
- **State Management**: Zustand
- **API Client**: Apollo Client (GraphQL) + Axios (REST)
- **Real-time**: Socket.IO for chat and live updates
- **Video**: LiveKit for video calls with coaches
- **Forms**: React Hook Form + Zod validation
- **i18n**: i18next + react-i18next
- **Storage**: Expo SecureStore + AsyncStorage
- **Biometric**: Expo Local Authentication
- **Notifications**: Expo Notifications

## Project Structure

```
mobile/user/
├── App.tsx                 # Main app entry
├── src/
│   ├── config/            # Configuration (env, theme, i18n)
│   ├── services/          # API clients and services
│   │   ├── auth.service.ts
│   │   ├── apollo.client.ts
│   │   ├── socket.service.ts
│   │   └── notification.service.ts
│   ├── store/             # Zustand stores
│   │   ├── auth.store.ts
│   │   ├── workout.store.ts
│   │   ├── chat.store.ts
│   │   └── settings.store.ts
│   ├── components/        # Reusable UI components
│   ├── screens/           # App screens
│   └── utils/             # Utility functions
├── assets/                # Images, fonts, etc.
└── package.json
```

## Scripts

| Script | Description |
|--------|-------------|
| `start` | Start Expo development server |
| `android` | Run on Android device/emulator |
| `ios` | Run on iOS device/simulator |
| `web` | Run on web browser |
| `build` | Build for production |
| `build:android` | Build Android app via EAS |
| `build:ios` | Build iOS app via EAS |
| `lint` | Run ESLint |
| `typecheck` | Run TypeScript compiler |
| `test` | Run tests |

## Development

### Prerequisites

- Node.js 20+
- pnpm 10+
- Expo CLI (`npm install -g expo-cli`)
- EAS CLI (`npm install -g eas-cli`)
- iOS Simulator (macOS only) or Android Studio

### Setup

1. Install dependencies:
```bash
pnpm install
```

2. Copy environment file:
```bash
cp .env.example .env
```

3. Update `.env` with your API URLs

4. Start development server:
```bash
pnpm start
```

5. Run on device:
```bash
# iOS
pnpm ios

# Android
pnpm android
```

## Environment Variables

See `.env.example` for required variables:

- `API_URL` - REST API base URL
- `GRAPHQL_URL` - GraphQL endpoint
- `WS_URL` - WebSocket server URL
- `LIVEKIT_URL` - LiveKit server URL

## Building

### Development Build

```bash
eas build --profile development --platform ios
```

### Production Build

```bash
# iOS
eas build --profile production --platform ios

# Android
eas build --profile production --platform android
```

## Authentication

The app supports multiple authentication methods:

1. **Email/Password**: Standard login
2. **Biometric**: Face ID (iOS) / Fingerprint (Android)
3. **JWT Tokens**: Access + Refresh tokens with automatic refresh
4. **Token Revocation**: Logout from current device or all devices

## State Management

Using Zustand for global state:

- **Auth Store**: User authentication state
- **Workout Store**: Workout plans and tracking
- **Chat Store**: Messages and real-time chat
- **Settings Store**: App settings (theme, language, notifications)

## Security

- Secure token storage using Expo SecureStore
- Biometric authentication
- JWT with automatic token refresh
- Token revocation support
- HTTPS only in production

## i18n

The app supports Persian (RTL) and English (LTR):

```typescript
import { useTranslation } from 'react-i18next';

const { t } = useTranslation();
<Text>{t('auth.login')}</Text>
```

## Push Notifications

Configured for both iOS and Android:

- Workout reminders
- Nutrition reminders
- New messages from coach
- Appointment reminders

## Testing

```bash
# Run tests
pnpm test

# Run with coverage
pnpm coverage
```

## Deployment

1. Configure EAS project:
```bash
eas init
```

2. Build for production:
```bash
eas build --profile production --platform all
```

3. Submit to stores:
```bash
eas submit --platform ios
eas submit --platform android
```

## License

Private - ArmanVarzesh

---

**Status**: ✅ Fully Implemented (P0-1)
**Progress**: User App 90% Complete
