import { useState } from 'react';
import { Card } from '../atoms/Card';
import { Button } from '../atoms/Button';
import { Select } from '../atoms/Select';
import { TripTable } from '../components/trips/TripTable';
import { TripFormModal } from '../components/trips/TripFormModal';
import { CompleteTripModal } from '../components/trips/CompleteTripModal';
import { LiveBoard } from '../components/trips/LiveBoard';
import { useCancelTrip, useDispatchTrip, useTrips } from '../hooks/useTrips';
import { Trip, TripFilters, TripStatus } from '../api/trips';
import { extractErrorMessage } from '../api/client';
import { useAuthStore } from '../store/authStore';

const STATUS_OPTIONS: TripStatus[] = ['DRAFT', 'DISPATCHED', 'COMPLETED', 'CANCELLED'];

export function Trips() {
  const role = useAuthStore((s) => s.user?.role);
  const canManageLifecycle = role === 'DRIVER'; // create/dispatch/complete are Driver-only per backend RBAC
  const canCancel = role === 'DRIVER' || role === 'FLEET_MANAGER';

  const [filters, setFilters] = useState<TripFilters>({});
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [completeTarget, setCompleteTarget] = useState<Trip | null>(null);
  const [rowError, setRowError] = useState<{ tripId: string; message: string } | null>(null);
  const [pendingTripId, setPendingTripId] = useState<string | null>(null);

  const { data: trips = [], isLoading } = useTrips(filters);
  const dispatchTrip = useDispatchTrip();
  const cancelTrip = useCancelTrip();

  async function handleDispatch(trip: Trip) {
    setRowError(null);
    setPendingTripId(trip.id);
    try {
      await dispatchTrip.mutateAsync(trip.id);
    } catch (err) {
      // Surface the exact rules-engine rejection (e.g. cargo over capacity,
      // expired license, suspended driver) rather than a generic failure.
      setRowError({ tripId: trip.id, message: extractErrorMessage(err) });
    } finally {
      setPendingTripId(null);
    }
  }

  async function handleCancel(trip: Trip) {
    setRowError(null);
    setPendingTripId(trip.id);
    try {
      await cancelTrip.mutateAsync(trip.id);
    } catch (err) {
      setRowError({ tripId: trip.id, message: extractErrorMessage(err) });
    } finally {
      setPendingTripId(null);
    }
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-slate-900">Trips</h1>
        {canManageLifecycle && <Button onClick={() => setIsFormOpen(true)}>New trip</Button>}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="mb-4 flex flex-wrap gap-3 p-4">
            <div className="w-44">
              <Select
                value={filters.status ?? ''}
                onChange={(e) =>
                  setFilters({ ...filters, status: (e.target.value || undefined) as TripStatus | undefined })
                }
              >
                <option value="">All statuses</option>
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </Select>
            </div>
          </Card>

          <Card className="overflow-x-auto p-2">
            <TripTable
              trips={trips}
              isLoading={isLoading}
              canManageLifecycle={canManageLifecycle}
              canCancel={canCancel}
              onDispatch={handleDispatch}
              onComplete={setCompleteTarget}
              onCancel={handleCancel}
              rowError={rowError}
              pendingTripId={pendingTripId}
            />
          </Card>
        </div>

        <div className="lg:col-span-1">
          <LiveBoard />
        </div>
      </div>

      <TripFormModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
      <CompleteTripModal trip={completeTarget} onClose={() => setCompleteTarget(null)} />
    </div>
  );
}
