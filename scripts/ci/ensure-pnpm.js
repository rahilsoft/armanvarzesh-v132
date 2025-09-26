/**
 * Ensures install is performed with pnpm. If not, tries to activate via corepack.
 * Does not hard-fail in CI, but prints guidance.
 */
const { execSync } = require('child_process');

const ua = process.env['npm_config_user_agent'] || '';
if (!/pnpm\/\d+/.test(ua)) {
  console.warn('[warn] Detected installer not pnpm. Trying to activate pnpm via corepack...');
  try {
    execSync('corepack enable', { stdio: 'inherit' });
    execSync('corepack prepare pnpm@9 --activate', { stdio: 'inherit' });
  } catch (e) {
    console.warn('[warn] corepack activation failed; continuing (CI will call scripts/ci/install_with_fallback.sh)');
  }
}
