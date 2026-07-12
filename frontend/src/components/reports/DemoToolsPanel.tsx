import { useState } from 'react';
import { Card } from '../../atoms/Card';
import { Button } from '../../atoms/Button';
import { extractErrorMessage } from '../../api/client';
import { useRunJob } from '../../hooks/useJobs';
import { JobName } from '../../api/jobs';

const JOBS: { name: JobName; label: string }[] = [
  { name: 'license-expiry-sweep', label: 'Run license expiry sweep' },
  { name: 'kpi-snapshot', label: 'Run KPI snapshot' },
];

export function DemoToolsPanel() {
  const runJob = useRunJob();
  const [lastResult, setLastResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [runningJob, setRunningJob] = useState<JobName | null>(null);

  async function handleRun(name: JobName) {
    setError(null);
    setLastResult(null);
    setRunningJob(name);
    try {
      const res = await runJob.mutateAsync(name);
      setLastResult(`${res.job} ran at ${new Date(res.ranAt).toLocaleTimeString()} → ${JSON.stringify(res.result)}`);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setRunningJob(null);
    }
  }

  return (
    <Card className="p-4">
      <h2 className="mb-1 text-sm font-medium text-slate-700">Demo tools</h2>
      <p className="mb-3 text-xs text-slate-500">
        Fire a cron job on demand instead of waiting for its real schedule (06:00 / 00:00 daily).
      </p>
      <div className="flex flex-wrap gap-2">
        {JOBS.map((job) => (
          <Button
            key={job.name}
            variant="secondary"
            disabled={runningJob === job.name}
            onClick={() => handleRun(job.name)}
          >
            {runningJob === job.name ? 'Running…' : job.label}
          </Button>
        ))}
      </div>
      {lastResult && <p className="mt-3 text-xs text-emerald-700">{lastResult}</p>}
      {error && <p className="mt-3 text-xs text-red-600">{error}</p>}
    </Card>
  );
}
