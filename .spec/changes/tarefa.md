Vamos criar o backend de clientes

1. Model Cliente no Prisma schema ( createdAt, updatedAt)
   model Cliente {
   id String @id @default(uuid())
   createdAt DateTime @default(now())
   updatedAt DateTime @updatedAt

phone String
cpf String?
fullName String?
email String?
birthDate DateTime?
tipo String? // PF, PJ, Parceiro, etc. (ou Enum futuro)

userId String? @unique
user User? @relation(fields: [userId], references: [id])
}

Regras — Criação/Atualização de Cliente com email:

1. Sem email = sem login — Cliente salvo normalmente, sem relação com User.
2. Email novo — Se não existe User com esse email, cria User:
   • name = fullName
   • email = email
   • password = hash(cpf) (CPF é obrigatório para gerar login)
   • Vincula userId no Cliente
3. Email já existe em User — Se User não tem Cliente vinculado, vincula este Cliente ao User existente (sem criar novo).
4. Email já existe em User — Se User já tem outro Cliente vinculado, retorna erro: "Email já vinculado a outro cliente."
5. CPF obrigatório para criar login — Se tentar salvar email sem CPF preenchido, retorna erro: "CPF obrigatório para gerar acesso."
6. Atualização — Se email trocado de null→valor, aplica regras 2-5. Se trocado de valor→outro valor, desvincula User antigo e aplica regras 2-5  
   para novo email.
