import { z } from 'zod';

export const createMaintenanceSchema = z.object({
  vehicleId: z.string().uuid(),
  description: z.string().trim().min(1).max(255),
  cost: z.number().nonnegative().optional(),
});

export const listMaintenanceQuerySchema = z.object({
  status: z.enum(['OPEN', 'CLOSED']).optional(),
  vehicleId: z.string().uuid().optional(),
});

export type CreateMaintenanceInput = z.infer<typeof createMaintenanceSchema>;
export type ListMaintenanceQuery = z.infer<typeof listMaintenanceQuerySchema>;
