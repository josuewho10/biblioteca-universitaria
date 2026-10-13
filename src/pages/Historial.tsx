import { useEffect, useState } from "react";
import { storage } from "../utils/storage";
import type { LoanWithDetails } from "../types";

export default function Historial() {
  const [prestamos, setPrestamos] = useState<LoanWithDetails[]>([]);
  const [filtro, setFiltro] = useState<"todos" | "activos" | "devueltos">("todos");

  // Simulamos el usuario logueado (más adelante lo sacarán del contexto de auth)
  // Por ahora usamos el primer usuario o uno de prueba
  const usuarioActualId = localStorage.getItem("usuario_actual_id") || "";

  useEffect(() => {
    cargarPrestamos();
  }, []);

  const cargarPrestamos = () => {
    const loans = storage.getLoans();
    const users = storage.getUsers();
    const books = storage.getBooks();

    const conDetalles: LoanWithDetails[] = loans
      .filter((l) => l.userId === usuarioActualId) // solo los del usuario actual
      .map((loan) => {
        const usuario = users.find((u) => u.id === loan.userId)!;
        const libro = books.find((b) => b.id === loan.bookId)!;
        return { ...loan, usuario, libro };
      })
      .sort((a, b) => new Date(b.fechaPrestamo).getTime() - new Date(a.fechaPrestamo).getTime());

    setPrestamos(conDetalles);
  };

  const prestamosFiltrados = prestamos.filter((p) => {
    if (filtro === "activos") return p.estado === "Activo";
    if (filtro === "devueltos") return p.estado === "Devuelto";
    return true;
  });

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString("es-PE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Mis Préstamos</h1>

      {/* Filtros */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <button
          onClick={() => setFiltro("todos")}
          className={`px-4 py-2 rounded-lg text-sm ${
            filtro === "todos" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Todos
        </button>
        <button
          onClick={() => setFiltro("activos")}
          className={`px-4 py-2 rounded-lg text-sm ${
            filtro === "activos" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Activos
        </button>
        <button
          onClick={() => setFiltro("devueltos")}
          className={`px-4 py-2 rounded-lg text-sm ${
            filtro === "devueltos" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Devueltos
        </button>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-4 py-3">Código</th>
              <th className="px-4 py-3">Libro</th>
              <th className="px-4 py-3">Fecha Préstamo</th>
              <th className="px-4 py-3">Fecha Límite</th>
              <th className="px-4 py-3">Estado</th>
            </tr>
          </thead>
          <tbody>
            {prestamosFiltrados.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  No hay préstamos registrados
                </td>
              </tr>
            ) : (
              prestamosFiltrados.map((p) => (
                <tr key={p.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs">{p.id}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium">{p.libro?.titulo || "—"}</div>
                    <div className="text-xs text-gray-500">{p.libro?.autor}</div>
                  </td>
                  <td className="px-4 py-3">{formatFecha(p.fechaPrestamo)}</td>
                  <td className="px-4 py-3">{formatFecha(p.fechaLimite)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        p.estado === "Activo"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {p.estado}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}