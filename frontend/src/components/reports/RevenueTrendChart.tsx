import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card } from '../../atoms/Card';
import { useMonthlyRevenueReport } from '../../hooks/useReports';

export function RevenueTrendChart() {
  const { data = [], isLoading } = useMonthlyRevenueReport(6);

  return (
    <Card className="p-4">
      <h2 className="mb-2 text-sm font-medium text-slate-700">Monthly revenue</h2>
      {isLoading ? (
        <p className="py-8 text-center text-sm text-slate-500">Loading…</p>
      ) : data.length === 0 ? (
        <p className="py-8 text-center text-sm text-slate-500">No completed trips with revenue yet.</p>
      ) : (
        <div style={{ width: '100%', height: 220 }}>
          <ResponsiveContainer>
            <BarChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="revenue" fill="#3b5fe0" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}
