import { useState } from 'react';
import { Card } from '../atoms/Card';
import { Button } from '../atoms/Button';
import { FuelLogTable } from '../components/fuelExpense/FuelLogTable';
import { ExpenseTable } from '../components/fuelExpense/ExpenseTable';
import { FuelLogFormModal } from '../components/fuelExpense/FuelLogFormModal';
import { ExpenseFormModal } from '../components/fuelExpense/ExpenseFormModal';
import { useFuelLogs, useExpenses } from '../hooks/useFuelExpense';
import { useAuthStore } from '../store/authStore';

export function FuelExpenses() {
  const role = useAuthStore((s) => s.user?.role);
  const canLogFuel = role === 'DRIVER' || role === 'FLEET_MANAGER';
  const canLogExpense = role === 'FLEET_MANAGER' || role === 'FINANCIAL_ANALYST';

  const [isFuelFormOpen, setIsFuelFormOpen] = useState(false);
  const [isExpenseFormOpen, setIsExpenseFormOpen] = useState(false);

  const { data: fuelLogs = [], isLoading: isFuelLoading } = useFuelLogs({});
  const { data: expenses = [], isLoading: isExpenseLoading } = useExpenses({});

  return (
    <div className="space-y-8">
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-slate-900">Fuel Logs</h1>
          {canLogFuel && <Button onClick={() => setIsFuelFormOpen(true)}>Log fuel</Button>}
        </div>
        <Card className="overflow-x-auto p-2">
          <FuelLogTable logs={fuelLogs} isLoading={isFuelLoading} />
        </Card>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-slate-900">Expenses</h1>
          {canLogExpense && <Button onClick={() => setIsExpenseFormOpen(true)}>Log expense</Button>}
        </div>
        <Card className="overflow-x-auto p-2">
          <ExpenseTable expenses={expenses} isLoading={isExpenseLoading} />
        </Card>
      </div>

      <FuelLogFormModal isOpen={isFuelFormOpen} onClose={() => setIsFuelFormOpen(false)} />
      <ExpenseFormModal isOpen={isExpenseFormOpen} onClose={() => setIsExpenseFormOpen(false)} />
    </div>
  );
}
