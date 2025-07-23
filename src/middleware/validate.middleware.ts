import { Request, Response, NextFunction } from 'express';
import { ZodObject, ZodError } from 'zod';
import { HttpCode } from '../http_code';

export function validateResource(schema: ZodObject) {
  return (req: Request, res: Response, next: NextFunction) => {
    const toValidate = {
      body: req.body,
      params: req.params,
      query: req.query,
    };
    const result = schema.safeParse(toValidate);

    if (!result.success) {
      const errors = (result.error as ZodError<any>).issues.map(issue => ({
        path: issue.path.join('.'),
        message: issue.message,
      }));
      return res
        .status(HttpCode.BAD_REQUEST)
        .json({ message: 'Validation échouée', errors });
    }

    next();
  };
}
