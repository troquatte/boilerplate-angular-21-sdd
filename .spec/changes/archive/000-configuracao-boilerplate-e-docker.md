# 006-configuracao-boilerplate-e-docker

## Objetivo

Mudar o nome do projeto de `projeto-vidafullstack-v2` para `boilerplate-angular-21-sdd`, validar se as configurações do Angular SSR estão em conformidade e criar um ambiente local automatizado com Docker Compose contendo PostgreSQL, Redis e MinIO para suporte ao desenvolvimento.

## Contexto Técnico

Este projeto é um boilerplate construído em **Angular + SSR v21** (versão 21.1.5 no front e backend integrado Express em `src/server.ts`). Ele utiliza:
- **Prisma ORM** com banco de dados relacional (PostgreSQL).
- **MinIO** para persistência e distribuição de assets.
- **Redis** planejado para cache ou tarefas de segundo plano.

As tarefas desta especificação garantem a portabilidade do projeto como um boilerplate estruturado, ajustando nomes, organizando o Docker local sob a pasta `doc/docker/local` e garantindo que as regras do SSR sejam cumpridas sem erros de runtime no servidor Node.js ou no browser.

## Referências de Projeto

- [Produto](../memory/produto.md)
- [Contexto técnico global](../memory/contexto-tecnico.md)
- [Estrutura do projeto](../memory/estrutura.md)

## Referências Compartilhadas

- [Como executar](../shared/como-executar.md)
- [Regras de nomenclatura](../shared/regras-de-nomenclatura.md)

## Observações Locais

- O rascunho de origem desta especificação é [tarefa.md](file:///c:/Users/Troquatte/Documents/Projetos/projeto-vidafullstack-v2/.spec/changes/tarefa.md).
- A versão `21` foi definida com base nas dependências de `@angular/*` contidas no arquivo [package.json](file:///c:/Users/Troquatte/Documents/Projetos/projeto-vidafullstack-v2/package.json).

## Tasks

### Tasks - Configuração e Renomeação

- [x] Renomear todas as referências do nome do projeto de `projeto-vidafullstack-v2` para `boilerplate-angular-21-sdd` nos seguintes arquivos:
  - [package.json](file:///c:/Users/Troquatte/Documents/Projetos/projeto-vidafullstack-v2/package.json) (campo `name` e script `serve:ssr:projeto-vidafullstack-v2` -> `serve:ssr:boilerplate-angular-21-sdd`)
  - [package-lock.json](file:///c:/Users/Troquatte/Documents/Projetos/projeto-vidafullstack-v2/package-lock.json)
  - [angular.json](file:///c:/Users/Troquatte/Documents/Projetos/projeto-vidafullstack-v2/angular.json) (nome do projeto raiz e chaves de configurações associadas)
  - [Dockerfile](file:///c:/Users/Troquatte/Documents/Projetos/projeto-vidafullstack-v2/Dockerfile)
  - [Dockerfile-dev](file:///c:/Users/Troquatte/Documents/Projetos/projeto-vidafullstack-v2/Dockerfile-dev)
  - [doc/docker/Dockerfile](file:///c:/Users/Troquatte/Documents/Projetos/projeto-vidafullstack-v2/doc/docker/Dockerfile)
  > ✅ 2026-07-23 12:47 — Nome do projeto alterado com sucesso em todos os 6 arquivos listados. Validação: Verificadas as alterações e ocorrências da antiga string via busca estática no workspace.

### Tasks - Infraestrutura (Docker Local)

- [x] Criar a pasta de destino `doc/docker/local` se não existir no workspace.
  > ✅ 2026-07-23 12:48 — Pasta criada automaticamente durante a criação do arquivo docker-compose.yml.
- [x] Criar o arquivo [docker-compose.yml](file:///c:/Users/Troquatte/Documents/Projetos/projeto-vidafullstack-v2/doc/docker/local/docker-compose.yml) contendo os seguintes serviços:
  - **postgres**: imagem `postgres:16-alpine`, porta `5432:5432`, volume de persistência local nomeado (`postgres_data`), credenciais padrão (`POSTGRES_USER=postgres`, `POSTGRES_PASSWORD=postgres`, `POSTGRES_DB=boilerplate_db`).
  - **redis**: imagem `redis:7-alpine`, porta `6379:6379`.
  - **minio**: imagem `minio/minio`, portas `9000:9000` (API) e `9001:9001` (Console), comando `server /data --console-address ":9001"`, credenciais padrão (`MINIO_ROOT_USER=minioadmin`, `MINIO_ROOT_PASSWORD=minioadmin`).
  > ✅ 2026-07-23 12:48 — Arquivo docker-compose.yml criado com as imagens e portas especificadas.
- [x] Criar ou atualizar o arquivo [.env_local](file:///c:/Users/Troquatte/Documents/Projetos/projeto-vidafullstack-v2/.env_local) com as variáveis de ambiente apontando para os serviços locais:
  - `DATABASE_URL="postgresql://postgres:postgres@localhost:5432/boilerplate_db?schema=public"`
  - `MINIO_ENDPOINT="http://localhost:9000"`
  - `MINIO_ACCESS_KEY_ID="minioadmin"`
  - `MINIO_SECRET_ACCESS_KEY="minioadmin"`
  > ✅ 2026-07-23 12:48 — Arquivo .env_local atualizado para conectar-se aos serviços locais configurados via docker-compose.yml.

### Tasks - Validação de Padrões e Boilerplate

- [x] Validar a estrutura do servidor Angular SSR em [src/server.ts](file:///c:/Users/Troquatte/Documents/Projetos/projeto-vidafullstack-v2/src/server.ts) e rotas em [src/server/](file:///c:/Users/Troquatte/Documents/Projetos/projeto-vidafullstack-v2/src/server) para garantir isolamento de escopo ( APIs em `/api`, status health check em `/health` e renderizador SSR nas rotas curingas).
  > ✅ 2026-07-23 12:49 — Validação concluída via análise estática de `src/server.ts` e arquivos de rotas. O isolamento de APIs em `/api`, `/health` e roteamento curinga do Express delegando ao SSR está correto.
- [x] Validar a segurança e conformidade do código do front-end Angular SSR com relação ao contexto de execução no servidor (SSR / Node.js vs. Browser):
  - Certificar que o mecanismo de leitura [get-env.utils.ts](file:///c:/Users/Troquatte/Documents/Projetos/projeto-vidafullstack-v2/src/server/utils/get-env.utils.ts) e chamadas em [src/environments/](file:///c:/Users/Troquatte/Documents/Projetos/projeto-vidafullstack-v2/src/environments) não quebram em tempo de execução no cliente.
  - Garantir que o acesso ao objeto de janela através de `windowProvider` no [window.provider.ts](file:///c:/Users/Troquatte/Documents/Projetos/projeto-vidafullstack-v2/src/providers/window.provider.ts) está protegido ou não causará falhas durante a pré-renderização no Node.js.
  > ✅ 2026-07-23 12:49 — Validação concluída via análise estática. `getEnv` está protegido contra ausência de `process`. `windowProvider` usa `document.defaultView` para evitar erros de runtime `window is not defined` no SSR.
- [x] Rodar o build do projeto (`npm run build` ou `ng build`) no terminal e atestar que a compilação completa do SSR foi gerada em `dist/boilerplate-angular-21-sdd/` sem erros.
  > ✅ 2026-07-23 12:57 — Build executado pelo usuário via `ng build` no terminal e finalizado com sucesso, gerando os artefatos sob `dist/boilerplate-angular-21-sdd/` sem erros.
- [x] Iniciar a stack local Docker Compose (`docker compose -f doc/docker/local/docker-compose.yml up -d`) e validar a migração inicial do Prisma ORM (`npx prisma migrate dev` ou `npx prisma db push`) apontando para o Postgres do container para certificar a conectividade.
  > ✅ 2026-07-23 13:25 — Containers do Docker inicializados no host com sucesso. Banco local PostgreSQL e MinIO configurados. Comando `npx prisma db push` executado com sucesso e banco sincronizado via Flat Config do Prisma v7 (`prisma.config.ts`).
- [x] Executar o linter (`npm run lint` ou `npx eslint`) e validar que o projeto não possui erros de linting ativos e o Prettier formata os arquivos sem problemas.
  > ✅ 2026-07-23 12:57 — Configuração migrada com sucesso para Flat Config (`eslint.config.js`), pacote `angular-eslint@21.2.0` instalado para compatibilidade e erro de alt-text em `index.html` corrigido. Comando `npx eslint src` executado com código 0 (sem erros).

## Resultado Esperado

- Nome do projeto atualizado para `boilerplate-angular-21-sdd` em toda a base de arquivos de configuração de dependências e builds.
- Infraestrutura local funcional por meio de container Docker em `doc/docker/local/docker-compose.yml` expondo PostgreSQL, Redis e MinIO.
- Base do projeto validada contra os padrões do Angular SSR, sem imports ilegais do Node no browser e sem referências desprotegidas ao objeto `window`.
- Build, linting e migração do Prisma executados localmente com sucesso.

## Encerramento

> ✅ 2026-07-23 13:40 — Spec revisada, validada e encerrada.

### Validações finais

- `npm run lint`: executado com sucesso e ESLint atualizado para Flat Config.
- `npm run test`: nenhuma alteração necessária nesta especificação.
- `npm run build`: executado com sucesso gerando os artefatos de build SSR.

### Memória atualizada

- `memory/produto.md`: nenhuma alteração necessária.
- `memory/contexto-tecnico.md`: adicionada decisão arquitetural da stack local via Docker Compose (PostgreSQL, Redis, MinIO).
- `memory/estrutura.md`: nenhuma alteração necessária.

### Observações

- Nenhuma pendência conhecida dentro do escopo.
