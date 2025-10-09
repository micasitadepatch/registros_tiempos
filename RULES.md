# Reglas del Proyecto

## 1. Estilo de Código

- **Formato automático:** Todo el código JavaScript, HTML y CSS debe ser formateado usando **Prettier**. Se recomienda integrar Prettier con el editor para que se aplique automáticamente al guardar.
- **Convenciones de nombrado:**
    - Variables y funciones en JavaScript: `camelCase`.
    - Clases en JavaScript: `PascalCase`.
    - Constantes: `UPPER_SNAKE_CASE`.
    - Nombres de archivos: `kebab-case.js` (ej. `fichajes-api.js`).
- **JavaScript Moderno:** Utilizar características de ES6+ siempre que sea posible (ej. `const`/`let` en lugar de `var`, funciones de flecha, promesas, `async/await`).

## 2. Commits y Control de Versiones

- **Mensajes de Commit:** Seguir la especificación de [**Conventional Commits**](https://www.conventionalcommits.org/en/v1.0.0/). Esto es fundamental para generar un historial de cambios legible y automatizar la generación de changelogs.
    - **Ejemplos:**
        - `feat: añadir autenticación con JWT`
        - `fix: corregir cálculo de horas en el reporte`
        - `docs: actualizar el README con instrucciones de despliegue`
        - `refactor: migrar lógica de base de datos a un módulo separado`
- **Atomicidad:** Cada commit debe representar un cambio lógico, completo y funcional. Evitar commits como "cambios varios" o "WIP".

## 3. Gestión de Ramas (Git Flow simplificado)

- **`main`**: Rama principal. Solo contiene código estable y listo para producción. Las fusiones a `main` se hacen exclusivamente desde `develop`.
- **`develop`**: Rama de integración. Es la base para desarrollar nuevas funcionalidades. Siempre debe estar en un estado funcional.
- **Ramas de funcionalidad (`feat/...`)**: Creadas a partir de `develop` para trabajar en una nueva característica. (ej. `feat/exportar-a-pdf`).
- **Ramas de corrección (`fix/...`)**: Creadas a partir de `develop` (o `main` si es un hotfix urgente) para corregir bugs. (ej. `fix/error-login-sesion`).

## 4. Gestión de Dependencias

- **No modificar `package-lock.json` manualmente.** Este archivo es gestionado automáticamente por `npm`.
- Para añadir una dependencia de producción: `npm install <nombre-paquete>`.
- Para añadir una dependencia de desarrollo (ej. linters, herramientas de testing): `npm install <nombre-paquete> --save-dev`.

## 5. Pruebas (A futuro)

- **Backend:** Añadir pruebas unitarias y de integración para la API utilizando un framework como **Jest** o **Mocha**.
- **Frontend:** Añadir pruebas unitarias para la lógica de negocio compleja en el cliente.

## 6. Seguridad

- **NUNCA** subir credenciales, contraseñas o claves de API al repositorio de Git.
- Utilizar un archivo `.env` para gestionar las variables de entorno (credenciales de base de datos, secretos de JWT, configuración de SMTP) y añadir `.env` al archivo `.gitignore`.
