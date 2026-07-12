import { z } from 'zod';

export const createDriverSchema = z.object({
  fullName: z.string().trim().min(1).max(150),
  licenseNumber: z.string().trim().min(1).max(40),
  licenseCategory: z.string().trim().min(1).max(20),
  licenseExpiryDate: z.coerce.date(),
  contactNumber: z.string().trim().min(1).max(20).optional(),
  email: z.string().trim().email().optional(),
});

export const listDriversQuerySchema = z.object({
  status: z.enum(['AVAILABLE', 'ON_TRIP', 'OFF_DUTY', 'SUSPENDED']).optional(),
});

export const suspendDriverSchema = z.object({
  reason: z.string().trim().min(1, 'Suspension reason is required').max(255),
});

export type CreateDriverInput = z.infer<typeof createDriverSchema>;
export type ListDriversQuery = z.infer<typeof listDriversQuerySchema>;
export type SuspendDriverInput = z.infer<typeof suspendDriverSchema>;
