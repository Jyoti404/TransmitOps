import { Router } from 'express';
import { RoleName } from '@prisma/client';
import { requireAuth, requireRole } from '../../common/middleware/auth';
import {
  cancelTripHandler,
  completeTripHandler,
  createTripHandler,
  dispatchTripHandler,
  getTripHandler,
  listTripsHandler,
} from './controller';

export const tripRouter = Router();

tripRouter.use(requireAuth);

/**
 * @openapi
 * /trips:
 *   get:
 *     tags: [Trips]
 *     summary: List trips, optionally filtered by status
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [DRAFT, DISPATCHED, COMPLETED, CANCELLED] }
 *     responses:
 *       200:
 *         description: Trip list
 *   post:
 *     tags: [Trips]
 *     summary: Create a Draft trip
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [source, destination, vehicleId, driverId, cargoWeightKg, plannedDistanceKm]
 *             properties:
 *               source: { type: string, example: Warehouse }
 *               destination: { type: string, example: Client Site }
 *               vehicleId: { type: string, format: uuid }
 *               driverId: { type: string, format: uuid }
 *               cargoWeightKg: { type: number, example: 450 }
 *               plannedDistanceKm: { type: number, example: 120 }
 *     responses:
 *       201:
 *         description: Draft trip created
 */
tripRouter.get('/', listTripsHandler);
tripRouter.post('/', requireRole(RoleName.DRIVER), createTripHandler);

/**
 * @openapi
 * /trips/{id}:
 *   get:
 *     tags: [Trips]
 *     summary: Get a trip by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Trip detail
 *       404:
 *         description: Trip not found
 */
tripRouter.get('/:id', getTripHandler);

/**
 * @openapi
 * /trips/{id}/dispatch:
 *   post:
 *     tags: [Trips]
 *     summary: Dispatch a Draft trip (runs the rules engine, locks vehicle+driver rows)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Trip dispatched, vehicle+driver flipped to ON_TRIP
 *       409:
 *         description: Invalid state transition
 *       422:
 *         description: Business rule violation (capacity, license, suspension, availability)
 */
tripRouter.post('/:id/dispatch', requireRole(RoleName.DRIVER), dispatchTripHandler);

/**
 * @openapi
 * /trips/{id}/complete:
 *   post:
 *     tags: [Trips]
 *     summary: Complete a Dispatched trip
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
 *             required: [actualDistanceKm, fuelConsumedLiters]
 *             properties:
 *               actualDistanceKm: { type: number, example: 118 }
 *               fuelConsumedLiters: { type: number, example: 14.5 }
 *     responses:
 *       200:
 *         description: Trip completed, vehicle+driver restored to AVAILABLE
 */
tripRouter.post('/:id/complete', requireRole(RoleName.DRIVER), completeTripHandler);

/**
 * @openapi
 * /trips/{id}/cancel:
 *   post:
 *     tags: [Trips]
 *     summary: Cancel a Draft or Dispatched trip
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Trip cancelled, vehicle+driver restored to AVAILABLE if they were locked
 */
tripRouter.post('/:id/cancel', requireRole(RoleName.DRIVER, RoleName.FLEET_MANAGER), cancelTripHandler);
