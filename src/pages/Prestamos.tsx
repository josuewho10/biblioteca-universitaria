import React, { useState, useEffect } from 'react';
import { 
  Search, 
  BookOpen, 
  UserCheck, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  PlusCircle 
} from 'lucide-react';
import { getLibros, actualizarStock } from '../utils/storage';

interface Libro {
  id: string;
  titulo: string;
  autor: string;
  isbn: string;
  categoria: string;
  stock: number;
}

interface Usuario {
  codigo: string;
  nombres: string;
  apellidos: string;
  correo: string;
  tipo: 'Estudiante' | 'Docente';
}

interface Prestamo {
  id: string;
  usuarioCodigo: string;
  libroId: string;
  libroTitulo: string;
  fechaPrestamo: string;
  fechaDevolucion: string;
  estado: 'Activo' | 'Devuelto';
}

export default function Prestamos() {
  const [libros, setLibros] = useState<Libro[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [prestamos, setPrestamos] = useState<Prestamo[]>([]);
  
  const [busqueda, setBusqueda] = useState('');
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState('');
  const [libroSeleccionado, setLibroSeleccionado] = useState<Libro | null>(null);
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });

  useEffect(() => {
    // Cargar libros con la función del utilitario de Andrade
    const librosGuardados = getLibros() as Libro[];
    const usuariosGuardados = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const prestamosGuardados = JSON.parse(localStorage.getItem('prestamos') || '[]');

    setLibros(librosGuardados);
    setUsuarios(usuariosGuardados);
    setPrestamos(prestamosGuardados);
  }, []);

  // Filtrar libros por título o categoría
  const librosFiltrados = libros.filter(
    (libro) =>
      libro.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      libro.categoria.toLowerCase().includes(busqueda.toLowerCase())
  );

  const handleSolicitarPrestamo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuarioSeleccionado || !libroSeleccionado) {
      setMensaje({ texto: 'Por favor, seleccione un usuario y un libro.', tipo: 'error' });
      return;
    }

    // Validación de stock
    if (libroSeleccionado.stock === 0) {
      setMensaje({ texto: 'No se puede realizar el préstamo: El libro está agotado.', tipo: 'error' });
      return;
    }

    // Restar 1 al stock mediante la utilidad de Andrade
    const stockActualizadoExitoso = actualizarStock(libroSeleccionado.id, -1);
    if (!stockActualizadoExitoso) {
      setMensaje({ texto: 'Error al actualizar el stock del libro.', tipo: 'error' });
      return;
    }

    const hoy = new Date();
    const fechaDevolucion = new Date();
    fechaDevolucion.setDate(hoy.getDate() + 7);

    const codigoUnicoPrestamo = 'PRES-' + Date.now().toString().slice(-6);

    const nuevoPrestamo: Prestamo = {
      id: codigoUnicoPrestamo,
      usuarioCodigo: usuarioSeleccionado,
      libroId: libroSeleccionado.id,
      libroTitulo: libroSeleccionado.titulo,
      fechaPrestamo: hoy.toISOString().split('T')[0],
      fechaDevolucion: fechaDevolucion.toISOString().split('T')[0],
      estado: 'Activo',
    };

    const prestamosActualizados = [...prestamos, nuevoPrestamo];

    // Actualizar LocalStorage
    localStorage.setItem('prestamos', JSON.stringify(prestamosActualizados));

    // Refrescar lista de libros desde el storage actualizado
    setLibros(getLibros() as Libro[]);
    setPrestamos(prestamosActualizados);
    setLibroSeleccionado(null);
    setUsuarioSeleccionado('');
    setMensaje({ 
      texto: `¡Préstamo registrado exitosamente! Código único: ${codigoUnicoPrestamo}`, 
      tipo: 'exito' 
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Encabezado */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-blue-600" />
          Módulo de Solicitud y Préstamos
        </h1>
        <p className="text-gray-500 mt-1">
          Busca libros, verifica su disponibilidad e ingresa las solicitudes de préstamo.
        </p>
      </div>

      {/* Alertas */}
      {mensaje.texto && (
        <div className={`p-4 rounded-lg flex items-center gap-3 font-medium ${
          mensaje.tipo === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'
        }`}>
          {mensaje.tipo === 'error' ? (
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
          ) : (
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
          )}
          <span>{mensaje.texto}</span>
        </div>
      )}

      {/* Formulario de Registrar Préstamo */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-blue-600" />
          Registrar Nuevo Préstamo
        </h2>
        <form onSubmit={handleSolicitarPrestamo} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Seleccionar Usuario
            </label>
            <select
              value={usuarioSeleccionado}
              onChange={(e) => setUsuarioSeleccionado(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              required
            >
              <option value="">-- Seleccione un usuario --</option>
              {usuarios.map((u) => (
                <option key={u.codigo} value={u.codigo}>
                  {u.nombres} {u.apellidos} ({u.codigo})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Libro Seleccionado
            </label>
            <input
              type="text"
              readOnly
              value={libroSeleccionado ? `${libroSeleccionado.titulo} (Stock: ${libroSeleccionado.stock})` : 'Ningún libro seleccionado'}
              className="w-full border border-gray-200 bg-gray-50 text-gray-600 rounded-lg p-2.5 text-sm font-medium"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition duration-150 shadow-sm"
            >
              <PlusCircle className="w-5 h-5" />
              Confirmar Préstamo
            </button>
          </div>
        </form>
      </div>

      {/* Búsqueda y Tabla de Libros */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Catálogo y Disponibilidad
          </h2>
          
          {/* Barra de Búsqueda */}
          <div className="relative w-full md:w-80">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por título o categoría..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
          </div>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Título</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Autor</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Categoría</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Acción</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {librosFiltrados.map((libro) => (
                <tr key={libro.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{libro.titulo}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{libro.autor}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md text-xs font-medium">
                      {libro.categoria}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">{libro.stock}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {libro.stock > 0 ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Disponible
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full bg-red-50 text-red-700 border border-red-200">
                        <XCircle className="w-3.5 h-3.5" />
                        Agotado
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                    <button
                      type="button"
                      onClick={() => setLibroSeleccionado(libro)}
                      disabled={libro.stock === 0}
                      className={`py-1.5 px-4 rounded-lg text-xs font-medium transition ${
                        libro.stock > 0 
                          ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm' 
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                      }`}
                    >
                      {libro.stock > 0 ? 'Seleccionar' : 'Agotado'}
                    </button>
                  </td>
                </tr>
              ))}
              {librosFiltrados.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-500">
                    No se encontraron libros coincidentes.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}