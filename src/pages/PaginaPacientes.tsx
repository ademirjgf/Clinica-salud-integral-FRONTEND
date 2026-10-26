
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";

import { usePacientesStore } from "../stores/pacientesStore";
import { useFiltrosStore } from "../stores/filtrosStore";
import { extraerMensajeError } from "../lib/errorHandler";
import ModalConfirmacion from "../components/ModalConfirmacion";

import type { PacienteAPI } from "../types/pacienteApi";

const pacienteSchema = z.object({
  nombre: z.string().trim().min(1, "El nombre es obligatorio"),
  apellido: z.string().trim().min(1, "El apellido es obligatorio"),
  email: z.email("Ingresa un correo electrónico válido"),
  fechaNacimiento: z
    .string()
    .min(1, "La fecha de nacimiento es obligatoria")
    .refine((valor) => {
      const fecha = new Date(`${valor}T00:00:00.000Z`);

      return (
        !Number.isNaN(fecha.getTime()) &&
        fecha.toISOString().slice(0, 10) === valor &&
        fecha <= new Date()
      );
    }, "Ingresa una fecha de nacimiento válida y no futura"),
});

type FormularioPaciente = z.infer<typeof pacienteSchema>;

export default function PaginaPacientes() {
  const pacientes = usePacientesStore((s) => s.pacientes);
  const cargando = usePacientesStore((s) => s.cargando);
  const errorCarga = usePacientesStore((s) => s.error);
  const cargar = usePacientesStore((s) => s.cargar);
  const crear = usePacientesStore((s) => s.crear);
  const eliminar = usePacientesStore((s) => s.eliminar);

  const busqueda = useFiltrosStore((s) => s.queryPacientes);
  const setBusqueda = useFiltrosStore((s) => s.setQueryPacientes);
  const resetFiltros = useFiltrosStore((s) => s.resetFiltros);

  const [pacienteAEliminar, setPacienteAEliminar] =
    useState<PacienteAPI | null>(null);
  const [eliminando, setEliminando] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormularioPaciente>({
    resolver: zodResolver(pacienteSchema),
    defaultValues: {
      nombre: "",
      apellido: "",
      email: "",
      fechaNacimiento: "",
    },
  });

  useEffect(() => {
    void cargar().catch(() => {
      // El error ya queda guardado en Zustand.
    });
  }, [cargar]);

  async function agregarPaciente(datos: FormularioPaciente) {
    try {
      await crear(datos);
      toast.success("Paciente registrado");
      reset();
    } catch (error: unknown) {
      toast.error(extraerMensajeError(error));
    }
  }

  function cancelarEliminacion() {
    if (!eliminando) {
      setPacienteAEliminar(null);
    }
  }

  async function confirmarEliminacion() {
    if (!pacienteAEliminar || eliminando) return;

    setEliminando(true);

    try {
      await eliminar(pacienteAEliminar.id);
      setPacienteAEliminar(null);
      toast.success("Paciente eliminado");
    } catch (error: unknown) {
      toast.error(extraerMensajeError(error));
    } finally {
      setEliminando(false);
    }
  }

  const pacientesFiltrados = pacientes.filter((paciente) => {
    const texto = busqueda.trim().toLowerCase();

    return (
      `${paciente.nombre} ${paciente.apellido} ${paciente.email}`
        .toLowerCase()
        .includes(texto)
    );
  });

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-blue-700">
              Clínica Salud Integral
            </p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900">
              Pacientes
            </h1>

            <p className="mt-2 text-sm text-gray-600">
              Consulta y registro de pacientes de la clínica.
            </p>
          </div>

          <span className="text-sm text-gray-500">
            {cargando
              ? "Cargando..."
              : `${pacientesFiltrados.length} paciente(s) encontrado(s)`}
          </span>
        </header>

        <section className="space-y-4 rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
          <div>
            <label
              htmlFor="busqueda"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Buscar pacientes
            </label>

            <input
              id="busqueda"
              type="search"
              value={busqueda}
              onChange={(evento) =>
                setBusqueda(evento.target.value)
              }
              placeholder="Buscar por nombre, apellido o correo..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
            />
          </div>

          <button
            type="button"
            onClick={resetFiltros}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Limpiar filtros
          </button>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
          <h2 className="mb-2 text-xl font-semibold text-gray-900">
            Registrar nuevo paciente
          </h2>

          <p className="mb-5 text-sm text-gray-500">
            Los pacientes registrados se guardarán en PostgreSQL.
          </p>

          <form
            onSubmit={handleSubmit(agregarPaciente)}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2"
            noValidate
          >
            <div>
              <label
                htmlFor="nombre"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Nombre *
              </label>

              <input
                id="nombre"
                {...register("nombre")}
                disabled={isSubmitting}
                placeholder="Nombre"
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
              />

              {errors.nombre && (
                <p role="alert" className="mt-1 text-sm text-red-600">
                  {errors.nombre.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="apellido"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Apellido *
              </label>

              <input
                id="apellido"
                {...register("apellido")}
                disabled={isSubmitting}
                placeholder="Apellido"
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
              />

              {errors.apellido && (
                <p role="alert" className="mt-1 text-sm text-red-600">
                  {errors.apellido.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Correo electrónico *
              </label>

              <input
                id="email"
                type="email"
                {...register("email")}
                disabled={isSubmitting}
                placeholder="correo@ejemplo.com"
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
              />

              {errors.email && (
                <p role="alert" className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="fechaNacimiento"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Fecha de nacimiento *
              </label>

              <input
                id="fechaNacimiento"
                type="date"
                max={new Date().toISOString().slice(0, 10)}
                {...register("fechaNacimiento")}
                disabled={isSubmitting}
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
              />

              {errors.fechaNacimiento && (
                <p role="alert" className="mt-1 text-sm text-red-600">
                  {errors.fechaNacimiento.message}
                </p>
              )}
            </div>

            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting
                  ? "Guardando paciente..."
                  : "Registrar paciente"}
              </button>
            </div>
          </form>
        </section>

        <section aria-label="Listado de pacientes" className="space-y-3">
          <h2 className="text-xl font-semibold text-gray-900">
            Pacientes registrados
          </h2>

          {cargando ? (
            <p
              role="status"
              className="rounded-xl bg-white p-6 text-center text-gray-600"
            >
              Cargando pacientes desde PostgreSQL...
            </p>
          ) : errorCarga ? (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 p-6"
            >
              <p className="text-red-700">{errorCarga}</p>

              <button
                type="button"
                onClick={() => void cargar().catch(() => {})}
                className="mt-4 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white"
              >
                Reintentar
              </button>
            </div>
          ) : pacientesFiltrados.length > 0 ? (
            pacientesFiltrados.map((paciente) => (
              <article
                key={paciente.id}
                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {paciente.nombre} {paciente.apellido}
                    </h3>

                    <p className="mt-1 text-sm text-gray-600">
                      {paciente.email}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Fecha de nacimiento:{" "}
                      {paciente.fechaNacimiento.slice(0, 10)}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 self-start">
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                      ID: {paciente.id}
                    </span>

                    <button
                      type="button"
                      onClick={() => setPacienteAEliminar(paciente)}
                      className="rounded-lg border border-red-300 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <p className="rounded-xl border border-gray-200 bg-white p-6 text-center text-sm text-gray-500">
              No se encontraron pacientes.
            </p>
          )}
        </section>
      </div>

      <ModalConfirmacion
        abierto={pacienteAEliminar !== null}
        titulo="Eliminar paciente"
        mensaje={
          pacienteAEliminar
            ? `¿Estás seguro de que deseas eliminar a ${pacienteAEliminar.nombre} ${pacienteAEliminar.apellido}? Esta acción no se puede deshacer.`
            : ""
        }
        cargando={eliminando}
        onConfirmar={() => void confirmarEliminacion()}
        onCancelar={cancelarEliminacion}
      />
    </main>
  );
}
