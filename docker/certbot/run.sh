#!/bin/sh
# Emite el certificado de Let's Encrypt para $DOMAIN la primera vez (reto HTTP-01 vía Nginx)
# y luego intenta renovarlo cada 12 horas (certbot solo renueva si faltan < 30 días).
# Al ejecutar este servicio aceptas los términos de servicio de Let's Encrypt (--agree-tos).
set -u

: "${DOMAIN:?Define DOMAIN en .env.production}"
: "${CERTBOT_EMAIL:?Define CERTBOT_EMAIL en .env.production}"

STAGING_FLAG=""
if [ "${CERTBOT_STAGING:-false}" = "true" ]; then
  # Certificados de prueba (no confiables) para no agotar el límite de emisiones mientras se configura
  STAGING_FLAG="--staging"
fi

trap 'exit 0' TERM INT

while :; do
  if [ ! -f "/etc/letsencrypt/live/${DOMAIN}/fullchain.pem" ]; then
    echo "certbot: solicitando certificado para ${DOMAIN}"
    if certbot certonly --webroot -w /var/www/certbot \
      -d "${DOMAIN}" --email "${CERTBOT_EMAIL}" \
      --agree-tos --no-eff-email --non-interactive ${STAGING_FLAG}; then
      wait_time=12h
    else
      echo "certbot: falló la emisión (¿el DNS de ${DOMAIN} apunta a este servidor y el puerto 80 está abierto?). Reintento en 5 minutos."
      wait_time=5m
    fi
  else
    certbot renew --webroot -w /var/www/certbot --quiet
    wait_time=12h
  fi
  sleep "$wait_time" &
  wait $!
done
