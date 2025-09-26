# E2E Tests for Critical Flows
Date: 2025-08-12T11:52:12.318886Z

## What we did
- Created real E2E test file: `tests/e2e/auth_workout_notification.e2e-spec.ts`
- Flow:
  1. User registration and login to get JWT.
  2. Workout creation with JWT auth.
  3. Notification trigger for created workout.

## Usage
Run with Jest (ensure test DB is configured):
```bash
pnpm jest --config jest.e2e.json
```
Or with npm:
```bash
npm run test:e2e
```
