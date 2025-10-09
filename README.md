# Sistema de Fichajes

Una aplicación web simple para el registro de horas de trabajo, con autenticación de usuarios y exportación de datos.

## Características

- Registro de entrada y salida de empleados.
- Autenticación de usuarios basada en JWT (JSON Web Tokens).
- Cálculo automático de las horas trabajadas.
- Exportación de informes de fichajes por correo electrónico.
- Interfaz de usuario limpia y sencilla.

## Stack Tecnológico

- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Backend:** Node.js, Express.js
- **Base de Datos:** SQLite
- **Autenticación:** JSON Web Token (`jsonwebtoken`)
- **Envío de Emails:** Nodemailer

---

## Instalación y Puesta en Marcha

Sigue estos pasos para configurar y ejecutar el proyecto en tu entorno local.

### 1. Prerrequisitos

- [Node.js](https://nodejs.org/) (versión 14 o superior)
- [Git](https://git-scm.com/)

### 2. Clonar el Repositorio

```bash
git clone <URL-DEL-REPOSITORIO>
cd registros_tiempos
```

### 3. Instalar Dependencias

Instala todas las dependencias del backend definidas en `package.json`.

```bash
npm install
```

### 4. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto. Puedes copiar el archivo de ejemplo `env.example` para empezar.

```bash
cp .env.example .env
```

Ahora, abre el archivo `.env` y rellena los valores correspondientes:

```
# Puerto para el servidor de la API
PORT=3000

# Secreto para firmar los JWT
JWT_SECRET=tu_secreto_super_secreto

# Configuración del servidor de correo (SMTP)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=tu_email@example.com
SMTP_PASS=tu_contraseña
```

**Importante:** El archivo `.env` contiene información sensible y **no debe** ser subido al repositorio de Git.

### 5. Inicializar la Base de Datos

Este comando creará el archivo `fichajes.db` (si no existe) y poblará las tablas con datos iniciales.

```bash
npm run seed
```

### 6. Iniciar el Servidor

Ejecuta el servidor en modo de desarrollo. El servidor se reiniciará automáticamente cuando detecte cambios en los archivos.

```bash
npm run dev
```

El backend estará escuchando en el puerto definido en tu archivo `.env` (por defecto, `http://localhost:3000`).

### 7. Abrir el Frontend

Simplemente abre el archivo `index.html` en tu navegador web.

---

## Scripts Disponibles

Dentro de `package.json`, puedes encontrar los siguientes scripts:

- `npm start`: Inicia el servidor en modo producción.
- `npm run dev`: Inicia el servidor en modo desarrollo con `nodemon`.
- `npm run seed`: Ejecuta el script de inicialización de la base de datos.
