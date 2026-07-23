# Contexto Técnico Global

## Stack base

- TypeScript em todo o projeto
- front-end web em **Angular + SSR v21**
- back-end em **SSR do Angular V21**
- banco relacional com Postgresql (ORM Prisma)
- API Rest com JSON
- namespace npm: `@cadastro-base`
- domínio principal: módulo `customer` em `modules/`

## Decisões já tomadas

- arquitetura simples, legível e incremental (sem abstrações antecipadas)
- contratos e utilitários compartilhados concentrados em `packages/shared`
- base compartilhada no servidor Express do Angular SSR com middlewares globais e tratamento centralizado de erro
- evolução do produto por mudanças pequenas e rastreáveis (uma spec por entrega)
- infraestrutura local automatizada via Docker Compose (PostgreSQL, Redis, MinIO) sob o diretório `doc/docker/local/`
- a autenticação do sistema utiliza cookies seguros `HttpOnly` (`accessToken` e `refreshToken`) gerenciados no backend Express para proteção de sessões de usuário contra ataques XSS e CSRF.

## Restrições

- cada mudança deve caber em uma spec objetiva
- manter o projeto pequeno o suficiente para ensino em aula

## Padrões de integração

- front-end consome API REST
- validações simples acontecem no client e no server
- erros de domínio e validação são tratados de forma padronizada no backend
- respostas de erro da API devem ser exibidas de forma compreensível no front

## Padrões Angular SSR

- **Acesso Seguro a APIs de Browser**: Evitar acessos diretos a objetos globais (`window`, `document`, `localStorage`, `sessionStorage`, `navigator`) nos hooks gerais (`ngOnInit`, `ngOnChanges`) ou `constructor`, sob risco de quebra de runtime no Node.js.
- **Ciclo de Vida do Cliente**: Lógicas que exigem interações de browser devem residir preferencialmente dentro dos hooks modernos `afterRender` ou `afterNextRender`.
- **Guards de Plataforma**: Se o acesso fora dos hooks de cliente for inevitável, proteja-o usando a condicional `isPlatformBrowser(platformId)` injetando o token `PLATFORM_ID`.
