import { FuelLog } from '../../api/fuelExpense';
import { formatCurrency, formatDate } from '../../utils/format';

const COLUMNS = ['Vehicle', 'Liters', 'Cost', 'Date'];

export function FuelLogTable({ logs, isLoading }: { logs: FuelLog[]; isLoading: boolean }) {
  if (isLoading) return <p className="py-6 text-center text-sm text-slate-500">Loading fuel logs…</p>;
  if (logs.length === 0) return <p className="py-6 text-center text-sm text-slate-500">No fuel logs yet.</p>;

  return (
    <table className="min-w-full divide-y divide-slate-200 text-sm">
      <thead>
        <tr>
          {COLUMNS.map((col) => (
            <th key={col} className="px-3 py-2 text-left font-medium text-slate-500">
              {col}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {logs.map((log) => (
          <tr key={log.id}>
            <td className="whitespace-nowrap px-3 py-2 font-medium text-slate-900">
              {log.vehicle?.registrationNumber ?? log.vehicleId}
            </td>
            <td className="whitespace-nowrap px-3 py-2 text-slate-600">{Number(log.liters)}</td>
            <td className="whitespace-nowrap px-3 py-2 text-slate-600">{formatCurrency(log.cost)}</td>
            <td className="whitespace-nowrap px-3 py-2 text-slate-600">{formatDate(log.loggedDate)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
