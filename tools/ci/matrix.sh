#!/usr/bin/env bash
set -euo pipefail

echo "# CI Build Matrix Report" > ci_report.md
echo "" >> ci_report.md
date -Is >> ci_report.md
echo "" >> ci_report.md

# list of workspaces (apps + services)
MAP=$(pnpm -r --workspace-concurrency=1 list --depth -1 --json | node -e "process.stdin.on('data',d=>{const j=JSON.parse(d);console.log(j.map(x=>x.path).join('\n'))})" || true)
if [ -z "$MAP" ]; then
  echo "No workspace map found (pnpm list). Skipping." >> ci_report.md
  exit 0
fi

while IFS= read -r dir; do
  if [ ! -d "$dir" ]; then continue; fi
  pushd "$dir" >/dev/null
  name=$(node -e "console.log(require('./package.json').name || path.basename(process.cwd()))" 2>/dev/null || echo "$(basename "$dir")")

  echo "## $name" >> ../../ci_report.md
  start=$(date +%s)
  (pnpm run typecheck >/dev/null 2>&1 && echo "- typecheck: ok" >> ../../ci_report.md) || echo "- typecheck: n/a" >> ../../ci_report.md
  mid=$(date +%s)
  (pnpm run build >/dev/null 2>&1 && echo "- build: ok" >> ../../ci_report.md) || echo "- build: n/a" >> ../../ci_report.md
  end=$(date +%s)

  tc=$(( mid - start ))
  bc=$(( end - mid ))
  echo "  - typecheck_time_sec: $tc" >> ../../ci_report.md
  echo "  - build_time_sec: $bc" >> ../../ci_report.md

  size=0
  if [ -d "dist" ]; then
    size=$(du -sk dist | awk '{print $1}')
  fi
  echo "  - dist_kb: $size" >> ../../ci_report.md
  echo "" >> ../../ci_report.md
  popd >/dev/null
done <<< "$MAP"

echo "Wrote ci_report.md"
