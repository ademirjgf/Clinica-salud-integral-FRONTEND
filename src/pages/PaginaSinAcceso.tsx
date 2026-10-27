
import { Link } from "react-router-dom";

export default function PaginaSinAcceso() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center p-6">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mb-4 text-5xl">🔒</div>

        <h1 className="mb-3 text-2xl font-bold text-slate-800">
          Acceso denegado
        </h1>

        <p className="mb-6 text-slate-600">
          Tu usuario no tiene los permisos necesarios
          para acceder a esta sección.
        </p>

        <Link
          to="/"
          className="inline-block rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
        >
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}
