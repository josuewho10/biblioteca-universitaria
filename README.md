# Sistema de Gestión de Biblioteca Universitaria

**Evaluación Parcial · Desarrollo de Aplicaciones Web · Universidad Nacional del Centro del Perú (UNCP)**

Aplicación web para administrar el préstamo de libros a estudiantes y docentes. Toda la información se gestiona y persiste utilizando **Local Storage**, simulando un entorno empresarial sin dependencias de bases de datos externas.

## 🛠️ Tecnologías Utilizadas

- **React + Vite**: Framework y herramienta de construcción rápida.
- **TypeScript**: Tipado estático para mayor robustez y prevención de errores.
- **React Router DOM**: Navegación fluida entre módulos sin recargar la página.
- **Tailwind CSS**: Estilos modernos, limpios y diseño 100% responsivo.
- **lucide-react**: Biblioteca de íconos vectoriales profesionales.
- **jspdf + html2canvas**: Generación y descarga de comprobantes digitales en PDF.
- **Local Storage**: Persistencia de datos en el navegador.

## 📂 Estructura del Proyecto

```text
src/
├── types/
│   └── index.ts          # Interfaces y tipos compartidos (Usuario, Libro, Prestamo, etc.)
├── utils/
│   └── storage.ts        # Funciones seguras para leer y escribir en Local Storage
├── components/
│   └── Layout.tsx        # Menú de navegación (Navbar) y contenedor principal
├── pages/
│   ├── Home.tsx          # Página de inicio y presentación del sistema
│   ├── Usuarios.tsx      # Módulo 2: Gestión de usuarios (CRUD + validaciones)
│   ├── Inventario.tsx    # Módulo 1: Gestión de categorías y libros
│   ├── Prestamos.tsx     # Módulo 3: Solicitud y préstamo de libros (control de stock)
│   ├── Historial.tsx     # Módulo 5: Consulta de préstamos activos e historial
│   └── Comprobante.tsx   # Módulo 4: Visualización y descarga de comprobante en PDF
├── App.tsx               # Configuración de rutas de la aplicación
└── main.tsx              # Punto de entrada de React
```
