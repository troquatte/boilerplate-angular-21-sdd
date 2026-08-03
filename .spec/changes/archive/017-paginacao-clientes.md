# Paginação de Clientes (Front e Back)

## Objetivo

Implementar paginação server-side no backend e um componente de paginação reutilizável no frontend, permitindo busca por CPF ou telefone na listagem de clientes.

## Contexto

A listagem de clientes (spec 013) carrega todos os registros de uma vez. Com o seed de 10+ clientes e crescimento futuro, precisamos de paginação real. O componente de paginação deve ser reutilizável por outros módulos.

## Escopo

### Backend
- Alterar `GET /api/dashboard/clientes` para aceitar `page`, `pageSize`, `search`
- Paginação via Prisma (`skip`, `take`, `count`)
- Busca `search` filtra por `cpf` ou `phone` (case-insensitive, partial match)
- Retorno padronizado: `{ data: [], meta: { page, pageSize, total, totalPages } }`

### Frontend
- Criar `PaginationService` reutilizável (state: page, pageSize, search, totalPages)
- Criar `PaginationComponent` standalone (UI: botões anterior/próximo, indicador de página, input de busca)
- Integrar `ClientesListComponent` com `PaginationService` + `ClientesService`

## Fora de Escopo

- Paginação de outros módulos (apenas infraestrutura reutilizável)
- Ordenação server-side
- Filtros avançados (apenas search por cpf/phone)

## Contrato de API

### GET /api/dashboard/clientes?page=1&pageSize=10&search=1198

```json
{
  "data": [
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
  ],
  "meta": {
    "page": 1,
    "pageSize": 10,
    "total": 12,
    "totalPages": 2
  }
}
```

**Parâmetros:**
- `page`: número da página (default: 1)
- `pageSize`: itens por página (default: 10)
- `search`: busca parcial em `cpf` ou `phone` (opcional)

## Premissas

- Prisma suporta `skip`, `take`, `count` nativamente
- O frontend usa signals para reatividade
- Paginação é um padrão que será replicado em outros módulos

## Restricoes

- Busca `search` é simples (partial match, não full-text search)
- Não alterar contratos de POST/PATCH/DELETE
- Componente de paginação não deve depender de módulo específico
- Campo de busca (`search`) fica na toolbar do `ClientesListComponent`, não no `PaginationComponent`

## Riscos

| Risco | Impacto | Mitigacao |
|---|---|---|
| Quebra de compatibilidade do contrato `GET /api/dashboard/clientes` (formato antigo: array puro → novo: `{ data, meta }`) | Alto | Atualizar `ClientesService` e `ClientesListComponent` na mesma spec para consumir novo formato |

## Dependencias

- `src/server/modules/cliente/service/cliente.service.ts`
- `src/server/modules/cliente/controller/cliente.controller.ts`
- `src/app/modules/dashboard-admin/modules/clientes/services/clientes.service.ts`
- `src/app/modules/dashboard-admin/modules/clientes/pages/clientes-list/clientes-list.component.ts`
- Novos: `PaginationService`, `PaginationComponent`

## Critérios de Aceite

- [x] **AC-01 — Backend paginado:** `GET /api/dashboard/clientes` retorna dados paginados com `meta`.
- [x] **AC-02 — Backend busca:** `search` filtra por CPF ou telefone (partial, case-insensitive).
- [x] **AC-03 — Backend defaults:** `page=1` e `pageSize=10` quando não informados.
- [x] **AC-04 — PaginationService:** Service reutilizável com signals `page`, `pageSize`, `search`, `totalPages`.
- [x] **AC-05 — PaginationComponent:** Componente standalone com UI de navegação.
- [x] **AC-06 — Integração frontend:** `ClientesListComponent` usa paginação e busca reativamente.
- [x] **AC-07 — Filtro funciona:** Digitar no campo de busca atualiza a listagem com debounce (300ms).
- [x] **AC-08 — Build aprovado:** Build sem erros (2026-08-03).
- [x] **AC-09 — Lint aprovado:** Lint sem erros.

## Tasks

### Backend
- [x] **Task 1 — Service paginado:** Alterar `clienteService.list()` para aceitar `page`, `pageSize`, `search` e retornar `{ data, meta }`.
  > ✅ 2026-08-03 — `list()` usa `Prisma.findMany` com `skip/take`, `Prisma.count`, `where OR` para busca parcial em `cpf`/`phone`. Arquivo: `src/server/modules/cliente/service/cliente.service.ts`.
- [x] **Task 2 — Controller atualizado:** Alterar `clienteController.list()` para extrair query params e passar ao service.
  > ✅ 2026-08-03 — Query params `page`, `pageSize`, `search` extraídos de `req.query`. Acesso via `req.query['page']` (index signature). Arquivo: `src/server/modules/cliente/controller/cliente.controller.ts`.

### Frontend
- [x] **Task 3 — PaginationService:** Criar `src/app/shared/services/pagination.service.ts` com signals.
  > ✅ 2026-08-03 — Service com signals `page`, `pageSize`, `search`, `totalPages`. Métodos `setPage`, `setPageSize`, `setSearch`, `nextPage`, `previousPage`. Sem `providedIn: 'root'` (instância por componente). Arquivo: `src/app/shared/services/pagination.service.ts`.
- [x] **Task 4 — PaginationComponent:** Criar `src/app/shared/components/pagination/pagination.component.ts` standalone.
  > ✅ 2026-08-03 — Componente standalone com botões Anterior/Próxima, indicador de página, e disabled states. Arquivo: `src/app/shared/components/pagination/pagination.component.ts`.
- [x] **Task 5 — ClientesService atualizado:** `getClientes()` aceita `page`, `pageSize`, `search`.
  > ✅ 2026-08-03 — `getClientes()` constrói URL com `URLSearchParams`, retorna `IClientesResponse` (data + meta). Arquivo: `src/app/modules/dashboard-admin/modules/clientes/services/clientes.service.ts`.
- [x] **Task 6 — ClientesListComponent integrado:** Usa `PaginationService` + debounce na busca.
  > ✅ 2026-08-03 — `PaginationService` fornecido via `providers`. `searchInput` signal com debounce 300ms via `toObservable` + `debounceTime`. Effect reage a `page`/`search` e carrega dados. `loadClientes()` atualiza `totalPages` da meta. Arquivo: `clientes-list.component.ts` / `.html`.
- [x] **Task 7 — Build e lint:** Validações.
  > ✅ 2026-08-03 — Lint e build aprovados (saída mínima).

## Resultado Esperado

- Listagem de clientes paginada (10 por página)
- Busca funcional por CPF ou telefone
- Componente/service de paginação pronto para reuso em outros módulos
- SSR funciona (chamada API apenas no browser)

## Encerramento

Esta spec termina quando todos os critérios de aceite estiverem validados e a paginação estiver funcionando no browser.
