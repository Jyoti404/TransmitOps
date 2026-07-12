import { FormEvent, useEffect, useState } from 'react';
import { Card } from '../atoms/Card';
import { Label } from '../atoms/Label';
import { Input } from '../atoms/Input';
import { Select } from '../atoms/Select';
import { Button } from '../atoms/Button';
import { RbacMatrix } from '../components/settings/RbacMatrix';
import { useSettings, useUpdateSettings } from '../hooks/useSettings';
import { extractErrorMessage } from '../api/client';
import { useAuthStore } from '../store/authStore';

export function Settings() {
  const role = useAuthStore((s) => s.user?.role);
  const canEdit = role === 'FLEET_MANAGER';

  const { data: settings, isLoading } = useSettings();
  const updateSettings = useUpdateSettings();

  const [form, setForm] = useState({ depotName: '', currency: '', distanceUnit: 'KM' as 'KM' | 'MILES' });
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (settings) {
      setForm({ depotName: settings.depotName, currency: settings.currency, distanceUnit: settings.distanceUnit });
    }
  }, [settings]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSaved(false);
    try {
      await updateSettings.mutateAsync(form);
      setSaved(true);
    } catch (err) {
      setError(extractErrorMessage(err));
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold text-slate-900">Settings</h1>

      <Card className="max-w-md p-4">
        <h2 className="mb-3 text-sm font-medium text-slate-700">General</h2>
        {isLoading ? (
          <p className="text-sm text-slate-500">Loading…</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <Label htmlFor="depotName">Depot name</Label>
              <Input
                id="depotName"
                disabled={!canEdit}
                value={form.depotName}
                onChange={(e) => setForm({ ...form, depotName: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="currency">Currency</Label>
              <Input
                id="currency"
                disabled={!canEdit}
                value={form.currency}
                onChange={(e) => setForm({ ...form, currency: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="distanceUnit">Distance unit</Label>
              <Select
                id="distanceUnit"
                disabled={!canEdit}
                value={form.distanceUnit}
                onChange={(e) => setForm({ ...form, distanceUnit: e.target.value as 'KM' | 'MILES' })}
              >
                <option value="KM">Kilometers</option>
                <option value="MILES">Miles</option>
              </Select>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}
            {saved && <p className="text-sm text-emerald-700">Saved.</p>}

            {canEdit ? (
              <Button type="submit" disabled={updateSettings.isPending}>
                {updateSettings.isPending ? 'Saving…' : 'Save changes'}
              </Button>
            ) : (
              <p className="text-xs text-slate-400">Only a Fleet Manager can change these settings.</p>
            )}
          </form>
        )}
      </Card>

      <RbacMatrix />
    </div>
  );
}
