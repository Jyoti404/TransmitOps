import { Request, Response } from 'express';
import { asyncHandler } from '../../common/asyncHandler';
import { dashboardKpiQuerySchema } from './validators';
import { getDashboardKpis } from './service';

export const getDashboardKpisHandler = asyncHandler(async (req: Request, res: Response) => {
  const filters = dashboardKpiQuerySchema.parse(req.query);
  const kpis = await getDashboardKpis(filters);
  res.json(kpis);
});
