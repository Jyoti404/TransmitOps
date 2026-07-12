import { MaintenanceLog } from '../../api/maintenance';
import { Badge } from '../../atoms/Badge';
import { Button } from '../../atoms/Button';
import { formatCurrency, formatDate } from '../../utils/format';

interface MaintenanceTableProps {
  logs: MaintenanceLog[];
  isLoading: boolean;
  canClose: boolean;
  onClose: (log: MaintenanceLog) => void;
  pendingId: string | null;
}

const COLUMNS = ['Vehicle', 'Description', 'Cost', 'Opened', 'Closed', 'Status', ''];

// Display-only relabeling to match the mockup's wording; the underlying
// OPEN/CLOSED enum (and everything that depends on it) is unchanged.
const STATUS_LABEL: Record<MaintenanceLog['status'], string> = {
  OPEN: 'In Shop',
  CLOSED: 'Completed',
};

export function MaintenanceTable({ logs, isLoading, canClose, onClose, pendingId }: MaintenanceTableProps) {
  if (isLoading) {
    return <p className="py-8 text-center text-sm text-slate-500">Loading maintenance logs…</p>;
  }

  if (logs.length === 0) {
    return <p className="py-8 text-center text-sm text-slate-500">No maintenance logs match these filters.</p>;
  }

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
            <td className="whitespace-nowrap px-3 py-2 text-slate-600">{log.description}</td>
            <td className="whitespace-nowrap px-3 py-2 text-slate-600">{formatCurrency(log.cost)}</td>
            <td className="whitespace-nowrap px-3 py-2 text-slate-600">{formatDate(log.openedAt)}</td>
            <td className="whitespace-nowrap px-3 py-2 text-slate-600">{log.closedAt ? formatDate(log.closedAt) : '—'}</td>
            <td className="whitespace-nowrap px-3 py-2">
              <Badge tone={log.status === 'OPEN' ? 'amber' : 'gray'}>{STATUS_LABEL[log.status]}</Badge>
            </td>
            <td className="whitespace-nowrap px-3 py-2">
              {canClose && log.status === 'OPEN' && (
                <Button className="px-2 py-1 text-xs" disabled={pendingId === log.id} onClick={() => onClose(log)}>
                  Close
                </Button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
