
import { useState } from 'react';
import PaginaDashboard from './pages/PaginaDashboard';
import PaginaPacientes from './pages/PaginaPacientes';

function App() {
  const [paginaActual, setPaginaActual] = useState<'dashboard' | 'pacientes'>(
    'dashboard'
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="flex flex-wrap gap-3 border-b border-gray-200 bg-white p-4">
        <button
          type="button"
          onClick={() => setPaginaActual('dashboard')}
          className={`rounded-lg px-4 py-2 font-medium transition ${
            paginaActual === 'dashboard'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Dashboard
        </button>

        <button
          type="button"
          onClick={() => setPaginaActual('pacientes')}
          className={`rounded-lg px-4 py-2 font-medium transition ${
            paginaActual === 'pacientes'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Pacientes
        </button>
      </nav>

      <main>
        {paginaActual === 'dashboard' ? (
          <PaginaDashboard />
        ) : (
          <PaginaPacientes />
        )}
      </main>
    </div>
  );
}

export default App;
