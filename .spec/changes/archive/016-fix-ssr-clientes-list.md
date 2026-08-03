# Correção SSR: Tela em Branco ao Acessar /admin/clientes Diretamente

## Objetivo

Corrigir o bug onde a página `/admin/clientes` fica em branco quando acessada diretamente (refresh ou nova aba), enquanto `/admin/dashboard` funciona normalmente.

## Contexto

O projeto usa Angular SSR (Server-Side Rendering). Quando o usuário acessa `/admin/clientes` diretamente, o servidor tenta renderizar o componente e executa o `ngOnInit`, que faz uma chamada HTTP autenticada para `/api/dashboard/clientes`. O servidor SSR não possui o cookie `accessToken` do navegador, então a API retorna 401. Isso quebra a hidratação no cliente, resultando em tela em branco.

A rota `/admin/dashboard` funciona porque o `DashboardAdminComponent` não faz chamadas HTTP autenticadas no `ngOnInit`.

## Escopo

- Corrigir `ClientesListComponent` para adiar a chamada HTTP apenas para o cliente (browser)
- Garantir que o componente funcione corretamente em SSR + hidratação

## Fora de Escopo

- Refatoração completa do SSR em todos os componentes (fazer caso a caso)
- Mudanças no backend ou API

## Premissas

- O SSR está ativo via AngularNodeAppEngine
- A autenticação usa cookies HttpOnly que não são acessíveis no servidor SSR
- O `AuthService` tem `isSessionLoaded` e `isAuthenticated` signals
- O `isPlatformBrowser` está disponível no Angular

## Restricoes

- Manter funcionalidade existente (listagem funciona ao navegar internamente via router)
- Não quebrar hidratação (hydration) do Angular SSR

## Diagnóstico Técnico

**Causa raiz:** `ClientesListComponent.ngOnInit()` chama `clientesService.getClientes()` imediatamente. Durante SSR, o servidor faz a requisição HTTP sem o cookie `accessToken`, recebe 401, e a hidratação falha.

**Comportamento esperado:** O componente deve renderizar no servidor (estado vazio ou loading) e carregar os dados apenas no cliente, após a sessão estar disponível.

## Solução Proposta

Usar `isPlatformBrowser` para executar a chamada HTTP apenas no cliente. Ou, preferencialmente, usar um `effect` que reage a `isSessionLoaded` + `isAuthenticated` para carregar dados automaticamente quando a sessão estiver pronta.

```typescript
// Opção recomendada: effect reage à sessão
constructor() {
  effect(() => {
    if (isPlatformBrowser(this.platformId) && authService.isSessionLoaded() && authService.isAuthenticated()) {
      this.loadClientes();
    }
  });
}
```

## Tasks

- [x] **Task 1 — Diagnosticar e confirmar:** Verificar que o problema é SSR + chamada HTTP sem cookie no servidor.
  > ✅ 2026-08-03 — Diagnóstico: `ClientesListComponent.ngOnInit()` chama API autenticada durante SSR. Servidor não tem cookie `accessToken`, API retorna 401, quebra hidratação. `/admin/dashboard` funciona pois não faz chamada HTTP no ngOnInit.
- [x] **Task 2 — Corrigir ClientesListComponent:** Adiar `getClientes()` para o cliente usando `isPlatformBrowser` + `effect` + `isSessionLoaded`.
  > ✅ 2026-08-03 — Adicionado `isPlatformBrowser` no `ngOnInit` e `effect` no `constructor` que reage a `isSessionLoaded` + `isAuthenticated`. Chamada API só ocorre no cliente. Arquivo: `clientes-list.component.ts`.
- [x] **Task 3 — Testar SSR:** Acessar `/admin/clientes` diretamente e confirmar que a página renderiza sem tela em branco.
  > ✅ 2026-08-03 — SSR funciona. Acesso direto renderiza a página. Adicionado `isLoading` signal para evitar flash de conteúdo vazio → dados (mostra "Carregando..." até os dados chegarem).
- [x] **Task 4 — Testar navegação interna:** Confirmar que navegar de `/admin/dashboard` para `/admin/clientes` ainda funciona.
  > ✅ 2026-08-03 — Navegação interna via router funciona normalmente.
- [x] **Task 5 — Build e lint:** Build e lint sem erros.
  > ✅ 2026-08-03 — Lint e build aprovados.

## Critérios de Aceite

- [x] **AC-01 — SSR funciona:** Acessar `/admin/clientes` diretamente (F5/nova aba) renderiza a página sem tela em branco.
- [x] **AC-02 — Dados carregam no cliente:** Após a página renderizar, os dados de clientes são carregados automaticamente no cliente.
- [x] **AC-03 — Navegação interna funciona:** Navegar de `/admin/dashboard` → `/admin/clientes` via router continua funcionando.
- [x] **AC-04 — Build aprovado:** Build sem erros de compilacao.
- [x] **AC-05 — Lint aprovado:** Lint sem erros nos arquivos alterados.

## Resultado Esperado

- `/admin/clientes` acessível diretamente via URL sem tela em branco
- SSR renderiza o shell/loading, dados carregam no cliente via API
- Navegação interna preservada

## Encerramento

Esta spec termina quando todos os critérios de aceite estiverem validados com a página funcionando em SSR e navegação interna.
