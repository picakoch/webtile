#!/bin/bash

git pull
echo "Rebuild backend"
cd backend
docker compose down
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

echo "Done."
cd ..
