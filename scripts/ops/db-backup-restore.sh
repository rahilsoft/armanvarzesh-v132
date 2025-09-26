
#!/usr/bin/env bash
# Usage: db-backup-restore.sh backup|restore <pg_uri> [file]
set -euo pipefail
CMD="${1:-}"; URI="${2:-}"; FILE="${3:-backup.sql}"
if [[ "$CMD" == "backup" ]]; then
  pg_dump "$URI" > "$FILE"
  echo "Backup at $FILE"
elif [[ "$CMD" == "restore" ]]; then
  psql "$URI" < "$FILE"
  echo "Restored from $FILE"
else
  echo "Usage: $0 backup|restore <pg_uri> [file]"; exit 1
fi
