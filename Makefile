# Local development helpers.
#
#   make local                 backend (Strapi + SQLite) + frontend pointed at it
#   make front                 frontend only, against a live API (default: picasol)
#   make front API=https://api.slyapollinaire.com
#   make install               install backend and frontend dependencies
#   make merge-clients         merge main into every client branch and push
#
# Production runs the backend with docker compose (see update.sh); locally we
# run Strapi directly with the SQLite database configured in backend/.env.

SHELL := /bin/bash

# Strapi 4 only supports node <= 20 (the docker image uses node 18);
# move the backend to 22 with the Strapi 5 upgrade.
BACKEND_NODE  ?= 20
FRONTEND_NODE ?= 22
BACKEND_PORT ?= $(shell grep -E '^PORT=' backend/.env 2>/dev/null | cut -d= -f2)
LOCAL_API    := http://localhost$(if $(BACKEND_PORT),:$(BACKEND_PORT))
API          ?= https://api.picasol.fr

# Run a recipe with the given node version (nvm is a shell function)
export COREPACK_ENABLE_DOWNLOAD_PROMPT := 0
NVM = export NVM_DIR="$$HOME/.nvm"; . "$$NVM_DIR/nvm.sh" && nvm use $(1) >/dev/null && corepack enable &&

.PHONY: local front backend frontend install merge-clients

local:
	$(MAKE) -j2 backend frontend API=$(LOCAL_API)

front: frontend

backend:
	cd backend && $(call NVM,$(BACKEND_NODE)) yarn serve

# Environment variables take precedence over .env files in Vite
frontend:
	cd frontend && $(call NVM,$(FRONTEND_NODE)) \
		VITE_STRAPI_API_URL=$(API) \
		VITE_GRAPHQL_URL=$(API)/graphql \
		yarn dev

install:
	cd backend && $(call NVM,$(BACKEND_NODE)) yarn
	cd frontend && $(call NVM,$(FRONTEND_NODE)) yarn

CLIENT_BRANCHES ?= sly picasol oa autourdeminuit

# Stops at the first conflict, leaving that branch checked out to resolve it
merge-clients:
	@git diff --quiet && git diff --cached --quiet || { echo "Working tree not clean"; exit 1; }
	@set -e; start=$$(git branch --show-current); \
	git fetch origin; \
	git checkout -q main; git merge -q --ff-only origin/main; \
	for b in $(CLIENT_BRANCHES); do \
		echo "==> $$b"; \
		git checkout -q $$b; \
		git merge -q --ff-only origin/$$b; \
		git merge --no-edit main; \
		git push -q origin $$b; \
	done; \
	git checkout -q $$start; \
	echo "Merged main into: $(CLIENT_BRANCHES)"
