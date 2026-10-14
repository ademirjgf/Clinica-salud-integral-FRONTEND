
import type { Paciente, EstadoPaciente } from "../../types/paciente";
import BadgeEstado from "./BadgeEstado";

interface PacienteRowProps {
  paciente: Paciente;
  onCambiarEstado: (id: string, nuevoEstado: EstadoPaciente) => void;
  onEliminar: (id: string) => void;
}

export default function PacienteRow({
  paciente,
  onCambiarEstado,
  onEliminar,
}: PacienteRowProps) {
  function manejarCambioEstado(
    evento: React.ChangeEvent<HTMLSelectElement>,
  ) {
    onCambiarEstado(
      paciente.id,
      evento.target.value as EstadoPaciente,
    );
  }

  function manejarEliminar() {
    const confirmar = window.confirm(
      `¿Estás seguro de que deseas eliminar a ${paciente.nombre} ${paciente.apellido}?`,
    );

    if (confirmar) {
      onEliminar(paciente.id);
    }
  }

  return (
    <article className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 md:grid md:grid-cols-[1.2fr_1.5fr_1fr_auto] md:items-center md:gap-4">
      <div>
        <h2 className="font-semibold text-gray-900">
          {paciente.nombre} {paciente.apellido}
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          {paciente.especialidadAsignada || "Sin especialidad"}
        </p>
      </div>

      <div className="min-w-0">
        <p className="break-words text-sm text-gray-700">
          {paciente.email}
        </p>

        <p className="mt-1 text-sm text-gray-500">
          {paciente.telefono || "Sin teléfono"}
        </p>
      </div>

      <div>
        <p className="text-xs text-gray-500">Última cita</p>

        <time className="text-sm font-medium text-gray-800">
          {paciente.ultimaCita}
        </time>
      </div>

      <div className="flex flex-col gap-2 md:items-end">
        <BadgeEstado estado={paciente.estado} />

        <label className="sr-only" htmlFor={`estado-${paciente.id}`}>
          Cambiar estado de {paciente.nombre}
        </label>

        <select
          id={`estado-${paciente.id}`}
          value={paciente.estado}
          onChange={manejarCambioEstado}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none md:w-auto"
        >
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
          <option value="en_espera">En espera</option>
        </select>

        <button
          type="button"
          onClick={manejarEliminar}
          className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
        >
          Eliminar
        </button>
      </div>
    </article>
  );
}
