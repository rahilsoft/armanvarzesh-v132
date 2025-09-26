# users-service — Testing Guide

## Setup
```bash
npm ci
npm test -- --coverage
```
- Adjust `tests/e2e/*` to import correct modules.
- Add DB/queue mocks.
