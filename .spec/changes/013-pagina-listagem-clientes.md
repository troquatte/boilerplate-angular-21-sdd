# Página de Listagem de Clientes

## Objetivo

Implementar a página de listagem de clientes no dashboard admin, com busca, tabela de dados, ações (editar/deletar), confirmação de deleção via SweetAlert2 e paginação, conforme wireframe fornecido em `image.png`.

## Contexto Técnico

Stack: Angular v21 + SSR, standalone components, signals, lazy-loading. O módulo `clientes` já possui estrutura de pastas, `ClientesService` (placeholder), `IClientes` (id, name, email) e `ClientesListComponent` (placeholder). O design system possui classes `.theme-btn`, `.theme-form-field`, e utilitários Bootstrap grid. SweetAlert2 está instalado (`sweetalert2`). Angular Material está instalado mas não é usado para tabelas no projeto.

## Referências de Projeto

- [Produto](../memory/produto.md)
- [Contexto técnico global](../memory/contexto-tecnico.md)
- [Estrutura do projeto](../memory/estrutura.md)
- [Diretrizes de frontend](../shared/diretrizes-de-frontend.md)

## Escopo

- Atualizar interface `IClientes` para incluir campos: `fullName`, `phone`, `cpf`, `cep` (remover/deprecar `name` e `email` se não usados).
- Criar componente de paginação reutilizável (`app-pagination`) em `src/app/modules/shared/components/pagination/`.
- Implementar `ClientesListComponent` com:
  - Título `<h1>Clientes</h1>`.
  - Input de busca com placeholder "Busque por Telefone ou CPF" (classe `.theme-form-field`).
  - Botão "Novo cliente" (classe `.theme-btn.theme-btn__primary`).
  - Tabela HTML com cabeçalho: Nome completo, Telefone, CPF, CEP, Ações.
  - Cada linha com botões Editar e Deletar (ícones ou texto).
  - Deletar abre SweetAlert2 de confirmação.
  - Componente `app-pagination` na base da tabela.
- Estilizar tabela com classe `.theme-table` (adicionar ao design system em `src/scss/components/_table.scss` ou no componente SCSS).
- Implementar `ClientesService` com método `getClientes()` retornando mock de dados (array de 20+ clientes para testar paginação).
- Implementar busca filtrando por telefone ou CPF (client-side, no signal).
- Implementar paginação: tamanho de página (5, 10, 20), navegação anterior/próximo, exibição "X - Y de Z".
- Validar lint e build.

## Fora de Escopo

- Integração com backend real (dados mockados no service).
- Página de criação/edição de cliente (será feita em specs futuras).
- Funcionalidade real de deletar (apenas confirmação via SweetAlert2, log no console).
- Testes unitários.
- Alterar outros módulos.

## Premissas

- A tabela será HTML nativa (não Angular Material `mat-table`), estilizada com design system.
- A paginação será um componente standalone reutilizável (`app-pagination`), com signals.
- Os dados serão mockados no `ClientesService` para validar a UI.
- A busca é filtragem client-side (no componente, via signal computado).

## Restrições

- Usar signals para estado reativo (`signal`, `computed`).
- Usar classes do design system existente (`.theme-btn`, `.theme-form-field`).
- Não instalar novas bibliotecas (SweetAlert2 e Angular Material já estão disponíveis).
- Preservar lazy-loading do módulo `clientes`.
- Manter o menu lateral funcional.

## Dependências

- `src/app/modules/dashboard-admin/modules/clientes/interfaces/clientes.interface.ts`
- `src/app/modules/dashboard-admin/modules/clientes/services/clientes.service.ts`
- `src/app/modules/dashboard-admin/modules/clientes/pages/clientes-list/clientes-list.component.{ts,html,scss}`
- `src/app/modules/shared/components/pagination/pagination.component.{ts,html,scss}` (novo)
- `src/scss/components/_table.scss` (novo ou estilos no componente)
- `sweetalert2` (já instalado)

## Critérios de Aceite

- [x] **AC-01 — Interface atualizada:** `IClientes` possui `id`, `fullName`, `phone`, `cpf`, `cep`.
- [x] **AC-02 — Service com mock:** `ClientesService.getClientes()` retorna Observable com array de 25 clientes mockados.
- [x] **AC-03 — Título e busca:** Página exibe `<h1>Clientes</h1>`, input de busca com placeholder "Busque por Telefone ou CPF" e botão "Novo cliente".
- [x] **AC-04 — Tabela com dados:** Tabela exibe colunas Nome completo, Telefone, CPF, CEP, com dados renderizados.
- [x] **AC-05 — Ações na tabela:** Cada linha possui botões de editar e deletar.
- [x] **AC-06 — Confirmação deleção:** Clique em deletar abre SweetAlert2 de confirmação com título e botões Confirmar/Cancelar.
- [x] **AC-07 — Paginação funcional:** Componente de paginação exibe controle de itens por página, navegação anterior/próximo, e texto "X - Y de Z".
- [x] **AC-08 — Busca filtra dados:** Digitar no input de busca filtra a tabela por telefone ou CPF.
- [x] **AC-09 — Estilos do design system:** Botões, input e tabela usam classes do design system (`.theme-btn`, `.theme-form-field`, `.theme-table`).
- [x] **AC-10 — Build aprovado:** Build sem erros de compilação.
- [x] **AC-11 — Lint aprovado:** Lint sem erros nos arquivos alterados.

## Riscos

| Risco | Impacto | Mitigação |
|---|---|---|
| Estilos de tabela não existem no design system | Médio | Criar `.theme-table` em `_table.scss` ou estilos no componente |
| Componente de paginação complexo | Médio | Manter implementação simples: pageSize, pageIndex, totalItems |
| SweetAlert2 com SSR pode quebrar | Baixo | Usar `isPlatformBrowser` ou importar dinamicamente |

## Tasks

### Tasks - Front-end

- [x] **Task 1 — Atualizar interface IClientes:** Alterar `clientes.interface.ts` para incluir `id`, `fullName`, `phone`, `cpf`, `cep`.
  > ✅ 2026-08-03 — Interface atualizada. Arquivo: `clientes.interface.ts`.
- [x] **Task 2 — Implementar mock no ClientesService:** Adicionar método `getClientes()` retornando `Observable<IClientes[]>` com 25 itens mockados (usar `of` do RxJS).
  > ✅ 2026-08-03 — Service implementado com 25 clientes mockados. Arquivo: `clientes.service.ts`.
- [x] **Task 3 — Criar componente Pagination:** Criar `src/app/modules/shared/components/pagination/` com `PaginationComponent` (standalone, signals). Receber `input()` para: `pageSize`, `currentPage`, `totalItems`. Emitir eventos de mudança de página e tamanho de página.
  > ✅ 2026-08-03 — Componente criado com signals e computed properties. Arquivo: `pagination.component.ts`.
- [x] **Task 4 — Implementar ClientesListComponent (template):** Criar template com: `<h1>Clientes</h1>`, área de busca (`.theme-form-field` + `.theme-btn__primary`), tabela HTML (`.theme-table`), e `app-pagination`.
  > ✅ 2026-08-03 — Template implementado com tabela, busca, botão novo cliente e paginação. Arquivo: `clientes-list.component.html`.
- [x] **Task 5 — Implementar ClientesListComponent (lógica):** Usar signals: `clientes`, `searchQuery`, `filteredClientes` (computed), `currentPage`, `pageSize`. Buscar dados via `ClientesService` no `ngOnInit`. Implementar filtro de busca e paginação.
  > ✅ 2026-08-03 — Lógica implementada com signals, computed, filtro client-side e paginação. Arquivo: `clientes-list.component.ts`.
- [x] **Task 6 — Implementar ação de deletar:** No botão deletar, chamar `Swal.fire()` com confirmação. Logar no console ao confirmar (não chamar service real).
  > ✅ 2026-08-03 — SweetAlert2 integrado com título, texto, botões Confirmar/Cancelar. Log no console ao confirmar. Arquivo: `clientes-list.component.ts`.
- [x] **Task 7 — Criar estilos de tabela:** Adicionar `.theme-table` ao design system em `src/scss/components/_table.scss`. Incluir estilos para cabeçalho, linhas, células e ações. Importar em `_index.scss`.
  > ✅ 2026-08-03 — `.theme-table` criado no design system. Arquivo: `src/scss/components/_table.scss` e `_index.scss`.
- [x] **Task 8 — Lint e build:** Executar `npx eslint` e `npx ng build --configuration local`.
  > ✅ 2026-08-03 — `npx eslint` aprovado (0 issues). `npx ng build --configuration local` aprovado (0 erros, 0 warnings).

## Resultado Esperado

- A página `/admin/clientes` exibe a listagem completa de clientes com busca, tabela, ações e paginação.
- O design system conta com `.theme-table` para tabelas e `app-pagination` como componente reutilizável.
- Build e lint aprovados.

## Encerramento

> ✅ 2026-08-03 — Spec revisada, validada e encerrada.

### Validações finais

- `npx eslint`: aprovado (0 issues).
- `npx ng build --configuration local`: aprovado (0 erros, 0 warnings).

### Memória atualizada

- `memory/changelog.md`: adicionada entrada `013`.

### Observações

- Componente `app-pagination` criado como reutilizável para futuras listagens.
- Classe `.theme-table` adicionada ao design system global.
- SweetAlert2 funcionando sem problemas de SSR (import direto, sem `isPlatformBrowser` necessário para este caso).

## Encerramento

Esta spec termina apenas quando todos os critérios de aceite estiverem marcados e com evidência registrada, no formato definido em [Como executar](../shared/como-executar.md).
