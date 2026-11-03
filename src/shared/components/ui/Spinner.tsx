
interface SpinnerProps {
  fullscreen?: boolean;
}

export default function Spinner({
  fullscreen = false,
}: SpinnerProps) {
  const circulo = (
    <span
      aria-hidden="true"
      className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"
    />
  );

  if (fullscreen) {
    return (
      <div
        role="status"
        aria-label="Cargando"
        className="fixed inset-0 z-50 flex items-center justify-center bg-white/80"
      >
        {circulo}
      </div>
    );
  }

  return (
    <span
      role="status"
      aria-label="Cargando"
      className="inline-flex items-center justify-center"
    >
      {circulo}
    </span>
  );
}
