#!/bin/bash

echo "Rebuild backend"
cd backend
docker compose down
docker commpose build
docker compose up -d

echo "Rebuild frontend"
cd ../frontend
yarn build

echo "Done."
cd ..