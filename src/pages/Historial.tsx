import { useState, useEffect } from "react";
import {
  ClipboardList,
  BookOpen,
  Calendar,
  CheckCircle,
  XCircle,
  Download,
} from "lucide-react";
import type { Prestamo, Libro, Usuario } from "../types";
import { StorageKeys, getStorage } from "../utils/storage";

export default function Historial() {
  const [prestamos, setPrestamos] = useState<Prestamo[]>([]);
  const [libros, setLibros] = useState<Libro[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [filtro, setFiltro] = useState<"todos" | "activos" | "devueltos">(
    "todos",
  );

  useEffect(() => {
    const datosPrestamos = getStorage<Prestamo[]>(StorageKeys.PRESTAMOS, []);
    const datosLibros = getStorage<Libro[]>(StorageKeys.LIBROS, []);
    const datosUsuarios = getStorage<Usuario[]>(StorageKeys.USUARIOS, []);

    setPrestamos(datosPrestamos);
    setLibros(datosLibros);
    setUsuarios(datosUsuarios);
  }, []);

  const getLibroTitulo = (libroId: string) => {
    const libro = libros.find((l) => l.id === libroId);
    return libro ? libro.titulo : "Libro no encontrado";
  };

  const getUsuarioNombre = (usuarioCodigo: string) => {
    const usuario = usuarios.find(
      (u) => u.codigoUniversitario === usuarioCodigo,
    );
    return usuario
      ? `${usuario.nombres} ${usuario.apellidos}`
      : "Usuario no encontrado";
  };

  const prestamosFiltrados = prestamos.filter((p) => {
    if (filtro === "activos") return p.estado === "Activo";
    if (filtro === "devueltos") return p.estado === "Devuelto";
    return true;
  });

  const marcarComoDevuelto = (prestamoId: string) => {
    const prestamosActualizados = prestamos.map((p) =>
      p.id === prestamoId ? { ...p, estado: "Devuelto" as const } : p,
    );
    setPrestamos(prestamosActualizados);
    localStorage.setItem(
      StorageKeys.PRESTAMOS,
      JSON.stringify(prestamosActualizados),
    );
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
          <ClipboardList className="w-8 h-8 text-blue-600" />
          Historial de Préstamos
        </h1>
        <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg font-semibold">
          {prestamos.length} préstamos totales
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white border-2 border-slate-200 rounded-xl p-4 mb-6">
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFiltro("todos")}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              filtro === "todos"
                ? "bg-blue-600 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            Todos ({prestamos.length})
          </button>
          <button
            onClick={() => setFiltro("activos")}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              filtro === "activos"
                ? "bg-blue-600 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            Activos ({prestamos.filter((p) => p.estado === "Activo").length})
          </button>
          <button
            onClick={() => setFiltro("devueltos")}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              filtro === "devueltos"
                ? "bg-blue-600 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            Devueltos ({prestamos.filter((p) => p.estado === "Devuelto").length}
            )
          </button>
        </div>
      </div>

      {/* Lista de Préstamos */}
      <div className="bg-white border-2 border-slate-200 rounded-xl p-6">
        {prestamosFiltrados.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <ClipboardList className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg">No hay préstamos registrados</p>
            <p className="text-sm">
              Los préstamos aparecerán aquí cuando se soliciten
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {prestamosFiltrados.map((prestamo) => (
              <div
                key={prestamo.id}
                className="border-2 border-slate-200 rounded-lg p-4 hover:border-blue-300 transition-all"
              >
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="w-5 h-5 text-blue-600" />
                      <h3 className="font-bold text-slate-900 text-lg">
                        {getLibroTitulo(prestamo.libroId)}
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">Usuario:</span>
                        {getUsuarioNombre(prestamo.usuarioCodigo)}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">Código préstamo:</span>
                        <span className="font-mono bg-slate-100 px-2 py-1 rounded">
                          {prestamo.id}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>
                          Préstamo:{" "}
                          {new Date(prestamo.fechaPrestamo).toLocaleDateString(
                            "es-PE",
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>
                          Límite:{" "}
                          {new Date(prestamo.fechaLimite).toLocaleDateString(
                            "es-PE",
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
                        prestamo.estado === "Activo"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-slate-100 text-slate-800"
                      }`}
                    >
                      {prestamo.estado === "Activo" ? (
                        <>
                          <CheckCircle className="w-3 h-3" /> Activo
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3" /> Devuelto
                        </>
                      )}
                    </span>

                    {prestamo.estado === "Activo" && (
                      <button
                        onClick={() => marcarComoDevuelto(prestamo.id)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded-lg text-sm font-semibold flex items-center gap-1 transition-all"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Marcar Devuelto
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
