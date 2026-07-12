import { useQuery } from '@tanstack/react-query';
import * as reportsApi from '../api/reports';

export function useFuelEfficiencyReport() {
  return useQuery({ queryKey: ['reports', 'fuel-efficiency'], queryFn: reportsApi.getFuelEfficiencyReport });
}

export function useUtilizationReport(days = 30) {
  return useQuery({ queryKey: ['reports', 'utilization', days], queryFn: () => reportsApi.getUtilizationReport(days) });
}

export function useCostReport() {
  return useQuery({ queryKey: ['reports', 'cost'], queryFn: reportsApi.getCostReport });
}

export function useRoiReport() {
  return useQuery({ queryKey: ['reports', 'roi'], queryFn: reportsApi.getRoiReport });
}

export function useMonthlyRevenueReport(months = 6) {
  return useQuery({
    queryKey: ['reports', 'monthly-revenue', months],
    queryFn: () => reportsApi.getMonthlyRevenueReport(months),
  });
}
