
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { api } from "../lib/axios";
import { extraerMensajeError } from "../lib/errorHandler";

import MetricCard from "../components/MetricCard";
import StatusBadge from "../components/StatusBadge";
import AlertaBanner from "../shared/components/ui/AlertaBanner";
import SkeletonMetricCard from "../shared/components/ui/SkeletonMetricCard";

import { usePacientesStore } from "../stores/pacientesStore";
import { useCitasStore } from "../stores/citasStore";

import type { Metrica } from "../types";

interface MedicoAPI {
  id: number;
}

function esHoy(fechaISO: string): boolean {
  const fecha = new Date(fechaISO);
  const hoy = new Date();

  return (
    !Number.isNaN(fecha.getTime()) &&
    fecha.getFullYear() === hoy.getFullYear() &&
    fecha.getMonth() === hoy.getMonth() &&
    fecha.getDate() === hoy.getDate()
  );
}

export default function PaginaDashboard() {
  const [mantenimiento, setMantenimiento] = useState(false);
  const [totalMedicos, setTotalMedicos] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  // Datos y acciones reales de Zustand
  const pacientes = usePacientesStore((state) => state.pacientes);
  const paginacion = usePacientesStore((state) => state.paginacion);
  const cargarPacientes = usePacientesStore((state) => state.cargar);

  const citas = useCitasStore((state) => state.citas);
  const cargarCitas = useCitasStore((state) => state.cargarTodas);

  // useCallback evita recrear esta función en cada render
  const cargarDatos = useCallback(async () => {
    setCargando(true);
    setError("");

    try {
      const [respuestaMedicos] = await Promise.all([
        api.get<MedicoAPI[]>("/medicos"),
        cargarPacientes(),
        cargarCitas(),
      ]);

      setTotalMedicos(respuestaMedicos.data.length);
    } catch (err: unknown) {
      setError(extraerMensajeError(err));
    } finally {
      setCargando(false);
    }
  }, [cargarPacientes, cargarCitas]);

  useEffect(() => {
    void cargarDatos();
  }, [cargarDatos]);

  // useMemo: métricas derivadas de los datos reales
  const resumen = useMemo(() => {
    const totalPacientes = paginacion?.total ?? pacientes.length;

    const citasHoy = citas.filter(
      (cita) =>
        cita.estado === "PROGRAMADA" &&
        esHoy(cita.fechaHora)
    ).length;

    const consultasPendientes = citas.filter(
      (cita) => cita.estado === "PROGRAMADA"
    ).length;

    const citasCompletadas = citas.filter(
      (cita) => cita.estado === "COMPLETADA"
    ).length;

    const porcentajeCompletadas =
      citas.length > 0
        ? Math.round((citasCompletadas / citas.length) * 100)
        : 0;

    return {
      totalPacientes,
      citasHoy,
      consultasPendientes,
      citasCompletadas,
      porcentajeCompletadas,
    };
  }, [pacientes, paginacion, citas]);

  // Las MetricCard también se memoizan
  const metricas = useMemo<Metrica[]>(
    () => [
      {
        id: "pacientes",
        titulo: "Pacientes",
        valor: resumen.totalPacientes,
        descripcion: "Pacientes registrados",
        tendencia: "positiva",
        icono: "👥",
      },
      {
        id: "citas",
        titulo: "Citas Hoy",
        valor: resumen.citasHoy,
        descripcion: "Citas programadas para hoy",
        tendencia: "neutra",
        icono: "📅",
      },
      {
        id: "consultas",
        titulo: "Consultas Pendientes",
        valor: resumen.consultasPendientes,
        descripcion: "Citas pendientes de atención",
        tendencia: "negativa",
        icono: "🩺",
      },
      {
        id: "medicos",
        titulo: "Médicos",
        valor: totalMedicos,
        descripcion: "Médicos registrados",
        tendencia: "positiva",
        icono: "👨‍⚕️",
      },
      {
        id: "completadas",
        titulo: "Citas Completadas",
        valor: resumen.citasCompletadas,
        descripcion: "Total de citas completadas",
        tendencia: "positiva",
        icono: "✅",
      },
      {
        id: "porcentaje",
        titulo: "Porcentaje Completadas",
        valor: `${resumen.porcentajeCompletadas}%`,
        descripcion: "Porcentaje de citas completadas",
        tendencia: "positiva",
        icono: "📊",
      },
    ],
    [resumen, totalMedicos]
  );

  return (
    <main className="min-h-screen bg-slate-50">
      {mantenimiento && (
        <div
          role="alert"
          className="bg-rose-600 px-4 py-3 text-center font-medium text-white"
        >
          El sistema está en modo mantenimiento.
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
              Dashboard Analítico
            </h1>

            <p className="mt-1 text-slate-500">
              Indicadores generales de la clínica
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/pacientes"
              className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Ver Pacientes
            </Link>

            <Link
              to="/reportes"
              className="rounded-xl border border-blue-200 px-5 py-3 text-sm font-semibold text-blue-700 hover:bg-blue-50"
            >
              Ver reportes
            </Link>

            <StatusBadge activo={!mantenimiento} />
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Métricas generales
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Datos obtenidos del servidor y cálculos memoizados
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => void cargarDatos()}
              disabled={cargando}
              className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {cargando ? "Actualizando..." : "Actualizar datos"}
            </button>

            <button
              type="button"
              onClick={() => setMantenimiento((prev) => !prev)}
              className={`rounded-xl px-5 py-3 font-semibold text-white ${
                mantenimiento
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-rose-600 hover:bg-rose-700"
              }`}
            >
              {mantenimiento
                ? "Desactivar mantenimiento"
                : "Activar mantenimiento"}
            </button>
          </div>
        </div>

        {cargando && (
          <div
            role="status"
            aria-label="Cargando métricas"
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"
          >
            {Array.from({ length: 6 }, (_, index) => (
              <SkeletonMetricCard key={index} />
            ))}
          </div>
        )}

        {!cargando && error && (
          <AlertaBanner
            tipo="error"
            mensaje={error}
            onReintentar={() => void cargarDatos()}
          />
        )}

        {!cargando && !error && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {metricas.map((metrica) => (
              <MetricCard key={metrica.id} metrica={metrica} />
            ))}
          </div>
        )}

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-bold text-slate-800">
            Estado de la plataforma
          </h2>

          <p className="mt-2 text-sm text-slate-600">
            {mantenimiento
              ? "El mantenimiento está activado."
              : error
                ? "No se pudieron cargar los datos."
                : cargando
                  ? "Consultando información del servidor..."
                  : "Las métricas se cargaron correctamente."}
          </p>
        </div>
      </section>

      <footer className="px-6 py-6 text-center text-sm text-slate-500">
        Clínica Salud Integral · Panel de administración
      </footer>
    </main>
  );
}
