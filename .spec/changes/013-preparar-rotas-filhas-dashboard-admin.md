# Preparar Infraestrutura de Rotas Filhas no Dashboard Admin

## Objetivo

Preparar o módulo `dashboard-admin` para receber rotas filhas no futuro, refatorando a estrutura de roteamento para suportar `children` sem adicionar novas páginas, componentes ou rotas nesta entrega.

## Contexto Técnico

Stack: Angular v21 + SSR, lazy-loading, standalone components. A rota `/admin/dashboard` em `app.routes.ts` carrega `DashboardAdminComponent` via `loadComponent`. O componente não possui `<router-outlet>`, impedindo que futuras funcionalidades sejam adicionadas como rotas filhas. O objetivo é apenas preparar a infraestrutura — rotas filhas concretas serão especificadas e implementadas em specs futuras.

## Escopo

- Refatorar `app.routes.ts` para substituir `loadComponent` de `/admin/dashboard` por `loadChildren` apontando para `admin-dashboard.router.ts`.
- Refatorar `admin-dashboard.router.ts` para definir `DashboardAdminComponent` como `component` pai da rota `''` com `children` array vazio (placeholder para futuras rotas).
- Adicionar `<router-outlet></router-outlet>` ao template de `DashboardAdminComponent` após o `<header>`, para que futuras rotas filhas renderizem na área de conteúdo.
- Garantir que `authGuard` e `adminGuard` continuem protegendo a rota pai.
- Validar lint e build.

## Fora de Escopo

- Criar novos componentes, páginas ou arquivos de rotas filhas.
- Adicionar novas rotas ao enum `ERouters`.
- Alterar o menu lateral (novos links serão adicionados quando houver rotas filhas concretas).
- Alterar services, guards, interceptors, `app.component.html`, `design-system`, rotas de auth.
- Testes unitários.

## Premissas

- `DashboardAdminComponent` continua como layout pai (navbar + área de conteúdo).
- O `children` array vazio em `admin-dashboard.router.ts` será populado em specs futuras.
- Lazy-loading deve ser preservado para a rota pai via `loadChildren`.

## Restrições

- Não quebrar a rota `/admin/dashboard` existente.
- Não alterar o comportamento visual atual (apenas adicionar `<router-outlet>` invisível quando vazio).
- Preservar guards `authGuard` e `adminGuard` na rota pai.

## Dependências

- `src/app/app.routes.ts`
- `src/app/modules/dashboard-admin/admin-dashboard.router.ts`
- `src/app/modules/dashboard-admin/pages/dashboard/dashboard-admin/dashboard-admin.component.html`

## Critérios de Aceite

- [x] **AC-01 — Rota pai com loadChildren:** `app.routes.ts` usa `loadChildren` para `/admin/dashboard` apontando para `adminDashboardRoutes`.
- [x] **AC-02 — Componente pai com children:** `admin-dashboard.router.ts` define `DashboardAdminComponent` como `component` da rota `''` com `children: []` (vazio).
- [x] **AC-03 — Router outlet presente:** `DashboardAdminComponent` possui `<router-outlet></router-outlet>` no template.
- [x] **AC-04 — Guards preservados:** `authGuard` e `adminGuard` continuam na rota pai.
- [x] **AC-05 — Build aprovado:** Build sem erros de compilação.
- [x] **AC-06 — Lint aprovado:** Lint sem erros nos arquivos alterados.

## Riscos

| Risco | Impacto | Mitigação |
|---|---|---|
| `<router-outlet>` vazio quebra layout | Baixo | Outlet vazio não renderiza nada; layout permanece inalterado |
| Conflito de router-outlet duplicado | Baixo | Apenas um outlet no `DashboardAdminComponent`; `app.component` já tem um para o pai |

## Tasks

### Tasks - Front-end

- [x] **Task 1 — Refatorar app.routes.ts:** Substituir `loadComponent` de `/admin/dashboard` por `loadChildren` apontando para `adminDashboardRoutes`. Manter guards.
  > ✅ 2026-07-31 20:58 — `loadChildren` substituído por `loadComponent`. Guards preservados. Arquivo: `src/app/app.routes.ts`.
- [x] **Task 2 — Criar admin-dashboard.router.ts:** Criar `src/app/modules/dashboard-admin/admin-dashboard.router.ts` exportando `adminDashboardRoutes: Routes` com `DashboardAdminComponent` como `component` da rota `path: ''` e `children: []` (vazio, placeholder para futuras rotas).
  > ✅ 2026-07-31 20:58 — Arquivo criado. Import corrigido para named export (`import { DashboardAdminComponent }`). Arquivo: `src/app/modules/dashboard-admin/admin-dashboard.router.ts`.
- [x] **Task 3 — Adicionar router-outlet:** Inserir `<router-outlet></router-outlet>` no template de `DashboardAdminComponent` após o `<header>`.
  > ✅ 2026-07-31 20:58 — `RouterOutlet` importado no componente e adicionado ao template. Arquivo: `dashboard-admin.component.ts` e `.html`.
- [x] **Task 4 — Lint e build:** Executar `npx eslint` e `npx ng build --configuration local`.
  > ✅ 2026-07-31 20:59 — `npx eslint` aprovado (0 issues). `npx ng build --configuration local` aprovado (0 erros, 0 warnings).

## Resultado Esperado

- `/admin/dashboard` continua funcionando exatamente como hoje (visual e comportamento inalterados).
- A estrutura de roteamento está preparada para receber rotas filhas em specs futuras.
- Build e lint aprovados.

## Encerramento

> ✅ 2026-07-31 20:59 — Spec revisada, validada e encerrada.

### Validações finais

- `npx eslint`: aprovado (0 issues).
- `npx ng build --configuration local`: aprovado (0 erros, 0 warnings).

### Memória atualizada

- `memory/changelog.md`: adicionada entrada `013`.

### Observações

- Ajuste durante execução: import do `DashboardAdminComponent` corrigido de default export para named export (`import { DashboardAdminComponent }`).
- `RouterOutlet` adicionado aos imports do `DashboardAdminComponent` (não estava no template original).
- Nenhuma alteração de arquitetura ou regra de negócio permanente.
