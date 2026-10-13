import { Link, Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex gap-4 flex-wrap">
          <Link to="/" className="font-bold text-lg">
            📚 Biblioteca
          </Link>
          <Link to="/usuarios" className="hover:underline">
            Usuarios
          </Link>
          <Link to="/inventario" className="hover:underline">
            Inventario
          </Link>
          <Link to="/prestamos" className="hover:underline">
            Préstamos
          </Link>
          <Link to="/historial" className="hover:underline">
            Historial
          </Link>
        </div>
      </nav>
      <main className="container mx-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}
