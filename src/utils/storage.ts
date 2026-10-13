import type { Usuario, Categoria, Libro, Prestamo } from "../types";

export const StorageKeys = {
  USUARIOS: "biblioteca_usuarios",
  CATEGORIAS: "biblioteca_categorias",
  LIBROS: "biblioteca_libros",
  PRESTAMOS: "biblioteca_prestamos",
};

export const getStorage = <T>(key: string, defaultValue: T): T => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultValue;
};

export const setStorage = <T>(key: string, value: T): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

// Funciones helper que necesitan tus compañeros
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const getCategorias = (): Categoria[] => {
  return getStorage<Categoria[]>(StorageKeys.CATEGORIAS, []);
};

export const saveCategorias = (categorias: Categoria[]): void => {
  setStorage(StorageKeys.CATEGORIAS, categorias);
};

export const getLibros = (): Libro[] => {
  return getStorage<Libro[]>(StorageKeys.LIBROS, []);
};

export const saveLibros = (libros: Libro[]): void => {
  setStorage(StorageKeys.LIBROS, libros);
};

export const getUsuarios = (): Usuario[] => {
  return getStorage<Usuario[]>(StorageKeys.USUARIOS, []);
};

export const saveUsuarios = (usuarios: Usuario[]): void => {
  setStorage(StorageKeys.USUARIOS, usuarios);
};

export const getPrestamos = (): Prestamo[] => {
  return getStorage<Prestamo[]>(StorageKeys.PRESTAMOS, []);
};

export const savePrestamos = (prestamos: Prestamo[]): void => {
  setStorage(StorageKeys.PRESTAMOS, prestamos);
};
