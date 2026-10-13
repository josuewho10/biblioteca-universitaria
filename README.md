# Sistema de Gestión de Biblioteca Universitaria

Evaluación Parcial · Desarrollo de Aplicaciones Web · Universidad Nacional del Centro del Perú (UNCP)

Aplicación web para administrar el préstamo de libros a estudiantes y docentes. Toda la información se guarda en **Local Storage**, sin base de datos externa.

## Tecnologías

- React + Vite
- TypeScript
- React Router DOM (navegación sin recargar la página)
- lucide-react (íconos)
- Local Storage (persistencia de datos)

## Estructura del proyecto

```
src/
├── types/index.ts          # Interfaces compartidas (Category, Book, etc.)
├── utils/storage.ts        # Lectura y escritura segura en Local Storage
├── components/
│   ├── Layout.tsx          # Menú de navegación y contenedor principal
│   └── FormFields.tsx      # Inputs, selects y textareas reutilizables
├── pages/
│   ├── Home.tsx            # Inicio
│   ├── Usuarios.tsx        # Módulo 2
│   ├── Inventario.tsx      # Módulo 1
│   ├── Prestamos.tsx       # Módulo 3
│   ├── Historial.tsx       # Módulo 5
│   └── Comprobante.tsx     # Módulo 4
├── App.tsx                 # Rutas de la aplicación
└── main.tsx                # Punto de entrada
```

## Integrantes y responsabilidades

| Integrante                    | Módulo                                                   | Ruta                         |
| ----------------------------- | -------------------------------------------------------- | ---------------------------- |
| Yaranga                       | Estructura base, Inicio y Gestión de usuarios (Módulo 2) | `/`, `/usuarios`             |
| Ingrid Ivette Andrade Egoavil | Gestión de categorías y libros (Módulo 1)                | `/inventario`                |
| Piero Garcia                  | Solicitud y préstamo de libros (Módulo 3)                | `/prestamos`                 |
| Mauricio Vega                 | Comprobante digital (Módulo 4) e Historial (Módulo 5)    | `/comprobante`, `/historial` |

## Flujo de trabajo con Git

Cada integrante trabajó en su propia rama y luego se integraron en `main` mediante Pull Requests.

```bash
git checkout -b nombre-rama      # crear rama propia
git add .
git commit -m "feat: descripción"
git pull origin main             # traer cambios del equipo
git push -u origin nombre-rama   # subir rama y abrir Pull Request
```
