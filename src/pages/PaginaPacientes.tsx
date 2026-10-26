import { useCallback, useEffect, useState } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";

import * as pacientesService from "../services/pacientes";
import { extraerMensajeError } from "../lib/errorHandler";

import ModalConfirmacion from "../components/ModalConfirmacion";

import type { PacienteAPI } from "../types/pacienteApi";

// Esquema de validación con Zod
const pacienteSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(1, "El nombre es obligatorio"),

  apellido: z
    .string()
    .trim()
    .min(1, "El apellido es obligatorio"),

  email: z
    .email("Ingresa un correo electrónico válido"),

  fechaNacimiento: z
    .string()
    .min(1, "La fecha de nacimiento es obligatoria")
    .refine((valor) => {
      const fecha = new Date(`${valor}T00:00:00.000Z`);

      if (Number.isNaN(fecha.getTime())) {
        return false;
      }

      if (fecha.toISOString().slice(0, 10) !== valor) {
        return false;
      }

      return fecha <= new Date();
    }, "Ingresa una fecha de nacimiento válida y no futura"),
});

type FormularioPaciente = z.infer<typeof pacienteSchema>;

export default function PaginaPacientes() {
  // Estado de pacientes
  const [pacientes, setPacientes] = useState<PacienteAPI[]>([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState("");
  const [busqueda, setBusqueda] = useState("");

  // Estados para eliminación
  const [pacienteAEliminar, setPacienteAEliminar] =
    useState<PacienteAPI | null>(null);

  const [eliminando, setEliminando] = useState(false);

  // React Hook Form + Zod
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

  // Cargar pacientes desde la API
  const cargarPacientes = useCallback(async () => {
    setCargando(true);
    setErrorCarga("");

    try {
      const respuesta = await pacientesService.getAll();
      setPacientes(respuesta.data);
    } catch (error: unknown) {
      setErrorCarga(extraerMensajeError(error));
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    void cargarPacientes();
  }, [cargarPacientes]);

  // Crear paciente real
  async function agregarPaciente(datos: FormularioPaciente) {
    try {
      const respuesta = await pacientesService.create(datos);

      setPacientes((anteriores) => [
        ...anteriores,
        respuesta.data,
      ]);

      toast.success("Paciente registrado");

      reset();
    } catch (error: unknown) {
      toast.error(extraerMensajeError(error));
    }
  }

  // Abrir modal de eliminación
  function solicitarEliminacion(paciente: PacienteAPI) {
    setPacienteAEliminar(paciente);
  }

  // Cerrar modal
  function cancelarEliminacion() {
    if (eliminando) {
      return;
    }

    setPacienteAEliminar(null);
  }

  // Eliminar paciente en PostgreSQL
  async function confirmarEliminacion() {
    if (!pacienteAEliminar || eliminando) {
      return;
    }

    const idPaciente = pacienteAEliminar.id;

    setEliminando(true);

    try {
      // DELETE /pacientes/:id
      await pacientesService.remove(idPaciente);

      // Actualizar el estado local sin recargar
      setPacientes((anteriores) =>
        anteriores.filter(
          (paciente) => paciente.id !== idPaciente
        )
      );

      // Cerrar el modal
      setPacienteAEliminar(null);

      // Mostrar confirmación
      toast.success("Paciente eliminado");
    } catch (error: unknown) {
      // Si falla, no modificamos la lista
      toast.error(extraerMensajeError(error));
    } finally {
      setEliminando(false);
    }
  }

  // Filtrar pacientes
  const pacientesFiltrados = pacientes.filter((paciente) => {
    const texto = busqueda.trim().toLowerCase();

    const contenido =
      `${paciente.nombre} ${paciente.apellido} ${paciente.email}`
        .toLowerCase();

    return contenido.includes(texto);
  });

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Encabezado */}
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

        {/* Búsqueda */}
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
            onClick={() => setBusqueda("")}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Limpiar filtros
          </button>
        </section>

        {/* Formulario */}
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
            {/* Nombre */}
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

            {/* Apellido */}
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

            {/* Email */}
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

            {/* Fecha de nacimiento */}
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

        {/* Listado */}
        <section
          aria-label="Listado de pacientes"
          className="space-y-3"
        >
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
              <p className="text-red-700">
                {errorCarga}
              </p>

              <button
                type="button"
                onClick={() => void cargarPacientes()}
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

                  {/* Acciones */}
                  <div className="flex items-center gap-3 self-start">
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                      ID: {paciente.id}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        solicitarEliminacion(paciente)
                      }
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

      {/* Modal de confirmación */}
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