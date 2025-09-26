
// node tests/a11y/axe-smoke.js https://example.com
const url = process.argv[2] || 'http://localhost:3000';
const { chromium } = require('playwright');
const AxeBuilder = require('@axe-core/playwright').default;

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(url);
  const results = await new AxeBuilder({ page }).analyze();
  console.log(JSON.stringify({ violations: results.violations.length }));
  await browser.close();
  if (results.violations.length > 0) process.exit(2);
})();
