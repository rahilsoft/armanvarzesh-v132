# Git Prep

- Commit lockfile: run `pnpm -w install` locally to generate `pnpm-lock.yaml`, then commit it.
- Ensure `.env` is excluded; only commit `.env.example`.
- Verify CI secrets: DATABASE_URL, JWT_SECRET, ZARINPAL_MERCHANT_ID, KAVENEGAR_API_KEY, EXPO_TOKEN.
- Protect main with required checks (lint/test/build) before merge.