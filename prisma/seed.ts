import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = process.env['DATABASE_URL'] || '';
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

import { seedUser } from './seeds/seed-user';
import { seedCliente } from './seeds/seed-cliente';
import { seedEndereco } from './seeds/seed-endereco';

async function main() {
  // Limpar dados existentes (ordem importa por FK)
  await prisma.enderecos.deleteMany();
  await prisma.cliente.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.resetPasswordSecret.deleteMany();
  await prisma.user.deleteMany();

  // Seeds por domínio
  await seedUser(prisma);
  const clientes = await seedCliente(prisma);
  await seedEndereco(prisma, clientes);

  console.log('Seed completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
