# syntax=docker/dockerfile:1

# ─── Dependencias completas (para compilar) ─────────────────────
FROM node:24.22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

# ─── Compilación TypeScript → dist/ ─────────────────────────────
FROM deps AS build
COPY tsconfig.json tsconfig.build.json ./
COPY src ./src
RUN npm run build

# ─── Solo dependencias de producción ────────────────────────────
FROM node:24.22-alpine AS prod-deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --no-audit --no-fund && npm cache clean --force

# ─── Imagen final ───────────────────────────────────────────────
FROM node:24.22-alpine
ENV NODE_ENV=production
WORKDIR /app

# Archivos propiedad de root y de solo lectura para el usuario que ejecuta la app
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package.json ./

# Usuario sin privilegios incluido en la imagen oficial de Node
USER node

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "dist/index.js"]
