import { apiClient } from './client';
import { VehicleStatus } from './vehicles';

export interface DashboardKpis {
  activeVehicles: number;
  availableVehicles: number;
  vehiclesInMaintenance: number;
  activeTrips: number;
  pendingTrips: number;
  driversOnDuty: number;
  fleetUtilizationPct: number;
}

export interface DashboardFilters {
  type?: string;
  status?: VehicleStatus;
  region?: string;
}

export async function getDashboardKpis(filters: DashboardFilters = {}): Promise<DashboardKpis> {
  const { data } = await apiClient.get<DashboardKpis>('/dashboard/kpis', { params: filters });
  return data;
}
