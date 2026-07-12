import { apiClient } from './client';

export type JobName = 'license-expiry-sweep' | 'kpi-snapshot';

export interface JobRunResult {
  job: string;
  ranAt: string;
  result: unknown;
}

export async function runJob(name: JobName): Promise<JobRunResult> {
  const { data } = await apiClient.post<JobRunResult>(`/internal/jobs/${name}/run`);
  return data;
}
