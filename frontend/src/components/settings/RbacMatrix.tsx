import { Card } from '../../atoms/Card';

type AccessLevel = '✓' | 'view' | '—';

interface RbacRow {
  role: string;
  fleet: AccessLevel;
  drivers: AccessLevel;
  trips: AccessLevel;
  fuelExp: AccessLevel;
  analytics: AccessLevel;
}

const RBAC_ROWS: RbacRow[] = [
  { role: 'Fleet Manager', fleet: '✓', drivers: '✓', trips: 'view', fuelExp: '✓', analytics: 'view' },
  { role: 'Driver (Dispatcher)', fleet: 'view', drivers: 'view', trips: '✓', fuelExp: '✓', analytics: '—' },
  { role: 'Safety Officer', fleet: 'view', drivers: '✓', trips: 'view', fuelExp: '—', analytics: 'view' },
  { role: 'Financial Analyst', fleet: 'view', drivers: 'view', trips: '—', fuelExp: '✓', analytics: '✓' },
];

const TONE: Record<AccessLevel, string> = {
  '✓': 'text-emerald-700 font-semibold',
  view: 'text-slate-500',
  '—': 'text-slate-300',
};

export function RbacMatrix() {
  return (
    <Card className="p-4">
      <h2 className="mb-1 text-sm font-medium text-slate-700">Role-based access (RBAC)</h2>
      <p className="mb-3 text-xs text-slate-500">
        ✓ = create/edit, view = read-only, — = no access. Fleet Manager can also cancel trips (not just view); Financial
        Analyst is the only role that can export reports as CSV. See the full permission checklist in the UAT guide for
        exact per-action rules.
      </p>
      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200">
            <th className="px-2 py-2 text-left font-medium text-slate-500">Role</th>
            <th className="px-2 py-2 text-left font-medium text-slate-500">Fleet</th>
            <th className="px-2 py-2 text-left font-medium text-slate-500">Drivers</th>
            <th className="px-2 py-2 text-left font-medium text-slate-500">Trips</th>
            <th className="px-2 py-2 text-left font-medium text-slate-500">Fuel/Exp.</th>
            <th className="px-2 py-2 text-left font-medium text-slate-500">Analytics</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {RBAC_ROWS.map((row) => (
            <tr key={row.role}>
              <td className="px-2 py-2 font-medium text-slate-900">{row.role}</td>
              <td className={`px-2 py-2 ${TONE[row.fleet]}`}>{row.fleet}</td>
              <td className={`px-2 py-2 ${TONE[row.drivers]}`}>{row.drivers}</td>
              <td className={`px-2 py-2 ${TONE[row.trips]}`}>{row.trips}</td>
              <td className={`px-2 py-2 ${TONE[row.fuelExp]}`}>{row.fuelExp}</td>
              <td className={`px-2 py-2 ${TONE[row.analytics]}`}>{row.analytics}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
