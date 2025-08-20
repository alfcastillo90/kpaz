# Book Reviews - Frontend

Una aplicación web moderna para compartir y descubrir reseñas de libros, construida con Vue.js 3, TypeScript y Pinia.

## 🚀 Características

- **Interfaz moderna y responsiva** - Diseño atractivo que funciona en todos los dispositivos
- **Autenticación de usuarios** - Sistema de registro e inicio de sesión
- **Gestión de libros** - Crear, editar y eliminar libros
- **Sistema de reseñas** - Escribir y leer reseñas con calificaciones
- **Búsqueda y filtros** - Encontrar libros por título, autor o género
- **Estado global** - Gestión de estado con Pinia
- **TypeScript** - Tipado estático para mejor desarrollo

## 🛠️ Tecnologías

- **Vue.js 3** - Framework progresivo de JavaScript
- **TypeScript** - Tipado estático
- **Vue Router** - Enrutamiento de la aplicación
- **Pinia** - Gestión de estado
- **Vite** - Herramienta de construcción
- **ESLint + Prettier** - Linting y formateo de código
- **Vitest** - Testing unitario
- **Cypress** - Testing end-to-end

## 📦 Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd book-reviews
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp env.example .env
   ```
   
   Edita el archivo `.env` y configura la URL de tu API:
   ```
   VITE_API_URL=http://localhost:3000
   ```

4. **Ejecutar en desarrollo**
   ```bash
   npm run dev
   ```

5. **Abrir en el navegador**
   ```
   http://localhost:5173
   ```

## 🏗️ Scripts Disponibles

- `npm run dev` - Ejecutar en modo desarrollo
- `npm run build` - Construir para producción
- `npm run preview` - Vista previa de la construcción
- `npm run test` - Ejecutar tests unitarios
- `npm run test:e2e` - Ejecutar tests end-to-end
- `npm run lint` - Linting del código
- `npm run format` - Formatear código

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
├── views/              # Páginas de la aplicación
├── stores/             # Stores de Pinia
├── services/           # Servicios de API
├── types/              # Definiciones de TypeScript
├── router/             # Configuración de rutas
└── main.ts             # Punto de entrada
```

## 🔧 Configuración

### Variables de Entorno

- `VITE_API_URL` - URL base de la API backend

### Rutas Principales

- `/` - Página de inicio
- `/login` - Inicio de sesión
- `/register` - Registro de usuario
- `/books` - Lista de libros
- `/books/:id` - Detalle del libro
- `/books/new` - Crear nuevo libro
- `/books/:id/edit` - Editar libro
- `/profile` - Perfil del usuario

## 🎨 Diseño

La aplicación utiliza un diseño moderno con:
- Gradientes atractivos
- Animaciones suaves
- Diseño responsivo
- Paleta de colores consistente
- Tipografía clara y legible

## 🧪 Testing

### Tests Unitarios
```bash
npm run test
```

### Tests End-to-End
```bash
npm run test:e2e
```

## 📱 Responsive Design

La aplicación está optimizada para:
- **Desktop** - Pantallas grandes
- **Tablet** - Dispositivos medianos
- **Mobile** - Teléfonos móviles

## 🔒 Autenticación

El sistema de autenticación incluye:
- Registro de usuarios
- Inicio de sesión
- Protección de rutas
- Gestión de tokens JWT
- Cerrar sesión

## 📚 Funcionalidades de Libros

- **Listado** - Ver todos los libros con filtros
- **Detalle** - Información completa del libro
- **Crear** - Agregar nuevos libros
- **Editar** - Modificar información existente
- **Eliminar** - Remover libros (solo administradores)

## ⭐ Sistema de Reseñas

- **Escribir reseñas** - Calificar y comentar libros
- **Ver reseñas** - Leer opiniones de otros usuarios
- **Calificaciones** - Sistema de estrellas (1-5)
- **Comentarios** - Texto descriptivo de la experiencia

## 🚀 Despliegue

### Construir para producción
```bash
npm run build
```

### Servir archivos estáticos
```bash
npm run preview
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Si tienes alguna pregunta o problema, por favor abre un issue en el repositorio.
