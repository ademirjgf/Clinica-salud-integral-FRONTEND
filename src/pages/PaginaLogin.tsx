
import { useState } from "react";
import {
  useForm,
  type SubmitHandler,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Navigate, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  loginSchema,
  type LoginFormData,
} from "../schemas/loginSchema";

import { login } from "../services/auth";
import { useAuthStore } from "../stores/authStore";
import { extraerMensajeError } from "../lib/errorHandler";

export default function PaginaLogin() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.login);
  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated
  );

  const [cargando, setCargando] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<LoginFormData> = async (
    datos
  ) => {
    setCargando(true);

    try {
      const { token, usuario } = await login(datos);

      setAuth(token, usuario);
      toast.success("¡Bienvenido!");

      navigate("/", { replace: true });
    } catch (err: unknown) {
      toast.error(extraerMensajeError(err));
    } finally {
      setCargando(false);
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <h1 className="mb-2 text-center text-2xl font-bold text-slate-800">
          Clínica Salud Integral
        </h1>

        <p className="mb-6 text-center text-slate-500">
          Iniciar sesión
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-4"
        >
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium"
            >
              Correo electrónico
            </label>

            <input
              id="email"
              type="email"
              autoComplete="username"
              placeholder="recepcion@clinica.com"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={
                errors.email ? "email-error" : undefined
              }
              {...register("email")}
              className={`w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.email
                  ? "border-red-500"
                  : "border-slate-300"
              }`}
            />

            {errors.email && (
              <p
                id="email-error"
                role="alert"
                className="mt-1 text-sm text-red-600"
              >
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium"
            >
              Contraseña
            </label>

            <input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="Ingresa tu contraseña"
              aria-invalid={Boolean(errors.password)}
              aria-describedby={
                errors.password
                  ? "password-error"
                  : undefined
              }
              {...register("password")}
              className={`w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.password
                  ? "border-red-500"
                  : "border-slate-300"
              }`}
            />

            {errors.password && (
              <p
                id="password-error"
                role="alert"
                className="mt-1 text-sm text-red-600"
              >
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={cargando}
            className="w-full rounded-lg bg-blue-600 p-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {cargando ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </div>
    </main>
  );
}
