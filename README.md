# 🐳 Executando a Infraestrutura Local com Docker

Para rodar a aplicação localmente com PostgreSQL, Redis e MinIO, suba os containers da infraestrutura local:

```bash
docker compose -f doc/docker/local/docker-compose.yml up -d
```

Isso criará os seguintes serviços:
- **PostgreSQL**: Porta `5432`, com banco `boilerplate_db` (usuário: `postgres`, senha: `postgres`).
- **Redis**: Porta `6379`.
- **MinIO**: Porta `9000` (API) e `9001` (Console WEB), com usuário/senha `minioadmin` / `minioadmin`.

Certifique-se de que o arquivo `.env_local` (ou `.env` se for o caso) está configurado com essas conexões.

---

1 - Instalar o plugin prisma

```
Adicione no settings.json

"[prisma]": {
  "editor.defaultFormatter": "Prisma.prisma"
},

Rode o comando
npx prisma init

no arquivo env será gerado:
DATABASE_URL="postgresql://POSTGRES_USER:POSTGRES_PASSWORD@localhost:5432/POSTGRES_DB?schema=public"

Usaremos as variaveis do postgress da nossa infra, substitua por:
POSTGRES_USER=root
POSTGRES_PASSWORD=root
POSTGRES_DB=mydatabase

*****************************
Rode o comando caso seja o DEV:
npx prisma db push
npx prisma generate

Apra o prisma studio
npx prisma studio

Ele abria a porta localhost:5555

| Comando                              | Uso                                          |
| ------------------------------------ | -------------------------------------------- |
| `npx prisma migrate dev --name init` | Criar nova migração e aplicar no banco local |
| `npx prisma migrate deploy`          | Aplicar migrações pendentes em produção      |
| `npx prisma generate`                | Gerar Prisma Client atualizado               |
| `npx prisma db push`                 | Sincronizar schema com banco sem migração    |
| `npx prisma migrate reset`           | Reseta todo nosso banco de dados             |

```

---

🚀 Cenário 1 — Banco de produção zerado

```
1 - No seu ambiente local/dev, crie os modelos e rode:
# Isso gera e aplica migrações + atualiza o client.
Comando: npx prisma migrate dev --name init

2 - Suba essas migrações no repositório (ex: prisma/migrations).

3 - No servidor (produtivo):
Comando: npx prisma migrate deploy
👉 Isso aplica todas as migrações criadas localmente, deixando o banco com a estrutura correta.

```

---

🧩 Cenário 2 — Banco de produção já tem dados
Aqui, nunca use migrate dev ou db push diretamente no prod, pois podem sobrescrever dados.

```
1 - Faça as alterações localmente (adicione campos, novas tabelas, etc.) e rode:
comando: npx prisma migrate dev --name add_nova_tabela

2 - Teste localmente; garanta que funciona.
3 - Suba o código + as novas migrações (/prisma/migrations).

4 - No servidor:
npx prisma migrate deploy

```
