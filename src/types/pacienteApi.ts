
export interface PacienteAPI {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  fechaNacimiento: string;
  fechaRegistro: string;
}

export interface CrearPacienteAPI {
  nombre: string;
  apellido: string;
  email: string;
  fechaNacimiento: string;
}
