
import { Route, Routes } from "react-router-dom";

import Layout from "./layouts/Layout";
import RutaProtegida from "./components/auth/RutaProtegida";

import ErrorBoundary from "./shared/components/ErrorBoundary";
import AlertaBanner from "./shared/components/ui/AlertaBanner";

import PaginaDashboard from "./pages/PaginaDashboard";
import PaginaPacientes from "./pages/PaginaPacientes";
import PaginaDetallePaciente from "./pages/PaginaDetallePaciente";
import FormularioCita from "./pages/FormularioCita";
import PaginaCitas from "./pages/PaginaCitas";
import PaginaHistorialCitas from "./pages/PaginaHistorialCitas";
import PaginaReportes from "./pages/PaginaReportes";
import PaginaNotFound from "./pages/PaginaNotFound";
import PaginaLogin from "./pages/PaginaLogin";
import PaginaSinAcceso from "./pages/PaginaSinAcceso";
import PaginaPerfil from "./pages/PaginaPerfil";

export default function App() {
  return (
    <Routes>
      {/* LOGIN - Ruta pública */}
      <Route path="/login" element={<PaginaLogin />} />

      {/* Rutas protegidas por autenticación */}
      <Route element={<RutaProtegida />}>
        <Route element={<Layout />}>

          {/* DASHBOARD */}
          <Route
            path="/"
            element={
              <ErrorBoundary
                fallback={
                  <AlertaBanner
                    tipo="error"
                    mensaje="Ocurrió un error al mostrar el Dashboard."
                  />
                }
              >
                <PaginaDashboard />
              </ErrorBoundary>
            }
          />

          {/* PACIENTES */}
          <Route
            path="/pacientes"
            element={
              <ErrorBoundary
                fallback={
                  <AlertaBanner
                    tipo="error"
                    mensaje="Ocurrió un error al mostrar los pacientes."
                  />
                }
              >
                <PaginaPacientes />
              </ErrorBoundary>
            }
          />

          {/* DETALLE DEL PACIENTE */}
          <Route
            path="/pacientes/:id"
            element={<PaginaDetallePaciente />}
          />

          {/* CITAS AGENDADAS */}
          <Route
            path="/citas"
            element={<PaginaCitas />}
          />

          {/* REGISTRAR NUEVA CITA */}
          <Route
            path="/citas/nueva"
            element={<FormularioCita />}
          />

          {/* PERFIL */}
          <Route
            path="/perfil"
            element={<PaginaPerfil />}
          />

          {/* SIN ACCESO */}
          <Route
            path="/sin-acceso"
            element={<PaginaSinAcceso />}
          />

          {/* HISTORIAL - Solo RECEPCIONISTA */}
          <Route
            element={
              <RutaProtegida
                rolesPermitidos={["RECEPCIONISTA"]}
              />
            }
          >
            <Route
              path="/historial"
              element={
                <ErrorBoundary
                  fallback={
                    <AlertaBanner
                      tipo="error"
                      mensaje="Ocurrió un error al mostrar el historial de citas."
                    />
                  }
                >
                  <PaginaHistorialCitas />
                </ErrorBoundary>
              }
            />
          </Route>

          {/* REPORTES - Solo GERENCIA y ADMIN */}
          <Route
            element={
              <RutaProtegida
                rolesPermitidos={["GERENCIA", "ADMIN"]}
              />
            }
          >
            <Route
              path="/reportes"
              element={
                <ErrorBoundary
                  fallback={
                    <AlertaBanner
                      tipo="error"
                      mensaje="Ocurrió un error al mostrar los reportes."
                    />
                  }
                >
                  <PaginaReportes />
                </ErrorBoundary>
              }
            />
          </Route>

          {/* RUTA NO ENCONTRADA */}
          <Route
            path="*"
            element={<PaginaNotFound />}
          />

        </Route>
      </Route>
    </Routes>
  );
}
