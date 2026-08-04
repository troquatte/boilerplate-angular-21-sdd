import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

export async function seedUser(prisma: PrismaClient): Promise<void> {
  const adminUsers = [
    {
      name: 'Dener Troquatte',
      email: 'dener@vidafullstack.com.br',
      password: bcrypt.hashSync('dener@vidafullstack.com.br', 6),
      role: 'ADMIN',
    },
    {
      name: 'Geovani',
      email: 'geovani@vidafullstack.com.br',
      password: bcrypt.hashSync('geovani@vidafullstack.com.br', 6),
      role: 'DESIGNER',
    },
  ];

  for (const user of adminUsers) {
    await prisma.user.create({ data: user });
  }

  console.log(`- ${adminUsers.length} admin users created`);
}
