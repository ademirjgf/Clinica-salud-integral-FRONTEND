
export default function SkeletonCitaRow() {
  return (
    <div
      role="status"
      aria-label="Cargando cita"
      className="flex min-h-20 animate-pulse flex-wrap items-center justify-between gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
    >
      <div className="w-full max-w-xs space-y-2">
        <div className="h-5 w-44 max-w-full rounded bg-gray-200" />

        <div className="h-4 w-36 max-w-full rounded bg-gray-200" />

        <div className="h-3 w-28 max-w-full rounded bg-gray-200" />
      </div>

      <div className="h-6 w-24 rounded-full bg-gray-200" />
    </div>
  );
}
