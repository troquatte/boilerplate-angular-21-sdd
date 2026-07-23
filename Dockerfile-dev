# syntax=docker/dockerfile:1.6

# ===== build =====
FROM node:24-alpine AS build
WORKDIR /app

# deps nativas
RUN apk add --no-cache python3 make g++ git

# evita erro do husky em container sem .git
ENV HUSKY=0

# 1) instalar deps com cache
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm npm ci

# copia o .env.dev e define como padrão no build
COPY .env .env

# usa as variáveis do .env durante o prisma generate
ENV $(cat .env | xargs)

# 2) copiar código
COPY . .

# 3) gerar prisma client (antes do build SSR)
RUN npx prisma generate

# 4) build angular ssr
RUN npx ng build --configuration development


# ===== runtime =====
FROM node:24-alpine
RUN apk add --no-cache tini

# usuário não-root
RUN addgroup -S app && adduser -S app -G app
USER app
WORKDIR /app

ENV NODE_ENV=production \
    PORT=4000 \
    HOST=0.0.0.0 \
    NODE_OPTIONS=--enable-source-maps

# copie node_modules já com @prisma/client gerado
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package*.json ./
COPY --from=build /app/dist ./dist

EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -qO- http://localhost:4000/health || exit 1

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "dist/boilerplate-angular-21-sdd/server/server.mjs"]
