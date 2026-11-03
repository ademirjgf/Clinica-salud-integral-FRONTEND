
import axios from "axios";

interface ErrorBackend {
  message?: string | string[];
  error?: string;
}

export function extraerMensajeError(
  err: unknown
): string {
  if (axios.isAxiosError<ErrorBackend>(err)) {
    const mensaje = err.response?.data?.message;

    if (Array.isArray(mensaje)) {
      return mensaje.join(", ");
    }

    if (typeof mensaje === "string") {
      return mensaje;
    }

    return err.message || "Error del servidor";
  }

  if (err instanceof Error) {
    return err.message;
  }

  return "Error inesperado";
}
