
import { Link } from "react-router-dom";

export default function PaginaNotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
      <div className="text-center">
        <div className="mb-4 text-6xl">🔎</div>

        <h1 className="text-6xl font-bold text-blue-700">
          404
        </h1>

        <h2 className="mt-4 text-2xl font-semibold text-gray-900">
          Página no encontrada
        </h2>

        <p className="mt-3 text-gray-600">
          La página que buscas no existe o el paciente
          solicitado no fue encontrado.
        </p>

        <Link
          to="/"
          className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
        >
          Ir al inicio
        </Link>
      </div>
    </main>
  );
}
