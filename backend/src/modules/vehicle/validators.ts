import { z } from 'zod';
import { VehicleStatus } from '@prisma/client';

export const createVehicleSchema = z.object({
  registrationNumber: z.string().trim().min(1).max(30),
  nameModel: z.string().trim().min(1).max(100),
  type: z.string().trim().min(1).max(30),
  maxLoadCapacityKg: z.number().positive(),
  odometerKm: z.number().nonnegative().optional(),
  acquisitionCost: z.number().positive(),
  region: z.string().trim().min(1).max(60).optional(),
});

export const updateVehicleSchema = createVehicleSchema.partial().extend({
  status: z.nativeEnum(VehicleStatus).optional(),
});

export const listVehiclesQuerySchema = z.object({
  type: z.string().trim().optional(),
  status: z.nativeEnum(VehicleStatus).optional(),
  region: z.string().trim().optional(),
});

export type CreateVehicleInput = z.infer<typeof createVehicleSchema>;
export type UpdateVehicleInput = z.infer<typeof updateVehicleSchema>;
export type ListVehiclesQuery = z.infer<typeof listVehiclesQuerySchema>;
