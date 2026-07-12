import { apiClient } from './client';
import { Vehicle } from './vehicles';

export type MaintenanceStatus = 'OPEN' | 'CLOSED';

export interface MaintenanceLog {
  id: string;
  vehicleId: string;
  description: string;
  cost: string;
  status: MaintenanceStatus;
  openedAt: string;
  closedAt: string | null;
  vehicle?: Vehicle;
}

export interface MaintenanceFilters {
  status?: MaintenanceStatus;
  vehicleId?: string;
}

export interface CreateMaintenanceInput {
  vehicleId: string;
  description: string;
  cost?: number;
}

export async function listMaintenance(filters: MaintenanceFilters = {}): Promise<MaintenanceLog[]> {
  const { data } = await apiClient.get<MaintenanceLog[]>('/maintenance', { params: filters });
  return data;
}

export async function openMaintenance(input: CreateMaintenanceInput): Promise<MaintenanceLog> {
  const { data } = await apiClient.post<MaintenanceLog>('/maintenance', input);
  return data;
}

export async function closeMaintenance(id: string): Promise<MaintenanceLog> {
  const { data } = await apiClient.patch<MaintenanceLog>(`/maintenance/${id}/close`);
  return data;
}
