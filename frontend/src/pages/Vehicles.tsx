import { useState } from 'react';
import { Card } from '../atoms/Card';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { Select } from '../atoms/Select';
import { VehicleTable } from '../components/vehicles/VehicleTable';
import { VehicleFormModal } from '../components/vehicles/VehicleFormModal';
import { useVehicles } from '../hooks/useVehicles';
import { VehicleFilters, VehicleStatus } from '../api/vehicles';
import { useAuthStore } from '../store/authStore';

const STATUS_OPTIONS: VehicleStatus[] = ['AVAILABLE', 'ON_TRIP', 'IN_SHOP', 'RETIRED'];

export function Vehicles() {
  const role = useAuthStore((s) => s.user?.role);
  const [filters, setFilters] = useState<VehicleFilters>({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: vehicles = [], isLoading } = useVehicles(filters);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-slate-900">Vehicle Registry</h1>
        {role === 'FLEET_MANAGER' && <Button onClick={() => setIsModalOpen(true)}>Register new</Button>}
      </div>

      <Card className="mb-4 flex flex-wrap gap-3 p-4">
        <div className="w-40">
          <Input
            placeholder="Filter by type"
            value={filters.type ?? ''}
            onChange={(e) => setFilters({ ...filters, type: e.target.value || undefined })}
          />
        </div>
        <div className="w-44">
          <Select
            value={filters.status ?? ''}
            onChange={(e) => setFilters({ ...filters, status: (e.target.value || undefined) as VehicleStatus | undefined })}
          >
            <option value="">All statuses</option>
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status.replace('_', ' ')}
              </option>
            ))}
          </Select>
        </div>
        <div className="w-40">
          <Input
            placeholder="Filter by region"
            value={filters.region ?? ''}
            onChange={(e) => setFilters({ ...filters, region: e.target.value || undefined })}
          />
        </div>
      </Card>

      <Card className="overflow-x-auto p-2">
        <VehicleTable vehicles={vehicles} isLoading={isLoading} />
      </Card>

      <VehicleFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
