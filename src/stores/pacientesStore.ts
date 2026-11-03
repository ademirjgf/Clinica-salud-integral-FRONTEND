
import { create } from "zustand";
import { devtools } from "zustand/middleware";

import * as pacientesService from "../services/pacientes";
import { extraerMensajeError } from "../lib/errorHandler";

import type {
  PacienteAPI,
  CrearPacienteAPI,
  ActualizarPacienteAPI,
} from "../types/pacienteApi";

import type { RespuestaPaginada } from "../types/api";

interface PacientesState {
  pacientes: PacienteAPI[];
  paginacion: RespuestaPaginada<PacienteAPI> | null;
  cargando: boolean;
  error: string | null;

  cargar: (query?: string) => Promise<void>;
  crear: (datos: CrearPacienteAPI) => Promise<void>;
  actualizar: (
    id: number,
    datos: ActualizarPacienteAPI
  ) => Promise<void>;
  eliminar: (id: number) => Promise<void>;
}

let controladorActual: AbortController | null = null;

export const usePacientesStore = create<PacientesState>()(
  devtools(
    (set) => ({
      pacientes: [],
      paginacion: null,
      cargando: false,
      error: null,

      cargar: async (query) => {
        controladorActual?.abort();

        const controlador = new AbortController();
        controladorActual = controlador;

        set(
          { cargando: true, error: null },
          false,
          "pacientes/cargarInicio"
        );

        try {
          const respuesta = await pacientesService.getAll(
            query,
            controlador.signal
          );

          if (controlador.signal.aborted) return;

          set(
            {
              pacientes: respuesta.data.data,
              paginacion: respuesta.data,
              cargando: false,
              error: null,
            },
            false,
            "pacientes/cargarExito"
          );
        } catch (error: unknown) {
          if (controlador.signal.aborted) return;

          set(
            {
              error: extraerMensajeError(error),
              cargando: false,
            },
            false,
            "pacientes/cargarError"
          );

          throw error;
        } finally {
          if (controladorActual === controlador) {
            controladorActual = null;
          }
        }
      },

      crear: async (datos) => {
        try {
          const respuesta = await pacientesService.create(
            datos
          );

          set(
            (estado) => ({
              pacientes: [
                ...estado.pacientes,
                respuesta.data,
              ],
              error: null,
            }),
            false,
            "pacientes/crear"
          );
        } catch (error: unknown) {
          set(
            { error: extraerMensajeError(error) },
            false,
            "pacientes/crearError"
          );

          throw error;
        }
      },

      actualizar: async (id, datos) => {
        try {
          const respuesta = await pacientesService.update(
            id,
            datos
          );

          set(
            (estado) => ({
              pacientes: estado.pacientes.map(
                (paciente) =>
                  paciente.id === id
                    ? respuesta.data
                    : paciente
              ),
              error: null,
            }),
            false,
            "pacientes/actualizar"
          );
        } catch (error: unknown) {
          set(
            { error: extraerMensajeError(error) },
            false,
            "pacientes/actualizarError"
          );

          throw error;
        }
      },

      eliminar: async (id) => {
        try {
          await pacientesService.remove(id);

          set(
            (estado) => ({
              pacientes: estado.pacientes.filter(
                (paciente) => paciente.id !== id
              ),
              error: null,
            }),
            false,
            "pacientes/eliminar"
          );
        } catch (error: unknown) {
          set(
            { error: extraerMensajeError(error) },
            false,
            "pacientes/eliminarError"
          );

          throw error;
        }
      },
    }),
    { name: "PacientesStore" }
  )
);
