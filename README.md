# 🧠 Gestor de Proyectos — Frontend (Next.js + Tailwind + React Query)

Este es el **frontend** del sistema de gestión de proyectos desarrollado para la materia **Desarrollo de Proyectos de Software - UDB**. Permite crear, editar y eliminar proyectos y tareas, así como administrar usuarios.

> Este frontend consume el backend disponible en: [`proyecto_udb`](https://github.com/r4ams/proyecto_udb)

---

## 🚀 Tecnologías

- [Next.js 15 (App Router)](https://nextjs.org)
- [React 18](https://reactjs.org)
- [Tailwind CSS](https://tailwindcss.com)
- [Flowbite React](https://flowbite-react.com)
- [React Query (TanStack)](https://tanstack.com/query/v5)
- [Heroicons](https://heroicons.com)
- [Laravel Passport (para autenticación vía API)](https://laravel.com/docs/passport)

---

## 🔧 Instalación

### 1. Clonar el repositorio
```bash
git clone https://github.com/r4ams/gestor-proyectos-frontend.git
cd gestor-proyectos-frontend
```

### 2. Instalar dependencias

```bash
npm install`
```

### 3. Configurar la URL del backend en el archivo: lib/axios.js

```bash
const  api  =  axios.create({
	baseURL:  'http://localhost:8000/api',
});
```
### 4. Ejecutar la app
```bash
npm run dev
```

## 🔐 Autenticación

El sistema utiliza **Laravel Passport** para autenticación mediante tokens. Al iniciar sesión, se almacena un `access_token` en `localStorage` para autorizar las peticiones.

---
## 🧰 Funcionalidades

### 👥 Autenticación

-   Iniciar sesión con email y contraseña
    
-   Cierre de sesión manual
    

### 📂 Gestión de Proyectos

-   Listado de proyectos
    
-   Crear proyecto
    
-   Editar proyecto
    
-   Eliminar proyecto
    
-   Ver detalles del proyecto (incluye tareas)
    

### ✅ Gestión de Tareas

-   Ver tareas por proyecto
    
-   Crear tarea
    
-   Editar tarea (modal)
    
-   Eliminar tarea
    
-   Marcar como completada (checkbox)
    

### 👤 Gestión de Usuarios

-   Listado de usuarios
    
-   Crear nuevo usuario
    
-   Eliminar usuario

---

## 🧪 Pruebas

Puedes probar el sistema junto con el backend desde:

-   Frontend: [http://localhost:3000](http://localhost:3000)
    
-   Backend: [http://localhost:8000](http://localhost:8000)