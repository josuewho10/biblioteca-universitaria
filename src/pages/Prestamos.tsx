import { useState, useEffect } from "react";
import {
  Search,
  BookOpen,
  UserCheck,
  CheckCircle,
  XCircle,
  AlertCircle,
  PlusCircle,
} from "lucide-react";
import type { Libro, Usuario, Prestamo } from "../types";
import { StorageKeys, getStorage, setStorage } from "../utils/storage";

export default function Prestamos() {
  const [libros, setLibros] = useState<Libro[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [prestamos, setPrestamos] = useState<Prestamo[]>([]);

  const [busqueda, setBusqueda] = useState("");
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState("");
  const [libroSeleccionado, setLibroSeleccionado] = useState<Libro | null>(
    null,
  );
  const [mensaje, setMensaje] = useState({ texto: "", tipo: "" });

  const cargarDatos = () => {
    const librosGuardados = getStorage<Libro[]>(StorageKeys.LIBROS, []);
    const usuariosGuardados = getStorage<Usuario[]>(StorageKeys.USUARIOS, []);
    const prestamosGuardados = getStorage<Prestamo[]>(
      StorageKeys.PRESTAMOS,
      [],
    );

    setLibros(librosGuardados);
    setUsuarios(usuariosGuardados);
    setPrestamos(prestamosGuardados);
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const librosFiltrados = libros.filter(
    (libro) =>
      libro.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      libro.categoriaId.toLowerCase().includes(busqueda.toLowerCase()),
  );

  const handleSolicitarPrestamo = (e: React.FormEvent) => {
    e.preventDefault();

    if (!usuarioSeleccionado || !libroSeleccionado) {
      setMensaje({
        texto: "Por favor, seleccione un usuario y un libro.",
        tipo: "error",
      });
      return;
    }

    if (libroSeleccionado.stock === 0) {
      setMensaje({
        texto: "No se puede realizar el préstamo: El libro está agotado.",
        tipo: "error",
      });
      return;
    }

    // Restar 1 al stock
    const librosActualizados = libros.map((libro) =>
      libro.id === libroSeleccionado.id
        ? { ...libro, stock: libro.stock - 1 }
        : libro,
    );
    setLibros(librosActualizados);
    setStorage(StorageKeys.LIBROS, librosActualizados);

    const hoy = new Date();
    const fechaDevolucion = new Date();
    fechaDevolucion.setDate(hoy.getDate() + 7);

    const codigoUnicoPrestamo = "PRES-" + Date.now().toString().slice(-6);

    const nuevoPrestamo: Prestamo = {
      id: codigoUnicoPrestamo,
      usuarioCodigo: usuarioSeleccionado,
      libroId: libroSeleccionado.id,
      fechaPrestamo: hoy.toISOString().split("T")[0],
      fechaLimite: fechaDevolucion.toISOString().split("T")[0],
      estado: "Activo",
    };

    const prestamosActualizados = [...prestamos, nuevoPrestamo];
    setPrestamos(prestamosActualizados);
    setStorage(StorageKeys.PRESTAMOS, prestamosActualizados);

    cargarDatos();
    setLibroSeleccionado(null);
    setUsuarioSeleccionado("");
    setMensaje({
      texto: `¡Préstamo registrado exitosamente! Código: ${codigoUnicoPrestamo}`,
      tipo: "exito",
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
          <BookOpen className="w-8 h-8 text-blue-600" />
          Solicitud y Préstamos de Libros
        </h1>
        <p className="text-slate-600 mt-1">
          Busca libros, verifica disponibilidad y registra préstamos
        </p>
      </div>

      {/* Mensajes */}
      {mensaje.texto && (
        <div
          className={`p-4 rounded-lg mb-6 flex items-center gap-3 ${
            mensaje.tipo === "error"
              ? "bg-red-100 border border-red-400 text-red-700"
              : "bg-emerald-100 border border-emerald-400 text-emerald-700"
          }`}
        >
          {mensaje.tipo === "error" ? (
            <AlertCircle className="w-5 h-5" />
          ) : (
            <CheckCircle className="w-5 h-5" />
          )}
          {mensaje.texto}
        </div>
      )}

      {/* Formulario de Préstamo */}
      <div className="bg-white border-2 border-slate-200 rounded-xl p-6 mb-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-blue-600" />
          Registrar Nuevo Préstamo
        </h2>

        <form
          onSubmit={handleSolicitarPrestamo}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Seleccionar Usuario
            </label>
            <select
              value={usuarioSeleccionado}
              onChange={(e) => setUsuarioSeleccionado(e.target.value)}
              className="w-full border-2 border-slate-200 rounded-lg p-2.5 focus:border-blue-500 focus:outline-none"
              required
            >
              <option value="">-- Seleccione un usuario --</option>
              {usuarios.map((u) => (
                <option
                  key={u.codigoUniversitario}
                  value={u.codigoUniversitario}
                >
                  {u.nombres} {u.apellidos} ({u.codigoUniversitario})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Libro Seleccionado
            </label>
            <input
              type="text"
              readOnly
              value={
                libroSeleccionado
                  ? `${libroSeleccionado.titulo} (Stock: ${libroSeleccionado.stock})`
                  : "Ningún libro seleccionado"
              }
              className="w-full border-2 border-slate-200 bg-slate-50 rounded-lg p-2.5 text-slate-600"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-all"
            >
              <PlusCircle className="w-5 h-5" />
              Confirmar Préstamo
            </button>
          </div>
        </form>
      </div>

      {/* Catálogo de Libros */}
      <div className="bg-white border-2 border-slate-200 rounded-xl p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h2 className="text-xl font-bold text-slate-900">
            Catálogo y Disponibilidad
          </h2>
          <div className="relative w-full md:w-80">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por título o categoría..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {librosFiltrados.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p>No se encontraron libros disponibles</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-slate-200">
                  <th className="text-left p-3 text-sm font-semibold text-slate-700">
                    Título
                  </th>
                  <th className="text-left p-3 text-sm font-semibold text-slate-700">
                    Autor
                  </th>
                  <th className="text-left p-3 text-sm font-semibold text-slate-700">
                    Categoría
                  </th>
                  <th className="text-left p-3 text-sm font-semibold text-slate-700">
                    Stock
                  </th>
                  <th className="text-left p-3 text-sm font-semibold text-slate-700">
                    Estado
                  </th>
                  <th className="text-center p-3 text-sm font-semibold text-slate-700">
                    Acción
                  </th>
                </tr>
              </thead>
              <tbody>
                {librosFiltrados.map((libro) => (
                  <tr
                    key={libro.id}
                    className="border-b border-slate-100 hover:bg-slate-50"
                  >
                    <td className="p-3 font-medium text-slate-900">
                      {libro.titulo}
                    </td>
                    <td className="p-3 text-slate-600">{libro.autor}</td>
                    <td className="p-3">
                      <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs font-medium">
                        {libro.categoriaId}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-slate-900">
                      {libro.stock}
                    </td>
                    <td className="p-3">
                      {libro.stock > 0 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-semibold">
                          <CheckCircle className="w-3 h-3" />
                          Disponible
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">
                          <XCircle className="w-3 h-3" />
                          Agotado
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => setLibroSeleccionado(libro)}
                        disabled={libro.stock === 0}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          libro.stock > 0
                            ? "bg-blue-600 hover:bg-blue-700 text-white"
                            : "bg-slate-100 text-slate-400 cursor-not-allowed"
                        }`}
                      >
                        {libro.stock > 0 ? "Seleccionar" : "Agotado"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
