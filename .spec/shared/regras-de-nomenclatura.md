# Regras de Nomenclatura

Convenções globais de nomes de arquivos e diretórios. Podem ser referenciadas por qualquer spec.

## Regra geral

- nomes de arquivos e diretórios em `kebab-case`, sempre minúsculas
- nomes devem indicar **responsabilidade**, não implementação
- quando fizer sentido, o sufixo deve explicitar o papel do arquivo
- não usar `PascalCase`, `camelCase` ou mistura de maiúsculas em diretórios

Exemplos de diretórios válidos: `shared`, `components`, `services`, `directives`, `pipes`, `customer-settings`.

## Sufixos recomendados

| Sufixo                | Uso                                                                        |
| --------------------- | -------------------------------------------------------------------------- |
| `*.entity.ts`         | entidades de domínio                                                       |
| `*.vo.ts`             | value objects                                                              |
| `*.repository.ts`     | contratos ou implementações de repositório                                 |
| `*.use-case.ts`       | casos de uso                                                               |
| `*.service.ts`        | serviços de domínio ou do Angular                                         |
| `*.provider.ts`       | interfaces (portas) ou providers customizados                              |
| `*.handler.ts`        | handlers de rota / endpoints da API (Angular SSR backend)                  |
| `*.middleware.ts`     | middlewares do Express (Angular SSR backend)                              |
| `*.guard.ts`          | guards (preferencialmente funcionais no Angular v21)                       |
| `*.interceptor.ts`    | interceptors HTTP (Angular - preferencialmente funcionais no Angular v21)   |
| `*.resolver.ts`       | resolvers de rotas (Angular - preferencialmente funcionais no Angular v21)  |
| `*.pipe.ts`           | pipes de transformação do Angular                                          |
| `*.directive.ts`      | diretivas do Angular                                                       |
| `*.component.ts`      | lógica de componentes do Angular                                           |
| `*.component.html`    | templates HTML de componentes do Angular                                   |
| `*.component.scss`    | folhas de estilo SCSS (ou CSS) de componentes do Angular                   |
| `*.routes.ts`         | definições de rotas do Angular                                             |
| `*.config.ts`         | arquivos de configuração global ou do client                               |
| `*.config.server.ts`  | arquivos de configuração específicos do servidor (SSR Angular)            |
| `*.factory.ts`        | fábricas para clientes, adapters, instâncias ou objetos complexos          |
| `*.types.ts`          | tipos auxiliares                                                           |
| `*.store.ts`          | stores de estado (Ex: `@ngrx/signals`, NgRx ou Signal-based)               |
| `*.spec.ts`           | testes automatizados                                                       |

### Exemplos aplicados

- `user.repository.ts`
- `subscription.entity.ts`
- `email.vo.ts`
- `login.use-case.ts`
- `auth.handler.ts`
- `role-authorization.middleware.ts`
- `customer-form.component.ts`
- `customer-form.component.html`
- `customer-form.component.scss`
- `auth.guard.ts` (ex: `const authGuard: CanActivateFn = ...`)
- `token.interceptor.ts` (ex: `const tokenInterceptor: HttpInterceptorFn = ...`)
- `customer.resolver.ts` (ex: `const customerResolver: ResolveFn<Customer> = ...`)
- `phone-mask.directive.ts`
- `format-date.pipe.ts`
- `customer.routes.ts`
- `session.store.ts`
- `app.config.ts`
- `app.config.server.ts`
- `menu.types.ts`
- `api-client.factory.ts`

## Arquivos Específicos do Angular + SSR v21

Arquivos de bootstrap e infraestrutura do servidor SSR e client mantêm seus nomes padrão gerados pelo Angular CLI:
- `main.ts` (bootstrap client-side)
- `main.server.ts` (bootstrap server-side)
- `server.ts` (servidor Express/SSR integrado)

## Exceções controladas

Nomes exigidos por ferramentas ou convenções externas mantêm o formato original. Exemplos: `README.md`, `SKILL.md`, `package.json`, `tsconfig.json`, `angular.json`, `spec.md`.

Fora dessas exceções, prefira sempre `kebab-case`.

## Regra de decisão

Se um nome estiver ambíguo, prefira a forma que deixe mais claro:

- o que o arquivo representa
- em que camada ele vive
- qual a responsabilidade principal
