import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { DashboardKpis } from '../../api/dashboard';

const COLORS = { Available: '#059669', 'On trip': '#2563eb', 'In maintenance': '#d97706' };

export function FleetStatusChart({ kpis }: { kpis: DashboardKpis }) {
  const onTripVehicles = Math.max(kpis.activeVehicles - kpis.availableVehicles - kpis.vehiclesInMaintenance, 0);

  const data = [
    { name: 'Available', count: kpis.availableVehicles },
    { name: 'On trip', count: onTripVehicles },
    { name: 'In maintenance', count: kpis.vehiclesInMaintenance },
  ];

  return (
    <div style={{ width: '100%', height: 220 }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
          <Tooltip />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {data.map((entry) => (
              <Cell key={entry.name} fill={COLORS[entry.name as keyof typeof COLORS]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
