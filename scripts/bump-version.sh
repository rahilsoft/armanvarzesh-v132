#!/usr/bin/env bash
set -euo pipefail
NEW_TAG="${1:-v2025.08.18}"
echo "Setting image tags in Helm charts to: $NEW_TAG"
for d in helm charts; do
  if [ -d "$d" ]; then
    grep -RIl --include="*.y*ml" --include="*.tpl" -e 'imageTag:' -e 'image:' -e 'tag:' "$d" | while read -r file; do
      sed -i.bak -E "s/(imageTag\s*:\s*)latest/\1$NEW_TAG/g" "$file" || true
      sed -i.bak -E "s/(image\.tag\s*:\s*)latest/\1$NEW_TAG/g" "$file" || true
      sed -i.bak -E "s/^\s*(tag\s*:\s*)latest/\1$NEW_TAG/g" "$file" || true
      rm -f "$file.bak"
    done
  fi
done
echo "Done."
