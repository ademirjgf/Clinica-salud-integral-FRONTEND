
import { create } from "zustand";
import { devtools } from "zustand/middleware";

import * as citasService from "../services/citas";
import { extraerMensajeError } from "../lib/errorHandler";

import type {
  CitaAPI,
  CrearCitaAPI,
  EstadoCita,
} from "../types/citaApi";

interface CitasState {
  citas: CitaAPI[];
  citaSeleccionada: CitaAPI | null;
  cargando: boolean;
  error: string | null;

  cargarTodas: () => Promise<void>;
  cargarPorPaciente: (id: number) => Promise<void>;
  seleccionar: (id: number) => void;
  actualizarEstado: (
    id: number,
    estado: EstadoCita
  ) => Promise<void>;
  agregarCita: (datos: CrearCitaAPI) => Promise<CitaAPI>;
}

export const useCitasStore = create<CitasState>()(
  devtools(
    (set, get) => ({
      citas: [],
      citaSeleccionada: null,
      cargando: false,
      error: null,

      cargarTodas: async () => {
        set(
          { cargando: true, error: null },
          false,
          "citas/cargarInicio"
        );

        try {
          const respuesta = await citasService.getAll();

          set(
            {
              citas: respuesta.data,
              citaSeleccionada: null,
              cargando: false,
            },
            false,
            "citas/cargarExito"
          );
        } catch (error: unknown) {
          set(
            {
              error: extraerMensajeError(error),
              cargando: false,
            },
            false,
            "citas/cargarError"
          );

          throw error;
        }
      },

      cargarPorPaciente: async (id) => {
        set(
          { cargando: true, error: null },
          false,
          "citas/cargarPorPacienteInicio"
        );

        try {
          const respuesta = await citasService.getAll();

          set(
            {
              citas: respuesta.data.filter(
                (cita) => cita.pacienteId === id
              ),
              citaSeleccionada: null,
              cargando: false,
            },
            false,
            "citas/cargarPorPacienteExito"
          );
        } catch (error: unknown) {
          set(
            {
              error: extraerMensajeError(error),
              cargando: false,
            },
            false,
            "citas/cargarPorPacienteError"
          );

          throw error;
        }
      },

      seleccionar: (id) => {
        const cita = get().citas.find(
          (item) => item.id === id
        );

        set(
          { citaSeleccionada: cita ?? null },
          false,
          "citas/seleccionar"
        );
      },

      actualizarEstado: async (id, estado) => {
        try {
          const respuesta = await citasService.updateEstado(
            id,
            { estado }
          );

          set(
            (actual) => ({
              citas: actual.citas.map((cita) =>
                cita.id === id
                  ? { ...cita, ...respuesta.data }
                  : cita
              ),
              citaSeleccionada:
                actual.citaSeleccionada?.id === id
                  ? {
                      ...actual.citaSeleccionada,
                      ...respuesta.data,
                    }
                  : actual.citaSeleccionada,
              error: null,
            }),
            false,
            "citas/actualizarEstado"
          );
        } catch (error: unknown) {
          set(
            { error: extraerMensajeError(error) },
            false,
            "citas/actualizarEstadoError"
          );

          throw error;
        }
      },

      agregarCita: async (datos) => {
        try {
          const respuesta = await citasService.create(datos);

          set(
            (actual) => ({
              citas: [...actual.citas, respuesta.data],
              error: null,
            }),
            false,
            "citas/agregarCita"
          );

          return respuesta.data;
        } catch (error: unknown) {
          set(
            { error: extraerMensajeError(error) },
            false,
            "citas/agregarCitaError"
          );

          throw error;
        }
      },
    }),
    { name: "CitasStore" }
  )
);
