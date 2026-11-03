
import { z } from "zod";

export const perfilSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(3, "El nombre debe tener al menos 3 caracteres"),

  email: z
    .email("Ingresa un correo electrónico válido"),

  telefono: z
    .string()
    .refine(
      (valor) =>
        valor === "" || /^[0-9]{8,15}$/.test(valor),
      "El teléfono debe contener entre 8 y 15 dígitos"
    ),
});

export type PerfilFormData = z.infer<typeof perfilSchema>;
