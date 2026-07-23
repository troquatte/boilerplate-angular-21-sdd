# Tarefas Pendentes - Módulo de Autenticação e Segurança (Gap Specs 001-005)

Este arquivo documenta as tarefas de autenticação e segurança planejadas nas especificações arquivadas (`001` a `005`) que ainda não foram implementadas ou que divergem no código atual do sistema.

## 1. Adequação de Rotas e Endpoints (Alinhamento de Escopo)

- [ ] Criar o endpoint de cadastro de novos usuários em `POST /api/auth/register` (atualmente exposto sob a rota de negócio `/api/user` POST).
- [ ] Criar o endpoint de logout em `POST /api/auth/logout` que invalida o Refresh Token do usuário.
- [ ] Ajustar a rota de Refresh Token para `POST /api/auth/refresh` (atualmente exposta em `POST /api/auth/token`).
- [ ] Ajustar as rotas de Reset de Senha no roteador de autenticação para `POST /api/auth/forgot-password` (solicitação) e `POST /api/auth/reset-password` (redefinição), substituindo as rotas `/api/reset-password` existentes.
- [ ] Criar rota simulada protegida `GET /api/protected/profile` para fins de validação do middleware de autenticação.
- [ ] Ajustar o validador de Zod do login para exigir tamanho mínimo de 6 caracteres na senha (atualmente valida apenas se não está vazia).

## 2. Segurança de Sessão e Tokens (Cookies HttpOnly)

- [ ] Instalar a biblioteca `cookie-parser` e seus `@types` para suporte a cookies no Express.
- [ ] Alterar o fluxo de retorno de JWT no login e refresh para salvar os tokens (`accessToken` e `refreshToken`) em cookies HTTP-only seguros:
  - Configurar as flags: `httpOnly: true`, `secure: true` (se ambiente de produção) e `sameSite: 'strict'`.
  - Remover o envio dos tokens no corpo JSON de resposta.
- [ ] Adaptar o middleware `MiddlewareAuth` para ler o `accessToken` a partir dos cookies do request (`req.cookies`), e não do header `Authorization: Bearer`.
- [ ] Ajustar o payload do `accessToken` para conter **apenas o e-mail** do usuário (atualmente o payload assina o objeto de usuário completo).

## 3. Persistência de Refresh Tokens e Validação de Reset (Prisma)

- [ ] Atualizar o model `User` no arquivo `prisma/schema.prisma` para incluir os campos de controle de sessão e tokens temporários:
  - Campo/relação para persistir `refreshToken` ativos, permitindo revogação no logout.
  - Campo `passwordResetExpires` no model `ResetPasswordSecret` para garantir expiração de 1 hora do token de reset (atualmente o segredo dura indefinidamente).
- [ ] Executar o migrate do banco (`npx prisma migrate dev` ou `npx prisma db push`) para atualizar a modelagem.
- [ ] Adaptar o `AuthService` para registrar e revogar os refresh tokens no banco.
- [ ] Adaptar o `ResetPasswordService` para validar a expiração do token de reset e forçar o logout geral do usuário (deletando todos os seus refresh tokens) ao redefinir a senha com sucesso.

## 4. Políticas de Segurança e Infraestrutura (Rate Limit e Sanitização)

- [ ] Instalar o pacote `express-rate-limit` no projeto.
- [ ] Configurar o Rate Limiting no `src/server.ts` sob as rotas `/api/auth/*` para mitigar ataques de Brute Force (ex: máximo 5 tentativas a cada 15 minutos).
- [ ] Implementar middleware de sanitização simples nos payloads das rotas de autenticação para evitar ataques de Injeção de Scripts (XSS) e poluição de parâmetros.

## 5. Suites de Teste e Validação (Garantia de Qualidade)

- [ ] Instalar dependências de testes automatizados do Express (`jest`, `supertest`, `ts-jest` e seus `@types`) nas devDependencies.
- [ ] Configurar script de testes de integração do backend no `package.json`.
- [ ] Criar a suite de testes automatizados de integração do Express validando:
  - Teste do Rate Limiting bloqueando chamadas consecutivas de login (`429 Too Many Requests`).
  - Teste de presença dos cookies seguros `HttpOnly` no login.
  - Teste de validações e rejeições de injeções de script em inputs.
  - Teste dos fluxos de sucesso e erro das rotas de autenticação.
- [ ] Criar o arquivo REST Client `src/server/auth.integration.http` para permitir validações manuais rápidas de todos os cenários de sucesso, erro e segurança.
