
import { useEffect, useRef, useState } from "react";

interface InputFotoPerfilProps {
  fotoActual: string | null;
  onChange: (archivo: File | null) => void;
}

const MAX_FOTO_BYTES = 5 * 1024 * 1024;

const FORMATOS_PERMITIDOS = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

export default function InputFotoPerfil({
  fotoActual,
  onChange,
}: InputFotoPerfilProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [archivo, setArchivo] = useState<File | null>(null);
  const [error, setError] = useState("");

  const [vistaPrevia, setVistaPrevia] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (!archivo) {
      setVistaPrevia(null);
      return;
    }

    const url = URL.createObjectURL(archivo);
    setVistaPrevia(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [archivo]);

  const seleccionarFoto = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const nuevoArchivo = event.target.files?.[0];

    if (!nuevoArchivo) return;

    if (!FORMATOS_PERMITIDOS.includes(nuevoArchivo.type)) {
      setError("Selecciona una imagen JPG, PNG, WEBP o GIF.");
      event.target.value = "";
      return;
    }

    if (nuevoArchivo.size > MAX_FOTO_BYTES) {
      setError("La fotografía no puede superar los 5 MB.");
      event.target.value = "";
      return;
    }

    setError("");
    setArchivo(nuevoArchivo);
    onChange(nuevoArchivo);
  };

  const imagen = vistaPrevia || fotoActual;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4 border-blue-100 bg-blue-50">
        {imagen ? (
          <img
            src={imagen}
            alt="Fotografía de perfil"
            className="h-full w-full object-cover"
          />
        ) : (
          <span
            aria-label="Sin fotografía"
            className="text-5xl text-blue-500"
          >
            👤
          </span>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={seleccionarFoto}
        aria-label="Seleccionar fotografía de perfil"
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="rounded-lg border border-blue-600 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50"
      >
        Seleccionar fotografía
      </button>

      <p className="text-center text-xs text-gray-500">
        JPG, PNG, WEBP o GIF. Máximo 5 MB.
      </p>

      {error && (
        <p role="alert" className="text-center text-sm text-red-600">
          {error}
        </p>
      )}

      {archivo && !error && (
        <p className="text-center text-sm text-green-700">
          Imagen seleccionada. Guarda los cambios para subirla.
        </p>
      )}
    </div>
  );
}
