import { useState } from 'react';
import { Card } from '../atoms/Card';
import { Button } from '../atoms/Button';
import { ReportTable, ReportColumn } from '../components/reports/ReportTable';
import { DemoToolsPanel } from '../components/reports/DemoToolsPanel';
import { SummaryKpiCards } from '../components/reports/SummaryKpiCards';
import { RevenueTrendChart } from '../components/reports/RevenueTrendChart';
import { TopCostliestVehiclesChart } from '../components/reports/TopCostliestVehiclesChart';
import {
  useCostReport,
  useFuelEfficiencyReport,
  useRoiReport,
  useUtilizationReport,
} from '../hooks/useReports';
import { downloadReportCsv, ReportName } from '../api/reports';
import { formatCurrency } from '../utils/format';
import { useAuthStore } from '../store/authStore';
import { extractErrorMessage } from '../api/client';

const TABS: { key: ReportName; label: string }[] = [
  { key: 'fuel-efficiency', label: 'Fuel efficiency' },
  { key: 'utilization', label: 'Utilization' },
  { key: 'cost', label: 'Cost' },
  { key: 'roi', label: 'ROI' },
];

export function Reports() {
  const role = useAuthStore((s) => s.user?.role);
  const canExport = role === 'FINANCIAL_ANALYST';
  const canRunJobs = role === 'FLEET_MANAGER';

  const [activeTab, setActiveTab] = useState<ReportName>('fuel-efficiency');
  const [exportError, setExportError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const fuelEfficiency = useFuelEfficiencyReport();
  const utilization = useUtilizationReport(30);
  const cost = useCostReport();
  const roi = useRoiReport();

  async function handleExport() {
    setExportError(null);
    setIsExporting(true);
    try {
      await downloadReportCsv(activeTab);
    } catch (err) {
      setExportError(extractErrorMessage(err));
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-slate-900">Reports</h1>
        {canExport && (
          <Button variant="secondary" onClick={handleExport} disabled={isExporting}>
            {isExporting ? 'Exporting…' : 'Export CSV'}
          </Button>
        )}
      </div>
      {exportError && <p className="text-sm text-red-600">{exportError}</p>}

      <SummaryKpiCards />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <RevenueTrendChart />
        <TopCostliestVehiclesChart />
      </div>

      <div className="flex gap-1 border-b border-slate-200">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={
              activeTab === tab.key
                ? 'border-b-2 border-brand-600 px-3 py-2 text-sm font-medium text-brand-700'
                : 'border-b-2 border-transparent px-3 py-2 text-sm font-medium text-slate-500 hover:text-slate-700'
            }
          >
            {tab.label}
          </button>
        ))}
      </div>

      <Card className="overflow-x-auto p-2">
        {activeTab === 'fuel-efficiency' && (
          <ReportTable
            rows={fuelEfficiency.data ?? []}
            isLoading={fuelEfficiency.isLoading}
            columns={FUEL_EFFICIENCY_COLUMNS}
          />
        )}
        {activeTab === 'utilization' && (
          <ReportTable rows={utilization.data ?? []} isLoading={utilization.isLoading} columns={UTILIZATION_COLUMNS} />
        )}
        {activeTab === 'cost' && <ReportTable rows={cost.data ?? []} isLoading={cost.isLoading} columns={COST_COLUMNS} />}
        {activeTab === 'roi' && <ReportTable rows={roi.data ?? []} isLoading={roi.isLoading} columns={ROI_COLUMNS} />}
      </Card>

      {canRunJobs && <DemoToolsPanel />}
    </div>
  );
}

const FUEL_EFFICIENCY_COLUMNS: ReportColumn<NonNullable<ReturnType<typeof useFuelEfficiencyReport>['data']>[number]>[] = [
  { key: 'registrationNumber', label: 'Vehicle' },
  { key: 'totalDistanceKm', label: 'Distance (km)' },
  { key: 'totalFuelLiters', label: 'Fuel (L)' },
  { key: 'efficiencyKmPerLiter', label: 'km/L', format: (v) => (v === null ? '—' : String(v)) },
];

const UTILIZATION_COLUMNS: ReportColumn<NonNullable<ReturnType<typeof useUtilizationReport>['data']>[number]>[] = [
  { key: 'date', label: 'Date' },
  { key: 'activeVehicles', label: 'Active vehicles' },
  { key: 'availableVehicles', label: 'Available' },
  { key: 'inShopVehicles', label: 'In shop' },
  { key: 'utilizationPct', label: 'Utilization %', format: (v) => `${v}%` },
];

const COST_COLUMNS: ReportColumn<NonNullable<ReturnType<typeof useCostReport>['data']>[number]>[] = [
  { key: 'registrationNumber', label: 'Vehicle' },
  { key: 'totalFuelCost', label: 'Fuel cost', format: (v) => formatCurrency(v as number) },
  { key: 'totalMaintenanceCost', label: 'Maintenance cost', format: (v) => formatCurrency(v as number) },
  { key: 'totalExpenseCost', label: 'Expense cost', format: (v) => formatCurrency(v as number) },
  { key: 'totalOperationalCost', label: 'Total operational cost', format: (v) => formatCurrency(v as number) },
];

const ROI_COLUMNS: ReportColumn<NonNullable<ReturnType<typeof useRoiReport>['data']>[number]>[] = [
  { key: 'registrationNumber', label: 'Vehicle' },
  { key: 'revenue', label: 'Revenue', format: (v) => formatCurrency(v as number) },
  { key: 'maintenanceCost', label: 'Maintenance', format: (v) => formatCurrency(v as number) },
  { key: 'fuelCost', label: 'Fuel', format: (v) => formatCurrency(v as number) },
  { key: 'acquisitionCost', label: 'Acquisition cost', format: (v) => formatCurrency(v as number) },
  { key: 'roi', label: 'ROI', format: (v) => (v === null ? '—' : (v as number).toFixed(4)) },
];
