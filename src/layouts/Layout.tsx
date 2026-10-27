
import {
  NavLink,
  Outlet,
  useNavigate,
} from "react-router-dom";

import { useAuthStore } from "../stores/authStore";

export default function Layout() {
  const navigate = useNavigate();

  const usuario = useAuthStore(
    (state) => state.usuario
  );

  const logout = useAuthStore(
    (state) => state.logout
  );

  const estiloEnlace = ({
    isActive,
  }: {
    isActive: boolean;
  }) =>
    `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
      isActive
        ? "bg-blue-600 text-white"
        : "text-gray-700 hover:bg-gray-100"
    }`;

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50 md:flex">
      <aside className="border-b border-gray-200 bg-white md:fixed md:inset-y-0 md:left-0 md:w-64 md:border-b-0 md:border-r">
        <div className="border-b border-gray-200 p-5">
          <h2 className="text-xl font-bold text-blue-700">
            Clínica Salud Integral
          </h2>

          <p className="mt-1 text-xs text-gray-500">
            Panel de administración
          </p>
        </div>

        <nav
          aria-label="Navegación principal"
          className="flex gap-2 overflow-x-auto p-3 md:flex-col md:p-4"
        >
          <NavLink
            to="/"
            end
            className={estiloEnlace}
          >
            <span aria-hidden="true">📊</span>
            Dashboard
          </NavLink>

          <NavLink
            to="/pacientes"
            className={estiloEnlace}
          >
            <span aria-hidden="true">👥</span>
            Pacientes
          </NavLink>

          <NavLink
            to="/citas"
            end
            className={estiloEnlace}
          >
            <span aria-hidden="true">📋</span>
            Citas agendadas
          </NavLink>

          <NavLink
            to="/citas/nueva"
            className={estiloEnlace}
          >
            <span aria-hidden="true">📅</span>
            Nueva cita
          </NavLink>

          <NavLink
            to="/reportes"
            className={estiloEnlace}
          >
            <span aria-hidden="true">📈</span>
            Reportes
          </NavLink>
        </nav>

        <div className="hidden border-t border-gray-200 p-4 text-xs text-gray-400 md:absolute md:bottom-0 md:block md:w-full">
          Clínica Salud Integral — MP3
        </div>
      </aside>

      <div className="min-w-0 flex-1 md:ml-64">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 bg-white px-6 py-4">
          <div>
            <p className="text-sm font-semibold text-gray-800">
              {usuario?.email ?? "Usuario"}
            </p>

            <p className="text-xs text-gray-500">
              Rol: {usuario?.rol ?? "Sin rol"}
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
          >
            Cerrar sesión
          </button>
        </header>

        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
