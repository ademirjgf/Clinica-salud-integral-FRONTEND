
import { api } from "../lib/axios";

import type {
  CitaAPI,
  CrearCitaAPI,
  ActualizarEstadoCitaAPI,
} from "../types/citaApi";

export const getAll = () =>
  api.get<CitaAPI[]>("/citas");

export const create = (data: CrearCitaAPI) =>
  api.post<CitaAPI>("/citas", data);

export const updateEstado = (
  id: number,
  data: ActualizarEstadoCitaAPI
) =>
  api.put<CitaAPI>(`/citas/${id}`, data);
