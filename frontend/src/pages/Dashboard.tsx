import { useState } from 'react';
import { Card } from '../atoms/Card';
import { Input } from '../atoms/Input';
import { Select } from '../atoms/Select';
import { KpiCard } from '../components/dashboard/KpiCard';
import { FleetStatusChart } from '../components/dashboard/FleetStatusChart';
import { useDashboardKpis } from '../hooks/useDashboard';
import { DashboardFilters } from '../api/dashboard';
import { VehicleStatus } from '../api/vehicles';

const STATUS_OPTIONS: VehicleStatus[] = ['AVAILABLE', 'ON_TRIP', 'IN_SHOP', 'RETIRED'];

export function Dashboard() {
  const [filters, setFilters] = useState<DashboardFilters>({});
  const { data: kpis, isLoading } = useDashboardKpis(filters);

  return (
    <div>
      <h1 className="mb-4 text-lg font-semibold text-slate-900">Dashboard</h1>

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

      {isLoading || !kpis ? (
        <p className="py-8 text-center text-sm text-slate-500">Loading KPIs…</p>
      ) : (
        <>
          <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            <KpiCard label="Active vehicles" value={kpis.activeVehicles} hint="Excludes retired" />
            <KpiCard label="Available vehicles" value={kpis.availableVehicles} />
            <KpiCard label="In maintenance" value={kpis.vehiclesInMaintenance} />
            <KpiCard label="Active trips" value={kpis.activeTrips} hint="Dispatched" />
            <KpiCard label="Pending trips" value={kpis.pendingTrips} hint="Draft" />
            <KpiCard label="Drivers on duty" value={kpis.driversOnDuty} />
            <KpiCard label="Fleet utilization" value={`${kpis.fleetUtilizationPct}%`} />
          </div>

          <Card className="p-4">
            <h2 className="mb-2 text-sm font-medium text-slate-700">Fleet status breakdown</h2>
            <FleetStatusChart kpis={kpis} />
          </Card>
        </>
      )}
    </div>
  );
}
