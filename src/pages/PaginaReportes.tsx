
import { useCallback, useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { api } from "../lib/axios";
import { useApi } from "../hooks/useApi";

import type { CitaAPI } from "../types/citaApi";

interface ReporteEspecialidad {
  especialidad: string;
  total: number;
}

interface CitasPorDia {
  fecha: string;
  total: number;
}

function obtenerFechaLocal(fecha: Date): string {
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const dia = String(fecha.getDate()).padStart(2, "0");

  return `${anio}-${mes}-${dia}`;
}

function obtenerUltimosSieteDias(
  citas: CitaAPI[]
): CitasPorDia[] {
  const hoy = new Date();

  const dias: CitasPorDia[] = [];

  for (let i = 6; i >= 0; i--) {
    const fecha = new Date(hoy);
    fecha.setHours(12, 0, 0, 0);
    fecha.setDate(hoy.getDate() - i);

    const clave = obtenerFechaLocal(fecha);

    const total = citas.filter((cita) => {
      const fechaCita = new Date(cita.fechaHora);

      return (
        !Number.isNaN(fechaCita.getTime()) &&
        obtenerFechaLocal(fechaCita) === clave
      );
    }).length;

    dias.push({
      fecha: clave,
      total,
    });
  }

  return dias;
}

function SkeletonGrafica() {
  return (
    <div
      role="status"
      aria-label="Cargando gráfica"
      className="h-[300px] animate-pulse rounded-xl bg-slate-100"
    />
  );
}

export default function PaginaReportes() {
  const consultarEspecialidades = useCallback(
    async (
      signal: AbortSignal
    ): Promise<ReporteEspecialidad[]> => {
      const respuesta = await api.get<
        ReporteEspecialidad[]
      >("/reportes/especialidades", { signal });

      return respuesta.data;
    },
    []
  );

  const consultarCitas = useCallback(
    async (signal: AbortSignal): Promise<CitaAPI[]> => {
      const respuesta = await api.get<CitaAPI[]>(
        "/citas",
        { signal }
      );

      return respuesta.data;
    },
    []
  );

  const {
    data: especialidades,
    cargando: cargandoEspecialidades,
    error: errorEspecialidades,
    recargar: recargarEspecialidades,
  } = useApi<ReporteEspecialidad[]>(
    consultarEspecialidades
  );

  const {
    data: citas,
    cargando: cargandoCitas,
    error: errorCitas,
    recargar: recargarCitas,
  } = useApi<CitaAPI[]>(consultarCitas);

  const citasPorDia = useMemo(
    () => obtenerUltimosSieteDias(citas ?? []),
    [citas]
  );

  const hayCitasRecientes = citasPorDia.some(
    (dia) => dia.total > 0
  );

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8">
          <p className="text-sm font-semibold text-blue-700">
            Clínica Salud Integral
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Reportes de la clínica
          </h1>

          <p className="mt-2 text-slate-600">
            Estadísticas obtenidas de la API.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          {/* Gráfica de barras */}
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              Citas por especialidad
            </h2>

            <p className="mb-6 mt-1 text-sm text-slate-500">
              Distribución de citas entre especialidades médicas.
            </p>

            {cargandoEspecialidades ? (
              <SkeletonGrafica />
            ) : errorEspecialidades ? (
              <div role="alert" className="space-y-3">
                <p className="text-red-600">
                  {errorEspecialidades}
                </p>

                <button
                  type="button"
                  onClick={recargarEspecialidades}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-white"
                >
                  Reintentar
                </button>
              </div>
            ) : !especialidades?.length ? (
              <p className="rounded-lg bg-slate-50 p-8 text-center text-slate-500">
                No hay datos de especialidades para mostrar.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={especialidades}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="especialidad"
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar
                    dataKey="total"
                    name="Citas"
                    fill="#4f46e5"
                    radius={[5, 5, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </section>

          {/* Gráfica de líneas */}
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              Citas de los últimos 7 días
            </h2>

            <p className="mb-6 mt-1 text-sm text-slate-500">
              Cantidad de citas programadas por fecha.
            </p>

            {cargandoCitas ? (
              <SkeletonGrafica />
            ) : errorCitas ? (
              <div role="alert" className="space-y-3">
                <p className="text-red-600">{errorCitas}</p>

                <button
                  type="button"
                  onClick={recargarCitas}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-white"
                >
                  Reintentar
                </button>
              </div>
            ) : !hayCitasRecientes ? (
              <p className="rounded-lg bg-slate-50 p-8 text-center text-slate-500">
                No se registran citas para los últimos 7 días.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={citasPorDia}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="fecha"
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="total"
                    name="Citas"
                    stroke="#0d9488"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
