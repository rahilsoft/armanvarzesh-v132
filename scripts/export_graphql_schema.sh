#!/usr/bin/env bash
set -euo pipefail
# expects schema generated to apps/backend/dist/schema.gql after build
if [ -f apps/backend/dist/schema.gql ]; then
  mkdir -p contracts/graphql
  cp apps/backend/dist/schema.gql contracts/graphql/schema.gql
  echo "Exported GraphQL schema to contracts/graphql/schema.gql"
else
  echo "schema.gql not found. Build backend first."
fi
