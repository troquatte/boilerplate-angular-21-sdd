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

- [ ] Dado um usuário autenticado com permissão administrativa, quando enviar um payload válido de cliente para `POST /api/customers`, então o cliente deve ser salvo no banco e retornar status `201`.
- [ ] Dado o cadastro de um cliente, os campos `cpf` e `name` (nome) devem ser opcionais na criação inicial, exigindo obrigatoriamente apenas o telefone (`phone`).
- [ ] Dado um ID de cliente válido, quando for executado `GET /api/customers/:id`, então retorna os dados do cliente e status `200`.
- [ ] Dado o ID de um cliente cadastrado, quando for executado `DELETE /api/customers/:id`, então o cliente deve ser marcado como `active: false` no banco e retornar status `200`.
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

- [ ] Atualizar o arquivo `prisma/schema.prisma` adicionando a tabela `Customer` e seu relacionamento com `User`.
- [ ] Executar a criação de migration local e gerar o Prisma Client:
  - Comando: `npx prisma migrate dev --name create_customer_table`
- [ ] Garantir que o mock de testes de integração ou seed local possuam suporte à nova tabela.

### Tasks — Back-end (Express)

- [ ] Criar o serviço `CustomerService` em `src/server/modules/customer/service/customer.service.ts` com métodos:
  - `create(data)`: persiste no banco associando ao `userId`.
  - `list(filter, page, limit)`: lista e filtra clientes ativos.
  - `findById(id)`: busca cliente por ID.
  - `update(id, data)`: atualiza as informações do cliente.
  - `deactivate(id)`: altera o status `active` para `false`.
- [ ] Criar o controller `CustomerController` em `src/server/modules/customer/controller/customer.controller.ts`:
  - Validar payloads de entrada com Zod (ZCustomerCreateSchema e ZCustomerUpdateSchema).
  - Chamar o serviço correspondente e retornar as respostas formatadas em JSON.
- [ ] Criar e registrar o arquivo de rotas em `src/server/modules/customer/router.ts`:
  - Registrar endpoints em `/api/customers` vinculando-os aos middlewares de autenticação (ex: `MiddlewareAuth`).
  - Registrar a nova rota de clientes no router central da API (`src/server/modules/router.ts`).

### Tasks — Validação

- [ ] Criar arquivo de integração HTTP `tests/http/customer.integration.http` contendo as chamadas do CRUD.
- [ ] Criar arquivo de testes de integração Jest `tests/integration/customer.integration.spec.ts` validando todas as rotas do CRUD de clientes (sucesso e erros como CPF duplicado, não autenticado, etc.).
- [ ] Executar `npm run test` e verificar se todos os testes passam com sucesso.

## Encerramento

Esta spec termina apenas quando todos os itens estiverem marcados e com evidência registrada, no formato definido em [Como executar](../shared/como-executar.md).
