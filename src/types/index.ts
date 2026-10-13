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



//VEGA
export type UserType = "Estudiante" | "Docente" | "Administrador";

export interface User {
  id: string;
  nombres: string;
  apellidos: string;
  codigoUniversitario: string;
  email: string;
  tipo: UserType;
}

export interface Book {
  id: string;
  titulo: string;
  autor: string;
  isbn: string;
  categoriaId: string;
  stock: number;
}

export interface Loan {
  id: string;                    // Código único (ej: PRE-XXXX)
  userId: string;
  bookId: string;
  fechaPrestamo: string;         // ISO
  fechaLimite: string;           // ISO
  fechaDevolucion?: string;
  estado: "Activo" | "Devuelto";
}

export interface LoanWithDetails extends Loan {
  usuario: User;
  libro: Book;
}