
export default function SkeletonPacienteRow() {
  return (
    <div
      role="status"
      aria-label="Cargando paciente"
      className="animate-pulse rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
    >
      <div className="flex min-h-20 flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div className="w-full max-w-sm space-y-3">
          <div className="h-5 w-48 max-w-full rounded bg-gray-200" />

          <div className="h-4 w-64 max-w-full rounded bg-gray-200" />

          <div className="h-4 w-40 max-w-full rounded bg-gray-200" />
        </div>

        <div className="flex items-center gap-3">
          <div className="h-7 w-16 rounded-full bg-gray-200" />

          <div className="h-9 w-20 rounded-lg bg-gray-200" />
        </div>
      </div>
    </div>
  );
}
