import { FormEvent, useState } from 'react';
import { Modal } from '../../atoms/Modal';
import { Label } from '../../atoms/Label';
import { Input } from '../../atoms/Input';
import { Button } from '../../atoms/Button';
import { extractErrorMessage } from '../../api/client';
import { useCompleteTrip } from '../../hooks/useTrips';
import { Trip } from '../../api/trips';

interface CompleteTripModalProps {
  trip: Trip | null;
  onClose: () => void;
}

export function CompleteTripModal({ trip, onClose }: CompleteTripModalProps) {
  const completeTrip = useCompleteTrip();
  const [actualDistanceKm, setActualDistanceKm] = useState('');
  const [fuelConsumedLiters, setFuelConsumedLiters] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!trip) return;
    setError(null);
    try {
      await completeTrip.mutateAsync({
        id: trip.id,
        input: { actualDistanceKm: Number(actualDistanceKm), fuelConsumedLiters: Number(fuelConsumedLiters) },
      });
      setActualDistanceKm('');
      setFuelConsumedLiters('');
      onClose();
    } catch (err) {
      setError(extractErrorMessage(err));
    }
  }

  return (
    <Modal title={`Complete trip: ${trip?.source} → ${trip?.destination}`} isOpen={trip !== null} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <Label htmlFor="actualDistanceKm">Final odometer distance (km)</Label>
          <Input
            id="actualDistanceKm"
            type="number"
            min="0"
            required
            value={actualDistanceKm}
            onChange={(e) => setActualDistanceKm(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="fuelConsumedLiters">Fuel consumed (liters)</Label>
          <Input
            id="fuelConsumedLiters"
            type="number"
            min="0"
            step="0.1"
            required
            value={fuelConsumedLiters}
            onChange={(e) => setFuelConsumedLiters(e.target.value)}
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={completeTrip.isPending}>
            {completeTrip.isPending ? 'Completing…' : 'Complete trip'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
