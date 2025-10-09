# Arquitectura del Proyecto

## Descripción General

Este proyecto es una aplicación web de registro de tiempos (fichajes) que sigue un modelo cliente-servidor.

El **cliente** es una aplicación de una sola página (SPA) construida con HTML, CSS y JavaScript puro. El **servidor** es una API RESTful desarrollada en Node.js con el framework Express, encargada de la lógica de negocio y la persistencia de datos.

## Componentes Principales

### 1. Frontend (Cliente)

- **`index.html`**: Punto de entrada de la aplicación y estructura principal de la interfaz de usuario.
- **`styles.css`**: Estilos para la presentación visual de la aplicación.
- **`js/`**: Carpeta que contiene la lógica del cliente.
    - Manejo de eventos de la interfaz (clics, envíos de formularios).
    - Realización de peticiones (fetch) a la API del backend.
    - Renderizado dinámico de datos en el HTML.

### 2. Backend (Servidor)

- **`fichajes-api.js`**: (Suposición) El punto de entrada principal del servidor. Configura el servidor Express, define los middlewares y monta las rutas de la API.
- **`auth-api.js`**: Módulo de la API que gestiona la autenticación de usuarios (ej. login, registro, validación de tokens JWT).
- **`fichajes-api.js`**: Módulo de la API que gestiona las operaciones CRUD (Crear, Leer, Actualizar, Borrar) para los registros de tiempo.
- **`database.js`**: Módulo de acceso a datos. Gestiona la conexión con la base de datos SQLite y exporta funciones para realizar consultas (ej. `SELECT`, `INSERT`).
- **`middleware.js`**: Contiene funciones de middleware para Express, como la verificación de tokens de autenticación antes de permitir el acceso a rutas protegidas.
- **`send-email.js`**: Módulo para el envío de correos electrónicos, probablemente utilizado para exportar informes o enviar notificaciones.
- **`package.json`**: Define los metadatos del proyecto, las dependencias (Express, SQLite3, Nodemailer, etc.) y los scripts de ejecución.

### 3. Base de Datos

- **`fichajes.db`**: Archivo de la base de datos SQLite. Almacena toda la información persistente de la aplicación, como usuarios y registros de tiempo.
- **`seed.js`**: Script para poblar la base de datos con datos iniciales o de prueba.

## Flujo de Datos (Ejemplo: Crear un fichaje)

1.  El usuario, ya autenticado, pulsa el botón "Fichar" en `index.html`.
2.  El JavaScript del frontend captura el evento y realiza una petición `POST` a un endpoint como `/api/fichajes`, incluyendo el token de autenticación en las cabeceras.
3.  El servidor Express recibe la petición.
4.  El `middleware.js` intercepta la petición, verifica la validez del token JWT.
5.  Si el token es válido, la petición pasa al manejador de ruta correspondiente en `fichajes-api.js`.
6.  El manejador utiliza una función de `database.js` para insertar un nuevo registro en la tabla de fichajes de `fichajes.db`.
7.  La base de datos confirma la inserción.
8.  El servidor responde al frontend con un código de estado `201 Created` y los datos del nuevo fichaje.
9.  El JavaScript del frontend actualiza la interfaz para mostrar el nuevo registro.
