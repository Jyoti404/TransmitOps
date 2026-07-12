import { Request, Response } from 'express';
import { asyncHandler } from '../../common/asyncHandler';
import { loginSchema } from './validators';
import { login } from './service';

export const loginHandler = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = loginSchema.parse(req.body);
  const result = await login(email, password);
  res.json(result);
});
