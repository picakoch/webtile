#!/bin/bash

git pull
echo "Rebuild backend"
cd backend
docker compose down
docker compose build
docker compose up -d

echo "Rebuild frontend"
cd ../frontend

export NVM_DIR="$HOME/.nvm"
[ -s "/usr/local/opt/nvm/nvm.sh" ] && \. "/usr/local/opt/nvm/nvm.sh"  # This loads nvm
nvm use v18.20.1

yarn
yarn build

echo "Done."
cd ..
