import { apiClient } from './client';

export type VehicleStatus = 'AVAILABLE' | 'ON_TRIP' | 'IN_SHOP' | 'RETIRED';

export interface Vehicle {
  id: string;
  registrationNumber: string;
  nameModel: string;
  type: string;
  maxLoadCapacityKg: string;
  odometerKm: string;
  acquisitionCost: string;
  region: string | null;
  status: VehicleStatus;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface VehicleFilters {
  type?: string;
  status?: VehicleStatus;
  region?: string;
}

export interface CreateVehicleInput {
  registrationNumber: string;
  nameModel: string;
  type: string;
  maxLoadCapacityKg: number;
  acquisitionCost: number;
  region?: string;
}

export interface UpdateVehicleInput {
  status?: VehicleStatus;
  odometerKm?: number;
}

export async function listVehicles(filters: VehicleFilters = {}): Promise<Vehicle[]> {
  const { data } = await apiClient.get<Vehicle[]>('/vehicles', { params: filters });
  return data;
}

export async function listAvailableVehicles(): Promise<Vehicle[]> {
  const { data } = await apiClient.get<Vehicle[]>('/vehicles/available');
  return data;
}

export async function createVehicle(input: CreateVehicleInput): Promise<Vehicle> {
  const { data } = await apiClient.post<Vehicle>('/vehicles', input);
  return data;
}

export async function updateVehicle(id: string, input: UpdateVehicleInput): Promise<Vehicle> {
  const { data } = await apiClient.put<Vehicle>(`/vehicles/${id}`, input);
  return data;
}

export interface VehicleCostSummary {
  vehicleId: string;
  registrationNumber: string;
  totalFuelCost: number;
  totalMaintenanceCost: number;
  totalExpenseCost: number;
  totalOperationalCost: number;
}

export async function getVehicleCostSummary(id: string): Promise<VehicleCostSummary> {
  const { data } = await apiClient.get<VehicleCostSummary>(`/vehicles/${id}/cost-summary`);
  return data;
}
