import { Request, Response } from 'express';
import { asyncHandler } from '../../common/asyncHandler';
import { UnauthorizedError } from '../../common/errors';
import { createMaintenanceSchema, listMaintenanceQuerySchema } from './validators';
import * as maintenanceService from './service';

function requireUserId(req: Request): string {
  if (!req.user) throw new UnauthorizedError();
  return req.user.sub;
}

export const openMaintenanceHandler = asyncHandler(async (req: Request, res: Response) => {
  const input = createMaintenanceSchema.parse(req.body);
  const log = await maintenanceService.openMaintenance(input, requireUserId(req));
  res.status(201).json(log);
});

export const closeMaintenanceHandler = asyncHandler(async (req: Request, res: Response) => {
  const log = await maintenanceService.closeMaintenance(req.params.id, requireUserId(req));
  res.json(log);
});

export const listMaintenanceHandler = asyncHandler(async (req: Request, res: Response) => {
  const query = listMaintenanceQuerySchema.parse(req.query);
  const logs = await maintenanceService.listMaintenance(query);
  res.json(logs);
});
