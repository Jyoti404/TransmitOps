import { useState } from 'react';
import { Card } from '../atoms/Card';
import { Button } from '../atoms/Button';
import { Select } from '../atoms/Select';
import { MaintenanceTable } from '../components/maintenance/MaintenanceTable';
import { MaintenanceFormModal } from '../components/maintenance/MaintenanceFormModal';
import { useCloseMaintenance, useMaintenanceLogs } from '../hooks/useMaintenance';
import { MaintenanceFilters, MaintenanceLog, MaintenanceStatus } from '../api/maintenance';
import { extractErrorMessage } from '../api/client';
import { useAuthStore } from '../store/authStore';

const STATUS_OPTIONS: MaintenanceStatus[] = ['OPEN', 'CLOSED'];

export function Maintenance() {
  const role = useAuthStore((s) => s.user?.role);
  const canManage = role === 'FLEET_MANAGER';

  const [filters, setFilters] = useState<MaintenanceFilters>({});
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const { data: logs = [], isLoading } = useMaintenanceLogs(filters);
  const closeMaintenance = useCloseMaintenance();

  async function handleClose(log: MaintenanceLog) {
    setError(null);
    setPendingId(log.id);
    try {
      await closeMaintenance.mutateAsync(log.id);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setPendingId(null);
    }
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-slate-900">Maintenance</h1>
        {canManage && <Button onClick={() => setIsFormOpen(true)}>Log maintenance</Button>}
      </div>

      <Card className="mb-4 flex flex-wrap gap-3 p-4">
        <div className="w-44">
          <Select
            value={filters.status ?? ''}
            onChange={(e) =>
              setFilters({ ...filters, status: (e.target.value || undefined) as MaintenanceStatus | undefined })
            }
          >
            <option value="">All statuses</option>
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </Select>
        </div>
      </Card>

      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

      <Card className="overflow-x-auto p-2">
        <MaintenanceTable logs={logs} isLoading={isLoading} canClose={canManage} onClose={handleClose} pendingId={pendingId} />
      </Card>

      <MaintenanceFormModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </div>
  );
}
