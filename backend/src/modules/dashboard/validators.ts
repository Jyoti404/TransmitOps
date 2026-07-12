import { z } from 'zod';
import { VehicleStatus } from '@prisma/client';

export const dashboardKpiQuerySchema = z.object({
  type: z.string().trim().optional(),
  status: z.nativeEnum(VehicleStatus).optional(),
  region: z.string().trim().optional(),
});

export type DashboardKpiQuery = z.infer<typeof dashboardKpiQuerySchema>;
