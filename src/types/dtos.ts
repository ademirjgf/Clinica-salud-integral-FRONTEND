
import type { PacienteAPI } from "./pacienteApi";
import type { CitaAPI } from "./citaApi";

export type CrearPacienteDTO = Omit<
  PacienteAPI,
  "id" | "fechaRegistro"
>;

export type ActualizarPacienteDTO =
  Partial<CrearPacienteDTO>;

export type ResumenPaciente = Pick<
  PacienteAPI,
  "id" | "nombre" | "apellido" | "email"
>;

export type CrearCitaDTO = Omit<
  CitaAPI,
  "id" | "estado" | "paciente"
>;

export type ActualizarEstadoCitaDTO = Pick<
  CitaAPI,
  "estado"
>;

export type ResumenCita = Pick<
  CitaAPI,
  "id" | "pacienteId" | "medicoId" | "fechaHora" | "estado"
>;
