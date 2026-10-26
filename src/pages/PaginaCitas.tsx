
import {
  startTransition,
  useEffect,
  useOptimistic,
  useState,
} from "react";

import toast from "react-hot-toast";

import { useCitasStore } from "../stores/citasStore";
import { useFiltrosStore } from "../stores/filtrosStore";
import { extraerMensajeError } from "../lib/errorHandler";

import type { CitaAPI, EstadoCita } from "../types/citaApi";

const estados: EstadoCita[] = [
  "PROGRAMADA",
  "COMPLETADA",
  "CANCELADA",
];

export default function PaginaCitas() {
  const citas = useCitasStore((s) => s.citas);
  const cargando = useCitasStore((s) => s.cargando);
  const errorCarga = useCitasStore((s) => s.error);
  const cargarTodas = useCitasStore((s) => s.cargarTodas);
  const actualizarEstado = useCitasStore(
    (s) => s.actualizarEstado
  );

  const estadoFiltro = useFiltrosStore(
    (s) => s.estadoCitaFiltro
  );
  const setEstadoFiltro = useFiltrosStore(
    (s) => s.setEstadoCita
  );

  const [actualizandoId, setActualizandoId] =
    useState<number | null>(null);

  const [citasOptimistas, actualizarOptimista] = useOptimistic(
    citas,
    (
      estadoActual: CitaAPI[],
      cambio: { id: number; estado: EstadoCita }
    ) =>
      estadoActual.map((cita) =>
        cita.id === cambio.id
          ? { ...cita, estado: cambio.estado }
          : cita
      )
  );

  useEffect(() => {
    void cargarTodas().catch(() => {
      // El error queda registrado en Zustand.
    });
  }, [cargarTodas]);

  function cambiarEstado(id: number, estado: EstadoCita) {
    if (actualizandoId !== null) return;

    setActualizandoId(id);

    startTransition(async () => {
      actualizarOptimista({ id, estado });

      try {
        await actualizarEstado(id, estado);
        toast.success("Estado de cita actualizado");
      } catch (error: unknown) {
        console.error(extraerMensajeError(error));
        toast.error("Cambio revertido");
      } finally {
        setActualizandoId(null);
      }
    });
  }

  const citasFiltradas = citasOptimistas.filter(
    (cita) =>
      estadoFiltro === "Todos" ||
      cita.estado === estadoFiltro
  );

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header>
          <p className="text-sm font-medium text-blue-700">
            Clínica Salud Integral
          </p>

          <h1 className="mt-1 text-3xl font-bold text-gray-900">
            Citas médicas
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            Consulta las citas y actualiza su estado.
          </p>
        </header>

        <section className="rounded-xl border border-gray-200 bg-white p-4">
          <label
            htmlFor="estadoFiltro"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Filtrar por estado
          </label>

          <select
            id="estadoFiltro"
            value={estadoFiltro}
            onChange={(evento) =>
              setEstadoFiltro(
                evento.target.value as EstadoCita | "Todos"
              )
            }
            className="w-full rounded-lg border border-gray-300 px-3 py-2 sm:max-w-xs"
          >
            <option value="Todos">Todos</option>
            {estados.map((estado) => (
              <option key={estado} value={estado}>
                {estado}
              </option>
            ))}
          </select>
        </section>

        {cargando ? (
          <p
            role="status"
            className="rounded-xl bg-white p-6 text-center text-gray-600"
          >
            Cargando citas...
          </p>
        ) : errorCarga ? (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-6"
          >
            <p className="text-red-700">{errorCarga}</p>

            <button
              type="button"
              onClick={() =>
                void cargarTodas().catch(() => {})
              }
              className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white"
            >
              Reintentar
            </button>
          </div>
        ) : citasFiltradas.length === 0 ? (
          <p className="rounded-xl bg-white p-6 text-center text-gray-500">
            No hay citas para el filtro seleccionado.
          </p>
        ) : (
          <section
            aria-label="Listado de citas"
            className="space-y-4"
          >
            {citasFiltradas.map((cita) => (
              <article
                key={cita.id}
                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div className="space-y-1">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Cita #{cita.id}
                    </h2>

                    <p className="text-sm text-gray-600">
                      Paciente:{" "}
                      {cita.paciente
                        ? `${cita.paciente.nombre} ${cita.paciente.apellido}`
                        : `ID ${cita.pacienteId}`}
                    </p>

                    <p className="text-sm text-gray-600">
                      Médico: ID {cita.medicoId}
                    </p>

                    <p className="text-sm text-gray-600">
                      Fecha:{" "}
                      {new Date(cita.fechaHora).toLocaleString("es-PE")}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor={`estado-${cita.id}`}
                      className="block text-sm font-medium text-gray-700"
                    >
                      Estado
                    </label>

                    <select
                      id={`estado-${cita.id}`}
                      value={cita.estado}
                      disabled={actualizandoId !== null}
                      onChange={(evento) =>
                        cambiarEstado(
                          cita.id,
                          evento.target.value as EstadoCita
                        )
                      }
                      className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                    >
                      {estados.map((estado) => (
                        <option key={estado} value={estado}>
                          {estado}
                        </option>
                      ))}
                    </select>

                    {actualizandoId === cita.id && (
                      <p className="text-xs text-blue-600">
                        Guardando cambio...
                      </p>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
