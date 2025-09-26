#!/usr/bin/env bash
set -euo pipefail
violations=0
for d in helm charts; do
  if [ -d "$d" ]; then
    while IFS= read -r -d '' f; do
      if grep -E "image(Tag|\.tag)?\s*:\s*latest\b" "$f" >/dev/null; then
        echo "❌ latest tag found in: $f"
        violations=$((violations+1))
      fi
    done < <(find "$d" -type f \( -name "*.yml" -o -name "*.yaml" -o -name "*.tpl" \) -print0)
  fi
done
if [ "$violations" -gt 0 ]; then
  echo "Found $violations latest tag occurrences. Please pin image tags."
  exit 1
else
  echo "✅ No 'latest' image tags in Helm manifests."
fi
