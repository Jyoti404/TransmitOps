import { apiClient } from './client';

export type TripStatus = 'DRAFT' | 'DISPATCHED' | 'COMPLETED' | 'CANCELLED';

export interface Trip {
  id: string;
  source: string;
  destination: string;
  vehicleId: string;
  driverId: string;
  cargoWeightKg: string;
  plannedDistanceKm: string;
  actualDistanceKm: string | null;
  fuelConsumedLiters: string | null;
  revenue: string;
  status: TripStatus;
  dispatchedAt: string | null;
  completedAt: string | null;
  createdById: string;
  createdAt: string;
  vehicle?: { registrationNumber: string };
  driver?: { fullName: string };
}

export interface TripFilters {
  status?: TripStatus;
}

export interface CreateTripInput {
  source: string;
  destination: string;
  vehicleId: string;
  driverId: string;
  cargoWeightKg: number;
  plannedDistanceKm: number;
  revenue?: number;
}

export interface CompleteTripInput {
  actualDistanceKm: number;
  fuelConsumedLiters: number;
}

export async function listTrips(filters: TripFilters = {}): Promise<Trip[]> {
  const { data } = await apiClient.get<Trip[]>('/trips', { params: filters });
  return data;
}

export async function createTrip(input: CreateTripInput): Promise<Trip> {
  const { data } = await apiClient.post<Trip>('/trips', input);
  return data;
}

export async function dispatchTrip(id: string): Promise<Trip> {
  const { data } = await apiClient.post<Trip>(`/trips/${id}/dispatch`);
  return data;
}

export async function completeTrip(id: string, input: CompleteTripInput): Promise<Trip> {
  const { data } = await apiClient.post<Trip>(`/trips/${id}/complete`, input);
  return data;
}

export async function cancelTrip(id: string): Promise<Trip> {
  const { data } = await apiClient.post<Trip>(`/trips/${id}/cancel`);
  return data;
}
