import { Request, Response } from 'express';
import { asyncHandler } from '../../common/asyncHandler';
import {
  createExpenseSchema,
  createFuelLogSchema,
  listExpensesQuerySchema,
  listFuelLogsQuerySchema,
} from './validators';
import * as fuelExpenseService from './service';

export const createFuelLogHandler = asyncHandler(async (req: Request, res: Response) => {
  const input = createFuelLogSchema.parse(req.body);
  const log = await fuelExpenseService.createFuelLog(input);
  res.status(201).json(log);
});

export const listFuelLogsHandler = asyncHandler(async (req: Request, res: Response) => {
  const query = listFuelLogsQuerySchema.parse(req.query);
  const logs = await fuelExpenseService.listFuelLogs(query);
  res.json(logs);
});

export const createExpenseHandler = asyncHandler(async (req: Request, res: Response) => {
  const input = createExpenseSchema.parse(req.body);
  const expense = await fuelExpenseService.createExpense(input);
  res.status(201).json(expense);
});

export const listExpensesHandler = asyncHandler(async (req: Request, res: Response) => {
  const query = listExpensesQuerySchema.parse(req.query);
  const expenses = await fuelExpenseService.listExpenses(query);
  res.json(expenses);
});

export const vehicleCostSummaryHandler = asyncHandler(async (req: Request, res: Response) => {
  const summary = await fuelExpenseService.getVehicleCostSummary(req.params.id);
  res.json(summary);
});
