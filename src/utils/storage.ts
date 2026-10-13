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




//VEGA
import type { Loan, User, Book } from "../types";

const KEYS = {
  loans: "biblioteca_prestamos",
  users: "biblioteca_usuarios",
  books: "biblioteca_libros",
};

export const storage = {
  getLoans: (): Loan[] => {
    const data = localStorage.getItem(KEYS.loans);
    return data ? JSON.parse(data) : [];
  },

  saveLoans: (loans: Loan[]) => {
    localStorage.setItem(KEYS.loans, JSON.stringify(loans));
  },

  getUsers: (): User[] => {
    const data = localStorage.getItem(KEYS.users);
    return data ? JSON.parse(data) : [];
  },

  getBooks: (): Book[] => {
    const data = localStorage.getItem(KEYS.books);
    return data ? JSON.parse(data) : [];
  },

  generateLoanCode: (): string => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `PRE-${timestamp}-${random}`;
  },
};