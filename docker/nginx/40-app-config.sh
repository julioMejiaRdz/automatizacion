#!/bin/sh
# Lo ejecuta el entrypoint oficial de Nginx antes de arrancar. Genera la configuración según
# TLS_MODE:
#   none        Solo HTTP (puerto 80). Para redes locales sin certificados.
#   custom      HTTPS con certificado propio montado en /etc/nginx/certs/server.crt y server.key.
#   letsencrypt HTTPS con certificado de Let's Encrypt para $DOMAIN (servicio certbot). Mientras
#               no existe el certificado sirve HTTP para el reto ACME y cambia a HTTPS sola.
set -eu

TLS_MODE="${TLS_MODE:-none}"
CONF="/etc/nginx/conf.d/default.conf"
TEMPLATES="/etc/nginx/app-templates"

render() {
  # Solo se sustituyen estas variables; las propias de Nginx ($host, $uri...) se respetan
  envsubst '${SSL_CERT} ${SSL_KEY}' < "${TEMPLATES}/$1" > "$CONF"
}

case "$TLS_MODE" in
  none)
    render http.conf.template
    echo "40-app-config: TLS_MODE=none, solo HTTP"
    ;;

  custom)
    export SSL_CERT=/etc/nginx/certs/server.crt SSL_KEY=/etc/nginx/certs/server.key
    if [ ! -f "$SSL_CERT" ] || [ ! -f "$SSL_KEY" ]; then
      echo "40-app-config: TLS_MODE=custom requiere docker/nginx/certs/server.crt y server.key" >&2
      exit 1
    fi
    render https.conf.template
    echo "40-app-config: TLS_MODE=custom, HTTPS con certificado propio"
    ;;

  letsencrypt)
    : "${DOMAIN:?TLS_MODE=letsencrypt requiere DOMAIN en .env.production}"
    export SSL_CERT="/etc/letsencrypt/live/${DOMAIN}/fullchain.pem"
    export SSL_KEY="/etc/letsencrypt/live/${DOMAIN}/privkey.pem"

    if [ -f "$SSL_CERT" ]; then
      render https.conf.template
      https_active=true
      echo "40-app-config: TLS_MODE=letsencrypt, HTTPS para ${DOMAIN}"
    else
      render http.conf.template
      https_active=false
      echo "40-app-config: TLS_MODE=letsencrypt, sin certificado todavía: HTTP hasta que certbot lo emita"
    fi

    # En segundo plano: activa HTTPS en cuanto aparece el certificado y recarga Nginx cada
    # 6 horas para tomar los certificados renovados por certbot.
    (
      elapsed=0
      while sleep 60; do
        elapsed=$((elapsed + 60))
        if [ "$https_active" = false ] && [ -f "$SSL_CERT" ]; then
          render https.conf.template
          https_active=true
          echo "40-app-config: certificado encontrado, activando HTTPS"
          nginx -s reload
        elif [ "$elapsed" -ge 21600 ]; then
          elapsed=0
          nginx -s reload
        fi
      done
    ) &
    ;;

  *)
    echo "40-app-config: TLS_MODE='${TLS_MODE}' no válido (usa none, custom o letsencrypt)" >&2
    exit 1
    ;;
esac
