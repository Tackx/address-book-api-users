import { NextFunction, Request, Response } from 'express';
import { userSchema } from '../utils/validationSchemas';

export const validateUser = (req: Request, res: Response, next: NextFunction) => {
  const { error } = userSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(',');
    res.status(400).json({ 'Error message': msg });
  } else {
    next();
  }
};
