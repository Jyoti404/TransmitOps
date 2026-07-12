import { useState } from 'react';
import { Card } from '../atoms/Card';
import { Button } from '../atoms/Button';
import { Select } from '../atoms/Select';
import { DriverTable } from '../components/drivers/DriverTable';
import { DriverFormModal } from '../components/drivers/DriverFormModal';
import { SuspendDriverModal } from '../components/drivers/SuspendDriverModal';
import { useDrivers } from '../hooks/useDrivers';
import { Driver, DriverFilters, DriverStatus } from '../api/drivers';
import { useAuthStore } from '../store/authStore';

const STATUS_OPTIONS: DriverStatus[] = ['AVAILABLE', 'ON_TRIP', 'OFF_DUTY', 'SUSPENDED'];

export function Drivers() {
  const role = useAuthStore((s) => s.user?.role);
  const [filters, setFilters] = useState<DriverFilters>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [suspendTarget, setSuspendTarget] = useState<Driver | null>(null);

  const { data: drivers = [], isLoading } = useDrivers(filters);

  const canRegister = role === 'FLEET_MANAGER' || role === 'SAFETY_OFFICER';
  const canSuspend = role === 'SAFETY_OFFICER';

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-slate-900">Driver Management</h1>
        {canRegister && <Button onClick={() => setIsModalOpen(true)}>Register new</Button>}
      </div>

      <Card className="mb-4 flex flex-wrap gap-3 p-4">
        <div className="w-44">
          <Select
            value={filters.status ?? ''}
            onChange={(e) => setFilters({ ...filters, status: (e.target.value || undefined) as DriverStatus | undefined })}
          >
            <option value="">All statuses</option>
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status.replace('_', ' ')}
              </option>
            ))}
          </Select>
        </div>
      </Card>

      <Card className="overflow-x-auto p-2">
        <DriverTable
          drivers={drivers}
          isLoading={isLoading}
          canSuspend={canSuspend}
          onSuspend={setSuspendTarget}
        />
      </Card>

      <DriverFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <SuspendDriverModal driver={suspendTarget} onClose={() => setSuspendTarget(null)} />
    </div>
  );
}
