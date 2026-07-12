import { Card } from '../../atoms/Card';
import { Badge } from '../../atoms/Badge';
import { Trip } from '../../api/trips';
import { useTrips } from '../../hooks/useTrips';
import { TRIP_STATUS_TONE } from '../../utils/statusTone';
import { relativeTimeFromNow } from '../../utils/format';

const MAX_ENTRIES = 6;

const STATUS_PRIORITY: Record<Trip['status'], number> = { DISPATCHED: 0, DRAFT: 1, COMPLETED: 2, CANCELLED: 3 };

function noteFor(trip: Trip): string {
  switch (trip.status) {
    case 'DRAFT':
      return 'Awaiting dispatch';
    case 'DISPATCHED':
      return trip.dispatchedAt ? `Dispatched ${relativeTimeFromNow(trip.dispatchedAt)}` : 'Dispatched';
    case 'COMPLETED':
      return trip.completedAt ? `Completed ${relativeTimeFromNow(trip.completedAt)}` : 'Completed';
    case 'CANCELLED':
      return 'Cancelled';
  }
}

export function LiveBoard() {
  const { data: trips = [], isLoading } = useTrips({});

  const entries = [...trips]
    .sort((a, b) => {
      const priorityDiff = STATUS_PRIORITY[a.status] - STATUS_PRIORITY[b.status];
      if (priorityDiff !== 0) return priorityDiff;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    })
    .slice(0, MAX_ENTRIES);

  return (
    <Card className="p-4">
      <h2 className="mb-3 text-sm font-medium text-slate-700">Live board</h2>

      {isLoading ? (
        <p className="text-sm text-slate-500">Loading…</p>
      ) : entries.length === 0 ? (
        <p className="text-sm text-slate-500">No trips yet.</p>
      ) : (
        <ul className="divide-y divide-slate-100">
          {entries.map((trip) => (
            <li key={trip.id} className="py-3 first:pt-0 last:pb-0">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-slate-900">
                  {trip.source} → {trip.destination}
                </p>
                <Badge tone={TRIP_STATUS_TONE[trip.status]}>{trip.status}</Badge>
              </div>
              <p className="mt-0.5 text-xs text-slate-500">
                {trip.vehicle?.registrationNumber ?? trip.vehicleId} / {trip.driver?.fullName ?? trip.driverId}
              </p>
              <p className="mt-0.5 text-xs text-slate-400">{noteFor(trip)}</p>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
