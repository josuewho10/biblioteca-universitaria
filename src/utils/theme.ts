// Colores principales del sistema
export const theme = {
  colors: {
    primary: "blue", // Color principal (azul)
    secondary: "gray", // Color secundario (gris)
    success: "green", // Éxito/Disponible
    warning: "yellow", // Advertencia/Edición
    danger: "red", // Peligro/Eliminar
    info: "purple", // Información/Docente
  },
  // Clases de Tailwind reutilizables
  buttons: {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    success: "bg-green-600 text-white hover:bg-green-700",
    warning: "bg-yellow-500 text-white hover:bg-yellow-600",
    danger: "bg-red-600 text-white hover:bg-red-700",
    secondary: "bg-gray-500 text-white hover:bg-gray-600",
  },
  badges: {
    student: "bg-green-100 text-green-800",
    teacher: "bg-blue-100 text-blue-800",
    admin: "bg-purple-100 text-purple-800",
    active: "bg-green-100 text-green-800",
    returned: "bg-gray-100 text-gray-800",
    available: "bg-green-100 text-green-800",
    unavailable: "bg-red-100 text-red-800",
  },
};
