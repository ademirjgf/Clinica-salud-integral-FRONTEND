
type TipoAlerta = "info" | "exito" | "advertencia" | "error";

interface AlertaBannerProps {
  tipo: TipoAlerta;
  mensaje: string;
  onReintentar?: () => void;
}

const estilos: Record<TipoAlerta, string> = {
  info: "border-blue-200 bg-blue-50 text-blue-800",
  exito: "border-green-200 bg-green-50 text-green-800",
  advertencia: "border-amber-200 bg-amber-50 text-amber-800",
  error: "border-red-200 bg-red-50 text-red-800",
};

export default function AlertaBanner({
  tipo,
  mensaje,
  onReintentar,
}: AlertaBannerProps) {
  return (
    <div
      role={tipo === "error" ? "alert" : "status"}
      className={`rounded-xl border p-4 ${estilos[tipo]}`}
    >
      <p className="text-sm font-medium">{mensaje}</p>

      {onReintentar && (
        <button
          type="button"
          onClick={onReintentar}
          className="mt-3 rounded-lg border border-current px-3 py-2 text-sm font-semibold"
        >
          Reintentar
        </button>
      )}
    </div>
  );
}
