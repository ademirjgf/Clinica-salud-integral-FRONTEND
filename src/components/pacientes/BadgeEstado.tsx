
import type { EstadoPaciente } from "../../types/paciente";

interface BadgeEstadoProps {
  estado: EstadoPaciente;
}

const estilosEstado: Record<EstadoPaciente, string> = {
  activo: "bg-green-100 text-green-800",
  inactivo: "bg-gray-100 text-gray-700",
  en_espera: "bg-amber-100 text-amber-800",
};

const etiquetasEstado: Record<EstadoPaciente, string> = {
  activo: "Activo",
  inactivo: "Inactivo",
  en_espera: "En espera",
};

export default function BadgeEstado({
  estado,
}: BadgeEstadoProps) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${estilosEstado[estado]}`}
    >
      {etiquetasEstado[estado]}
    </span>
  );
}
