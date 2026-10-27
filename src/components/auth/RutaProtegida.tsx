
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";

export default function RutaProtegida() {
  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated
  );

  const token = useAuthStore((state) => state.token);

  if (!isAuthenticated || !token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
