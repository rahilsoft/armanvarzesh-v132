
#!/usr/bin/env bash
set -euo pipefail
pnpm -w run test -- --testPathPattern=e2e
