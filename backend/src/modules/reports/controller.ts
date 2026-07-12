import { Request, Response } from 'express';
import { write } from 'fast-csv';
import { asyncHandler } from '../../common/asyncHandler';
import { ValidationError } from '../../common/errors';
import * as reportsService from './service';

export const fuelEfficiencyHandler = asyncHandler(async (_req: Request, res: Response) => {
  res.json(await reportsService.getFuelEfficiencyReport());
});

export const utilizationHandler = asyncHandler(async (req: Request, res: Response) => {
  const days = req.query.days ? Number(req.query.days) : 7;
  res.json(await reportsService.getUtilizationTrend(days));
});

export const costHandler = asyncHandler(async (_req: Request, res: Response) => {
  res.json(await reportsService.getCostReport());
});

export const roiHandler = asyncHandler(async (_req: Request, res: Response) => {
  res.json(await reportsService.getRoiReport());
});

export const monthlyRevenueHandler = asyncHandler(async (req: Request, res: Response) => {
  const months = req.query.months ? Number(req.query.months) : 6;
  res.json(await reportsService.getMonthlyRevenueReport(months));
});

type CsvRow = Record<string, unknown>;

const EXPORTABLE_REPORTS: Record<string, () => Promise<CsvRow[]>> = {
  'fuel-efficiency': () => reportsService.getFuelEfficiencyReport() as unknown as Promise<CsvRow[]>,
  utilization: () => reportsService.getUtilizationTrend(30) as unknown as Promise<CsvRow[]>,
  cost: () => reportsService.getCostReport() as unknown as Promise<CsvRow[]>,
  roi: () => reportsService.getRoiReport() as unknown as Promise<CsvRow[]>,
};

export const exportReportHandler = asyncHandler(async (req: Request, res: Response) => {
  const reportName = String(req.query.report ?? '');
  const getReport = EXPORTABLE_REPORTS[reportName];
  if (!getReport) {
    throw new ValidationError(`Unknown report '${reportName}'. Valid: ${Object.keys(EXPORTABLE_REPORTS).join(', ')}`);
  }

  const rows = await getReport();
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="${reportName}-report.csv"`);
  write(rows, { headers: true }).pipe(res);
});
