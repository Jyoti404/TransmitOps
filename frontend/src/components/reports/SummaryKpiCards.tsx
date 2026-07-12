import { KpiCard } from '../dashboard/KpiCard';
import { useDashboardKpis } from '../../hooks/useDashboard';
import { useCostReport, useFuelEfficiencyReport, useRoiReport } from '../../hooks/useReports';
import { formatCurrency } from '../../utils/format';

function average(values: number[]): number | null {
  if (values.length === 0) return null;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

export function SummaryKpiCards() {
  const { data: kpis } = useDashboardKpis({});
  const { data: fuelEfficiency = [] } = useFuelEfficiencyReport();
  const { data: cost = [] } = useCostReport();
  const { data: roi = [] } = useRoiReport();

  const avgEfficiency = average(
    fuelEfficiency.map((r) => r.efficiencyKmPerLiter).filter((v): v is number => v !== null),
  );
  const totalOperationalCost = cost.reduce((sum, r) => sum + r.totalOperationalCost, 0);
  const avgRoi = average(roi.map((r) => r.roi).filter((v): v is number => v !== null));

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      <KpiCard label="Fuel efficiency" value={avgEfficiency !== null ? `${avgEfficiency.toFixed(1)} km/L` : '—'} />
      <KpiCard label="Fleet utilization" value={kpis ? `${kpis.fleetUtilizationPct}%` : '—'} />
      <KpiCard label="Operational cost" value={formatCurrency(totalOperationalCost)} />
      <KpiCard label="Vehicle ROI" value={avgRoi !== null ? `${(avgRoi * 100).toFixed(1)}%` : '—'} />
    </div>
  );
}
