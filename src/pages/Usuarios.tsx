import { useState, useEffect } from "react";
import { Users, Plus, Edit, Trash2, UserCheck, X, Save } from "lucide-react";
import type { Usuario, TipoUsuario } from "../types";
import { StorageKeys, getStorage, setStorage } from "../utils/storage";

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [formData, setFormData] = useState({
    codigoUniversitario: "",
    nombres: "",
    apellidos: "",
    correo: "",
    tipo: "Estudiante" as TipoUsuario,
  });
  const [error, setError] = useState("");
  const [editandoCodigo, setEditandoCodigo] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState("");

  // Cargar usuarios al iniciar
  useEffect(() => {
    const datos = getStorage<Usuario[]>(StorageKeys.USUARIOS, []);
    setUsuarios(datos);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validación básica
    if (
      !formData.codigoUniversitario ||
      !formData.nombres ||
      !formData.correo
    ) {
      setError("Todos los campos obligatorios deben estar llenos");
      return;
    }

    // Validar correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.correo)) {
      setError("El correo electrónico no es válido");
      return;
    }

    if (editandoCodigo) {
      // MODO EDICIÓN: Actualizar usuario existente
      const usuariosActualizados = usuarios.map((u) =>
        u.codigoUniversitario === editandoCodigo ? formData : u,
      );
      setUsuarios(usuariosActualizados);
      setStorage(StorageKeys.USUARIOS, usuariosActualizados);
      setEditandoCodigo(null);
      alert("Usuario actualizado con éxito ✅");
    } else {
      // MODO CREACIÓN: Verificar código duplicado
      const existe = usuarios.some(
        (u) => u.codigoUniversitario === formData.codigoUniversitario,
      );
      if (existe) {
        setError("El código universitario ya está registrado");
        return;
      }

      // Guardar nuevo usuario
      const nuevosUsuarios = [...usuarios, formData];
      setUsuarios(nuevosUsuarios);
      setStorage(StorageKeys.USUARIOS, nuevosUsuarios);
      alert("Usuario registrado con éxito ✅");
    }

    // Limpiar formulario
    setFormData({
      codigoUniversitario: "",
      nombres: "",
      apellidos: "",
      correo: "",
      tipo: "Estudiante",
    });
  };

  const editarUsuario = (usuario: Usuario) => {
    setFormData(usuario);
    setEditandoCodigo(usuario.codigoUniversitario);
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelarEdicion = () => {
    setFormData({
      codigoUniversitario: "",
      nombres: "",
      apellidos: "",
      correo: "",
      tipo: "Estudiante",
    });
    setEditandoCodigo(null);
    setError("");
  };

  const eliminarUsuario = (codigo: string) => {
    if (confirm("¿Estás seguro de eliminar este usuario?")) {
      const filtrados = usuarios.filter(
        (u) => u.codigoUniversitario !== codigo,
      );
      setUsuarios(filtrados);
      setStorage(StorageKeys.USUARIOS, filtrados);

      if (editandoCodigo === codigo) {
        cancelarEdicion();
      }
    }
  };

  // Filtrar usuarios por búsqueda
  const usuariosFiltrados = usuarios.filter(
    (u) =>
      u.nombres.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.apellidos.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.codigoUniversitario.toLowerCase().includes(busqueda.toLowerCase()),
  );

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
          <Users className="w-8 h-8 text-blue-600" />
          Gestión de Usuarios
        </h1>
        <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg font-semibold">
          {usuarios.length} usuarios registrados
        </div>
      </div>

      {/* Formulario de Registro/Edición */}
      <div className="bg-white border-2 border-slate-200 rounded-xl p-6 mb-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          {editandoCodigo ? (
            <Edit className="w-5 h-5 text-amber-500" />
          ) : (
            <Plus className="w-5 h-5 text-blue-600" />
          )}
          {editandoCodigo ? "Editar Usuario" : "Registrar Nuevo Usuario"}
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center gap-2">
            <X className="w-4 h-4" />
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Código Universitario *
            </label>
            <input
              name="codigoUniversitario"
              value={formData.codigoUniversitario}
              onChange={handleChange}
              placeholder="Ej: 20210001"
              disabled={!!editandoCodigo}
              className={`w-full border-2 border-slate-200 rounded-lg p-2 focus:border-blue-500 focus:outline-none ${
                editandoCodigo ? "bg-slate-100" : ""
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Nombres *
            </label>
            <input
              name="nombres"
              value={formData.nombres}
              onChange={handleChange}
              placeholder="Ingresa los nombres"
              className="w-full border-2 border-slate-200 rounded-lg p-2 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Apellidos
            </label>
            <input
              name="apellidos"
              value={formData.apellidos}
              onChange={handleChange}
              placeholder="Ingresa los apellidos"
              className="w-full border-2 border-slate-200 rounded-lg p-2 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Correo Electrónico *
            </label>
            <input
              name="correo"
              type="email"
              value={formData.correo}
              onChange={handleChange}
              placeholder="usuario@uncp.edu.pe"
              className="w-full border-2 border-slate-200 rounded-lg p-2 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Tipo de Usuario
            </label>
            <select
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              className="w-full border-2 border-slate-200 rounded-lg p-2 focus:border-blue-500 focus:outline-none"
            >
              <option value="Estudiante">Estudiante</option>
              <option value="Docente">Docente</option>
            </select>
          </div>

          <div className="flex gap-2 md:col-span-2">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all"
            >
              <Save className="w-4 h-4" />
              {editandoCodigo ? "Actualizar Usuario" : "Registrar Usuario"}
            </button>

            {editandoCodigo && (
              <button
                type="button"
                onClick={cancelarEdicion}
                className="px-6 bg-slate-500 hover:bg-slate-600 text-white rounded-lg font-semibold flex items-center gap-2 transition-all"
              >
                <X className="w-4 h-4" />
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Lista de Usuarios */}
      <div className="bg-white border-2 border-slate-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-blue-600" />
            Usuarios Registrados
          </h2>
          <input
            type="text"
            placeholder="Buscar usuario..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="border-2 border-slate-200 rounded-lg px-4 py-2 focus:border-blue-500 focus:outline-none"
          />
        </div>

        {usuariosFiltrados.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <Users className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg">No hay usuarios registrados</p>
            <p className="text-sm">Comienza agregando tu primer usuario</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-slate-200">
                  <th className="text-left p-3 text-sm font-semibold text-slate-700">
                    Código
                  </th>
                  <th className="text-left p-3 text-sm font-semibold text-slate-700">
                    Nombre Completo
                  </th>
                  <th className="text-left p-3 text-sm font-semibold text-slate-700">
                    Correo
                  </th>
                  <th className="text-left p-3 text-sm font-semibold text-slate-700">
                    Tipo
                  </th>
                  <th className="text-center p-3 text-sm font-semibold text-slate-700">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {usuariosFiltrados.map((u) => (
                  <tr
                    key={u.codigoUniversitario}
                    className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                  >
                    <td className="p-3 font-mono text-sm text-slate-900">
                      {u.codigoUniversitario}
                    </td>
                    <td className="p-3 text-slate-900">
                      {u.nombres} {u.apellidos}
                    </td>
                    <td className="p-3 text-sm text-slate-600">{u.correo}</td>
                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          u.tipo === "Estudiante"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-violet-100 text-violet-800"
                        }`}
                      >
                        {u.tipo}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => editarUsuario(u)}
                          className="bg-amber-500 hover:bg-amber-600 text-white p-2 rounded-lg transition-all"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => eliminarUsuario(u.codigoUniversitario)}
                          className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-all"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
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
