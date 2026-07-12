import { Router } from 'express';
import { RoleName } from '@prisma/client';
import { requireAuth, requireRole } from '../../common/middleware/auth';
import { createExpenseHandler, createFuelLogHandler, listExpensesHandler, listFuelLogsHandler } from './controller';

export const fuelLogRouter = Router();
fuelLogRouter.use(requireAuth);

/**
 * @openapi
 * /fuel-logs:
 *   get:
 *     tags: [Fuel & Expenses]
 *     summary: List fuel logs, optionally filtered by vehicle or trip
 *     parameters:
 *       - in: query
 *         name: vehicleId
 *         schema: { type: string, format: uuid }
 *       - in: query
 *         name: tripId
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Fuel log list
 *   post:
 *     tags: [Fuel & Expenses]
 *     summary: Record a fuel log (Driver or Fleet Manager)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [vehicleId, liters, cost]
 *             properties:
 *               vehicleId: { type: string, format: uuid }
 *               tripId: { type: string, format: uuid }
 *               liters: { type: number, example: 14.5 }
 *               cost: { type: number, example: 1600 }
 *               loggedDate: { type: string, format: date }
 *     responses:
 *       201:
 *         description: Fuel log created
 */
fuelLogRouter.get('/', listFuelLogsHandler);
fuelLogRouter.post('/', requireRole(RoleName.DRIVER, RoleName.FLEET_MANAGER), createFuelLogHandler);

export const expenseRouter = Router();
expenseRouter.use(requireAuth);

/**
 * @openapi
 * /expenses:
 *   get:
 *     tags: [Fuel & Expenses]
 *     summary: List expenses, optionally filtered
 *     parameters:
 *       - in: query
 *         name: vehicleId
 *         schema: { type: string, format: uuid }
 *       - in: query
 *         name: tripId
 *         schema: { type: string, format: uuid }
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Expense list
 *   post:
 *     tags: [Fuel & Expenses]
 *     summary: Record an expense such as a toll (Fleet Manager or Financial Analyst)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [category, amount]
 *             properties:
 *               vehicleId: { type: string, format: uuid }
 *               tripId: { type: string, format: uuid }
 *               category: { type: string, example: TOLL }
 *               amount: { type: number, example: 250 }
 *               expenseDate: { type: string, format: date }
 *     responses:
 *       201:
 *         description: Expense created
 */
expenseRouter.get('/', listExpensesHandler);
expenseRouter.post(
  '/',
  requireRole(RoleName.FLEET_MANAGER, RoleName.FINANCIAL_ANALYST),
  createExpenseHandler,
);
