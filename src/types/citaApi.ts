
export type EstadoCita =
  | "PROGRAMADA"
  | "COMPLETADA"
  | "CANCELADA";

export interface CitaAPI {
  id: number;
  pacienteId: number;
  medicoId: number;
  fechaHora: string;
  estado: EstadoCita;
  paciente?: {
    id: number;
    nombre: string;
    apellido: string;
  };
}

export type CrearCitaAPI = Omit<CitaAPI, "id" | "estado" | "paciente">;

export type ActualizarEstadoCitaAPI = Pick<CitaAPI, "estado">;
