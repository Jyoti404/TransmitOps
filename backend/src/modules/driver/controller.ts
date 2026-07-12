import { Request, Response } from 'express';
import { asyncHandler } from '../../common/asyncHandler';
import { UnauthorizedError } from '../../common/errors';
import { createDriverSchema, listDriversQuerySchema, suspendDriverSchema } from './validators';
import * as driverService from './service';

export const createDriverHandler = asyncHandler(async (req: Request, res: Response) => {
  const input = createDriverSchema.parse(req.body);
  const driver = await driverService.createDriver(input);
  res.status(201).json(driver);
});

export const listDriversHandler = asyncHandler(async (req: Request, res: Response) => {
  const query = listDriversQuerySchema.parse(req.query);
  const drivers = await driverService.listDrivers(query);
  res.json(drivers);
});

export const listAvailableDriversHandler = asyncHandler(async (_req: Request, res: Response) => {
  const drivers = await driverService.listAvailableDrivers();
  res.json(drivers);
});

export const suspendDriverHandler = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new UnauthorizedError();
  const { reason } = suspendDriverSchema.parse(req.body);
  const driver = await driverService.suspendDriver(req.params.id, reason, req.user.sub);
  res.json(driver);
});
