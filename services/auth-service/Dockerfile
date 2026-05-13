# ---- Etapa 1: Builder ----
# Instala TODAS las dependencias (incluyendo devDeps) y compila TypeScript
FROM node:20-alpine AS builder
WORKDIR /app

# Copiar manifiestos primero para aprovechar la caché de Docker
COPY package*.json ./
COPY shared/package*.json ./shared/
COPY services/auth-service/package*.json ./services/auth-service/

RUN npm ci --workspace=@crud-ms/shared --workspace=@crud-ms/auth-service

# Copiar código fuente
COPY shared/ ./shared/
COPY services/auth-service/ ./services/auth-service/
COPY tsconfig.base.json ./

# Compilar TypeScript
RUN npm run build --workspace=@crud-ms/shared
RUN npm run build --workspace=@crud-ms/auth-service

# ---- Etapa 2: Production ----
# Solo lo necesario para correr la app (sin devDeps, sin fuentes TS)
FROM node:20-alpine AS production
WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
COPY shared/package*.json ./shared/
COPY services/auth-service/package*.json ./services/auth-service/

RUN npm ci --omit=dev --workspace=@crud-ms/shared --workspace=@crud-ms/auth-service

# Solo copiar archivos compilados
COPY --from=builder /app/shared/dist ./shared/dist
COPY --from=builder /app/services/auth-service/dist ./services/auth-service/dist

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD wget -qO- http://localhost:3001/health || exit 1

CMD ["node", "services/auth-service/dist/server.js"]
