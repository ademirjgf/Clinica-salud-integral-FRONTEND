// Problemas encontrados en el código generado por la IA:
// 1. La interfaz estaba escrita en un solo bloque HTML, sin componentes React reutilizables.
// 2. Los datos de los pacientes estaban duplicados directamente en el marcado.
// 3. Los estados y sus colores se repetían manualmente en cada fila.
// 4. Se incluían cifras y avisos de ejemplo sin una fuente de datos real.
// 5. Algunas clases Tailwind dependían de variables de tema personalizadas.


import { useState } from "react";
import BuscadorPacientes from "../components/pacientes/BuscadorPacientes";
import PacienteRow from "../components/pacientes/PacienteRow";
import { pacientes } from "../data/pacientes";

// Problemas encontrados en el código generado por la IA:
// 1. La interfaz estaba escrita en un solo bloque HTML.
// 2. Los pacientes estaban definidos directamente en el marcado.
// 3. Los estados y sus colores se repetían manualmente.
// 4. Se mostraban cifras de ejemplo sin una fuente de datos real.
// 5. Algunas clases dependían de un tema personalizado.

export default function PaginaPacientes() {
  const [busqueda, setBusqueda] = useState("");

  const pacientesFiltrados = pacientes.filter((paciente) => {
    const texto = busqueda.trim().toLowerCase();

    return [
      paciente.nombre,
      paciente.apellido,
      paciente.email,
    ].some((dato) => dato.toLowerCase().includes(texto));
  });

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-blue-700">
              Clínica Salud Integral
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900">
              Pacientes
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Consulta y seguimiento de pacientes registrados.
            </p>
          </div>

          <span className="text-sm text-gray-500">
            {pacientesFiltrados.length} pacientes
          </span>
        </header>

        <section className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
          <BuscadorPacientes
            value={busqueda}
            onChange={setBusqueda}
          />
        </section>

        <section
          aria-label="Listado de pacientes"
          className="space-y-3"
        >
          {pacientesFiltrados.length > 0 ? (
            pacientesFiltrados.map((paciente) => (
              <PacienteRow
                key={paciente.id}
                paciente={paciente}
              />
            ))
          ) : (
            <p className="rounded-xl border border-gray-200 bg-white p-6 text-center text-sm text-gray-500">
              No se encontraron pacientes.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
