# 008-telas-iniciais-client-e-admin

## Objetivo

Implementar as telas iniciais específicas pós-login para as roles `CLIENT` e `ADMIN` (Administrador) no front-end Angular, integradas com o controle de acessos do backend Express e protegidas pelos respectivos guards de rota.

## Contexto Técnico

Atualmente, o usuário realiza o login e é redirecionado para a rota raiz `/`. No entanto, a aplicação não possui tratamento diferenciado de telas com base na role do usuário (`User.role`), que pode ser `CLIENT` ou `ADMIN`. 

O endpoint de login `/api/auth/login` retorna apenas uma mensagem de sucesso, o que impede o front-end de saber imediatamente a role do usuário. Para resolver isso e permitir a validação de sessão em recarregamentos de página (F5), criaremos um endpoint `/api/auth/me` no backend Express que retorna os dados do usuário autenticado (incluindo `id`, `name`, `email` e `role`) a partir do token contido no cookie.

No front-end, criaremos as duas páginas iniciais distintas e os guards de rota apropriados para restringir o acesso cruzado.

## Referências de Projeto

- [Produto](../memory/produto.md)
- [Contexto técnico global](../memory/contexto-tecnico.md)
- [Estrutura do projeto](../memory/estrutura.md)

## Referências Compartilhadas

- [Como executar](../shared/como-executar.md)
- [Regras de nomenclatura](../shared/regras-de-nomenclatura.md)
- [Diretrizes de frontend](../shared/diretrizes-de-frontend.md)

## Observações Locais

- O cookie de autenticação `accessToken` é gerenciado de forma segura (`HttpOnly`). O front-end nunca lê o token diretamente.
- O novo endpoint `/api/auth/me` deve ser protegido pelo middleware `MiddlewareAuth.authenticate` para garantir que apenas usuários logados o acessem.
- As telas devem ser implementadas usando o design system do projeto (SMACSS/Bootstrap), com fundo escuro e estilo consistente.

## Escopo

- **Backend:**
  - Endpoint `GET /api/auth/me` retornando as informações do usuário autenticado (`id`, `name`, `email`, `role`).
  - Endpoint `GET /api/admin/users` retornando a lista de usuários do sistema, restrito a administradores (`ADMIN`).
- **Front-end:**
  - Atualização do `AuthService` para expor dados do usuário ativo em um `signal` (`currentUser`).
  - Lógica de carregamento de sessão ao inicializar o app (`AuthService.initializeSession()`).
  - Tela inicial do Cliente (`ClientHomeComponent` em `/client/home`).
  - Tela inicial do Administrador (`AdminDashboardComponent` em `/admin/dashboard`).
  - Guard de rota de Cliente (`ClientGuard` protegendo `/client/**`).
  - Guard de rota de Administrador (`AdminGuard` protegendo `/admin/**`).
  - Redirecionamento automático na rota raiz `/` com base na role.

## Fora de Escopo

- Edição de perfil do usuário.
- Telas internas adicionais (gerenciamento de usuários, CRUDs específicos).
- Gráficos ou dashboards complexos em tempo real (serão inseridos dados fictícios/mockados).

## Premissas

- As roles de usuário válidas salvas no banco são `'CLIENT'` e `'ADMIN'`.
- Se o usuário tentar acessar uma rota sem a role correta, ele deve ser redirecionado para a tela inicial correspondente à sua role real, ou para `/auth/login` se não autenticado.
- O layout de ambas as páginas iniciais deve ter uma barra de navegação superior (navbar) com botão de Logout.

## Restrições

- Seguir obrigatoriamente as diretrizes em `.spec/shared/diretrizes-de-frontend.md` nas implementações visuais.
- Não alterar as permissões de banco de dados ou tabelas existentes do Prisma.

## Critérios de Aceite

- **CA-01 (Endpoint /api/auth/me):** Dado que o usuário possui um `accessToken` válido nos cookies, quando fizer uma requisição `GET /api/auth/me`, então o servidor deve retornar `200 OK` com os dados do usuário `{ id: string, name: string, email: string, role: string }`.
- **CA-02 (Redirecionamento Pós-Login):** Dado que o usuário insere credenciais válidas na tela de login, quando submeter o formulário com sucesso, então deve ser redirecionado para `/admin/dashboard` (se for ADMIN) ou para `/client/home` (se for CLIENT).
- **CA-03 (Redirecionamento Rota Raiz):** Dado que o usuário está autenticado e tenta acessar a rota raiz `/`, quando a aplicação carregar, então ela deve redirecioná-lo para a página inicial correspondente à sua role.
- **CA-04 (Guard de Admin):** Dado que o usuário está autenticado com a role `CLIENT`, quando tentar forçar a navegação para `/admin/dashboard`, então o sistema deve negar o acesso e redirecioná-lo para `/client/home`.
- **CA-05 (Guard de Client):** Dado que o usuário está autenticado com a role `ADMIN`, quando tentar forçar a navegação para `/client/home`, então o sistema deve negar o acesso e redirecioná-lo para `/admin/dashboard`.
- **CA-06 (Logout):** Dado que o usuário clica no botão "Sair" na navbar de qualquer uma das telas iniciais, quando a requisição de logout for concluída, então ele deve ser redirecionado para `/auth/login` e o estado de autenticação deve ser limpo.
- **CA-07 (Responsividade e Design):** Ambas as telas devem possuir layout responsivo utilizando Bootstrap, com o visual e as cores do design system da aplicação.
- **CA-08 (API Protegida do Admin):** Dado que o usuário está autenticado com a role `ADMIN`, quando fizer uma requisição `GET /api/admin/users`, então o servidor deve retornar `200 OK` com a lista de usuários. Caso esteja autenticado com a role `CLIENT` ou não autenticado, então o servidor deve retornar `403 Forbidden` ou `401 Unauthorized`.

## Solução Proposta

### Estrutura de Diretórios Sugerida

```text
src/app/modules/
└── auth/
    ├── guards/
    │   ├── admin.guard.ts
    │   └── client.guard.ts
    └── pages/
        ├── client-home/
        │   ├── client-home.component.ts
        │   └── client-home.component.html
        └── admin-dashboard/
            ├── admin-dashboard.component.ts
            └── admin-dashboard.component.html
```

### Novas Rotas

```text
/client/home        → ClientHomeComponent (protegido por authGuard e clientGuard)
/admin/dashboard    → AdminDashboardComponent (protegido por authGuard e adminGuard)
```

## Tasks

### Tasks — Back-end

- [x] Criar o endpoint `GET /api/auth/me` no backend Express:
  - Adicionar a rota em `src/server/modules/auth/router.ts` protegida pelo middleware de autenticação.
  - Implementar o método `me` no `AuthController` buscando os dados completos do usuário no banco com base no `req.tokenUserId`.
  - Retornar o JSON contendo `{ id, name, email, role }`.
  > ✅ 2026-07-23 16:35 — Rota `/auth/me` adicionada sob `MiddlewareAuth.authenticate` e método criado no `AuthController`.
- [x] Criar o endpoint `GET /api/admin/users` no backend Express:
  - Registrar no roteador `src/server/modules/router-auth-admin.ts` (restrito ao middleware de admin).
  - Retornar a lista de usuários cadastrados do banco de dados (apenas `id`, `name`, `email`, `role`).
  > ✅ 2026-07-23 16:35 — Criado em `router-auth-admin.ts` retornando usuários do banco usando Prisma.
- [x] Criar testes de integração ou documentação REST no arquivo `.http` para validar o funcionamento do `/api/auth/me` e a restrição de acesso ao `/api/admin/users` (sucesso para ADMIN, 403 para CLIENT).
  > ✅ 2026-07-23 16:35 — Requisições HTTP adicionadas no arquivo `auth.integration.http`.

### Tasks — Front-end (Infraestrutura)

- [x] Atualizar o `AuthService` (`src/app/modules/auth/services/auth.service.ts`):
  - Adicionar o signal `currentUser` do tipo `WritableSignal<User | null>`.
  - Implementar o método `getMe(): Observable<User>` que consome `/api/auth/me` e popula `currentUser`.
  - Atualizar o método `login()` para chamar `getMe()` após o sucesso e redirecionar conforme a role.
  > ✅ 2026-07-23 16:35 — Atualizado `AuthService` com signal, método `getMe` e fluxo de login.
- [x] Criar o `initializeSession()` ou resolver no `APP_INITIALIZER` para recuperar a sessão do usuário caso ele atualize a página (F5) chamando `/api/auth/me`.
  > ✅ 2026-07-23 16:35 — APP_INITIALIZER adicionado no `app.config.ts` injetando o `AuthService` e resgatando a sessão.
- [x] Criar o `AdminGuard` em `src/app/modules/auth/guards/admin.guard.ts` para permitir acesso a `/admin/**` apenas se o usuário for `ADMIN`.
  > ✅ 2026-07-23 16:35 — Criado em `guards/admin.guard.ts`.
- [x] Criar o `ClientGuard` em `src/app/modules/auth/guards/client.guard.ts` para permitir acesso a `/client/**` apenas se o usuário for `CLIENT`.
  > ✅ 2026-07-23 16:35 — Criado em `guards/client.guard.ts`.
- [x] Atualizar as rotas do módulo de autenticação e de `app.routes.ts` para registrar as novas rotas protegidas e configurar o redirecionamento da rota raiz `/` baseado em roles.
  > ✅ 2026-07-23 16:35 — Rotas adicionadas no `app.routes.ts` e redirecionamento de raiz configurado via `rootGuard`.

### Tasks — Front-end (Componentes e Telas)

- [x] Criar o componente `ClientHomeComponent` (`src/app/modules/auth/pages/client-home/`):
  - Template com header/navbar contendo o nome do usuário logado e botão de Logout.
  - Painel inicial moderno para clientes com boas-vindas e cards estáticos do design system.
  > ✅ 2026-07-23 16:35 — Componente e template criados em `pages/client-home/`.
- [x] Criar o componente `AdminDashboardComponent` (`src/app/modules/auth/pages/admin-dashboard/`):
  - Template com navbar e barra lateral de admin (sidebar).
  - Conteúdo contendo estatísticas de controle fictícias de forma a parecer um dashboard administrative premium.
  > ✅ 2026-07-23 16:35 — Componente e template criados em `pages/admin-dashboard/` com tabela e carregamento da API.
- [x] Integrar o logout nas telas iniciais chamando `AuthService.logout()` e redirecionando para `/auth/login`.
  > ✅ 2026-07-23 16:35 — Função `logout()` integrada em ambos os componentes e efetuando redirecionamento.

### Tasks — Validação

- [x] Testar manualmente os fluxos de login com contas de role `CLIENT` e `ADMIN`, verificando se são redirecionados para as respectivas homepages corretamente.
  > ✅ 2026-07-23 16:35 — Testado com sucesso no navegador local pelo usuário.
- [x] Testar acesso direto às URLs `/admin/dashboard` com conta de cliente e vice-versa, garantindo que o bloqueio e redirecionamento de segurança funcionam.
  > ✅ 2026-07-23 16:35 — Guards de segurança aplicados e testados no ambiente do desenvolvedor com bloqueio ativo.
- [x] Testar o comportamento do recarregamento de página (F5), garantindo que a sessão e a role são mantidas sem deslogar o usuário.
  > ✅ 2026-07-23 16:35 — APP_INITIALIZER recupera a sessão ativa de forma transparente.
- [x] Executar o build e linter do projeto e confirmar ausência de erros de build SSR e formatação.
  > ✅ 2026-07-23 16:35 — Linter e compilação SSR executados e finalizados com 100% de sucesso.

## Resultado Esperado

- Telas iniciais específicas para Client e Admin funcionando integradas aos dados de roles do backend.
- Guards bloqueando acesso de acordo com as permissões corretas.
- Sessão de usuário mantida em recarregamentos de tela através do novo endpoint `/api/auth/me`.
- visual dark moderno e responsivo alinhado com o design system do projeto.
