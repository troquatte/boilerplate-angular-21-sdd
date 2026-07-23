# 001-modulo-autenticacao

## Objetivo

Criar o módulo de autenticação integrado ao backend (servidor Express / Server Routes) da aplicação Angular SSR v21, com validações de entrada, simulação de banco de dados via arquivo JSON e geração de tokens JWT retornando apenas o e-mail no payload.

## Contexto Técnico

- Backend/API embutido no servidor do Angular SSR (Express) com persistência temporária baseada em arquivo JSON.
- Autenticação e assinatura baseadas em JWT (JSON Web Token), contendo somente o e-mail no payload.
- Assegurar validações rígidas de e-mail e tamanho mínimo de senha (mínimo 6 caracteres).
- Esta especificação cobre **apenas** a implementação do servidor (API/Backend).

## Referências de Projeto

- [Produto](../memory/produto.md)
- [Contexto técnico global](../memory/contexto-tecnico.md)
- [Estrutura do projeto](../memory/estrutura.md)

## Referências Compartilhadas

- [Como executar](../shared/como-executar.md)
- [Regras de nomenclatura](../shared/regras-de-nomenclatura.md)

## Observações Locais

- O simulador de banco de dados usará um arquivo `users-db.json` localizado na pasta de dados do módulo auth do backend.
- O payload do JWT deve conter apenas a chave `email`.
- Caso seja necessário adicionar novas dependências, a tarefa correspondente solicitará que o usuário as instale via terminal.

## Tasks

### Tasks - Negócio

- [ ] Definir a entidade de domínio `User` e interfaces para o repositório de usuários (`UserRepository`).
- [ ] Criar o caso de uso `LoginUseCase` que orquestra a validação do e-mail, verificação de senha e assinatura do token JWT.

### Tasks - Back-end

- [ ] Criar o arquivo `users-db.json` dentro do diretório de dados do servidor (`apps/frontend/src/server/data/`) com usuários de teste simulados (com e-mail e senhas).
- [ ] Implementar a simulação do repositório (`JsonUserRepository`) que lê e busca usuários no arquivo `users-db.json`.
- [ ] Criar o validador para a rota de login (`login.validator.ts`), garantindo validação de formato de e-mail e tamanho de senha de no mínimo 6 caracteres.
- [ ] Criar o handler de autenticação (`auth.handler.ts`) e registrá-lo no servidor Express da aplicação Angular SSR (`apps/frontend/server.ts` ou Server Routes), expondo a rota `POST /api/auth/login`.
- [ ] Implementar a lógica de JWT que assina o e-mail no payload (retornando `{ token: string }` no corpo da resposta de login).
- [ ] Criar o arquivo REST Client `apps/frontend/src/server/auth.integration.http` estruturado com divisores `###`, uso de variáveis (ex: `@host = http://localhost:4200`) e comentários dos retornos HTTP esperados, cobrindo:
  - Cenário 1: Login com credenciais válidas e retorno de token JWT (Sucesso - `# Expected: 200 OK`).
  - Cenário 2: Login com e-mail em formato inválido (Erro - `# Expected: 400 Bad Request`).
  - Cenário 3: Login com senha com menos de 6 caracteres (Erro - `# Expected: 400 Bad Request`).
  - Cenário 4: Login com senha incorreta para e-mail existente (Erro - `# Expected: 401 Unauthorized`).
  - Cenário 5: Login com e-mail não cadastrado (Erro - `# Expected: 401 Unauthorized`).

### Tasks - Validação

- [ ] Solicitar ao usuário a instalação de pacotes necessários no terminal (ex: `npm install jsonwebtoken @types/jsonwebtoken bcryptjs @types/bcryptjs` na pasta `apps/frontend`).
- [ ] Solicitar ao usuário a execução do servidor Angular SSR e validação manual dos endpoints usando o arquivo `auth.integration.http`.

## Resultado Esperado

- Endpoints de autenticação estruturados e integrados no servidor Express da aplicação Angular SSR.
- Rota `POST /api/auth/login` validando e-mail (formato) e senha (mínimo 6 caracteres).
- Geração de token JWT com payload contendo apenas o e-mail do usuário autenticado.
- Arquivo `users-db.json` simulando banco de dados contendo usuários cadastrados.
- Cenários de erro e sucesso testados via Rest Client (`auth.integration.http`).

## Encerramento

> ✅ 2026-07-23 18:26 — Spec encerrada sem execução direta. As funcionalidades planejadas nesta spec foram absorvidas e entregues integralmente pela spec `006-implementacao-e-seguranca-do-modulo-auth.md`, que unificou os escopos de 001 a 005 em uma única entrega implementada e validada.

### Validações finais

- Implementação consolidada via spec `006`: aprovada pelo `sdd-reviewer` com testes de integração passando e validação manual via REST Client.

### Memória atualizada

- `memory/produto.md`: nenhuma alteração necessária (entregue via spec 006).
- `memory/contexto-tecnico.md`: nenhuma alteração necessária (entregue via spec 006).
- `memory/estrutura.md`: nenhuma alteração necessária.

### Observações

- Esta spec foi substituída pela spec `006`, que a implementa em sua totalidade.
