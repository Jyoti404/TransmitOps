import { z } from 'zod';

export const createTripSchema = z.object({
  source: z.string().trim().min(1).max(150),
  destination: z.string().trim().min(1).max(150),
  vehicleId: z.string().uuid(),
  driverId: z.string().uuid(),
  cargoWeightKg: z.number().positive(),
  plannedDistanceKm: z.number().positive(),
  revenue: z.number().nonnegative().optional(),
});

export const completeTripSchema = z.object({
  actualDistanceKm: z.number().positive(),
  fuelConsumedLiters: z.number().nonnegative(),
});

export const listTripsQuerySchema = z.object({
  status: z.enum(['DRAFT', 'DISPATCHED', 'COMPLETED', 'CANCELLED']).optional(),
});

export type CreateTripInput = z.infer<typeof createTripSchema>;
export type CompleteTripInput = z.infer<typeof completeTripSchema>;
export type ListTripsQuery = z.infer<typeof listTripsQuerySchema>;
