FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
COPY shared/package*.json ./shared/
COPY services/products-service/package*.json ./services/products-service/

RUN npm ci --workspace=@crud-ms/shared --workspace=@crud-ms/products-service

COPY shared/ ./shared/
COPY services/products-service/ ./services/products-service/
COPY tsconfig.base.json ./

RUN npm run build --workspace=@crud-ms/shared
RUN npm run build --workspace=@crud-ms/products-service

FROM node:20-alpine AS production
WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
COPY shared/package*.json ./shared/
COPY services/products-service/package*.json ./services/products-service/

RUN npm ci --omit=dev --workspace=@crud-ms/shared --workspace=@crud-ms/products-service

COPY --from=builder /app/shared/dist ./shared/dist
COPY --from=builder /app/services/products-service/dist ./services/products-service/dist

EXPOSE 3003

HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD wget -qO- http://localhost:3003/health || exit 1

CMD ["node", "services/products-service/dist/server.js"]
