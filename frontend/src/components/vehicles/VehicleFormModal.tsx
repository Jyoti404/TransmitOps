import { FormEvent, useState } from 'react';
import { Modal } from '../../atoms/Modal';
import { Label } from '../../atoms/Label';
import { Input } from '../../atoms/Input';
import { Button } from '../../atoms/Button';
import { extractErrorMessage } from '../../api/client';
import { useCreateVehicle } from '../../hooks/useVehicles';

interface VehicleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VehicleFormModal({ isOpen, onClose }: VehicleFormModalProps) {
  const createVehicle = useCreateVehicle();
  const [form, setForm] = useState({
    registrationNumber: '',
    nameModel: '',
    type: 'VAN',
    maxLoadCapacityKg: '',
    acquisitionCost: '',
    region: '',
  });
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await createVehicle.mutateAsync({
        registrationNumber: form.registrationNumber,
        nameModel: form.nameModel,
        type: form.type,
        maxLoadCapacityKg: Number(form.maxLoadCapacityKg),
        acquisitionCost: Number(form.acquisitionCost),
        region: form.region || undefined,
      });
      setForm({ registrationNumber: '', nameModel: '', type: 'VAN', maxLoadCapacityKg: '', acquisitionCost: '', region: '' });
      onClose();
    } catch (err) {
      setError(extractErrorMessage(err));
    }
  }

  return (
    <Modal title="Register vehicle" isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <Label htmlFor="registrationNumber">Registration number</Label>
          <Input
            id="registrationNumber"
            required
            value={form.registrationNumber}
            onChange={(e) => setForm({ ...form, registrationNumber: e.target.value })}
            placeholder="MH-12-AB-1234"
          />
        </div>
        <div>
          <Label htmlFor="nameModel">Model</Label>
          <Input
            id="nameModel"
            required
            value={form.nameModel}
            onChange={(e) => setForm({ ...form, nameModel: e.target.value })}
            placeholder="Tata Ace"
          />
        </div>
        <div>
          <Label htmlFor="type">Type</Label>
          <Input
            id="type"
            required
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            placeholder="VAN"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="maxLoadCapacityKg">Max capacity (kg)</Label>
            <Input
              id="maxLoadCapacityKg"
              type="number"
              min="0"
              required
              value={form.maxLoadCapacityKg}
              onChange={(e) => setForm({ ...form, maxLoadCapacityKg: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="acquisitionCost">Acquisition cost</Label>
            <Input
              id="acquisitionCost"
              type="number"
              min="0"
              required
              value={form.acquisitionCost}
              onChange={(e) => setForm({ ...form, acquisitionCost: e.target.value })}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="region">Region</Label>
          <Input
            id="region"
            value={form.region}
            onChange={(e) => setForm({ ...form, region: e.target.value })}
            placeholder="Mumbai"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={createVehicle.isPending}>
            {createVehicle.isPending ? 'Registering…' : 'Register vehicle'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
