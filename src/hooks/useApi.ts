
import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { extraerMensajeError } from "../lib/errorHandler";

interface UseApiResultado<T> {
  data: T | null;
  cargando: boolean;
  error: string | null;
  recargar: () => void;
}

export function useApi<T>(
  peticion: (signal: AbortSignal) => Promise<T>
): UseApiResultado<T> {
  const [data, setData] = useState<T | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);

  const recargar = useCallback(() => {
    setVersion((actual) => actual + 1);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function cargar() {
      setCargando(true);
      setError(null);

      try {
        const resultado = await peticion(controller.signal);

        if (!controller.signal.aborted) {
          setData(resultado);
        }
      } catch (err: unknown) {
        if (!controller.signal.aborted) {
          setError(extraerMensajeError(err));
        }
      } finally {
        if (!controller.signal.aborted) {
          setCargando(false);
        }
      }
    }

    void cargar();

    return () => {
      controller.abort();
    };
  }, [peticion, version]);

  return {
    data,
    cargando,
    error,
    recargar,
  };
}
