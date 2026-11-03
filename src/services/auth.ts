
import { api } from "../lib/axios";
import type { LoginFormData } from "../schemas/loginSchema";

export interface Usuario {
  id: number;
  email: string;
  rol: string;
  nombre: string | null;
  telefono: string | null;
  foto: string | null;
}

export interface LoginResponse {
  token: string;
  usuario: Usuario;
}

export async function login(
  datos: LoginFormData
): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>(
    "/auth/login",
    datos
  );

  return data;
}
