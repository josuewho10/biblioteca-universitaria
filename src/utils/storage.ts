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

import type { Book, Category } from '../types'

// Claves únicas para no chocar con los datos de los otros módulos
export const STORAGE_KEYS = {
  categorias: 'biblioteca_categorias',
  libros: 'biblioteca_libros',
} as const

// ---------- Helpers genéricos ----------

/** Lee una lista de Local Storage. Si no existe, está corrupta o tiene datos inválidos, devuelve []. */
export function readList<T>(key: string, isValid: (item: unknown) => item is T): T[] {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return []
    const data: unknown = JSON.parse(raw)
    return Array.isArray(data) ? data.filter(isValid) : []
  } catch {
    return []
  }
}

/** Guarda una lista en Local Storage. Devuelve false si el navegador lo bloquea o está lleno. */
export function writeList<T>(key: string, list: T[]): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(list))
    return true
  } catch {
    return false
  }
}

export const generateId = (): string =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`

// ---------- Validadores de forma (type guards) ----------

const isObject = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null

export const isCategory = (v: unknown): v is Category =>
  isObject(v) && typeof v.id === 'string' && typeof v.nombre === 'string' && typeof v.descripcion === 'string'

export const isBook = (v: unknown): v is Book =>
  isObject(v) &&
  typeof v.id === 'string' &&
  typeof v.titulo === 'string' &&
  typeof v.autor === 'string' &&
  typeof v.isbn === 'string' &&
  typeof v.categoriaId === 'string' &&
  typeof v.stock === 'number'

// ---------- API de Categorías ----------

export const getCategorias = (): Category[] => readList(STORAGE_KEYS.categorias, isCategory)
export const saveCategorias = (lista: Category[]): boolean => writeList(STORAGE_KEYS.categorias, lista)

// ---------- API de Libros (también la usa Préstamos) ----------

export const getLibros = (): Book[] => readList(STORAGE_KEYS.libros, isBook)
export const saveLibros = (lista: Book[]): boolean => writeList(STORAGE_KEYS.libros, lista)

/** Cambia el stock de un libro (ej. -1 al prestar, +1 al devolver). Nunca baja de 0. */
export function actualizarStock(libroId: string, cambio: number): boolean {
  const libros = getLibros()
  const libro = libros.find((l) => l.id === libroId)
  if (!libro || libro.stock + cambio < 0) return false
  return saveLibros(libros.map((l) => (l.id === libroId ? { ...l, stock: l.stock + cambio } : l)))
}