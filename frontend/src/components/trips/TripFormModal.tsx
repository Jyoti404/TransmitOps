import { FormEvent, useState } from 'react';
import { Modal } from '../../atoms/Modal';
import { Label } from '../../atoms/Label';
import { Input } from '../../atoms/Input';
import { Select } from '../../atoms/Select';
import { Button } from '../../atoms/Button';
import { LocationAutocomplete } from '../common/LocationAutocomplete';
import { extractErrorMessage } from '../../api/client';
import { useCreateTrip } from '../../hooks/useTrips';
import { useAvailableVehicles } from '../../hooks/useVehicles';
import { useAvailableDrivers } from '../../hooks/useDrivers';

interface TripFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TripFormModal({ isOpen, onClose }: TripFormModalProps) {
  const createTrip = useCreateTrip();
  const { data: vehicles = [] } = useAvailableVehicles();
  const { data: drivers = [] } = useAvailableDrivers();

  const [form, setForm] = useState({
    source: '',
    destination: '',
    vehicleId: '',
    driverId: '',
    cargoWeightKg: '',
    plannedDistanceKm: '',
    revenue: '',
  });
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await createTrip.mutateAsync({
        source: form.source,
        destination: form.destination,
        vehicleId: form.vehicleId,
        driverId: form.driverId,
        cargoWeightKg: Number(form.cargoWeightKg),
        plannedDistanceKm: Number(form.plannedDistanceKm),
        revenue: form.revenue ? Number(form.revenue) : undefined,
      });
      setForm({ source: '', destination: '', vehicleId: '', driverId: '', cargoWeightKg: '', plannedDistanceKm: '', revenue: '' });
      onClose();
    } catch (err) {
      setError(extractErrorMessage(err));
    }
  }

  return (
    <Modal title="New trip" isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="source">Source</Label>
            <LocationAutocomplete
              id="source"
              required
              value={form.source}
              onChange={(value) => setForm({ ...form, source: value })}
              placeholder="Start typing an address…"
            />
          </div>
          <div>
            <Label htmlFor="destination">Destination</Label>
            <LocationAutocomplete
              id="destination"
              required
              value={form.destination}
              onChange={(value) => setForm({ ...form, destination: value })}
              placeholder="Start typing an address…"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="vehicleId">Vehicle</Label>
          <Select
            id="vehicleId"
            required
            value={form.vehicleId}
            onChange={(e) => setForm({ ...form, vehicleId: e.target.value })}
          >
            <option value="">
              {vehicles.length === 0 ? 'No available vehicles' : 'Select a vehicle'}
            </option>
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.registrationNumber} — {v.nameModel} (max {Number(v.maxLoadCapacityKg)}kg)
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label htmlFor="driverId">Driver</Label>
          <Select
            id="driverId"
            required
            value={form.driverId}
            onChange={(e) => setForm({ ...form, driverId: e.target.value })}
          >
            <option value="">{drivers.length === 0 ? 'No available drivers' : 'Select a driver'}</option>
            {drivers.map((d) => (
              <option key={d.id} value={d.id}>
                {d.fullName} — {d.licenseNumber}
              </option>
            ))}
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="cargoWeightKg">Cargo weight (kg)</Label>
            <Input
              id="cargoWeightKg"
              type="number"
              min="0"
              required
              value={form.cargoWeightKg}
              onChange={(e) => setForm({ ...form, cargoWeightKg: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="plannedDistanceKm">Planned distance (km)</Label>
            <Input
              id="plannedDistanceKm"
              type="number"
              min="0"
              required
              value={form.plannedDistanceKm}
              onChange={(e) => setForm({ ...form, plannedDistanceKm: e.target.value })}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="revenue">Revenue (optional, for ROI reporting)</Label>
          <Input
            id="revenue"
            type="number"
            min="0"
            value={form.revenue}
            onChange={(e) => setForm({ ...form, revenue: e.target.value })}
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={createTrip.isPending}>
            {createTrip.isPending ? 'Saving…' : 'Save as draft'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
