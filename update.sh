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
nvm use v18.20.1

yarn
yarn build

echo "Done."
cd ..
