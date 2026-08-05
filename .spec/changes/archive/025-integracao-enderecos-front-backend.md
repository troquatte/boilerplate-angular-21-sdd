# Integração Endereços Frontend-Backend (CRUD + Selecionar Principal)

## Objetivo

Integrar a seção de endereços do formulário de cliente com o backend. Implementar listagem de endereços em cards, adicionar novo endereço, e selecionar endereço principal (único por cliente).

## Contexto

O backend CRUD de endereços (spec 023) já existe. O frontend (spec 024) tem a seção de endereço visual mas não integrada. Precisamos agora:
- Listar endereços do cliente em cards/blocos
- O primeiro bloco é o endereço principal (selecionado)
- Os demais são endereços não selecionados
- Adicionar novo endereço via formulário
- Botão "Selecionar" em cada endereço: desmarca todos os endereços do cliente e marca o clicado como principal

## Escopo

### Backend
- Adicionar método `selectPrincipal(clienteId, enderecoId)` no `endereco.service.ts`
  - Usar transação Prisma: atualiza todos os endereços do cliente para `principal = false`, depois atualiza o selecionado para `principal = true`
- Adicionar endpoint `PATCH /api/dashboard/clientes/:clienteId/enderecos/:id/select` no controller e router
- Primeiro endereço do cliente é automaticamente marcado como principal

### Frontend
- Criar interface `IEndereco` em `src/app/modules/dashboard-admin/modules/clientes/interfaces/endereco.interface.ts`
- Criar `EnderecoService` em `src/app/modules/dashboard-admin/modules/clientes/services/endereco.service.ts`
  - `getEnderecos(clienteId)` — GET
  - `createEndereco(clienteId, payload)` — POST
  - `selectPrincipal(clienteId, enderecoId)` — PATCH
  - `deleteEndereco(clienteId, enderecoId)` — DELETE
- Modificar `ClientesFormComponent`:
  - Carregar endereços do cliente ao entrar no modo edição
  - Exibir endereços em cards/blocos (ordenados: principal primeiro)
  - Card principal: `theme-card__black` (background secondary, texto branco)
  - Cards secundários: `theme-card__white`
  - Botão "Selecionar" e "Deletar" lado a lado em cada card
  - Swal de confirmação para Selecionar, Deletar, Salvar, Salvar e criar pedido
  - Formulário para adicionar novo endereço (campos já existentes no template)
  - Ao salvar novo endereço: chama API e recarrega lista
  - Ao clicar "Selecionar": chama API e recarrega lista
  - Ao clicar "Deletar": chama API e recarrega lista

### Fora de Escopo
- Edição de endereço existente (será spec separada)
- Validação de CEP via API externa

## Contrato de API

### GET /api/dashboard/clientes/:clienteId/enderecos
Response 200:
```json
{
  "data": [
    { "id": "uuid", "cep": "...", "logradouro": "...", "numero": "...", "complemento": "...", "bairro": "...", "cidade": "...", "estado": "...", "principal": true, "clienteId": "uuid", "createdAt": "...", "updatedAt": "..." }
  ]
}
```

### POST /api/dashboard/clientes/:clienteId/enderecos
Request: { cep, logradouro, numero, complemento?, bairro, cidade, estado, principal? }
Response 201: { data: { ... } }

### PATCH /api/dashboard/clientes/:clienteId/enderecos/:id/select
Response 200: { data: { ... } }

### DELETE /api/dashboard/clientes/:clienteId/enderecos/:id
Response 204: No Content

## Dependencias
- `src/server/modules/endereco/service/endereco.service.ts` (adicionar selectPrincipal)
- `src/server/modules/endereco/controller/endereco.controller.ts` (adicionar endpoint)
- `src/server/modules/endereco/router.ts` (adicionar rota)
- `src/app/modules/dashboard-admin/modules/clientes/interfaces/endereco.interface.ts` (novo)
- `src/app/modules/dashboard-admin/modules/clientes/services/endereco.service.ts` (novo)
- `src/app/modules/dashboard-admin/modules/clientes/pages/clientes-create-or-update/clientes-form.component.ts` (modificar)
- `src/app/modules/dashboard-admin/modules/clientes/pages/clientes-create-or-update/clientes-form.component.html` (modificar)
- `src/app/modules/dashboard-admin/modules/clientes/pages/clientes-create-or-update/clientes-form.component.scss` (modificar)

## Premissas
- Backend CRUD de endereços já funciona (spec 023)
- Formulário de cliente já tem campos de endereço no template (spec 024)
- O clienteId está disponível via `clienteId()` signal no componente

## Restricoes
- Usar signals para estado dos endereços
- Usar bootstrap para layout dos cards
- Selecionar principal deve ser transação atômica (backend)
- Recarregar endereços após qualquer operação (create, select, delete)
- Card principal deve ter destaque visual (theme-card__black)
- Primeiro endereço criado automaticamente principal

## Critérios de Aceite

- [x] **AC-01 — Backend selectPrincipal:** Service faz transação Prisma para desmarcar todos e marcar um.
- [x] **AC-02 — Backend endpoint:** PATCH `.../enderecos/:id/select` exposto no controller e router.
- [x] **AC-03 — Backend primeiro principal:** Primeiro endereço do cliente é automaticamente `principal = true`.
- [x] **AC-04 — Frontend interface:** `IEndereco` criado com todos os campos.
- [x] **AC-05 — Frontend service:** `EnderecoService` com get, create, selectPrincipal, delete.
- [x] **AC-06 — Listagem:** Endereços carregados e exibidos em cards ao abrir modo edição.
- [x] **AC-07 — Ordenação:** Endereço principal sempre aparece em primeiro.
- [x] **AC-08 — Card principal:** `theme-card__black` (background secondary, texto branco).
- [x] **AC-09 — Cards secundários:** `theme-card__white`.
- [x] **AC-10 — Botão selecionar:** Cards secundários têm botão "Selecionar", desmarca todos e marca o clicado. Swal de confirmação.
- [x] **AC-11 — Botão deletar:** Cada card tem botão "Deletar". Swal de confirmação.
- [x] **AC-12 — Adicionar endereço:** Formulário de endereço salva novo endereço via API e recarrega lista.
- [x] **AC-13 — Recarregar após operações:** Após create, select ou delete, lista de endereços é recarregada.
- [x] **AC-14 — Swal Salvar:** Botão "Salvar" pergunta confirmação antes de salvar.
- [x] **AC-15 — Swal Salvar e criar pedido:** Botão pergunta confirmação, salva e redireciona para `/admin/pedidos/create`.
- [x] **AC-16 — Build aprovado:** Build sem erros.
- [x] **AC-17 — Lint aprovado:** Lint sem erros.

## Tasks

- [x] **Task 1 — Backend selectPrincipal:** Adicionar método e endpoint no backend.
  > ✅ 2026-08-05 — Transação Prisma com updateMany + update. Rota PATCH `.../select`.
- [x] **Task 2 — Backend primeiro principal:** Ao criar endereço, se for o primeiro do cliente, `principal = true`.
  > ✅ 2026-08-05 — `prisma.enderecos.count` antes do create.
- [x] **Task 3 — Frontend interface e service:** Criar IEndereco e EnderecoService.
  > ✅ 2026-08-05 — Interface com todos os campos. Service com get, create, selectPrincipal, delete.
- [x] **Task 4 — Frontend componente:** Modificar ClientesFormComponent para carregar e exibir endereços.
  > ✅ 2026-08-05 — Signal `enderecos`, computed `enderecosOrdenados` (principal primeiro). Métodos add, select, delete.
- [x] **Task 5 — Frontend template:** Cards de endereços, botão selecionar/deletar, formulário de novo endereço.
  > ✅ 2026-08-05 — Cards com `theme-card__black/__white`. Botões lado a lado com `d-flex gap-2`. Swal em todas as ações.
- [x] **Task 6 — Frontend estilos:** Destaque para card principal, layout dos cards, margens.
  > ✅ 2026-08-05 — `theme-card__black` para principal. `margin-bottom: fn.rem-calc(21)` nos botões de ação. `margin-top: fn.rem-calc(14)` e `margin-right: fn.rem-calc(14)` nos botões de card.
- [x] **Task 7 — Build e lint:** Validações.
  > ✅ 2026-08-05 — Build e lint aprovados.

## Resultado Esperado
- Tela de edição mostra cards com endereços do cliente (principal em primeiro, destacado)
- Cards secundários com botão "Selecionar" e "Deletar" lado a lado
- Formulário de endereço adiciona novo endereço e recarrega lista
- Primeiro endereço automaticamente principal
- Backend garante apenas um endereço principal por cliente
- Swal de confirmação em todas as ações destrutivas

## Encerramento
Esta spec termina quando o frontend listar, criar, selecionar e deletar endereços, integrado com backend, e build/lint aprovados.
