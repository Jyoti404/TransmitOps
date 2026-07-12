import cron from 'node-cron';
import { runLicenseExpirySweep } from '../modules/notification/licenseExpirySweep';
import { runKpiSnapshotJob } from './kpiSnapshotJob';

// Keyed registry so the demo debug route can fire any job on demand instead
// of waiting for its real cron time — see /api/internal/jobs/:name/run.
export const jobRegistry: Record<string, () => Promise<unknown>> = {
  'license-expiry-sweep': runLicenseExpirySweep,
  'kpi-snapshot': runKpiSnapshotJob,
};

export function registerCronJobs() {
  cron.schedule('0 6 * * *', () => {
    runLicenseExpirySweep().catch((err) => console.error('[CRON] license-expiry-sweep failed', err));
  });

  cron.schedule('0 0 * * *', () => {
    runKpiSnapshotJob().catch((err) => console.error('[CRON] kpi-snapshot failed', err));
  });

  console.log(`[CRON] registered ${Object.keys(jobRegistry).length} jobs: ${Object.keys(jobRegistry).join(', ')}`);
}
