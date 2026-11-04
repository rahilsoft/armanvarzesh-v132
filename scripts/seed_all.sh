#!/usr/bin/env bash
set -euo pipefail
echo '>>> Running seeds across repo...'

# Domain-level demo seeds (fatal: a failing seed fails the job, REV-20261024-02)
node scripts/seed_domain.js
