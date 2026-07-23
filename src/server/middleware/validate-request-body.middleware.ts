import { NextFunction, Request, Response } from 'express';
import { EStatusErrors } from '../enum/EStatusErros.enum';

export class MiddlewareRequest {
  public async validateRequestBody(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        message: EStatusErrors.E400,
        error: 'Corpo da requisição está vazio.',
      });
    }
    return next();
  }
}

export const middlewareRequest = new MiddlewareRequest();
