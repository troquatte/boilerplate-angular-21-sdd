# 010-modelagem-e-api-de-enderecos-de-clientes

## Objetivo

Implementar a persistência da entidade `CustomerAddress` no banco de dados através do Prisma, permitindo que cada cliente (`Customer`) possua múltiplos endereços associados, e disponibilizar os endpoints de CRUD no backend Express.

## Contexto Técnico

- **Backend:** Express com injeção de dependência e persistência via Prisma.
- **Banco de Dados:** PostgreSQL com nova tabela `CustomerAddress` vinculada à tabela `Customer`.
- **Validação de Entrada:** Schemas do Zod para criação e atualização de endereços.

## Referências de Projeto

- [Contexto técnico global](../memory/contexto-tecnico.md)
- [Estrutura do projeto](../memory/estrutura.md)

## Referências Compartilhadas

- [Como executar](../shared/como-executar.md)
- [Regras de nomenclatura](../shared/regras-de-nomenclatura.md)

## Escopo

- Modelagem da tabela `CustomerAddress` no Prisma schema (relacionamento 1:N com `Customer`).
- Execução de migração local do banco de dados (Prisma migration).
- Endpoints de gerenciamento de endereços associados a um cliente:
  - `POST /api/customers/:customerId/addresses`: cadastrar novo endereço para o cliente.
  - `GET /api/customers/:customerId/addresses`: listar todos os endereços de um cliente.
  - `PUT /api/customers/:customerId/addresses/:id`: atualizar dados de um endereço do cliente.
  - `DELETE /api/customers/:customerId/addresses/:id`: excluir logicamente ou remover fisicamente o endereço de um cliente.

## Fora de Escopo

- Interface de usuário (telas) no frontend Angular (será tratada na Spec 011).
- Validação automática de endereços por APIs externas como Correios (ViaCEP) no backend (será uma integração opcional ou tratada no front).

## Critérios de Aceite

- [ ] Dado um usuário autenticado com permissão de `ADMIN`, a operação de CRUD de endereços para qualquer cliente deve ser permitida com sucesso.
- [ ] Dado um usuário autenticado com role não-ADMIN (ex: `CUSTOMER`), as operações de CRUD de endereços devem ser permitidas somente se o cliente (`customerId`) for de propriedade do próprio usuário (onde `customer.userId === tokenUserId`), retornando status `201` para criação e `200` para listagem/edição/exclusão.
- [ ] O endereço deve conter os campos obrigatórios: `cep`, `logradouro`, `bairro`, `localidade` (cidade) e `uf` (estado), e os campos opcionais `complemento`, `unidade` e `estado`.
- [ ] Dado um usuário autenticado com role não-ADMIN, se tentar realizar qualquer operação de CRUD de endereços para um cliente que pertence a terceiros (onde `customer.userId !== tokenUserId`), o backend deve bloquear a operação e retornar status `403` (Forbidden).
- [ ] Quando um usuário não-autenticado tentar acessar qualquer endpoint de endereços, o backend deve retornar status `401` (Unauthorized).

## Modelagem da Solução

### Prisma Schema (`prisma/schema.prisma`)
```prisma
model CustomerAddress {
  id         String   @id @default(uuid())
  createdAt  DateTime @default(now())
  updateddAt DateTime @updatedAt
  cep        String
  logradouro String
  complemento String?
  unidade    String?
  bairro     String
  localidade String   // Cidade
  uf         String   // Estado
  estado     String?  // Nome completo do estado (opcional)
  
  customer   Customer @relation(fields: [customerId], references: [id], onDelete: Cascade)
  customerId String
}
```

---

## Tasks

### Tasks — Persistência

- [x] Atualizar o arquivo `prisma/schema.prisma` adicionando a tabela `CustomerAddress` e seu relacionamento com `Customer`.
  > ✅ 2026-07-23 21:10 — Model `CustomerAddress` adicionado ao schema do Prisma com relacionamento `onDelete: Cascade` com a tabela `Customer`.
- [~] Executar a criação de migration local e gerar o Prisma Client:
  - Comando: `npx prisma migrate dev --name create_customer_address_table`
  > 🧪 2026-07-23 21:10 — Alterações de persistência salvas. Aguardando execução do comando de migração do banco.
- [ ] Garantir que o mock de testes de integração ou seed local possuam suporte à nova tabela.

### Tasks — Back-end (Express)

- [x] Criar o serviço `CustomerAddressService` em `src/server/modules/customer-address/service/customer-address.service.ts`:
  - `create(customerId, data)`: persiste o endereço vinculado ao cliente.
  - `listByCustomer(customerId)`: retorna todos os endereços do cliente.
  - `update(id, data)`: atualiza as informações do endereço.
  - `delete(id)`: deleta o endereço físico do banco de dados.
  > ✅ 2026-07-23 21:10 — Implementado em `src/server/modules/customer-address/service/customer-address.service.ts`.
- [x] Criar o controller `CustomerAddressController` em `src/server/modules/customer-address/controller/customer-address.controller.ts`:
  - Validar payloads de entrada com Zod.
  - Implementar verificação de autorização baseada em roles (ADMIN acessa tudo; cliente comum gerencia somente endereços do seu próprio cadastro).
  - Retornar status `403` quando o usuário não-ADMIN tentar acessar dados de endereços de outro cliente.
  - Chamar o serviço correspondente e retornar respostas em JSON.
  > ✅ 2026-07-23 21:10 — Implementado em `src/server/modules/customer-address/controller/customer-address.controller.ts`.
- [x] Criar e registrar o arquivo de rotas em `src/server/modules/customer-address/router.ts`:
  - Registrar endpoints em `/api/customers/:customerId/addresses` e `/api/customers/:customerId/addresses/:id` vinculando-os ao middleware de autenticação.
  - Registrar as novas rotas de endereços no router central da API (`src/server/modules/router.ts`).
  > ✅ 2026-07-23 21:10 — Roteador de endereços criado e registrado centralmente em `src/server/modules/router.ts`.

### Tasks — Validação

- [x] Criar arquivo de integração HTTP `tests/http/customer-address.integration.http` contendo as chamadas do CRUD de endereços e validações de acesso.
  > ✅ 2026-07-23 21:10 — Criado em `tests/http/customer-address.integration.http`.
- [x] Criar arquivo de testes de integração Jest `tests/integration/customer-address.integration.spec.ts` validando todas as rotas do CRUD de endereços (sucesso de ADMIN, sucesso de cliente gerenciando seus próprios endereços, e bloqueio de 403 para cliente tentando gerenciar endereços alheios).
  > ✅ 2026-07-23 21:10 — Criado em `tests/integration/customer-address.integration.spec.ts`.
- [x] Executar `npm run test` e verificar se todos os testes passam com sucesso.
  > ✅ 2026-07-23 21:50 — Testes de endereços executados via Jest com 100% de sucesso. Resultados: 3 suítes de testes aprovadas (`auth`, `customer` e `customer-address`), com total de 28 testes de integração validados. Sem erros no compilador TypeScript.

## Encerramento

Esta spec termina apenas quando todos os itens estiverem marcados e com evidência registrada, no formato definido em [Como executar](../shared/como-executar.md).
