#!/bin/bash
#
# Install this site's nginx configuration from the repo's templates (nginx/).
# Run as root on the server, from the site's checkout:
#
#   sudo ./scripts/update-vhosts.sh             # apply
#   sudo ./scripts/update-vhosts.sh --dry-run   # only show what would change
#
# Settings, from backend/.env:
#   SITE_DOMAIN=picasol.fr   required: serves picasol.fr, www.picasol.fr and
#                            api.picasol.fr
#   VHOST_NAME=picasol       optional (default APP_NAME): names the files
#                            /etc/nginx/conf.d/<name>_front.conf and _back.conf
#                            and /usr/share/nginx/html/<name> (-> frontend/dist)
#   PORT, APP_NAME           already there
#
# HTTPS: certbot is never allowed to edit these files (re-rendering them would
# lose its changes). The script looks up an existing certificate covering the
# domains (`certbot certificates`) and writes the HTTPS server blocks itself.
# Without one, it installs the HTTP-only config, gets a certificate with
# `certbot certonly --nginx` (obtains it without touching the configuration;
# renewals work the same way), then installs the HTTPS config.
#
# Existing files are backed up to /var/backups/webtile-nginx/<date>/ and
# restored if `nginx -t` fails.
#
# update.sh runs it with `sudo -n` when allowed without a password, e.g. with
# /etc/sudoers.d/webtile:
#   antoine ALL=(root) NOPASSWD: /home/antoine/picasol/scripts/update-vhosts.sh
# Note: the script and templates are writable by antoine and updated by git
# pull, so this effectively lets antoine (and whoever can push to the
# branch) configure nginx as root. Otherwise run it by hand after deploys.

set -euo pipefail

DRY_RUN=0
for arg in "$@"; do
  case $arg in
    --dry-run) DRY_RUN=1 ;;
    *) echo "Unknown option: $arg" >&2; exit 1 ;;
  esac
done

ROOT=$(cd "$(dirname "$0")/.." && pwd)
ENV_FILE="$ROOT/backend/.env"
NGINX_DIR=${NGINX_DIR:-/etc/nginx}
HTML_DIR=${HTML_DIR:-/usr/share/nginx/html}
BACKUP_ROOT=${BACKUP_ROOT:-/var/backups/webtile-nginx}

if [ "$(id -u)" != 0 ] && [ "$DRY_RUN" = 0 ]; then
  echo "Run as root (sudo $0)" >&2
  exit 1
fi

env_value() {
  { grep -E "^$1=" "$ENV_FILE" 2>/dev/null || true; } | tail -1 | cut -d= -f2- | tr -d '"'"'"
}

DOMAIN=$(env_value SITE_DOMAIN)
APP_NAME=$(env_value APP_NAME)
NAME=$(env_value VHOST_NAME)
NAME=${NAME:-$APP_NAME}
PORT=$(env_value PORT)
UPLOADS_DIR="$ROOT/backend/public/uploads"

for var in DOMAIN NAME PORT; do
  if [ -z "${!var}" ]; then
    echo "Missing setting for $var in $ENV_FILE (see the top of $0)" >&2
    exit 1
  fi
done

FRONT_CONF="$NGINX_DIR/conf.d/${NAME}_front.conf"
BACK_CONF="$NGINX_DIR/conf.d/${NAME}_back.conf"
HTTP_CONF="$NGINX_DIR/conf.d/00-webtile-http.conf"
PROXY_CONF="$NGINX_DIR/webtile-proxy-headers.conf"

echo "==> $DOMAIN: $FRONT_CONF, $BACK_CONF (backend port $PORT)"

# --- Certificates ----------------------------------------------------------

# Prints "<fullchain> <privkey>" of a valid certificate covering all the
# given domains, or nothing
find_certificate() {
  certbot certificates 2>/dev/null | awk -v wanted="$*" '
    /Certificate Name:/ { domains = ""; valid = 0; chain = ""; key = "" }
    /Domains:/          { sub(/.*Domains: */, ""); domains = " " $0 " " }
    /Expiry Date:/      { valid = ($0 ~ /VALID/ && $0 !~ /INVALID/) }
    /Certificate Path:/ { sub(/.*Certificate Path: */, ""); chain = $0 }
    /Private Key Path:/ {
      sub(/.*Private Key Path: */, ""); key = $0
      n = split(wanted, names, " "); ok = valid
      for (i = 1; i <= n; i++) if (index(domains, " " names[i] " ") == 0) ok = 0
      if (ok && !found) { print chain, key; found = 1 }
    }'
}

# --- Rendering -------------------------------------------------------------

render() {
  sed -e "s#APP_DOMAIN#$DOMAIN#g" \
      -e "s#APP_PORT#$PORT#g" \
      -e "s#UPLOADS_DIR#$UPLOADS_DIR#g" \
      -e "s#/usr/share/nginx/html/app_name#$HTML_DIR/$NAME#g" \
      "$1"
}

# HTTP/2 syntax: "http2 on;" since nginx 1.25.1, "listen ... http2" before
# (e.g. Ubuntu 24.04's nginx 1.24)
nginx_at_least() {
  local version
  version=$(nginx -v 2>&1 | sed -n 's#.*nginx/\([0-9.]*\).*#\1#p')
  [ -n "$version" ] && [ "$(printf '%s\n%s\n' "$1" "$version" | sort -V | head -1)" = "$1" ]
}
if nginx_at_least 1.25.1; then
  LISTEN_HTTPS="    listen 443 ssl;\n    http2 on;"
else
  LISTEN_HTTPS="    listen 443 ssl http2;"
fi

# Turns a rendered HTTP-only template into HTTPS (with HTTP/2: images load in
# parallel instead of ~6 at a time) + an HTTP->HTTPS redirect.
# $1: rendered config, $2: fullchain, $3: privkey, $4: server names
with_https() {
  awk -v chain="$2" -v key="$3" -v listen="$LISTEN_HTTPS" '
    /^[ \t]*listen 80;/ {
      gsub(/\\n/, "\n", listen)
      print listen
      print "    ssl_certificate " chain ";"
      print "    ssl_certificate_key " key ";"
      print "    include /etc/letsencrypt/options-ssl-nginx.conf;"
      print "    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;"
      next
    }
    { print }' "$1"
  cat <<EOF

server {
    server_name $4;
    listen 80;
    return 301 https://\$host\$request_uri;
}
EOF
}

TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT

render "$ROOT/nginx/vhost_frontend.conf" > "$TMP/front.http"
render "$ROOT/nginx/vhost_backend.conf" > "$TMP/back.http"
cp "$ROOT/nginx/webtile-http.conf" "$TMP/http.conf"
cp "$ROOT/nginx/webtile-proxy-headers.conf" "$TMP/proxy.conf"

FRONT_NAMES="$DOMAIN www.$DOMAIN"
BACK_NAMES="api.$DOMAIN"
FRONT_CERT=$(find_certificate $FRONT_NAMES || true)
BACK_CERT=$(find_certificate $BACK_NAMES || true)

build() {
  # shellcheck disable=SC2086
  if [ -n "$FRONT_CERT" ]; then
    with_https "$TMP/front.http" $FRONT_CERT "$FRONT_NAMES" > "$TMP/front.conf"
  else
    cp "$TMP/front.http" "$TMP/front.conf"
  fi
  # shellcheck disable=SC2086
  if [ -n "$BACK_CERT" ]; then
    with_https "$TMP/back.http" $BACK_CERT "$BACK_NAMES" > "$TMP/back.conf"
  else
    cp "$TMP/back.http" "$TMP/back.conf"
  fi
}
build

# --- Install ---------------------------------------------------------------

TARGETS=("$FRONT_CONF:$TMP/front.conf" "$BACK_CONF:$TMP/back.conf"
         "$HTTP_CONF:$TMP/http.conf" "$PROXY_CONF:$TMP/proxy.conf")

show_diff() {
  local changed=0
  for pair in "${TARGETS[@]}"; do
    local target=${pair%%:*} new=${pair#*:}
    if ! cmp -s "$target" "$new" 2>/dev/null; then
      changed=1
      if [ -e "$target" ]; then
        diff -u --label "$target" --label "$target (new)" "$target" "$new" || true
      else
        diff -u --label "(new file)" --label "$target" /dev/null "$new" || true
      fi
    fi
  done
  return $changed
}

CHANGED=0
show_diff || CHANGED=1

if [ "$DRY_RUN" = 1 ]; then
  [ "$CHANGED" = 0 ] && echo "Nothing to change."
  [ -z "$FRONT_CERT" ] && echo "(no certificate for $FRONT_NAMES: would request one)"
  [ -z "$BACK_CERT" ] && echo "(no certificate for $BACK_NAMES: would request one)"
  exit 0
fi

# Frontend files
if [ "$(readlink "$HTML_DIR/$NAME" 2>/dev/null)" != "$ROOT/frontend/dist" ]; then
  echo "==> $HTML_DIR/$NAME -> $ROOT/frontend/dist"
  ln -sfn "$ROOT/frontend/dist" "$HTML_DIR/$NAME"
fi

if [ "$CHANGED" = 0 ]; then
  echo "Nothing to change."
  exit 0
fi

# Another "gzip on" at http level would make the configuration invalid
if grep -qE '^[^#]*\bgzip[[:space:]]+on' "$NGINX_DIR/nginx.conf"; then
  echo "Remove 'gzip on;' from $NGINX_DIR/nginx.conf: it is now in $HTTP_CONF" >&2
  exit 1
fi

# Parent of the GraphQL cache (webtile-http.conf): nginx only creates the
# last directory level, and Ubuntu's package has no /var/cache/nginx
mkdir -p /var/cache/nginx

BACKUP="$BACKUP_ROOT/$(date +%Y-%m-%d_%H%M%S)-$$"
mkdir -p "$BACKUP"
for pair in "${TARGETS[@]}"; do
  target=${pair%%:*}
  [ -e "$target" ] && cp -a "$target" "$BACKUP/"
done

reload_nginx() {
  if command -v systemctl >/dev/null && systemctl is-active --quiet nginx; then
    systemctl reload nginx
  else
    nginx -s reload
  fi
}

# Install the given files; on a failed `nginx -t`, put the backup back
install_and_reload() {
  for pair in "${TARGETS[@]}"; do
    install -m 644 "${pair#*:}" "${pair%%:*}"
  done
  if ! nginx -t; then
    echo "!! nginx -t failed, restoring $BACKUP" >&2
    for pair in "${TARGETS[@]}"; do
      target=${pair%%:*}
      if [ -e "$BACKUP/$(basename "$target")" ]; then
        cp -a "$BACKUP/$(basename "$target")" "$target"
      else
        rm -f "$target"
      fi
    done
    # nginx may be running an earlier step's config: bring it back in line
    nginx -t >/dev/null 2>&1 && reload_nginx
    exit 1
  fi
  reload_nginx
}

install_and_reload

# Missing certificate: the HTTP config is live now, get one and switch to HTTPS
if [ -z "$FRONT_CERT" ] || [ -z "$BACK_CERT" ]; then
  echo "==> Requesting a certificate for $FRONT_NAMES $BACK_NAMES"
  certbot certonly --nginx --non-interactive --agree-tos \
    --cert-name "webtile-$NAME" \
    $(for d in $FRONT_NAMES $BACK_NAMES; do printf -- '-d %s ' "$d"; done)
  FRONT_CERT=$(find_certificate $FRONT_NAMES || true)
  BACK_CERT=$(find_certificate $BACK_NAMES || true)
  if [ -z "$FRONT_CERT" ] || [ -z "$BACK_CERT" ]; then
    echo "!! Still no certificate; the site stays on HTTP" >&2
    exit 1
  fi
  build
  install_and_reload
fi

echo "Done (previous files in $BACKUP)."
