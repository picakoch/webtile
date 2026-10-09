# Local development helpers.
#
#   make local                 backend (Strapi + SQLite) + frontend pointed at it
#   make front                 frontend only, against a live API (default: picasol)
#   make front API=https://api.slyapollinaire.com
#   make install               install backend and frontend dependencies
#
# Production runs the backend with docker compose (see update.sh); locally we
# run Strapi directly with the SQLite database configured in backend/.env.

SHELL := /bin/bash

NODE_VERSION ?= 20
BACKEND_PORT ?= $(shell grep -E '^PORT=' backend/.env 2>/dev/null | cut -d= -f2)
LOCAL_API    := http://localhost$(if $(BACKEND_PORT),:$(BACKEND_PORT))
API          ?= https://api.picasol.fr

# Run every recipe with the expected node version (nvm is a shell function)
NVM := export NVM_DIR="$$HOME/.nvm"; . "$$NVM_DIR/nvm.sh" && nvm use $(NODE_VERSION) >/dev/null &&

.PHONY: local front backend frontend install

local:
	$(MAKE) -j2 backend frontend API=$(LOCAL_API)

front: frontend

backend:
	cd backend && $(NVM) yarn serve

# process.env takes precedence over .env files in vue-cli
frontend:
	cd frontend && $(NVM) \
		VUE_APP_STRAPI_API_URL=$(API) \
		VUE_APP_GRAPHQL_URL=$(API)/graphql \
		yarn serve

install:
	cd backend && $(NVM) yarn
	cd frontend && $(NVM) yarn
