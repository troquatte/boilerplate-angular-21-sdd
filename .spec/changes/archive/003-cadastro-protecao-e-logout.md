# 003-cadastro-protecao-e-logout

## Objetivo

Implementar a criptografia de senhas no backend, a rota de cadastro de novos usuários, a proteção de rotas privadas via middleware de autenticação e a rota de logout para invalidação de refresh tokens no servidor do Angular SSR v21.

## Contexto Técnico

- Criptografia de senhas utilizando hash seguro (`bcryptjs`).
- Rota de cadastro `POST /api/auth/register` com validações de entrada.
- Middleware de autenticação (`auth.middleware.ts`) que valida o `accessToken` nos cabeçalhos HTTP.
- Rota de logout `POST /api/auth/logout` para revogação do `refreshToken` ativo.
- Banco de dados simulado (`users-db.json`) adaptado para senhas com hash e controle de sessões.

## Referências de Projeto

- [Produto](../memory/produto.md)
- [Contexto técnico global](../memory/contexto-tecnico.md)
- [Estrutura do projeto](../memory/estrutura.md)
- [001-modulo-autenticacao](./001-modulo-autenticacao.md)
- [002-refresh-token](./002-refresh-token.md)

## Referências Compartilhadas

- [Como executar](../shared/como-executar.md)
- [Regras de nomenclatura](../shared/regras-de-nomenclatura.md)

## Observações Locais

- As senhas salvas no banco JSON simulado `users-db.json` passarão a conter hash gerado pelo `bcryptjs`.
- O middleware de autenticação deve ser configurável no Express para interceptar apenas rotas que exijam segurança (ex: `/api/protected/*`).

## Tasks

### Tasks - Negócio

- [ ] Definir a interface de criptografia de senhas (`EncryptionProvider`) e sua implementação utilizando `bcryptjs`.
- [ ] Criar o caso de uso `RegisterUseCase` para gerenciar o fluxo de criação de usuários com validação de e-mail único e hashing de senha.
- [ ] Criar o caso de uso `LogoutUseCase` responsável por invalidar o `refreshToken` ativo do usuário no banco simulado.

### Tasks - Back-end

- [ ] Atualizar o arquivo `users-db.json` com hashes válidos para os usuários de sementes (seeds) usando `bcryptjs`.
- [ ] Atualizar o caso de uso `LoginUseCase` para validar as senhas utilizando o comparador do `bcryptjs`.
- [ ] Criar o validador de dados para o cadastro (`register.validator.ts`), validando e-mail no formato correto e senha com mínimo de 6 caracteres.
- [ ] Criar o handler `/api/auth/register` (`POST`) vinculando-o ao `RegisterUseCase`.
- [ ] Implementar o middleware de autenticação `auth.middleware.ts` no servidor Express (`apps/frontend/server.ts`), validando o JWT no cabeçalho `Authorization: Bearer <token>` e inserindo os dados do usuário autenticado no request.
- [ ] Criar o handler `/api/auth/logout` (`POST`) vinculando-o ao `LogoutUseCase`.
- [ ] Criar a rota simulada protegida `/api/protected/profile` (`GET`) para fins de validação do middleware.
- [ ] Atualizar o arquivo REST Client `apps/frontend/src/server/auth.integration.http` estruturado com divisores `###`, uso de variáveis (ex: `@host = http://localhost:4200`) e comentários dos retornos HTTP esperados, incluindo:
  - Cenário 1: Cadastro de usuário com sucesso e dados válidos (`# Expected: 201 Created`).
  - Cenário 2: Cadastro de usuário com e-mail já registrado no banco simulado (`# Expected: 409 Conflict`).
  - Cenário 3: Cadastro com dados inválidos (e-mail inválido ou senha menor que 6 caracteres) (`# Expected: 400 Bad Request`).
  - Cenário 4: Acesso à rota protegida `/api/protected/profile` com token JWT válido (`# Expected: 200 OK`).
  - Cenário 5: Acesso à rota protegida `/api/protected/profile` sem token ou com token inválido (`# Expected: 401 Unauthorized`).
  - Cenário 6: Execução de logout com token de refresh válido (`# Expected: 200 OK` ou `204 No Content`).
  - Cenário 7: Execução de logout com token de refresh inválido/ausente (`# Expected: 400 Bad Request` ou `401 Unauthorized`).

### Tasks - Validação

- [ ] Solicitar ao usuário a instalação de pacotes necessários no terminal (ex: `npm install bcryptjs @types/bcryptjs` na pasta `apps/frontend`).
- [ ] Solicitar ao usuário a execução do servidor Angular SSR e validação manual do fluxo usando o arquivo `auth.integration.http`.

## Resultado Esperado

- Criptografia de senhas ativa com `bcryptjs`.
- Rotas `POST /api/auth/register` e `POST /api/auth/logout` ativas.
- Middleware interceptando e protegendo rotas no Express do SSR.
- Casos de testes descritos e validados no Rest Client.

## Encerramento

> ✅ 2026-07-23 18:26 — Spec encerrada sem execução direta. As funcionalidades planejadas nesta spec foram absorvidas e entregues integralmente pela spec `006-implementacao-e-seguranca-do-modulo-auth.md`, que unificou os escopos de 001 a 005 em uma única entrega implementada e validada.

### Validações finais

- Implementação consolidada via spec `006`: aprovada pelo `sdd-reviewer` com testes de integração passando e validação manual via REST Client.

### Memória atualizada

- `memory/produto.md`: nenhuma alteração necessária (entregue via spec 006).
- `memory/contexto-tecnico.md`: nenhuma alteração necessária (entregue via spec 006).
- `memory/estrutura.md`: nenhuma alteração necessária.

### Observações

- Esta spec foi substituída pela spec `006`, que a implementa em sua totalidade.
