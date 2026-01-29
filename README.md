# 🚀 Registro de Tiempos v1.0.0

Aplicación web para el registro de horas de fichaje de empleados, con un panel de administración para la gestión de usuarios y visualización de datos.

### ✨ URLs de Producción

- **Frontend (Aplicación Principal):** [https://fichajes.micasitadepatch.com](https://fichajes.micasitadepatch.com)
- **Backend (API):** [https://apiregtp.micasitadepatch.com](https://apiregtp.micasitadepatch.com)

---

### 🛠️ Stack Tecnológico

- **Backend:** 🐍 Python, FastAPI, SQLAlchemy, PostgreSQL.
- **Frontend:** ⚛️ React.js, JavaScript, CSS.
- **Despliegue:** ☁️ Dynahosting, cPanel, Phusion Passenger, SSH, Git.

---

### 📁 Estructura del Proyecto

```
/
├── app/            # Código fuente del backend (FastAPI)
├── frontend/       # Código fuente del frontend (React)
├── .env.example    # Ejemplo de variables de entorno para el backend
└── requirements.txt # Dependencias de Python
```

---

### ⚙️ Configuración

#### Backend

El backend requiere un archivo `.env` en la raíz del proyecto (`api_regtp/` en el servidor) para conectarse a la base de datos.

**`.env` en el servidor:**
```
DATABASE_URL=postgresql://<usuario_db>:<contraseña_db>@<host_db>/<nombre_db>
```

#### Frontend

La URL de la API se configura directamente en el archivo `frontend/src/api.js`.

```javascript
// frontend/src/api.js
export const API_URL = 'https://apiregtp.micasitadepatch.com';
```

---

### 💻 Desarrollo Local

1.  **Backend:**
    - `pip install -r requirements.txt`
    - `uvicorn app.main:application --reload`

2.  **Frontend:**
    - `cd frontend`
    - `npm install`
    - `npm start`

---

### 🚢 Flujo de Despliegue en Dynahosting

#### Backend (vía SSH)

1.  **Conectar por SSH:**
    ```sh
    ssh tu_usuario@tu_dominio
    ```
2.  **Navegar a la carpeta de la API:**
    ```sh
    cd ~/api_regtp
    ```
3.  **Descargar los últimos cambios desde GitHub:**
    ```sh
    git pull origin main
    ```
4.  **Activar el entorno virtual y actualizar dependencias:**
    ```sh
    source ~/virtualenv/api_regtp/3.9/bin/activate
    pip install -r requirements.txt
    ```
5.  **Reiniciar la aplicación desde cPanel:**
    - Ir a "Setup Python App".
    - Usar el ciclo **Stop App -> Start App** para un reinicio completo.

#### Frontend (vía FTP/Administrador de Archivos)

1.  **Compilar el proyecto en local:**
    ```sh
    cd frontend
    npm run build
    ```
2.  **Subir el contenido de la carpeta `build`:**
    - Conectar por FTP o usar el "Administrador de Archivos" de cPanel.
    - Navegar a la carpeta del frontend: `www/regtp/`.
    - Borrar el contenido anterior y subir el **contenido** de la nueva carpeta `build`.

---

### 🩺 Scripts de Diagnóstico

La API incluye un endpoint para verificar el estado del backend y su conexión con la base de datos.

- **URL:** `https://apiregtp.micasitadepatch.com/test-db`

**Respuesta esperada (si todo va bien):**
```json
{
  "status_conexion": "OK",
  "tablas": {
    "users_existe": true,
    "fichajes_existe": true
  },
  "datos": {
    "numero_usuarios": 3
  }
}
```
