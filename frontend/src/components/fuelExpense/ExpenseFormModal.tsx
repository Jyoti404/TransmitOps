import { FormEvent, useState } from 'react';
import { Modal } from '../../atoms/Modal';
import { Label } from '../../atoms/Label';
import { Input } from '../../atoms/Input';
import { Select } from '../../atoms/Select';
import { Button } from '../../atoms/Button';
import { extractErrorMessage } from '../../api/client';
import { useCreateExpense } from '../../hooks/useFuelExpense';
import { useVehicles } from '../../hooks/useVehicles';

interface ExpenseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES = ['TOLL', 'PARKING', 'FINE', 'OTHER'];

export function ExpenseFormModal({ isOpen, onClose }: ExpenseFormModalProps) {
  const createExpense = useCreateExpense();
  const { data: vehicles = [] } = useVehicles({});

  const [form, setForm] = useState({ vehicleId: '', category: 'TOLL', amount: '' });
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await createExpense.mutateAsync({
        vehicleId: form.vehicleId || undefined,
        category: form.category,
        amount: Number(form.amount),
      });
      setForm({ vehicleId: '', category: 'TOLL', amount: '' });
      onClose();
    } catch (err) {
      setError(extractErrorMessage(err));
    }
  }

  return (
    <Modal title="Log expense" isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <Label htmlFor="exp-vehicleId">Vehicle (optional)</Label>
          <Select
            id="exp-vehicleId"
            value={form.vehicleId}
            onChange={(e) => setForm({ ...form, vehicleId: e.target.value })}
          >
            <option value="">Not vehicle-specific</option>
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.registrationNumber} — {v.nameModel}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <Select id="category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            type="number"
            min="0"
            required
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={createExpense.isPending}>
            {createExpense.isPending ? 'Logging…' : 'Log expense'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
