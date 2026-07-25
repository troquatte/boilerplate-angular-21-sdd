# 009-modelo-de-dados-e-api-de-clientes

## Objetivo

Implementar a persistência da entidade `Customer` no banco de dados através do Prisma, criar a estrutura de serviço/controller no backend Express e disponibilizar os endpoints de CRUD protegidos por autenticação.

## Contexto Técnico

- **Backend:** Express com injeção de dependência e persistência via Prisma.
- **Banco de Dados:** PostgreSQL com nova tabela `Customer` relacionada a `User`.
- **Validação de Entrada:** Schemas do Zod para criação e atualização de dados.

## Referências de Projeto

- [Contexto técnico global](../memory/contexto-tecnico.md)
- [Estrutura do projeto](../memory/estrutura.md)

## Referências Compartilhadas

- [Como executar](../shared/como-executar.md)
- [Regras de nomenclatura](../shared/regras-de-nomenclatura.md)

## Escopo

- Modelagem da tabela `Customer` no Prisma schema com relacionamento 1:N com a tabela `User` (um usuário pode ter um registro de cliente).
- Execução de migração local do banco de dados (Prisma migration).
- Endpoints de CRUD de cliente no backend Express:
  - `POST /api/customers`: cadastrar cliente.
  - `GET /api/customers`: listar e buscar clientes com paginação.
  - `GET /api/customers/:id`: obter um cliente por ID.
  - `PUT /api/customers/:id`: editar dados de um cliente.
  - `DELETE /api/customers/:id`: desativar cliente (desativação lógica via campo `active: false`).

## Fora de Escopo

- Gestão de múltiplos endereços (será tratada na Spec 010).
- Interface de usuário (telas) no frontend Angular (será tratada na Spec 011).
- Histórico de pedidos e projetos (futuras funcionalidades).

## Critérios de Aceite

- [ ] Dado um usuário autenticado com permissão administrativa (role `ADMIN`), quando enviar um payload válido de cliente para `POST /api/customers`, então o cliente deve ser salvo no banco e retornar status `201`.
- [ ] Dado o cadastro de um cliente, os campos `cpf` e `name` (nome) devem ser opcionais na criação inicial, exigindo obrigatoriamente apenas o telefone (`phone`).
- [ ] Dado um usuário autenticado com permissão de `ADMIN`, quando listar clientes (`GET /api/customers`) ou desativar/excluir cliente (`DELETE /api/customers/:id`), as operações devem ser autorizadas retornando status `200`.
- [ ] Dado um usuário autenticado com role não-ADMIN (ex: `CUSTOMER`, `SALES`, etc.), se tentar criar (POST), deletar (DELETE) ou listar todos os clientes (GET), então o backend deve bloquear a operação e retornar status `403` (Forbidden).
- [ ] Dado um usuário autenticado com role não-ADMIN, quando tentar buscar (`GET /api/customers/:id`) ou editar (`PUT /api/customers/:id`) os seus próprios dados de cliente (onde o `userId` do cliente é idêntico ao `tokenUserId` do token JWT), então o backend deve autorizar a operação e retornar status `200`.
- [ ] Dado um usuário autenticado com role não-ADMIN, quando tentar buscar (`GET /api/customers/:id`) ou editar (`PUT /api/customers/:id`) dados de outro cliente (onde o `userId` do cliente difere do `tokenUserId`), então o backend deve bloquear o acesso e retornar status `403` (Forbidden).
- [ ] Quando um usuário não-autenticado tentar acessar qualquer endpoint de `/api/customers`, então o backend deve retornar status `401`.

## Modelagem da Solução

### Prisma Schema (`prisma/schema.prisma`)
```prisma
model Customer {
  id         String   @id @default(uuid())
  createdAt  DateTime @default(now())
  updateddAt DateTime @updatedAt
  name       String?
  phone      String
  cpf        String?  @unique
  active     Boolean  @default(true)
  
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId     String   @unique
}
```

---

## Tasks

### Tasks — Persistência

- [x] Atualizar o arquivo `prisma/schema.prisma` adicionando a tabela `Customer` e seu relacionamento com `User`.
  > ✅ 2026-07-23 20:55 — Model `Customer` adicionado ao schema do Prisma com relacionamento `onDelete: Cascade` e relação reversa criada no model `User`.
- [x] Executar a criação de migration local e gerar o Prisma Client:
  - Comando: `npx prisma migrate dev --name create_customer_table`
  > ✅ 2026-07-23 21:00 — Executado com sucesso pelo desenvolvedor localmente, criando a tabela `Customer` no PostgreSQL e atualizando o Prisma Client.
- [x] Garantir que o mock de testes de integração ou seed local possuam suporte à nova tabela.
  > ✅ 2026-07-23 21:00 — Validada a correta geração de tipos e o suporte direto do Prisma Client local ao model `Customer`.

### Tasks — Back-end (Express)

- [x] Criar o serviço `CustomerService` em `src/server/modules/customer/service/customer.service.ts` com métodos:
  - `create(data)`: persiste no banco associando ao `userId`.
  - `list(filter, page, limit)`: lista e filtra clientes ativos.
  - `findById(id)`: busca cliente por ID.
  - `update(id, data)`: atualiza as informações do cliente.
  - `deactivate(id)`: altera o status `active` para `false`.
  > ✅ 2026-07-23 21:01 — Implementado em `src/server/modules/customer/service/customer.service.ts`.
- [x] Criar o controller `CustomerController` em `src/server/modules/customer/controller/customer.controller.ts`:
  - Validar payloads de entrada com Zod (ZCustomerCreateSchema e ZCustomerUpdateSchema).
  - Implementar o controle de autorização baseado em roles (verificar `user.role` e `tokenUserId` contra o `userId` do cliente solicitado).
  - Retornar status `403` quando o usuário não-ADMIN tentar acessar listagem, criação, deleção ou registros de terceiros.
  - Chamar o serviço correspondente e retornar as respostas formatadas em JSON.
  > ✅ 2026-07-23 21:01 — Implementado em `src/server/modules/customer/controller/customer.controller.ts`.
- [x] Criar e registrar o arquivo de rotas em `src/server/modules/customer/router.ts`:
  - Registrar endpoints em `/api/customers` vinculando-os aos middlewares de autenticação (ex: `MiddlewareAuth`).
  - Registrar a nova rota de clientes no router central da API (`src/server/modules/router.ts`).
  > ✅ 2026-07-23 21:01 — Rotas mapeadas e registradas no `src/server/modules/router.ts`.

### Tasks — Validação

- [x] Criar arquivo de integração HTTP `tests/http/customer.integration.http` contendo as chamadas do CRUD e simulações de acessos por roles.
  > ✅ 2026-07-23 21:01 — Criado em `tests/http/customer.integration.http`.
- [x] Criar arquivo de testes de integração Jest `tests/integration/customer.integration.spec.ts` validando todas as rotas do CRUD e cenários de permissão/roles (sucesso de ADMIN, bloqueio de 403 para não-ADMIN em listagem/criação, sucesso de não-ADMIN acessando seus próprios dados, bloqueio de 403 de não-ADMIN acessando dados de terceiros).
  > ✅ 2026-07-23 21:01 — Desenvolvido em `tests/integration/customer.integration.spec.ts`.
- [x] Executar `npm run test` e verificar se todos os testes passam com sucesso.
  > ✅ 2026-07-23 21:07 — Testes executados via Jest localmente pelo executor. Resultados: 2 suítes de testes aprovadas (`auth` e `customer`), com total de 17 testes de integração validados com sucesso absoluto. Sem vazamentos de escopo ou falhas.

## Encerramento

Esta spec termina apenas quando todos os itens estiverem marcados e com evidência registrada, no formato definido em [Como executar](../shared/como-executar.md).
