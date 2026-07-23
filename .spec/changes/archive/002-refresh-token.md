# 002-refresh-token

## Objetivo

Implementar o mecanismo de Refresh Token no backend integrado do Angular SSR v21, com expiração do token JWT de acesso definida em 15 minutos e validação completa dos fluxos de sucesso e erro.

## Contexto Técnico

- Backend/API embutido no servidor do Angular SSR (Express).
- Tempo de expiração do JWT de acesso (accessToken): `15m`.
- O login agora deve retornar tanto o `accessToken` quanto o `refreshToken`.
- Novo endpoint `POST /api/auth/refresh` para renovar o `accessToken`.
- Simulação de persistência dos refresh tokens ativos associados aos usuários no banco JSON `users-db.json`.

## Referências de Projeto

- [Produto](../memory/produto.md)
- [Contexto técnico global](../memory/contexto-tecnico.md)
- [Estrutura do projeto](../memory/estrutura.md)
- [001-modulo-autenticacao](./001-modulo-autenticacao.md)

## Referências Compartilhadas

- [Como executar](../shared/como-executar.md)
- [Regras de nomenclatura](../shared/regras-de-nomenclatura.md)

## Observações Locais

- O `refreshToken` deve ter um tempo de vida maior (ex: 7 dias) ou ser de uso único (rotacionado a cada refresh).
- Cenários de erro a serem cobertos: refresh token expirado, inválido, ou revogado/não encontrado no banco simulado.
- Esta especificação cobre **apenas** a implementação de backend/servidor.

## Tasks

### Tasks - Negócio

- [ ] Atualizar o caso de uso `LoginUseCase` para gerar tanto o `accessToken` (expiração de 15m) quanto o `refreshToken`.
- [ ] Criar o caso de uso `RefreshTokenUseCase` que valida o refresh token recebido, verifica sua existência no banco simulado, invalida o token antigo e gera um novo par de tokens (Access + Refresh).

### Tasks - Back-end

- [ ] Atualizar a modelagem simulada e o arquivo `users-db.json` para permitir o armazenamento de refresh tokens ativos associados aos usuários.
- [ ] Atualizar o repositório `JsonUserRepository` para suportar salvamento, busca e invalidação de refresh tokens.
- [ ] Criar o handler `/api/auth/refresh` (`POST`) no arquivo de rotas/servidor do Express (`apps/frontend/server.ts` ou `auth.handler.ts`) vinculando-o ao `RefreshTokenUseCase`.
- [ ] Atualizar o arquivo REST Client `apps/frontend/src/server/auth.integration.http` estruturado com divisores `###`, uso de variáveis (ex: `@token = ...`) e comentários dos retornos HTTP esperados, incluindo:
  - Cenário 1: Login com sucesso retornando par de tokens (Access + Refresh) e confirmando expiração de 15m (`# Expected: 200 OK`).
  - Cenário 2: Renovação com sucesso do `accessToken` passando um `refreshToken` ativo (`# Expected: 200 OK`).
  - Cenário 3: Tentativa de renovação com `refreshToken` inválido ou inexistente (`# Expected: 401 Unauthorized` ou `403 Forbidden`).
  - Cenário 4: Tentativa de renovação com `refreshToken` expirado (`# Expected: 401 Unauthorized`).

### Tasks - Validação

- [ ] Solicitar ao usuário a execução do servidor Angular SSR e validação manual do fluxo de refresh usando o arquivo `auth.integration.http`.

## Resultado Esperado

- Rota `POST /api/auth/refresh` ativa no servidor Angular SSR.
- Geração de tokens de acesso JWT com expiração estrita de 15 minutos.
- Mecanismo de persistência e validação de Refresh Tokens funcionando no banco de dados simulado (`users-db.json`).
- Cenários de erro e sucesso testados via `auth.integration.http`.

## Encerramento

Esta spec termina apenas quando todos os itens estiverem marcados e com evidência registrada, no formato definido em [Como executar](../shared/como-executar.md).
