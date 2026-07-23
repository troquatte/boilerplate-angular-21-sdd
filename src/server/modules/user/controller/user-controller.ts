import { Request, Response } from 'express';
import { z } from 'zod';

// Enum
import { EZod } from '../../../enum/EZod.enum';
import { ERoles } from '../enum/ERoles.enum';

// Service
import { ErrorHandlerHelper } from '../../../helpers/error-handler.helpers';
import { userService } from '../service/user-service';

// Interface
import { IUserEntity } from '../interface/IUser.interface';

const ZUserCreateSchema = z.object({
  email: z.string().email({ message: `Email ${EZod.REQUIRED}` }),
  password: z.string().min(6, { message: `Senha ${EZod.REQUIRED}` }),
  name: z.string().min(3, { message: `Nome ${EZod.REQUIRED}` }),
  role: z.nativeEnum(ERoles),
});

const ZUserIdSchema = z.string().min(30, { message: `ID ${EZod.REQUIRED}` });

const ZUserUpdateSchema = z.object({
  id: z.string().min(30, { message: `ID ${EZod.REQUIRED}` }),
  name: z.string().min(1, { message: `Nome ${EZod.REQUIRED}` }),
  role: z.nativeEnum(ERoles),
});

class UserController {
  public async create(req: Request, res: Response) {
    const payloadUserCreateAuth = req.body as IUserEntity;

    try {
      const payload = ZUserCreateSchema.parse({
        email: payloadUserCreateAuth.email,
        password: payloadUserCreateAuth.password,
        name: payloadUserCreateAuth.name,
        role: payloadUserCreateAuth.role,
      });

      return res.status(201).json({
        data: await userService.create(payload),
      });
    } catch (error: any) {
      return ErrorHandlerHelper.handle(res, error);
    }
  }

  public async read(req: Request, res: Response) {
    const { id } = req.params as { id: string };

    try {
      ZUserIdSchema.parse(id);

      return res.json({
        data: await userService.read(id),
      });
    } catch (error: any) {
      return ErrorHandlerHelper.handle(res, error);
    }
  }

  public async update(req: Request, res: Response) {
    const { id } = req.params as { id: string };
    const { name, role } = req.body;

    try {
      ZUserUpdateSchema.parse({ id, name, role });

      return res.json({
        data: await userService.update(id, name, role),
      });
    } catch (error: any) {
      return ErrorHandlerHelper.handle(res, error);
    }
  }

  public async delete(req: Request, res: Response) {
    const { id } = req.params as { id: string };

    try {
      ZUserIdSchema.parse(id);

      return res.json({
        data: await userService.delete(id),
      });
    } catch (error: any) {
      return ErrorHandlerHelper.handle(res, error);
    }
  }
}

export const userController = new UserController();
