
import { api } from "../lib/axios";

import type {
  CitaAPI,
  CrearCitaAPI,
  ActualizarEstadoCitaAPI,
} from "../types/citaApi";

import type { RespuestaPaginada } from "../types/api";

export type EstadoFiltroHistorial =
  | "Todos"
  | "Programada"
  | "Completada"
  | "Cancelada";

export interface ParametrosHistorial {
  pagina: number;
  estado: EstadoFiltroHistorial;
  signal?: AbortSignal;
}

// Listado existente: no modificar su comportamiento
export const getAll = () =>
  api.get<CitaAPI[]>("/citas");

export const create = (data: CrearCitaAPI) =>
  api.post<CitaAPI>("/citas", data);

export const updateEstado = (
  id: number,
  data: ActualizarEstadoCitaAPI
) =>
  api.put<CitaAPI>(`/citas/${id}`, data);

// Nuevo endpoint paginado
export const getHistorial = ({
  pagina,
  estado,
  signal,
}: ParametrosHistorial) =>
  api.get<RespuestaPaginada<CitaAPI>>(
    "/citas/historial",
    {
      params: {
        pagina,
        estado,
      },
      signal,
    }
  );
