# 📦 Sistema de Backups Organizados

## 📁 Estructura de Carpetas

```
data/backups/
├── datos/     - Backups de datos (localStorage)
└── sistema/   - Backups completos del proyecto
```

## 💾 Tipos de Backup

### 📊 Backup de Datos (`datos/`)

- **Origen**: localStorage del navegador
- **Formato**: Archivos JSON
- **Contenido**:
    - Empleados registrados
    - Fichajes y horarios
    - Configuraciones del sistema
- **Activación**:
    - Manual: `escribir(13)` en consola
    - Automático: Cada vez que se modifican datos importantes (máximo cada 5 min)

### 🌐 Backup del Sistema (`sistema/`)

- **Origen**: Proyecto completo
- **Formato**: Copia de carpetas y archivos
- **Contenido**:
    - Archivos HTML, CSS, JavaScript
    - Configuraciones y versiones
    - Menú interactivo y funciones
    - Documentación y backups previos
- **Activación**:
    - Manual: `escribir(14)` en consola
    - Incluye automáticamente backup de datos

## 🚀 Cómo Usar

### Desde el Menú Interactivo

```javascript
menuComandos(); // Abrir menú
escribir(13); // Backup de datos
escribir(14); // Backup completo del sistema
```

### Estructura de Archivos Generados

#### Backup de Datos

```
datos/
├── backup-completo-YYYY-MM-DD.json    - Backup completo con metadatos
├── empleados-YYYY-MM-DD.json          - Solo empleados
└── fichajes-YYYY-MM-DD.json           - Solo fichajes
```

#### Backup del Sistema

```
sistema/
└── sistema_YYYY-MM-DDTHH-MM-SS/
    ├── backup_info.txt    - Información del backup
    ├── index.html         - Página principal
    ├── styles.css         - Estilos
    ├── js/               - Scripts JavaScript
    │   ├── menu.js       - Funcionalidad principal
    │   └── app.js        - Aplicación
    └── data/             - Datos y backups previos
```

## ⚙️ Configuración

- **Frecuencia automática**: Máximo cada 5 minutos
- **Formato de fecha**: ISO 8601 (YYYY-MM-DDTHH-MM-SS)
- **Validación**: Automática antes de crear backup
- **Limpieza**: Manual (no se borran automáticamente)

## 🔧 Restauración

### Datos

1. Cargar archivo JSON en localStorage
2. Refrescar página

### Sistema

1. Copiar carpeta del backup a ubicación deseada
2. Abrir `index.html` en navegador

---

_Sistema de Fichajes - Mi Casita de Patch_  
_Backup System v1.0_
