import { apiClient } from './client';

export type DriverStatus = 'AVAILABLE' | 'ON_TRIP' | 'OFF_DUTY' | 'SUSPENDED';

export interface Driver {
  id: string;
  fullName: string;
  licenseNumber: string;
  licenseCategory: string;
  licenseExpiryDate: string;
  contactNumber: string | null;
  email: string | null;
  safetyScore: string;
  status: DriverStatus;
  version: number;
  createdAt: string;
}

export interface DriverFilters {
  status?: DriverStatus;
}

export interface CreateDriverInput {
  fullName: string;
  licenseNumber: string;
  licenseCategory: string;
  licenseExpiryDate: string;
  contactNumber?: string;
  email?: string;
}

export async function listDrivers(filters: DriverFilters = {}): Promise<Driver[]> {
  const { data } = await apiClient.get<Driver[]>('/drivers', { params: filters });
  return data;
}

export async function listAvailableDrivers(): Promise<Driver[]> {
  const { data } = await apiClient.get<Driver[]>('/drivers/available');
  return data;
}

export async function createDriver(input: CreateDriverInput): Promise<Driver> {
  const { data } = await apiClient.post<Driver>('/drivers', input);
  return data;
}

export async function suspendDriver(id: string, reason: string): Promise<Driver> {
  const { data } = await apiClient.patch<Driver>(`/drivers/${id}/suspend`, { reason });
  return data;
}
