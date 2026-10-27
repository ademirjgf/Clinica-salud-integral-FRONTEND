
import { Route, Routes } from "react-router-dom";

import Layout from "./layouts/Layout";
import RutaProtegida from "./components/auth/RutaProtegida";

import PaginaDashboard from "./pages/PaginaDashboard";
import PaginaPacientes from "./pages/PaginaPacientes";
import PaginaDetallePaciente from "./pages/PaginaDetallePaciente";
import FormularioCita from "./pages/FormularioCita";
import PaginaCitas from "./pages/PaginaCitas";
import PaginaReportes from "./pages/PaginaReportes";
import PaginaNotFound from "./pages/PaginaNotFound";
import PaginaLogin from "./pages/PaginaLogin";
import PaginaSinAcceso from "./pages/PaginaSinAcceso";

export default function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={<PaginaLogin />}
      />

      <Route element={<RutaProtegida />}>
        <Route element={<Layout />}>
          <Route
            path="/"
            element={<PaginaDashboard />}
          />

          <Route
            path="/pacientes"
            element={<PaginaPacientes />}
          />

          <Route
            path="/pacientes/:id"
            element={<PaginaDetallePaciente />}
          />

          <Route
            path="/citas"
            element={<PaginaCitas />}
          />

          <Route
            path="/citas/nueva"
            element={<FormularioCita />}
          />

          <Route
            path="/sin-acceso"
            element={<PaginaSinAcceso />}
          />

          <Route
            element={
              <RutaProtegida
                rolesPermitidos={["GERENCIA", "ADMIN"]}
              />
            }
          >
            <Route
              path="/reportes"
              element={<PaginaReportes />}
            />
          </Route>

          <Route
            path="*"
            element={<PaginaNotFound />}
          />
        </Route>
      </Route>
    </Routes>
  );
}
