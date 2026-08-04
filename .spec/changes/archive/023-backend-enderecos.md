# Backend CRUD Endereços (Service, Controller, Router, Tests HTTP)

## Objetivo

Implementar o backend completo para CRUD de endereços: service, controller, router e testes HTTP. Um endereço pertence a um cliente (clienteId) e segue o mesmo padrão arquitetural do módulo de clientes.

## Contexto

O modelo `Enderecos` já existe no Prisma schema com relacionamento `1:N` com `Cliente`. Precisamos de endpoints REST para criar, listar, buscar por ID, atualizar e deletar endereços de um cliente. Também é necessário atualizar os testes HTTP.

## Escopo

### Backend
- Criar `src/server/modules/endereco/service/endereco.service.ts` com métodos: `list`, `create`, `findById`, `update`, `delete`
- Criar `src/server/modules/endereco/controller/endereco.controller.ts` com os métodos HTTP correspondentes
- Criar `src/server/modules/endereco/router.ts` com as rotas:
  - `GET /api/dashboard/clientes/:clienteId/enderecos` — listar endereços do cliente
  - `POST /api/dashboard/clientes/:clienteId/enderecos` — criar endereço para o cliente
  - `GET /api/dashboard/clientes/:clienteId/enderecos/:id` — buscar endereço por ID
  - `PATCH /api/dashboard/clientes/:clienteId/enderecos/:id` — atualizar endereço
  - `DELETE /api/dashboard/clientes/:clienteId/enderecos/:id` — deletar endereço
- Registrar o router em `src/server/modules/router-auth-admin.ts`

### Tests HTTP
- Atualizar `tests/http/cliente.integration.http` (ou criar `tests/http/endereco.integration.http`) com testes para todos os endpoints de endereço

## Fora de Escopo
- Frontend (será spec separada)
- Validações complexas de CEP (usar apenas required/optional)
- Alterações no schema Prisma (já feito na spec 021)

## Contrato de API

### GET /api/dashboard/clientes/:clienteId/enderecos
Response 200:
```json
{
  "data": [
    {
      "id": "uuid",
      "cep": "01001-000",
      "logradouro": "Praça da Sé",
      "numero": "100",
      "complemento": "Apto 12",
      "bairro": "Sé",
      "cidade": "São Paulo",
      "estado": "SP",
      "principal": true,
      "clienteId": "uuid-cliente",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### POST /api/dashboard/clientes/:clienteId/enderecos
Request:
```json
{
  "cep": "01001-000",
  "logradouro": "Praça da Sé",
  "numero": "100",
  "complemento": "Apto 12",
  "bairro": "Sé",
  "cidade": "São Paulo",
  "estado": "SP",
  "principal": true
}
```
Response 201:
```json
{ "data": { ... } }
```

### GET /api/dashboard/clientes/:clienteId/enderecos/:id
Response 200:
```json
{ "data": { ... } }
```
Response 404: Endereço não encontrado.

### PATCH /api/dashboard/clientes/:clienteId/enderecos/:id
Request: mesmos campos do POST (opcionais)
Response 200:
```json
{ "data": { ... } }
```

### DELETE /api/dashboard/clientes/:clienteId/enderecos/:id
Response 204: No Content

## Dependencias
- `src/server/modules/endereco/` (novo diretório)
- `src/server/modules/router-auth-admin.ts` (registrar router)
- `prisma/schema.prisma` (modelo Enderecos já existente)
- `tests/http/cliente.integration.http` ou novo arquivo

## Premissas
- Modelo `Enderecos` existe no Prisma Client
- Módulo `cliente` já existe como referência de arquitetura
- O `clienteId` deve ser validado: se o cliente não existir, retornar 404

## Restricoes
- Seguir o mesmo padrão do módulo `cliente` (service, controller, router)
- Usar `ErrorHandlerHelper` para tratamento de erros
- Usar `EStatusErrors.E404` para not found
- Testes HTTP devem usar `UUID_CLIENTE_AQUI` e `UUID_ENDERECO_AQUI` como placeholders

## Critérios de Aceite

- [x] **AC-01 — Service:** `endereco.service.ts` com `list`, `create`, `findById`, `update`, `delete`.
- [x] **AC-02 — Controller:** `endereco.controller.ts` expõe todos os endpoints REST.
- [x] **AC-03 — Router:** `endereco/router.ts` define rotas com `clienteId` e `id`.
- [x] **AC-04 — Router registrado:** `router-auth-admin.ts` inclui `enderecoRouter`.
- [x] **AC-05 — Validação clienteId:** Se cliente não existir, retorna 404.
- [x] **AC-06 — Tests HTTP:** Arquivo HTTP com testes para todos os endpoints.
- [x] **AC-07 — Build aprovado:** Backend compila sem erros.
- [x] **AC-08 — Lint aprovado:** Lint sem erros.

## Tasks

- [x] **Task 1 — Service:** Criar `endereco.service.ts` com CRUD completo.
  > ✅ 2026-08-04 — Service criado com list, create, findById, update, delete. Valida clienteId e pertencimento do endereço ao cliente.
- [x] **Task 2 — Controller:** Criar `endereco.controller.ts`.
  > ✅ 2026-08-04 — Controller com endpoints REST, usa ErrorHandlerHelper.
- [x] **Task 3 — Router:** Criar `endereco/router.ts`.
  > ✅ 2026-08-04 — Rotas aninhadas: /dashboard/clientes/:clienteId/enderecos
- [x] **Task 4 — Registrar router:** Adicionar `enderecoRouter` em `router-auth-admin.ts`.
  > ✅ 2026-08-04 — Router registrado no authAdmRouter.
- [x] **Task 5 — Tests HTTP:** Criar testes HTTP para endereços.
  > ✅ 2026-08-04 — tests/http/endereco.integration.http com variáveis parametrizadas (UUID_CLIENTE_AQUI, UUID_ENDERECO_AQUI).
- [x] **Task 6 — Build e lint:** Validações.
  > ✅ 2026-08-04 — Lint e build aprovados.

## Resultado Esperado
- Endpoints REST para CRUD de endereços funcionando
- Testes HTTP documentando todos os endpoints
- Backend compila sem erros

## Encerramento
Esta spec termina quando todos os endpoints de endereços estiverem implementados, testados via HTTP, e build/lint aprovados.
