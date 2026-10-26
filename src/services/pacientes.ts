
import { api } from "../lib/axios";

import type {
  PacienteAPI,
  CrearPacienteAPI,
  ActualizarPacienteAPI,
} from "../types/pacienteApi";

export const getAll = () =>
  api.get<PacienteAPI[]>("/pacientes");

export const create = (data: CrearPacienteAPI) =>
  api.post<PacienteAPI>("/pacientes", data);

export const update = (
  id: number,
  data: ActualizarPacienteAPI
) =>
  api.put<PacienteAPI>(`/pacientes/${id}`, data);

export const remove = (id: number) =>
  api.delete(`/pacientes/${id}`);
