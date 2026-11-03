
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

import {
  getHistorial,
  type EstadoFiltroHistorial,
} from "../services/citas";

import type { CitaAPI } from "../types/citaApi";
import type { RespuestaPaginada } from "../types/api";

import SkeletonCitaRow from "../shared/components/ui/SkeletonCitaRow";

import EstadoVacio from "../shared/components/ui/EstadoVacio";
import AlertaBanner from "../shared/components/ui/AlertaBanner";

const ESTADOS: EstadoFiltroHistorial[] = [
  "Todos",
  "Programada",
  "Completada",
  "Cancelada",
];

const DATOS_INICIALES: RespuestaPaginada<CitaAPI> = {
  data: [],
  total: 0,
  pagina: 1,
  totalPaginas: 0,
};



function obtenerPagina(valor: string | null): number {
  if (!valor) return 1;

  const numero = Number(valor);

  return Number.isSafeInteger(numero) && numero > 0
    ? numero
    : 1;
}

function obtenerEstado(
  valor: string | null
): EstadoFiltroHistorial {
  if (ESTADOS.includes(valor as EstadoFiltroHistorial)) {
    return valor as EstadoFiltroHistorial;
  }

  return "Todos";
}

function formatearFecha(fecha: string): string {
  return new Intl.DateTimeFormat("es-PE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(fecha));
}

const COLORES_ESTADO: Record<CitaAPI["estado"], string> = {
  PROGRAMADA: "bg-blue-100 text-blue-700",
  COMPLETADA: "bg-green-100 text-green-700",
  CANCELADA: "bg-red-100 text-red-700",
};

const NOMBRES_ESTADO: Record<CitaAPI["estado"], string> = {
  PROGRAMADA: "Programada",
  COMPLETADA: "Completada",
  CANCELADA: "Cancelada",
};

export default function PaginaHistorialCitas() {
  const [searchParams, setSearchParams] = useSearchParams();

  const pagina = obtenerPagina(searchParams.get("pagina"));
  const estado = obtenerEstado(searchParams.get("estado"));

  const [respuesta, setRespuesta] =
    useState<RespuestaPaginada<CitaAPI>>(DATOS_INICIALES);

  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function cargarCitas() {
      setCargando(true);
      setError("");

      try {
        const resultado = await getHistorial({
          pagina,
          estado,
          signal: controller.signal,
        });

        if (!controller.signal.aborted) {
          setRespuesta(resultado.data);
        }
      } catch (err: unknown) {
        if (controller.signal.aborted || axios.isCancel(err)) {
          return;
        }

        setError(
          "No se pudo cargar el historial de citas."
        );
      } finally {
        if (!controller.signal.aborted) {
          setCargando(false);
        }
      }
    }

    void cargarCitas();

    return () => {
      controller.abort();
    };
  }, [pagina, estado]);

  const cambiarEstado = (
    nuevoEstado: EstadoFiltroHistorial
  ) => {
    setSearchParams({
      pagina: "1",
      estado: nuevoEstado,
    });
  };

  const cambiarPagina = (nuevaPagina: number) => {
    setSearchParams({
      pagina: String(nuevaPagina),
      estado,
    });
  };

  const totalPaginas = respuesta.totalPaginas;
  const puedeRetroceder = pagina > 1;
  const puedeAvanzar = pagina < totalPaginas;

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">
          Historial de citas
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Consulta el historial de citas de la clínica.
        </p>
      </header>

      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <label
          htmlFor="filtro-estado-historial"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Filtrar por estado
        </label>

        <select
          id="filtro-estado-historial"
          value={estado}
          onChange={(event) =>
            cambiarEstado(
              event.target.value as EstadoFiltroHistorial
            )
          }
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 sm:max-w-xs"
        >
          {ESTADOS.map((opcion) => (
            <option key={opcion} value={opcion}>
              {opcion}
            </option>
          ))}
        </select>
      </div>

      {cargando ? (
  <div
    role="status"
    aria-label="Cargando historial de citas"
    className="space-y-3"
  >
    {Array.from({ length: 10 }, (_, index) => (
      <SkeletonCitaRow key={index} />
    ))}
  </div>
      ) : error ? (
  <AlertaBanner
    tipo="error"
    mensaje={error}
  />
      
) : respuesta.data.length === 0 ? (
  <EstadoVacio
    titulo="No hay citas registradas"
    descripcion="No existen citas para el estado seleccionado."
    accion={
      estado !== "Todos"
        ? {
            label: "Mostrar todos los estados",
            onClick: () => cambiarEstado("Todos"),
          }
        : undefined
    }
  />

      ) : (
        <div className="space-y-3">
          {respuesta.data.map((cita) => (
            <article
              key={cita.id}
              className="flex min-h-20 flex-wrap items-center justify-between gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
            >
              <div className="space-y-1">
                <p className="font-semibold text-gray-900">
                  {cita.paciente
                    ? `${cita.paciente.nombre} ${cita.paciente.apellido}`
                    : `Paciente #${cita.pacienteId}`}
                </p>

                <p className="text-sm text-gray-500">
                  {formatearFecha(cita.fechaHora)}
                </p>

                <p className="text-xs text-gray-400">
                  Cita #{cita.id} · Médico #{cita.medicoId}
                </p>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  COLORES_ESTADO[cita.estado]
                }`}
              >
                {NOMBRES_ESTADO[cita.estado]}
              </span>
            </article>
          ))}
        </div>
      )}

      <footer className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4">
        <p className="text-sm text-gray-600">
          Página {pagina} de {totalPaginas} —{" "}
          {respuesta.total} registros
        </p>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => cambiarPagina(pagina - 1)}
            disabled={
              cargando || Boolean(error) || !puedeRetroceder
            }
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            ← Anterior
          </button>

          <button
            type="button"
            onClick={() => cambiarPagina(pagina + 1)}
            disabled={
              cargando || Boolean(error) || !puedeAvanzar
            }
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Siguiente →
          </button>
        </div>
      </footer>
    </div>
  );
}
