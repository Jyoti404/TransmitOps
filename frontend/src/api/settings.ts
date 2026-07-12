import { apiClient } from './client';

export interface AppSettings {
  id: number;
  depotName: string;
  currency: string;
  distanceUnit: 'KM' | 'MILES';
  updatedAt: string;
}

export interface UpdateSettingsInput {
  depotName?: string;
  currency?: string;
  distanceUnit?: 'KM' | 'MILES';
}

export async function getSettings(): Promise<AppSettings> {
  const { data } = await apiClient.get<AppSettings>('/settings');
  return data;
}

export async function updateSettings(input: UpdateSettingsInput): Promise<AppSettings> {
  const { data } = await apiClient.put<AppSettings>('/settings', input);
  return data;
}
