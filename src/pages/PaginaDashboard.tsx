import { useState } from 'react';
import MetricCard from '../components/MetricCard';
import StatusBadge from '../components/StatusBadge';
import type { Metrica } from '../types';

export default function PaginaDashboard() {
  const [pacientes, setPacientes] = useState(128);
  const [mantenimiento, setMantenimiento] = useState(false);

  const incrementarPacientes = () => {
    setPacientes((prev) => prev + 1);
  };

  const disminuirPacientes = () => {
    setPacientes((prev) => Math.max(0, prev - 1));
  };

  const metricas: Metrica[] = [
    {
      id: 'pacientes',
      titulo: 'Pacientes',
      valor: pacientes,
      descripcion: 'Pacientes registrados',
      tendencia: 'positiva',
      icono: '👥',
    },
    {
      id: 'citas',
      titulo: 'Citas Hoy',
      valor: 24,
      descripcion: 'Citas programadas para hoy',
      tendencia: 'neutra',
      icono: '📅',
    },
    {
      id: 'consultas',
      titulo: 'Consultas Pendientes',
      valor: 8,
      descripcion: 'Consultas por atender',
      tendencia: 'negativa',
      icono: '🩺',
    },
    {
      id: 'disponibilidad',
      titulo: 'Disponibilidad',
      valor: '92%',
      descripcion: 'Disponibilidad de atención',
      tendencia: 'positiva',
      icono: '💚',
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50">
      {mantenimiento && (
        <div
          role="alert"
          className="bg-rose-600 px-4 py-3 text-center font-medium text-white"
        >
          ⚠️ El sistema está en modo mantenimiento.
          Algunas funciones podrían no estar disponibles.
        </div>
      )}

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600">
              Clínica Salud Integral
            </p>

            <h1 className="mt-2 text-3xl font-bold text-slate-800">
              Dashboard
            </h1>

            <p className="mt-1 text-slate-500">
              Resumen general de la clínica
            </p>
          </div>

          <StatusBadge activo={!mantenimiento} />
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Métricas generales
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Indicadores principales de la clínica
            </p>
          </div>

          <button
            type="button"
            onClick={() => setMantenimiento((prev) => !prev)}
            className={`rounded-xl px-5 py-3 font-semibold text-white transition ${
              mantenimiento
                ? 'bg-emerald-600 hover:bg-emerald-700'
                : 'bg-rose-600 hover:bg-rose-700'
            }`}
          >
            {mantenimiento
              ? 'Desactivar mantenimiento'
              : 'Activar mantenimiento'}
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {metricas.map((metrica) => (
            <MetricCard
              key={metrica.id}
              metrica={metrica}
              onIncrement={
                metrica.id === 'pacientes'
                  ? incrementarPacientes
                  : undefined
              }
              onDecrement={
                metrica.id === 'pacientes'
                  ? disminuirPacientes
                  : undefined
              }
            />
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-bold text-slate-800">
            Estado de la plataforma
          </h2>

          <p className="mt-2 text-sm text-slate-600">
            {mantenimiento
              ? 'El mantenimiento está activado. Puedes desactivarlo con el botón superior.'
              : 'Todos los indicadores están disponibles. El sistema funciona con normalidad.'}
          </p>
        </div>
      </section>

      <footer className="px-6 py-6 text-center text-sm text-slate-500">
        Clínica Salud Integral · Panel de administración
      </footer>
    </main>
  );
}