import rateLimit from 'express-rate-limit';

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    error: 'Muitas tentativas de autenticação.',
    message: 'Por favor, tente novamente após 15 minutos.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
