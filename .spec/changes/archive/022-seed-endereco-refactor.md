# Refactor Seed e Adicionar Endereços

## Objetivo

Refatorar o `prisma/seed.ts` monolítico em arquivos separados por domínio (user, cliente, endereco). Adicionar dados de endereços para os clientes do seed.

## Contexto

O seed atual (`prisma/seed.ts`) contém lógica de usuários admin, clientes e relacionamentos em um único arquivo. Com a adição do modelo `Endereco` (spec 021), precisamos de seed de endereços e de uma estrutura modular para facilitar manutenção.

## Escopo

### Refactor Seed
- Criar `prisma/seeds/seed-user.ts` — cria usuários admin
- Criar `prisma/seeds/seed-cliente.ts` — cria clientes e usuários vinculados (CUSTOMER)
- Criar `prisma/seeds/seed-endereco.ts` — cria endereços para cada cliente
- Refatorar `prisma/seed.ts` para importar e orquestrar os seeds modulares (limpar dados, rodar seeds na ordem correta)

### Dados de Endereço
- Cada cliente deve ter 1 ou 2 endereços (um principal e um secundário opcional)
- Campos: `cep`, `logradouro`, `numero`, `complemento`, `bairro`, `cidade`, `estado`, `principal`

## Fora de Escopo
- Novos domínios de seed (serão adicionados em specs futuras)
- Alterações no schema Prisma (já feito na spec 021)

## Dependencias
- `prisma/seed.ts` (refatorar)
- `prisma/seeds/` (novo diretório)
- `prisma/schema.prisma` (modelo Endereco já existente)

## Premissas
- Modelo `Endereco` já existe no schema Prisma
- Modelo `Cliente` tem `enderecos[]` e `onDelete: Cascade` com `User`
- Banco de dados está acessível (rodando via Docker)
- `prisma db seed` está configurado no `package.json`

## Restricoes
- Manter os mesmos dados de admin users e clientes (não alterar os dados existentes, apenas modularizar)
- Ordem de limpeza dos dados deve respeitar as foreign keys (endereços antes de clientes, clientes antes de users)
- Endereços devem ter `clienteId` válido (referenciando clientes criados no seed)

## Critérios de Aceite

- [x] **AC-01 — Seed modular:** `prisma/seeds/` contém `seed-user.ts`, `seed-cliente.ts`, `seed-endereco.ts`.
- [x] **AC-02 — Orquestração:** `prisma/seed.ts` importa os seeds modulares e gerencia a limpeza de dados.
- [x] **AC-03 — Endereços criados:** Cada cliente do seed tem pelo menos 1 endereço (principal = true). 5 clientes têm 2 endereços.
- [x] **AC-04 — Dados realistas:** Endereços com CEP, logradouro, número, bairro, cidade, estado válidos (10 cidades diferentes).
- [x] **AC-05 — Seed funciona:** `npx prisma db seed` executa sem erros e popula o banco. Criado `tsconfig.seed.json` para compilar em CommonJS.
- [x] **AC-06 — Build aprovado:** Build Angular aprovado sem erros.

## Tasks

- [x] **Task 1 — Criar diretório:** `prisma/seeds/`.
  > ✅ 2026-08-04 — Diretório criado.
- [x] **Task 2 — Seed user:** `prisma/seeds/seed-user.ts` com admin users.
  > ✅ 2026-08-04 — 2 admin users criados.
- [x] **Task 3 — Seed cliente:** `prisma/seeds/seed-cliente.ts` com clientes e usuários CUSTOMER.
  > ✅ 2026-08-04 — 10 clientes com usuários CUSTOMER criados.
- [x] **Task 4 — Seed endereco:** `prisma/seeds/seed-endereco.ts` com endereços para cada cliente.
  > ✅ 2026-08-04 — 15 endereços criados (10 principais + 5 secundários).
- [x] **Task 5 — Refactor seed.ts:** `prisma/seed.ts` importa os 3 seeds e gerencia limpeza.
  > ✅ 2026-08-04 — Refatorado com `tsconfig.seed.json` (CommonJS) para imports modulares.
- [x] **Task 6 — Testar seed:** Rodar `npx prisma db seed` e verificar se endereços foram criados.
  > ✅ 2026-08-04 — Seed executado com sucesso. 2 admin, 10 clients, 15 addresses.
- [x] **Task 7 — Build:** Verificar se o backend compila.
  > ✅ 2026-08-04 — Build Angular aprovado.

## Resultado Esperado
- `prisma/seed.ts` refatorado em módulos por domínio
- Endereços populados para todos os clientes do seed
- Comando `npx prisma db seed` funciona corretamente

## Encerramento
Esta spec termina quando o seed estiver modularizado, endereços criados, e o comando `npx prisma db seed` executar sem erros.
