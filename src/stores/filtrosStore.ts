
import { create } from "zustand";
import { devtools } from "zustand/middleware";

import type { EstadoCita } from "../types/citaApi";

type FiltroEstadoCita = EstadoCita | "Todos";

interface FiltrosState {
  // Estados
  queryPacientes: string;
  especialidadFiltro: string;
  estadoCitaFiltro: FiltroEstadoCita;

  // Acciones
  setQueryPacientes: (query: string) => void;
  setEspecialidad: (especialidad: string) => void;
  setEstadoCita: (estado: FiltroEstadoCita) => void;
  resetFiltros: () => void;
}

const filtrosIniciales = {
  queryPacientes: "",
  especialidadFiltro: "",
  estadoCitaFiltro: "Todos" as FiltroEstadoCita,
};

export const useFiltrosStore = create<FiltrosState>()(
  devtools(
    (set) => ({
      ...filtrosIniciales,

      // Actualizar búsqueda de pacientes
      setQueryPacientes: (query) => {
        set(
          { queryPacientes: query },
          false,
          "filtros/setQueryPacientes"
        );
      },

      // Actualizar especialidad
      setEspecialidad: (especialidad) => {
        set(
          { especialidadFiltro: especialidad },
          false,
          "filtros/setEspecialidad"
        );
      },

      // Actualizar filtro de estado de citas
      setEstadoCita: (estado) => {
        set(
          { estadoCitaFiltro: estado },
          false,
          "filtros/setEstadoCita"
        );
      },

      // Restablecer todos los filtros
      resetFiltros: () => {
        set(
          filtrosIniciales,
          false,
          "filtros/resetFiltros"
        );
      },
    }),
    {
      name: "FiltrosStore",
    }
  )
);
