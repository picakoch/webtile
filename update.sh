#!/bin/bash

git pull
echo "Rebuild backend"
cd backend
# Build first: if the build fails, the running containers are left alone
docker compose build
docker compose up -d

echo "Rebuild frontend"
cd ../frontend
echo $PATH
echo $HOME
export NVM_DIR="$HOME/.nvm"
source ~/.nvm/nvm.sh

# Installs node 22 on first run; yarn comes from corepack (bundled with node)
nvm install 22
export COREPACK_ENABLE_DOWNLOAD_PROMPT=0
corepack enable
yarn
yarn build

cd ..

# nginx configuration from nginx/ (needs root: see scripts/update-vhosts.sh)
echo "Update nginx vhosts"
if sudo -n -l "$PWD/scripts/update-vhosts.sh" >/dev/null 2>&1; then
  sudo -n "$PWD/scripts/update-vhosts.sh" || echo "!! vhost update failed (nginx left as it was)"
else
  echo "Skipped (needs root): sudo $PWD/scripts/update-vhosts.sh"
fi

echo "Done."
