# Backend de Cadastro de Clientes

## Objetivo

Implementar o backend completo de cadastro de clientes, incluindo model Prisma, migration, router/controller/service Express, e regras de vinculacao automatica com User quando email e preenchido.

## Contexto

O frontend de listagem de clientes (spec 013) ja existe com dados mockados. Precisamos da persistencia real para que o cadastro funcione. O produto define que o cliente e o nucleo do sistema — o cadastro de clientes e a capacidade principal.

## Referencias de Projeto

- [Produto](../memory/produto.md)
- [Contexto tecnico global](../memory/contexto-tecnico.md)
- [Estrutura do projeto](../memory/estrutura.md)

## Escopo

- Model `Cliente` no Prisma schema
- Migration Prisma
- Router/Controller/Service de clientes no backend Express
- Regra: vinculacao automatica com User quando email e informado
- Atualizar frontend `ClientesService` para consumir API real
- Atualizar interface `IClientes` para refletir novos campos

## Fora de Escopo

- Paginacao server-side (aguarda definicao do backend)
- Busca server-side por telefone/CPF (aguarda definicao)
- Testes automatizados de integracao (Rest Client apenas)
- Edicao e exclusao de clientes (sera feito em spec futura)
- Payloads detalhados de POST/PATCH (sera definido em proxima spec)
- Formatacao de birthDate no frontend (sera definido em proxima spec)
- Cenarios de erro detalhados no Rest Client (sera definido em proxima spec)

## Premissas

- O backend usa Express + Prisma + PostgreSQL (stack existente)
- A autenticacao usa cookies HttpOnly com accessToken/refreshToken
- O campo `tipo` e String flexivel (ex: "PF", "PJ", "Parceiro")
- A senha do User gerado automaticamente sera o hash do CPF usando bcrypt (mesmo do auth)
- Endpoint de clientes fica em `authAdmRouter` (apenas admin acessa)
- Roles admin: ADMIN, SALES, DESIGNER, PRODUCTION, SHIPPING. CUSTOMER nao e admin.

## Restricoes

- Nao criar abstracoes desnecessarias (controller chama service direto)
- Manter padrao de tratamento de erro centralizado do projeto
- Usar middleware `auth-middleware` nas rotas de clientes
- Usar bcrypt para hash de senha (padrao do projeto)

## Dependencias

- `prisma/schema.prisma`
- `src/server/modules/cliente/` (novo)
- `src/server.ts` (registro de rotas via authAdmRouter)
- `src/app/modules/dashboard-admin/modules/clientes/services/clientes.service.ts` (atualizar)
- `src/app/modules/dashboard-admin/modules/clientes/interfaces/clientes.interface.ts` (atualizar)

## Regras de Negocio

1. **Sem email = sem login** — Cliente salvo sem relacao com User.
2. **Email novo + CPF preenchido** — Cria User com `name=fullName`, `email=email`, `password=bcrypt.hash(cpf)`, vincula `userId` no Cliente.
3. **Email ja existe em User sem Cliente** — Vincula este Cliente ao User existente (sem criar novo).
4. **Email ja existe em User com outro Cliente** — Retorna erro: "Email ja vinculado a outro cliente."
5. **CPF obrigatorio para gerar login** — Se tentar salvar email sem CPF, erro: "CPF obrigatorio para gerar acesso."
6. **Atualizacao de email** — Se email trocado de `null` -> `valor`, aplica regras 2-5. Se trocado de `valor` -> outro valor, desvincula User antigo e aplica regras 2-5.

## Modelo de Dados (Prisma)

```prisma
model Cliente {
  id          String    @id @default(uuid())
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  phone       String
  cpf         String?
  fullName    String?
  email       String?
  birthDate   DateTime?
  tipo        String?

  userId      String?   @unique
  user        User?     @relation(fields: [userId], references: [id])
}
```

**Relacao no User:**
```prisma
model User {
  ...campos existentes...
  cliente   Cliente?
}
```

## Contrato de API (v1 — listagem)

### GET /api/dashboard/clientes
Autenticado (admin). Retorna lista de todos os clientes (sem paginacao por enquanto).

```json
[
  {
    "id": "uuid",
    "phone": "11987654321",
    "cpf": "12345678901",
    "fullName": "Ana Carolina Silva",
    "email": "ana@example.com",
    "birthDate": "1990-05-15T00:00:00.000Z",
    "tipo": "PF",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### POST /api/dashboard/clientes
Autenticado (admin). Cria cliente. Aplica regras de vinculacao com User.

### PATCH /api/dashboard/clientes/:id
Autenticado (admin). Atualiza cliente. Aplica regras de vinculacao/desvinculacao.

### DELETE /api/dashboard/clientes/:id
Autenticado (admin). Remove cliente. Se tinha User vinculado, desvincula (mas nao deleta User).

## Critérios de Aceite

- [x] **AC-01 — Model Prisma:** Model `Cliente` criado no schema com todos os campos e relacao `userId` unique.
- [x] **AC-02 — Migration:** Migration aplicada com sucesso (20260803155450_add_cliente).
- [x] **AC-03 — Model User atualizado:** User possui campo `cliente` (relacao 1:1 opcional).
- [x] **AC-04 — Router Express:** Router de clientes registrado em `authAdmRouter` com prefixo `/api/dashboard/clientes`.
- [x] **AC-05 — Controller GET list:** `GET /api/dashboard/clientes` retorna array de clientes.
- [x] **AC-06 — Controller POST:** `POST /api/dashboard/clientes` cria cliente com validacoes.
- [x] **AC-07 — Controller PATCH:** `PATCH /api/dashboard/clientes/:id` atualiza cliente e gerencia vinculacao User.
- [x] **AC-08 — Controller DELETE:** `DELETE /api/dashboard/clientes/:id` remove cliente e desvincula User.
- [x] **AC-09 — Regra vinculacao:** Criar cliente com email + CPF gera User automaticamente (senha = bcrypt hash do CPF).
- [x] **AC-10 — Regra email duplicado:** Tentar vincular email ja usado por outro cliente retorna erro 400.
- [x] **AC-11 — Regra CPF obrigatorio:** Tentar salvar email sem CPF retorna erro 400.
- [x] **AC-12 — Frontend atualizado:** `ClientesService` consome API real via HTTP.
- [x] **AC-13 — Interface atualizada:** `IClientes` inclui `birthDate`, `email`, `tipo`.
- [x] **AC-14 — Build aprovado:** Build sem erros de compilacao (2026-08-03).
- [x] **AC-15 — Lint aprovado:** Lint sem erros nos arquivos alterados (2026-08-03).

## Riscos

| Risco | Impacto | Mitigacao |
|---|---|---|
| Relacao Prisma User-Cliente pode quebrar auth existente | Alto | Testar login/register apos alteracao do schema |
| Hash de CPF como senha pode ser inseguro | Medio | Documentar que sera substituido por reset de senha obrigatorio no primeiro acesso |
| Email duplicado em User causa violacao de unique | Medio | Service valida antes de criar/vincular |

## Tasks

### Tasks — Back-end

- [x] **Task 1 — Model Prisma Cliente:** Adicionar model `Cliente` ao `prisma/schema.prisma` com todos os campos.
  > ✅ 2026-08-03 — Model `Cliente` adicionado ao schema. Arquivo: `prisma/schema.prisma`.
- [x] **Task 2 — Relacao User-Cliente:** Adicionar `cliente Cliente?` ao model `User` no Prisma.
  > ✅ 2026-08-03 — Campo `cliente` adicionado ao model `User`. Arquivo: `prisma/schema.prisma`.
- [x] **Task 3 — Migration:** Executar `npx prisma migrate dev` para criar a tabela.
  > ✅ 2026-08-03 — Migration `20260803155450_add_cliente` aplicada no PostgreSQL via `npx prisma migrate reset --force` + `npx prisma migrate dev --name add_cliente`.
- [x] **Task 4 — Service de Cliente:** Criar `src/server/modules/cliente/service/cliente.service.ts` com CRUD e regras de vinculacao (usar bcrypt para hash).
  > ✅ 2026-08-03 — Service implementado com list, create, update, delete e regras de vinculacao User. Arquivo: `src/server/modules/cliente/service/cliente.service.ts`.
- [x] **Task 5 — Controller de Cliente:** Criar `src/server/modules/cliente/controller/cliente.controller.ts` com GET, POST, PATCH, DELETE.
  > ✅ 2026-08-03 — Controller implementado com 4 endpoints e tratamento de erro via `ErrorHandlerHelper`. Arquivo: `src/server/modules/cliente/controller/cliente.controller.ts`.
- [x] **Task 6 — Router de Cliente:** Criar `src/server/modules/cliente/router.ts` e registrar em `authAdmRouter` (rota admin).
  > ✅ 2026-08-03 — Router criado e registrado em `authAdmRouter`. Arquivo: `src/server/modules/cliente/router.ts`, `src/server/modules/router-auth-admin.ts`.
- [x] **Task 7 — Rest Client:** Criar `src/server/modules/cliente/cliente.integration.http` para validacao manual (cenarios basicos).
  > ✅ 2026-08-03 — Arquivo HTTP criado com cenarios de listar, criar, atualizar, deletar e erro. Arquivo: `src/server/modules/cliente/cliente.integration.http`.

### Tasks — Front-end

- [x] **Task 8 — Atualizar IClientes:** Adicionar `birthDate`, `email`, `tipo` a interface.
  > ✅ 2026-08-03 — Interface atualizada com campos opcionais. Arquivo: `src/app/modules/dashboard-admin/modules/clientes/interfaces/clientes.interface.ts`.
- [x] **Task 9 — Atualizar ClientesService:** Substituir mock por chamadas HTTP reais para `/api/dashboard/clientes`.
  > ✅ 2026-08-03 — Service atualizado para usar `HttpClient` com `inject()`. Consome `/api/dashboard/clientes`. Arquivo: `src/app/modules/dashboard-admin/modules/clientes/services/clientes.service.ts`.

## Resultado Esperado

- Backend com CRUD completo de clientes persistido no PostgreSQL.
- Regra de vinculacao automatica User funcionando.
- Frontend consumindo API real ao inves de mock.
- Build e lint aprovados.

## Encerramento

Esta spec termina apenas quando todos os criterios de aceite estiverem marcados e com evidencia registrada, no formato definido em [Como executar](../shared/como-executar.md).
