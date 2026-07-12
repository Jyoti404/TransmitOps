import { Router } from 'express';
import { requireAuth } from '../../common/middleware/auth';
import { loginHandler } from './controller';

export const authRouter = Router();

authRouter.post('/login', loginHandler);
authRouter.get('/me', requireAuth, (req, res) => {
  res.json({ user: req.user });
});
