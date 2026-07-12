import { FormEvent, useState } from 'react';
import { Modal } from '../../atoms/Modal';
import { Label } from '../../atoms/Label';
import { Input } from '../../atoms/Input';
import { Select } from '../../atoms/Select';
import { Button } from '../../atoms/Button';
import { extractErrorMessage } from '../../api/client';
import { useCreateFuelLog } from '../../hooks/useFuelExpense';
import { useVehicles } from '../../hooks/useVehicles';

interface FuelLogFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FuelLogFormModal({ isOpen, onClose }: FuelLogFormModalProps) {
  const createFuelLog = useCreateFuelLog();
  const { data: vehicles = [] } = useVehicles({});

  const [form, setForm] = useState({ vehicleId: '', liters: '', cost: '' });
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await createFuelLog.mutateAsync({
        vehicleId: form.vehicleId,
        liters: Number(form.liters),
        cost: Number(form.cost),
      });
      setForm({ vehicleId: '', liters: '', cost: '' });
      onClose();
    } catch (err) {
      setError(extractErrorMessage(err));
    }
  }

  return (
    <Modal title="Log fuel" isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <Label htmlFor="fl-vehicleId">Vehicle</Label>
          <Select
            id="fl-vehicleId"
            required
            value={form.vehicleId}
            onChange={(e) => setForm({ ...form, vehicleId: e.target.value })}
          >
            <option value="">Select a vehicle</option>
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.registrationNumber} — {v.nameModel}
              </option>
            ))}
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="liters">Liters</Label>
            <Input
              id="liters"
              type="number"
              min="0"
              step="0.1"
              required
              value={form.liters}
              onChange={(e) => setForm({ ...form, liters: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="fl-cost">Cost</Label>
            <Input
              id="fl-cost"
              type="number"
              min="0"
              required
              value={form.cost}
              onChange={(e) => setForm({ ...form, cost: e.target.value })}
            />
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={createFuelLog.isPending}>
            {createFuelLog.isPending ? 'Logging…' : 'Log fuel'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
