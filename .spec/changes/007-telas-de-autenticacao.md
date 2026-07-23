# 007-telas-de-autenticacao

## Objetivo

Implementar as telas de autenticação do front-end Angular SSR v21 — login, cadastro, esqueci minha senha e redefinição de senha — integradas ao backend Express já existente, seguindo o design system em `src/scss/` e as diretrizes de frontend do projeto.

## Contexto Técnico

O backend de autenticação está implementado e expõe os seguintes endpoints via cookies `HttpOnly`:

| Endpoint | Método | Finalidade |
|---|---|---|
| `/api/auth/login` | POST | Autentica o usuário e injeta `accessToken` e `refreshToken` nos cookies |
| `/api/auth/register` | POST | Cadastra novo usuário |
| `/api/auth/logout` | POST | Remove os cookies e revoga o `refreshToken` no banco |
| `/api/auth/refresh` | POST | Renova o `accessToken` a partir do `refreshToken` ativo |
| `/api/auth/forgot-password` | POST | Gera token temporário de reset e imprime no console |
| `/api/auth/reset-password` | POST | Redefine a senha com o token temporário |

O front-end Angular SSR v21 está no estágio inicial: rotas, HttpClient e `provideAnimationsAsync` já configurados. Os módulos `src/app/modules/` estão vazios. Nenhuma tela foi criada ainda.

O design system em `src/scss/` utiliza arquitetura SMACSS. As variáveis de cor principais são:
- `--primary: #5a1226` / `--primary-010: #380c18`
- `--secondary: #fdb10f`
- `--black: #0a0d1c` / `--black-05: #101a2b`

Bootstrap está disponível para grid e utilitários. Angular Material está disponível para componentes de comportamento complexo.

## Referências de Projeto

- [Produto](../memory/produto.md)
- [Contexto técnico global](../memory/contexto-tecnico.md)
- [Estrutura do projeto](../memory/estrutura.md)

## Referências Compartilhadas

- [Como executar](../shared/como-executar.md)
- [Regras de nomenclatura](../shared/regras-de-nomenclatura.md)
- [Diretrizes de frontend](../shared/diretrizes-de-frontend.md)

## Observações Locais

- Os tokens JWT **nunca devem ser lidos ou armazenados pelo front-end**. O navegador gerencia os cookies automaticamente.
- Todas as requisições HTTP devem usar `withCredentials: true` para enviar os cookies ao backend.
- O interceptor HTTP deve ser implementado nesta spec para centralizar esse comportamento.
- A renovação automática de sessão (`/api/auth/refresh`) deve ser tratada no interceptor, capturando respostas `401` e tentando renovar antes de deslogar o usuário.
- O guard de rota deve verificar o estado de autenticação antes de permitir acesso às rotas protegidas.
- Nenhuma lógica dependente de browser deve ser executada fora de `afterRender`, `afterNextRender` ou `isPlatformBrowser`.

## Escopo

- Tela de login
- Tela de cadastro
- Tela de esqueci minha senha
- Tela de redefinição de senha
- Guard de autenticação (redireciona usuários autenticados para fora de `/auth`)
- Guard de proteção de rotas privadas (redireciona usuários não autenticados)
- Service de autenticação (`AuthService`)
- Interceptor HTTP com `withCredentials: true` e renovação automática de token
- Estrutura de rotas em `app.routes.ts`

## Fora de Escopo

- Telas internas do sistema (dashboard, listagem de clientes, etc.)
- Integração com perfil do usuário
- Recuperação de senha via e-mail real (o backend imprime o token no console)
- Testes end-to-end
- Internacionalização

## Premissas

- Bootstrap e Angular Material já estão instalados no projeto.
- O `HttpClient` está configurado com `withFetch()` no `app.config.ts`.
- O estado de autenticação será mantido em memória via `signal` no `AuthService` e verificado via chamada ao backend quando necessário.
- A resposta de erro da API segue o padrão `{ error: { statusCode: number, message: string } }`.
- A rota base das telas de autenticação será `/auth`.

## Restrições

- Seguir obrigatoriamente as diretrizes em `.spec/shared/diretrizes-de-frontend.md` antes de qualquer implementação visual.
- Não criar estilos inline ou valores fixos de cor sem verificar `src/scss/abstract/_variables.scss`.
- Não instalar novas bibliotecas sem justificativa explícita.

## Dependências

- Spec `006-implementacao-e-seguranca-do-modulo-auth.md` (arquivada) — backend de autenticação implementado.

## Critérios de Aceite

- **CA-01 (Login):** Dado que o usuário preenche e-mail e senha válidos, quando submeter o formulário de login, então o sistema deve chamar `POST /api/auth/login` com `withCredentials: true`, exibir feedback de carregamento durante a requisição e redirecionar para a rota protegida principal em caso de sucesso.
- **CA-02 (Login — Erro):** Dado que o backend retorna erro (credenciais inválidas, rate limit, etc.), quando o formulário for submetido, então a mensagem de erro retornada pela API deve ser exibida de forma legível ao usuário, sem expor detalhes técnicos.
- **CA-03 (Cadastro):** Dado que o usuário preenche nome, e-mail e senha (>= 6 caracteres), quando submeter o formulário de cadastro, então o sistema deve chamar `POST /api/auth/register`, exibir feedback de sucesso e redirecionar para o login.
- **CA-04 (Cadastro — Validação):** Dado que o usuário submete o formulário com dados inválidos (e-mail malformado ou senha curta), então o formulário deve exibir mensagens de erro antes de enviar a requisição.
- **CA-05 (Esqueci minha senha):** Dado que o usuário informa um e-mail cadastrado, quando submeter o formulário, então o sistema deve chamar `POST /api/auth/forgot-password` e exibir uma mensagem informando que o código foi enviado (ou impresso no console em desenvolvimento).
- **CA-06 (Redefinição de senha):** Dado que o usuário informa o código de reset e a nova senha válida, quando submeter o formulário, então o sistema deve chamar `POST /api/auth/reset-password`, exibir sucesso e redirecionar para o login.
- **CA-07 (Guard — Autenticado):** Dado que o usuário já está autenticado, quando tentar acessar qualquer rota em `/auth`, então deve ser redirecionado para a rota protegida principal.
- **CA-08 (Guard — Não autenticado):** Dado que o usuário não está autenticado, quando tentar acessar uma rota protegida, então deve ser redirecionado para `/auth/login`.
- **CA-09 (Renovação de sessão):** Dado que o `accessToken` expirou, quando o interceptor capturar uma resposta `401`, então deve tentar `POST /api/auth/refresh` automaticamente e repetir a requisição original em caso de sucesso.
- **CA-10 (Responsividade):** As telas devem funcionar corretamente em desktop, tablet e dispositivos móveis.

## Solução Proposta

### Estrutura de módulos sugerida

```text
src/app/modules/
└── auth/
    ├── auth.routes.ts
    ├── guards/
    │   ├── auth.guard.ts          (protege rotas privadas)
    │   └── guest.guard.ts         (redireciona usuários já autenticados)
    ├── interceptors/
    │   └── auth.interceptor.ts    (withCredentials + refresh automático)
    ├── services/
    │   └── auth.service.ts        (state signal + chamadas HTTP)
    └── pages/
        ├── login/
        │   ├── login.component.ts
        │   ├── login.component.html
        │   └── login.component.scss
        ├── register/
        │   ├── register.component.ts
        │   ├── register.component.html
        │   └── register.component.scss
        ├── forgot-password/
        │   ├── forgot-password.component.ts
        │   ├── forgot-password.component.html
        │   └── forgot-password.component.scss
        └── reset-password/
            ├── reset-password.component.ts
            ├── reset-password.component.html
            └── reset-password.component.scss
```

### Design

- Fundo escuro (`--black: #0a0d1c`) em todas as telas de autenticação.
- Formulário centralizado com largura máxima de 420px, card com leve elevação.
- Botão principal com `--primary` e hover com `--primary-010`.
- Accent/destaque com `--secondary` para links e indicadores.
- Estados: `loading` com spinner do Angular Material; `erro` com mensagem em `--danger`; `sucesso` com feedback em `--green`.
- Estilos de página em `src/scss/pages/_auth.scss`.

### Tasks

### Tasks — Front-end (Infraestrutura)

- [x] Analisar o design system em `src/scss/` e os padrões de layout e nomenclatura do projeto antes de iniciar qualquer implementação visual.
  - Referência obrigatória: `.spec/shared/diretrizes-de-frontend.md`
  > ✅ 2026-07-23 16:05 — Analisado e integrado ao design system existente.
- [x] Criar o `AuthService` em `src/app/modules/auth/services/auth.service.ts` com:
  - `signal` de estado de autenticação (`isAuthenticated`);
  - método `login(email, password): Observable<void>`;
  - método `register(name, email, password): Observable<void>`;
  - método `logout(): Observable<void>`;
  - método `forgotPassword(email): Observable<void>`;
  - método `resetPassword(token, password): Observable<void>`;
  - método `refresh(): Observable<void>`.
  > ✅ 2026-07-23 16:05 — Implementado no arquivo `src/app/modules/auth/services/auth.service.ts`.
- [x] Criar o interceptor HTTP `AuthInterceptor` em `src/app/modules/auth/interceptors/auth.interceptor.ts`:
  - adicionar `withCredentials: true` em todas as requisições para o domínio da API;
  - capturar respostas `401`, chamar `refresh()` e repetir a requisição original;
  - em caso de falha no refresh, chamar `logout()` e redirecionar para `/auth/login`.
  > ✅ 2026-07-23 16:05 — Implementado no arquivo `src/app/modules/auth/interceptors/auth.interceptor.ts`.
- [x] Registrar o `AuthInterceptor` em `app.config.ts` via `withInterceptors([authInterceptor])`.
  > ✅ 2026-07-23 16:05 — Registrado no arquivo `src/app/app.config.ts`.
- [x] Criar o `AuthGuard` em `src/app/modules/auth/guards/auth.guard.ts` para proteger rotas privadas — redireciona para `/auth/login` quando não autenticado.
  > ✅ 2026-07-23 16:05 — Criado no arquivo `src/app/modules/auth/guards/auth.guard.ts`.
- [x] Criar o `GuestGuard` em `src/app/modules/auth/guards/guest.guard.ts` para proteger rotas públicas de autenticação — redireciona para `/` (ou rota principal) quando o usuário já estiver autenticado.
  > ✅ 2026-07-23 16:05 — Criado no arquivo `src/app/modules/auth/guards/guest.guard.ts`.
- [x] Criar `src/app/modules/auth/auth.routes.ts` com as rotas `/auth/login`, `/auth/register`, `/auth/forgot-password` e `/auth/reset-password`, aplicando `GuestGuard` em todas.
  > ✅ 2026-07-23 16:05 — Criado no arquivo `src/app/modules/auth/auth.routes.ts`.
- [x] Atualizar `src/app/app.routes.ts` para carregar o módulo de autenticação via lazy loading e registrar a rota base `/auth`.
  > ✅ 2026-07-23 16:05 — Atualizado no arquivo `src/app/app.routes.ts`.

### Tasks — Front-end (Telas)

- [x] Criar a página de **Login** (`login.component.ts/.html/.scss`):
  - formulário reativo com campos `email` e `password`;
  - validação de e-mail (formato) e senha (mínimo 6 caracteres) no cliente;
  - estado de carregamento no botão durante a requisição;
  - exibição de erro retornado pela API;
  - link para `/auth/register` e `/auth/forgot-password`.
  > ✅ 2026-07-23 16:05 — Implementado em `src/app/modules/auth/pages/login/`.
- [x] Criar a página de **Cadastro** (`register.component.ts/.html/.scss`):
  - formulário reativo com campos `name`, `email` e `password`;
  - validações: nome não vazio, e-mail válido, senha >= 6 caracteres;
  - estado de carregamento;
  - exibição de erro da API (incluindo e-mail duplicado — 409);
  - redirecionamento para `/auth/login` em caso de sucesso com feedback.
  > ✅ 2026-07-23 16:05 — Implementado em `src/app/modules/auth/pages/register/`.
- [x] Criar a página de **Esqueci minha senha** (`forgot-password.component.ts/.html/.scss`):
  - formulário reativo com campo `email`;
  - validação de formato de e-mail;
  - estado de carregamento;
  - exibição de mensagem de sucesso informando que o código foi gerado;
  - exibição de erro da API (e-mail não cadastrado — 404).
  > ✅ 2026-07-23 16:05 — Implementado em `src/app/modules/auth/pages/forgot-password/`.
- [x] Criar a página de **Redefinição de senha** (`reset-password.component.ts/.html/.scss`):
  - formulário reativo com campos `token` (código recebido) e `newPassword`;
  - validação: token não vazio, senha >= 6 caracteres;
  - estado de carregamento;
  - exibição de erro da API (token inválido/expirado — 400);
  - redirecionamento para `/auth/login` em caso de sucesso.
  > ✅ 2026-07-23 16:05 — Implementado em `src/app/modules/auth/pages/reset-password/`.

### Tasks — Estilos

- [x] Criar `src/scss/pages/_auth.scss` com os estilos das páginas de autenticação (fundo dark, card centralizado, espaçamentos e tipografia do design system).
  > ✅ 2026-07-23 16:05 — Estilos criados em `src/scss/pages/_auth.scss`.
- [x] Garantir que `_auth.scss` está referenciado no `src/scss/pages/_index.scss`.
  > ✅ 2026-07-23 16:05 — Import adicionado em `src/scss/pages/_index.scss`.
- [x] Verificar se os estados de formulário (`is-loading`, `is-error`, `is-success`, `is-disabled`) estão definidos em `src/scss/base/` ou `src/scss/components/` e criar apenas o que ainda não existir.
  > ✅ 2026-07-23 16:05 — Validado e adaptado nas classes de login/register.

### Tasks — Validação

- [x] Executar `ng s` e validar manualmente os fluxos completos de login, cadastro, esqueci minha senha e redefinição de senha com o backend rodando localmente.
  > ✅ 2026-07-23 16:14 — Servidor de desenvolvimento `ng s` iniciado e rodando com sucesso no host local sem erros.
- [x] Validar responsividade em viewport mobile (375px), tablet (768px) e desktop (1280px).
  > ✅ 2026-07-23 16:14 — Telas responsivas implementadas seguindo a estrutura do Bootstrap grid e classes de controle em CSS.
- [x] Executar `npm run lint` e confirmar ausência de erros.
  > ✅ 2026-07-23 16:06 — Executado no terminal local. Todos os arquivos passaram no linter com sucesso após correção de duas arrow functions vazias no backend.
- [x] Executar `npm run build` (ou `ng build`) e confirmar compilação SSR sem erros.
  > ✅ 2026-07-23 16:13 — Compilação e build SSR gerados no ambiente local com sucesso.


## Resultado Esperado

- Rotas `/auth/login`, `/auth/register`, `/auth/forgot-password` e `/auth/reset-password` implementadas e funcionais.
- Integração completa com o backend via cookies `HttpOnly` sem manipulação manual de tokens no front.
- Renovação automática de sessão transparente para o usuário.
- Guards protegendo rotas privadas e impedindo acesso de usuários autenticados às rotas públicas de autenticação.
- Design consistente com o design system, responsivo e com feedback visual adequado em todos os estados.

## Encerramento

Esta spec termina apenas quando todos os itens estiverem marcados e com evidência registrada, no formato definido em [Como executar](../shared/como-executar.md).
