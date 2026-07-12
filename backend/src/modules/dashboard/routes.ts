import { Router } from 'express';
import { requireAuth } from '../../common/middleware/auth';
import { getDashboardKpisHandler } from './controller';

export const dashboardRouter = Router();

dashboardRouter.use(requireAuth);

/**
 * @openapi
 * /dashboard/kpis:
 *   get:
 *     tags: [Dashboard]
 *     summary: Fleet KPIs (Redis-cached, 30s TTL, invalidated on trip/maintenance state changes)
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
 *         description: activeVehicles, availableVehicles, vehiclesInMaintenance, activeTrips, pendingTrips, driversOnDuty, fleetUtilizationPct
 */
dashboardRouter.get('/kpis', getDashboardKpisHandler);
