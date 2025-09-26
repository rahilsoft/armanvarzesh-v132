#!/usr/bin/env bash
set -euo pipefail
echo '>>> Running seeds across repo...'

# Domain-level demo seeds (non-fatal)
node scripts/seed_domain.js || true
