import { apiClient } from './client';

export interface FuelEfficiencyRow {
  vehicleId: string;
  registrationNumber: string;
  totalDistanceKm: number;
  totalFuelLiters: number;
  efficiencyKmPerLiter: number | null;
}

export interface UtilizationTrendRow {
  date: string;
  activeVehicles: number;
  availableVehicles: number;
  inShopVehicles: number;
  utilizationPct: number;
}

export interface CostReportRow {
  vehicleId: string;
  registrationNumber: string;
  totalFuelCost: number;
  totalMaintenanceCost: number;
  totalExpenseCost: number;
  totalOperationalCost: number;
}

export interface RoiReportRow {
  vehicleId: string;
  registrationNumber: string;
  revenue: number;
  maintenanceCost: number;
  fuelCost: number;
  acquisitionCost: number;
  roi: number | null;
}

export interface MonthlyRevenueRow {
  month: string; // "YYYY-MM"
  revenue: number;
}

export type ReportName = 'fuel-efficiency' | 'utilization' | 'cost' | 'roi';

export async function getFuelEfficiencyReport(): Promise<FuelEfficiencyRow[]> {
  const { data } = await apiClient.get<FuelEfficiencyRow[]>('/reports/fuel-efficiency');
  return data;
}

export async function getUtilizationReport(days = 30): Promise<UtilizationTrendRow[]> {
  const { data } = await apiClient.get<UtilizationTrendRow[]>('/reports/utilization', { params: { days } });
  return data;
}

export async function getCostReport(): Promise<CostReportRow[]> {
  const { data } = await apiClient.get<CostReportRow[]>('/reports/cost');
  return data;
}

export async function getRoiReport(): Promise<RoiReportRow[]> {
  const { data } = await apiClient.get<RoiReportRow[]>('/reports/roi');
  return data;
}

export async function getMonthlyRevenueReport(months = 6): Promise<MonthlyRevenueRow[]> {
  const { data } = await apiClient.get<MonthlyRevenueRow[]>('/reports/monthly-revenue', { params: { months } });
  return data;
}

// CSV export needs the auth header, so a plain <a href> won't carry the
// token — fetch it as a blob through the authenticated client instead and
// trigger the browser download manually.
export async function downloadReportCsv(report: ReportName): Promise<void> {
  const response = await apiClient.get('/reports/export', {
    params: { report },
    responseType: 'blob',
  });

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.download = `${report}-report.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}
