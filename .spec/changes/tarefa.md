Criar um usuário admin no banco e testar a API via Rest Client

Precisamos criar uma massa de dados para User

- ROLE: ADMIN - Nome Dener Troquatte, email e senha dener@vidafullstack.com.br
- ROLE: DESIGNER - Nome Geovani, email e senha geovani@vidafullstack.com.br

N entendi pq o roleTeste String? se n for usado pode tirar

Precisamos criar uma massa de dados para model Cliente {
id String @id @default(uuid())
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt

phone String
cpf String?
fullName String?
email String?
birthDate DateTime?
tipo String?

userId String? @unique
user User? @relation(fields: [userId], references: [id])
}

Crie 10 clientes já com email e User relacionado

é uma massa pode ser um script para rodarmos para app funcionar e documente tbm
