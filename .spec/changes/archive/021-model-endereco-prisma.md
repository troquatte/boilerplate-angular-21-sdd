# Modelo Endereço no Prisma (Relacionamento Cascade com Cliente)

## Objetivo

Adicionar o modelo `Endereco` no Prisma schema, com relacionamento `1:N` (um cliente tem muitos endereços) e `onDelete: Cascade`. O `Cliente` deve ter o campo `enderecos` e o `User` deve ter `onDelete: Cascade` para garantir que ao deletar um usuário, o cliente e seus endereços sejam deletados em cascata.

## Contexto

O sistema CRM permite que clientes tenham múltiplos endereços. É necessário que a exclusão de um cliente ou de um usuário remova automaticamente todos os endereços associados (cascade delete).

## Escopo

### Prisma Schema
- Adicionar modelo `Endereco` com campos: `id`, `createdAt`, `updatedAt`, `cep`, `logradouro`, `numero`, `complemento`, `bairro`, `cidade`, `estado`, `principal`, `clienteId`
- Relacionamento `Endereco` → `Cliente` com `onDelete: Cascade`
- Adicionar campo `enderecos Endereco[]` no modelo `Cliente`
- Adicionar `onDelete: Cascade` no relacionamento `Cliente` → `User` (garantir que delete de user delete cliente e endereços)
- Criar migration e aplicar no banco

### Seed (se necessário)
- Atualizar `prisma/seed.ts` para incluir endereços nos clientes de seed (opcional)

## Fora de Escopo
- Backend endpoints para CRUD de endereços (será spec separada)
- Frontend de endereços (será spec separada)
- Validações extras no schema

## Contrato de Modelo

```prisma
model Cliente {
  ...
  enderecos Endereco[]
  user      User?     @relation(fields: [userId], references: [id], onDelete: Cascade)
  ...
}

model Endereco {
  id          String   @id @default(uuid())
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  cep         String
  logradouro  String
  numero      String
  complemento String?
  bairro      String
  cidade      String
  estado      String

  principal   Boolean  @default(false)

  clienteId   String
  cliente     Cliente  @relation(fields: [clienteId], references: [id], onDelete: Cascade)

  @@index([clienteId])
  @@map("enderecos")
}
```

## Dependencias
- `prisma/schema.prisma`
- `prisma/seed.ts` (opcional)
- Banco de dados PostgreSQL (via Docker)

## Premissas
- O banco de dados está rodando via Docker (`docker-compose up -d`)
- Prisma CLI está disponível (`npx prisma`)
- A tabela `clientes` já existe com dados (seed ou produção)
- Se a migration falhar por dados existentes, pode resetar o banco via Prisma (`npx prisma migrate reset --force`) — não manipular Docker diretamente

## Restricoes
- Migration deve ser criada com `npx prisma migrate dev` (não `db push` para produção)
- Não alterar o modelo `User` além do necessário para adicionar `onDelete: Cascade`

## Critérios de Aceite

- [x] **AC-01 — Schema atualizado:** Modelo `Endereco` adicionado em `prisma/schema.prisma`.
- [x] **AC-02 — Relacionamento cascade:** `Cliente` tem `enderecos Endereco[]` e `onDelete: Cascade` com `User`.
- [x] **AC-03 — Migration criada:** Migration gerada com `npx prisma migrate dev --name add_endereco`.
- [x] **AC-04 — Migration aplicada:** Banco de dados atualizado sem erros.
- [ ] **AC-05 — Seed atualizado (opcional):** `prisma/seed.ts` inclui endereços nos clientes de seed. Será tratado na próxima spec.
- [x] **AC-06 — Build aprovado:** Backend compila sem erros (TypeScript/Prisma types).

## Tasks

- [x] **Task 1 — Schema Endereco:** Adicionar modelo `Endereco` em `prisma/schema.prisma`.
  > ✅ 2026-08-04 — Modelo `Endereco` adicionado com todos os campos. Arquivo: `prisma/schema.prisma`.
- [x] **Task 2 — Schema Cliente:** Adicionar `enderecos Endereco[]` e `onDelete: Cascade` em `Cliente`.
  > ✅ 2026-08-04 — Campo `enderecos` e `onDelete: Cascade` adicionados em `Cliente`. Arquivo: `prisma/schema.prisma`.
- [x] **Task 3 — Migration:** Rodar `npx prisma migrate dev --name add_endereco` e resolver conflitos.
  > ✅ 2026-08-04 — Migration `20260804214217_add_endereco` criada e aplicada com sucesso.
- [ ] **Task 4 — Seed (opcional):** Atualizar `prisma/seed.ts` com endereços. **Será tratado na próxima spec.**
- [x] **Task 5 — Build:** Verificar se o backend compila (Prisma types atualizados).
  > ✅ 2026-08-04 — Build Angular (SSR) aprovado sem erros.

## Resultado Esperado
- Modelo `Endereco` disponível no Prisma Client
- Relacionamento `1:N` com `Cliente` e `onDelete: Cascade`
- Banco de dados sincronizado com nova migration

## Encerramento
Esta spec termina quando o schema Prisma estiver atualizado, a migration aplicada, e o backend compilar sem erros.
