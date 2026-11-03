
import { useState } from "react";
import {
  useForm,
  type SubmitHandler,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import InputFotoPerfil from "../components/perfil/InputFotoPerfil";
import {
  perfilSchema,
  type PerfilFormData,
} from "../schemas/perfilSchema";
import { actualizarPerfil } from "../services/perfil";
import { useAuthStore } from "../stores/authStore";
import { extraerMensajeError } from "../lib/errorHandler";

const API_URL = import.meta.env.VITE_API_URL as string;

function obtenerUrlFoto(foto: string | null | undefined) {
  if (!foto) return null;

  if (foto.startsWith("http://") || foto.startsWith("https://")) {
    return foto;
  }

  return `${API_URL.replace(/\/$/, "")}/${foto.replace(/^\//, "")}`;
}

export default function PaginaPerfil() {
  const usuario = useAuthStore((state) => state.usuario);

  const actualizarUsuario = useAuthStore(
    (state) => state.actualizarUsuario
  );

  const [foto, setFoto] = useState<File | null>(null);
  const [guardando, setGuardando] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PerfilFormData>({
    resolver: zodResolver(perfilSchema),
    defaultValues: {
      nombre: usuario?.nombre ?? "",
      email: usuario?.email ?? "",
      telefono: usuario?.telefono ?? "",
    },
  });

  const onSubmit: SubmitHandler<PerfilFormData> = async (
    datos
  ) => {
    setGuardando(true);

    try {
      const formData = new FormData();

      formData.append("nombre", datos.nombre.trim());
      formData.append("email", datos.email.trim());

      if (datos.telefono.trim()) {
        formData.append("telefono", datos.telefono.trim());
      }

      if (foto) {
        formData.append("foto", foto);
      }

      const respuesta = await actualizarPerfil(formData);

      actualizarUsuario(respuesta.usuario);

      reset({
        nombre: respuesta.usuario.nombre ?? "",
        email: respuesta.usuario.email,
        telefono: respuesta.usuario.telefono ?? "",
      });

      setFoto(null);
      toast.success("Perfil actualizado correctamente");
    } catch (error: unknown) {
      toast.error(extraerMensajeError(error));
    } finally {
      setGuardando(false);
    }
  };

  if (!usuario) {
    return (
      <div className="p-6 text-gray-600">
        No se encontró información del usuario.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Mi perfil
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Actualiza tu información personal y fotografía.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <InputFotoPerfil
  key={usuario.foto ?? "sin-foto"}
  fotoActual={obtenerUrlFoto(usuario.foto)}
  onChange={setFoto}
/>

        <div>
          <label
            htmlFor="perfil-nombre"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Nombre completo
          </label>

          <input
            id="perfil-nombre"
            type="text"
            autoComplete="name"
            {...register("nombre")}
            aria-invalid={Boolean(errors.nombre)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />

          {errors.nombre && (
            <p role="alert" className="mt-1 text-sm text-red-600">
              {errors.nombre.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="perfil-email"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Correo electrónico
          </label>

          <input
            id="perfil-email"
            type="email"
            autoComplete="email"
            {...register("email")}
            aria-invalid={Boolean(errors.email)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />

          {errors.email && (
            <p role="alert" className="mt-1 text-sm text-red-600">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="perfil-telefono"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Teléfono (opcional)
          </label>

          <input
            id="perfil-telefono"
            type="tel"
            autoComplete="tel"
            {...register("telefono")}
            aria-invalid={Boolean(errors.telefono)}
            placeholder="987654321"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />

          {errors.telefono && (
            <p role="alert" className="mt-1 text-sm text-red-600">
              {errors.telefono.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={guardando}
          className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {guardando ? "Guardando cambios..." : "Guardar cambios"}
        </button>
      </form>
    </div>
  );
}
