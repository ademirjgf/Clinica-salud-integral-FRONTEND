
import { useState } from "react";

import PaginaDashboard from "./pages/PaginaDashboard";
import PaginaPacientes from "./pages/PaginaPacientes";
import FormularioCita from "./pages/FormularioCita";

// Definimos las páginas disponibles.
type Pagina = "dashboard" | "pacientes" | "citas";

function App() {
  const [paginaActual, setPaginaActual] =
    useState<Pagina>("dashboard");

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="flex flex-wrap gap-3 border-b border-gray-200 bg-white p-4">
        <button
          type="button"
          onClick={() => setPaginaActual("dashboard")}
          className={`rounded-lg px-4 py-2 font-medium transition ${
            paginaActual === "dashboard"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Dashboard
        </button>

        <button
          type="button"
          onClick={() => setPaginaActual("pacientes")}
          className={`rounded-lg px-4 py-2 font-medium transition ${
            paginaActual === "pacientes"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Pacientes
        </button>

        <button
          type="button"
          onClick={() => setPaginaActual("citas")}
          className={`rounded-lg px-4 py-2 font-medium transition ${
            paginaActual === "citas"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Nueva cita
        </button>
      </nav>

      <main>
        {paginaActual === "dashboard" && <PaginaDashboard />}

        {paginaActual === "pacientes" && <PaginaPacientes />}

        {paginaActual === "citas" && <FormularioCita />}
      </main>
    </div>
  );
}

export default App;
