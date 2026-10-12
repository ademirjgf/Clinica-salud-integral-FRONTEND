interface StatusBadgeProps {
  activo: boolean;
}

export default function StatusBadge({ activo }: StatusBadgeProps) {
  const estilos = activo
    ? 'bg-emerald-100 text-emerald-700'
    : 'bg-rose-100 text-rose-700';

  const texto = activo
    ? 'Sistema Operativo'
    : 'Modo Mantenimiento';

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${estilos}`}
    >
      <span className="h-2 w-2 rounded-full bg-current" />
      {texto}
    </span>
  );
}