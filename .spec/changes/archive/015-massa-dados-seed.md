# Massa de Dados (Seed) para Desenvolvimento

## Objetivo

Criar um script de seed para popular o banco de dados com usuarios admin e clientes com dados realisticos, permitindo testar o sistema imediatamente apos reset do banco.

## Contexto

O banco foi resetado durante a migration da spec 014. Para testar a aplicacao e a API de clientes, precisamos de dados iniciais. Um script de seed executavel via Prisma e a forma padrao de fazer isso.

## Escopo

- Script de seed Prisma (`prisma/seed.ts`) criando usuarios admin
- 10 clientes com email e User relacionado automaticamente
- Remover campo `roleTeste` do schema Prisma (nao utilizado)
- Documentar como executar o seed

## Fora de Escopo

- Seed de producao
- Dados de teste automatizado (sera feito em spec futura se necessario)

## Premissas

- O script sera executado manualmente via `npx prisma db seed`
- Senhas dos usuarios admin serao hasheadas com bcrypt
- Clientes com email terao User criado automaticamente pelo service (ou diretamente no seed)
- O script trunca/dropa dados existentes antes de inserir (idempotente)

## Restricoes

- Nao expor senhas em texto plano no codigo (usar hash)
- Nao versionar dados reais de producao

## Dados

### Usuarios Admin

| Nome | Email | Senha | Role |
|---|---|---|---|
| Dener Troquatte | dener@vidafullstack.com.br | dener@vidafullstack.com.br | ADMIN |
| Geovani | geovani@vidafullstack.com.br | geovani@vidafullstack.com.br | DESIGNER |

### Clientes (10 com email + User)

| # | Nome | Telefone | CPF | Email | Tipo | birthDate |
|---|---|---|---|---|---|---|
| 1 | Ana Carolina Silva | 11987654321 | 12345678901 | ana@example.com | PF | 1990-05-15 |
| 2 | Bruno Henrique Oliveira | 21976543210 | 23456789012 | bruno@example.com | PF | 1985-08-22 |
| 3 | Carla Fernanda Souza | 31965432109 | 34567890123 | carla@example.com | PF | 1992-11-03 |
| 4 | Daniel Costa Pereira | 41954321098 | 45678901234 | daniel@example.com | PF | 1988-02-14 |
| 5 | Eduarda Lima Rocha | 51943210987 | 56789012345 | eduarda@example.com | PF | 1995-07-30 |
| 6 | Felipe Augusto Mendes | 61932109876 | 67890123456 | felipe@example.com | PF | 1983-12-09 |
| 7 | Gabriela Martins Torres | 71921098765 | 78901234567 | gabriela@example.com | PF | 1991-04-18 |
| 8 | Henrique Almeida Barros | 81910987654 | 89012345678 | henrique@example.com | PF | 1987-09-25 |
| 9 | Isabela Cristina Ribeiro | 91909876543 | 90123456789 | isabela@example.com | PF | 1993-01-07 |
| 10 | Joao Pedro Ferreira | 11998765432 | 01234567890 | joao@example.com | PF | 1989-06-12 |

## Critérios de Aceite

- [x] **AC-01 — roleTeste removido:** Campo `roleTeste` removido do schema Prisma e migration aplicada.
- [x] **AC-02 — Script seed criado:** `prisma/seed.ts` cria 2 usuarios admin e 10 clientes com User relacionado.
- [x] **AC-03 — Seed configurado:** `prisma.config.ts` e `package.json` configurados para `npx prisma db seed`.
- [x] **AC-04 — Seed executado com sucesso:** Banco populado com 2 admin users e 10 clients.
- [x] **AC-05 — Build aprovado:** Build sem erros de compilacao.

## Tasks

- [x] **Task 1 — Remover roleTeste do User schema:** Remover `roleTeste` do `prisma/schema.prisma` e gerar nova migration.
  > ✅ 2026-08-03 — Migration `20260803160059_remove_role_teste` aplicada.
- [x] **Task 2 — Criar script de seed:** Criar `prisma/seed.ts` com usuarios admin e 10 clientes (com User relacionado via bcrypt hash do CPF).
  > ✅ 2026-08-03 — Script criado com PrismaPg adapter, bcrypt hash, e limpeza idempotente.
- [x] **Task 3 — Configurar seed:** Adicionar `migrations.seed` ao `prisma.config.ts` e `db:seed`/`db:reset` ao `package.json`.
  > ✅ 2026-08-03 — Seed configurado. Scripts: `npm run db:reset` e `npm run db:seed`.
- [x] **Task 4 — Testar seed:** Executar `npx prisma db seed` e validar dados no banco.
  > ✅ 2026-08-03 — Seed executado: 2 admin users, 10 clients created. Login e logout validados.
- [x] **Task 5 — Corrigir auth cookies:** `sameSite: 'strict'` → `'lax'`, `clearCookie` com mesmas opcoes do `setCookie`.
  > ✅ 2026-08-03 — Login e logout funcionando. Log removido.
- [x] **Task 6 — Implementar logout dashboard:** `DashboardAdminComponent.logout()` chama `AuthService.logout()` + redireciona.
  > ✅ 2026-08-03 — Logout implementado no header admin.

## Resultado Esperado

- Banco populado com 2 usuarios admin e 10 clientes com login habilitado
- App funcional para testes imediatos
- Documentacao de como executar o seed

## Encerramento

Esta spec termina quando o seed foi executado com sucesso e os dados estao verificados no banco.
