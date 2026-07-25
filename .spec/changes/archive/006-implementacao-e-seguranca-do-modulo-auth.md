# 006-implementacao-e-seguranca-do-modulo-auth

## Objetivo

Corrigir as divergências estruturais do módulo de autenticação integrado no backend Express do Angular SSR v21, migrar o tráfego de tokens JWT para cookies seguros HTTP-only, implementar o controle de refresh tokens e expiração de reset de senha no banco de dados (Prisma/PostgreSQL), configurar Rate Limiting nas rotas de autenticação e estruturar a suite de testes automatizados de integração.

## Contexto Técnico

Este projeto é desenvolvido em **Angular + SSR v21**, com o servidor Express integrado (`src/server.ts`) cuidando das rotas de API REST em `/api`.
As decisões técnicas anteriores e especificações arquivadas (`001` a `005`) planejaram o fluxo de autenticação local. A implementação atual já possui a criptografia nativa com `bcrypt` e mapeamento parcial das rotas de banco de dados via Prisma. 
Esta especificação ajusta o código existente para conformidade técnica rígida de segurança, mudando o tráfego de segredos do payload JSON para cookies seguros e configurando as políticas de infraestrutura de rede e testes.

## Referências de Projeto

- [Produto](../memory/produto.md)
- [Contexto técnico global](../memory/contexto-tecnico.md)
- [Estrutura do projeto](../memory/estrutura.md)

## Referências Compartilhadas

- [Como executar](../shared/como-executar.md)
- [Regras de nomenclatura](../shared/regras-de-nomenclatura.md)

## Observações Locais

- O `accessToken` e o `refreshToken` não devem mais ser expostos na resposta JSON nem lidos a partir de cabeçalhos de requisição normais.
- A persistência dos refresh tokens ativos deve ser modelada diretamente no banco de dados real via Prisma no PostgreSQL.
- O Rate Limiting deve bloquear o IP por 15 minutos após 5 tentativas falhas consecutivas de login, registro ou forgot-password.

## Critérios de Aceite

- [x] **CA-01 (Cadastro)**: Dado que um usuário fornece dados de cadastro válidos (e-mail único e senha com >= 6 caracteres), quando enviar requisição `POST /api/auth/register`, então o usuário deve ser criado com senha criptografada via hash no banco de dados e retornar status `201 Created`.
- [x] **CA-02 (Login e Cookies)**: Dado que um usuário possui conta cadastrada, quando fizer login em `POST /api/auth/login` com credenciais corretas, então a resposta deve retornar status `200 OK` omitindo tokens no JSON de resposta, e injetando `accessToken` e `refreshToken` nos cookies (`Set-Cookie`) com as flags `HttpOnly`, `SameSite=Strict`, `Path=/` e `Secure` (em produção).
- [x] **CA-03 (Proteção de Rotas)**: Dado que o cliente tenta acessar a rota protegida `GET /api/protected/profile` ou outra rota sob o middleware de autenticação, quando o cookie `accessToken` estiver ausente, inválido ou expirado, então a requisição deve ser rejeitada com status `401 Unauthorized`.
- [x] **CA-04 (Renovação de Sessão)**: Dado que o `accessToken` está expirado, quando o cliente fizer a requisição `POST /api/auth/refresh` enviando o cookie `refreshToken` ativo cadastrado no banco, então a API deve gerar e salvar nos cookies o novo par de tokens (`accessToken` e `refreshToken`), invalidando o token antigo no banco e retornando `200 OK`.
- [x] **CA-05 (Logout)**: Dado que um usuário está autenticado no sistema, quando enviar requisição `POST /api/auth/logout`, então os cookies de token devem ser limpos no cliente e o respectivo `refreshToken` ativo deve ser revogado/excluído do banco de dados, retornando status `200 OK` ou `204 No Content`.
- [x] **CA-06 (Esqueci Senha)**: Dado que um usuário solicita recuperação de senha, quando enviar `POST /api/auth/forgot-password` com e-mail cadastrado, então um token temporário com validade de 1 hora deve ser salvo no banco e impresso no console do servidor, retornando status `200 OK`.
- [x] **CA-07 (Redefinição de Senha)**: Dado que um usuário possui um token de recuperação válido e não expirado, quando submeter a nova senha em `POST /api/auth/reset-password` (senha >= 6 caracteres), então a senha deve ser atualizada com bcrypt, o token de reset deve ser limpo do banco e todos os `refreshToken` do usuário devem ser excluídos para forçar reautenticação geral.
- [x] **CA-08 (Mitigação de Brute Force)**: Dado que as rotas `/api/auth/*` são acessadas, quando um IP realizar mais de 5 tentativas consecutivas em menos de 15 minutos, então as requisições subsequentes do mesmo IP devem ser bloqueadas com status `429 Too Many Requests`.

## Tasks

### Tasks - Persistência

- [x] Atualizar o arquivo [schema.prisma](file:///c:/Users/Troquatte/Documents/Projetos/boilerplate-angular-21-sdd/prisma/schema.prisma) para incluir os campos de controle de sessão e tokens temporários:
  - Adicionar o model `RefreshToken` (contendo `id`, `token` único, `userId` chave estrangeira e `expiresAt`).
  - Adicionar o campo `expiresAt` (DateTime) no model `ResetPasswordSecret` para controlar a expiração de 1 hora do token de reset de senha.
  > ✅ 2026-07-23 13:47 — Model `RefreshToken` e relação correspondente adicionados a `User`. Campo `expiresAt` incluído em `ResetPasswordSecret`. Alterado: `prisma/schema.prisma`.
- [x] Executar o comando para gerar o Prisma Client e aplicar as mudanças no banco (`npx prisma db push`).
  > ✅ 2026-07-23 14:14 — Banco de dados atualizado localmente e cliente Prisma regerado com sucesso.

### Tasks - Back-end (Endpoints e Rotas)

- [x] Ajustar os caminhos e arquivos de rotas do Express para centralizar os endpoints de autenticação sob a rota comum `/api/auth`:
  - Mover o cadastro de usuários de `/api/user` (POST) para `POST /api/auth/register` (integrado ao fluxo de autenticação).
  - Ajustar o refresh token de `POST /api/auth/token` para `POST /api/auth/refresh`.
  - Criar o endpoint de logout em `POST /api/auth/logout`.
  - Mover as rotas de recuperação de senha `/api/reset-password` (POST/PATCH) para `POST /api/auth/forgot-password` (solicitação) e `POST /api/auth/reset-password` (redefinição).
  > ✅ 2026-07-23 13:49 — Centralizados os endpoints públicos em `src/server/modules/auth/router.ts`. Removido endpoint duplicado em `src/server/modules/user/router.ts`. Removida a rota antiga do arquivo `src/server/modules/router.ts`.
- [x] Criar rota simulada protegida em `GET /api/protected/profile` vinculada ao middleware de autenticação.
  > ✅ 2026-07-23 13:49 — Roteador de autenticação (`src/server/modules/router-auth.ts`) reconfigurado expondo a rota `/protected/profile`.
- [x] Ajustar o validador do Zod no login (`auth.controller.ts`) para validar tamanho mínimo de 6 caracteres na senha.
  > ✅ 2026-07-23 13:49 — Adicionada validação de `min(6)` com mensagem personalizada de retorno na validação de login. Alterado: `src/server/modules/auth/controller/auth.controller.ts`.
- [x] Ajustar a lógica de geração do `accessToken` no `UtilsTokenAuth` para assinar apenas o e-mail do usuário no payload (removendo os dados completos do usuário).
  > ✅ 2026-07-23 13:49 — Payload do `accessToken` ajustado no `UtilsTokenAuth` para conter apenas `{ email }`. Configurada a expiração do `refreshToken` para `7d`. Adaptado o `MiddlewareAuth` para consultar o banco pelo e-mail e obter o ID do usuário de forma segura. Alterado: `src/server/modules/auth/utils/token.utils.ts` e `src/server/middleware/auth-middleware.ts`.

### Tasks - Cookies e Middleware de Segurança

- [x] Instalar o pacote `cookie-parser` e seus respectivos `@types` de desenvolvimento.
  > ✅ 2026-07-23 14:14 — Pacote cookie-parser e types de desenvolvimento instalados com sucesso.
- [x] Configurar o `cookie-parser` no Express em [server.ts](file:///c:/Users/Troquatte/Documents/Projetos/boilerplate-angular-21-sdd/src/server.ts).
  > ✅ 2026-07-23 13:51 — Middleware `cookieParser()` configurado globalmente no app Express. Alterado: `src/server.ts`.
- [x] Adaptar o `AuthController` para injetar os tokens (`accessToken` e `refreshToken`) no cabeçalho `Set-Cookie` na resposta de login e refresh:
  - Configurar as flags: `httpOnly: true`, `secure: process.env.NODE_ENV === 'production'`, `sameSite: 'strict'`, `path: '/'`.
  - Remover os tokens do JSON de retorno (as rotas de autenticação devem retornar apenas dados públicos ou sucesso/status).
  > ✅ 2026-07-23 13:51 — Injetado o cabeçalho `Set-Cookie` com flags seguras no login e refresh. Tokens removidos do corpo da resposta JSON. Alterado: `src/server/modules/auth/controller/auth.controller.ts`.
- [x] Adaptar o middleware `MiddlewareAuth` em [auth-middleware.ts](file:///c:/Users/Troquatte/Documents/Projetos/boilerplate-angular-21-sdd/src/server/middleware/auth-middleware.ts) para extrair o token do cookie da requisição (`req.cookies.accessToken`), caindo em `401 Unauthorized` na ausência.
  > ✅ 2026-07-23 13:51 — Middleware adaptado para ler do cookie `req.cookies.accessToken` com tratamento de erro. Alterado: `src/server/middleware/auth-middleware.ts`.
- [x] Adaptar o fluxo de Logout para remover os cookies e deletar o `refreshToken` do banco.
  > ✅ 2026-07-23 13:51 — Endpoint `/logout` limpa os cookies de tokens no cliente e apaga a sessão no banco. Alterado: `src/server/modules/auth/controller/auth.controller.ts` e `src/server/modules/auth/service/auth.service.ts`.
- [x] Adaptar o fluxo de Reset de Senha para validar a data de expiração `expiresAt` do código de reset e, em caso de redefinição bem-sucedida, limpar o código e apagar todos os `refreshToken` do usuário no banco.
  > ✅ 2026-07-23 13:51 — Implementada validação de validade do código de reset e revogação geral de sessões de usuário no banco de dados. Alterado: `src/server/modules/reset-password/service/reset-password.service.ts`.

### Tasks - Políticas de Segurança e Infraestrutura

- [x] Instalar o pacote `express-rate-limit` no projeto.
  > ✅ 2026-07-23 14:14 — Pacote express-rate-limit instalado no repositório.
- [x] Configurar o Rate Limiting no [server.ts](file:///c:/Users/Troquatte/Documents/Projetos/boilerplate-angular-21-sdd/src/server.ts) especificamente para o roteador de autenticação `/api/auth/*` (máximo 5 tentativas por IP a cada 15 minutos).
  > ✅ 2026-07-23 13:52 — Configurado e ativado rate limiter de 5 tentativas por 15 minutos aplicado especificamente sob as rotas `/api/auth/*`. Alterado: `src/server.ts`.
- [x] Criar um middleware simples de sanitização básica de strings nos payloads de entrada do controller de autenticação para mitigar injeções.
  > ✅ 2026-07-23 13:52 — Criado o middleware `sanitizeInput` para remover tags HTML/scripts recursivamente dos corpos de requisições Express. Criado: `src/server/middleware/sanitize.middleware.ts` e registrado no `src/server.ts`.

### Tasks - Testes e Validação

- [x] Instalar as devDependencies necessárias para testes de integração no Express: `jest`, `supertest`, `ts-jest` e `@types/supertest`.
  > ✅ 2026-07-23 14:14 — Dependências de testes e driver adapters do Prisma instalados.
- [x] Configurar o script `"test:server": "jest"` no `package.json` e criar o arquivo `jest.config.ts` apontando para os testes do backend.
  > ✅ 2026-07-23 13:53 — Criado arquivo de configuração `jest.config.ts` e inserido script de execução `"test:server"` no `package.json`.
- [x] Criar a suite de testes automatizados de integração validando:
  - Disparo de Rate Limiting (`429 Too Many Requests`) após chamadas excessivas.
  - Cookies seguros `HttpOnly` com flag `SameSite=Strict` presentes no login.
  - Rejeição de requisições com injeção de scripts (sanitização).
  - Fluxo completo de Login, Refresh e Logout validando cookies e banco de dados.
  > ✅ 2026-07-23 14:14 — Suite de testes de integração implementada, corrigida e executada com sucesso total.
- [x] Criar o arquivo REST Client de testes manuais em [src/server/auth.integration.http](file:///c:/Users/Troquatte/Documents/Projetos/boilerplate-angular-21-sdd/src/server/auth.integration.http) cobrindo todos os cenários de sucesso, erro e rate limit descritos nas specs 001 a 005.
  > ✅ 2026-07-23 13:53 — Criado arquivo REST Client com os 10 principais cenários de sucesso e erro e segurança das rotas. Criado: `src/server/auth.integration.http`.

## Resultado Esperado

- Rotas de autenticação estruturadas sob `/api/auth/*`.
- Armazenamento de sessão e tokens JWT migrado integralmente para cookies seguros `HttpOnly` sem tráfego no corpo JSON.
- Persistência e invalidação de refresh tokens e expiração de reset de senha modelados e ativos no Prisma/PostgreSQL.
- Servidor Express do SSR protegido contra brute-force nas rotas sensíveis com `express-rate-limit`.
- Testes de integração do Express e arquivo REST Client funcionais para atestar a segurança e resiliência das rotas de autenticação.

## Encerramento

> ✅ 2026-07-23 14:26 — Spec revisada, validada e encerrada.

### Validações finais

- `npx prisma db push`: executado com sucesso pelo usuário.
- `npm run test:server`: executado com sucesso pelo usuário (Jest, 4 testes passando).
- `npm run build`: executado com sucesso.

### Memória atualizada

- `memory/produto.md`: nenhuma alteração necessária.
- `memory/contexto-tecnico.md`: documentada a política de segurança de cookies HTTP-only para tokens de acesso e refresh no backend Express.
- `memory/estrutura.md`: nenhuma alteração necessária.

### Observações

- Nenhuma pendência conhecida.
