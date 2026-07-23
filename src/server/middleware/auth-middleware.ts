import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { z } from 'zod';
import { getEnv } from './../utils/get-env.utils';

// Enums
import { EStatusErrors } from '../enum/EStatusErros.enum';
import { EZod } from '../enum/EZod.enum';

interface AuthenticatedRequest extends Request {
  tokenUserId?: string;
}

export class MiddlewareAuth {
  public static authenticate(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Response | void {
    try {
      let token = MiddlewareAuth.#authorization(req);
      token = token.replace('Bearer ', '');

      const decoded = jwt.verify(
        token,
        getEnv('JWT_SECRET') || '',
      ) as JwtPayload;

      const userId = decoded?.['payload']?.['id'] || decoded?.['id'];

      if (!userId) {
        return res.status(401).json({
          error: 'ID do usuário ausente no token.',
        });
      }

      req.tokenUserId = userId;
      next();
    } catch (err) {
      return res.status(401).json({
        error: EStatusErrors.E401,
        message: 'Token inválido ou expirado.',
      });
    }
  }

  public static authenticateAdmin(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Response | void {
    try {
      let token = MiddlewareAuth.#authorization(req);
      token = token.replace('Bearer ', '');
      const decoded = jwt.verify(
        token,
        getEnv('JWT_SECRET') || '',
      ) as JwtPayload;

      const role = decoded?.['payload']?.['role'] || decoded?.['role'];
      if (role !== 'ADMIN') {
        return res.status(400).json({
          message: EStatusErrors.E403,
        });
      }

      const userId = decoded?.['payload']?.['id'] || decoded?.['id'];
      if (userId) {
        req.tokenUserId = userId;
      }

      next();
    } catch (err) {
      return res.status(401).json({
        error: EStatusErrors.E401,
        message: 'Token inválido ou expirado.',
      });
    }
  }

  static #authorization(req: AuthenticatedRequest): string {
    const authHeader = req.headers['authorization'];

    const ZAuthSchema = z
      .string()
      .min(25, { message: `Token ${EZod.REQUIRED}` });

    const parsed = ZAuthSchema.safeParse(authHeader);
    if (!parsed.success) {
      throw new Error(EStatusErrors.E400);
    }

    return parsed.data;
  }
}
