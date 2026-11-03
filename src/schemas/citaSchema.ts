
import { z } from "zod";

// Obtener la fecha actual en formato YYYY-MM-DD
// utilizando la zona horaria local.
export function obtenerFechaLocal(): string {
  const hoy = new Date();

  const anio = hoy.getFullYear();
  const mes = String(hoy.getMonth() + 1).padStart(2, "0");
  const dia = String(hoy.getDate()).padStart(2, "0");

  return `${anio}-${mes}-${dia}`;
}

// Reglas de validación del formulario de citas.
export const citaSchema = z.object({
  pacienteNombre: z
    .string()
    .trim()
    .min(3, "El nombre debe tener al menos 3 caracteres."),

  medicoId: z
    .string()
    .min(1, "Debes seleccionar un médico."),

  fecha: z
    .string()
    .regex(
      /^\d{4}-\d{2}-\d{2}$/,
      "La fecha debe tener formato YYYY-MM-DD.",
    )
    .refine((fecha) => {
      const fechaValida = new Date(`${fecha}T12:00:00`);

      return (
        !Number.isNaN(fechaValida.getTime()) &&
        fechaValida.getFullYear() === Number(fecha.slice(0, 4)) &&
        fechaValida.getMonth() + 1 === Number(fecha.slice(5, 7)) &&
        fechaValida.getDate() === Number(fecha.slice(8, 10))
      );
    }, "Debes ingresar una fecha válida.")
    .refine(
      (fecha) => fecha >= obtenerFechaLocal(),
      "La fecha no puede ser anterior a hoy.",
    ),

  hora: z
    .string()
    .regex(
      /^([01]\d|2[0-3]):[0-5]\d$/,
      "La hora debe tener formato HH:MM (00:00 a 23:59).",
    ),

  motivo: z
    .string()
    .trim()
    .min(10, "El motivo debe tener al menos 10 caracteres.")
    .max(500, "El motivo no puede superar los 500 caracteres."),

  urgencia: z.enum(["baja", "media", "alta", "critica"]),
});

// TypeScript obtiene el tipo automáticamente desde Zod.
export type CitaFormData = z.infer<typeof citaSchema>;
