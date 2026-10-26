
import { create } from "zustand";
import { devtools } from "zustand/middleware";

import * as pacientesService from "../services/pacientes";
import { extraerMensajeError } from "../lib/errorHandler";

import type {
  PacienteAPI,
  CrearPacienteAPI,
  ActualizarPacienteAPI,
} from "../types/pacienteApi";

interface PacientesState {
  pacientes: PacienteAPI[];
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

export const usePacientesStore = create<PacientesState>()(
  devtools(
    (set) => ({
      pacientes: [],
      cargando: false,
      error: null,

      cargar: async (query) => {
        set(
          { cargando: true, error: null },
          false,
          "pacientes/cargarInicio"
        );

        try {
          const respuesta = await pacientesService.getAll();

          const pacientesFiltrados = query
            ? respuesta.data.filter((paciente) => {
                const texto =
                  `${paciente.nombre} ${paciente.apellido} ${paciente.email}`
                    .toLowerCase();

                return texto.includes(query.toLowerCase());
              })
            : respuesta.data;

          set(
            {
              pacientes: pacientesFiltrados,
              cargando: false,
            },
            false,
            "pacientes/cargarExito"
          );
        } catch (error: unknown) {
          const mensaje = extraerMensajeError(error);

          set(
            {
              error: mensaje,
              cargando: false,
            },
            false,
            "pacientes/cargarError"
          );

          throw error;
        }
      },

      crear: async (datos) => {
        try {
          const respuesta = await pacientesService.create(datos);

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
              pacientes: estado.pacientes.map((paciente) =>
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
