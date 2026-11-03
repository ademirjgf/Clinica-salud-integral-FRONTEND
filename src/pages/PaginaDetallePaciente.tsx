
import { useNavigate, useParams } from "react-router-dom";

import { pacientes } from "../data/pacientes";
import BadgeEstado from "../components/pacientes/BadgeEstado";
import PaginaNotFound from "./PaginaNotFound";

export default function PaginaDetallePaciente() {
  // Obtenemos el ID desde la URL.
  const { id } = useParams<{ id: string }>();

  // Permite navegar de forma programática.
  const navigate = useNavigate();

  // Buscamos el paciente correspondiente.
  const paciente = pacientes.find((p) => p.id === id);

  // Si no existe, mostramos la página 404.
  if (!paciente) {
    return <PaginaNotFound />;
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-3xl">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
        >
          ← Volver
        </button>

        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 pb-5">
            <div>
              <p className="text-sm font-medium text-blue-700">
                Clínica Salud Integral
              </p>

              <h1 className="mt-2 text-2xl font-bold text-gray-900">
                {paciente.nombre} {paciente.apellido}
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Detalle del paciente
              </p>
            </div>

            <BadgeEstado estado={paciente.estado} />
          </div>

          <dl className="grid gap-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm text-gray-500">
                ID del paciente
              </dt>
              <dd className="mt-1 font-medium text-gray-900">
                {paciente.id}
              </dd>
            </div>

            <div>
              <dt className="text-sm text-gray-500">
                Estado
              </dt>
              <dd className="mt-1 font-medium text-gray-900">
                {paciente.estado.replace("_", " ")}
              </dd>
            </div>

            <div>
              <dt className="text-sm text-gray-500">
                Correo electrónico
              </dt>
              <dd className="mt-1 break-words font-medium text-gray-900">
                {paciente.email}
              </dd>
            </div>

            <div>
              <dt className="text-sm text-gray-500">
                Teléfono
              </dt>
              <dd className="mt-1 font-medium text-gray-900">
                {paciente.telefono || "No registrado"}
              </dd>
            </div>

            <div>
              <dt className="text-sm text-gray-500">
                Especialidad asignada
              </dt>
              <dd className="mt-1 font-medium text-gray-900">
                {paciente.especialidadAsignada || "No asignada"}
              </dd>
            </div>

            <div>
              <dt className="text-sm text-gray-500">
                Última cita
              </dt>
              <dd className="mt-1 font-medium text-gray-900">
                {paciente.ultimaCita}
              </dd>
            </div>
          </dl>
        </section>
      </div>
    </main>
  );
}
