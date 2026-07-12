import { z } from 'zod';

export const createFuelLogSchema = z.object({
  vehicleId: z.string().uuid(),
  tripId: z.string().uuid().optional(),
  liters: z.number().positive(),
  cost: z.number().positive(),
  loggedDate: z.coerce.date().optional(),
});

export const listFuelLogsQuerySchema = z.object({
  vehicleId: z.string().uuid().optional(),
  tripId: z.string().uuid().optional(),
});

export const createExpenseSchema = z.object({
  vehicleId: z.string().uuid().optional(),
  tripId: z.string().uuid().optional(),
  category: z.string().trim().min(1).max(40),
  amount: z.number().positive(),
  expenseDate: z.coerce.date().optional(),
});

export const listExpensesQuerySchema = z.object({
  vehicleId: z.string().uuid().optional(),
  tripId: z.string().uuid().optional(),
  category: z.string().trim().optional(),
});

export type CreateFuelLogInput = z.infer<typeof createFuelLogSchema>;
export type ListFuelLogsQuery = z.infer<typeof listFuelLogsQuerySchema>;
export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;
export type ListExpensesQuery = z.infer<typeof listExpensesQuerySchema>;
