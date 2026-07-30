import { Request, Response } from 'express';
import { z } from 'zod';

// Service
import { EZod } from '../../../enum/EZod.enum';
import { ErrorHandlerHelper } from '../../../helpers/error-handler.helpers';
import { resetPasswordService } from '../service/reset-password.service';

// Enum

class ResetPasswordController {
  public async validateUser(req: Request, res: Response) {
    const email = req.body.email;

    try {
      const ZUserSchema = z
        .string()
        .email({ message: `Email ${EZod.REQUIRED}` });

      ZUserSchema.parse(email);

      return res.json({
        data: await resetPasswordService.validateUser(email),
      });
    } catch (error: any) {
      return ErrorHandlerHelper.handle(res, error);
    }
  }

  public async validateSecurityCode(req: Request, res: Response) {
    const { email, secret } = req.body;

    try {
      const ZUserSchema = z.object({
        email: z.string().email({ message: `Email ${EZod.REQUIRED}` }),
        secret: z.string().min(5, { message: `Segredo ${EZod.REQUIRED}` }),
      });

      ZUserSchema.parse({ email, secret });

      return res.json({
        data: await resetPasswordService.validateSecurityCode(
          email,
          String(secret),
        ),
      });
    } catch (error: any) {
      return ErrorHandlerHelper.handle(res, error);
    }
  }

  public async resetPassword(req: Request, res: Response) {
    const { email, secret, password } = req.body;

    try {
      const ZUserSchema = z.object({
        email: z.string().email({ message: `Email ${EZod.REQUIRED}` }),
        secret: z.string().min(5, { message: `Segredo ${EZod.REQUIRED}` }),
        password: z.string().min(8, { message: `Nova senha ${EZod.REQUIRED}` }),
      });

      ZUserSchema.parse({ email, secret, password });

      return res.json({
        data: await resetPasswordService.resetPassword(
          email,
          String(secret),
          password,
        ),
      });
    } catch (error: any) {
      return ErrorHandlerHelper.handle(res, error);
    }
  }
}

export const resetPasswordController = new ResetPasswordController();
