import { Router } from 'express';
import { requireAuth } from '../../common/middleware/auth';
import { loginHandler } from './controller';

export const authRouter = Router();

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Log in with email + password
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: fleetmanager@transitops.local
 *               password:
 *                 type: string
 *                 example: Password123!
 *     responses:
 *       200:
 *         description: JWT + user profile
 *       401:
 *         description: Invalid credentials
 */
authRouter.post('/login', loginHandler);

/**
 * @openapi
 * /auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Return the caller's decoded JWT payload
 *     responses:
 *       200:
 *         description: Current user
 *       401:
 *         description: Missing or invalid token
 */
authRouter.get('/me', requireAuth, (req, res) => {
  res.json({ user: req.user });
});
