
import { useEffect, useState } from "react";

export interface Medico {
  id: string;
  nombre: string;
  especialidad: string;
}

const medicosSimulados: Medico[] = [
  {
    id: "med-001",
    nombre: "Dra. Ana García",
    especialidad: "Medicina General",
  },
  {
    id: "med-002",
    nombre: "Dr. Carlos Ramírez",
    especialidad: "Cardiología",
  },
  {
    id: "med-003",
    nombre: "Dra. Lucía Torres",
    especialidad: "Pediatría",
  },
  {
    id: "med-004",
    nombre: "Dr. Miguel Fernández",
    especialidad: "Traumatología",
  },
];

export function useMedicos() {
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMedicos(medicosSimulados);
      setCargando(false);
    }, 800);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return { medicos, cargando };
}
