import { FormEvent, useState } from 'react';
import { Modal } from '../../atoms/Modal';
import { Label } from '../../atoms/Label';
import { Input } from '../../atoms/Input';
import { Button } from '../../atoms/Button';
import { extractErrorMessage } from '../../api/client';
import { useSuspendDriver } from '../../hooks/useDrivers';
import { Driver } from '../../api/drivers';

interface SuspendDriverModalProps {
  driver: Driver | null;
  onClose: () => void;
}

export function SuspendDriverModal({ driver, onClose }: SuspendDriverModalProps) {
  const suspendDriver = useSuspendDriver();
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!driver) return;
    setError(null);
    try {
      await suspendDriver.mutateAsync({ id: driver.id, reason });
      setReason('');
      onClose();
    } catch (err) {
      setError(extractErrorMessage(err));
    }
  }

  return (
    <Modal title={`Suspend ${driver?.fullName ?? ''}`} isOpen={driver !== null} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <Label htmlFor="reason">Reason</Label>
          <Input
            id="reason"
            required
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Harsh braking incident reported by client"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="danger" disabled={suspendDriver.isPending}>
            {suspendDriver.isPending ? 'Suspending…' : 'Suspend driver'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
