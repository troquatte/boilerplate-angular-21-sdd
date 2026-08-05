# Corrigir Logout: Encerramento de Sessão e Redirecionamento

## Objetivo

Corrigir o botão "Sair" do menu do dashboard administrativo para que ele encerre a sessão no backend (limpe o cookie de autenticação) e redirecione o usuário para a tela de login.

## Contexto

O menu do dashboard admin (`menu-dashboard-admin.component.html`) usa `[routerLink]` para navegar para a rota `/auth` quando o botão "Sair" é clicado. Isso apenas muda a rota do Angular, mas não chama o endpoint de logout (`POST /api/auth/logout`) do backend, nem limpa os signals de autenticação do frontend. O resultado é que o usuário apenas oculta o menu e fica na tela atual, podendo eventualmente acessar dados protegidos se o cookie ainda estiver válido.

O `AuthService` já possui o método `logout()` que faz `POST /api/auth/logout` e atualiza os signals (`isAuthenticated`, `currentUser`).

## Escopo

### Frontend — Menu Dashboard Admin
- Modificar `src/app/modules/dashboard-admin/components/menu-dashboard-admin/menu-dashboard-admin.component.ts`:
  - Injetar `AuthService` e `Router`
  - Criar método `onLogout()` que:
    - Chama `AuthService.logout()`
    - Após sucesso ou erro, redireciona para `/auth/login` via `Router.navigate`
- Modificar `src/app/modules/dashboard-admin/components/menu-dashboard-admin/menu-dashboard-admin.component.html`:
  - Substituir `[routerLink]` do botão "Sair" por `(click)="onLogout()"` (desktop e mobile)

### Fora de Escopo
- Alterações no backend (endpoint de logout já funciona)
- Alterações no interceptor de auth
- Alterações no menu do design-system
- Alterações no menu do client-home (escopo separado)

## Dependencias
- `src/app/modules/dashboard-admin/components/menu-dashboard-admin/menu-dashboard-admin.component.ts`
- `src/app/modules/dashboard-admin/components/menu-dashboard-admin/menu-dashboard-admin.component.html`
- `src/app/modules/auth/services/auth.service.ts` (já existe)

## Premissas
- `AuthService.logout()` faz POST para `/api/auth/logout` e atualiza signals
- A rota de login é `/auth/login`
- O menu possui duas versões: desktop (menu-left) e mobile (menu-bottom)

## Restricoes
- Manter o layout e estilo existentes do menu
- Não usar `routerLink` + `click` ao mesmo tempo (evitar dupla navegação)
- Redirecionar mesmo se o logout API falhar (garantir que o usuário saia da tela admin)

## Critérios de Aceite

- [x] **AC-01 — Botão Sair chama API:** Ao clicar em "Sair", o endpoint `POST /api/auth/logout` é chamado.
- [x] **AC-02 — Signals atualizados:** `isAuthenticated` fica `false` e `currentUser` fica `null` após logout.
- [x] **AC-03 — Redirecionamento:** Usuário é redirecionado para `/auth/login` após logout.
- [x] **AC-04 — Desktop e mobile:** Funciona tanto no menu desktop (menu-left) quanto no menu mobile (menu-bottom).
- [x] **AC-05 — Falha segura:** Se a API de logout falhar, o usuário ainda é redirecionado para login.
- [x] **AC-06 — Build aprovado:** Build sem erros.
- [x] **AC-07 — Lint aprovado:** Lint sem erros.

## Tasks

- [x] **Task 1 — Componente:** Adicionar `onLogout()` no `menu-dashboard-admin.component.ts` (injetar `AuthService` e `Router`).
  > ✅ 2026-08-05 — Injetado `AuthService` e `Router`. Método `onLogout()` usa `finalize()` para garantir redirecionamento mesmo em erro.
- [x] **Task 2 — Template:** Alterar botão "Sair" para `(click)="onLogout()"` no desktop e mobile.
  > ✅ 2026-08-05 — Substituído `[routerLink]` por `(click)="onLogout()"` em ambas as versões (desktop e mobile).
- [x] **Task 3 — Build e lint:** Validações.
  > ✅ 2026-08-05 — Build e lint aprovados.

## Resultado Esperado
- Ao clicar em "Sair", o menu desaparece, a sessão é encerrada no backend, e o usuário é redirecionado para a tela de login.

## Encerramento

> ✅ 2026-08-05 — Spec revisada, validada e encerrada.

### Validações finais

- `npx ng build --configuration local`: executado com sucesso.
- `npx eslint`: executado com sucesso.

### Memória atualizada

- `memory/changelog.md`: adicionada entrada `027`.
