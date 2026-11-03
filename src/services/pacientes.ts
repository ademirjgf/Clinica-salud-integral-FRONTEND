
import { api } from "../lib/axios";

import type {
  PacienteAPI,
  CrearPacienteAPI,
  ActualizarPacienteAPI,
} from "../types/pacienteApi";

import type { RespuestaPaginada } from "../types/api";

export const getAll = (
  query?: string,
  signal?: AbortSignal
) =>
  api.get<RespuestaPaginada<PacienteAPI>>(
    "/pacientes",
    {
      params: {
        query,
        pagina: 1,
        limite: 100,
      },
      signal,
    }
  );

export const create = (data: CrearPacienteAPI) =>
  api.post<PacienteAPI>("/pacientes", data);

export const update = (
  id: number,
  data: ActualizarPacienteAPI
) =>
  api.put<PacienteAPI>(
    `/pacientes/${id}`,
    data
  );

export const remove = (id: number) =>
  api.delete(`/pacientes/${id}`);
