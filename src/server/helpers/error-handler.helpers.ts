import { Response } from 'express';
import { ZodError } from 'zod';
import { EStatusErrors } from '../enum/EStatusErros.enum';

export class ErrorHandlerHelper {
  /**
   * Método para tratar erros e enviar resposta HTTP apropriada.
   * @param res Response - Objeto de resposta do Express.
   * @param error unknown - Erro capturado.
   */
  static handle(res: Response, error: unknown): Response {
    const errorMap: Record<string, { statusCode: number; message: string }> = {
      [EStatusErrors.E400]: { statusCode: 400, message: EStatusErrors.E400 },
      [EStatusErrors.E401]: { statusCode: 401, message: EStatusErrors.E401 },
      [EStatusErrors.E402]: { statusCode: 402, message: EStatusErrors.E402 },
      [EStatusErrors.E403]: { statusCode: 403, message: EStatusErrors.E403 },
      [EStatusErrors.E404]: { statusCode: 404, message: EStatusErrors.E404 },
      [EStatusErrors.E405]: { statusCode: 405, message: EStatusErrors.E405 },
      [EStatusErrors.E408]: { statusCode: 408, message: EStatusErrors.E408 },
      [EStatusErrors.E409]: { statusCode: 409, message: EStatusErrors.E409 },
      [EStatusErrors.E413]: { statusCode: 413, message: EStatusErrors.E413 },
      [EStatusErrors.E422]: { statusCode: 422, message: EStatusErrors.E422 },
      [EStatusErrors.E429]: { statusCode: 429, message: EStatusErrors.E429 },
      [EStatusErrors.E503]: { statusCode: 503, message: EStatusErrors.E503 },
    };

    if (error instanceof ZodError) {
      return res.status(400).json({ error: error.errors });
    }

    let statusCode = 500;
    let message: string = EStatusErrors.E500;

    if (error instanceof Error) {
      const mappedError = errorMap[error.message];
      if (mappedError) {
        statusCode = mappedError.statusCode;
        message = mappedError.message;
      }
    }

    if (
      typeof error === 'object' &&
      error !== null &&
      'statusCode' in error &&
      'message' in error
    ) {
      statusCode = (error as any).statusCode;
      message = (error as any).message;
    }

    return res.status(statusCode).json({ error: { statusCode, message } });
  }
}
