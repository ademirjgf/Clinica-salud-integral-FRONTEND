
interface BuscadorPacientesProps {
  value: string;
  onChange: (value: string) => void;
}

export default function BuscadorPacientes({
  value,
  onChange,
}: BuscadorPacientesProps) {
  return (
    <div className="w-full">
      <label
        htmlFor="buscar-pacientes"
        className="mb-2 block text-sm font-medium text-gray-700"
      >
        Buscar pacientes
      </label>

      <input
        id="buscar-pacientes"
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Nombre, apellido o correo..."
        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </div>
  );
}
