# Endereço e Histórico de Pedidos no Formulário de Cliente (Front)

## Objetivo

Adicionar ao formulário de cliente (modo edição/update) a seção de cadastro de endereços e a seção de histórico de pedidos, conforme layout da imagem. Não integrar com backend.

## Contexto

O formulário `ClientesFormComponent` (specs 018/019) funciona em modo master-detail (create/update). Agora precisamos adicionar visualmente a seção de endereço e histórico de pedidos, visíveis apenas quando há `id` na rota (modo edição).

## Escopo

### Frontend (template e componente)
- **Seção Endereço:** visível apenas no modo edição (quando `id` está presente na rota)
  - Campos: CEP, Logradouro, Número, Bairro, Cidade, Estado
  - Layout: CEP [col-md-4], Logradouro [col-md-5], Número [col-md-3] — Bairro [col-md-4], Cidade [col-md-4], Estado [col-md-4]
  - Botão "Adicionar novo endereço" (visual, sem ação)
- **Seção Histórico de Pedidos:** visível apenas no modo edição
  - Título "Histórico de Pedidos"
  - Card/banner com mensagem "Não há histórico de pedidos." (fundo escuro, texto claro)
- **Botões de ação:**
  - Renomear "Voltar" para "Cancelar"
  - Adicionar botão "Salvar e criar pedido" (visual, sem ação por enquanto)

### Fora de Escopo
- Integração backend para endereços (será spec separada)
- Integração backend para pedidos (será spec separada)
- Funcionalidade do botão "Adicionar novo endereço" (apenas visual)
- Funcionalidade do botão "Salvar e criar pedido" (apenas visual)
- Alterações no schema Prisma ou backend

## Dependencias
- `src/app/modules/dashboard-admin/modules/clientes/pages/clientes-create-or-update/clientes-form.component.html`
- `src/app/modules/dashboard-admin/modules/clientes/pages/clientes-create-or-update/clientes-form.component.ts`
- `src/app/modules/dashboard-admin/modules/clientes/pages/clientes-create-or-update/clientes-form.component.scss`

## Premissas
- O formulário de cliente (create/update) já existe com máscaras, validações e layout bootstrap
- O modo edição é detectado pela presença de `id` em `ActivatedRoute.snapshot.params`
- As classes de bootstrap (grid, form, buttons) estão disponíveis globalmente

## Restricoes
- Usar classes do bootstrap para layout (grid, form, buttons)
- Não duplicar código de inputs — usar o mesmo padrão de inputs do formulário existente
- Seção endereço e histórico aparecem APENAS no modo edição (quando há `id` na rota)
- Não integrar com backend (dados mockados ou vazios)

## Critérios de Aceite

- [x] **AC-01 — Seção endereço visível apenas no update:** Endereço aparece quando `id` está presente na rota.
- [x] **AC-02 — Layout endereço:** CEP [col-md-4], Logradouro [col-md-5], Número [col-md-3], Bairro [col-md-4], Cidade [col-md-4], Estado [col-md-4].
- [x] **AC-03 — Botão adicionar endereço:** Botão "Adicionar novo endereço" presente.
- [x] **AC-04 — Seção histórico visível apenas no update:** Histórico de Pedidos aparece quando `id` está presente.
- [x] **AC-05 — Card histórico vazio:** Banner/card com "Não há histórico de pedidos." (fundo escuro, texto claro).
- [x] **AC-06 — Botão Cancelar:** Botão "Voltar" renomeado para "Cancelar".
- [x] **AC-07 — Botão Salvar e criar pedido:** Botão adicionado ao lado de "Salvar" (visual, sem ação).
- [x] **AC-08 — Modo create limpo:** Quando sem `id`, apenas os campos de cliente aparecem (sem endereço, sem histórico, sem botão extra).
- [x] **AC-09 — Build aprovado:** Build sem erros.
- [x] **AC-10 — Lint aprovado:** Lint sem erros.

## Tasks

- [x] **Task 1 — Seção endereço:** Adicionar campos CEP, Logradouro, Número, Bairro, Cidade, Estado no template, visível apenas no modo edição (`@if (clienteId())`).
  > ✅ 2026-08-05 — Seção Endereço adicionada com layout bootstrap col-md-4/5/3 e col-md-4/4/4. Apenas no modo edição.
- [x] **Task 2 — Botão adicionar endereço:** Adicionar botão "Adicionar novo endereço" na seção endereço.
  > ✅ 2026-08-05 — Botão "Adicionar novo endereço" adicionado abaixo dos campos de endereço.
- [x] **Task 3 — Seção histórico:** Adicionar título e card "Não há histórico de pedidos.", visível apenas no modo edição.
  > ✅ 2026-08-05 — Card com background var(--primary), texto branco, border-radius e padding. Apenas no modo edição.
- [x] **Task 4 — Botões ação:** Renomear "Voltar" para "Cancelar", adicionar "Salvar e criar pedido".
  > ✅ 2026-08-05 — "Voltar" renomeado para "Cancelar". Botão "Salvar e criar pedido" adicionado ao lado de "Salvar" (apenas no modo edição).
- [x] **Task 5 — Build e lint:** Validações.
  > ✅ 2026-08-05 — Lint e build aprovados.

## Resultado Esperado
- Tela de criação (`/admin/clientes/create`): apenas dados do cliente, botões "Cancelar" e "Salvar"
- Tela de edição (`/admin/clientes/:id`): dados do cliente + seção endereço + seção histórico de pedidos + botões "Cancelar", "Salvar", "Salvar e criar pedido"

## Encerramento
Esta spec termina quando o layout de endereço e histórico de pedidos estiver implementado no modo edição, os botões ajustados, e build/lint aprovados.
