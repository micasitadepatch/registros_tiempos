# Sistema de Fichajes - Mi Casita de Patch

## Requisitos

- Node.js (<https://nodejs.org/>)
- Navegador web moderno (Chrome, Edge, Firefox, etc.)

## Estructura del proyecto

```
www/                # Carpeta principal del frontend (abre index.html aquí)
send-email.js       # Backend Node.js para enviar emails con adjuntos
```

## Instalación y primer uso

### 1. Copia el proyecto

Copia la carpeta `www` y el archivo `send-email.js` a tu nuevo PC.

### 2. Instala Node.js

Descarga e instala Node.js desde [nodejs.org](https://nodejs.org/).

### 3. Instala las dependencias del backend

Abre una terminal en la carpeta donde está `send-email.js` (por ejemplo, dentro de `www`):

```bash
cd ruta/del/proyecto/www
npm install express nodemailer multer cors
```

### 4. Configura el backend SMTP

Edita el archivo `send-email.js` y pon tus datos SMTP:

```
host: 'smtp.tu-servidor.com', // Ejemplo: smtp.gmail.com, smtp.ionos.es, etc.
port: 465, // O 587 según tu proveedor
secure: true, // true para 465, false para 587
auth: {
  user: 'TU_EMAIL', // Tu email real
  pass: 'TU_PASSWORD' // Tu contraseña o app password
}
```

**Ejemplo para Gmail:**

```
host: 'smtp.gmail.com',
port: 465,
secure: true,
auth: {
  user: 'tucorreo@gmail.com',
  pass: 'tu_app_password'
}
```

### 5. Arranca el backend

En la misma carpeta que `send-email.js`:

```bash
node send-email.js
```

Verás:

```
Servidor de email en puerto 3001
```

### 6. Abre el frontend

- Abre el archivo `www/index.html` en tu navegador.
- O usa una extensión como Live Server de VSCode para abrir la carpeta `www`.

### 7. ¡Listo

- Usa la web normalmente.
- El envío de emails funcionará desde el formulario de exportar por email.

---

## Notas

- Si el backend está en otro PC o servidor, cambia la URL en el fetch del frontend (`http://localhost:3001/api/send-email`) por la IP o dominio correspondiente.
- Si usas Gmail, debes crear una contraseña de aplicación (no tu contraseña normal).
- Si tienes dudas sobre la configuración SMTP, consulta la documentación de tu proveedor o pide ayuda.

---

**¡Disfruta tu sistema de fichajes y exportación profesional!**
