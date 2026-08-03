# Módulo Clientes no Dashboard Admin

## Objetivo

Criar o módulo `clientes` como rota filha do módulo administrativo (`admin`), estruturando pastas, componentes, páginas, services e roteamento conforme o padrão do projeto.

## Contexto Técnico

Stack: Angular v21 + SSR, lazy-loading, standalone components, enum `ERouters`. O `admin.router.ts` atua como hub de rotas admin, filho de `app.routes.ts` (`path: 'admin'`), carregando `adminDashboardRoutes` (`path: 'dashboard'`) e `adminClientesRoutes` (`path: 'clientes') como rotas irmãs. O menu lateral do dashboard admin (`menu-dashboard-admin`) é exibido para qualquer rota iniciada com `/admin` via `app.component.html`. O enum `ERouters` não possuía a rota `clientes` antes desta spec.

## Referências de Projeto

- [Produto](../memory/produto.md)
- [Contexto técnico global](../memory/contexto-tecnico.md)
- [Estrutura do projeto](../memory/estrutura.md)

## Referências Compartilhadas

- [Como executar](../shared/como-executar.md)
- [Regras de nomenclatura](../shared/regras-de-nomenclatura.md)
- [Diretrizes de frontend](../shared/diretrizes-de-frontend.md)

## Escopo

- Adicionar `CLIENTES = 'clientes'` ao enum `ERouters`.
- Criar estrutura de pastas do módulo `clientes` dentro de `dashboard-admin/modules/`: `pages/`, `components/`, `services/`, `interfaces/`.
- Criar página `ClientesListComponent` (standalone, mínima, placeholder) em `modules/clientes/pages/clientes-list/`.
- Criar `clientes.router.ts` exportando `clientesRoutes` com lazy-loading via `loadComponent` para `ClientesListComponent` na rota `''`.
- Criar `admin-clientes.router.ts` exportando `adminClientesRoutes` com `loadChildren` apontando para `clientes.router.ts`.
- Adicionar rota filha `clientes` em `admin.router.ts` via `loadChildren` apontando para `admin-clientes.router.ts`.
- Adicionar link "Clientes" no menu lateral (`menu-dashboard-admin`) com navegação para `/admin/clientes` e `routerLinkActive`.
- Criar `ClientesService` (placeholder vazio, injetável em `root`).
- Criar interface `IClientes` (placeholder vazia ou com campos mínimos: `id`, `name`, `email`).
- Validar lint e build.

## Fora de Escopo

- Implementar funcionalidade real de CRUD de clientes (será feito em specs futuras).
- Criar formulários, modais, modos de edição/criação.
- Alterar guards, interceptors, autenticação.
- Alterar outros módulos (`auth`, `design-system`, etc.).
- Testes unitários.
- Compartilhar layout/navbar entre `dashboard` e `clientes`; cada módulo terá seu próprio layout.

## Premissas

- O módulo `clientes` será uma rota filha de `/admin`, acessível em `/admin/clientes`.
- O padrão de nomenclatura segue o projeto: pastas em minúsculas, componentes em PascalCase com sufixo `Component`, arquivos em kebab-case.
- O `ClientesListComponent` é standalone, mínimo (título + "Em construção"), servindo como ponto de entrada.
- O `ClientesService` é um placeholder para futura implementação.

## Restrições

- Usar `ERouters` para todas as referências de rota; não hardcoded strings.
- Preservar lazy-loading (`loadChildren`/`loadComponent`) para todas as rotas filhas.
- Não quebrar a rota `/admin/dashboard` existente.
- Manter o menu lateral funcional; não remover o link existente de "Estrutura".

## Dependências

- `src/app/enum/ERouters.enum.ts`
- `src/app/modules/dashboard-admin/admin.router.ts`
- `src/app/modules/dashboard-admin/admin-clientes.router.ts` (novo)
- `src/app/modules/dashboard-admin/modules/clientes/clientes.router.ts` (novo)
- `src/app/modules/dashboard-admin/modules/clientes/pages/clientes-list/clientes-list.component.{ts,html,scss}` (novo)
- `src/app/modules/dashboard-admin/modules/clientes/services/clientes.service.ts` (novo)
- `src/app/modules/dashboard-admin/modules/clientes/interfaces/clientes.interface.ts` (novo)
- `src/app/modules/dashboard-admin/components/menu-dashboard-admin/menu-dashboard-admin.component.html`
- `src/app/modules/dashboard-admin/components/menu-dashboard-admin/menu-dashboard-admin.component.ts`

## Critérios de Aceite

- [x] **AC-01 — Enum atualizado:** O enum `ERouters` possui a propriedade `CLIENTES = 'clientes'`.
- [x] **AC-02 — Rota filha registrada:** `admin.router.ts` possui rota `path: ERouters.CLIENTES` com `loadChildren` apontando para `admin-clientes.router.ts`.
- [x] **AC-03 — Rota do módulo clientes:** `admin-clientes.router.ts` exporta `adminClientesRoutes` com `loadChildren` apontando para `clientes.router.ts`, que carrega `ClientesListComponent` via `loadComponent`.
- [x] **AC-04 — Página acessível:** A URL `/admin/clientes` renderiza o `ClientesListComponent` dentro do layout do `app.component.html` (menu lateral + `router-outlet`).
- [x] **AC-05 — Menu com link:** O menu lateral exibe link funcional para "Clientes" com navegação para `/admin/clientes` e `routerLinkActive`.
- [x] **AC-06 — Service criado:** `ClientesService` existe, é injetável em `root`, e está vazio (placeholder).
- [x] **AC-07 — Interface criada:** `IClientes` existe com campos mínimos (`id`, `name`, `email`).
- [x] **AC-08 — Build aprovado:** Build sem erros de compilação.
- [x] **AC-09 — Lint aprovado:** Lint sem erros nos arquivos novos/alterados.

## Riscos

| Risco | Impacto | Mitigação |
|---|---|---|
| Rota filha conflita com rota existente | Baixo | Verificar que `clientes` não é usado em outro lugar do enum ou rotas |
| Menu não marca ativo para rota filha | Baixo | Usar `routerLinkActive` e testar após implementação |
| Componente standalone não compila | Baixo | Seguir padrão de componentes existentes no projeto |

## Tasks

### Tasks - Front-end

- [x] **Task 1 — Adicionar CLIENTES ao enum:** Adicionar `CLIENTES = 'clientes'` ao `ERouters.enum.ts`.
  > ✅ 2026-08-03 — `CLIENTES = 'clientes'` adicionado ao enum. Arquivo: `src/app/enum/ERouters.enum.ts`.
- [x] **Task 2 — Criar estrutura de pastas:** Criar pastas `modules/clientes/pages/clientes-list/`, `modules/clientes/components/`, `modules/clientes/services/`, `modules/clientes/interfaces/` dentro de `src/app/modules/dashboard-admin/`.
  > ✅ 2026-08-03 — Pastas criadas: `modules/clientes/pages/clientes-list/`, `modules/clientes/components/`, `modules/clientes/services/`, `modules/clientes/interfaces/`.
- [x] **Task 3 — Criar interface IClientes:** Criar `src/app/modules/dashboard-admin/modules/clientes/interfaces/clientes.interface.ts` com interface mínima: `id`, `name`, `email`.
  > ✅ 2026-08-03 — Interface criada com campos `id`, `name`, `email`. Arquivo: `modules/clientes/interfaces/clientes.interface.ts`.
- [x] **Task 4 — Criar ClientesService:** Criar `src/app/modules/dashboard-admin/modules/clientes/services/clientes.service.ts` como `Injectable({ providedIn: 'root' })`, vazio (placeholder).
  > ✅ 2026-08-03 — Service criado como `providedIn: 'root'`, vazio. Arquivo: `modules/clientes/services/clientes.service.ts`.
- [x] **Task 5 — Criar ClientesListComponent:** Criar `src/app/modules/dashboard-admin/modules/clientes/pages/clientes-list/clientes-list.component.ts` como standalone, com template mínimo (`<h1>Clientes</h1><p>Em construção.</p>`). Criar arquivos `.html` e `.scss` vazios.
  > ✅ 2026-08-03 — Componente standalone criado com template mínimo. Arquivos: `clientes-list.component.ts`, `.html`, `.scss`.
- [x] **Task 6 — Criar clientes.router.ts:** Criar `src/app/modules/dashboard-admin/modules/clientes/clientes.router.ts` exportando `clientesRoutes: Routes` com rota `path: ''` e `loadComponent` para `ClientesListComponent`.
  > ✅ 2026-08-03 — Router criado com lazy-loading via `loadComponent`. Arquivo: `modules/clientes/clientes.router.ts`.
- [x] **Task 7 — Criar admin-clientes.router.ts:** Criar `src/app/modules/dashboard-admin/admin-clientes.router.ts` exportando `adminClientesRoutes: Routes` com `loadChildren` apontando para `clientes.router.ts`.
  > ✅ 2026-08-03 — Router intermediário criado. Arquivo: `admin-clientes.router.ts`.
- [x] **Task 8 — Adicionar rota filha em admin.router.ts:** Adicionar objeto de rota `path: ERouters.CLIENTES` com `loadChildren` apontando para `admin-clientes.router.ts` no array de `admin.router.ts`.
  > ✅ 2026-08-03 — Rota `clientes` adicionada ao `admin.router.ts` como irmã de `dashboard`.
- [x] **Task 9 — Atualizar menu dashboard admin:** Adicionar link "Clientes" no `menu-dashboard-admin.component.html` (lateral e inferior) com `[routerLink]="[ERouters.ADMIN, ERouters.CLIENTES]"` e `routerLinkActive="'active'"`. Manter link existente de "Estrutura".
  > ✅ 2026-08-03 — Link "Clientes" adicionado ao menu lateral e inferior. Arquivo: `menu-dashboard-admin.component.html`.
- [x] **Task 10 — Lint e build:** Executar `npx eslint` e `npx ng build --configuration local`.
  > ✅ 2026-08-03 — `npx eslint` aprovado (0 issues). `npx ng build --configuration local` aprovado (0 erros, 0 warnings).

## Resultado Esperado

- A rota `/admin/clientes` está acessível e renderiza o `ClientesListComponent` dentro do layout do `app.component.html` (menu lateral + `router-outlet`).
- O menu lateral exibe links para "Estrutura" e "Clientes", com indicação de ativo.
- O módulo `clientes` está estruturado com pastas, service, interface e componente, pronto para implementação de CRUD em specs futuras.
- Build e lint aprovados.

## Encerramento

> ✅ 2026-08-03 — Spec revisada, validada e encerrada.

### Validações finais

- `npx eslint`: aprovado (0 issues).
- `npx ng build --configuration local`: aprovado (0 erros, 0 warnings).

### Memória atualizada

- `memory/changelog.md`: adicionada entrada `012`.

### Observações

- Arquitetura ajustada durante implementação: o módulo `clientes` passou de rota filha de `dashboard` para rota filha direta de `admin`, ficando como irmã de `dashboard`. Isso simplifica o roteamento e permite que cada módulo admin tenha seu próprio layout independente.
- O `DashboardAdminComponent` manteve seu `<router-outlet>` vazio para futuras rotas filhas do próprio `dashboard`.
- Pasta do módulo movida de `clientes/` para `modules/clientes/` para manter consistência com a estrutura do projeto.
