import { Router } from 'express';
import { RoleName } from '@prisma/client';
import { requireAuth, requireRole } from '../../common/middleware/auth';
import {
  createVehicleHandler,
  listAvailableVehiclesHandler,
  listVehiclesHandler,
  updateVehicleHandler,
} from './controller';

export const vehicleRouter = Router();

vehicleRouter.use(requireAuth);

/**
 * @openapi
 * /vehicles/available:
 *   get:
 *     tags: [Vehicles]
 *     summary: List dispatchable vehicles (excludes IN_SHOP and RETIRED)
 *     responses:
 *       200:
 *         description: Available vehicles
 */
// Must be registered before '/:id'-style routes to avoid 'available' being parsed as an id.
vehicleRouter.get('/available', listAvailableVehiclesHandler);

/**
 * @openapi
 * /vehicles:
 *   get:
 *     tags: [Vehicles]
 *     summary: List vehicles, optionally filtered
 *     parameters:
 *       - in: query
 *         name: type
 *         schema: { type: string }
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [AVAILABLE, ON_TRIP, IN_SHOP, RETIRED] }
 *       - in: query
 *         name: region
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Vehicle list
 *   post:
 *     tags: [Vehicles]
 *     summary: Register a new vehicle (Fleet Manager only)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [registrationNumber, nameModel, type, maxLoadCapacityKg, acquisitionCost]
 *             properties:
 *               registrationNumber: { type: string, example: MH-12-AB-1234 }
 *               nameModel: { type: string, example: Tata Ace }
 *               type: { type: string, example: VAN }
 *               maxLoadCapacityKg: { type: number, example: 500 }
 *               odometerKm: { type: number, example: 0 }
 *               acquisitionCost: { type: number, example: 800000 }
 *               region: { type: string, example: Mumbai }
 *     responses:
 *       201:
 *         description: Vehicle created
 *       409:
 *         description: Registration number already in use
 */
vehicleRouter.get('/', listVehiclesHandler);
vehicleRouter.post('/', requireRole(RoleName.FLEET_MANAGER), createVehicleHandler);

/**
 * @openapi
 * /vehicles/{id}:
 *   put:
 *     tags: [Vehicles]
 *     summary: Update a vehicle (Fleet Manager only)
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
 *     responses:
 *       200:
 *         description: Updated vehicle
 *       404:
 *         description: Vehicle not found
 */
vehicleRouter.put('/:id', requireRole(RoleName.FLEET_MANAGER), updateVehicleHandler);
