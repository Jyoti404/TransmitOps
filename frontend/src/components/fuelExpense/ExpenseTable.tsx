import { Expense } from '../../api/fuelExpense';
import { formatCurrency, formatDate } from '../../utils/format';

const COLUMNS = ['Vehicle', 'Category', 'Amount', 'Date'];

export function ExpenseTable({ expenses, isLoading }: { expenses: Expense[]; isLoading: boolean }) {
  if (isLoading) return <p className="py-6 text-center text-sm text-slate-500">Loading expenses…</p>;
  if (expenses.length === 0) return <p className="py-6 text-center text-sm text-slate-500">No expenses yet.</p>;

  return (
    <table className="min-w-full divide-y divide-slate-200 text-sm">
      <thead>
        <tr>
          {COLUMNS.map((col) => (
            <th key={col} className="px-3 py-2 text-left font-medium text-slate-500">
              {col}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {expenses.map((expense) => (
          <tr key={expense.id}>
            <td className="whitespace-nowrap px-3 py-2 font-medium text-slate-900">
              {expense.vehicle?.registrationNumber ?? expense.vehicleId ?? '—'}
            </td>
            <td className="whitespace-nowrap px-3 py-2 text-slate-600">{expense.category}</td>
            <td className="whitespace-nowrap px-3 py-2 text-slate-600">{formatCurrency(expense.amount)}</td>
            <td className="whitespace-nowrap px-3 py-2 text-slate-600">{formatDate(expense.expenseDate)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
