import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { z } from 'zod';
import { getEnv } from './../utils/get-env.utils';
import { prisma } from '../prisma-conn';

// Enums
import { EStatusErrors } from '../enum/EStatusErros.enum';
import { EZod } from '../enum/EZod.enum';

interface AuthenticatedRequest extends Request {
  tokenUserId?: string;
}

export class MiddlewareAuth {
  public static async authenticate(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const token = req.cookies?.['accessToken'];

      if (!token) {
        return res.status(401).json({
          error: EStatusErrors.E401,
          message: 'Token de acesso ausente.',
        });
      }

      const decoded = jwt.verify(
        token,
        getEnv('JWT_SECRET') || '',
      ) as JwtPayload;

      const email = decoded?.['email'] || decoded?.['payload']?.['email'];

      if (!email) {
        return res.status(401).json({
          error: 'E-mail do usuário ausente no token.',
        });
      }

      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return res.status(401).json({
          error: 'Usuário não encontrado.',
        });
      }

      req.tokenUserId = user.id;
      next();
    } catch (err) {
      return res.status(401).json({
        error: EStatusErrors.E401,
        message: 'Token inválido ou expirado.',
      });
    }
  }

  public static async authenticateAdmin(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const token = req.cookies?.['accessToken'];

      if (!token) {
        return res.status(401).json({
          error: EStatusErrors.E401,
          message: 'Token de acesso ausente.',
        });
      }

      const decoded = jwt.verify(
        token,
        getEnv('JWT_SECRET') || '',
      ) as JwtPayload;

      const email = decoded?.['email'] || decoded?.['payload']?.['email'];
      if (!email) {
        return res.status(401).json({
          error: 'E-mail do usuário ausente no token.',
        });
      }

      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user || user.role !== 'ADMIN') {
        return res.status(403).json({
          message: EStatusErrors.E403,
        });
      }

      req.tokenUserId = user.id;
      next();
    } catch (err) {
      return res.status(401).json({
        error: EStatusErrors.E401,
        message: 'Token inválido ou expirado.',
      });
    }
  }
}
