import { Request, Response } from 'express';
import { z } from 'zod';

// Enum
import { EZod } from '../../../enum/EZod.enum';
import { ErrorHandlerHelper } from '../../../helpers/error-handler.helpers';
import { authService } from '../service/auth.service';

class AuthController {
  public async login(req: Request, res: Response) {
    const { email, password } = req.body;

    try {
      const ZUserSchema = z.object({
        email: z.string().email({ message: `Email ${EZod.REQUIRED}` }),
        password: z.string().min(1, { message: `Senha ${EZod.REQUIRED}` }),
      });

      ZUserSchema.parse({ email, password });

      return res.json({
        data: await authService.login(email, password),
      });
    } catch (error: any) {
      return ErrorHandlerHelper.handle(res, error);
    }
  }

  public async token(req: Request, res: Response) {
    const token = req.headers['authorization'] || '';

    try {
      const ZAuthSchema = z
        .string()
        .min(25, { message: `Token ${EZod.REQUIRED}` });

      ZAuthSchema.parse(token);

      return res.json({
        data: await authService.token(token),
      });
    } catch (error: any) {
      return ErrorHandlerHelper.handle(res, error);
    }
  }
}

export const authController = new AuthController();
