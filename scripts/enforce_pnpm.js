#!/usr/bin/env node
const ua = (process.env.npm_config_user_agent || '').toLowerCase();
function fail(msg) {
  console.error('\n❌ ' + msg + '\n');
  console.error('راهنمای نصب/تست: docs/ops/Testing_Guide.md');
  console.error('\nروش صحیح (از ریشهٔ مخزن):');
  console.error('  corepack enable');
  console.error('  corepack prepare pnpm@9 --activate');
  console.error('  pnpm -w install');
  console.error('');
  process.exit(1);
}
if (!ua.includes('pnpm')) {
  fail('این مخزن باید با pnpm نصب شود. نصب با npm/yarn پشتیبانی نمی‌شود (workspace:*).');
}
