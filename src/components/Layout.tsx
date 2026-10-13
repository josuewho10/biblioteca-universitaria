import { Link, Outlet } from "react-router-dom";
import {
  Home,
  Users,
  Library,
  BookOpen,
  ClipboardList,
  GraduationCap,
} from "lucide-react";

export default function Layout() {
  const navItems = [
    { path: "/", label: "Inicio", icon: Home },
    { path: "/usuarios", label: "Usuarios", icon: Users },
    { path: "/inventario", label: "Inventario", icon: Library },
    { path: "/prestamos", label: "Préstamos", icon: BookOpen },
    { path: "/historial", label: "Historial", icon: ClipboardList },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-bold text-slate-900 leading-tight">
                  Biblioteca
                </div>
                <div className="text-xs text-slate-500 leading-tight">UNCP</div>
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Contenido */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-slate-600">
            © 2026 Biblioteca Universitaria UNCP • Desarrollo de Aplicaciones
            Web
          </p>
        </div>
      </footer>
    </div>
  );
}
