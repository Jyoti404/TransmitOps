import { z } from 'zod';

export const updateSettingsSchema = z.object({
  depotName: z.string().trim().min(1).max(150).optional(),
  currency: z.string().trim().min(1).max(10).optional(),
  distanceUnit: z.enum(['KM', 'MILES']).optional(),
});

export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;
