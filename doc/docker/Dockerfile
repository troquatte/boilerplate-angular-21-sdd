# # ===== build =====
# FROM node:20-alpine AS build
# WORKDIR /app
# COPY package*.json ./
# RUN npm ci
# COPY . .
# # Gera browser + server (SSR)
# RUN npx ng build

# # ===== runtime =====
# FROM node:20-alpine
# WORKDIR /app
# COPY --from=build /app/dist ./dist
# ENV NODE_ENV=production \
#     PORT=4000 \
#     HOST=0.0.0.0
# EXPOSE 4000
# # opcional: healthcheck (crie uma rota /health no server)
# # HEALTHCHECK --interval=30s --timeout=5s --retries=3 CMD wget -qO- http://localhost:4000/health || exit 1
# CMD ["node", "dist/boilerplate-angular-21-sdd/server/server.mjs"]


# syntax=docker/dockerfile:1.6

# ===== build =====
FROM node:20-alpine AS build
WORKDIR /app

# dependências nativas mínimas (caso alguma lib de build precise)
RUN apk add --no-cache python3 make g++ git

COPY package*.json ./
# cache do npm (buildkit) acelera builds
RUN --mount=type=cache,target=/root/.npm npm ci

COPY . .
# Gera browser + server (SSR)
RUN npx ng build

# ===== runtime =====
FROM node:20-alpine

# tini para reaping de processos
RUN apk add --no-cache tini

# cria usuário não-root
RUN addgroup -S app && adduser -S app -G app

WORKDIR /app
COPY --from=build /app/dist ./dist

ENV NODE_ENV=production \
    PORT=4000 \
    HOST=0.0.0.0 \
    # mapas de source para stacktraces melhores
    NODE_OPTIONS=--enable-source-maps

EXPOSE 4000

# healthcheck (implemente GET /health no seu server)
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -qO- http://localhost:4000/health || exit 1

USER app

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "dist/boilerplate-angular-21-sdd/server/server.mjs"]
