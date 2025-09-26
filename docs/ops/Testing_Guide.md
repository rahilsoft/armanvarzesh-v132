# Testing Guide

```bash
corepack enable
corepack prepare pnpm@9.6.0 --activate
pnpm -w install
pnpm run test:turbo
```

اگر خطای `workspace:*` یا 403 Proxy دیدید، مطمئن شوید npm/yarn استفاده نمی‌شود یا از pnpm/action-setup با standalone استفاده کنید.
