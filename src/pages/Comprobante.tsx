import { useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import type { LoanWithDetails } from "../types";

export default function Comprobante() {
  const location = useLocation();
  const navigate = useNavigate();
  const comprobanteRef = useRef<HTMLDivElement>(null);

  // Los datos llegan por el state de la navegación
  const prestamo = location.state?.prestamo as LoanWithDetails | undefined;

  if (!prestamo) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-600">No se encontró información del préstamo.</p>
        <button
          onClick={() => navigate("/historial")}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
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
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 190;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
    pdf.save(`Comprobante_${prestamo.id}.pdf`);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Comprobante de Préstamo</h1>
        <div className="flex gap-3">
          <button
            onClick={descargarPDF}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Descargar PDF
          </button>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-200 rounded-lg"
          >
            Volver
          </button>
        </div>
      </div>

      {/* Área que se convierte en PDF */}
      <div
        ref={comprobanteRef}
        className="bg-white border-2 border-gray-300 rounded-xl p-8 shadow-sm"
      >
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold uppercase tracking-wide">
            Biblioteca Central Universitaria
          </h2>
          <p className="text-sm text-gray-500 mt-1">Comprobante Digital de Préstamo</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <p className="text-gray-500 mb-1">Código de Préstamo</p>
            <p className="font-mono font-bold text-lg">{prestamo.id}</p>
          </div>

          <div>
            <p className="text-gray-500 mb-1">Estado</p>
            <p className="font-semibold">{prestamo.estado}</p>
          </div>

          <div>
            <p className="text-gray-500 mb-1">Usuario</p>
            <p className="font-medium">
              {prestamo.usuario.nombres} {prestamo.usuario.apellidos}
            </p>
            <p className="text-xs text-gray-500">
              {prestamo.usuario.codigoUniversitario} · {prestamo.usuario.tipo}
            </p>
          </div>

          <div>
            <p className="text-gray-500 mb-1">Libro</p>
            <p className="font-medium">{prestamo.libro.titulo}</p>
            <p className="text-xs text-gray-500">{prestamo.libro.autor}</p>
            <p className="text-xs text-gray-500">ISBN: {prestamo.libro.isbn}</p>
          </div>

          <div>
            <p className="text-gray-500 mb-1">Fecha de Préstamo</p>
            <p className="font-medium">{formatFecha(prestamo.fechaPrestamo)}</p>
          </div>

          <div>
            <p className="text-gray-500 mb-1">Fecha Límite de Devolución</p>
            <p className="font-medium">{formatFecha(prestamo.fechaLimite)}</p>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t text-center text-xs text-gray-400">
          Este comprobante es válido como constancia de préstamo.
          <br />
          Generado el {new Date().toLocaleString("es-PE")}
        </div>
      </div>
    </div>
  );
}