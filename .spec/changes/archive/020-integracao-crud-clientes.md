# Integração CRUD Clientes (Create, Update, Delete)

## Objetivo

Integrar o formulário de cliente (create/update) e o delete da listagem com o backend real. Trocar o botão Editar de `(click)` para `routerLink`.

## Contexto

O formulário (spec 019) funciona em modo master-detail (create e edit) mas o submit é mock (console.log + Swal). A listagem (spec 017) exibe dados paginados, mas o botão Deletar só loga no console. O botão Editar usa `(click)` com navegação programática. Precisamos conectar tudo ao backend.

## Escopo

### Backend (não alterar — já funciona)
- POST `/api/dashboard/clientes` (create)
- PATCH `/api/dashboard/clientes/:id` (update)
- DELETE `/api/dashboard/clientes/:id` (delete)
- GET `/api/dashboard/clientes/:id` (findById)
- GET `/api/dashboard/clientes` (list paginado)

### Frontend
- Adicionar `createCliente`, `updateCliente`, `deleteCliente` em `ClientesService`
- `ClientesFormComponent.submit()` chamar POST (create) ou PATCH (update) via `ClientesService`
- Após sucesso, navegar para listagem com Swal de sucesso
- Após erro, exibir Swal de erro e manter no formulário
- `ClientesListComponent.onDelete()` chamar DELETE via `ClientesService`, depois recarregar listagem
- Trocar botão Editar na listagem de `(click)` para `routerLink`

## Fora de Escopo
- Novos endpoints backend (já existem)
- Alterações no design system
- Validações novas no formulário

## Dependencias
- `src/app/modules/dashboard-admin/modules/clientes/services/clientes.service.ts`
- `src/app/modules/dashboard-admin/modules/clientes/pages/clientes-create-or-update/clientes-form.component.ts`
- `src/app/modules/dashboard-admin/modules/clientes/pages/clientes-list/clientes-list.component.ts`
- `src/app/modules/dashboard-admin/modules/clientes/pages/clientes-list/clientes-list.component.html`

## Critérios de Aceite

- [x] **AC-01 — Service create/update/delete:** `ClientesService` possui métodos `createCliente`, `updateCliente`, `deleteCliente`.
- [x] **AC-02 — Create integrado:** Ao salvar em modo criação, chama POST e cria o cliente no backend.
- [x] **AC-03 — Update integrado:** Ao salvar em modo edição, chama PATCH e atualiza o cliente no backend.
- [x] **AC-04 — Erro no submit:** Se backend retornar erro, exibe Swal de erro e permanece no formulário.
- [x] **AC-05 — Delete integrado:** Ao confirmar delete, chama DELETE e recarrega a listagem.
- [x] **AC-06 — Editar com routerLink:** Botão Editar na listagem usa `<a>` com `routerLink` ao invés de `(click)`.
- [x] **AC-07 — Build aprovado:** Build sem erros.
- [x] **AC-08 — Lint aprovado:** Lint sem erros.

## Tasks

- [x] **Task 1 — Service CRUD:** Adicionar `createCliente`, `updateCliente`, `deleteCliente` em `ClientesService`.
  > ✅ 2026-08-04 — Métodos adicionados usando POST, PATCH, DELETE. Arquivo: `clientes.service.ts`.
- [x] **Task 2 — Submit create:** `ClientesFormComponent` chama `createCliente` quando não há id.
  > ✅ 2026-08-04 — `submit()` chama `createCliente` e navega para listagem em caso de sucesso.
- [x] **Task 3 — Submit update:** `ClientesFormComponent` chama `updateCliente` quando há id.
  > ✅ 2026-08-04 — `submit()` chama `updateCliente` e navega para listagem em caso de sucesso.
- [x] **Task 4 — Erro submit:** Swal de erro no catch, permanece no formulário.
  > ✅ 2026-08-04 — Error handler no subscribe exibe Swal e mantém no formulário.
- [x] **Task 5 — Delete integrado:** `onDelete` chama `deleteCliente` e recarrega listagem via `loadClientes`.
  > ✅ 2026-08-04 — `deleteCliente` chamado após confirmação Swal, recarrega listagem com sucesso.
- [x] **Task 6 — routerLink Editar:** Trocar `(click)="onEdit(cliente)"` para `<a>` com `routerLink` no template da listagem.
  > ✅ 2026-08-04 — Botão Editar alterado para `<a [routerLink]="['/admin/clientes', cliente.id]">`. Método `onEdit` removido do componente.
- [x] **Task 7 — Build e lint:** Validações.
  > ✅ 2026-08-04 — Build e lint aprovados.

## Resultado Esperado
- Criar cliente salva no backend
- Editar cliente atualiza no backend
- Deletar cliente remove do backend e recarrega listagem
- Botão Editar usa `routerLink`

## Encerramento
Esta spec termina quando create, update e delete estiverem integrados com o backend e build/lint aprovados.
