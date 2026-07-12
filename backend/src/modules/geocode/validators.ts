import { z } from 'zod';

export const geocodeSearchQuerySchema = z.object({
  q: z.string().trim().min(3, 'Query must be at least 3 characters'),
});

export type GeocodeSearchQuery = z.infer<typeof geocodeSearchQuerySchema>;
