#!/usr/bin/env bash
# Daily PostgreSQL backup for QRbanner VPS.
# Usage: ./scripts/vps-backup-database.sh
# Cron:  0 3 * * * /var/www/qrbanner/scripts/vps-backup-database.sh >> /var/log/qrbanner-backup.log 2>&1

set -euo pipefail

APP_DIR="${QRBANNER_APP_DIR:-/var/www/qrbanner}"
BACKUP_DIR="${QRBANNER_BACKUP_DIR:-/var/backups/qrbanner}"
RETENTION_DAYS="${QRBANNER_BACKUP_RETENTION_DAYS:-14}"

mkdir -p "$BACKUP_DIR"

if [ -f "$APP_DIR/.env" ]; then
  # shellcheck disable=SC1090
  set -a
  source "$APP_DIR/.env"
  set +a
fi

if [ -z "${DATABASE_URL:-}" ]; then
  echo "[backup] DATABASE_URL not set"
  exit 1
fi

STAMP="$(date +%Y%m%d-%H%M%S)"
OUT="$BACKUP_DIR/qrbanner-$STAMP.sql.gz"

echo "[backup] Writing $OUT"
pg_dump "$DATABASE_URL" | gzip -9 > "$OUT"
echo "[backup] Done ($(du -h "$OUT" | cut -f1))"

find "$BACKUP_DIR" -name 'qrbanner-*.sql.gz' -type f -mtime +"$RETENTION_DAYS" -delete
echo "[backup] Pruned backups older than ${RETENTION_DAYS}d"
