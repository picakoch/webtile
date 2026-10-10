#!/bin/bash
#
# Deploy this checkout (run by .github/workflows/deploy_*.yml on the server).
#
# Everything is built before anything live changes, so a failed build leaves
# the site as it was. Then the new backend starts (running any database
# migrations) and, once it answers, the new frontend replaces the old one.
# The frontend and the API only disagree for the few seconds of that switch.

set -euo pipefail
cd "$(dirname "$0")"

HEALTH_TIMEOUT=${HEALTH_TIMEOUT:-300} # seconds to wait for the new backend

git pull

echo "==> Build backend image"
(cd backend && docker compose build)

echo "==> Build frontend (into frontend/dist.new)"
export NVM_DIR="$HOME/.nvm"
set +u # nvm isn't compatible with "set -u"
# shellcheck disable=SC1091
source "$NVM_DIR/nvm.sh"
# Installs node 22 on first run; yarn comes from corepack (bundled with node)
nvm install 22
set -u
export COREPACK_ENABLE_DOWNLOAD_PROMPT=0
corepack enable
(cd frontend && yarn install && yarn build --outDir dist.new --emptyOutDir)

echo "==> Start backend"
(cd backend && docker compose up -d)

PORT=$(grep -E '^PORT=' backend/.env | tail -1 | cut -d= -f2)
echo "==> Waiting for the backend on port $PORT (migrations run on first start)"
deadline=$((SECONDS + HEALTH_TIMEOUT))
until curl -fsS -o /dev/null "http://127.0.0.1:$PORT/_health"; do
  if [ $SECONDS -ge $deadline ]; then
    echo "!! Backend not answering after ${HEALTH_TIMEOUT}s: frontend NOT switched." >&2
    echo "   Check: (cd backend && docker compose logs --tail 100)" >&2
    exit 1
  fi
  sleep 3
done

echo "==> Switch frontend"
rm -rf frontend/dist.old
[ -d frontend/dist ] && mv frontend/dist frontend/dist.old
mv frontend/dist.new frontend/dist
rm -rf frontend/dist.old

# nginx configuration from nginx/ (needs root: see scripts/update-vhosts.sh)
echo "==> Update nginx vhosts"
if sudo -n -l "$PWD/scripts/update-vhosts.sh" >/dev/null 2>&1; then
  sudo -n "$PWD/scripts/update-vhosts.sh" || echo "!! vhost update failed (nginx left as it was)"
else
  echo "Skipped (needs root): sudo $PWD/scripts/update-vhosts.sh"
fi

echo "Done."
