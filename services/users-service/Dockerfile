FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
COPY shared/package*.json ./shared/
COPY services/users-service/package*.json ./services/users-service/

RUN npm ci --workspace=@crud-ms/shared --workspace=@crud-ms/users-service

COPY shared/ ./shared/
COPY services/users-service/ ./services/users-service/
COPY tsconfig.base.json ./

RUN npm run build --workspace=@crud-ms/shared
RUN npm run build --workspace=@crud-ms/users-service

FROM node:20-alpine AS production
WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
COPY shared/package*.json ./shared/
COPY services/users-service/package*.json ./services/users-service/

RUN npm ci --omit=dev --workspace=@crud-ms/shared --workspace=@crud-ms/users-service

COPY --from=builder /app/shared/dist ./shared/dist
COPY --from=builder /app/services/users-service/dist ./services/users-service/dist

EXPOSE 3002

HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD wget -qO- http://localhost:3002/health || exit 1

CMD ["node", "services/users-service/dist/server.js"]
