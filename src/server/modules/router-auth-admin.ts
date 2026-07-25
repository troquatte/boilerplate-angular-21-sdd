import { Router } from 'express';
import { prisma } from '../prisma-conn';

const router = Router();

router.get('/admin/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return res.json({
      data: users,
    });
  } catch (error: any) {
    return res.status(500).json({
      error: 'Erro interno ao buscar usuários.',
    });
  }
});

export const authAdmRouter = [router];
