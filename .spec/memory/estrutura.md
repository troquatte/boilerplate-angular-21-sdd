# Estrutura do Projeto

## Estrutura alvo do repositório

```text
.specs/
  changes/
  memory/
  shared/
  templates/
apps/
  frontend/
modules/
  customer/
packages/
  shared/
```

## Responsabilidades

- `.specs/changes` — specs de mudanças específicas
- `.specs/memory` — contexto global do projeto
- `.specs/shared` — convenções reutilizáveis entre specs
- `.specs/templates` — modelos para criar novas mudanças
- `apps/frontend` — aplicação Angular SSR v21 contendo as telas (client) e a API/Backend integrada (server em `server.ts` ou Server Routes)
- `modules/<dominio>` — regras de negócio por domínio
- `packages/shared` — contratos e utilitários reaproveitáveis por front e back

## Organização de módulos

- um módulo por área de negócio relevante
- regras de negócio primeiro, detalhes técnicos depois

## Limites entre camadas

- o front-end não conhece banco de dados
- o back-end expõe casos de uso via API
- regras de negócio não dependem diretamente da interface web
- a spec descreve a mudança **antes** da implementação

## Convenções para `apps/frontend/src/app/shared`

- `shared` contém apenas código reutilizável e sem acoplamento ao estado ou configuração da aplicação atual
- configurações, navegação/rotas, chaves de storage e dados específicos do projeto ficam na camada da aplicação (`app`), fora de `shared`
- services, pipes, diretivas e componentes de UI genéricos, reutilizáveis e agnósticos ao projeto podem viver em `shared`
- stores (Signal/RxJS), guards, resolvers ou services ligados a autenticação, sessão, regras de negócio, rotas, tenant ou permissões devem ficar no diretório principal ou em features de negócio do `app` (fora de `shared`)
- a pasta `shared/components/ui` é exceção: componentes originados de bibliotecas de UI (como Spartan/Shadcn para Angular) podem manter a convenção original da biblioteca
- estas convenções podem evoluir quando houver necessidade explícita do time, desde que permaneçam consistentes dentro do contexto alterado
