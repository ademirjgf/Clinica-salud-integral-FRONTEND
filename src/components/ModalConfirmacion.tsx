
import { useEffect } from "react";

interface ModalConfirmacionProps {
  abierto: boolean;
  titulo: string;
  mensaje: string;
  cargando: boolean;
  onConfirmar: () => void;
  onCancelar: () => void;
}

export default function ModalConfirmacion({
  abierto,
  titulo,
  mensaje,
  cargando,
  onConfirmar,
  onCancelar,
}: ModalConfirmacionProps) {
  useEffect(() => {
    if (!abierto) return;

    function manejarTecla(evento: KeyboardEvent) {
      if (evento.key === "Escape" && !cargando) {
        onCancelar();
      }
    }

    document.addEventListener("keydown", manejarTecla);

    return () => {
      document.removeEventListener("keydown", manejarTecla);
    };
  }, [abierto, cargando, onCancelar]);

  if (!abierto) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(evento) => {
        if (
          evento.target === evento.currentTarget &&
          !cargando
        ) {
          onCancelar();
        }
      }}
    >
      <section
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="modal-titulo"
        aria-describedby="modal-mensaje"
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
      >
        <h2
          id="modal-titulo"
          className="text-xl font-bold text-gray-900"
        >
          {titulo}
        </h2>

        <p
          id="modal-mensaje"
          className="mt-3 text-sm text-gray-600"
        >
          {mensaje}
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancelar}
            disabled={cargando}
            className="rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={onConfirmar}
            disabled={cargando}
            className="rounded-lg bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {cargando ? "Eliminando..." : "Eliminar"}
          </button>
        </div>
      </section>
    </div>
  );
}
