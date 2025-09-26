#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PKG="$ROOT_DIR/apps/backend/package.json"

if [ ! -f "$PKG" ]; then
  echo "apps/backend/package.json not found. Aborting."
  exit 1
fi

echo "==> Cleaning @nestjs/swc from apps/backend/package.json if present"
node - <<'NODE'
const fs = require('fs');
const path = require('path');
const pkgPath = process.argv[1];
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
let changed = false;
for (const sec of ['dependencies','devDependencies']) {
  if (pkg[sec] && pkg[sec]['@nestjs/swc']) {
    delete pkg[sec]['@nestjs/swc'];
    changed = true;
  }
}
if (changed) {
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
  console.log('Removed @nestjs/swc from', pkgPath);
} else {
  console.log('Nothing to remove. @nestjs/swc not found.');
}
NODE
"$PKG"

echo "==> Done."
