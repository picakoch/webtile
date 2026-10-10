#!/bin/bash
#
# Back up each site's Strapi database and uploads.
#
#   ./backup.sh ~/picasol ~/slyapollinaire
#
# For each site directory (a webtile checkout with backend/.env):
#   - database: pg_dump (custom format) from the <APP_NAME>_db container
#   - uploads:  rsync snapshot of backend/public/uploads, hard-linked to the
#               previous snapshot so unchanged files take no extra space
#
# Layout: $BACKUP_DIR/<APP_NAME>/<YYYY-MM-DD_HHMM>/{db.dump,uploads/}
# Restore the database with:
#   docker exec -i <APP_NAME>_db pg_restore -U strapi -d strapi --clean --if-exists < db.dump
#
# Backups older than $KEEP_DAYS days are removed.

set -euo pipefail

BACKUP_DIR=${BACKUP_DIR:-$HOME/backup}
KEEP_DAYS=${KEEP_DAYS:-14}
STAMP=$(date +%Y-%m-%d_%H%M)

if [ $# -eq 0 ]; then
  echo "Usage: $0 SITE_DIR [SITE_DIR...]" >&2
  exit 1
fi

# Read KEY from a .env file (without sourcing it)
env_value() {
  grep -E "^$1=" "$2" | tail -1 | cut -d= -f2-
}

status=0
for site in "$@"; do
  env_file="$site/backend/.env"
  if [ ! -f "$env_file" ]; then
    echo "!! $site: no backend/.env, skipped" >&2
    status=1
    continue
  fi

  app=$(env_value APP_NAME "$env_file")
  db_user=$(env_value DATABASE_USERNAME "$env_file")
  db_name=$(env_value DATABASE_NAME "$env_file")
  dest="$BACKUP_DIR/$app/$STAMP"
  previous=$(ls -1d "$BACKUP_DIR/$app"/*/ 2>/dev/null | tail -1 || true)
  mkdir -p "$dest"

  echo "==> $app"

  # Write to a temp file so a failed dump never looks like a valid backup
  if docker exec "${app}_db" pg_dump -U "${db_user:-strapi}" -Fc "${db_name:-strapi}" > "$dest/db.dump.tmp"; then
    mv "$dest/db.dump.tmp" "$dest/db.dump"
    echo "    database: $(du -h "$dest/db.dump" | cut -f1)"
  else
    rm -f "$dest/db.dump.tmp"
    echo "!! $app: database dump failed" >&2
    status=1
  fi

  if [ -d "$site/backend/public/uploads" ]; then
    rsync -a --delete ${previous:+--link-dest="${previous%/}/uploads"} \
      "$site/backend/public/uploads/" "$dest/uploads/"
    echo "    uploads:  $(find "$dest/uploads" -type f | wc -l | tr -d ' ') files"
  fi

  find "$BACKUP_DIR/$app" -mindepth 1 -maxdepth 1 -type d -mtime +"$KEEP_DAYS" \
    -exec rm -rf {} +
done

exit $status
