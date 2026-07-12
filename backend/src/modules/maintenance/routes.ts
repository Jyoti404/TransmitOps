import { Router } from 'express';
import { RoleName } from '@prisma/client';
import { requireAuth, requireRole } from '../../common/middleware/auth';
import { closeMaintenanceHandler, listMaintenanceHandler, openMaintenanceHandler } from './controller';

export const maintenanceRouter = Router();

maintenanceRouter.use(requireAuth);

/**
 * @openapi
 * /maintenance:
 *   get:
 *     tags: [Maintenance]
 *     summary: List maintenance logs, optionally filtered
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [OPEN, CLOSED] }
 *       - in: query
 *         name: vehicleId
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Maintenance log list
 *   post:
 *     tags: [Maintenance]
 *     summary: Open a maintenance record (Fleet Manager only). Vehicle must be AVAILABLE; auto-flips it to IN_SHOP.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [vehicleId, description]
 *             properties:
 *               vehicleId: { type: string, format: uuid }
 *               description: { type: string, example: Oil Change }
 *               cost: { type: number, example: 1500 }
 *     responses:
 *       201:
 *         description: Maintenance log opened, vehicle now IN_SHOP
 *       422:
 *         description: Vehicle isn't AVAILABLE (already in shop, on a trip, or retired)
 */
maintenanceRouter.get('/', listMaintenanceHandler);
maintenanceRouter.post('/', requireRole(RoleName.FLEET_MANAGER), openMaintenanceHandler);

/**
 * @openapi
 * /maintenance/{id}/close:
 *   patch:
 *     tags: [Maintenance]
 *     summary: Close a maintenance record (Fleet Manager only). Restores vehicle to AVAILABLE unless it was retired.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Maintenance log closed
 *       404:
 *         description: Maintenance log not found
 */
maintenanceRouter.patch('/:id/close', requireRole(RoleName.FLEET_MANAGER), closeMaintenanceHandler);
