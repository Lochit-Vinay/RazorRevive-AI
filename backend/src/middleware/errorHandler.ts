import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ZodError || err.name === 'ZodError') {
    return res.status(400).json({
      error: 'Bad Request',
      details: (err as ZodError).issues || err
    });
  }

  console.error('[Error]', err.stack || err.message);

  return res.status(500).json({
    error: err.message || 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? 'An unexpected error occurred' : err.message
  });
};
