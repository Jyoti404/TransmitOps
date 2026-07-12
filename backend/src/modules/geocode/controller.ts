import { Request, Response } from 'express';
import { asyncHandler } from '../../common/asyncHandler';
import { geocodeSearchQuerySchema } from './validators';
import { searchLocations } from './service';

export const searchLocationsHandler = asyncHandler(async (req: Request, res: Response) => {
  const { q } = geocodeSearchQuerySchema.parse(req.query);
  const suggestions = await searchLocations(q);
  res.json(suggestions);
});
