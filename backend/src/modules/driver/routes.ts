import { Router } from 'express';
import { RoleName } from '@prisma/client';
import { requireAuth, requireRole } from '../../common/middleware/auth';
import {
  createDriverHandler,
  listAvailableDriversHandler,
  listDriversHandler,
  suspendDriverHandler,
} from './controller';

export const driverRouter = Router();

driverRouter.use(requireAuth);

/**
 * @openapi
 * /drivers/available:
 *   get:
 *     tags: [Drivers]
 *     summary: List assignable drivers (AVAILABLE status + license not expired)
 *     responses:
 *       200:
 *         description: Available drivers
 */
// Must be registered before '/:id'-style routes to avoid 'available' being parsed as an id.
driverRouter.get('/available', listAvailableDriversHandler);

/**
 * @openapi
 * /drivers:
 *   get:
 *     tags: [Drivers]
 *     summary: List drivers, optionally filtered by status
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [AVAILABLE, ON_TRIP, OFF_DUTY, SUSPENDED] }
 *     responses:
 *       200:
 *         description: Driver list
 *   post:
 *     tags: [Drivers]
 *     summary: Register a new driver (Fleet Manager or Safety Officer)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [fullName, licenseNumber, licenseCategory, licenseExpiryDate]
 *             properties:
 *               fullName: { type: string, example: Alex Mendes }
 *               licenseNumber: { type: string, example: DL-9988 }
 *               licenseCategory: { type: string, example: LMV }
 *               licenseExpiryDate: { type: string, format: date, example: 2027-01-01 }
 *               contactNumber: { type: string }
 *               email: { type: string }
 *     responses:
 *       201:
 *         description: Driver created
 *       409:
 *         description: License number already in use
 */
driverRouter.get('/', listDriversHandler);
driverRouter.post('/', requireRole(RoleName.FLEET_MANAGER, RoleName.SAFETY_OFFICER), createDriverHandler);

/**
 * @openapi
 * /drivers/{id}/suspend:
 *   patch:
 *     tags: [Drivers]
 *     summary: Suspend a driver (Safety Officer only)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [reason]
 *             properties:
 *               reason: { type: string, example: Harsh braking incident reported by client }
 *     responses:
 *       200:
 *         description: Driver suspended, audit log written
 *       404:
 *         description: Driver not found
 */
driverRouter.patch('/:id/suspend', requireRole(RoleName.SAFETY_OFFICER), suspendDriverHandler);
