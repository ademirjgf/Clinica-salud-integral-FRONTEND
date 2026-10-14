
import { useState } from "react";

import BuscadorPacientes from "../components/pacientes/BuscadorPacientes";
import PacienteRow from "../components/pacientes/PacienteRow";

import { pacientes } from "../data/pacientes";

import type { EstadoPaciente, Paciente } from "../types/paciente";

type FiltroEstado = "Todos" | EstadoPaciente;

export default function PaginaPacientes() {
  // Estado de la lista y filtros
  const [pacientesActuales, setPacientesActuales] =
    useState<Paciente[]>(pacientes);

  const [busqueda, setBusqueda] = useState("");
  const [estadoFiltro, setEstadoFiltro] =
    useState<FiltroEstado>("Todos");

  // Estado del formulario
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [especialidadAsignada, setEspecialidadAsignada] =
    useState("");

  const [estadoNuevo, setEstadoNuevo] =
    useState<EstadoPaciente>("activo");

  const [errorFormulario, setErrorFormulario] = useState("");

  // Filtros combinados: nombre y estado
  const pacientesFiltrados = pacientesActuales.filter((paciente) => {
    const texto = busqueda.trim().toLowerCase();

    const coincideNombre = paciente.nombre
      .toLowerCase()
      .includes(texto);

    const coincideEstado =
      estadoFiltro === "Todos" ||
      paciente.estado === estadoFiltro;

    return coincideNombre && coincideEstado;
  });

  // Restablecer los filtros
  function limpiarFiltros() {
    setBusqueda("");
    setEstadoFiltro("Todos");
  }

  // Agregar un paciente
  function agregarPaciente(
    evento: React.FormEvent<HTMLFormElement>,
  ) {
    evento.preventDefault();

    if (!nombre.trim() || !email.trim()) {
      setErrorFormulario("Nombre y email son obligatorios.");
      return;
    }

    const nuevoPaciente: Paciente = {
      id: `pac-${Date.now()}`,
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      email: email.trim(),
      telefono: telefono.trim(),
      especialidadAsignada: especialidadAsignada.trim(),
      ultimaCita: new Date().toISOString().slice(0, 10),
      estado: estadoNuevo,
    };

    // Crear un nuevo array sin modificar el anterior
    setPacientesActuales((prev) => [...prev, nuevoPaciente]);

    // Limpiar el formulario
    setNombre("");
    setApellido("");
    setEmail("");
    setTelefono("");
    setEspecialidadAsignada("");
    setEstadoNuevo("activo");
    setErrorFormulario("");
  }

  // Cambiar el estado de un paciente
  function cambiarEstadoPaciente(
    id: string,
    nuevoEstado: EstadoPaciente,
  ) {
    setPacientesActuales((prev) =>
      prev.map((paciente) =>
        paciente.id === id
          ? { ...paciente, estado: nuevoEstado }
          : paciente,
      ),
    );
  }

  // Eliminar un paciente por su identificador
  function eliminarPaciente(id: string) {
    setPacientesActuales((prev) =>
      prev.filter((paciente) => paciente.id !== id),
    );
  }

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
              Consulta y seguimiento de pacientes registrados.
            </p>
          </div>

          <span className="text-sm text-gray-500">
            {pacientesFiltrados.length} paciente(s) encontrado(s)
          </span>
        </header>

        {/* Filtros combinados */}
        <section className="space-y-4 rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
          <BuscadorPacientes
            value={busqueda}
            onChange={setBusqueda}
          />

          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label
                htmlFor="filtroEstado"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Filtrar por estado
              </label>

              <select
                id="filtroEstado"
                value={estadoFiltro}
                onChange={(
                  evento: React.ChangeEvent<HTMLSelectElement>,
                ) =>
                  setEstadoFiltro(
                    evento.target.value as FiltroEstado,
                  )
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 sm:max-w-xs"
              >
                <option value="Todos">Todos</option>
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
                <option value="en_espera">En espera</option>
              </select>
            </div>

            <button
              type="button"
              onClick={limpiarFiltros}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              Limpiar filtros
            </button>
          </div>
        </section>

        {/* Formulario para agregar pacientes */}
        <section className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Agregar paciente
          </h2>

          <form
            onSubmit={agregarPaciente}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
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
                onChange={(
                  evento: React.ChangeEvent<HTMLInputElement>,
                ) => setNombre(evento.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                placeholder="Nombre"
              />
            </div>

            <div>
              <label
                htmlFor="apellido"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Apellido
              </label>

              <input
                id="apellido"
                value={apellido}
                onChange={(
                  evento: React.ChangeEvent<HTMLInputElement>,
                ) => setApellido(evento.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                placeholder="Apellido"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Email *
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(
                  evento: React.ChangeEvent<HTMLInputElement>,
                ) => setEmail(evento.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                placeholder="correo@ejemplo.com"
              />
            </div>

            <div>
              <label
                htmlFor="telefono"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Teléfono
              </label>

              <input
                id="telefono"
                value={telefono}
                onChange={(
                  evento: React.ChangeEvent<HTMLInputElement>,
                ) => setTelefono(evento.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                placeholder="Teléfono"
              />
            </div>

            <div>
              <label
                htmlFor="especialidad"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Especialidad
              </label>

              <input
                id="especialidad"
                value={especialidadAsignada}
                onChange={(
                  evento: React.ChangeEvent<HTMLInputElement>,
                ) => setEspecialidadAsignada(evento.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                placeholder="Especialidad"
              />
            </div>

            <div>
              <label
                htmlFor="estadoNuevo"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Estado
              </label>

              <select
                id="estadoNuevo"
                value={estadoNuevo}
                onChange={(
                  evento: React.ChangeEvent<HTMLSelectElement>,
                ) =>
                  setEstadoNuevo(
                    evento.target.value as EstadoPaciente,
                  )
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2"
              >
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
                <option value="en_espera">En espera</option>
              </select>
            </div>

            {errorFormulario && (
              <p
                role="alert"
                className="text-sm text-red-600 sm:col-span-2 lg:col-span-3"
              >
                {errorFormulario}
              </p>
            )}

            <div className="sm:col-span-2 lg:col-span-3">
              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700"
              >
                Agregar paciente
              </button>
            </div>
          </form>
        </section>

        {/* Lista de pacientes filtrados */}
        <section
          aria-label="Listado de pacientes"
          className="space-y-3"
        >
          {pacientesFiltrados.length > 0 ? (
            pacientesFiltrados.map((paciente) => (
              <PacienteRow
                key={paciente.id}
                paciente={paciente}
                onCambiarEstado={cambiarEstadoPaciente}
                onEliminar={eliminarPaciente}
              />
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
