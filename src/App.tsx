
import { Route, Routes } from "react-router-dom";

import Layout from "./layouts/Layout";
import PaginaDashboard from "./pages/PaginaDashboard";
import PaginaPacientes from "./pages/PaginaPacientes";
import PaginaDetallePaciente from "./pages/PaginaDetallePaciente";
import FormularioCita from "./pages/FormularioCita";
import PaginaNotFound from "./pages/PaginaNotFound";

export default function App() {
  return (
    <Routes>
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
    </Routes>
  );
}
