
import { api } from "../lib/axios";
import type { Usuario } from "./auth";

export interface PerfilResponse {
  usuario: Usuario;
}

export async function actualizarPerfil(
  datos: FormData
): Promise<PerfilResponse> {
  const { data } = await api.put<PerfilResponse>(
    "/auth/perfil",
    datos
  );

  return data;
}
