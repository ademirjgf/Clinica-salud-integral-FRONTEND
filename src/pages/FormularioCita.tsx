
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";

import { api } from "../lib/axios";
import * as citasService from "../services/citas";
import { extraerMensajeError } from "../lib/errorHandler";

import type { PacienteAPI } from "../types/pacienteApi";
import type { CitaAPI } from "../types/citaApi";

interface MedicoAPI {
  id: number;
  nombre: string;
  apellido: string;
  especialidadId: number;
  especialidad: {
    id: number;
    nombre: string;
  };
}

function obtenerFechaLocal(): string {
  const ahora = new Date();
  const anio = ahora.getFullYear();
  const mes = String(ahora.getMonth() + 1).padStart(2, "0");
  const dia = String(ahora.getDate()).padStart(2, "0");

  return `${anio}-${mes}-${dia}`;
}

const citaSchema = z.object({
  pacienteId: z.string().min(1, "Selecciona un paciente"),
  medicoId: z.string().min(1, "Selecciona un médico"),
  fecha: z.string().min(1, "Selecciona una fecha"),
  hora: z.string().min(1, "Selecciona una hora"),
}).refine(
  (datos) => {
    if (!datos.fecha || !datos.hora) return true;

    const fechaHora = new Date(
      `${datos.fecha}T${datos.hora}:00`
    );

    return (
      !Number.isNaN(fechaHora.getTime()) &&
      fechaHora > new Date()
    );
  },
  {
    message: "La fecha y hora deben ser futuras",
    path: ["fecha"],
  }
);

type CitaFormData = z.infer<typeof citaSchema>;

export default function FormularioCita() {
  const navigate = useNavigate();

  const [pacientes, setPacientes] = useState<PacienteAPI[]>([]);
  const [medicos, setMedicos] = useState<MedicoAPI[]>([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState("");
  const [citaConfirmada, setCitaConfirmada] =
    useState<CitaAPI | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CitaFormData>({
    resolver: zodResolver(citaSchema),
    defaultValues: {
      pacienteId: "",
      medicoId: "",
      fecha: "",
      hora: "",
    },
  });

  useEffect(() => {
    async function cargarDatos() {
      setCargando(true);
      setErrorCarga("");

      try {
        const [respuestaPacientes, respuestaMedicos] =
          await Promise.all([
            api.get<PacienteAPI[]>("/pacientes"),
            api.get<MedicoAPI[]>("/medicos"),
          ]);

        setPacientes(respuestaPacientes.data);
        setMedicos(respuestaMedicos.data);
      } catch (error: unknown) {
        setErrorCarga(extraerMensajeError(error));
        toast.error("No se pudieron cargar los datos");
      } finally {
        setCargando(false);
      }
    }

    void cargarDatos();
  }, []);

  async function agendarCita(datos: CitaFormData) {
    try {
      const fechaHora = new Date(
        `${datos.fecha}T${datos.hora}:00`
      ).toISOString();

      const respuesta = await citasService.create({
        pacienteId: Number(datos.pacienteId),
        medicoId: Number(datos.medicoId),
        fechaHora,
      });

      setCitaConfirmada(respuesta.data);
      toast.success("Cita agendada correctamente");
    } catch (error: unknown) {
      toast.error(extraerMensajeError(error));
    }
  }

  function agendarOtraCita() {
    reset();
    setCitaConfirmada(null);
  }

  if (citaConfirmada) {
    const paciente = pacientes.find(
      (item) => item.id === citaConfirmada.pacienteId
    );

    const medico = medicos.find(
      (item) => item.id === citaConfirmada.medicoId
    );

    return (
      <main className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <section className="mx-auto max-w-xl rounded-xl border border-green-200 bg-white p-6 shadow-sm">
          <h1 className="mb-3 text-2xl font-bold text-green-700">
            ¡Cita agendada correctamente!
          </h1>

          <p className="mb-5 text-sm text-gray-600">
            La cita #{citaConfirmada.id} fue guardada en
            PostgreSQL.
          </p>

          <div className="space-y-3 text-sm text-gray-700">
            <p>
              <strong>Paciente:</strong>{" "}
              {paciente
                ? `${paciente.nombre} ${paciente.apellido}`
                : `ID ${citaConfirmada.pacienteId}`}
            </p>

            <p>
              <strong>Médico:</strong>{" "}
              {medico
                ? `${medico.nombre} ${medico.apellido}`
                : `ID ${citaConfirmada.medicoId}`}
            </p>

            <p>
              <strong>Fecha y hora:</strong>{" "}
              {new Date(
                citaConfirmada.fechaHora
              ).toLocaleString("es-PE")}
            </p>

            <p>
              <strong>Estado:</strong>{" "}
              {citaConfirmada.estado}
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/citas"
              className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700"
            >
              Ver citas agendadas
            </Link>

            <button
              type="button"
              onClick={agendarOtraCita}
              className="rounded-lg border border-gray-300 px-5 py-2 font-medium text-gray-700 hover:bg-gray-100"
            >
              Agendar otra cita
            </button>
          </div>
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
            Completa los datos para agendar una cita real.
          </p>
        </header>

        {errorCarga && (
          <p
            role="alert"
            className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            {errorCarga}
          </p>
        )}

        <form
          onSubmit={handleSubmit(agendarCita)}
          noValidate
          className="space-y-5 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          <div>
            <label
              htmlFor="pacienteId"
              className="mb-1 block font-medium text-gray-700"
            >
              Paciente
            </label>

            <select
              id="pacienteId"
              {...register("pacienteId")}
              disabled={cargando || isSubmitting}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2"
            >
              <option value="">Selecciona un paciente</option>

              {pacientes.map((paciente) => (
                <option key={paciente.id} value={paciente.id}>
                  {paciente.nombre} {paciente.apellido}
                </option>
              ))}
            </select>

            {errors.pacienteId && (
              <p role="alert" className="mt-1 text-sm text-red-600">
                {errors.pacienteId.message}
              </p>
            )}
          </div>

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
              disabled={cargando || isSubmitting}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2"
            >
              <option value="">Selecciona un médico</option>

              {medicos.map((medico) => (
              <option key={medico.id} value={medico.id}>
              {medico.nombre} {medico.apellido}
               {" — "}
               {medico.especialidad.nombre}
               </option>
                  ))}
            </select>

            {errors.medicoId && (
              <p role="alert" className="mt-1 text-sm text-red-600">
                {errors.medicoId.message}
              </p>
            )}
          </div>

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
                disabled={isSubmitting}
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
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
                disabled={isSubmitting}
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
              />

              {errors.hora && (
                <p role="alert" className="mt-1 text-sm text-red-600">
                  {errors.hora.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              disabled={isSubmitting}
              className="rounded-lg border border-gray-300 px-5 py-3 font-semibold text-gray-700 hover:bg-gray-100"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isSubmitting || cargando || !!errorCarga}
              className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting
                ? "Agendando..."
                : "Agendar cita"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
