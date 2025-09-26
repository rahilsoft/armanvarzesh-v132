#!/usr/bin/env bash
set -euo pipefail
VERSION=${1:-0.1.0-rc1}
TAG=v$VERSION

echo "Creating tag $TAG";
 git tag -a "$TAG" -m "Release $TAG" || true
 git push origin "$TAG" || true

echo "Generating CHANGELOG.md (placeholder)";
 cp tools/release/changelog.template.md CHANGELOG.md
