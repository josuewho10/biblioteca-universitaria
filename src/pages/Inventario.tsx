import { useState, useEffect } from "react";
import { Library, Plus, Edit, Trash2, Save, X } from "lucide-react";
import type { Libro, Categoria } from "../types";
import { StorageKeys, getStorage, setStorage } from "../utils/storage";

export default function Inventario() {
  const [libros, setLibros] = useState<Libro[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [mostrarFormLibro, setMostrarFormLibro] = useState(false);
  const [mostrarFormCategoria, setMostrarFormCategoria] = useState(false);
  const [editandoId, setEditandoId] = useState<string | null>(null);

  const [formDataLibro, setFormDataLibro] = useState({
    titulo: "",
    autor: "",
    isbn: "",
    categoriaId: "",
    stock: 0,
  });

  const [formDataCategoria, setFormDataCategoria] = useState({
    nombre: "",
  });

  useEffect(() => {
    const librosGuardados = getStorage<Libro[]>(StorageKeys.LIBROS, []);
    const categoriasGuardadas = getStorage<Categoria[]>(
      StorageKeys.CATEGORIAS,
      [],
    );
    setLibros(librosGuardados);
    setCategorias(categoriasGuardadas);
  }, []);

  const handleGuardarCategoria = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formDataCategoria.nombre.trim()) return;

    const nuevasCategorias = [
      ...categorias,
      {
        id: Date.now().toString(),
        nombre: formDataCategoria.nombre,
      },
    ];

    setCategorias(nuevasCategorias);
    setStorage(StorageKeys.CATEGORIAS, nuevasCategorias);
    setFormDataCategoria({ nombre: "" });
    setMostrarFormCategoria(false);
  };

  const handleGuardarLibro = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formDataLibro.titulo || !formDataLibro.categoriaId) return;

    const nuevoLibro: Libro = {
      id: Date.now().toString(),
      titulo: formDataLibro.titulo,
      autor: formDataLibro.autor,
      isbn: formDataLibro.isbn,
      categoriaId: formDataLibro.categoriaId,
      stock: formDataLibro.stock,
    };

    const nuevosLibros = [...libros, nuevoLibro];
    setLibros(nuevosLibros);
    setStorage(StorageKeys.LIBROS, nuevosLibros);
    setFormDataLibro({
      titulo: "",
      autor: "",
      isbn: "",
      categoriaId: "",
      stock: 0,
    });
    setMostrarFormLibro(false);
  };

  const eliminarCategoria = (id: string) => {
    if (confirm("¿Eliminar esta categoría?")) {
      const filtradas = categorias.filter((c) => c.id !== id);
      setCategorias(filtradas);
      setStorage(StorageKeys.CATEGORIAS, filtradas);
    }
  };

  const eliminarLibro = (id: string) => {
    if (confirm("¿Eliminar este libro?")) {
      const filtrados = libros.filter((l) => l.id !== id);
      setLibros(filtrados);
      setStorage(StorageKeys.LIBROS, filtrados);
    }
  };

  const getCategoriaNombre = (categoriaId: string) => {
    const cat = categorias.find((c) => c.id === categoriaId);
    return cat ? cat.nombre : "Sin categoría";
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
          <Library className="w-8 h-8 text-blue-600" />
          Inventario de Libros
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => setMostrarFormCategoria(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" />
            Nueva Categoría
          </button>
          <button
            onClick={() => setMostrarFormLibro(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" />
            Nuevo Libro
          </button>
        </div>
      </div>

      {/* Formulario Categoría */}
      {mostrarFormCategoria && (
        <div className="bg-white border-2 border-slate-200 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Nueva Categoría</h2>
          <form onSubmit={handleGuardarCategoria} className="flex gap-4">
            <input
              type="text"
              placeholder="Nombre de categoría"
              value={formDataCategoria.nombre}
              onChange={(e) => setFormDataCategoria({ nombre: e.target.value })}
              className="flex-1 border-2 border-slate-200 rounded-lg p-2 focus:border-blue-500 focus:outline-none"
              required
            />
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Guardar
            </button>
            <button
              type="button"
              onClick={() => setMostrarFormCategoria(false)}
              className="bg-slate-500 hover:bg-slate-600 text-white px-4 py-2 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Formulario Libro */}
      {mostrarFormLibro && (
        <div className="bg-white border-2 border-slate-200 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Nuevo Libro</h2>
          <form
            onSubmit={handleGuardarLibro}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <input
              placeholder="Título *"
              value={formDataLibro.titulo}
              onChange={(e) =>
                setFormDataLibro({ ...formDataLibro, titulo: e.target.value })
              }
              className="border-2 border-slate-200 rounded-lg p-2 focus:border-blue-500 focus:outline-none"
              required
            />
            <input
              placeholder="Autor"
              value={formDataLibro.autor}
              onChange={(e) =>
                setFormDataLibro({ ...formDataLibro, autor: e.target.value })
              }
              className="border-2 border-slate-200 rounded-lg p-2 focus:border-blue-500 focus:outline-none"
            />
            <input
              placeholder="ISBN"
              value={formDataLibro.isbn}
              onChange={(e) =>
                setFormDataLibro({ ...formDataLibro, isbn: e.target.value })
              }
              className="border-2 border-slate-200 rounded-lg p-2 focus:border-blue-500 focus:outline-none"
            />
            <select
              value={formDataLibro.categoriaId}
              onChange={(e) =>
                setFormDataLibro({
                  ...formDataLibro,
                  categoriaId: e.target.value,
                })
              }
              className="border-2 border-slate-200 rounded-lg p-2 focus:border-blue-500 focus:outline-none"
              required
            >
              <option value="">Seleccionar categoría *</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nombre}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Stock"
              min="0"
              value={formDataLibro.stock}
              onChange={(e) =>
                setFormDataLibro({
                  ...formDataLibro,
                  stock: parseInt(e.target.value) || 0,
                })
              }
              className="border-2 border-slate-200 rounded-lg p-2 focus:border-blue-500 focus:outline-none"
            />
            <div className="md:col-span-2 flex gap-2">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Guardar Libro
              </button>
              <button
                type="button"
                onClick={() => setMostrarFormLibro(false)}
                className="bg-slate-500 hover:bg-slate-600 text-white px-4 py-2 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de Categorías */}
      <div className="bg-white border-2 border-slate-200 rounded-xl p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">
          Categorías ({categorias.length})
        </h2>
        {categorias.length === 0 ? (
          <p className="text-slate-500 text-center py-4">
            No hay categorías registradas
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {categorias.map((cat) => (
              <div
                key={cat.id}
                className="bg-slate-100 px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <span className="font-medium">{cat.nombre}</span>
                <button
                  onClick={() => eliminarCategoria(cat.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lista de Libros */}
      <div className="bg-white border-2 border-slate-200 rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4">
          Libros Registrados ({libros.length})
        </h2>
        {libros.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <Library className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p>No hay libros registrados</p>
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
                    ISBN
                  </th>
                  <th className="text-left p-3 text-sm font-semibold text-slate-700">
                    Categoría
                  </th>
                  <th className="text-left p-3 text-sm font-semibold text-slate-700">
                    Stock
                  </th>
                  <th className="text-center p-3 text-sm font-semibold text-slate-700">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {libros.map((libro) => (
                  <tr
                    key={libro.id}
                    className="border-b border-slate-100 hover:bg-slate-50"
                  >
                    <td className="p-3 font-medium text-slate-900">
                      {libro.titulo}
                    </td>
                    <td className="p-3 text-slate-600">{libro.autor}</td>
                    <td className="p-3 font-mono text-sm text-slate-600">
                      {libro.isbn}
                    </td>
                    <td className="p-3">
                      <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs">
                        {getCategoriaNombre(libro.categoriaId)}
                      </span>
                    </td>
                    <td className="p-3 font-mono">
                      <span
                        className={
                          libro.stock > 0
                            ? "text-emerald-600 font-bold"
                            : "text-red-600"
                        }
                      >
                        {libro.stock}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => eliminarLibro(libro.id)}
                        className="text-red-600 hover:text-red-800 p-2"
                      >
                        <Trash2 className="w-4 h-4" />
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
