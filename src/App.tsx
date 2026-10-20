import { Route, Routes } from "react-router-dom";

import Layout from "./layouts/Layout";
import RutaProtegida from "./components/auth/RutaProtegida";

import PaginaDashboard from "./pages/PaginaDashboard";
import PaginaPacientes from "./pages/PaginaPacientes";
import PaginaDetallePaciente from "./pages/PaginaDetallePaciente";
import FormularioCita from "./pages/FormularioCita";
import PaginaNotFound from "./pages/PaginaNotFound";
import PaginaLogin from "./pages/PaginaLogin";

export default function App() {
  return (
    <Routes>
      {/* Ruta pública */}
      <Route path="/login" element={<PaginaLogin />} />

      {/* Rutas que requieren autenticación */}
      <Route element={<RutaProtegida />}>
        <Route element={<Layout />}>
          <Route path="/" element={<PaginaDashboard />} />

          <Route path="/pacientes" element={<PaginaPacientes />} />

          <Route
            path="/pacientes/:id"
            element={<PaginaDetallePaciente />}
          />

          <Route path="/citas/nueva" element={<FormularioCita />} />

          <Route path="*" element={<PaginaNotFound />} />
        </Route>
      </Route>
    </Routes>
  );
}