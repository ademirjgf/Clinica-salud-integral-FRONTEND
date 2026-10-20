import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { api } from "../lib/axios";
import MetricCard from "../components/MetricCard";
import StatusBadge from "../components/StatusBadge";
import type { Metrica } from "../types";

interface PacienteAPI {
  id: number;
}

interface MedicoAPI {
  id: number;
}

type EstadoCita = "PROGRAMADA" | "COMPLETADA" | "CANCELADA";

interface CitaAPI {
  id: number;
  estado: EstadoCita;
  fechaHora: string;
}

interface DatosDashboard {
  pacientes: number;
  medicos: number;
  citasHoy: number;
  consultasPendientes: number;
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

  const [datos, setDatos] = useState<DatosDashboard | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const cargarDatos = useCallback(async () => {
    setCargando(true);
    setError("");

    try {
      const [respuestaPacientes, respuestaMedicos, respuestaCitas] =
        await Promise.all([
          api.get<PacienteAPI[]>("/pacientes"),
          api.get<MedicoAPI[]>("/medicos"),
          api.get<CitaAPI[]>("/citas"),
        ]);

      const pacientes = respuestaPacientes.data;
      const medicos = respuestaMedicos.data;
      const citas = respuestaCitas.data;

      const citasHoy = citas.filter(
        (cita) =>
          cita.estado === "PROGRAMADA" && esHoy(cita.fechaHora)
      ).length;

      const consultasPendientes = citas.filter(
        (cita) => cita.estado === "PROGRAMADA"
      ).length;

      setDatos({
        pacientes: pacientes.length,
        medicos: medicos.length,
        citasHoy,
        consultasPendientes,
      });
    } catch {
      setDatos(null);
      setError(
        "No se pudieron cargar las métricas. Verifica la conexión con el servidor."
      );
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    void cargarDatos();
  }, [cargarDatos]);

  const metricas: Metrica[] = datos
    ? [
        {
          id: "pacientes",
          titulo: "Pacientes",
          valor: datos.pacientes,
          descripcion: "Pacientes registrados",
          tendencia: "positiva",
          icono: "👥",
        },
        {
          id: "citas",
          titulo: "Citas Hoy",
          valor: datos.citasHoy,
          descripcion: "Citas programadas para hoy",
          tendencia: "neutra",
          icono: "📅",
        },
        {
          id: "consultas",
          titulo: "Consultas Pendientes",
          valor: datos.consultasPendientes,
          descripcion: "Citas programadas por atender",
          tendencia: "negativa",
          icono: "🩺",
        },
        {
          id: "medicos",
          titulo: "Médicos",
          valor: datos.medicos,
          descripcion: "Médicos registrados",
          tendencia: "positiva",
          icono: "👨‍⚕️",
        },
      ]
    : [];

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Alerta de mantenimiento */}
      {mantenimiento && (
        <div
          role="alert"
          className="bg-rose-600 px-4 py-3 text-center font-medium text-white"
        >
          ⚠️ El sistema está en modo mantenimiento.
          Algunas funciones podrían no estar disponibles.
        </div>
      )}

      {/* Encabezado del Dashboard */}
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

          <div className="flex flex-wrap items-center gap-4">
            <Link
              to="/pacientes"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Ver Pacientes →
            </Link>

            <StatusBadge activo={!mantenimiento} />

                      </div>
        </div>
      </header>

      {/* Sección de métricas */}
      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Métricas generales
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Indicadores obtenidos del servidor
            </p>
          </div>

          <button
            type="button"
            onClick={() => setMantenimiento((prev) => !prev)}
            className={`rounded-xl px-5 py-3 font-semibold text-white transition ${
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

        {cargando && (
          <p role="status" className="rounded-xl bg-white p-6 text-slate-600">
            Cargando métricas desde el servidor...
          </p>
        )}

        {!cargando && error && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-6"
          >
            <p className="text-red-700">{error}</p>

            <button
              type="button"
              onClick={() => void cargarDatos()}
              className="mt-4 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
            >
              Reintentar
            </button>
          </div>
        )}

        {!cargando && !error && datos && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
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
              ? "El mantenimiento está activado. Puedes desactivarlo con el botón superior."
              : error
                ? "No se pudo verificar la conexión con los datos de la clínica."
                : cargando
                  ? "Consultando información del servidor..."
                  : "Las métricas se cargaron correctamente desde el servidor."}
          </p>
        </div>
      </section>

      <footer className="px-6 py-6 text-center text-sm text-slate-500">
        Clínica Salud Integral · Panel de administración
      </footer>
    </main>
  );
}