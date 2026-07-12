import { apiClient } from './client';

export interface LocationSuggestion {
  label: string;
  lat: number;
  lon: number;
}

export async function searchLocations(query: string): Promise<LocationSuggestion[]> {
  const { data } = await apiClient.get<LocationSuggestion[]>('/geocode/search', { params: { q: query } });
  return data;
}
