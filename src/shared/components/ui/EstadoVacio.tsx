
interface AccionEstadoVacio {
  label: string;
  onClick: () => void;
}

interface EstadoVacioProps {
  titulo: string;
  descripcion?: string;
  accion?: AccionEstadoVacio;
}

export default function EstadoVacio({
  titulo,
  descripcion,
  accion,
}: EstadoVacioProps) {
  return (
    <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-10 text-center">
      <div
        aria-hidden="true"
        className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-2xl"
      >
        📋
      </div>

      <h3 className="text-lg font-semibold text-gray-900">
        {titulo}
      </h3>

      {descripcion && (
        <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
          {descripcion}
        </p>
      )}

      {accion && (
        <button
          type="button"
          onClick={accion.onClick}
          className="mt-5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          {accion.label}
        </button>
      )}
    </div>
  );
}
