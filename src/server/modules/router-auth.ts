import { Router } from 'express';

const router = Router();

router.get('/protected/profile', (req, res) => {
  return res.json({
    message: 'Rota protegida acessada com sucesso.',
    userId: (req as any).tokenUserId,
  });
});

export const authRouter = [router];
