
import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";
import axios from "axios";

import { api } from "../lib/axios";
import type {
  CrearPacienteAPI,
  PacienteAPI,
} from "../types/pacienteApi";

export default function PaginaPacientes() {
  // Datos reales del backend
  const [pacientes, setPacientes] = useState<PacienteAPI[]>([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState("");

  // Búsqueda
  const [busqueda, setBusqueda] = useState("");

  // Formulario
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");

  const [guardando, setGuardando] = useState(false);
  const [errorFormulario, setErrorFormulario] = useState("");
  const [mensajeExito, setMensajeExito] = useState("");

  // Obtener pacientes desde PostgreSQL
  const cargarPacientes = useCallback(async () => {
    setCargando(true);
    setErrorCarga("");

    try {
      const respuesta = await api.get<PacienteAPI[]>("/pacientes");
      setPacientes(respuesta.data);
    } catch {
      setErrorCarga(
        "No se pudieron cargar los pacientes desde el servidor."
      );
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    void cargarPacientes();
  }, [cargarPacientes]);

  // Buscar por nombre, apellido o email
  const pacientesFiltrados = pacientes.filter((paciente) => {
    const texto = busqueda.trim().toLowerCase();

    const contenido =
      `${paciente.nombre} ${paciente.apellido} ${paciente.email}`
        .toLowerCase();

    return contenido.includes(texto);
  });

  // Registrar un paciente real
  async function agregarPaciente(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();

    setErrorFormulario("");
    setMensajeExito("");

    if (
      !nombre.trim() ||
      !apellido.trim() ||
      !email.trim() ||
      !fechaNacimiento
    ) {
      setErrorFormulario(
        "Todos los campos son obligatorios."
      );
      return;
    }

    const fecha = new Date(`${fechaNacimiento}T12:00:00`);

    if (
      Number.isNaN(fecha.getTime()) ||
      fechaNacimiento > new Date().toLocaleDateString("en-CA")
    ) {
      setErrorFormulario(
        "Ingresa una fecha de nacimiento válida."
      );
      return;
    }

    const nuevoPaciente: CrearPacienteAPI = {
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      email: email.trim(),
      fechaNacimiento,
    };

    setGuardando(true);

    try {
      await api.post<PacienteAPI>("/pacientes", nuevoPaciente);

      // Limpiar formulario después de guardar
      setNombre("");
      setApellido("");
      setEmail("");
      setFechaNacimiento("");

      setMensajeExito(
        "Paciente registrado correctamente en PostgreSQL."
      );

      // Consultar nuevamente los datos reales
      await cargarPacientes();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const estado = error.response?.status;

        if (estado === 409) {
          setErrorFormulario(
            "Ya existe un paciente con ese correo electrónico."
          );
        } else if (estado === 400) {
          setErrorFormulario(
            "Los datos enviados no son válidos. Revisa el formulario."
          );
        } else {
          setErrorFormulario(
            "No se pudo registrar el paciente. Inténtalo nuevamente."
          );
        }
      } else {
        setErrorFormulario(
          "Ocurrió un error inesperado."
        );
      }
    } finally {
      setGuardando(false);
    }
  }

  function limpiarFiltros() {
    setBusqueda("");
  }

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
              onChange={(evento) => setBusqueda(evento.target.value)}
              placeholder="Buscar por nombre, apellido o correo..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
            />
          </div>

          <button
            type="button"
            onClick={limpiarFiltros}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Limpiar filtros
          </button>
        </section>

        {/* Formulario de registro */}
        <section className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
          <h2 className="mb-2 text-xl font-semibold text-gray-900">
            Registrar nuevo paciente
          </h2>

          <p className="mb-5 text-sm text-gray-500">
            Los pacientes registrados se guardarán en PostgreSQL.
          </p>

          <form
            onSubmit={(evento) => void agregarPaciente(evento)}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2"
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
                value={nombre}
                onChange={(evento) => setNombre(evento.target.value)}
                required
                disabled={guardando}
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                placeholder="Nombre"
              />
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
                value={apellido}
                onChange={(evento) => setApellido(evento.target.value)}
                required
                disabled={guardando}
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                placeholder="Apellido"
              />
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
                value={email}
                onChange={(evento) => setEmail(evento.target.value)}
                required
                disabled={guardando}
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                placeholder="correo@ejemplo.com"
              />
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
                value={fechaNacimiento}
                onChange={(evento) =>
                  setFechaNacimiento(evento.target.value)
                }
                max={new Date().toISOString().slice(0, 10)}
                required
                disabled={guardando}
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
              />
            </div>

            {errorFormulario && (
              <p
                role="alert"
                className="text-sm text-red-600 sm:col-span-2"
              >
                {errorFormulario}
              </p>
            )}

            {mensajeExito && (
              <p
                role="status"
                className="text-sm font-medium text-green-700 sm:col-span-2"
              >
                {mensajeExito}
              </p>
            )}

            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={guardando}
                className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {guardando
                  ? "Guardando paciente..."
                  : "Registrar paciente"}
              </button>
            </div>
          </form>
        </section>

        {/* Listado de pacientes */}
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
              <p className="text-red-700">{errorCarga}</p>

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

                  <span className="self-start rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                    ID: {paciente.id}
                  </span>
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
    </main>
  );
}
