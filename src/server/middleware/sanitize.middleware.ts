import { NextFunction, Request, Response } from 'express';

export function sanitizeInput(req: Request, res: Response, next: NextFunction) {
  if (req.body && typeof req.body === 'object') {
    for (const key in req.body) {
      if (Object.prototype.hasOwnProperty.call(req.body, key) && typeof req.body[key] === 'string') {
        req.body[key] = req.body[key]
          .replace(/<script[^>]*>([\S\s]*?)<\/script>/gi, '') // Remove <script> tags
          .replace(/<\/?[^>]+(>|$)/g, '') // Remove any remaining HTML tags
          .trim();
      }
    }
  }
  next();
}
