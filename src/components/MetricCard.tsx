import type { Metrica, Tendencia } from '../types';

interface MetricCardProps {
  metrica: Metrica;
  onIncrement?: () => void;
  onDecrement?: () => void;
}

const colorPorTendencia: Record<Tendencia, string> = {
  positiva: 'text-emerald-600',
  negativa: 'text-rose-600',
  neutra: 'text-slate-600',
};

export default function MetricCard({
  metrica,
  onIncrement,
  onDecrement,
}: MetricCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {metrica.titulo}
          </p>

          <h2 className="mt-3 text-3xl font-bold text-slate-800">
            {metrica.valor}
          </h2>
        </div>

        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-2xl">
          {metrica.icono}
        </span>
      </div>

      <p className={`mt-4 text-sm ${colorPorTendencia[metrica.tendencia]}`}>
        {metrica.descripcion}
      </p>

      {onIncrement && onDecrement && (
        <div className="mt-5 flex items-center gap-3">
          <button
            type="button"
            onClick={onDecrement}
            className="rounded-lg border border-slate-300 px-4 py-2 font-bold text-slate-700 hover:bg-slate-100"
            aria-label="Disminuir pacientes"
          >
            −
          </button>

          <span className="text-sm text-slate-500">
            Ajustar pacientes
          </span>

          <button
            type="button"
            onClick={onIncrement}
            className="rounded-lg bg-emerald-600 px-4 py-2 font-bold text-white hover:bg-emerald-700"
            aria-label="Aumentar pacientes"
          >
            +
          </button>
        </div>
      )}
    </article>
  );
}