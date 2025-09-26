#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
echo ">> Seed placeholder: implement per service."
echo "Tip: set `"prisma": { "seed": "tsx prisma/seed.ts" }` in each package.json with prisma."
