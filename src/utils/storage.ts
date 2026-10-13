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


 main
