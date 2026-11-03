
export interface PacienteAPI {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  fechaNacimiento: string;
  fechaRegistro: string;
}

export type CrearPacienteAPI = Omit<
  PacienteAPI,
  "id" | "fechaRegistro"
>;

export type ActualizarPacienteAPI = Partial<CrearPacienteAPI>;
