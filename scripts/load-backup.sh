#!/bin/bash
#
# Load a site's latest production backup (made by backup.sh on the server)
# into a local Postgres container, to test the backend against real data.
#
#   scripts/load-backup.sh [SITE]            fetch the latest backup, then restore it
#   scripts/load-backup.sh [SITE] --reset    restore the already-fetched backup again
#                                            (e.g. to retry a migration from scratch)
#
# SITE defaults to picasol. Then run Strapi on it with: make backend-pg
#
#   - backup copied to   backend/.backup/<SITE>/  (db.dump + uploads/)
#   - uploads mirrored to backend/public/uploads/ (replaces local uploads)
#   - database restored into the docker container webtile_<SITE>_db,
#     listening on 127.0.0.1:$PG_PORT, user/password/database "strapi"
#
# Nothing is written on the server.

set -euo pipefail

SITE=picasol
FETCH=1
for arg in "$@"; do
  case $arg in
    --reset) FETCH=0 ;;
    -*) echo "Unknown option: $arg" >&2; exit 1 ;;
    *) SITE=$arg ;;
  esac
done

REMOTE=${REMOTE:-n21}
REMOTE_BACKUP_DIR=${REMOTE_BACKUP_DIR:-backup}
PG_PORT=${PG_PORT:-5433}
PG_IMAGE=postgres:16 # same as production (backend/docker-compose.yml)

ROOT=$(cd "$(dirname "$0")/.." && pwd)
LOCAL_DIR="$ROOT/backend/.backup/$SITE"
CONTAINER="webtile_${SITE}_db"

if [ "$FETCH" = 1 ]; then
  # Latest backup whose database dump is complete (backup.sh writes it atomically)
  latest=$(ssh "$REMOTE" "ls -1d $REMOTE_BACKUP_DIR/$SITE/*/ 2>/dev/null | while read -r d; do [ -f \"\$d/db.dump\" ] && echo \"\$d\"; done | tail -1")
  if [ -z "$latest" ]; then
    echo "No backup with a db.dump found in $REMOTE:$REMOTE_BACKUP_DIR/$SITE" >&2
    exit 1
  fi
  if ssh "$REMOTE" "pgrep -f '[r]sync.*backup/$SITE/' >/dev/null"; then
    echo "A backup of $SITE is still running on $REMOTE, try again when it is done" >&2
    exit 1
  fi

  echo "==> Fetching $REMOTE:$latest"
  mkdir -p "$LOCAL_DIR"
  rsync -a "$REMOTE:${latest}db.dump" "$LOCAL_DIR/db.dump"
  rsync -a --delete "$REMOTE:${latest}uploads/" "$LOCAL_DIR/uploads/"
  basename "$latest" > "$LOCAL_DIR/BACKUP_DATE"
fi

if [ ! -f "$LOCAL_DIR/db.dump" ]; then
  echo "No local backup in $LOCAL_DIR, run without --reset first" >&2
  exit 1
fi

echo "==> Copying uploads to backend/public/uploads"
rsync -a --delete --exclude .gitkeep "$LOCAL_DIR/uploads/" "$ROOT/backend/public/uploads/"

echo "==> Restoring the database into $CONTAINER (127.0.0.1:$PG_PORT)"
if ! docker ps -a --format '{{.Names}}' | grep -qx "$CONTAINER"; then
  docker run -d --name "$CONTAINER" \
    -e POSTGRES_USER=strapi -e POSTGRES_PASSWORD=strapi -e POSTGRES_DB=postgres \
    -p "127.0.0.1:$PG_PORT:5432" "$PG_IMAGE" >/dev/null
fi
docker start "$CONTAINER" >/dev/null
for _ in $(seq 1 30); do
  docker exec "$CONTAINER" pg_isready -U strapi -q 2>/dev/null && break
  sleep 1
done

# Recreate the database from scratch rather than restoring over it
docker exec "$CONTAINER" dropdb -U strapi --if-exists --force strapi
docker exec "$CONTAINER" createdb -U strapi strapi
docker exec -i "$CONTAINER" pg_restore -U strapi -d strapi --no-owner --no-acl < "$LOCAL_DIR/db.dump"

echo
echo "Loaded $SITE backup $(cat "$LOCAL_DIR/BACKUP_DATE" 2>/dev/null) into $CONTAINER."
echo "Start Strapi on it with: make backend-pg   (or make local-pg for the frontend too)"
echo "Log into the admin with the production admin accounts."
