import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card } from '../../atoms/Card';
import { useCostReport } from '../../hooks/useReports';

const COLORS = ['#dc2626', '#d97706', '#2563eb', '#059669', '#7c3aed'];

export function TopCostliestVehiclesChart() {
  const { data = [], isLoading } = useCostReport();

  // Derived client-side from the same cost report the table below already
  // fetched — no separate backend endpoint needed for a top-N ranking.
  const top = [...data].sort((a, b) => b.totalOperationalCost - a.totalOperationalCost).slice(0, 5);

  return (
    <Card className="p-4">
      <h2 className="mb-2 text-sm font-medium text-slate-700">Top costliest vehicles</h2>
      {isLoading ? (
        <p className="py-8 text-center text-sm text-slate-500">Loading…</p>
      ) : top.length === 0 ? (
        <p className="py-8 text-center text-sm text-slate-500">No cost data yet.</p>
      ) : (
        <div style={{ width: '100%', height: 220 }}>
          <ResponsiveContainer>
            <BarChart data={top} layout="vertical" margin={{ top: 8, right: 16, bottom: 0, left: 8 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis type="category" dataKey="registrationNumber" tick={{ fontSize: 12 }} width={90} />
              <Tooltip />
              <Bar dataKey="totalOperationalCost" radius={[0, 4, 4, 0]}>
                {top.map((row, i) => (
                  <Cell key={row.vehicleId} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}
