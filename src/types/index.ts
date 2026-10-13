export type TipoUsuario = "Estudiante" | "Docente" | "Administrador";
export type EstadoPrestamo = "Activo" | "Devuelto";

export interface Usuario {
  codigoUniversitario: string;
  nombres: string;
  apellidos: string;
  correo: string;
  tipo: TipoUsuario;
}

export interface Categoria {
  id: string;
  nombre: string;
}

export interface Libro {
  id: string;
  titulo: string;
  autor: string;
  isbn: string;
  categoriaId: string;
  stock: number;
}

export interface Prestamo {
  id: string;
  usuarioCodigo: string;
  libroId: string;
  fechaPrestamo: string;
  fechaLimite: string;
  estado: EstadoPrestamo;
}

// ===== Módulo 1: Inventario (Andrade) =====

export interface Category {
  id: string
  nombre: string
  descripcion: string
}

export interface Book {
  id: string
  titulo: string
  autor: string
  isbn: string
  categoriaId: string // relación con Category.id
  stock: number // ejemplares disponibles (Préstamos lo descuenta)
}

// Datos que llegan del formulario (sin id, porque el id se genera al guardar)
export type CategoryInput = Omit<Category, 'id'>
export type BookInput = Omit<Book, 'id'>