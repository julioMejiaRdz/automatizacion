# syntax=docker/dockerfile:1
# Imagen "web": compila el frontend y lo sirve con Nginx, que además hace de reverse proxy
# hacia el backend (/api y /socket.io) y termina HTTPS con certificados de Let's Encrypt.
# Contexto de build: raíz del repositorio (ver docker-compose.prod.yml).

# ─── Build del frontend ─────────────────────────────────────────
FROM node:24.22-alpine AS build
WORKDIR /app
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY frontend/ ./

# En producción la API y Socket.IO se sirven en el mismo dominio que el frontend
ARG VITE_APP_NAME=Automatización
ENV VITE_APP_NAME=$VITE_APP_NAME \
    VITE_API_URL=/api \
    VITE_WS_URL=
RUN npm run build

# ─── Nginx ──────────────────────────────────────────────────────
FROM nginx:1.30-alpine

# La configuración se genera al arrancar (HTTP solo o HTTP + HTTPS según existan certificados)
RUN rm -f /etc/nginx/conf.d/default.conf
COPY docker/nginx/templates/ /etc/nginx/app-templates/
COPY docker/nginx/snippets/ /etc/nginx/snippets/
COPY --chmod=0755 docker/nginx/40-app-config.sh /docker-entrypoint.d/40-app-config.sh
COPY --from=build /app/dist /usr/share/nginx/html

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1/healthz || exit 1
