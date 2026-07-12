import { Router } from 'express';
import { RoleName } from '@prisma/client';
import { requireAuth, requireRole } from '../../common/middleware/auth';
import {
  costHandler,
  exportReportHandler,
  fuelEfficiencyHandler,
  monthlyRevenueHandler,
  roiHandler,
  utilizationHandler,
} from './controller';

export const reportsRouter = Router();

reportsRouter.use(requireAuth);
// Reports are a Fleet Manager / Safety Officer / Financial Analyst concern — Drivers don't get a view.
reportsRouter.use(requireRole(RoleName.FLEET_MANAGER, RoleName.SAFETY_OFFICER, RoleName.FINANCIAL_ANALYST));

/**
 * @openapi
 * /reports/fuel-efficiency:
 *   get:
 *     tags: [Reports]
 *     summary: Distance/fuel per vehicle (completed trips only)
 *     responses:
 *       200:
 *         description: Fuel efficiency per vehicle
 */
reportsRouter.get('/fuel-efficiency', fuelEfficiencyHandler);

/**
 * @openapi
 * /reports/utilization:
 *   get:
 *     tags: [Reports]
 *     summary: Fleet utilization trend from daily KPI snapshots
 *     parameters:
 *       - in: query
 *         name: days
 *         schema: { type: integer, default: 7 }
 *     responses:
 *       200:
 *         description: Utilization trend, oldest first
 */
reportsRouter.get('/utilization', utilizationHandler);

/**
 * @openapi
 * /reports/cost:
 *   get:
 *     tags: [Reports]
 *     summary: Operational cost per vehicle (fuel + maintenance + expenses)
 *     responses:
 *       200:
 *         description: Cost breakdown per vehicle
 */
reportsRouter.get('/cost', costHandler);

/**
 * @openapi
 * /reports/roi:
 *   get:
 *     tags: [Reports]
 *     summary: "ROI per vehicle: (Revenue - (Maintenance + Fuel)) / Acquisition Cost"
 *     responses:
 *       200:
 *         description: ROI per vehicle
 */
reportsRouter.get('/roi', roiHandler);

/**
 * @openapi
 * /reports/monthly-revenue:
 *   get:
 *     tags: [Reports]
 *     summary: Revenue from completed trips, grouped by month
 *     parameters:
 *       - in: query
 *         name: months
 *         schema: { type: integer, default: 6 }
 *     responses:
 *       200:
 *         description: Monthly revenue, oldest first
 */
reportsRouter.get('/monthly-revenue', monthlyRevenueHandler);

/**
 * @openapi
 * /reports/export:
 *   get:
 *     tags: [Reports]
 *     summary: CSV export of a report (Financial Analyst only)
 *     parameters:
 *       - in: query
 *         name: report
 *         required: true
 *         schema: { type: string, enum: [fuel-efficiency, utilization, cost, roi] }
 *     responses:
 *       200:
 *         description: CSV file
 *         content:
 *           text/csv: {}
 */
reportsRouter.get('/export', requireRole(RoleName.FINANCIAL_ANALYST), exportReportHandler);
