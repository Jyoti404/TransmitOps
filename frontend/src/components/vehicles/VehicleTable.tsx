import { Vehicle } from '../../api/vehicles';
import { Badge } from '../../atoms/Badge';
import { VEHICLE_STATUS_TONE } from '../../utils/statusTone';
import { formatCurrency } from '../../utils/format';

interface VehicleTableProps {
  vehicles: Vehicle[];
  isLoading: boolean;
}

const COLUMNS = ['Registration', 'Model', 'Type', 'Capacity (kg)', 'Odometer (km)', 'Acquisition cost', 'Region', 'Status'];

export function VehicleTable({ vehicles, isLoading }: VehicleTableProps) {
  if (isLoading) {
    return <p className="py-8 text-center text-sm text-slate-500">Loading vehicles…</p>;
  }

  if (vehicles.length === 0) {
    return <p className="py-8 text-center text-sm text-slate-500">No vehicles match these filters.</p>;
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
        {vehicles.map((vehicle) => (
          <tr key={vehicle.id}>
            <td className="whitespace-nowrap px-3 py-2 font-medium text-slate-900">{vehicle.registrationNumber}</td>
            <td className="whitespace-nowrap px-3 py-2 text-slate-600">{vehicle.nameModel}</td>
            <td className="whitespace-nowrap px-3 py-2 text-slate-600">{vehicle.type}</td>
            <td className="whitespace-nowrap px-3 py-2 text-slate-600">{Number(vehicle.maxLoadCapacityKg)}</td>
            <td className="whitespace-nowrap px-3 py-2 text-slate-600">{Number(vehicle.odometerKm)}</td>
            <td className="whitespace-nowrap px-3 py-2 text-slate-600">{formatCurrency(vehicle.acquisitionCost)}</td>
            <td className="whitespace-nowrap px-3 py-2 text-slate-600">{vehicle.region ?? '—'}</td>
            <td className="whitespace-nowrap px-3 py-2">
              <Badge tone={VEHICLE_STATUS_TONE[vehicle.status]}>{vehicle.status.replace('_', ' ')}</Badge>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
