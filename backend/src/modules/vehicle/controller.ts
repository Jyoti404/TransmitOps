import { Request, Response } from 'express';
import { asyncHandler } from '../../common/asyncHandler';
import { createVehicleSchema, listVehiclesQuerySchema, updateVehicleSchema } from './validators';
import * as vehicleService from './service';

export const createVehicleHandler = asyncHandler(async (req: Request, res: Response) => {
  const input = createVehicleSchema.parse(req.body);
  const vehicle = await vehicleService.createVehicle(input);
  res.status(201).json(vehicle);
});

export const listVehiclesHandler = asyncHandler(async (req: Request, res: Response) => {
  const query = listVehiclesQuerySchema.parse(req.query);
  const vehicles = await vehicleService.listVehicles(query);
  res.json(vehicles);
});

export const listAvailableVehiclesHandler = asyncHandler(async (_req: Request, res: Response) => {
  const vehicles = await vehicleService.listAvailableVehicles();
  res.json(vehicles);
});

export const updateVehicleHandler = asyncHandler(async (req: Request, res: Response) => {
  const input = updateVehicleSchema.parse(req.body);
  const vehicle = await vehicleService.updateVehicle(req.params.id, input);
  res.json(vehicle);
});
