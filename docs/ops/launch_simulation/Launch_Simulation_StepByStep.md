# Launch Simulation — Step by Step (Generated 2025-08-12T18:27:23.895198Z)

> هدف: تمرین لانچ روی محیط لوکال/Stage با اسکریپت‌های خودکار، بدون وابستگی به سرویس‌های بیرونی.

## پیش‌نیازها
- Node 20 + pnpm 9 (اسکریپت `install.sh`)
- Docker + Docker Compose
- دسترسی به Bash

## 1) مقداردهی ENV (Stage/Prod)
- فایل‌های زیر را ایجاد کنید یا با اسکریپت بسازید:
  - `.env.staging` و `.env.production` در ریشه ریپو

می‌توانید از اسکریپت‌های آماده استفاده کنید:
```bash
scripts/sim/setup_env_stage.sh
scripts/sim/setup_env_prod.sh
```

## 2) نصب وابستگی‌ها
```bash
./install.sh
```

## 3) بالا آوردن سرویس‌ها با Compose (لوکال / Stage)
```bash
scripts/sim/docker_up.sh   # up -d --build
```

## 4) مهاجرت ایندکس‌های DB
```bash
scripts/sim/db_migrate_indexes.sh
```

## 5) Smoke Test (وب و بک‌اند)
```bash
scripts/smoke/smoke_http.sh          # healthz, web home
scripts/smoke/smoke_graphql.sh       # sanity GQL endpoint
```

## 6) خاموش‌کردن سرویس‌ها
```bash
scripts/sim/docker_down.sh
```

## 7) نکات K8s (اختیاری)
- مانیفست‌های پایه در `k8s/` موجود است. برای شبیه‌سازی:
```bash
# تنظیم Namespace و سرویس‌ها
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/backend-service.yaml
kubectl apply -f k8s/web-deployment.yaml
kubectl apply -f k8s/web-service.yaml
# Ingress (در صورت آماده‌بودن کنترلر و TLS):
kubectl apply -f k8s/ingress.yaml
```

## 8) Playbook رول‌بک (Compose)
- برچسب قبلی ایمیج‌ها را در `docker compose` تنظیم کنید و `up -d` مجدد بزنید.
- برای دیتابیس Stage از بکاپ آخر استفاده کنید (هرگز روی Prod بدون بکاپ تست انجام ندهید).

---
