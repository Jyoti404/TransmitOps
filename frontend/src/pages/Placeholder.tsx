export function Placeholder({ title }: { title: string }) {
  return (
    <div>
      <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
      <p className="mt-1 text-sm text-slate-500">Coming up in a later build step.</p>
    </div>
  );
}
