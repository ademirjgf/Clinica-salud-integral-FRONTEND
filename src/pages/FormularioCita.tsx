
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  citaSchema,
  obtenerFechaLocal,
} from "../schemas/citaSchema";
import type { CitaFormData } from "../schemas/citaSchema";
import { useMedicos } from "../hooks/useMedicos";

export default function FormularioCita() {
  // Navegación programática del Día 5
  const navigate = useNavigate();

  // Carga simulada de médicos
  const { medicos, cargando } = useMedicos();

  // Estado de confirmación
  const [citaConfirmada, setCitaConfirmada] =
    useState<CitaFormData | null>(null);

  // Formulario con React Hook Form y Zod
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CitaFormData>({
    resolver: zodResolver(citaSchema),
    mode: "onChange",
    defaultValues: {
      pacienteNombre: "",
      medicoId: "",
      fecha: "",
      hora: "",
      motivo: "",
      urgencia: "baja",
    },
  });

  // Simulación de registro de cita
  async function agendarCita(datos: CitaFormData) {
    await new Promise<void>((resolve) => {
      setTimeout(resolve, 1500);
    });

    setCitaConfirmada(datos);
  }

  // Reiniciar el formulario
  function agendarOtraCita() {
    reset();
    setCitaConfirmada(null);
  }

  // Regresar a la página anterior
  function cancelarCita() {
    navigate(-1);
  }

  // Pantalla de confirmación
  if (citaConfirmada) {
    const medicoSeleccionado = medicos.find(
      (medico) => medico.id === citaConfirmada.medicoId,
    );

    return (
      <main className="min-h-screen bg-gray-50 p-6">
        <section className="mx-auto max-w-xl rounded-xl border border-green-200 bg-white p-6 shadow-sm">
          <h1 className="mb-2 text-2xl font-bold text-green-700">
            ¡Cita agendada correctamente!
          </h1>

          <p className="mb-6 text-gray-600">
            La cita se registró correctamente en esta
            simulación.
          </p>

          <div className="space-y-3 text-sm text-gray-700">
            <p>
              <strong>Paciente:</strong>{" "}
              {citaConfirmada.pacienteNombre}
            </p>

            <p>
              <strong>Médico:</strong>{" "}
              {medicoSeleccionado?.nombre ?? "No disponible"}
            </p>

            <p>
              <strong>Fecha:</strong> {citaConfirmada.fecha}
            </p>

            <p>
              <strong>Hora:</strong> {citaConfirmada.hora}
            </p>

            <p>
              <strong>Motivo:</strong> {citaConfirmada.motivo}
            </p>

            <p>
              <strong>Urgencia:</strong> {citaConfirmada.urgencia}
            </p>
          </div>

          <button
            type="button"
            onClick={agendarOtraCita}
            className="mt-6 rounded-lg bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700"
          >
            Agendar otra cita
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-3xl">
        <header className="mb-6">
          <p className="text-sm font-medium text-blue-700">
            Clínica Salud Integral
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            Nueva cita médica
          </h1>

          <p className="mt-2 text-gray-600">
            Completa los datos para agendar una cita.
          </p>
        </header>

        <form
          onSubmit={handleSubmit(agendarCita)}
          noValidate
          className="space-y-5 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          {/* Nombre del paciente */}
          <div>
            <label
              htmlFor="pacienteNombre"
              className="mb-1 block font-medium text-gray-700"
            >
              Nombre del paciente
            </label>

            <input
              id="pacienteNombre"
              type="text"
              {...register("pacienteNombre")}
              aria-invalid={!!errors.pacienteNombre}
              className={`w-full rounded-lg border px-3 py-2 ${
                errors.pacienteNombre
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              placeholder="Nombre completo"
            />

            {errors.pacienteNombre && (
              <p role="alert" className="mt-1 text-sm text-red-600">
                {errors.pacienteNombre.message}
              </p>
            )}
          </div>

          {/* Médico */}
          <div>
            <label
              htmlFor="medicoId"
              className="mb-1 block font-medium text-gray-700"
            >
              Médico
            </label>

            <select
              id="medicoId"
              {...register("medicoId")}
              disabled={cargando}
              aria-invalid={!!errors.medicoId}
              className={`w-full rounded-lg border bg-white px-3 py-2 ${
                errors.medicoId
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            >
              {cargando ? (
                <option value="" disabled>
                  Cargando médicos...
                </option>
              ) : (
                <>
                  <option value="">Selecciona un médico</option>

                  {medicos.map((medico) => (
                    <option key={medico.id} value={medico.id}>
                      {medico.nombre} — {medico.especialidad}
                    </option>
                  ))}
                </>
              )}
            </select>

            {errors.medicoId && (
              <p role="alert" className="mt-1 text-sm text-red-600">
                {errors.medicoId.message}
              </p>
            )}
          </div>

          {/* Fecha y hora */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="fecha"
                className="mb-1 block font-medium text-gray-700"
              >
                Fecha
              </label>

              <input
                id="fecha"
                type="date"
                min={obtenerFechaLocal()}
                {...register("fecha")}
                aria-invalid={!!errors.fecha}
                className={`w-full rounded-lg border px-3 py-2 ${
                  errors.fecha
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />

              {errors.fecha && (
                <p role="alert" className="mt-1 text-sm text-red-600">
                  {errors.fecha.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="hora"
                className="mb-1 block font-medium text-gray-700"
              >
                Hora
              </label>

              <input
                id="hora"
                type="time"
                {...register("hora")}
                aria-invalid={!!errors.hora}
                className={`w-full rounded-lg border px-3 py-2 ${
                  errors.hora
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />

              {errors.hora && (
                <p role="alert" className="mt-1 text-sm text-red-600">
                  {errors.hora.message}
                </p>
              )}
            </div>
          </div>

          {/* Motivo */}
          <div>
            <label
              htmlFor="motivo"
              className="mb-1 block font-medium text-gray-700"
            >
              Motivo de la consulta
            </label>

            <textarea
              id="motivo"
              rows={4}
              {...register("motivo")}
              aria-invalid={!!errors.motivo}
              className={`w-full rounded-lg border px-3 py-2 ${
                errors.motivo
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              placeholder="Describe el motivo de la consulta"
            />

            {errors.motivo && (
              <p role="alert" className="mt-1 text-sm text-red-600">
                {errors.motivo.message}
              </p>
            )}
          </div>

          {/* Urgencia */}
          <div>
            <label
              htmlFor="urgencia"
              className="mb-1 block font-medium text-gray-700"
            >
              Nivel de urgencia
            </label>

            <select
              id="urgencia"
              {...register("urgencia")}
              aria-invalid={!!errors.urgencia}
              className={`w-full rounded-lg border bg-white px-3 py-2 ${
                errors.urgencia
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            >
              <option value="baja">Baja</option>
              <option value="media">Media</option>
              <option value="alta">Alta</option>
              <option value="critica">Crítica</option>
            </select>

            {errors.urgencia && (
              <p role="alert" className="mt-1 text-sm text-red-600">
                {errors.urgencia.message}
              </p>
            )}
          </div>

          {/* Botones del formulario */}
          <div className="flex flex-col gap-3 sm:flex-row">
            {/* Cancelar: funcionalidad del Día 5 */}
            <button
              type="button"
              onClick={cancelarCita}
              disabled={isSubmitting}
              className="rounded-lg border border-gray-300 bg-white px-5 py-3 font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-1"
            >
              Cancelar
            </button>

            {/* Agendar: funcionalidad del Día 4 */}
            <button
              type="submit"
              disabled={isSubmitting || cargando}
              className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-1"
            >
              {isSubmitting ? "Agendando..." : "Agendar cita"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
