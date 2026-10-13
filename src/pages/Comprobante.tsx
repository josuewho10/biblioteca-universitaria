import { useRef, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import type { Prestamo, Usuario, Libro } from "../types";
import { StorageKeys, getStorage } from "../utils/storage";
import { FileText, Download, ArrowLeft } from "lucide-react";

export default function Comprobante() {
  const location = useLocation();
  const navigate = useNavigate();
  const comprobanteRef = useRef<HTMLDivElement>(null);

  // Recibimos el préstamo plano desde el estado de navegación
  const prestamoPlano = location.state?.prestamo as Prestamo | undefined;

  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [libro, setLibro] = useState<Libro | null>(null);

  // Buscamos los detalles completos en LocalStorage
  useEffect(() => {
    if (prestamoPlano) {
      const usuarios = getStorage<Usuario[]>(StorageKeys.USUARIOS, []);
      const libros = getStorage<Libro[]>(StorageKeys.LIBROS, []);

      const u = usuarios.find(
        (user) => user.codigoUniversitario === prestamoPlano.usuarioCodigo,
      );
      const l = libros.find((book) => book.id === prestamoPlano.libroId);

      setUsuario(u || null);
      setLibro(l || null);
    }
  }, [prestamoPlano]);

  if (!prestamoPlano) {
    return (
      <div className="p-8 text-center max-w-3xl mx-auto">
        <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <p className="text-gray-600 text-lg">
          No se encontró información del préstamo.
        </p>
        <button
          onClick={() => navigate("/historial")}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-all"
        >
          Volver al historial
        </button>
      </div>
    );
  }

  const formatFecha = (fecha: string) =>
    new Date(fecha).toLocaleDateString("es-PE", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

  const descargarPDF = async () => {
    if (!comprobanteRef.current) return;

    const canvas = await html2canvas(comprobanteRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 190;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
    pdf.save(`Comprobante_${prestamoPlano.id}.pdf`);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <FileText className="w-6 h-6 text-blue-600" />
          Comprobante de Préstamo
        </h1>
        <div className="flex gap-3">
          <button
            onClick={descargarPDF}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-semibold flex items-center gap-2 transition-all"
          >
            <Download className="w-4 h-4" />
            Descargar PDF
          </button>
          <button
            onClick={() => navigate("/historial")}
            className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 font-semibold flex items-center gap-2 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver
          </button>
        </div>
      </div>

      {/* Área que se convierte en PDF */}
      <div
        ref={comprobanteRef}
        className="bg-white border-2 border-slate-300 rounded-xl p-8 shadow-sm"
      >
        <div className="text-center mb-8 border-b border-slate-200 pb-6">
          <h2 className="text-xl font-bold uppercase tracking-wide text-slate-900">
            Biblioteca Central Universitaria UNCP
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Comprobante Digital de Préstamo
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <p className="text-slate-500 mb-1 font-medium">
              Código de Préstamo
            </p>
            <p className="font-mono font-bold text-lg text-blue-600">
              {prestamoPlano.id}
            </p>
          </div>

          <div>
            <p className="text-slate-500 mb-1 font-medium">Estado</p>
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                prestamoPlano.estado === "Activo"
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-slate-100 text-slate-800"
              }`}
            >
              {prestamoPlano.estado}
            </span>
          </div>

          <div>
            <p className="text-slate-500 mb-1 font-medium">Usuario</p>
            <p className="font-bold text-slate-900">
              {usuario
                ? `${usuario.nombres} ${usuario.apellidos}`
                : "Usuario no encontrado"}
            </p>
            <p className="text-xs text-slate-500">
              {prestamoPlano.usuarioCodigo} · {usuario?.tipo || "N/A"}
            </p>
          </div>

          <div>
            <p className="text-slate-500 mb-1 font-medium">Libro</p>
            <p className="font-bold text-slate-900">
              {libro?.titulo || "Libro no encontrado"}
            </p>
            <p className="text-xs text-slate-500">{libro?.autor || ""}</p>
            <p className="text-xs text-slate-500">
              ISBN: {libro?.isbn || "N/A"}
            </p>
          </div>

          <div>
            <p className="text-slate-500 mb-1 font-medium">Fecha de Préstamo</p>
            <p className="font-medium text-slate-900">
              {formatFecha(prestamoPlano.fechaPrestamo)}
            </p>
          </div>

          <div>
            <p className="text-slate-500 mb-1 font-medium">
              Fecha Límite de Devolución
            </p>
            <p className="font-medium text-slate-900">
              {formatFecha(prestamoPlano.fechaLimite)}
            </p>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-200 text-center text-xs text-slate-400">
          Este comprobante es válido como constancia de préstamo.
          <br />
          Generado el {new Date().toLocaleString("es-PE")}
        </div>
      </div>
    </div>
  );
}
