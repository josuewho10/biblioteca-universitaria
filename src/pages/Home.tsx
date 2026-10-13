import { Link } from "react-router-dom";
import {
  Users,
  BookOpen,
  Library,
  ClipboardList,
  ArrowRight,
  Database,
  Smartphone,
  FileText,
  GraduationCap,
  ShieldCheck,
  Clock,
} from "lucide-react";

export default function Home() {
  const modules = [
    {
      title: "Gestión de Usuarios",
      description:
        "Registro y administración de estudiantes y docentes del sistema.",
      icon: Users,
      link: "/usuarios",
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-200",
      hover: "hover:border-blue-400",
    },
    {
      title: "Inventario de Libros",
      description:
        "Administra categorías, libros y control de stock disponible.",
      icon: Library,
      link: "/inventario",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      hover: "hover:border-emerald-400",
    },
    {
      title: "Préstamos",
      description:
        "Solicita préstamos de libros y verifica disponibilidad en tiempo real.",
      icon: BookOpen,
      link: "/prestamos",
      color: "text-violet-600",
      bg: "bg-violet-50",
      border: "border-violet-200",
      hover: "hover:border-violet-400",
    },
    {
      title: "Historial",
      description:
        "Consulta tus préstamos activos, devoluciones y estado de cada libro.",
      icon: ClipboardList,
      link: "/historial",
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-200",
      hover: "hover:border-amber-400",
    },
  ];

  const features = [
    {
      icon: Database,
      title: "Almacenamiento Local",
      description: "Datos persistentes usando LocalStorage del navegador.",
    },
    {
      icon: Smartphone,
      title: "Diseño Responsivo",
      description: "Interfaz adaptable a cualquier dispositivo o pantalla.",
    },
    {
      icon: FileText,
      title: "Comprobantes PDF",
      description: "Generación automática de comprobantes de préstamo.",
    },
    {
      icon: ShieldCheck,
      title: "Validaciones",
      description: "Formularios con validación de datos y códigos únicos.",
    },
    {
      icon: Clock,
      title: "Control de Fechas",
      description: "Seguimiento de fechas de préstamo y devolución.",
    },
    {
      icon: GraduationCap,
      title: "Multiusuario",
      description: "Soporte para estudiantes, docentes y administradores.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section Moderno */}
      <div className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white overflow-hidden">
        {/* Decoración de fondo */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-20">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">
                Sistema Activo • UNCP 2026
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight">
              Biblioteca
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                {" "}
                Universitaria
              </span>
            </h1>

            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Sistema integral de gestión de préstamos de libros para
              estudiantes y docentes
            </p>

            <div className="flex justify-center gap-4 flex-wrap">
              <Link
                to="/prestamos"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2"
              >
                Solicitar Préstamo
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/inventario"
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white px-8 py-3 rounded-lg font-semibold transition-all"
              >
                Ver Catálogo
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mt-16 pt-8 border-t border-white/10">
              <div>
                <div className="text-3xl font-bold">1000+</div>
                <div className="text-sm text-slate-400">Libros disponibles</div>
              </div>
              <div>
                <div className="text-3xl font-bold">500+</div>
                <div className="text-sm text-slate-400">
                  Usuarios registrados
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold">24/7</div>
                <div className="text-sm text-slate-400">Acceso al sistema</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Módulos del Sistema */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-3">
            Módulos del Sistema
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Accede a las diferentes funcionalidades del sistema de gestión
            bibliotecaria
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {modules.map((module, index) => {
            const Icon = module.icon;
            return (
              <Link
                key={index}
                to={module.link}
                className={`group bg-white border-2 ${module.border} ${module.hover} rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}
              >
                <div
                  className={`${module.bg} w-14 h-14 rounded-lg flex items-center justify-center mb-4`}
                >
                  <Icon className={`w-7 h-7 ${module.color}`} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {module.title}
                </h3>
                <p className="text-sm text-slate-600 mb-4">
                  {module.description}
                </p>
                <div
                  className={`flex items-center text-sm font-semibold ${module.color} group-hover:gap-2 transition-all`}
                >
                  Acceder al módulo
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Características */}
      <div className="bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">
              Características del Sistema
            </h2>
            <p className="text-slate-600">
              Tecnología moderna para una experiencia óptima
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="flex gap-4 p-6 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">
                      {feature.title}
                    </h4>
                    <p className="text-sm text-slate-600">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer info */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-8 md:p-12 text-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-bold text-lg mb-3">Equipo de Desarrollo</h4>
              <ul className="space-y-1 text-slate-300 text-sm">
                <li>• Yaranga (Líder Técnico)</li>
                <li>• Andrade</li>
                <li>• García</li>
                <li>• Vega</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-3">Información Académica</h4>
              <ul className="space-y-1 text-slate-300 text-sm">
                <li>Universidad Nacional del Centro del Perú</li>
                <li>Facultad de Ingeniería de Sistemas</li>
                <li>Desarrollo de Aplicaciones Web</li>
                <li>Semestre IX - 2026</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-3">Tecnologías</h4>
              <div className="flex flex-wrap gap-2">
                {[
                  "React",
                  "TypeScript",
                  "Vite",
                  "Tailwind",
                  "LocalStorage",
                ].map((tech) => (
                  <span
                    key={tech}
                    className="bg-white/10 border border-white/20 px-3 py-1 rounded-full text-xs"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
