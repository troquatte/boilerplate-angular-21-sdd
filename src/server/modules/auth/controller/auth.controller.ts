import { Request, Response } from 'express';
import { z } from 'zod';

// Enum
import { EZod } from '../../../enum/EZod.enum';
import { ErrorHandlerHelper } from '../../../helpers/error-handler.helpers';
import { authService } from '../service/auth.service';
import { userService } from '../../user/service/user-service';

class AuthController {
  public async login(req: Request, res: Response) {
    const { email, password } = req.body;

    try {
      const ZUserSchema = z.object({
        email: z.string().email({ message: `Email ${EZod.REQUIRED}` }),
        password: z.string().min(6, { message: 'A senha deve conter no mínimo 6 caracteres.' }),
      });

      ZUserSchema.parse({ email, password });

      const tokens = await authService.login(email, password);

      res.cookie('accessToken', tokens.acessToken, {
        httpOnly: true,
        secure: process.env['NODE_ENV'] === 'production',
        sameSite: 'strict',
        path: '/',
      });

      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env['NODE_ENV'] === 'production',
        sameSite: 'strict',
        path: '/',
      });

      return res.json({
        message: 'Login realizado com sucesso.',
      });
    } catch (error: any) {
      return ErrorHandlerHelper.handle(res, error);
    }
  }

  public async token(req: Request, res: Response) {
    const token = req.cookies['refreshToken'] || '';

    try {
      const ZAuthSchema = z
        .string()
        .min(25, { message: `Token ${EZod.REQUIRED}` });

      ZAuthSchema.parse(token);

      const newTokens = await authService.token(token);

      res.cookie('accessToken', newTokens.acessToken, {
        httpOnly: true,
        secure: process.env['NODE_ENV'] === 'production',
        sameSite: 'strict',
        path: '/',
      });

      res.cookie('refreshToken', newTokens.refreshToken, {
        httpOnly: true,
        secure: process.env['NODE_ENV'] === 'production',
        sameSite: 'strict',
        path: '/',
      });

      return res.json({
        message: 'Token atualizado com sucesso.',
      });
    } catch (error: any) {
      return ErrorHandlerHelper.handle(res, error);
    }
  }

  public async logout(req: Request, res: Response) {
    const token = req.cookies['refreshToken'];

    try {
      if (token) {
        await authService.logout(token);
      }

      res.clearCookie('accessToken', { path: '/' });
      res.clearCookie('refreshToken', { path: '/' });

      return res.json({
        message: 'Logout realizado com sucesso.',
      });
    } catch (error: any) {
      return ErrorHandlerHelper.handle(res, error);
    }
  }

  public async me(req: Request, res: Response) {
    const userId = (req as any).tokenUserId;

    try {
      const user = await userService.read(userId);
      return res.json({
        data: user,
      });
    } catch (error: any) {
      return ErrorHandlerHelper.handle(res, error);
    }
  }
}

export const authController = new AuthController();
