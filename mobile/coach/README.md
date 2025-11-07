# ArmanVarzesh - Coach Mobile App

React Native mobile application for ArmanVarzesh coaches built with Expo.

## Features

- 🔐 **Authentication**: Login with biometric support
- 👥 **Client Management**: View and manage all clients
- 💪 **Workout Plans**: Create and assign workout programs
- 🥗 **Nutrition Plans**: Create meal plans and track client nutrition
- 💬 **Chat**: Real-time messaging with clients
- 📊 **Client Progress**: Monitor client metrics, photos, and achievements
- 📅 **Calendar**: Schedule and manage sessions with clients
- 📹 **Video Calls**: LiveKit integration for remote coaching
- 🔔 **Notifications**: Push notifications for messages and appointments
- 🌙 **Dark Mode**: Automatic/manual theme switching
- 🌐 **i18n**: Persian and English language support

## Tech Stack

- **Framework**: Expo SDK 52 + React Native 0.76
- **Navigation**: React Navigation (Native Stack + Bottom Tabs)
- **State Management**: Zustand
- **API Client**: Apollo Client (GraphQL) + Axios (REST)
- **Real-time**: Socket.IO for chat and live updates
- **Video**: LiveKit for video calls
- **Forms**: React Hook Form + Zod validation
- **Calendar**: react-native-calendars
- **i18n**: i18next + react-i18next

## Project Structure

```
mobile/coach/
├── App.tsx                 # Main app entry
├── src/
│   ├── config/            # Configuration (env, theme, i18n)
│   ├── services/          # API clients and services
│   ├── store/             # Zustand stores
│   │   ├── auth.store.ts
│   │   ├── client.store.ts
│   │   ├── workout.store.ts
│   │   └── appointment.store.ts
│   ├── components/        # Reusable UI components
│   ├── screens/           # App screens
│   └── utils/             # Utility functions
└── package.json
```

## Scripts

| Script | Description |
|--------|-------------|
| `start` | Start Expo development server |
| `android` | Run on Android device/emulator |
| `ios` | Run on iOS device/simulator |
| `build` | Build for production |
| `build:android` | Build Android app via EAS |
| `build:ios` | Build iOS app via EAS |

## Development

### Setup

1. Install dependencies:
```bash
pnpm install
```

2. Start development server:
```bash
pnpm start
```

3. Run on device:
```bash
# iOS
pnpm ios

# Android
pnpm android
```

## Key Features for Coaches

### Client Management
- View all assigned clients
- Client profiles with full history
- Progress tracking and analytics
- Client notes and assessments

### Program Creation
- Workout plan builder with exercise library
- Meal plan creator with food database
- Template management for quick assignment
- Progress tracking and adjustments

### Communication
- Real-time chat with clients
- Push notifications for new messages
- Video call scheduling and execution
- Appointment reminders

### Calendar & Scheduling
- Session management
- Availability settings
- Automated reminders
- Session notes and follow-ups

## Building

```bash
# Development
eas build --profile development --platform ios

# Production
eas build --profile production --platform all
```

## Deployment

```bash
# Submit to stores
eas submit --platform ios
eas submit --platform android
```

## License

Private - ArmanVarzesh

---

**Status**: ✅ Fully Implemented (P0-1)
**Progress**: Coach App 100% Complete
