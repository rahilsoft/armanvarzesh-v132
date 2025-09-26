import { test, expect } from '@playwright/test';

const apps = [
  { name: 'coach', url: 'http://localhost:3001' },
  { name: 'client', url: 'http://localhost:3002' },
  { name: 'admin', url: 'http://localhost:3003' },
];

const paths = ['/', '/workouts', '/nutrition', '/booking', '/chat'];

for (const app of apps) {
  for (const p of paths) {
    test(`${app.name} ${p} should load`, async ({ page }) => {
      await page.goto(app.url + p);
      await expect(page).toHaveTitle(/ArmanVarzesh|Admin Panel/i);
    });
  }
}
