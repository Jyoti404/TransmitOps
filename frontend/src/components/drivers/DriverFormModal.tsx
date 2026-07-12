import { FormEvent, useState } from 'react';
import { Modal } from '../../atoms/Modal';
import { Label } from '../../atoms/Label';
import { Input } from '../../atoms/Input';
import { Button } from '../../atoms/Button';
import { extractErrorMessage } from '../../api/client';
import { useCreateDriver } from '../../hooks/useDrivers';

interface DriverFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DriverFormModal({ isOpen, onClose }: DriverFormModalProps) {
  const createDriver = useCreateDriver();
  const [form, setForm] = useState({
    fullName: '',
    licenseNumber: '',
    licenseCategory: 'LMV',
    licenseExpiryDate: '',
    contactNumber: '',
    email: '',
  });
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await createDriver.mutateAsync({
        fullName: form.fullName,
        licenseNumber: form.licenseNumber,
        licenseCategory: form.licenseCategory,
        licenseExpiryDate: form.licenseExpiryDate,
        contactNumber: form.contactNumber || undefined,
        email: form.email || undefined,
      });
      setForm({ fullName: '', licenseNumber: '', licenseCategory: 'LMV', licenseExpiryDate: '', contactNumber: '', email: '' });
      onClose();
    } catch (err) {
      setError(extractErrorMessage(err));
    }
  }

  return (
    <Modal title="Register driver" isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <Label htmlFor="fullName">Full name</Label>
          <Input
            id="fullName"
            required
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            placeholder="Alex Mendes"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="licenseNumber">License number</Label>
            <Input
              id="licenseNumber"
              required
              value={form.licenseNumber}
              onChange={(e) => setForm({ ...form, licenseNumber: e.target.value })}
              placeholder="DL-9988"
            />
          </div>
          <div>
            <Label htmlFor="licenseCategory">Category</Label>
            <Input
              id="licenseCategory"
              required
              value={form.licenseCategory}
              onChange={(e) => setForm({ ...form, licenseCategory: e.target.value })}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="licenseExpiryDate">License expiry date</Label>
          <Input
            id="licenseExpiryDate"
            type="date"
            required
            value={form.licenseExpiryDate}
            onChange={(e) => setForm({ ...form, licenseExpiryDate: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="contactNumber">Contact number</Label>
            <Input
              id="contactNumber"
              value={form.contactNumber}
              onChange={(e) => setForm({ ...form, contactNumber: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="For license expiry reminders"
            />
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={createDriver.isPending}>
            {createDriver.isPending ? 'Registering…' : 'Register driver'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
