
import type { Paciente } from "../../types/paciente";
import BadgeEstado from "./BadgeEstado";

interface PacienteRowProps {
  paciente: Paciente;
}

export default function PacienteRow({
  paciente,
}: PacienteRowProps) {
  return (
    <article className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 md:grid md:grid-cols-[1.2fr_1.5fr_1fr_auto] md:items-center md:gap-4">
      <div>
        <h2 className="font-semibold text-gray-900">
          {paciente.nombre} {paciente.apellido}
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          {paciente.especialidadAsignada}
        </p>
      </div>

      <div className="min-w-0">
        <p className="break-words text-sm text-gray-700">
          {paciente.email}
        </p>
        <p className="mt-1 text-sm text-gray-500">
          {paciente.telefono}
        </p>
      </div>

      <div>
        <p className="text-xs text-gray-500">Última cita</p>
        <time className="text-sm font-medium text-gray-800">
          {paciente.ultimaCita}
        </time>
      </div>

      <div className="flex items-center justify-between gap-2 md:justify-end">
        <BadgeEstado estado={paciente.estado} />
      </div>
    </article>
  );
}
