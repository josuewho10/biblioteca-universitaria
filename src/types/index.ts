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

// Alias para compatibilidad (para que funcione el código de tus compañeros)
export type Book = Libro;
export type Category = Categoria;
export type LoanWithDetails = Prestamo;
export type BookInput = Partial<Libro>;
export type CategoryInput = Partial<Categoria>;
