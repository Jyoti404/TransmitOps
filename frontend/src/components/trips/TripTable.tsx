import { Trip } from '../../api/trips';
import { Badge } from '../../atoms/Badge';
import { Button } from '../../atoms/Button';
import { TRIP_STATUS_TONE } from '../../utils/statusTone';

interface RowError {
  tripId: string;
  message: string;
}

interface TripTableProps {
  trips: Trip[];
  isLoading: boolean;
  canManageLifecycle: boolean; // Dispatch/Complete are Driver-only per backend RBAC
  canCancel: boolean; // Cancel is Driver + Fleet Manager per backend RBAC
  onDispatch: (trip: Trip) => void;
  onComplete: (trip: Trip) => void;
  onCancel: (trip: Trip) => void;
  rowError: RowError | null;
  pendingTripId: string | null;
}

const COLUMNS = ['Route', 'Vehicle', 'Driver', 'Cargo (kg)', 'Status', 'Actions'];

export function TripTable({
  trips,
  isLoading,
  canManageLifecycle,
  canCancel,
  onDispatch,
  onComplete,
  onCancel,
  rowError,
  pendingTripId,
}: TripTableProps) {
  if (isLoading) {
    return <p className="py-8 text-center text-sm text-slate-500">Loading trips…</p>;
  }

  if (trips.length === 0) {
    return <p className="py-8 text-center text-sm text-slate-500">No trips match these filters.</p>;
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
        {trips.map((trip) => {
          const isPending = pendingTripId === trip.id;
          const showDispatch = canManageLifecycle && trip.status === 'DRAFT';
          const showComplete = canManageLifecycle && trip.status === 'DISPATCHED';
          const showCancel = canCancel && (trip.status === 'DRAFT' || trip.status === 'DISPATCHED');

          return (
            <tr key={trip.id}>
              <td className="px-3 py-2 text-slate-900">
                <div className="font-medium">
                  {trip.source} → {trip.destination}
                </div>
                <div className="text-xs text-slate-500">Planned {Number(trip.plannedDistanceKm)} km</div>
              </td>
              <td className="whitespace-nowrap px-3 py-2 text-slate-600">{trip.vehicle?.registrationNumber ?? trip.vehicleId}</td>
              <td className="whitespace-nowrap px-3 py-2 text-slate-600">{trip.driver?.fullName ?? trip.driverId}</td>
              <td className="whitespace-nowrap px-3 py-2 text-slate-600">{Number(trip.cargoWeightKg)}</td>
              <td className="whitespace-nowrap px-3 py-2">
                <Badge tone={TRIP_STATUS_TONE[trip.status]}>{trip.status}</Badge>
              </td>
              <td className="whitespace-nowrap px-3 py-2">
                <div className="flex gap-2">
                  {showDispatch && (
                    <Button className="px-2 py-1 text-xs" disabled={isPending} onClick={() => onDispatch(trip)}>
                      Dispatch
                    </Button>
                  )}
                  {showComplete && (
                    <Button className="px-2 py-1 text-xs" disabled={isPending} onClick={() => onComplete(trip)}>
                      Complete
                    </Button>
                  )}
                  {showCancel && (
                    <Button
                      variant="danger"
                      className="px-2 py-1 text-xs"
                      disabled={isPending}
                      onClick={() => onCancel(trip)}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
                {rowError?.tripId === trip.id && (
                  <p className="mt-1 max-w-xs text-xs font-medium text-red-600">{rowError.message}</p>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
