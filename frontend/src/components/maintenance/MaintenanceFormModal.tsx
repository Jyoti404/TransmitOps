import { FormEvent, useState } from 'react';
import { Modal } from '../../atoms/Modal';
import { Label } from '../../atoms/Label';
import { Input } from '../../atoms/Input';
import { Select } from '../../atoms/Select';
import { Button } from '../../atoms/Button';
import { extractErrorMessage } from '../../api/client';
import { useOpenMaintenance } from '../../hooks/useMaintenance';
import { useAvailableVehicles } from '../../hooks/useVehicles';

interface MaintenanceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MaintenanceFormModal({ isOpen, onClose }: MaintenanceFormModalProps) {
  const openMaintenance = useOpenMaintenance();
  // Only AVAILABLE vehicles are eligible — the backend rejects anything else
  // (already IN_SHOP, ON_TRIP, or RETIRED), so the dropdown mirrors that.
  const { data: vehicles = [] } = useAvailableVehicles();

  const [form, setForm] = useState({ vehicleId: '', description: '', cost: '' });
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await openMaintenance.mutateAsync({
        vehicleId: form.vehicleId,
        description: form.description,
        cost: form.cost ? Number(form.cost) : undefined,
      });
      setForm({ vehicleId: '', description: '', cost: '' });
      onClose();
    } catch (err) {
      setError(extractErrorMessage(err));
    }
  }

  return (
    <Modal title="Log maintenance" isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <Label htmlFor="vehicleId">Vehicle</Label>
          <Select
            id="vehicleId"
            required
            value={form.vehicleId}
            onChange={(e) => setForm({ ...form, vehicleId: e.target.value })}
          >
            <option value="">{vehicles.length === 0 ? 'No available vehicles' : 'Select a vehicle'}</option>
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.registrationNumber} — {v.nameModel}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            required
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Oil change"
          />
        </div>
        <div>
          <Label htmlFor="cost">Estimated cost</Label>
          <Input
            id="cost"
            type="number"
            min="0"
            value={form.cost}
            onChange={(e) => setForm({ ...form, cost: e.target.value })}
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={openMaintenance.isPending}>
            {openMaintenance.isPending ? 'Logging…' : 'Log maintenance'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
