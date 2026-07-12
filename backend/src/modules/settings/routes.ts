import { Router } from 'express';
import { RoleName } from '@prisma/client';
import { requireAuth, requireRole } from '../../common/middleware/auth';
import { getSettingsHandler, updateSettingsHandler } from './controller';

export const settingsRouter = Router();

settingsRouter.use(requireAuth);

/**
 * @openapi
 * /settings:
 *   get:
 *     tags: [Settings]
 *     summary: Org-wide display settings (depot name, currency, distance unit)
 *     responses:
 *       200:
 *         description: Current settings (created with defaults on first read)
 *   put:
 *     tags: [Settings]
 *     summary: Update settings (Fleet Manager only)
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               depotName: { type: string }
 *               currency: { type: string, example: INR }
 *               distanceUnit: { type: string, enum: [KM, MILES] }
 *     responses:
 *       200:
 *         description: Updated settings
 */
settingsRouter.get('/', getSettingsHandler);
settingsRouter.put('/', requireRole(RoleName.FLEET_MANAGER), updateSettingsHandler);
