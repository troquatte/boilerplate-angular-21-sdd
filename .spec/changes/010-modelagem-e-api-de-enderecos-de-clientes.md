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

- [ ] Dado um usuário autenticado com permissão administrativa, quando enviar um payload válido de endereço para `POST /api/customers/:customerId/addresses`, então o endereço deve ser salvo associado ao cliente e retornar status `201`.
- [ ] O endereço deve conter os campos obrigatórios: `cep`, `logradouro`, `bairro`, `localidade` (cidade) e `uf` (estado), e o campo opcional `complemento` e `unidade`.
- [ ] Dado o ID de um endereço, quando for executado `DELETE /api/customers/:customerId/addresses/:id`, então o registro deve ser deletado do banco e retornar status `200`.
- [ ] Quando um usuário não-autenticado tentar gerenciar endereços, então o backend deve retornar status `401`.

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

- [ ] Atualizar o arquivo `prisma/schema.prisma` adicionando a tabela `CustomerAddress` e seu relacionamento com `Customer`.
- [ ] Executar a criação de migration local e gerar o Prisma Client:
  - Comando: `npx prisma migrate dev --name create_customer_address_table`
- [ ] Garantir que o mock de testes de integração ou seed local possuam suporte à nova tabela.

### Tasks — Back-end (Express)

- [ ] Criar o serviço `CustomerAddressService` em `src/server/modules/customer-address/service/customer-address.service.ts`:
  - `create(customerId, data)`: persiste o endereço vinculado ao cliente.
  - `listByCustomer(customerId)`: retorna todos os endereços do cliente.
  - `update(id, data)`: atualiza as informações do endereço.
  - `delete(id)`: deleta o endereço físico do banco de dados.
- [ ] Criar o controller `CustomerAddressController` em `src/server/modules/customer-address/controller/customer-address.controller.ts`:
  - Validar payloads de entrada com Zod.
  - Chamar o serviço correspondente e retornar respostas em JSON.
- [ ] Criar e registrar o arquivo de rotas em `src/server/modules/customer-address/router.ts`:
  - Registrar endpoints em `/api/customers/:customerId/addresses` e `/api/customers/:customerId/addresses/:id` vinculando-os ao middleware de autenticação.
  - Registrar as novas rotas de endereços no router central da API (`src/server/modules/router.ts`).

### Tasks — Validação

- [ ] Criar arquivo de integração HTTP `tests/http/customer-address.integration.http` contendo as chamadas do CRUD de endereços.
- [ ] Criar arquivo de testes de integração Jest `tests/integration/customer-address.integration.spec.ts` validando todas as rotas do CRUD de endereços (sucesso e falha).
- [ ] Executar `npm run test` e verificar se todos os testes passam com sucesso.

## Encerramento

Esta spec termina apenas quando todos os itens estiverem marcados e com evidência registrada, no formato definido em [Como executar](../shared/como-executar.md).
