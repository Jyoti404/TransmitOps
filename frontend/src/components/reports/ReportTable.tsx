export interface ReportColumn<T> {
  key: keyof T;
  label: string;
  format?: (value: T[keyof T], row: T) => string;
}

interface ReportTableProps<T> {
  columns: ReportColumn<T>[];
  rows: T[];
  isLoading: boolean;
  emptyMessage?: string;
}

export function ReportTable<T extends { vehicleId?: string; date?: string }>({
  columns,
  rows,
  isLoading,
  emptyMessage = 'No data yet.',
}: ReportTableProps<T>) {
  if (isLoading) {
    return <p className="py-8 text-center text-sm text-slate-500">Loading report…</p>;
  }

  if (rows.length === 0) {
    return <p className="py-8 text-center text-sm text-slate-500">{emptyMessage}</p>;
  }

  return (
    <table className="min-w-full divide-y divide-slate-200 text-sm">
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={String(col.key)} className="px-3 py-2 text-left font-medium text-slate-500">
              {col.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {rows.map((row, i) => (
          <tr key={row.vehicleId ?? row.date ?? i}>
            {columns.map((col) => (
              <td key={String(col.key)} className="whitespace-nowrap px-3 py-2 text-slate-700">
                {col.format ? col.format(row[col.key], row) : String(row[col.key] ?? '—')}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
