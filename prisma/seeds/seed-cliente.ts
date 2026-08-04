import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const clientesData = [
  {
    fullName: 'Ana Carolina Silva',
    phone: '11987654321',
    cpf: '12345678901',
    email: 'ana@example.com',
    tipo: 'Primeira Compra',
    birthDate: new Date('1990-05-15'),
  },
  {
    fullName: 'Bruno Henrique Oliveira',
    phone: '21976543210',
    cpf: '23456789012',
    email: 'bruno@example.com',
    tipo: 'Primeira Compra',
    birthDate: new Date('1985-08-22'),
  },
  {
    fullName: 'Carla Fernanda Souza',
    phone: '31965432109',
    cpf: '34567890123',
    email: 'carla@example.com',
    tipo: 'Primeira Compra',
    birthDate: new Date('1992-11-03'),
  },
  {
    fullName: 'Daniel Costa Pereira',
    phone: '41954321098',
    cpf: '45678901234',
    email: 'daniel@example.com',
    tipo: 'Primeira Compra',
    birthDate: new Date('1988-02-14'),
  },
  {
    fullName: 'Eduarda Lima Rocha',
    phone: '51943210987',
    cpf: '56789012345',
    email: 'eduarda@example.com',
    tipo: 'Primeira Compra',
    birthDate: new Date('1995-07-30'),
  },
  {
    fullName: 'Felipe Augusto Mendes',
    phone: '61932109876',
    cpf: '67890123456',
    email: 'felipe@example.com',
    tipo: 'Primeira Compra',
    birthDate: new Date('1983-12-09'),
  },
  {
    fullName: 'Gabriela Martins Torres',
    phone: '71921098765',
    cpf: '78901234567',
    email: 'gabriela@example.com',
    tipo: 'Primeira Compra',
    birthDate: new Date('1991-04-18'),
  },
  {
    fullName: 'Henrique Almeida Barros',
    phone: '81910987654',
    cpf: '89012345678',
    email: 'henrique@example.com',
    tipo: 'Primeira Compra',
    birthDate: new Date('1987-09-25'),
  },
  {
    fullName: 'Isabela Cristina Ribeiro',
    phone: '91909876543',
    cpf: '90123456789',
    email: 'isabela@example.com',
    tipo: 'Primeira Compra',
    birthDate: new Date('1993-01-07'),
  },
  {
    fullName: 'Joao Pedro Ferreira',
    phone: '11998765432',
    cpf: '01234567890',
    email: 'joao@example.com',
    tipo: 'Primeira Compra',
    birthDate: new Date('1989-06-12'),
  },
];

export async function seedCliente(prisma: PrismaClient): Promise<{ id: string; fullName: string }[]> {
  const created: { id: string; fullName: string }[] = [];

  for (const c of clientesData) {
    const user = await prisma.user.create({
      data: {
        name: c.fullName,
        email: c.email,
        password: bcrypt.hashSync(c.cpf, 6),
        role: 'CUSTOMER',
      },
    });

    const cliente = await prisma.cliente.create({
      data: {
        phone: c.phone,
        cpf: c.cpf,
        fullName: c.fullName,
        email: c.email,
        tipo: c.tipo,
        birthDate: c.birthDate,
        userId: user.id,
      },
    });

    created.push({ id: cliente.id, fullName: cliente.fullName || '' });
  }

  console.log(`- ${clientesData.length} clients with related users created`);
  return created;
}
