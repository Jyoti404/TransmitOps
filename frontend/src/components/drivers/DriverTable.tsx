import clsx from 'clsx';
import { Driver } from '../../api/drivers';
import { Badge } from '../../atoms/Badge';
import { Button } from '../../atoms/Button';
import { DRIVER_STATUS_TONE } from '../../utils/statusTone';
import { daysUntil, formatDate } from '../../utils/format';

interface DriverTableProps {
  drivers: Driver[];
  isLoading: boolean;
  canSuspend: boolean;
  onSuspend: (driver: Driver) => void;
}

const COLUMNS = ['Name', 'License #', 'Category', 'License expiry', 'Safety score', 'Status', ''];

export function DriverTable({ drivers, isLoading, canSuspend, onSuspend }: DriverTableProps) {
  if (isLoading) {
    return <p className="py-8 text-center text-sm text-slate-500">Loading drivers…</p>;
  }

  if (drivers.length === 0) {
    return <p className="py-8 text-center text-sm text-slate-500">No drivers match these filters.</p>;
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
        {drivers.map((driver) => {
          const remainingDays = daysUntil(driver.licenseExpiryDate);
          const isExpiringSoon = remainingDays <= 7;

          return (
            <tr key={driver.id}>
              <td className="whitespace-nowrap px-3 py-2 font-medium text-slate-900">{driver.fullName}</td>
              <td className="whitespace-nowrap px-3 py-2 text-slate-600">{driver.licenseNumber}</td>
              <td className="whitespace-nowrap px-3 py-2 text-slate-600">{driver.licenseCategory}</td>
              <td
                className={clsx(
                  'whitespace-nowrap px-3 py-2 font-medium',
                  isExpiringSoon ? 'text-red-600' : 'text-slate-600',
                )}
                title={isExpiringSoon ? `Expires in ${remainingDays} day(s)` : undefined}
              >
                {formatDate(driver.licenseExpiryDate)}
                {isExpiringSoon && ' ⚠'}
              </td>
              <td className="whitespace-nowrap px-3 py-2 text-slate-600">{Number(driver.safetyScore)}</td>
              <td className="whitespace-nowrap px-3 py-2">
                <Badge tone={DRIVER_STATUS_TONE[driver.status]}>{driver.status.replace('_', ' ')}</Badge>
              </td>
              <td className="whitespace-nowrap px-3 py-2">
                {canSuspend && driver.status !== 'SUSPENDED' && (
                  <Button variant="danger" className="px-2 py-1 text-xs" onClick={() => onSuspend(driver)}>
                    Suspend
                  </Button>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
