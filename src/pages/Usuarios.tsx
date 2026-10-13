import { useState, useEffect } from "react";
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

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">
        {" "}
        Gestión de Usuarios
      </h1>

      {/* FORMULARIO DE REGISTRO/EDICIÓN */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {editandoCodigo ? "️ Editar Usuario" : "➕ Registrar Nuevo Usuario"}
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Código Universitario *
            </label>
            <input
              name="codigoUniversitario"
              value={formData.codigoUniversitario}
              onChange={handleChange}
              placeholder="Ej: 20210001"
              disabled={!!editandoCodigo}
              className={`w-full border p-2 rounded ${editandoCodigo ? "bg-gray-100" : ""}`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombres *
            </label>
            <input
              name="nombres"
              value={formData.nombres}
              onChange={handleChange}
              placeholder="Ingresa los nombres"
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Apellidos
            </label>
            <input
              name="apellidos"
              value={formData.apellidos}
              onChange={handleChange}
              placeholder="Ingresa los apellidos"
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Correo Electrónico *
            </label>
            <input
              name="correo"
              type="email"
              value={formData.correo}
              onChange={handleChange}
              placeholder="usuario@uncp.edu.pe"
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Usuario
            </label>
            <select
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            >
              <option value="Estudiante">Estudiante</option>
              <option value="Docente">Docente</option>
              <option value="Administrador">Administrador</option>
            </select>
          </div>

          <div className="flex gap-2 md:col-span-2">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white p-3 rounded hover:bg-blue-700 font-bold transition"
            >
              {editandoCodigo ? " Actualizar Usuario" : "➕ Registrar Usuario"}
            </button>

            {editandoCodigo && (
              <button
                type="button"
                onClick={cancelarEdicion}
                className="px-6 bg-gray-500 text-white p-3 rounded hover:bg-gray-600 font-bold transition"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      {/* TABLA DE USUARIOS */}
      <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
        <h2 className="text-xl font-semibold mb-4">
          📋 Usuarios Registrados ({usuarios.length})
        </h2>

        {usuarios.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="text-lg">No hay usuarios registrados</p>
            <p className="text-sm">Comienza agregando tu primer usuario</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b-2 border-gray-200">
                <th className="p-3">Código</th>
                <th className="p-3">Nombre Completo</th>
                <th className="p-3">Correo</th>
                <th className="p-3">Tipo</th>
                <th className="p-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr
                  key={u.codigoUniversitario}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="p-3 font-mono text-sm">
                    {u.codigoUniversitario}
                  </td>
                  <td className="p-3">
                    {u.nombres} {u.apellidos}
                  </td>
                  <td className="p-3 text-sm">{u.correo}</td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        u.tipo === "Estudiante"
                          ? "bg-green-100 text-green-800"
                          : u.tipo === "Docente"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {u.tipo}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => editarUsuario(u)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm font-bold transition"
                      >
                        ✏️ Editar
                      </button>
                      <button
                        onClick={() => eliminarUsuario(u.codigoUniversitario)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm font-bold transition"
                      >
                        🗑️ Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
