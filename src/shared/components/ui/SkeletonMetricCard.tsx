
export default function SkeletonMetricCard() {
  return (
    <div
      role="status"
      aria-label="Cargando métrica"
      className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="mb-5 flex items-center justify-between">
        <div className="h-4 w-28 rounded bg-slate-200" />
        <div className="h-11 w-11 rounded-xl bg-slate-200" />
      </div>

      <div className="mb-3 h-9 w-20 rounded bg-slate-200" />

      <div className="h-4 w-40 max-w-full rounded bg-slate-200" />
    </div>
  );
}
