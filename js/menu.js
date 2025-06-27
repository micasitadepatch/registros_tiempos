class MenuManager {
    constructor() {
        this.initializeModals();
        this.bindEvents();
        // Inicializar datos por defecto al crear la instancia
        this.inicializarDatosPorDefecto();
        this.initializeToastContainer();
    }

    // Sistema de mensajes personalizados
    initializeToastContainer() {
        // Crear contenedor de toasts si no existe
        if (!document.querySelector('.toast-container')) {
            const container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }
    }

    async mostrarConfirmacion(mensaje, titulo = '¿Confirmar acción?', tipo = 'warning') {
        return new Promise((resolve) => {
            // Crear modal de confirmación
            const modalOverlay = document.createElement('div');
            modalOverlay.className = 'modal-mensaje';

            let icono = 'fas fa-question-circle';
            if (tipo === 'danger') icono = 'fas fa-exclamation-triangle';
            if (tipo === 'warning') icono = 'fas fa-exclamation-circle';
            if (tipo === 'info') icono = 'fas fa-info-circle';

            modalOverlay.innerHTML = `
                <div class="modal-mensaje-content">
                    <div class="modal-mensaje-icon ${tipo}">
                        <i class="${icono}"></i>
                    </div>
                    <div class="modal-mensaje-title">${titulo}</div>
                    <div class="modal-mensaje-text">${mensaje}</div>
                    <div class="modal-mensaje-buttons">
                        <button class="btn btn-cancel" data-action="cancel">Cancelar</button>
                        <button class="btn btn-confirm" data-action="confirm">Confirmar</button>
                    </div>
                </div>
            `;

            // Añadir event listeners
            modalOverlay.querySelector('[data-action="confirm"]').addEventListener('click', () => {
                this.cerrarModalMensaje(modalOverlay);
                resolve(true);
            });

            modalOverlay.querySelector('[data-action="cancel"]').addEventListener('click', () => {
                this.cerrarModalMensaje(modalOverlay);
                resolve(false);
            });

            // Cerrar con Escape
            const handleEscape = (e) => {
                if (e.key === 'Escape') {
                    this.cerrarModalMensaje(modalOverlay);
                    resolve(false);
                    document.removeEventListener('keydown', handleEscape);
                }
            };
            document.addEventListener('keydown', handleEscape);

            // Mostrar modal
            document.body.appendChild(modalOverlay);
            setTimeout(() => modalOverlay.classList.add('show'), 10);
        });
    }

    mostrarAlerta(mensaje, titulo = 'Información', tipo = 'info') {
        return new Promise((resolve) => {
            // Crear modal de alerta
            const modalOverlay = document.createElement('div');
            modalOverlay.className = 'modal-mensaje';

            let icono = 'fas fa-info-circle';
            if (tipo === 'success') icono = 'fas fa-check-circle';
            if (tipo === 'error') icono = 'fas fa-times-circle';
            if (tipo === 'warning') icono = 'fas fa-exclamation-triangle';

            modalOverlay.innerHTML = `
                <div class="modal-mensaje-content">
                    <div class="modal-mensaje-icon ${tipo}">
                        <i class="${icono}"></i>
                    </div>
                    <div class="modal-mensaje-title">${titulo}</div>
                    <div class="modal-mensaje-text">${mensaje}</div>
                    <div class="modal-mensaje-buttons">
                        <button class="btn btn-confirm" data-action="ok">Aceptar</button>
                    </div>
                </div>
            `;

            // Añadir event listener
            modalOverlay.querySelector('[data-action="ok"]').addEventListener('click', () => {
                this.cerrarModalMensaje(modalOverlay);
                resolve(true);
            });

            // Cerrar con Escape
            const handleEscape = (e) => {
                if (e.key === 'Escape') {
                    this.cerrarModalMensaje(modalOverlay);
                    resolve(true);
                    document.removeEventListener('keydown', handleEscape);
                }
            };
            document.addEventListener('keydown', handleEscape);

            // Mostrar modal
            document.body.appendChild(modalOverlay);
            setTimeout(() => modalOverlay.classList.add('show'), 10);
        });
    }

    cerrarModalMensaje(modalElement) {
        modalElement.classList.remove('show');
        setTimeout(() => {
            if (modalElement.parentNode) {
                modalElement.parentNode.removeChild(modalElement);
            }
        }, 300);
    }

    mostrarToast(mensaje, tipo = 'info', duracion = 4000) {
        const container = document.querySelector('.toast-container');
        if (!container) return;

        // Crear toast
        const toast = document.createElement('div');
        toast.className = `toast ${tipo}`;

        let icono = 'fas fa-info-circle';
        if (tipo === 'success') icono = 'fas fa-check-circle';
        if (tipo === 'error') icono = 'fas fa-times-circle';
        if (tipo === 'warning') icono = 'fas fa-exclamation-triangle';

        toast.innerHTML = `
            <div class="toast-icon ${tipo}">
                <i class="${icono}"></i>
            </div>
            <div class="toast-text">${mensaje}</div>
            <button class="toast-close">
                <i class="fas fa-times"></i>
            </button>
        `;

        // Event listener para cerrar
        toast.querySelector('.toast-close').addEventListener('click', () => {
            this.cerrarToast(toast);
        });

        // Añadir al contenedor
        container.appendChild(toast);

        // Mostrar con animación
        setTimeout(() => toast.classList.add('show'), 10);

        // Auto cerrar
        setTimeout(() => this.cerrarToast(toast), duracion);
    }

    cerrarToast(toastElement) {
        toastElement.classList.remove('show');
        setTimeout(() => {
            if (toastElement.parentNode) {
                toastElement.parentNode.removeChild(toastElement);
            }
        }, 300);
    }

    initializeModals() {
        this.modals = {
            'crear-empleado': {
                title: 'Gestionar Empleados',
                content: `
                    <form id="formNuevoEmpleado">
                        <div class="form-group">
                            <label for="nombreEmpleado">👤 Nombre del Empleado:</label>
                            <input type="text" id="nombreEmpleado" placeholder="Ej: Juan Pérez" required>
                        </div>
                        <div class="form-group">
                            <label for="usernameEmpleado">🆔 Nombre de Usuario:</label>
                            <input type="text" id="usernameEmpleado" placeholder="Ej: juan.perez" required>
                            <small>Solo letras, números y puntos. Será usado para el login.</small>
                        </div>
                        <div class="form-group">
                            <label for="passwordEmpleado">🔑 Contraseña (6 dígitos):</label>
                            <input type="password" id="passwordEmpleado" maxlength="6" pattern="[0-9]{6}" 
                                   placeholder="123456" required>
                            <small>Debe contener exactamente 6 dígitos numéricos.</small>
                        </div>
                        <div class="form-group">
                            <label for="rolEmpleado">⚡ Rol del Usuario:</label>
                            <select id="rolEmpleado" required>
                                <option value="">Seleccionar rol...</option>
                                <option value="employee">👤 Empleado (Acceso limitado)</option>
                                <option value="admin">👑 Administrador (Acceso completo)</option>
                            </select>
                            <small>Los empleados solo pueden fichar y consultar. Los admin tienen acceso completo.</small>
                        </div>
                        <div class="form-actions">
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-user-plus"></i> Crear Empleado y Usuario
                            </button>
                        </div>
                    </form>
                    <div class="empleados-lista mt-4">
                        <h4>👥 Empleados y Usuarios Actuales</h4>
                        <div id="listaEmpleados" class="mt-3">
                            <!-- Lista de empleados aquí -->
                        </div>
                    </div>
                `
            },
            'fichaje-manual': {
                title: 'Registrar Fichaje Manual',
                content: `
                    <form id="formFichajeManual">
                        <div class="form-group">
                            <label for="empleadoManual">Empleado:</label>
                            <select id="empleadoManual" required></select>
                        </div>
                        <div class="form-group">
                            <label for="tipoFichaje">Tipo:</label>
                            <select id="tipoFichaje" required>
                                <option value="Entrada">Entrada</option>
                                <option value="Salida">Salida</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>
                                <input type="checkbox" id="multipleDias"> Registrar para múltiples días
                            </label>
                        </div>
                        <div class="form-group fecha-simple">
                            <label for="fichajeManualFecha">Fecha y Hora:</label>
                            <input type="datetime-local" id="fichajeManualFecha">
                        </div>
                        <div class="form-group fecha-multiple" style="display: none;">
                            <label for="fichajeManualFechaInicio">Desde:</label>
                            <input type="date" id="fichajeManualFechaInicio">
                            <label for="fichajeManualFechaFin">Hasta:</label>
                            <input type="date" id="fichajeManualFechaFin">
                            <label for="fichajeManualHora">Hora:</label>
                            <input type="time" id="fichajeManualHora">
                        </div>
                        <button type="submit" class="btn">Registrar Fichaje</button>
                    </form>
                `
            },
            'editar-fichajes': {
                title: 'Editar Fichajes',
                content: `
                    <form id="formBuscarFichajes">
                    <div class="form-group">
                        <label for="empleadoEdicion">Empleado:</label>
                        <select id="empleadoEdicion" class="form-control">
                            <option value="">Todos los empleados</option>
                        </select>
                    </div>
                        <div class="form-group">
                            <label>
                                <input type="checkbox" id="rangoFechas"> Buscar por rango de fechas
                            </label>
                        </div>
                        <div class="fecha-simple-edicion">
                    <div class="form-group">
                        <label for="fechaEdicion">Fecha:</label>
                                <input type="date" id="fechaEdicion" class="form-control">
                    </div>
                        </div>
                        <div class="fecha-rango-edicion" style="display: none;">
                    <div class="form-group">
                                <label for="fechaEdicionInicio">Desde:</label>
                                <input type="date" id="fechaEdicionInicio" class="form-control">
                            </div>
                            <div class="form-group">
                                <label for="fechaEdicionFin">Hasta:</label>
                                <input type="date" id="fechaEdicionFin" class="form-control">
                            </div>
                        </div>
                        <div class="form-group">
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-search"></i> Buscar Fichajes
                        </button>
                    </div>
                    </form>
                    <div id="listaFichajes" class="fichajes-lista">
                        <!-- Los fichajes se mostrarán aquí -->
                    </div>
                `
            },
            'eliminar-fichajes': {
                title: 'Eliminar Fichajes',
                content: `
                    <form id="formBuscarFichajesEliminar">
                        <div class="form-group">
                            <label for="empleadoEliminacion">Empleado:</label>
                            <select id="empleadoEliminacion" class="form-control">
                                <option value="">Todos los empleados</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>
                                <input type="checkbox" id="rangoFechasEliminar"> Buscar por rango de fechas
                            </label>
                        </div>
                        <div class="fecha-simple-eliminacion">
                            <div class="form-group">
                                <label for="fechaEliminacion">Fecha:</label>
                                <input type="date" id="fechaEliminacion" class="form-control">
                            </div>
                        </div>
                        <div class="fecha-rango-eliminacion" style="display: none;">
                            <div class="form-group">
                                <label for="fechaEliminacionInicio">Desde:</label>
                                <input type="date" id="fechaEliminacionInicio" class="form-control">
                            </div>
                            <div class="form-group">
                                <label for="fechaEliminacionFin">Hasta:</label>
                                <input type="date" id="fechaEliminacionFin" class="form-control">
                            </div>
                        </div>
                        <div class="form-group">
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-search"></i> Buscar Fichajes
                            </button>
                        </div>
                    </form>
                    
                    <div class="separador-acciones">
                        <hr>
                        <div class="form-group">
                            <h4>Acciones Rápidas</h4>
                            <button type="button" class="btn btn-danger btn-large" id="eliminarTodosDirecto">
                                <i class="fas fa-exclamation-triangle"></i> Eliminar TODOS los Fichajes
                            </button>
                            <p class="text-small text-muted">⚠️ Esta acción eliminará todos los fichajes de todos los empleados y no se puede deshacer</p>
                        </div>
                    </div>
                    
                    <div id="listaFichajesEliminar" class="fichajes-lista">
                        <!-- Los fichajes se mostrarán aquí -->
                    </div>
                    <div class="form-group eliminar-acciones" style="display: none;">
                        <button type="button" class="btn btn-danger" id="eliminarSeleccionados">
                            <i class="fas fa-trash"></i> Eliminar Seleccionados
                        </button>
                        <button type="button" class="btn btn-danger-outline" id="eliminarTodosFiltrados">
                            <i class="fas fa-trash-alt"></i> Eliminar Todos los Mostrados
                        </button>
                    </div>
                `
            },
            'ver-fichajes': {
                title: 'Consultar Fichajes',
                content: `
                    <form id="formConsultaFichajes">
                        <div class="form-group">
                            <label for="empleadoConsulta">Empleado:</label>
                            <select id="empleadoConsulta">
                                <option value="">Todos los empleados</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="consultaFechaInicio">Desde:</label>
                            <input type="date" id="consultaFechaInicio" required>
                        </div>
                        <div class="form-group">
                            <label for="consultaFechaFin">Hasta:</label>
                            <input type="date" id="consultaFechaFin" required>
                        </div>
                        <button type="submit" class="btn">Consultar</button>
                    </form>
                    <div id="resultadosFichajes" class="mt-4"></div>
                `
            },
            'exportar': {
                title: 'Exportar Fichajes',
                content: `
                    <div class="export-options">
                        <button class="btn" data-export="pdf">
                            <i class="fas fa-file-pdf"></i>
                            Exportar PDF
                        </button>
                        <button class="btn" data-export="excel">
                            <i class="fas fa-file-excel"></i>
                            Exportar Excel
                        </button>
                        <button class="btn" data-export="csv">
                            <i class="fas fa-file-csv"></i>
                            Exportar CSV
                        </button>
                        <button class="btn btn-export-email">
                            <i class="fas fa-envelope"></i>
                            Enviar por Email
                        </button>
                    </div>
                `
            },
            'imprimir': {
                title: 'Imprimir Informe de Fichajes',
                content: `
                    <form id="formImprimirFichajes">
                        <div class="form-group">
                            <label for="empleadoImprimir">Empleado:</label>
                            <select id="empleadoImprimir">
                                <option value="">Todos los empleados</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="imprimirFechaInicio">Desde:</label>
                            <input type="date" id="imprimirFechaInicio" required>
                        </div>
                        <div class="form-group">
                            <label for="imprimirFechaFin">Hasta:</label>
                            <input type="date" id="imprimirFechaFin" required>
                        </div>
                        <button type="submit" class="btn">
                            <i class="fas fa-print"></i>
                            Generar Informe
                        </button>
                    </form>
                    <div id="resultadosImprimir" class="mt-4"></div>
                `
            },
            'exportarEmail': {
                title: 'Enviar Fichajes por Email',
                content: `
                    <form id="formExportarEmail">
                        <div class="form-group">
                            <label for="emailDestino">Correo de destino:</label>
                            <input type="email" id="emailDestino" name="emailDestino" required placeholder="usuario@dominio.com" style="width:100%;padding:0.5em;">
                        </div>
                        <div class="form-group">
                            <label for="usuarioExportar">Empleado:</label>
                            <select id="usuarioExportar" name="usuarioExportar" style="width:100%;padding:0.5em;">
                                <option value="">Todos los empleados</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="fechaInicioExportar">Desde:</label>
                            <input type="date" id="fechaInicioExportar" name="fechaInicioExportar" style="width:100%;padding:0.5em;">
                        </div>
                        <div class="form-group">
                            <label for="fechaFinExportar">Hasta:</label>
                            <input type="date" id="fechaFinExportar" name="fechaFinExportar" style="width:100%;padding:0.5em;">
                        </div>
                        <div class="form-group">
                            <label for="formatoArchivo">Formato:</label>
                            <select id="formatoArchivo" name="formatoArchivo" style="width:100%;padding:0.5em;">
                                <option value="pdf">PDF</option>
                                <option value="excel">Excel</option>
                                <option value="csv">CSV</option>
                            </select>
                        </div>
                        <button type="submit" class="btn btn-primary" style="width:100%;margin-top:1em;">
                            <i class="fas fa-paper-plane"></i> Enviar
                        </button>
                    </form>
                `
            }
        };
    }

    bindEvents() {
        // Remover eventos existentes para evitar duplicados
        if (this.eventsBound) {
            return;
        }

        this.eventsBound = true;

        document.body.addEventListener('click', (e) => {
            // Evitar propagación múltiple
            if (e.defaultPrevented) return;

            // Log para debugging - solo para botones de empleado
            if (e.target.matches('.eliminar-empleado') || e.target.closest('.eliminar-empleado') ||
                e.target.matches('.fas.fa-trash')) {
                console.log('🖱️ Click detectado en:', e.target);
                console.log('   - Clases:', e.target.classList.toString());
                console.log('   - Parent:', e.target.parentElement);
                console.log('   - Closest eliminar-empleado:', e.target.closest('.eliminar-empleado'));
            }

            // Manejo de botones del menú
            const menuBtn = e.target.closest('.menu-btn');
            if (menuBtn) {
                e.preventDefault();
                const action = menuBtn.dataset.action;
                this.mostrarModal(action);
                return;
            }

            // Manejo de botones dentro de modales
            if (e.target.matches('.eliminar-empleado') || e.target.closest('.eliminar-empleado')) {
                e.preventDefault();
                console.log('🗑️ Click en botón eliminar empleado detectado');
                const button = e.target.matches('.eliminar-empleado') ? e.target : e.target.closest('.eliminar-empleado');
                console.log('   - Botón:', button);
                console.log('   - ID del empleado:', button.dataset.id);
                this.eliminarEmpleado(button.dataset.id);
            } else if (e.target.matches('.eliminar-fichaje')) {
                e.preventDefault();
                this.eliminarFichaje(e.target.dataset.index);
            } else if (e.target.matches('#eliminarSeleccionados')) {
                e.preventDefault();
                this.eliminarFichajesSeleccionados();
            } else if (e.target.matches('#eliminarTodos') || e.target.matches('#eliminarTodosFiltrados')) {
                e.preventDefault();
                this.eliminarTodosFichajes();
            } else if (e.target.matches('#eliminarTodosDirecto')) {
                e.preventDefault();
                this.eliminarTodosLosFilejes();
            } else if (e.target.matches('[data-export]')) {
                e.preventDefault();
                // Prevenir doble click
                if (e.target.disabled) return;
                e.target.disabled = true;
                setTimeout(() => e.target.disabled = false, 2000);
                this.exportarFichajes(e.target.dataset.export);
            } else if (e.target.matches('.modal-close') || e.target.matches('.modal-overlay')) {
                // NO cerrar el modal de login - es crítico para la seguridad
                const loginModal = document.getElementById('loginModal');
                if (loginModal && (loginModal.style.display !== 'none')) {
                    console.log('🚫 No se puede cerrar el modal de login - requiere autenticación');
                    return;
                }
                this.cerrarModal();
            } else if (e.target.matches('.btn-export-email')) {
                e.preventDefault();
                if (window.menuManager && window.menuManager.mostrarModal) {
                    window.menuManager.mostrarModal('exportarEmail');
                }
                return;
            }
        });

        // Manejo de formularios
        document.body.addEventListener('submit', async (e) => {
            e.preventDefault();
            e.stopImmediatePropagation(); // Prevenir múltiples listeners

            if (e.target.matches('#formNuevoEmpleado')) {
                console.log('Formulario de nuevo empleado enviado');
                await this.crearEmpleado(e.target);
            } else if (e.target.matches('#formFichajeManual')) {
                this.registrarFichajeManual(e.target);
            } else if (e.target.matches('#formConsultaFichajes')) {
                this.consultarFichajes(e.target);
            } else if (e.target.matches('#formBuscarFichajes')) {
                this.buscarFichajes();
            } else if (e.target.matches('#formBuscarFichajesEliminar')) {
                this.buscarFichajesEliminar();
            } else if (e.target.matches('#formImprimirFichajes')) {
                console.log('📝 Formulario de impresión enviado');

                // Verificar si ya está procesando
                if (this.generatingReport) {
                    console.log('⚠️ Ya se está generando un informe, ignorando envío duplicado');
                    return;
                }

                // Prevenir doble envío para el formulario de impresión
                const submitBtn = e.target.querySelector('button[type="submit"]');
                if (submitBtn) {
                    if (submitBtn.disabled) {
                        console.log('⚠️ Botón ya deshabilitado, ignorando');
                        return;
                    }

                    submitBtn.disabled = true;
                    const originalText = submitBtn.textContent;
                    submitBtn.textContent = 'Generando...';

                    // Restaurar botón después de un tiempo
                    setTimeout(() => {
                        submitBtn.disabled = false;
                        submitBtn.textContent = originalText;
                        console.log('🔄 Botón de impresión restaurado');
                    }, 4000);
                }

                this.consultarFichajesImprimir(e.target);
            } else if (e.target.matches('#formExportarEmail')) {
                e.preventDefault();
                const email = e.target.emailDestino.value.trim();
                const formato = e.target.formatoArchivo.value;
                const usuario = e.target.usuarioExportar.value;
                const fechaInicio = e.target.fechaInicioExportar.value;
                const fechaFin = e.target.fechaFinExportar.value;
                if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
                    window.menuManager.mostrarMensaje('Introduce un email válido', 'error');
                    return;
                }
                let fichajes = JSON.parse(localStorage.getItem('fichajes') || '[]');
                if (usuario) {
                    fichajes = fichajes.filter(f => f.employee === usuario);
                }
                if (fechaInicio) {
                    const desde = new Date(fechaInicio);
                    fichajes = fichajes.filter(f => new Date(f.timestamp) >= desde);
                }
                if (fechaFin) {
                    const hasta = new Date(fechaFin);
                    hasta.setHours(23, 59, 59, 999);
                    fichajes = fichajes.filter(f => new Date(f.timestamp) <= hasta);
                }
                if (fichajes.length === 0) {
                    window.menuManager.mostrarMensaje('No hay fichajes para exportar', 'error');
                    return;
                }
                let blob = null;
                let nombreArchivo = '';
                if (formato === 'pdf') {
                    blob = await this.exportarPDFComoBlob(fichajes);
                    nombreArchivo = 'fichajes.pdf';
                } else if (formato === 'excel') {
                    blob = await this.exportarExcelComoBlob(fichajes);
                    nombreArchivo = 'fichajes.xlsx';
                } else if (formato === 'csv') {
                    blob = await this.exportarCSVComoBlob(fichajes);
                    nombreArchivo = 'fichajes.csv';
                }
                if (!blob) {
                    window.menuManager.mostrarMensaje('No se pudo generar el archivo para enviar', 'error');
                    return;
                }
                const formData = new FormData();
                formData.append('email', email);
                formData.append('file', blob, nombreArchivo);
                try {
                    const res = await fetch('http://localhost:3001/api/send-email', {
                        method: 'POST',
                        body: formData
                    });
                    if (!res.ok) throw new Error('Error enviando email');
                    window.menuManager.mostrarMensaje('Fichajes enviados a ' + email, 'success');
                    window.menuManager.cerrarModal();
                } catch (err) {
                    window.menuManager.mostrarMensaje('Error al enviar el email', 'error');
                }
            }
        });

        // Manejo de cambios en el checkbox de múltiples días
        document.body.addEventListener('change', (e) => {
            if (e.target.matches('#multipleDias')) {
                const fechaSimple = document.querySelector('.fecha-simple');
                const fechaMultiple = document.querySelector('.fecha-multiple');
                fechaSimple.style.display = e.target.checked ? 'none' : 'block';
                fechaMultiple.style.display = e.target.checked ? 'block' : 'none';
            } else if (e.target.matches('#rangoFechas')) {
                const fechaSimpleEdicion = document.querySelector('.fecha-simple-edicion');
                const fechaRangoEdicion = document.querySelector('.fecha-rango-edicion');
                if (fechaSimpleEdicion && fechaRangoEdicion) {
                    fechaSimpleEdicion.style.display = e.target.checked ? 'none' : 'block';
                    fechaRangoEdicion.style.display = e.target.checked ? 'block' : 'none';
                }
            } else if (e.target.matches('#rangoFechasEliminar')) {
                const fechaSimpleEliminacion = document.querySelector('.fecha-simple-eliminacion');
                const fechaRangoEliminacion = document.querySelector('.fecha-rango-eliminacion');
                if (fechaSimpleEliminacion && fechaRangoEliminacion) {
                    fechaSimpleEliminacion.style.display = e.target.checked ? 'none' : 'block';
                    fechaRangoEliminacion.style.display = e.target.checked ? 'block' : 'none';
                }
            }
        });

        // Cerrar modal con Escape (excepto el modal de login)
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                // NO cerrar el modal de login - es crítico para la seguridad
                const loginModal = document.getElementById('loginModal');
                if (loginModal && (loginModal.style.display !== 'none')) {
                    console.log('🚫 No se puede cerrar el modal de login con Escape - requiere autenticación');
                    return;
                }
                this.cerrarModal();
            }
        });
    }

    async mostrarModal(action) {
        const modalConfig = this.modals[action];
        if (!modalConfig) return;

        console.log('Abriendo modal:', action);

        // Limpiar modales existentes
        this.cerrarModal();

        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'modal-overlay';

        const modalDiv = document.createElement('div');
        modalDiv.className = 'modal';
        modalDiv.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${modalConfig.title}</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    ${modalConfig.content}
                </div>
            </div>
        `;

        document.body.appendChild(modalOverlay);
        document.body.appendChild(modalDiv);

        // Forzar renderizado del DOM
        modalDiv.offsetHeight;

        try {
            // Inicializar elementos específicos del modal
            if (action === 'fichaje-manual') {
                await this.inicializarFormularioFichajeManual();
            } else if (action === 'ver-fichajes') {
                await this.inicializarVerFichajes();
            } else if (action === 'crear-empleado') {
                await this.actualizarListaEmpleados();
                console.log('Lista de empleados actualizada al abrir el modal');
            } else if (action === 'editar-fichajes') {
                await this.inicializarEditarFichajes(modalDiv);
            } else if (action === 'eliminar-fichajes') {
                await this.inicializarEliminarFichajes(modalDiv);
            } else if (action === 'imprimir') {
                await this.inicializarImprimirFichajes();
            } else if (action === 'exportarEmail') {
                await this.inicializarExportarEmail();
            }

            // Esperar un poco para que el DOM esté completamente renderizado
            await new Promise(resolve => setTimeout(resolve, 100));

            // Actualizar selectores específicamente en el modal recién creado
            await this.actualizarSelectoresEnModal(modalDiv);

            // También actualizar todos los selectores por si acaso
            await this.actualizarTodosLosSelectores();

            // Animar apertura
            modalOverlay.classList.add('show');
            modalDiv.classList.add('show');

            console.log('Modal inicializado correctamente');
        } catch (error) {
            console.error('Error al inicializar el modal:', error);
            this.mostrarMensaje('Error al abrir la ventana', 'error');
        }
    }

    cerrarModal() {
        const modales = document.querySelectorAll('.modal, .modal-overlay');
        modales.forEach(modal => {
            modal.classList.remove('show');
            setTimeout(() => modal.remove(), 300);
        });
    }

    actualizarTablaFichajes() {
        try {
            const tbody = document.getElementById('registrosBody');
            if (!tbody) return;

            const fichajes = this.obtenerFichajes();

            // Filtrar solo los fichajes del día actual
            const hoy = new Date().toLocaleDateString('es-ES');
            const fichajesHoy = fichajes.filter(f =>
                new Date(f.timestamp).toLocaleDateString('es-ES') === hoy
            );

            // Ordenar por hora descendente (más recientes primero)
            fichajesHoy.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

            // Actualizar tabla
            tbody.innerHTML = fichajesHoy.map(f => {
                const fechaFichaje = new Date(f.timestamp);
                const tiempoAcumulado = window.calcularTiempoAcumulado ?
                    window.calcularTiempoAcumulado(f.employee, fechaFichaje, fichajes) :
                    '<span class="tiempo-acumulado">--:--</span>';
                return `
                <tr>
                    <td>${f.employee}</td>
                    <td><span class="tipo ${f.type.toLowerCase()}">${f.type}</span></td>
                        <td>${fechaFichaje.toLocaleTimeString('es-ES')}</td>
                        <td>${tiempoAcumulado}</td>
                </tr>
                `;
            }).join('');

            // Si no hay fichajes hoy, mostrar mensaje
            if (fichajesHoy.length === 0) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="4" class="text-center">No hay fichajes registrados hoy</td>
                    </tr>
                `;
            }
        } catch (error) {
            console.error('Error al actualizar tabla de fichajes:', error);
            this.mostrarMensaje('Error al actualizar la tabla', 'error');
        }
    }

    mostrarMensaje(mensaje, tipo = 'success') {
        // Usar el nuevo sistema de toasts
        this.mostrarToast(mensaje, tipo, 4000);
    }

    async cargarEmpleadosEnSelect(selectId) {
        try {
            console.log('Iniciando carga de empleados para select:', selectId);
            const select = document.getElementById(selectId);
            if (!select) {
                console.error('No se encontró el elemento select:', selectId);
                return;
            }

            // Guardar el valor actual si existe
            const valorActual = select.value;
            console.log('Valor actual del select:', valorActual);

            // Limpiar todas las opciones
            select.innerHTML = '';

            // Agregar opción por defecto
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = 'Seleccionar empleado';
            select.appendChild(defaultOption);

            // Obtener empleados
            console.log('Solicitando lista de empleados...');
            const empleados = await this.obtenerEmpleados();
            console.log('Empleados obtenidos:', empleados);

            // Agregar empleados ordenados alfabéticamente
            if (empleados && empleados.length > 0) {
                console.log('Procesando', empleados.length, 'empleados');
                empleados
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .forEach(emp => {
                        const option = document.createElement('option');
                        option.value = emp.name;
                        option.textContent = emp.name;
                        select.appendChild(option);
                        console.log('Agregado empleado:', emp.name);
                    });

                // Restaurar el valor anterior si existía y sigue siendo válido
                if (valorActual && empleados.some(emp => emp.name === valorActual)) {
                    select.value = valorActual;
                    console.log('Valor restaurado:', valorActual);
                }
            } else {
                console.log('No se encontraron empleados');
                // Agregar opción cuando no hay empleados
                const noEmpleadosOption = document.createElement('option');
                noEmpleadosOption.value = '';
                noEmpleadosOption.textContent = 'No hay empleados registrados';
                noEmpleadosOption.disabled = true;
                select.appendChild(noEmpleadosOption);
            }
        } catch (error) {
            console.error('Error al cargar empleados en select:', error);
            this.mostrarMensaje('Error al cargar la lista de empleados', 'error');
        }
    }

    async obtenerEmpleados() {
        try {
            console.log('Obteniendo empleados...');
            // Obtener empleados desde localStorage con estructura consistente
            const empleadosGuardados = localStorage.getItem('employees');

            if (empleadosGuardados) {
                console.log('Empleados encontrados en localStorage');
                const data = JSON.parse(empleadosGuardados);

                // Manejar diferentes formatos para retrocompatibilidad
                if (Array.isArray(data)) {
                    console.log('Formato de array directo encontrado, migrando...');
                    // Migrar formato antiguo a nuevo formato
                    const nuevoFormato = { employees: data };
                    localStorage.setItem('employees', JSON.stringify(nuevoFormato));
                    console.log('Número de empleados migrados:', data.length);
                    return data;
                } else if (data.employees && Array.isArray(data.employees)) {
                    console.log('Formato correcto encontrado, empleados:', data.employees.length);
                    return data.employees;
                }
            }

            // Si no hay empleados en localStorage, inicializar con empleados por defecto
            console.log('No hay empleados en localStorage, inicializando con empleados por defecto');
            const empleadosIniciales = [
                { id: '1', name: 'Asera' },
                { id: '2', name: 'Eva' }
            ];

            const estructuraInicial = { employees: empleadosIniciales };
            localStorage.setItem('employees', JSON.stringify(estructuraInicial));
            console.log('Empleados iniciales guardados:', empleadosIniciales.length);

            return empleadosIniciales;
        } catch (error) {
            console.error('Error al cargar empleados:', error);
            // En caso de error, devolver empleados por defecto
            return [
                { id: '1', name: 'Asera' },
                { id: '2', name: 'Eva' }
            ];
        }
    }

    async guardarEmpleados(empleados) {
        try {
            console.log('Guardando empleados:', empleados.length);
            const estructura = { employees: empleados };
            localStorage.setItem('employees', JSON.stringify(estructura));
            console.log('Empleados guardados correctamente');

            // Crear copia de seguridad automática
            this.crearCopiaSeguridad();

            return true;
        } catch (error) {
            console.error('Error al guardar empleados:', error);
            return false;
        }
    }

    obtenerFichajes() {
        try {
            const fichajes = localStorage.getItem('fichajes');
            return fichajes ? JSON.parse(fichajes) : [];
        } catch (error) {
            console.error('Error al obtener fichajes:', error);
            return [];
        }
    }

    guardarFichajes(fichajes) {
        try {
            localStorage.setItem('fichajes', JSON.stringify(fichajes));

            // Crear copia de seguridad automática
            this.crearCopiaSeguridad();

            return true;
        } catch (error) {
            console.error('Error al guardar fichajes:', error);
            return false;
        }
    }

    // Método para inicializar datos por defecto
    async inicializarDatosPorDefecto() {
        try {
            console.log('Inicializando datos por defecto...');

            // Verificar si ya existen empleados
            const empleadosExistentes = localStorage.getItem('employees');
            if (!empleadosExistentes) {
                const empleadosIniciales = [
                    { id: '1', name: 'Asera' },
                    { id: '2', name: 'Eva' }
                ];
                await this.guardarEmpleados(empleadosIniciales);
                console.log('Empleados por defecto inicializados');
            }

            // Verificar si ya existen fichajes
            const fichajesExistentes = localStorage.getItem('fichajes');
            if (!fichajesExistentes) {
                this.guardarFichajes([]);
                console.log('Array de fichajes inicializado');
            }

            console.log('Inicialización de datos completada');
        } catch (error) {
            console.error('Error al inicializar datos por defecto:', error);
        }
    }

    async actualizarListaEmpleados() {
        console.log('Iniciando actualización de lista de empleados');
        const container = document.getElementById('listaEmpleados');
        if (!container) {
            console.error('No se encontró el contenedor de la lista de empleados');
            return;
        }

        try {
            const empleados = await this.obtenerEmpleados();
            console.log('Empleados obtenidos:', empleados);

            if (!empleados || !empleados.length) {
                console.log('No hay empleados para mostrar');
                container.innerHTML = '<p class="text-center">No hay empleados registrados</p>';
                return;
            }

            // Ordenar empleados alfabéticamente
            empleados.sort((a, b) => a.name.localeCompare(b.name));

            const html = empleados.map(emp => {
                const roleIcon = emp.role === 'admin' ? '👑' : '👤';
                const roleText = emp.role === 'admin' ? 'Administrador' : 'Empleado';
                const usernameText = emp.username ? ` (@${emp.username})` : '';

                return `
                    <div class="empleado-item" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; padding: 12px; background-color: #f8f9fa; border-radius: 6px; border-left: 4px solid ${emp.role === 'admin' ? '#007bff' : '#28a745'};">
                        <div class="empleado-info">
                            <div class="empleado-nombre" style="font-weight: 600; color: #333;">
                                ${roleIcon} ${emp.name}${usernameText}
                            </div>
                            <div class="empleado-rol" style="font-size: 0.85em; color: #666; margin-top: 2px;">
                                ${roleText}${emp.username ? ' • Puede iniciar sesión' : ' • Sin acceso al sistema'}
                            </div>
                        </div>
                        <button class="btn-icon eliminar-empleado" data-id="${emp.id}" title="Eliminar empleado y usuario" style="background: none; border: none; color: #dc3545; cursor: pointer; padding: 8px;">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                `;
            }).join('');

            container.innerHTML = html;
            console.log('Lista de empleados actualizada con', empleados.length, 'empleados');
        } catch (error) {
            console.error('Error al actualizar lista de empleados:', error);
            container.innerHTML = '<p class="text-center text-error">Error al cargar la lista de empleados</p>';
            this.mostrarMensaje('Error al actualizar la lista de empleados', 'error');
        }
    }

    async crearEmpleado(form) {
        try {
            console.log('Iniciando creación de empleado con autenticación');

            // Obtener los valores del formulario
            const nombreInput = form.querySelector('#nombreEmpleado');
            const usernameInput = form.querySelector('#usernameEmpleado');
            const passwordInput = form.querySelector('#passwordEmpleado');
            const rolInput = form.querySelector('#rolEmpleado');

            const nombre = nombreInput.value.trim();
            const username = usernameInput.value.trim();
            const password = passwordInput.value.trim();
            const rol = rolInput.value;

            // Validaciones básicas
            if (!nombre) {
                this.mostrarMensaje('El nombre del empleado es requerido', 'error');
                nombreInput.focus();
                return;
            }

            if (!username) {
                this.mostrarMensaje('El nombre de usuario es requerido', 'error');
                usernameInput.focus();
                return;
            }

            if (!password) {
                this.mostrarMensaje('La contraseña es requerida', 'error');
                passwordInput.focus();
                return;
            }

            if (password.length !== 6 || !/^\d{6}$/.test(password)) {
                this.mostrarMensaje('La contraseña debe tener exactamente 6 dígitos numéricos', 'error');
                passwordInput.focus();
                return;
            }

            if (!rol) {
                this.mostrarMensaje('Debe seleccionar un rol', 'error');
                rolInput.focus();
                return;
            }

            // Validar formato de username
            if (!/^[a-zA-Z0-9._]+$/.test(username)) {
                this.mostrarMensaje('El nombre de usuario solo puede contener letras, números y puntos', 'error');
                usernameInput.focus();
                return;
            }

            console.log('Datos del empleado a crear:', { nombre, username, rol });

            // Obtener empleados y usuarios actuales
            let empleados = await this.obtenerEmpleados();
            console.log('Empleados actuales:', empleados);

            // Verificar si ya existe un empleado con el mismo nombre
            if (empleados.some(emp => emp.name.toLowerCase() === nombre.toLowerCase())) {
                this.mostrarMensaje('Ya existe un empleado con ese nombre', 'error');
                nombreInput.focus();
                return;
            }

            // Verificar si ya existe un usuario con el mismo username
            if (window.authSystem) {
                const existeUsuario = window.authSystem.verificarExistenciaUsuario(username);
                if (existeUsuario) {
                    this.mostrarMensaje('Ya existe un usuario con ese nombre de usuario', 'error');
                    usernameInput.focus();
                    return;
                }
            }

            // Crear el empleado
            const nuevoEmpleado = {
                id: Date.now().toString(), // Usar timestamp como ID único
                name: nombre,
                username: username, // Relacionar con el usuario del sistema de auth
                role: rol
            };

            empleados.push(nuevoEmpleado);

            // Guardar empleados en localStorage
            const guardadoExitoso = await this.guardarEmpleados(empleados);

            if (!guardadoExitoso) {
                throw new Error('Error al guardar los empleados');
            }

            // Crear usuario en el sistema de autenticación
            if (window.authSystem) {
                try {
                    const usuarioCreado = window.authSystem.crearUsuario(username, nombre, rol, password);
                    if (!usuarioCreado) {
                        // Si falla la creación del usuario, revertir la creación del empleado
                        empleados.pop();
                        await this.guardarEmpleados(empleados);
                        this.mostrarMensaje('Error al crear el usuario en el sistema de autenticación', 'error');
                        return;
                    }
                    console.log('Usuario creado exitosamente en el sistema de auth');
                } catch (authError) {
                    console.error('Error al crear usuario:', authError);
                    // Revertir la creación del empleado
                    empleados.pop();
                    await this.guardarEmpleados(empleados);
                    this.mostrarMensaje('Error al crear el usuario: ' + authError.message, 'error');
                    return;
                }
            }

            this.mostrarMensaje(`Empleado y usuario creado con éxito. Usuario: ${username}, Contraseña: ${password}`);
            form.reset();
            nombreInput.focus();

            // Actualizar las vistas
            await this.actualizarListaEmpleados();
            this.actualizarTodosLosSelectores();

            console.log('Empleado y usuario creado exitosamente:', { nombre, username, rol });

        } catch (error) {
            console.error('Error al crear empleado:', error);
            this.mostrarMensaje('Error al crear el empleado: ' + error.message, 'error');
        }
    }

    async eliminarEmpleado(id) {
        console.log('🗑️ Función eliminarEmpleado llamada con ID:', id);

        if (!id) {
            console.error('❌ ID de empleado no válido:', id);
            this.mostrarMensaje('Error: ID de empleado no válido', 'error');
            return;
        }

        try {
            // Buscar el empleado antes de eliminarlo
            let empleados = await this.obtenerEmpleados();
            const empleadoAEliminar = empleados.find(emp => emp.id === id);

            if (!empleadoAEliminar) {
                this.mostrarMensaje('Empleado no encontrado', 'error');
                return;
            }

            const mensajeConfirmacion = empleadoAEliminar.username
                ? `¿Está seguro de eliminar este empleado y su usuario del sistema?\n\nEmpleado: ${empleadoAEliminar.name}\nUsuario: ${empleadoAEliminar.username}\n\n⚠️ Esta acción no se puede deshacer.`
                : `¿Está seguro de eliminar este empleado?\n\nEmpleado: ${empleadoAEliminar.name}\n\n⚠️ Esta acción no se puede deshacer.`;

            const confirmacion = await this.mostrarConfirmacion(
                mensajeConfirmacion,
                'Eliminar Empleado y Usuario',
                'danger'
            );

            console.log('🤔 Confirmación del usuario:', confirmacion);
            if (!confirmacion) return;

            // Eliminar empleado
            empleados = empleados.filter(emp => emp.id !== id);
            await this.guardarEmpleados(empleados);

            // Eliminar usuario del sistema de autenticación si existe
            if (empleadoAEliminar.username && window.authSystem) {
                try {
                    delete window.authSystem.userDb[empleadoAEliminar.username];
                    window.authSystem.saveUsers();
                    console.log(`✅ Usuario ${empleadoAEliminar.username} eliminado del sistema de autenticación`);
                } catch (authError) {
                    console.error('Error al eliminar usuario del sistema de auth:', authError);
                    // No interrumpir el proceso si falla la eliminación del usuario
                }
            }

            const mensajeExito = empleadoAEliminar.username
                ? `Empleado y usuario eliminados con éxito`
                : `Empleado eliminado con éxito`;

            this.mostrarMensaje(mensajeExito);
            this.actualizarListaEmpleados();
            this.actualizarTodosLosSelectores();

            console.log(`🗑️ Empleado ${empleadoAEliminar.name} eliminado exitosamente`);

        } catch (error) {
            console.error('Error al eliminar empleado:', error);
            this.mostrarMensaje('Error al eliminar el empleado: ' + error.message, 'error');
        }
    }

    async registrarFichajeManual(form) {
        try {
            const empleado = form.querySelector('#empleadoManual').value;
            const tipo = form.querySelector('#tipoFichaje').value;
            const esMultiple = form.querySelector('#multipleDias')?.checked;

            if (!empleado) {
                this.mostrarMensaje('Debe seleccionar un empleado', 'error');
                return;
            }

            if (esMultiple) {
                // Registro para múltiples días
                const fechaInicioInput = form.querySelector('#fichajeManualFechaInicio');
                const fechaFinInput = form.querySelector('#fichajeManualFechaFin');
                const horaInput = form.querySelector('#fichajeManualHora');

                console.log('📝 Valores leídos del formulario:');
                console.log('   - fechaInicioInput.value:', fechaInicioInput?.value);
                console.log('   - fechaFinInput.value:', fechaFinInput?.value);
                console.log('   - horaInput.value:', horaInput?.value);

                const fechaInicio = new Date(fechaInicioInput.value);
                const fechaFin = new Date(fechaFinInput.value);
                const hora = horaInput.value;

                if (!hora || !fechaInicio || !fechaFin) {
                    this.mostrarMensaje('Todos los campos son requeridos', 'error');
                    return;
                }

                if (fechaFin < fechaInicio) {
                    this.mostrarMensaje('La fecha final debe ser posterior a la inicial', 'error');
                    return;
                }

                const [horas, minutos] = hora.split(':');
                const fichajes = [];
                const ahora = new Date();

                console.log('🗓️ Iniciando registro múltiple:');
                console.log('   - Empleado:', empleado);
                console.log('   - Tipo:', tipo);
                console.log('   - Fecha inicio:', fechaInicio.toISOString().split('T')[0]);
                console.log('   - Fecha fin:', fechaFin.toISOString().split('T')[0]);
                console.log('   - Hora:', hora);

                // Crear una fecha temporal para iterar
                let fechaActual = new Date(fechaInicio);

                while (fechaActual <= fechaFin) {
                    const fechaFichaje = new Date(fechaActual);
                    fechaFichaje.setHours(parseInt(horas), parseInt(minutos), 0, 0);

                    console.log('📅 Procesando fecha:', fechaFichaje.toISOString().split('T')[0]);

                    // Permitir fichajes futuros - restricción desactivada
                    // const finDelDia = new Date(ahora);
                    // finDelDia.setHours(23, 59, 59, 999);

                    // if (fechaFichaje > finDelDia) {
                    //     console.log('   ⏭️ Saltando fecha futura:', fechaFichaje.toISOString().split('T')[0]);
                    // } else {
                    fichajes.push({
                        employee: empleado,
                        type: tipo,
                        timestamp: fechaFichaje.toISOString()
                    });
                    console.log('   ✅ Fichaje creado para:', fechaFichaje.toISOString());
                    // }

                    // Avanzar al siguiente día
                    fechaActual.setDate(fechaActual.getDate() + 1);
                }

                console.log('📊 Total fichajes a crear:', fichajes.length);

                if (fichajes.length === 0) {
                    this.mostrarMensaje('No se pudieron crear fichajes para el rango de fechas seleccionado', 'error');
                    return;
                }

                // Verificar fichajes duplicados
                const fichajesExistentes = this.obtenerFichajes();
                console.log('🔍 Verificando duplicados contra', fichajesExistentes.length, 'fichajes existentes');

                const fichajesFiltrados = fichajes.filter(nuevoFichaje => {
                    const duplicado = fichajesExistentes.some(existente =>
                        existente.employee === nuevoFichaje.employee &&
                        existente.type === nuevoFichaje.type &&
                        Math.abs(new Date(existente.timestamp) - new Date(nuevoFichaje.timestamp)) < 60000
                    );

                    if (duplicado) {
                        console.log('   ❌ Duplicado encontrado para:', new Date(nuevoFichaje.timestamp).toISOString().split('T')[0]);
                    } else {
                        console.log('   ✅ Fichaje válido para:', new Date(nuevoFichaje.timestamp).toISOString().split('T')[0]);
                    }

                    return !duplicado;
                });

                console.log('📊 Fichajes después de filtrar duplicados:', fichajesFiltrados.length);

                if (fichajesFiltrados.length === 0) {
                    this.mostrarMensaje('Los fichajes ya existen para las fechas seleccionadas', 'error');
                    return;
                }

                const todosLosFichajes = [...fichajesExistentes, ...fichajesFiltrados];
                console.log('💾 Guardando', todosLosFichajes.length, 'fichajes en total');

                this.guardarFichajes(todosLosFichajes);
                this.mostrarMensaje(`${fichajesFiltrados.length} fichajes registrados con éxito`);

                console.log('✅ Proceso de registro múltiple completado');
            } else {
                // Registro para un solo día
                const fechaInput = form.querySelector('#fichajeManualFecha').value;
                if (!fechaInput) {
                    this.mostrarMensaje('Debe seleccionar fecha y hora', 'error');
                    return;
                }

                const fecha = new Date(fechaInput);

                // Validar que la fecha es válida
                if (isNaN(fecha.getTime())) {
                    this.mostrarMensaje('La fecha seleccionada no es válida', 'error');
                    return;
                }

                console.log('📅 Registrando fichaje para fecha:', fecha.toISOString());
                console.log('📅 Fecha es futura:', fecha > new Date());

                // Se permite crear fichajes futuros - sin restricciones
                // if (fecha > ahora) {
                //     this.mostrarMensaje('No se pueden registrar fichajes futuros', 'error');
                //     return;
                // }

                const fichaje = {
                    employee: empleado,
                    type: tipo,
                    timestamp: fecha.toISOString()
                };

                // Verificar si ya existe un fichaje similar
                const fichajes = this.obtenerFichajes();
                const existeFichajeSimilar = fichajes.some(f =>
                    f.employee === empleado &&
                    f.type === tipo &&
                    Math.abs(new Date(f.timestamp) - fecha) < 60000 // menos de 1 minuto de diferencia
                );

                if (existeFichajeSimilar) {
                    this.mostrarMensaje('Ya existe un fichaje similar para este empleado', 'error');
                    return;
                }

                fichajes.push(fichaje);
                this.guardarFichajes(fichajes);
                this.mostrarMensaje('Fichaje registrado con éxito');
            }

            this.cerrarModal();
            this.actualizarTablaFichajes();
        } catch (error) {
            console.error('Error al registrar fichaje manual:', error);
            this.mostrarMensaje('Error al registrar el fichaje', 'error');
        }
    }

    async eliminarFichaje(index) {
        try {
            const confirmacion = await this.mostrarConfirmacion(
                '¿Está seguro de eliminar este fichaje?',
                'Eliminar Fichaje',
                'danger'
            );
            if (!confirmacion) return;

            let fichajes = this.obtenerFichajes();
            const fecha = document.getElementById('fechaEdicion')?.value;

            if (fecha) {
                // Si estamos en la vista de edición, filtramos por fecha
                const fechaInicio = new Date(fecha);
                fechaInicio.setHours(0, 0, 0, 0);
                const fechaFin = new Date(fecha);
                fechaFin.setHours(23, 59, 59, 999);

                const fichajesFecha = fichajes.filter(f => {
                    const timestamp = new Date(f.timestamp);
                    return timestamp >= fechaInicio && timestamp <= fechaFin;
                });

                if (fichajesFecha[index]) {
                    const fichajeIndex = fichajes.findIndex(f => f === fichajesFecha[index]);
                    if (fichajeIndex !== -1) {
                        fichajes.splice(fichajeIndex, 1);
                    }
                }
            } else {
                // Si no hay fecha, eliminamos directamente por índice
                fichajes.splice(index, 1);
            }

            this.guardarFichajes(fichajes);
            this.mostrarMensaje('Fichaje eliminado con éxito');

            // Actualizar vistas
            this.buscarFichajes();
            this.actualizarTablaFichajes();
        } catch (error) {
            console.error('Error al eliminar fichaje:', error);
            this.mostrarMensaje('Error al eliminar el fichaje', 'error');
        }
    }

    buscarFichajes() {
        try {
            const empleado = document.getElementById('empleadoEdicion')?.value;
            const rangoFechas = document.getElementById('rangoFechas')?.checked;
            let fechaInicio, fechaFin;

            if (rangoFechas) {
                // Usar rango de fechas
                const fechaInicioValue = document.getElementById('fechaEdicionInicio')?.value;
                const fechaFinValue = document.getElementById('fechaEdicionFin')?.value;

                if (!fechaInicioValue || !fechaFinValue) {
                    this.mostrarMensaje('Seleccione ambas fechas del rango', 'error');
                    return;
                }

                fechaInicio = new Date(fechaInicioValue);
                fechaFin = new Date(fechaFinValue);

                if (fechaFin < fechaInicio) {
                    this.mostrarMensaje('La fecha final debe ser posterior a la inicial', 'error');
                    return;
                }
            } else {
                // Usar fecha única
                const fecha = document.getElementById('fechaEdicion')?.value;
                if (!fecha) {
                    this.mostrarMensaje('Seleccione una fecha', 'error');
                    return;
                }

                fechaInicio = new Date(fecha);
                fechaFin = new Date(fecha);
            }

            fechaInicio.setHours(0, 0, 0, 0);
            fechaFin.setHours(23, 59, 59, 999);

            console.log('Buscando fichajes entre:', fechaInicio, 'y', fechaFin);

            const fichajes = this.obtenerFichajes();
            let fichajesFiltrados = fichajes.filter(f => {
                const fechaFichaje = new Date(f.timestamp);
                return fechaFichaje >= fechaInicio &&
                    fechaFichaje <= fechaFin &&
                    (!empleado || f.employee === empleado);
            });

            // Ordenar por fecha y hora
            fichajesFiltrados.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

            console.log(`Fichajes encontrados: ${fichajesFiltrados.length}`);
            this.mostrarFichajesEdicion(fichajesFiltrados);
        } catch (error) {
            console.error('Error al buscar fichajes:', error);
            this.mostrarMensaje('Error al buscar los fichajes', 'error');
        }
    }

    buscarFichajesEliminar() {
        try {
            const empleado = document.getElementById('empleadoEliminacion')?.value;
            const rangoFechas = document.getElementById('rangoFechasEliminar')?.checked;
            let fechaInicio, fechaFin;

            if (rangoFechas) {
                // Usar rango de fechas
                const fechaInicioValue = document.getElementById('fechaEliminacionInicio')?.value;
                const fechaFinValue = document.getElementById('fechaEliminacionFin')?.value;

                if (!fechaInicioValue || !fechaFinValue) {
                    this.mostrarMensaje('Seleccione ambas fechas del rango', 'error');
                    return;
                }

                fechaInicio = new Date(fechaInicioValue);
                fechaFin = new Date(fechaFinValue);

                if (fechaFin < fechaInicio) {
                    this.mostrarMensaje('La fecha final debe ser posterior a la inicial', 'error');
                    return;
                }
            } else {
                // Usar fecha única
                const fecha = document.getElementById('fechaEliminacion')?.value;
                if (!fecha) {
                    this.mostrarMensaje('Seleccione una fecha', 'error');
                    return;
                }

                fechaInicio = new Date(fecha);
                fechaFin = new Date(fecha);
            }

            fechaInicio.setHours(0, 0, 0, 0);
            fechaFin.setHours(23, 59, 59, 999);

            console.log('Buscando fichajes para eliminar entre:', fechaInicio, 'y', fechaFin);

            const fichajes = this.obtenerFichajes();
            let fichajesFiltrados = fichajes.filter(f => {
                const fechaFichaje = new Date(f.timestamp);
                return fechaFichaje >= fechaInicio &&
                    fechaFichaje <= fechaFin &&
                    (!empleado || f.employee === empleado);
            });

            // Ordenar por fecha y hora
            fichajesFiltrados.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

            console.log(`Fichajes encontrados para eliminar: ${fichajesFiltrados.length}`);
            this.mostrarFichajesEliminacion(fichajesFiltrados);
        } catch (error) {
            console.error('Error al buscar fichajes para eliminar:', error);
            this.mostrarMensaje('Error al buscar los fichajes', 'error');
        }
    }

    mostrarFichajesEdicion(fichajes) {
        const container = document.getElementById('listaFichajes');
        if (!container) return;

        if (fichajes.length === 0) {
            container.innerHTML = '<p class="no-results">No se encontraron fichajes para la fecha seleccionada</p>';
            return;
        }

        // Verificar si es un rango de fechas para mostrar también la fecha
        const rangoFechas = document.getElementById('rangoFechas')?.checked;

        const html = `
            <div class="table-responsive">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Empleado</th>
                            ${rangoFechas ? '<th>Fecha</th>' : ''}
                            <th>Tipo</th>
                            <th>Hora</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${fichajes.map((f, index) => `
                            <tr>
                                <td>${f.employee}</td>
                                ${rangoFechas ? `<td>${new Date(f.timestamp).toLocaleDateString('es-ES')}</td>` : ''}
                                <td><span class="tipo ${f.type.toLowerCase()}">${f.type}</span></td>
                                <td>${new Date(f.timestamp).toLocaleTimeString('es-ES')}</td>
                                <td>
                                    <button class="btn-icon eliminar-fichaje" data-index="${index}">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;

        container.innerHTML = html;

        // Añadir listeners para los botones de eliminar
        container.querySelectorAll('.eliminar-fichaje').forEach(btn => {
            btn.addEventListener('click', () => {
                this.eliminarFichaje(parseInt(btn.dataset.index));
            });
        });
    }

    mostrarFichajesEliminacion(fichajes) {
        const container = document.getElementById('listaFichajesEliminar');
        const accionesContainer = document.querySelector('.eliminar-acciones');

        if (!container) return;

        if (fichajes.length === 0) {
            container.innerHTML = '<p class="no-results">No se encontraron fichajes para la fecha seleccionada</p>';
            if (accionesContainer) accionesContainer.style.display = 'none';
            return;
        }

        // Verificar si es un rango de fechas para mostrar también la fecha
        const rangoFechas = document.getElementById('rangoFechasEliminar')?.checked;

        const html = `
            <div class="table-responsive">
                <table class="table">
                    <thead>
                        <tr>
                            <th><input type="checkbox" id="seleccionarTodos"> Todos</th>
                            <th>Empleado</th>
                            ${rangoFechas ? '<th>Fecha</th>' : ''}
                            <th>Tipo</th>
                            <th>Hora</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${fichajes.map((f, index) => `
                            <tr>
                                <td><input type="checkbox" class="fichaje-checkbox" data-index="${index}"></td>
                                <td>${f.employee}</td>
                                ${rangoFechas ? `<td>${new Date(f.timestamp).toLocaleDateString('es-ES')}</td>` : ''}
                                <td><span class="tipo ${f.type.toLowerCase()}">${f.type}</span></td>
                                <td>${new Date(f.timestamp).toLocaleTimeString('es-ES')}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;

        container.innerHTML = html;

        // Mostrar botones de acción
        if (accionesContainer) {
            accionesContainer.style.display = 'block';
        }

        // Añadir funcionalidad al checkbox "Seleccionar todos"
        const seleccionarTodos = document.getElementById('seleccionarTodos');
        if (seleccionarTodos) {
            seleccionarTodos.addEventListener('change', (e) => {
                const checkboxes = document.querySelectorAll('.fichaje-checkbox');
                checkboxes.forEach(cb => cb.checked = e.target.checked);
            });
        }

        // Guardar referencia a los fichajes encontrados para las acciones de eliminar
        this.fichajesEncontrados = fichajes;
    }

    async eliminarFichajesSeleccionados() {
        try {
            const checkboxes = document.querySelectorAll('.fichaje-checkbox:checked');

            if (checkboxes.length === 0) {
                this.mostrarMensaje('Seleccione al menos un fichaje para eliminar', 'error');
                return;
            }

            const confirmacion = await this.mostrarConfirmacion(
                `¿Está seguro de que desea eliminar ${checkboxes.length} fichaje(s) seleccionado(s)?`,
                'Eliminar Fichajes Seleccionados',
                'danger'
            );
            if (!confirmacion) return;

            // Obtener los índices de los fichajes seleccionados (en orden inverso para no afectar los índices)
            const indicesSeleccionados = Array.from(checkboxes)
                .map(cb => parseInt(cb.dataset.index))
                .sort((a, b) => b - a); // Orden descendente

            const todosFichajes = this.obtenerFichajes();
            const fichajesEncontrados = this.fichajesEncontrados || [];

            // Eliminar fichajes seleccionados
            indicesSeleccionados.forEach(indexLocal => {
                const fichajeAEliminar = fichajesEncontrados[indexLocal];
                if (fichajeAEliminar) {
                    // Encontrar el índice real en todos los fichajes
                    const indexReal = todosFichajes.findIndex(f =>
                        f.timestamp === fichajeAEliminar.timestamp &&
                        f.employee === fichajeAEliminar.employee
                    );
                    if (indexReal !== -1) {
                        todosFichajes.splice(indexReal, 1);
                    }
                }
            });

            this.guardarFichajes(todosFichajes);
            this.actualizarTablaFichajes();
            this.mostrarMensaje(`${indicesSeleccionados.length} fichaje(s) eliminado(s) correctamente`, 'success');

            // Refrescar la búsqueda
            this.buscarFichajesEliminar();
        } catch (error) {
            console.error('Error al eliminar fichajes seleccionados:', error);
            this.mostrarMensaje('Error al eliminar los fichajes seleccionados', 'error');
        }
    }

    async eliminarTodosFichajes() {
        try {
            const fichajesEncontrados = this.fichajesEncontrados || [];

            if (fichajesEncontrados.length === 0) {
                this.mostrarMensaje('No hay fichajes para eliminar', 'error');
                return;
            }

            const confirmacion = await this.mostrarConfirmacion(
                `¿Está seguro de que desea eliminar TODOS los ${fichajesEncontrados.length} fichaje(s) encontrado(s)? Esta acción no se puede deshacer.`,
                'Eliminar Todos los Fichajes',
                'danger'
            );
            if (!confirmacion) return;

            const todosFichajes = this.obtenerFichajes();

            // Eliminar todos los fichajes encontrados
            fichajesEncontrados.forEach(fichajeAEliminar => {
                const indexReal = todosFichajes.findIndex(f =>
                    f.timestamp === fichajeAEliminar.timestamp &&
                    f.employee === fichajeAEliminar.employee
                );
                if (indexReal !== -1) {
                    todosFichajes.splice(indexReal, 1);
                }
            });

            this.guardarFichajes(todosFichajes);
            this.actualizarTablaFichajes();
            this.mostrarMensaje(`${fichajesEncontrados.length} fichaje(s) eliminado(s) correctamente`, 'success');

            // Refrescar la búsqueda
            this.buscarFichajesEliminar();
        } catch (error) {
            console.error('Error al eliminar todos los fichajes:', error);
            this.mostrarMensaje('Error al eliminar todos los fichajes', 'error');
        }
    }

    async eliminarTodosLosFilejes() {
        try {
            const fichajes = this.obtenerFichajes();
            const totalFichajes = fichajes.length;

            if (totalFichajes === 0) {
                this.mostrarMensaje('No hay fichajes para eliminar', 'info');
                return;
            }

            const confirmacion = await this.mostrarConfirmacion(
                `Se eliminarán TODOS los ${totalFichajes} fichajes de TODOS los empleados del sistema.\n\n⚠️ ESTA ACCIÓN NO SE PUEDE DESHACER ⚠️\n\n¿Estás completamente seguro?`,
                'ELIMINAR TODOS LOS FICHAJES',
                'danger'
            );

            if (!confirmacion) return;

            // Segunda confirmación para acción tan crítica
            const confirmacionFinal = await this.mostrarConfirmacion(
                `ÚLTIMA ADVERTENCIA:\n\nSe van a eliminar ${totalFichajes} fichajes de forma permanente.\n\n¿Proceder con la eliminación completa?`,
                'CONFIRMACIÓN FINAL',
                'danger'
            );

            if (!confirmacionFinal) return;

            // Eliminar todos los fichajes
            this.guardarFichajes([]);

            this.mostrarMensaje(`Se eliminaron ${totalFichajes} fichajes correctamente. La base de datos está ahora vacía.`, 'success');

            // Actualizar todas las vistas
            this.actualizarTablaFichajes();

            // Limpiar la lista de eliminación
            const listaEliminar = document.getElementById('listaFichajesEliminar');
            if (listaEliminar) {
                listaEliminar.innerHTML = '<p class="text-center text-muted">No hay fichajes en el sistema</p>';
            }

            // Ocultar botones de acción
            const accionesEliminar = document.querySelector('.eliminar-acciones');
            if (accionesEliminar) {
                accionesEliminar.style.display = 'none';
            }

            // Resetear variable de fichajes encontrados
            this.fichajesEncontrados = [];

        } catch (error) {
            console.error('Error al eliminar todos los fichajes:', error);
            this.mostrarMensaje('Error al eliminar los fichajes', 'error');
        }
    }

    async consultarFichajes(form) {
        try {
            const empleado = form.querySelector('#empleadoConsulta').value;
            const fechaInicio = new Date(form.querySelector('#consultaFechaInicio').value);
            const fechaFin = new Date(form.querySelector('#consultaFechaFin').value + 'T23:59:59');

            if (fechaFin < fechaInicio) {
                this.mostrarMensaje('La fecha final debe ser posterior a la inicial', 'error');
                return;
            }

            const fichajes = this.obtenerFichajes();
            let resultados = fichajes.filter(f => {
                const fecha = new Date(f.timestamp);
                const cumpleFecha = fecha >= fechaInicio && fecha <= fechaFin;
                return empleado ? (cumpleFecha && f.employee === empleado) : cumpleFecha;
            });

            // Ordenar por fecha y hora
            resultados.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

            // Calcular horas trabajadas para el empleado seleccionado o todos
            let horasTrabajadas = null;
            console.log('🧮 Calculando horas trabajadas...');
            console.log('   - Empleado seleccionado:', empleado || 'Ninguno (todos)');
            console.log('   - Fichajes a procesar:', resultados.length);

            if (empleado) {
                // Si se seleccionó un empleado específico, calcular sus horas
                console.log('👤 Calculando horas para empleado específico...');
                horasTrabajadas = this.calcularHorasTrabajadas(resultados);
                console.log('   - Resultado:', horasTrabajadas);
            } else {
                // Si no se seleccionó empleado, calcular horas por empleado
                console.log('👥 Calculando horas por empleado...');
                horasTrabajadas = this.calcularHorasPorEmpleado(resultados);
                console.log('   - Resultado:', horasTrabajadas);
            }

            this.mostrarResultadosFichajes(resultados, horasTrabajadas, empleado);
        } catch (error) {
            console.error('Error al consultar fichajes:', error);
            this.mostrarMensaje('Error al consultar los fichajes', 'error');
        }
    }

    async consultarFichajesImprimir(form) {
        // Prevenir ejecución duplicada
        if (this.generatingReport) {
            console.log('⚠️ Generación de informe ya en progreso, ignorando duplicado');
            return;
        }

        this.generatingReport = true;
        console.log('🔒 Flag generatingReport activado');

        try {
            console.log('🖨️ Iniciando consulta para imprimir...');

            const empleado = form.querySelector('#empleadoImprimir').value;
            const fechaInicio = new Date(form.querySelector('#imprimirFechaInicio').value);
            const fechaFin = new Date(form.querySelector('#imprimirFechaFin').value + 'T23:59:59');

            if (fechaFin < fechaInicio) {
                this.mostrarMensaje('La fecha final debe ser posterior a la inicial', 'error');
                this.generatingReport = false;
                return;
            }

            const fichajes = this.obtenerFichajes();
            let resultados = fichajes.filter(f => {
                const fecha = new Date(f.timestamp);
                const cumpleFecha = fecha >= fechaInicio && fecha <= fechaFin;
                return empleado ? (cumpleFecha && f.employee === empleado) : cumpleFecha;
            });

            if (resultados.length === 0) {
                this.mostrarMensaje('No se encontraron fichajes para el período seleccionado', 'warning');
                this.generatingReport = false;
                return;
            }

            // Ordenar por fecha y hora
            resultados.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

            // Calcular horas trabajadas
            let horasTrabajadas = null;
            if (empleado) {
                horasTrabajadas = this.calcularHorasTrabajadas(resultados);
            } else {
                horasTrabajadas = this.calcularHorasPorEmpleado(resultados);
            }

            // Mostrar los resultados en el modal primero
            this.mostrarResultadosImprimir(resultados, horasTrabajadas, empleado);

            // Generar el informe de impresión inmediatamente sin setTimeout
            console.log('📄 Generando informe de impresión...');
            this.generarInformeImpresion(resultados, horasTrabajadas, empleado, fechaInicio, fechaFin);

            // Resetear flag después de un breve delay
            setTimeout(() => {
                this.generatingReport = false;
                console.log('🔓 Flag generatingReport desactivado');
            }, 2000);

        } catch (error) {
            console.error('Error al consultar fichajes para imprimir:', error);
            this.mostrarMensaje('Error al generar el informe', 'error');
            this.generatingReport = false;
        }
    }

    calcularHorasTrabajadas(fichajes) {
        let totalMinutos = 0;
        let entrada = null;
        let paresCompletos = 0;

        console.log('⏰ Calculando horas trabajadas para', fichajes.length, 'fichajes');

        fichajes.forEach((fichaje, index) => {
            const tiempo = new Date(fichaje.timestamp);
            console.log(`   ${index + 1}. ${fichaje.type} a las ${tiempo.toLocaleTimeString('es-ES')} - ${fichaje.employee}`);

            if (fichaje.type === 'Entrada') {
                entrada = tiempo;
                console.log('     ↳ Entrada registrada');
            } else if (fichaje.type === 'Salida' && entrada) {
                const diferencia = tiempo - entrada;
                const minutosTramo = Math.round(diferencia / 1000 / 60);
                totalMinutos += minutosTramo;
                paresCompletos++;
                console.log(`     ↳ Salida registrada. Tiempo trabajado: ${Math.floor(minutosTramo / 60)}:${(minutosTramo % 60).toString().padStart(2, '0')}`);
                entrada = null;
            } else if (fichaje.type === 'Salida' && !entrada) {
                console.log('     ↳ Salida sin entrada previa (ignorada)');
            }
        });

        if (entrada) {
            console.log('⚠️ Hay una entrada sin salida correspondiente');
        }

        console.log(`📊 Resumen: ${paresCompletos} pares completos, ${totalMinutos} minutos totales`);

        const horas = Math.floor(totalMinutos / 60);
        const minutos = totalMinutos % 60;
        const resultado = `${horas}:${minutos.toString().padStart(2, '0')}`;

        console.log(`✅ Tiempo total calculado: ${resultado}`);
        return resultado;
    }

    calcularHorasPorEmpleado(fichajes) {
        // Agrupar fichajes por empleado
        const fichajesPorEmpleado = fichajes.reduce((acc, f) => {
            if (!acc[f.employee]) acc[f.employee] = [];
            acc[f.employee].push(f);
            return acc;
        }, {});

        const horasEmpleados = {};
        let totalMinutosTodos = 0;

        for (const [empleado, fichajesEmpleado] of Object.entries(fichajesPorEmpleado)) {
            let totalMinutosEmpleado = 0;
            let entrada = null;

            // Ordenar fichajes del empleado por fecha
            fichajesEmpleado.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

            fichajesEmpleado.forEach(fichaje => {
                const tiempo = new Date(fichaje.timestamp);
                if (fichaje.type === 'Entrada') {
                    entrada = tiempo;
                } else if (fichaje.type === 'Salida' && entrada) {
                    const diferencia = tiempo - entrada;
                    totalMinutosEmpleado += Math.round(diferencia / 1000 / 60);
                    entrada = null;
                }
            });

            totalMinutosTodos += totalMinutosEmpleado;
            const horas = Math.floor(totalMinutosEmpleado / 60);
            const minutos = totalMinutosEmpleado % 60;
            horasEmpleados[empleado] = `${horas}:${minutos.toString().padStart(2, '0')}`;
        }

        // Calcular total general
        const horasTotal = Math.floor(totalMinutosTodos / 60);
        const minutosTotal = totalMinutosTodos % 60;
        const totalGeneral = `${horasTotal}:${minutosTotal.toString().padStart(2, '0')}`;

        return { horasEmpleados, totalGeneral };
    }

    mostrarResultadosFichajes(fichajes, horasTrabajadas = null, empleadoSeleccionado = null) {
        const container = document.getElementById('resultadosFichajes');
        if (!container) {
            console.error('❌ No se encontró el contenedor resultadosFichajes');
            return;
        }

        console.log('📊 Mostrando resultados de fichajes:');
        console.log('   - Fichajes:', fichajes.length);
        console.log('   - Horas trabajadas:', horasTrabajadas);
        console.log('   - Empleado seleccionado:', empleadoSeleccionado);

        if (fichajes.length === 0) {
            container.innerHTML = '<p class="no-results">No se encontraron fichajes para el período seleccionado.</p>';
            return;
        }

        // Agrupar por fecha
        const fichajesPorFecha = fichajes.reduce((acc, f) => {
            const fecha = new Date(f.timestamp).toLocaleDateString('es-ES');
            if (!acc[fecha]) acc[fecha] = [];
            acc[fecha].push(f);
            return acc;
        }, {});

        let html = '';
        for (const [fecha, fichajesDia] of Object.entries(fichajesPorFecha)) {
            html += `
                <h3 class="fecha-header">Fecha: ${fecha}</h3>
                <div class="table-responsive">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Empleado</th>
                                <th>Tipo</th>
                                <th>Hora</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${fichajesDia.map(f => `
                                <tr>
                                    <td>${f.employee}</td>
                                    <td><span class="tipo ${f.type.toLowerCase()}">${f.type}</span></td>
                                    <td>${new Date(f.timestamp).toLocaleTimeString('es-ES')}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        }

        // Mostrar resumen de horas trabajadas
        if (horasTrabajadas) {
            console.log('⏰ Generando HTML de horas trabajadas...');
            html += '<div class="horas-totales">';

            if (empleadoSeleccionado) {
                // Caso: empleado específico seleccionado
                console.log('👤 Mostrando horas para empleado específico:', empleadoSeleccionado);
                html += `
                    <h4>📊 Resumen de Horas</h4>
                    <p><strong>Empleado:</strong> ${empleadoSeleccionado}</p>
                    <p><strong>Total horas trabajadas:</strong> ${horasTrabajadas}</p>
                `;
            } else {
                // Caso: todos los empleados
                console.log('👥 Mostrando horas para todos los empleados');
                console.log('   - Datos recibidos:', horasTrabajadas);
                html += '<h4>📊 Resumen de Horas por Empleado</h4>';

                // Verificar si horasTrabajadas tiene la estructura correcta
                if (horasTrabajadas.horasEmpleados) {
                    // Mostrar horas por empleado
                    for (const [empleado, horas] of Object.entries(horasTrabajadas.horasEmpleados)) {
                        console.log(`   - ${empleado}: ${horas}`);
                        html += `<p><strong>${empleado}:</strong> ${horas}</p>`;
                    }

                    // Mostrar total general
                    html += `
                        <hr>
                        <p class="total-general"><strong>🏆 TOTAL GENERAL: ${horasTrabajadas.totalGeneral}</strong></p>
                    `;
                } else {
                    console.error('❌ horasTrabajadas no tiene la estructura esperada:', horasTrabajadas);
                    html += '<p class="text-error">Error al calcular las horas trabajadas</p>';
                }
            }

            html += '</div>';
        } else {
            console.log('⚠️ No se calcularon horas trabajadas (horasTrabajadas es null)');
        }

        container.innerHTML = html;
    }

    mostrarResultadosImprimir(fichajes, horasTrabajadas, empleadoSeleccionado) {
        const container = document.getElementById('resultadosImprimir');
        if (!container) {
            console.error('❌ No se encontró el contenedor resultadosImprimir');
            return;
        }

        if (fichajes.length === 0) {
            container.innerHTML = '<p class="no-results">No se encontraron fichajes para el período seleccionado.</p>';
            return;
        }

        // Agrupar por fecha
        const fichajesPorFecha = fichajes.reduce((acc, f) => {
            const fecha = new Date(f.timestamp).toLocaleDateString('es-ES');
            if (!acc[fecha]) acc[fecha] = [];
            acc[fecha].push(f);
            return acc;
        }, {});

        let html = '<h4>📋 Vista previa del informe</h4>';
        for (const [fecha, fichajesDia] of Object.entries(fichajesPorFecha)) {
            html += `
                <h5 class="fecha-header">Fecha: ${fecha}</h5>
                <div class="table-responsive">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Empleado</th>
                                <th>Tipo</th>
                                <th>Hora</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${fichajesDia.map(f => `
                                <tr>
                                    <td>${f.employee}</td>
                                    <td><span class="tipo ${f.type.toLowerCase()}">${f.type}</span></td>
                                    <td>${new Date(f.timestamp).toLocaleTimeString('es-ES')}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        }

        // Mostrar resumen de horas trabajadas
        if (horasTrabajadas) {
            html += '<div class="horas-totales">';

            if (empleadoSeleccionado) {
                html += `
                    <h4>📊 Resumen de Horas</h4>
                    <p><strong>Empleado:</strong> ${empleadoSeleccionado}</p>
                    <p><strong>Total horas trabajadas:</strong> ${horasTrabajadas}</p>
                `;
            } else {
                html += '<h4>📊 Resumen de Horas por Empleado</h4>';

                if (horasTrabajadas.horasEmpleados) {
                    for (const [empleado, horas] of Object.entries(horasTrabajadas.horasEmpleados)) {
                        html += `<p><strong>${empleado}:</strong> ${horas}</p>`;
                    }
                    html += `<p class="total-general"><strong>TOTAL GENERAL:</strong> ${horasTrabajadas.totalGeneral}</p>`;
                }
            }

            html += '</div>';
        }

        container.innerHTML = html;
    }

    generarInformeImpresion(fichajes, horasTrabajadas, empleadoSeleccionado, fechaInicio, fechaFin) {
        // Protección adicional contra ejecución múltiple
        if (this.generatingPrintWindow) {
            console.log('⚠️ Ventana de impresión ya generándose, ignorando duplicado');
            return;
        }

        this.generatingPrintWindow = true;
        console.log('🖨️ Iniciando generación de ventana de impresión...');

        try {
            // Crear ventana de impresión
            const printWindow = window.open('', '_blank');
            printWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Informe de Fichajes - Mi Casita de Patch</title>
                    <style>
                        body { 
                            font-family: Arial, sans-serif; 
                            margin: 20px;
                            color: #333;
                        }
                        .header { 
                            text-align: center; 
                            margin-bottom: 30px; 
                            border-bottom: 2px solid #4CAF50;
                            padding-bottom: 20px;
                        }
                        .company-name {
                            color: #4CAF50;
                            font-size: 24px;
                            font-weight: bold;
                            margin-bottom: 10px;
                        }
                        .report-title {
                            font-size: 20px;
                            color: #333;
                            margin-bottom: 10px;
                        }
                        .report-info {
                            color: #666;
                            font-size: 14px;
                        }
                        table { 
                            width: 100%; 
                            border-collapse: collapse; 
                            margin-bottom: 20px; 
                        }
                        th, td { 
                            border: 1px solid #ddd; 
                            padding: 10px; 
                            text-align: left; 
                        }
                        th { 
                            background-color: #f8f9fa; 
                            font-weight: bold;
                            color: #333;
                        }
                        .fecha-header { 
                            margin-top: 25px; 
                            margin-bottom: 15px; 
                            font-size: 16px;
                            font-weight: bold;
                            color: #4CAF50;
                            border-bottom: 1px solid #4CAF50;
                            padding-bottom: 5px;
                        }
                        .tipo { 
                            padding: 4px 8px; 
                            border-radius: 4px; 
                            font-weight: bold;
                            text-align: center;
                            display: inline-block;
                            min-width: 60px;
                        }
                        .entrada { 
                            background-color: #e8f5e9; 
                            color: #2e7d32; 
                        }
                        .salida { 
                            background-color: #fbe9e7; 
                            color: #c62828; 
                        }
                        .horas-resumen {
                            background-color: #f8f9fa;
                            border: 1px solid #ddd;
                            border-radius: 8px;
                            padding: 20px;
                            margin-top: 30px;
                        }
                        .horas-resumen h3 {
                            color: #4CAF50;
                            margin-top: 0;
                            border-bottom: 1px solid #4CAF50;
                            padding-bottom: 10px;
                        }
                        .horas-empleado {
                            display: flex;
                            justify-content: space-between;
                            padding: 5px 0;
                            border-bottom: 1px solid #eee;
                        }
                        .total-general {
                            background-color: #4CAF50;
                            color: white;
                            padding: 10px;
                            border-radius: 4px;
                            margin-top: 15px;
                            text-align: center;
                            font-weight: bold;
                            font-size: 16px;
                        }
                        @media print {
                            .no-print { display: none; }
                            table { page-break-inside: avoid; }
                            .fecha-header { page-break-after: avoid; }
                        }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <div class="company-name">Mi Casita de Patch</div>
                        <div class="report-title">Informe de Fichajes</div>
                        <div class="report-info">
                            ${empleadoSeleccionado ? `<strong>Empleado:</strong> ${empleadoSeleccionado}<br>` : '<strong>Todos los empleados</strong><br>'}
                            <strong>Período:</strong> ${fechaInicio.toLocaleDateString('es-ES')} - ${fechaFin.toLocaleDateString('es-ES')}<br>
                            <strong>Generado el:</strong> ${new Date().toLocaleString('es-ES')}
                        </div>
                    </div>
            `);

            // Agrupar por fecha
            const fichajesPorFecha = fichajes.reduce((acc, f) => {
                const fecha = new Date(f.timestamp).toLocaleDateString('es-ES');
                if (!acc[fecha]) acc[fecha] = [];
                acc[fecha].push(f);
                return acc;
            }, {});

            // Generar tablas por fecha
            for (const [fecha, fichajesDia] of Object.entries(fichajesPorFecha)) {
                printWindow.document.write(`
                    <h3 class="fecha-header">📅 ${fecha}</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Empleado</th>
                                <th>Tipo</th>
                                <th>Hora</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${fichajesDia.map(f => `
                                <tr>
                                    <td>${f.employee}</td>
                                    <td><span class="tipo ${f.type.toLowerCase()}">${f.type}</span></td>
                                    <td>${new Date(f.timestamp).toLocaleTimeString('es-ES')}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                `);
            }

            // Agregar resumen de horas si existe
            if (horasTrabajadas) {
                printWindow.document.write('<div class="horas-resumen">');

                if (empleadoSeleccionado) {
                    printWindow.document.write(`
                        <h3>📊 Resumen de Horas Trabajadas</h3>
                        <div class="horas-empleado">
                            <span><strong>${empleadoSeleccionado}:</strong></span>
                            <span><strong>${horasTrabajadas}</strong></span>
                        </div>
                    `);
                } else {
                    printWindow.document.write('<h3>📊 Resumen de Horas por Empleado</h3>');

                    if (horasTrabajadas.horasEmpleados) {
                        for (const [empleado, horas] of Object.entries(horasTrabajadas.horasEmpleados)) {
                            printWindow.document.write(`
                                <div class="horas-empleado">
                                    <span><strong>${empleado}:</strong></span>
                                    <span>${horas}</span>
                                </div>
                            `);
                        }
                        printWindow.document.write(`
                            <div class="total-general">
                                TOTAL GENERAL: ${horasTrabajadas.totalGeneral}
                            </div>
                        `);
                    }
                }

                printWindow.document.write('</div>');
            }

            printWindow.document.write(`
                    <div class="no-print" style="margin-top: 30px; text-align: center;">
                        <button onclick="window.print()" style="background-color: #4CAF50; color: white; border: none; padding: 15px 30px; font-size: 16px; border-radius: 5px; cursor: pointer;">
                            🖨️ Imprimir Informe
                        </button>
                    </div>
                </body>
                </html>
            `);

            printWindow.document.close();
            this.mostrarMensaje('Informe generado. Se abrió una nueva ventana para imprimir.', 'success');
        } catch (error) {
            console.error('Error al generar informe de impresión:', error);
            this.mostrarMensaje('Error al generar el informe para impresión', 'error');
        } finally {
            // Resetear flag de ventana de impresión
            setTimeout(() => {
                this.generatingPrintWindow = false;
            }, 1000);
        }
    }

    exportarFichajes(format) {
        // Prevenir ejecución duplicada
        if (this.exporting) {
            console.log('Exportación ya en progreso, ignorando duplicado');
            return;
        }

        this.exporting = true;

        try {
            console.log(`🔄 Iniciando exportación en formato: ${format}`);
            this.mostrarMensaje(`Exportando en formato ${format.toUpperCase()}...`, 'info');

            const fichajes = JSON.parse(localStorage.getItem('fichajes') || '[]');
            if (fichajes.length === 0) {
                this.mostrarMensaje('No hay fichajes para exportar', 'error');
                this.exporting = false;
                return;
            }

            console.log(`📊 Exportando ${fichajes.length} fichajes`);

            switch (format) {
                case 'pdf':
                    this.exportarPDF(fichajes);
                    break;
                case 'excel':
                    this.exportarExcel(fichajes);
                    break;
                case 'csv':
                    this.exportarCSV(fichajes);
                    break;
                default:
                    console.error('Formato de exportación no válido:', format);
                    this.mostrarMensaje('Formato de exportación no válido', 'error');
                    this.exporting = false;
                    return;
            }

            console.log(`✅ Exportación ${format} completada`);
        } catch (error) {
            console.error('Error al exportar fichajes:', error);
            this.mostrarMensaje('Error al exportar los fichajes', 'error');
        } finally {
            // Resetear flag después de un delay
            setTimeout(() => {
                this.exporting = false;
            }, 1000);
        }
    }

    exportarPDF(fichajes) {
        console.log('🔍 Iniciando exportarPDF...');
        console.log('📊 Fichajes recibidos:', fichajes.length);

        // Verificar si jsPDF está disponible
        console.log('🔍 Verificando jsPDF:', typeof window.jspdf, window.jspdf);

        if (typeof window.jspdf === 'undefined') {
            console.error('❌ jsPDF no está definido');
            this.mostrarMensaje('Error: La biblioteca jsPDF no está cargada', 'error');
            return;
        }

        try {
            console.log('✅ jsPDF disponible, creando documento...');
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            console.log('✅ Documento PDF creado exitosamente');

            // Configuración de la página
            doc.setFontSize(16);
            doc.text('Registro de Fichajes', 20, 20);
            doc.setFontSize(12);

            // Crear tabla
            let y = 40;
            doc.text('Empleado', 20, y);
            doc.text('Tipo', 80, y);
            doc.text('Fecha y Hora', 120, y);
            y += 10;

            // Agrupar por fecha
            const fichajesPorFecha = fichajes.reduce((acc, f) => {
                const fecha = new Date(f.timestamp).toLocaleDateString('es-ES');
                if (!acc[fecha]) acc[fecha] = [];
                acc[fecha].push(f);
                return acc;
            }, {});

            // Imprimir fichajes agrupados por fecha
            for (const [fecha, fichajesDia] of Object.entries(fichajesPorFecha)) {
                // Nueva página si no hay espacio suficiente
                if (y > 250) {
                    doc.addPage();
                    y = 20;
                }

                doc.setFont(undefined, 'bold');
                y += 10;
                doc.text(`Fecha: ${fecha}`, 20, y);
                y += 10;
                doc.setFont(undefined, 'normal');

                fichajesDia.forEach(f => {
                    if (y > 250) {
                        doc.addPage();
                        y = 20;
                    }
                    const hora = new Date(f.timestamp).toLocaleTimeString('es-ES');
                    doc.text(f.employee, 20, y);
                    doc.text(f.type, 80, y);
                    doc.text(hora, 120, y);
                    y += 10;
                });
            }

            console.log('💾 Guardando archivo PDF...');
            doc.save('fichajes.pdf');
            console.log('✅ PDF guardado exitosamente');
            this.mostrarMensaje('PDF generado correctamente', 'success');
        } catch (error) {
            console.error('❌ Error al generar PDF:', error);
            console.error('❌ Stack trace:', error.stack);
            this.mostrarMensaje('Error al generar el PDF: ' + error.message, 'error');
        }
    }

    exportarExcel(fichajes) {
        if (typeof window.XLSX === 'undefined') {
            this.mostrarMensaje('Error: La biblioteca XLSX no está cargada', 'error');
            return;
        }

        try {
            const XLSX = window.XLSX;
            // Preparar datos
            const data = fichajes.map(f => ({
                'Empleado': f.employee,
                'Tipo': f.type,
                'Fecha': new Date(f.timestamp).toLocaleDateString('es-ES'),
                'Hora': new Date(f.timestamp).toLocaleTimeString('es-ES'),
                'Total Horas': '', // Se calculará después
            }));

            // Calcular horas trabajadas por empleado y fecha
            const horasPorEmpleado = {};
            fichajes.forEach(f => {
                const fecha = new Date(f.timestamp).toLocaleDateString('es-ES');
                const key = `${f.employee}-${fecha}`;
                if (!horasPorEmpleado[key]) {
                    horasPorEmpleado[key] = { entrada: null, salida: null };
                }
                if (f.type === 'Entrada') {
                    horasPorEmpleado[key].entrada = new Date(f.timestamp);
                } else if (f.type === 'Salida') {
                    horasPorEmpleado[key].salida = new Date(f.timestamp);
                }
            });

            // Actualizar las horas trabajadas en los datos
            data.forEach(row => {
                const key = `${row.Empleado}-${row.Fecha}`;
                const registro = horasPorEmpleado[key];
                if (registro.entrada && registro.salida) {
                    const minutos = Math.round((registro.salida - registro.entrada) / 1000 / 60);
                    const horas = Math.floor(minutos / 60);
                    const minutosRestantes = minutos % 60;
                    row['Total Horas'] = `${horas}:${minutosRestantes.toString().padStart(2, '0')}`;
                }
            });

            // Crear libro y hoja
            const ws = XLSX.utils.json_to_sheet(data);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Fichajes");

            // Autoajustar columnas
            const colWidths = [
                { wch: 20 }, // Empleado
                { wch: 10 }, // Tipo
                { wch: 12 }, // Fecha
                { wch: 10 }, // Hora
                { wch: 12 }, // Total Horas
            ];
            ws['!cols'] = colWidths;

            // Guardar archivo
            XLSX.writeFile(wb, "fichajes.xlsx");
            this.mostrarMensaje('Excel generado correctamente', 'success');
        } catch (error) {
            console.error('Error al generar Excel:', error);
            this.mostrarMensaje('Error al generar el archivo Excel', 'error');
        }
    }

    exportarCSV(fichajes) {
        try {
            // Preparar encabezados
            const headers = ['Empleado', 'Tipo', 'Fecha', 'Hora'];

            // Preparar filas
            const rows = fichajes.map(f => {
                const fecha = new Date(f.timestamp);
                return [
                    f.employee,
                    f.type,
                    fecha.toLocaleDateString('es-ES'),
                    fecha.toLocaleTimeString('es-ES')
                ];
            });

            // Añadir encabezados al inicio
            rows.unshift(headers);

            // Convertir a CSV
            const csvContent = rows.map(row =>
                row.map(cell => `"${cell}"`).join(',')
            ).join('\n');

            // Crear y descargar el archivo
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', 'fichajes.csv');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            this.mostrarMensaje('CSV generado correctamente', 'success');
        } catch (error) {
            console.error('Error al generar CSV:', error);
            this.mostrarMensaje('Error al generar el archivo CSV', 'error');
        }
    }

    inicializarFormularioFichajeManual() {
        // Inicializar campo de fecha simple con un delay para asegurar que el DOM esté listo
        setTimeout(() => {
            const fechaInput = document.getElementById('fichajeManualFecha');
            if (fechaInput) {
                // Remover todas las restricciones que puedan causar problemas
                fechaInput.removeAttribute('min');
                fechaInput.removeAttribute('max');
                fechaInput.removeAttribute('required');

                const ahora = new Date();
                // Crear fecha con formato correcto y redondear los minutos
                ahora.setSeconds(0);
                ahora.setMilliseconds(0);
                const fechaFormateada = ahora.toISOString().slice(0, 16);

                fechaInput.value = fechaFormateada;

                console.log('📅 Campo de fecha simple inicializado:', fechaInput.value);
                console.log('📅 Restricciones removidas para permitir fechas futuras');
                console.log('📅 Campo válido:', fechaInput.checkValidity());
            }

            // Inicializar campos de fecha múltiple con valores por defecto
            const fechaInicio = document.getElementById('fichajeManualFechaInicio');
            const fechaFin = document.getElementById('fichajeManualFechaFin');
            const hora = document.getElementById('fichajeManualHora');

            if (fechaInicio && fechaFin && hora) {
                const hoy = new Date();
                const mañana = new Date(hoy);
                mañana.setDate(hoy.getDate() + 1);

                // Usar fechas futuras como ejemplo
                fechaInicio.valueAsDate = hoy;
                fechaFin.valueAsDate = mañana;
                hora.value = '09:00';

                // Remover restricciones de fecha si existen
                fechaInicio.removeAttribute('max');
                fechaFin.removeAttribute('max');
                fechaInicio.removeAttribute('min');
                fechaFin.removeAttribute('min');

                console.log('📅 Campos de fecha múltiple inicializados');
                console.log('📅 Fecha inicio:', fechaInicio.value);
                console.log('📅 Fecha fin:', fechaFin.value);
            }
        }, 100);
    }

    inicializarVerFichajes() {
        const fechaInicio = document.getElementById('fechaInicio');
        const fechaFin = document.getElementById('fechaFin');

        if (fechaInicio && fechaFin) {
            const hoy = new Date();
            const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);

            fechaInicio.valueAsDate = inicioMes;
            fechaFin.valueAsDate = hoy;
        }
    }

    async inicializarEditarFichajes(modalDiv) {
        try {
            const hoy = new Date();

            // Establecer fecha de hoy por defecto
            const fechaEdicion = modalDiv.querySelector('#fechaEdicion');
            if (fechaEdicion) {
                fechaEdicion.valueAsDate = hoy;
            }

            // Establecer rango de fechas por defecto (hoy hasta hoy)
            const fechaEdicionInicio = modalDiv.querySelector('#fechaEdicionInicio');
            const fechaEdicionFin = modalDiv.querySelector('#fechaEdicionFin');

            if (fechaEdicionInicio) fechaEdicionInicio.valueAsDate = hoy;
            if (fechaEdicionFin) fechaEdicionFin.valueAsDate = hoy;

            console.log('Modal de edición de fichajes inicializado con fecha:', hoy.toDateString());
        } catch (error) {
            console.error('Error al inicializar modal de edición:', error);
        }
    }

    async inicializarEliminarFichajes(modalDiv) {
        try {
            const hoy = new Date();

            // Establecer fecha de hoy por defecto
            const fechaEliminacion = modalDiv.querySelector('#fechaEliminacion');
            if (fechaEliminacion) {
                fechaEliminacion.valueAsDate = hoy;
            }

            // Establecer rango de fechas por defecto (hoy hasta hoy)
            const fechaEliminacionInicio = modalDiv.querySelector('#fechaEliminacionInicio');
            const fechaEliminacionFin = modalDiv.querySelector('#fechaEliminacionFin');

            if (fechaEliminacionInicio) fechaEliminacionInicio.valueAsDate = hoy;
            if (fechaEliminacionFin) fechaEliminacionFin.valueAsDate = hoy;

            console.log('Modal de eliminación de fichajes inicializado con fecha:', hoy.toDateString());
        } catch (error) {
            console.error('Error al inicializar modal de eliminación:', error);
        }
    }

    async inicializarImprimirFichajes() {
        try {
            console.log('Inicializando modal de imprimir fichajes...');

            // Inicializar fechas con el rango del mes actual
            const hoy = new Date();
            const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);

            const fechaInicio = document.getElementById('imprimirFechaInicio');
            const fechaFin = document.getElementById('imprimirFechaFin');

            if (fechaInicio) fechaInicio.valueAsDate = inicioMes;
            if (fechaFin) fechaFin.valueAsDate = hoy;

            console.log('Modal de imprimir fichajes inicializado');
        } catch (error) {
            console.error('Error al inicializar modal de imprimir:', error);
        }
    }

    imprimirInforme() {
        // Prevenir ejecución duplicada
        if (this.printing) {
            console.log('Impresión ya en progreso, ignorando duplicado');
            return;
        }

        this.printing = true;

        try {
            console.log('🖨️ Iniciando impresión de informe');

            const empleado = document.getElementById('empleadoInforme')?.value;
            const fichajes = this.obtenerFichajes();

            let fichajesFiltrados = fichajes;
            if (empleado) {
                fichajesFiltrados = fichajes.filter(f => f.employee === empleado);
            }

            // Ordenar por fecha
            fichajesFiltrados.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

            // Crear ventana de impresión
            const printWindow = window.open('', '_blank');
            printWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Informe de Fichajes</title>
                    <style>
                        body { font-family: Arial, sans-serif; }
                        .header { text-align: center; margin-bottom: 20px; }
                        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                        th { background-color: #f5f5f5; }
                        .fecha-header { margin-top: 20px; margin-bottom: 10px; }
                        .tipo { padding: 3px 8px; border-radius: 3px; }
                        .entrada { background-color: #e8f5e9; color: #2e7d32; }
                        .salida { background-color: #fbe9e7; color: #c62828; }
                        @media print {
                            .no-print { display: none; }
                            table { page-break-inside: avoid; }
                        }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>Informe de Fichajes</h1>
                        ${empleado ? `<h2>Empleado: ${empleado}</h2>` : ''}
                        <p>Generado el ${new Date().toLocaleString('es-ES')}</p>
                    </div>
            `);

            // Agrupar por fecha
            const fichajesPorFecha = fichajesFiltrados.reduce((acc, f) => {
                const fecha = new Date(f.timestamp).toLocaleDateString('es-ES');
                if (!acc[fecha]) acc[fecha] = [];
                acc[fecha].push(f);
                return acc;
            }, {});

            // Generar tablas por fecha
            for (const [fecha, fichajesDia] of Object.entries(fichajesPorFecha)) {
                let horasTrabajadas = null;
                if (empleado) {
                    horasTrabajadas = this.calcularHorasTrabajadas(fichajesDia);
                }

                printWindow.document.write(`
                    <h3 class="fecha-header">Fecha: ${fecha}</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Empleado</th>
                                <th>Tipo</th>
                                <th>Hora</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${fichajesDia.map(f => `
                                <tr>
                                    <td>${f.employee}</td>
                                    <td><span class="tipo ${f.type.toLowerCase()}">${f.type}</span></td>
                                    <td>${new Date(f.timestamp).toLocaleTimeString('es-ES')}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    ${horasTrabajadas ? `
                        <p><strong>Total horas trabajadas: ${horasTrabajadas}</strong></p>
                    ` : ''}
                `);
            }

            printWindow.document.write(`
                    <div class="no-print" style="margin-top: 20px; text-align: center;">
                        <button onclick="window.print()">Imprimir</button>
                    </div>
                </body>
                </html>
            `);

            printWindow.document.close();
        } catch (error) {
            console.error('Error al generar informe:', error);
            this.mostrarMensaje('Error al generar el informe', 'error');
        } finally {
            // Resetear flag después de un delay
            setTimeout(() => {
                this.printing = false;
            }, 1000);
        }
    }

    async actualizarTodosLosSelectores() {
        try {
            console.log('Actualizando todos los selectores de empleados...');
            const selectores = document.querySelectorAll('select[id$="empleado"], select[id$="Empleado"]:not(#rolEmpleado)');
            console.log('Selectores encontrados:', selectores.length);

            const empleados = await this.obtenerEmpleados();
            console.log('Empleados obtenidos:', empleados.length);

            for (const select of selectores) {
                console.log('Actualizando selector:', select.id);

                // Guardar el valor actual
                const valorActual = select.value;

                // Limpiar select
                select.innerHTML = '';

                // Agregar opción por defecto
                const defaultOption = document.createElement('option');
                defaultOption.value = '';
                defaultOption.textContent = select.id === 'empleadoConsulta' || select.id === 'empleadoEdicion'
                    ? 'Todos los empleados'
                    : 'Seleccionar empleado';
                select.appendChild(defaultOption);

                // Agregar empleados ordenados alfabéticamente
                if (empleados && empleados.length > 0) {
                    empleados
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .forEach(emp => {
                            const option = document.createElement('option');
                            option.value = emp.name;
                            option.textContent = emp.name;
                            select.appendChild(option);
                        });

                    // Restaurar valor si existía
                    if (valorActual && empleados.some(emp => emp.name === valorActual)) {
                        select.value = valorActual;
                    }
                }
            }

            console.log('Selectores actualizados correctamente');
        } catch (error) {
            console.error('Error al actualizar selectores:', error);
            this.mostrarMensaje('Error al actualizar los selectores de empleados', 'error');
        }
    }

    async actualizarSelectoresEnModal(modalElement) {
        try {
            console.log('🎯 Actualizando selectores específicamente en el modal...');
            const selectores = modalElement.querySelectorAll('select[id*="empleado"], select[id*="Empleado"]:not(#rolEmpleado)');
            console.log('🎯 Selectores encontrados en el modal:', selectores.length);

            const empleados = await this.obtenerEmpleados();
            console.log('🎯 Empleados obtenidos para modal:', empleados.length);

            for (const select of selectores) {
                console.log('🎯 Actualizando selector del modal:', select.id);

                // Limpiar select
                select.innerHTML = '';

                // Agregar opción por defecto específica para cada tipo
                const defaultOption = document.createElement('option');
                defaultOption.value = '';

                if (select.id === 'empleadoConsulta' || select.id === 'empleadoEdicion') {
                    defaultOption.textContent = 'Todos los empleados';
                } else {
                    defaultOption.textContent = 'Seleccionar empleado';
                }
                select.appendChild(defaultOption);

                // Agregar empleados ordenados alfabéticamente
                if (empleados && empleados.length > 0) {
                    empleados
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .forEach(emp => {
                            const option = document.createElement('option');
                            option.value = emp.name;
                            option.textContent = emp.name;
                            select.appendChild(option);
                            console.log(`🎯 Añadido empleado ${emp.name} al selector ${select.id}`);
                        });
                }

                console.log(`🎯 Selector ${select.id} tiene ahora ${select.options.length} opciones`);
            }

            console.log('✅ Selectores del modal actualizados correctamente');
        } catch (error) {
            console.error('❌ Error al actualizar selectores del modal:', error);
            this.mostrarMensaje('Error al actualizar los selectores del modal', 'error');
        }
    }

    // Nueva función para completar salidas automáticamente
    completarSalidasPendientes(empleadoId = null, horaDefault = '18:00') {
        const fichajes = this.obtenerFichajes();
        const fichajesCompletados = [];

        // Agrupar por empleado y fecha
        const fichajesPorEmpleadoFecha = {};

        fichajes.forEach(fichaje => {
            const fecha = new Date(fichaje.timestamp).toDateString();
            const key = `${fichaje.employee}-${fecha}`;

            if (!fichajesPorEmpleadoFecha[key]) {
                fichajesPorEmpleadoFecha[key] = { entradas: [], salidas: [] };
            }

            if (fichaje.type === 'Entrada') {
                fichajesPorEmpleadoFecha[key].entradas.push(fichaje);
            } else {
                fichajesPorEmpleadoFecha[key].salidas.push(fichaje);
            }
        });

        console.log('🔍 Buscando salidas pendientes...');

        // Buscar entradas sin salida correspondiente
        Object.entries(fichajesPorEmpleadoFecha).forEach(([key, datos]) => {
            const [empleado, fecha] = key.split('-');

            // Si hay más entradas que salidas, necesitamos completar
            if (datos.entradas.length > datos.salidas.length) {
                const entradasSinSalida = datos.entradas.length - datos.salidas.length;
                console.log(`   📍 ${empleado}: ${entradasSinSalida} entrada(s) sin salida el ${fecha}`);

                // Solo procesar si no se especifica empleado o coincide
                if (!empleadoId || empleado === empleadoId) {
                    // Crear salida automática
                    for (let i = 0; i < entradasSinSalida; i++) {
                        const entradaSinSalida = datos.entradas[datos.salidas.length + i];
                        const fechaEntrada = new Date(entradaSinSalida.timestamp);

                        // Crear salida X horas después o a la hora especificada
                        const [hora, minutos] = horaDefault.split(':');
                        const fechaSalida = new Date(fechaEntrada);
                        fechaSalida.setHours(parseInt(hora), parseInt(minutos), 0, 0);

                        // Si la salida sería antes que la entrada, añadir 8 horas
                        if (fechaSalida <= fechaEntrada) {
                            fechaSalida.setTime(fechaEntrada.getTime() + (8 * 60 * 60 * 1000));
                        }

                        const salidaAutomatica = {
                            employee: empleado,
                            type: 'Salida',
                            timestamp: fechaSalida.toISOString()
                        };

                        fichajesCompletados.push(salidaAutomatica);
                        console.log(`   ✅ Salida automática creada para ${empleado}: ${fechaSalida.toLocaleString('es-ES')}`);
                    }
                }
            }
        });

        if (fichajesCompletados.length > 0) {
            const todosFichajes = [...fichajes, ...fichajesCompletados];
            this.guardarFichajes(todosFichajes);
            console.log(`✅ ${fichajesCompletados.length} salidas automáticas añadidas`);
            this.mostrarMensaje(`Se completaron ${fichajesCompletados.length} salidas pendientes`, 'success');
            return fichajesCompletados;
        } else {
            console.log('✅ No hay salidas pendientes por completar');
            this.mostrarMensaje('No hay salidas pendientes por completar', 'info');
            return [];
        }
    }

    diagnosticarCalculoHoras() {
        console.log('%c⏰ Diagnosticando cálculo de horas en Ver Fichajes...', 'color: #e74c3c; font-weight: bold');

        const menuManager = window.menuManager;

        // Obtener fichajes actuales
        const fichajes = menuManager.obtenerFichajes();
        console.log('📊 Total fichajes en sistema:', fichajes.length);

        if (fichajes.length === 0) {
            console.log('❌ No hay fichajes para analizar');
            return;
        }

        // Mostrar primeros 5 fichajes como muestra
        console.log('📝 Muestra de fichajes:');
        fichajes.slice(0, 5).forEach((f, i) => {
            console.log(`  ${i + 1}. ${f.employee} - ${f.type} - ${new Date(f.timestamp).toLocaleString('es-ES')}`);
        });

        // Probar cálculo de horas por empleado
        console.log('\n🧮 Probando cálculo de horas por empleado...');
        const horasPorEmpleado = menuManager.calcularHorasPorEmpleado(fichajes);
        console.log('Resultado:', horasPorEmpleado);

        // Probar cálculo de horas individual
        if (fichajes.length > 0) {
            const primerEmpleado = fichajes[0].employee;
            const fichajesEmpleado = fichajes.filter(f => f.employee === primerEmpleado);
            console.log(`\n👤 Probando cálculo individual para ${primerEmpleado} (${fichajesEmpleado.length} fichajes):`);
            const horasIndividual = menuManager.calcularHorasTrabajadas(fichajesEmpleado);
            console.log('Horas calculadas:', horasIndividual);
        }

        // Simular consulta de fichajes
        console.log('\n🔍 Simulando consulta de fichajes...');
        setTimeout(() => {
            menuManager.mostrarModal('ver-fichajes');

            setTimeout(() => {
                // Llenar fechas automáticamente
                const hoy = new Date();
                const ayer = new Date(hoy);
                ayer.setDate(hoy.getDate() - 7); // Una semana atrás

                const fechaInicio = document.getElementById('consultaFechaInicio');
                const fechaFin = document.getElementById('consultaFechaFin');

                if (fechaInicio && fechaFin) {
                    fechaInicio.valueAsDate = ayer;
                    fechaFin.valueAsDate = hoy;

                    console.log('📅 Fechas configuradas automáticamente');
                    console.log('   Desde:', ayer.toLocaleDateString('es-ES'));
                    console.log('   Hasta:', hoy.toLocaleDateString('es-ES'));

                    console.log('💡 Ahora puedes hacer clic en "Consultar" para ver si aparecen las horas');
                }
            }, 1000);
        }, 500);
    }

    async crearCopiaSeguridad() {
        try {
            // Obtener datos de localStorage
            const empleados = localStorage.getItem('employees');
            const fichajes = localStorage.getItem('fichajes');

            if (!empleados && !fichajes) {
                console.log('No hay datos para respaldar');
                return;
            }

            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

            // Crear objetos de respaldo con metadatos
            const backup = {
                timestamp: new Date().toISOString(),
                version: '1.0',
                app: 'Mi Casita de Patch - Sistema de Fichajes',
                data: {
                    employees: empleados ? JSON.parse(empleados) : null,
                    fichajes: fichajes ? JSON.parse(fichajes) : []
                }
            };

            // Convertir a JSON formateado
            const backupJson = JSON.stringify(backup, null, 2);

            // Crear enlace de descarga temporal
            const blob = new Blob([backupJson], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = `backup-fichajes-${timestamp.substring(0, 10)}.json`;

            // Descargar automáticamente cada vez que se modifiquen datos importantes
            // Solo si han pasado más de 5 minutos desde la última copia
            const ultimaCopia = localStorage.getItem('ultimaCopiaSeguridad');
            const ahora = Date.now();

            if (!ultimaCopia || (ahora - parseInt(ultimaCopia)) > 300000) { // 5 minutos
                console.log('💾 Creando copia de seguridad automática...');
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);

                localStorage.setItem('ultimaCopiaSeguridad', ahora.toString());
                this.mostrarToast('Copia de seguridad creada automáticamente', 'info', 3000);
            }

        } catch (error) {
            console.error('Error al crear copia de seguridad:', error);
        }
    }

    async crearCopiaManual() {
        try {
            // Obtener datos de localStorage
            const empleados = localStorage.getItem('employees');
            const fichajes = localStorage.getItem('fichajes');

            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

            // Crear objetos de respaldo con metadatos
            const backup = {
                timestamp: new Date().toISOString(),
                version: '1.0',
                app: 'Mi Casita de Patch - Sistema de Fichajes',
                data: {
                    employees: empleados ? JSON.parse(empleados) : null,
                    fichajes: fichajes ? JSON.parse(fichajes) : []
                }
            };

            // Crear datos para archivos separados también
            const empleadosData = empleados ? JSON.parse(empleados) : null;
            const fichajesData = fichajes ? JSON.parse(fichajes) : [];

            // Crear múltiples archivos de respaldo
            const archivos = [
                {
                    nombre: `backup-completo-${timestamp.substring(0, 10)}.json`,
                    contenido: JSON.stringify(backup, null, 2)
                },
                {
                    nombre: `empleados-${timestamp.substring(0, 10)}.json`,
                    contenido: JSON.stringify(empleadosData, null, 2)
                },
                {
                    nombre: `fichajes-${timestamp.substring(0, 10)}.json`,
                    contenido: JSON.stringify(fichajesData, null, 2)
                }
            ];

            // Descargar todos los archivos
            archivos.forEach((archivo, index) => {
                setTimeout(() => {
                    const blob = new Blob([archivo.contenido], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);

                    const link = document.createElement('a');
                    link.href = url;
                    link.download = archivo.nombre;

                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);
                }, index * 500); // Retraso entre descargas
            });

            console.log('💾 Backup de datos descargado. Ubicación sugerida: data/backups/datos/');
            this.mostrarMensaje('Copia de seguridad manual creada exitosamente', 'success');

        } catch (error) {
            console.error('Error al crear copia de seguridad manual:', error);
            this.mostrarMensaje('Error al crear la copia de seguridad', 'error');
        }
    }

    async inicializarExportarEmail() {
        try {
            const form = document.getElementById('formExportarEmail');
            if (form) {
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const email = form.emailDestino.value.trim();
                    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
                        this.mostrarMensaje('Introduce un email válido', 'error');
                        return;
                    }
                    // Aquí iría la lógica real de envío por email
                    this.mostrarMensaje('Fichajes enviados a ' + email, 'success');
                    this.cerrarModal();
                });
            }
        } catch (error) {
            console.error('Error al inicializar el formulario de envío por email:', error);
        }
    }

    async exportarPDFComoBlob(fichajes) {
        if (typeof window.jspdf === 'undefined') {
            this.mostrarMensaje('Error: La biblioteca jsPDF no está cargada', 'error');
            return null;
        }
        try {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            doc.setFontSize(16);
            doc.text('Registro de Fichajes', 20, 20);
            doc.setFontSize(12);
            let y = 40;
            doc.text('Empleado', 20, y);
            doc.text('Tipo', 80, y);
            doc.text('Fecha y Hora', 120, y);
            y += 10;
            const fichajesPorFecha = fichajes.reduce((acc, f) => {
                const fecha = new Date(f.timestamp).toLocaleDateString('es-ES');
                if (!acc[fecha]) acc[fecha] = [];
                acc[fecha].push(f);
                return acc;
            }, {});
            for (const [fecha, fichajesDia] of Object.entries(fichajesPorFecha)) {
                if (y > 250) {
                    doc.addPage();
                    y = 20;
                }
                doc.setFont(undefined, 'bold');
                y += 10;
                doc.text(`Fecha: ${fecha}`, 20, y);
                y += 10;
                doc.setFont(undefined, 'normal');
                fichajesDia.forEach(f => {
                    if (y > 250) {
                        doc.addPage();
                        y = 20;
                    }
                    const hora = new Date(f.timestamp).toLocaleTimeString('es-ES');
                    doc.text(f.employee, 20, y);
                    doc.text(f.type, 80, y);
                    doc.text(hora, 120, y);
                    y += 10;
                });
            }
            return doc.output('blob');
        } catch (error) {
            this.mostrarMensaje('Error al generar el PDF: ' + error.message, 'error');
            return null;
        }
    }

    async exportarExcelComoBlob(fichajes) {
        if (typeof window.XLSX === 'undefined') {
            this.mostrarMensaje('Error: La biblioteca XLSX no está cargada', 'error');
            return null;
        }
        try {
            const XLSX = window.XLSX;
            const data = fichajes.map(f => ({
                'Empleado': f.employee,
                'Tipo': f.type,
                'Fecha': new Date(f.timestamp).toLocaleDateString('es-ES'),
                'Hora': new Date(f.timestamp).toLocaleTimeString('es-ES')
            }));
            const ws = XLSX.utils.json_to_sheet(data);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Fichajes");
            const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
            return new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        } catch (error) {
            this.mostrarMensaje('Error al generar el Excel: ' + error.message, 'error');
            return null;
        }
    }

    async exportarCSVComoBlob(fichajes) {
        try {
            const headers = ['Empleado', 'Tipo', 'Fecha', 'Hora'];
            const rows = fichajes.map(f => {
                const fecha = new Date(f.timestamp);
                return [
                    f.employee,
                    f.type,
                    fecha.toLocaleDateString('es-ES'),
                    fecha.toLocaleTimeString('es-ES')
                ];
            });
            rows.unshift(headers);
            const csvContent = rows.map(row =>
                row.map(cell => `"${cell}"`).join(',')
            ).join('\n');
            return new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        } catch (error) {
            this.mostrarMensaje('Error al generar el CSV: ' + error.message, 'error');
            return null;
        }
    }
}

// Inicializar el gestor de menú cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.menuManager = new MenuManager();

    // Mostrar mensaje de bienvenida con información del menú de comandos
    setTimeout(() => {
        console.log('');
        console.log('🎯 ═══════════════════════════════════════════════════════════════');
        console.log('🚀 SISTEMA DE FICHAJES - Mi Casita de Patch');
        console.log('🎯 ═══════════════════════════════════════════════════════════════');
        console.log('');
        console.log('💡 Para acceder al menú interactivo de comandos de prueba:');
        console.log('');
        console.log('%c   menuComandos()', 'color: #4CAF50; font-weight: bold; font-size: 16px; background: #f0f8f0; padding: 5px;');
        console.log('');
        console.log('📋 Este menú incluye 31 funciones de prueba organizadas por categorías:');
        console.log('   • 📊 Datos y estructura');
        console.log('   • 👥 Gestión de empleados');
        console.log('   • 📋 Fichajes y horarios');
        console.log('   • 📤 Exportación e impresión');
        console.log('   • 🧪 Pruebas de interfaz');
        console.log('   • ⏰ Cálculo de horas');
        console.log('   • 🏗️ Generación de datos');
        console.log('   • 🚀 Y mucho más...');
        console.log('');
        console.log('🎯 ═══════════════════════════════════════════════════════════════');
        console.log('');
    }, 1500);
});

// Función de prueba para verificar fichajes futuros
window.probarFichajeFuturo = async function () {
    console.log('🧪 Iniciando prueba de fichajes futuros...');

    const menuManager = window.menuManager;
    if (!menuManager) {
        console.error('MenuManager no está disponible');
        return;
    }

    // Crear fichaje para mañana
    const mañana = new Date();
    mañana.setDate(mañana.getDate() + 1);
    mañana.setHours(9, 0, 0, 0);

    const empleados = await menuManager.obtenerEmpleados();
    console.log('🔍 Empleados obtenidos:', empleados);

    if (!empleados || empleados.length === 0) {
        console.error('No hay empleados disponibles');
        return;
    }

    console.log('👤 Primer empleado:', empleados[0]);

    const fichajePrueba = {
        employee: empleados[0].name, // Usar .name en lugar de .nombre
        type: 'Entrada',
        timestamp: mañana.toISOString()
    };

    const fichajes = menuManager.obtenerFichajes();
    fichajes.push(fichajePrueba);
    menuManager.guardarFichajes(fichajes);

    console.log('✅ Fichaje futuro creado:', {
        empleado: fichajePrueba.employee,
        tipo: fichajePrueba.type,
        fecha: mañana.toLocaleDateString('es-ES'),
        hora: mañana.toLocaleTimeString('es-ES')
    });

    console.log('📊 Total fichajes ahora:', menuManager.obtenerFichajes().length);

    return fichajePrueba;
};

// Función para probar el modal de fichaje manual con fecha futura
window.probarModalFichajeFuturo = function () {
    console.log('🧪 Probando modal de fichaje manual con fecha futura...');

    const menuManager = window.menuManager;
    if (!menuManager) {
        console.error('MenuManager no está disponible');
        return;
    }

    // Abrir el modal
    menuManager.mostrarModal('fichaje-manual');

    // Esperar un poco y luego configurar fecha futura
    setTimeout(() => {
        const fechaInput = document.getElementById('fichajeManualFecha');
        if (fechaInput) {
            const fechaFutura = new Date();
            fechaFutura.setDate(fechaFutura.getDate() + 7); // Una semana en el futuro
            fechaFutura.setHours(14, 30, 0, 0);

            const fechaFormateada = fechaFutura.toISOString().slice(0, 16);
            fechaInput.value = fechaFormateada;

            console.log('✅ Fecha futura configurada en el modal:', fechaFormateada);
            console.log('📅 Campo válido:', fechaInput.checkValidity());
            console.log('📅 Mensaje de validación:', fechaInput.validationMessage);
        } else {
            console.error('❌ No se encontró el campo de fecha');
        }
    }, 500);

    console.log('💡 Modal abierto. Revisa el campo de fecha en unos segundos.');
};

// Función simple para debug de datos
window.verificarDatos = async function () {
    console.log('🔍 === VERIFICACIÓN DE DATOS ===');

    const menuManager = window.menuManager;
    if (!menuManager) {
        console.error('❌ MenuManager no está disponible');
        return;
    }

    // Verificar empleados
    try {
        const empleados = await menuManager.obtenerEmpleados();
        console.log('👥 Empleados:', empleados);
        console.log('📊 Cantidad:', empleados?.length || 0);

        if (empleados && empleados.length > 0) {
            console.log('👤 Primer empleado:', empleados[0]);
            console.log('🏷️ Propiedades del primer empleado:', Object.keys(empleados[0]));
        }
    } catch (error) {
        console.error('❌ Error obteniendo empleados:', error);
    }

    // Verificar fichajes
    try {
        const fichajes = menuManager.obtenerFichajes();
        console.log('📋 Fichajes:', fichajes.length);
    } catch (error) {
        console.error('❌ Error obteniendo fichajes:', error);
    }

    console.log('🔍 === FIN VERIFICACIÓN ===');
};

// Función para probar todos los modales responsive
window.probarModalResponsive = function () {
    console.log('📱 Probando modales responsive...');

    const modales = [
        'fichaje-manual',
        'crear-empleado',
        'editar-fichajes',
        'ver-fichajes',
        'exportar'
    ];

    let modalIndex = 0;

    function mostrarSiguienteModal() {
        if (modalIndex >= modales.length) {
            console.log('✅ Prueba de modales completada');
            return;
        }

        const modalActual = modales[modalIndex];
        console.log(`📱 Mostrando modal: ${modalActual}`);

        window.menuManager.mostrarModal(modalActual);

        setTimeout(() => {
            window.menuManager.cerrarModal();
            modalIndex++;
            setTimeout(mostrarSiguienteModal, 500);
        }, 2000);
    }

    mostrarSiguienteModal();
};



// Función para probar el centrado de modales
window.probarCentradoModal = function () {
    console.log('🎯 Probando centrado de modales...');

    const menuManager = window.menuManager;
    if (!menuManager) {
        console.error('MenuManager no está disponible');
        return;
    }

    // Abrir modal de fichaje manual
    menuManager.mostrarModal('fichaje-manual');

    setTimeout(() => {
        const overlay = document.querySelector('.modal-overlay');
        const modal = document.querySelector('.modal');

        if (overlay && modal) {
            const overlayRect = overlay.getBoundingClientRect();
            const modalRect = modal.getBoundingClientRect();

            console.log('📐 Dimensiones del overlay:', {
                width: overlayRect.width,
                height: overlayRect.height,
                top: overlayRect.top,
                left: overlayRect.left
            });

            console.log('📐 Dimensiones del modal:', {
                width: modalRect.width,
                height: modalRect.height,
                top: modalRect.top,
                left: modalRect.left
            });

            // Calcular si está centrado
            const centerX = overlayRect.width / 2;
            const centerY = overlayRect.height / 2;
            const modalCenterX = modalRect.left + modalRect.width / 2;
            const modalCenterY = modalRect.top + modalRect.height / 2;

            const offsetX = Math.abs(centerX - modalCenterX);
            const offsetY = Math.abs(centerY - modalCenterY);

            console.log('🎯 Centrado horizontal:', offsetX < 10 ? '✅ Correcto' : '❌ Descentrado', `(${offsetX.toFixed(1)}px)`);
            console.log('🎯 Centrado vertical:', offsetY < 10 ? '✅ Correcto' : '❌ Descentrado', `(${offsetY.toFixed(1)}px)`);

            if (offsetX < 10 && offsetY < 10) {
                console.log('🎉 Modal perfectamente centrado');
            } else {
                console.log('⚠️ Modal necesita ajustes de centrado');
            }
        }
    }, 500);

    console.log('💡 Revisa la consola en 0.5 segundos para ver los resultados');
};



// Función rápida para verificar centrado inmediato
window.testCentrado = function () {
    console.log('🚀 Test rápido de centrado...');

    // Cerrar cualquier modal existente
    window.menuManager.cerrarModal();

    setTimeout(() => {
        // Abrir modal
        window.menuManager.mostrarModal('fichaje-manual');

        setTimeout(() => {
            const overlay = document.querySelector('.modal-overlay');
            const modal = document.querySelector('.modal');

            if (overlay && modal) {
                const overlayStyle = window.getComputedStyle(overlay);
                const modalStyle = window.getComputedStyle(modal);

                console.log('📊 Estilos del overlay:', {
                    display: overlayStyle.display,
                    alignItems: overlayStyle.alignItems,
                    justifyContent: overlayStyle.justifyContent,
                    position: overlayStyle.position
                });

                console.log('📊 Estilos del modal:', {
                    position: modalStyle.position,
                    transform: modalStyle.transform,
                    width: modalStyle.width,
                    maxWidth: modalStyle.maxWidth
                });

                // Verificar posición visual
                const modalRect = modal.getBoundingClientRect();
                const viewportCenterX = window.innerWidth / 2;
                const viewportCenterY = window.innerHeight / 2;
                const modalCenterX = modalRect.left + modalRect.width / 2;
                const modalCenterY = modalRect.top + modalRect.height / 2;

                console.log('🎯 Centro viewport:', { x: viewportCenterX, y: viewportCenterY });
                console.log('🎯 Centro modal:', { x: modalCenterX, y: modalCenterY });

                const diffX = Math.abs(viewportCenterX - modalCenterX);
                const diffY = Math.abs(viewportCenterY - modalCenterY);

                console.log(diffX < 20 ? '✅ CENTRADO HORIZONTAL' : '❌ DESCENTRADO HORIZONTAL', `(diff: ${diffX.toFixed(1)}px)`);
                console.log(diffY < 20 ? '✅ CENTRADO VERTICAL' : '❌ DESCENTRADO VERTICAL', `(diff: ${diffY.toFixed(1)}px)`);
            }
        }, 100);
    }, 100);
};



// Test súper simple
window.testSimple = function () {
    console.log('🎯 Test simple de centrado...');
    window.menuManager.mostrarModal('fichaje-manual');

    setTimeout(() => {
        const modal = document.querySelector('.modal');
        if (modal) {
            const rect = modal.getBoundingClientRect();
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            const modalCenterX = rect.left + rect.width / 2;
            const modalCenterY = rect.top + rect.height / 2;

            console.log(`📐 Pantalla: ${window.innerWidth}x${window.innerHeight}`);
            console.log(`📐 Modal: x=${rect.left.toFixed(0)}, y=${rect.top.toFixed(0)}, w=${rect.width.toFixed(0)}, h=${rect.height.toFixed(0)}`);
            console.log(`🎯 Centro pantalla: (${centerX.toFixed(0)}, ${centerY.toFixed(0)})`);
            console.log(`🎯 Centro modal: (${modalCenterX.toFixed(0)}, ${modalCenterY.toFixed(0)})`);

            const diffX = Math.abs(centerX - modalCenterX);
            const diffY = Math.abs(centerY - modalCenterY);

            console.log(diffX < 50 ? '✅ HORIZONTAL OK' : '❌ HORIZONTAL MAL', `(${diffX.toFixed(0)}px)`);
            console.log(diffY < 50 ? '✅ VERTICAL OK' : '❌ VERTICAL MAL', `(${diffY.toFixed(0)}px)`);
        }
    }, 200);
};



// Función para probar el cálculo de horas trabajadas
window.probarCalculoHoras = function () {
    console.log('⏰ Probando cálculo de horas trabajadas...');

    const menuManager = window.menuManager;
    if (!menuManager) {
        console.error('MenuManager no está disponible');
        return;
    }

    // Obtener fichajes actuales
    const fichajes = menuManager.obtenerFichajes();
    console.log('📊 Total fichajes:', fichajes.length);

    // Probar cálculo para todos los empleados
    const horasPorEmpleado = menuManager.calcularHorasPorEmpleado(fichajes);
    console.log('👥 Horas por empleado:', horasPorEmpleado);

    // Probar cálculo para un empleado específico
    const empleados = menuManager.obtenerEmpleados();
    if (empleados.length > 0) {
        const empleadoPrueba = empleados[0].name;
        const fichajesEmpleado = fichajes.filter(f => f.employee === empleadoPrueba);
        const horasEmpleado = menuManager.calcularHorasTrabajadas(fichajesEmpleado);
        console.log(`👤 Horas de ${empleadoPrueba}:`, horasEmpleado);
    }

    // Abrir modal de consulta para verificar visualmente
    setTimeout(() => {
        menuManager.mostrarModal('ver-fichajes');
        console.log('💡 Modal de consulta abierto. Prueba seleccionar diferentes empleados y rangos de fechas.');
    }, 1000);
};



// Función para probar el modal de editar fichajes con rango de fechas
window.probarRangoFechasEdicion = function () {
    console.log('%c🗓️ Probando modal editar fichajes con rango de fechas...', 'color: #4CAF50; font-weight: bold');

    window.menuManager.mostrarModal('editar-fichajes');

    setTimeout(() => {
        console.log('✅ Modal abierto, verificando elementos...');

        const rangoCheckbox = document.getElementById('rangoFechas');
        const fechaSimple = document.querySelector('.fecha-simple-edicion');
        const fechaRango = document.querySelector('.fecha-rango-edicion');
        const formBuscar = document.getElementById('formBuscarFichajes');

        console.log('🔲 Checkbox rango:', rangoCheckbox ? 'Encontrado' : 'NO encontrado');
        console.log('📅 Fecha simple:', fechaSimple ? 'Encontrada' : 'NO encontrada');
        console.log('📅 Fecha rango:', fechaRango ? 'Encontrada' : 'NO encontrada');
        console.log('📝 Formulario:', formBuscar ? 'Encontrado' : 'NO encontrado');

        if (rangoCheckbox) {
            console.log('🔄 Activando rango de fechas...');
            rangoCheckbox.checked = true;
            rangoCheckbox.dispatchEvent(new Event('change'));

            setTimeout(() => {
                console.log('✅ Comprobando visibilidad:');
                console.log('📅 Fecha simple visible:', fechaSimple.style.display !== 'none');
                console.log('📅 Fecha rango visible:', fechaRango.style.display !== 'none');

                // Verificar que las fechas estén inicializadas
                const fechaInicio = document.getElementById('fechaEdicionInicio');
                const fechaFin = document.getElementById('fechaEdicionFin');

                if (fechaInicio && fechaFin) {
                    console.log('📅 Fecha inicio:', fechaInicio.value);
                    console.log('📅 Fecha fin:', fechaFin.value);
                }

                console.log('🎉 Prueba completada! Puedes probar la búsqueda manualmente.');
            }, 100);
        }
    }, 500);
};



// Función para probar el modal de eliminar fichajes
window.probarEliminarFichajes = function () {
    console.log('%c🗑️ Probando modal eliminar fichajes...', 'color: #dc3545; font-weight: bold');

    window.menuManager.mostrarModal('eliminar-fichajes');

    setTimeout(() => {
        console.log('✅ Modal abierto, verificando elementos...');

        const rangoCheckbox = document.getElementById('rangoFechasEliminar');
        const fechaSimple = document.querySelector('.fecha-simple-eliminacion');
        const fechaRango = document.querySelector('.fecha-rango-eliminacion');
        const formBuscar = document.getElementById('formBuscarFichajesEliminar');
        const accionesContainer = document.querySelector('.eliminar-acciones');

        console.log('🔲 Checkbox rango:', rangoCheckbox ? 'Encontrado' : 'NO encontrado');
        console.log('📅 Fecha simple:', fechaSimple ? 'Encontrada' : 'NO encontrada');
        console.log('📅 Fecha rango:', fechaRango ? 'Encontrada' : 'NO encontrada');
        console.log('📝 Formulario:', formBuscar ? 'Encontrado' : 'NO encontrado');
        console.log('🗑️ Acciones:', accionesContainer ? 'Encontradas' : 'NO encontradas');

        if (rangoCheckbox) {
            console.log('🔄 Activando rango de fechas...');
            rangoCheckbox.checked = true;
            rangoCheckbox.dispatchEvent(new Event('change'));

            setTimeout(() => {
                console.log('✅ Comprobando visibilidad:');
                console.log('📅 Fecha simple visible:', fechaSimple.style.display !== 'none');
                console.log('📅 Fecha rango visible:', fechaRango.style.display !== 'none');

                // Verificar que las fechas estén inicializadas
                const fechaInicio = document.getElementById('fechaEliminacionInicio');
                const fechaFin = document.getElementById('fechaEliminacionFin');

                if (fechaInicio && fechaFin) {
                    console.log('📅 Fecha inicio:', fechaInicio.value);
                    console.log('📅 Fecha fin:', fechaFin.value);
                }

                console.log('🎉 Prueba completada! Puedes buscar fichajes y usar los botones de eliminación.');
            }, 100);
        }
    }, 500);
};



// Función para probar el nuevo sistema de mensajes
window.probarMensajesPersonalizados = function () {
    console.log('%c💬 Probando sistema de mensajes personalizados...', 'color: #3498db; font-weight: bold');

    const menuManager = window.menuManager;

    setTimeout(() => {
        console.log('📢 Mostrando toast de éxito...');
        menuManager.mostrarToast('Operación completada con éxito', 'success');
    }, 500);

    setTimeout(() => {
        console.log('⚠️ Mostrando toast de advertencia...');
        menuManager.mostrarToast('Esto es una advertencia', 'warning');
    }, 1500);

    setTimeout(() => {
        console.log('❌ Mostrando toast de error...');
        menuManager.mostrarToast('Ha ocurrido un error', 'error');
    }, 2500);

    setTimeout(() => {
        console.log('ℹ️ Mostrando toast de información...');
        menuManager.mostrarToast('Información importante', 'info');
    }, 3500);

    setTimeout(async () => {
        console.log('❓ Mostrando modal de confirmación...');
        const resultado = await menuManager.mostrarConfirmacion(
            '¿Deseas continuar con esta acción?',
            'Confirmar Acción',
            'warning'
        );
        console.log('Resultado de confirmación:', resultado);
    }, 4500);

    setTimeout(async () => {
        console.log('💡 Mostrando modal de alerta...');
        await menuManager.mostrarAlerta(
            'Esta es una alerta informativa con el nuevo diseño.',
            'Información',
            'info'
        );
        console.log('Alerta cerrada');
    }, 6000);

    console.log('🎉 Secuencia de pruebas de mensajes iniciada');
};



// Debug para jsPDF
window.debugJsPDF = function () {
    console.log('🔍 === DEBUG jsPDF ===');
    console.log('window.jspdf:', typeof window.jspdf, window.jspdf);

    if (typeof window.jspdf !== 'undefined') {
        try {
            const { jsPDF } = window.jspdf;
            console.log('jsPDF constructor:', typeof jsPDF, jsPDF);

            const doc = new jsPDF();
            console.log('Documento de prueba creado:', doc);

            doc.text('Prueba de PDF', 10, 10);
            console.log('Texto añadido al documento');

            // Intentar guardar
            doc.save('test.pdf');
            console.log('✅ PDF de prueba guardado exitosamente');
        } catch (error) {
            console.error('❌ Error en prueba de jsPDF:', error);
        }
    } else {
        console.error('❌ jsPDF no está disponible');
    }
};

window.probarExportPDF = function () {
    console.log('🔍 === PRUEBA EXPORT PDF ===');
    if (window.menuManager) {
        // Crear datos de prueba
        const fichajesPrueba = [
            {
                employee: 'Test User',
                type: 'Entrada',
                timestamp: new Date().toISOString()
            }
        ];
        console.log('Datos de prueba:', fichajesPrueba);
        window.menuManager.exportarPDF(fichajesPrueba);
    }
};



// Función para completar salidas pendientes automáticamente
window.completarSalidasPendientes = function (empleado = null, hora = '18:00') {
    const menuManager = window.menuManager;
    if (!menuManager) {
        console.error('MenuManager no está disponible');
        return;
    }
    return menuManager.completarSalidasPendientes(empleado, hora);
};

// Función para diagnosticar el cálculo de horas
window.diagnosticarCalculoHoras = function () {
    const menuManager = window.menuManager;
    if (!menuManager) {
        console.error('MenuManager no está disponible');
        return;
    }
    return menuManager.diagnosticarCalculoHoras();
};

// Función para crear fichajes de prueba con pares completos
window.crearFichajesPrueba = function () {
    console.log('🧪 Creando fichajes de prueba con pares completos...');

    const menuManager = window.menuManager;
    const empleados = menuManager.obtenerEmpleados();

    if (!empleados || empleados.length === 0) {
        console.error('No hay empleados disponibles');
        return;
    }

    const fichajesPrueba = [];
    const hoy = new Date();

    // Crear fichajes para los últimos 3 días para el primer empleado
    for (let i = 0; i < 3; i++) {
        const fecha = new Date(hoy);
        fecha.setDate(fecha.getDate() - i);

        // Entrada a las 9:00
        const entrada = new Date(fecha);
        entrada.setHours(9, 0, 0, 0);

        // Salida a las 17:00 (8 horas después)
        const salida = new Date(fecha);
        salida.setHours(17, 0, 0, 0);

        fichajesPrueba.push({
            employee: empleados[0].name,
            type: 'Entrada',
            timestamp: entrada.toISOString()
        });

        fichajesPrueba.push({
            employee: empleados[0].name,
            type: 'Salida',
            timestamp: salida.toISOString()
        });

        console.log(`   ✅ Día ${i + 1}: ${fecha.toLocaleDateString('es-ES')} - 9:00 a 17:00 (8 horas)`);
    }

    // Guardar fichajes
    const fichajesExistentes = menuManager.obtenerFichajes();
    const todosFichajes = [...fichajesExistentes, ...fichajesPrueba];
    menuManager.guardarFichajes(todosFichajes);

    console.log(`✅ ${fichajesPrueba.length} fichajes de prueba creados (${fichajesPrueba.length / 2} pares completos)`);
    menuManager.mostrarMensaje(`Fichajes de prueba creados: ${fichajesPrueba.length / 2} días completos`, 'success');

    return fichajesPrueba;
};



// Función para crear copia de seguridad manual
window.crearCopiaManual = function () {
    const menuManager = window.menuManager;
    if (!menuManager) {
        console.error('MenuManager no está disponible');
        return;
    }
    return menuManager.crearCopiaManual();
};

// Función para mostrar la estructura organizada de backups
window.mostrarEstructuraBackups = function () {
    console.log('');
    console.log('📦 ═══════════════════════════════════════════════════════════════');
    console.log('🗂️ ESTRUCTURA ORGANIZADA DE BACKUPS');
    console.log('📦 ═══════════════════════════════════════════════════════════════');
    console.log('');

    console.log('📁 data/backups/');
    console.log('├── 📂 datos/         - Backups de localStorage (JSON)');
    console.log('│   ├── backup-completo-YYYY-MM-DD.json');
    console.log('│   ├── empleados-YYYY-MM-DD.json');
    console.log('│   ├── fichajes-YYYY-MM-DD.json');
    console.log('│   └── .gitkeep');
    console.log('├── 📂 sistema/       - Backups completos del proyecto');
    console.log('│   ├── sistema_YYYY-MM-DDTHH-MM-SS/');
    console.log('│   │   ├── backup_info.txt');
    console.log('│   │   ├── index.html');
    console.log('│   │   ├── styles.css');
    console.log('│   │   ├── js/');
    console.log('│   │   └── data/');
    console.log('│   └── .gitkeep');
    console.log('└── README.md         - Documentación del sistema');
    console.log('');

    console.log('💾 TIPOS DE BACKUP:');
    console.log('');
    console.log('📊 Backup de Datos (función 13):');
    console.log('   • Origen: localStorage del navegador');
    console.log('   • Formato: 3 archivos JSON');
    console.log('   • Contenido: Empleados + Fichajes + Metadatos');
    console.log('   • Frecuencia: Manual + Automático (cada 5 min)');
    console.log('');

    console.log('🌐 Backup del Sistema (función 14):');
    console.log('   • Origen: Proyecto completo');
    console.log('   • Formato: Carpeta con todos los archivos');
    console.log('   • Contenido: HTML + CSS + JS + Datos');
    console.log('   • Incluye: Backup de datos automáticamente');
    console.log('');

    console.log('🚀 COMANDOS RÁPIDOS:');
    console.log('   escribir(13)  - 💾 Backup de datos');
    console.log('   escribir(14)  - 🌐 Backup completo del sistema');
    console.log('   escribir(15)  - 📋 Ver esta estructura (actual)');
    console.log('');

    console.log('📋 VENTAJAS DE LA ORGANIZACIÓN:');
    console.log('   ✅ Backups separados por tipo');
    console.log('   ✅ Fácil localización de archivos');
    console.log('   ✅ Estructura predecible');
    console.log('   ✅ Documentación incluida');
    console.log('   ✅ Compatible con Git');
    console.log('');

    console.log('📦 ═══════════════════════════════════════════════════════════════');
    console.log('');

    return {
        estructura: 'mostrada',
        ubicacion: 'data/backups/',
        tipos: ['datos', 'sistema'],
        funciones: [13, 14, 15]
    };
};

// Función para crear backup completo del proyecto
window.crearBackupCompleto = async function () {
    console.log('🚀 Iniciando backup completo del proyecto...');
    console.log('');

    try {
        // Generar timestamp
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
        const backupName = `sistema_${timestamp}`;
        const rutaBackup = `data/backups/sistema/${backupName}`;

        console.log(`📁 Creando backup en: ${rutaBackup}`);
        console.log('⏳ Esto puede tomar unos segundos...');

        // Comandos del sistema para crear el backup organizado
        const comandos = [
            `mkdir -p ${rutaBackup}`,
            `cp -r . ${rutaBackup}/`,
            `rm -rf ${rutaBackup}/.git`,
            `echo "Backup creado: $(date)" > ${rutaBackup}/backup_info.txt`
        ];

        console.log('');
        console.log('💡 INSTRUCCIONES PARA CREAR EL BACKUP COMPLETO:');
        console.log('');
        console.log('1️⃣ Abre una terminal en el directorio del proyecto');
        console.log('2️⃣ Ejecuta los siguientes comandos:');
        console.log('');

        comandos.forEach((comando, index) => {
            console.log(`%c   ${comando}`, 'background: #f0f8f0; color: #2e7d32; font-family: monospace; padding: 4px; border-radius: 4px; font-size: 12px;');
        });

        console.log('');
        console.log('3️⃣ Verificar que se creó correctamente:');
        console.log(`%c   ls -la ${rutaBackup}`, 'background: #f0f8f0; color: #2e7d32; font-family: monospace; padding: 8px; border-radius: 4px;');
        console.log('');

        // También crear una copia de seguridad de datos del localStorage
        console.log('💾 Creando también backup de datos localStorage...');

        const menuManager = window.menuManager;
        if (menuManager) {
            await menuManager.crearCopiaManual();
            console.log('✅ Backup de datos localStorage creado en data/backups/datos/');
        }

        console.log('');
        console.log('📁 ESTRUCTURA DE BACKUPS ORGANIZADA:');
        console.log('   📂 data/backups/');
        console.log('   ├── 📂 datos/     - Backups de localStorage (JSON)');
        console.log('   └── 📂 sistema/   - Backups completos del proyecto');
        console.log(`       └── 📂 ${backupName}/  - Este backup`);
        console.log('');
        console.log('🎯 RESUMEN DEL BACKUP:');
        console.log(`📁 Ubicación: ${rutaBackup}`);
        console.log('📋 Incluye:');
        console.log('   • 🌐 Todos los archivos HTML, CSS, JS');
        console.log('   • 🔧 Configuración y versiones backup');
        console.log('   • 📊 Backup de datos localStorage por separado');
        console.log('   • 🎯 Menú interactivo y todas las funciones');
        console.log('   • 📝 Información del backup (backup_info.txt)');
        console.log('');
        console.log('✅ Instrucciones de backup organizadas mostradas correctamente');

        return {
            success: true,
            backupName: backupName,
            rutaBackup: rutaBackup,
            comandos: comandos
        };

    } catch (error) {
        console.error('❌ Error al preparar backup completo:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

// Función para ver la estructura de datos
window.verEstructuraDatos = function () {
    console.log('📊 === ESTRUCTURA DE DATOS EN LOCALSTORAGE ===');

    // Ver empleados
    const empleadosRaw = localStorage.getItem('employees');
    console.log('👥 Empleados (raw):', empleadosRaw);
    if (empleadosRaw) {
        try {
            const empleados = JSON.parse(empleadosRaw);
            console.log('👥 Empleados (parsed):', empleados);
            console.log('📊 Cantidad de empleados:', empleados?.employees?.length || empleados?.length || 0);
        } catch (e) {
            console.error('Error al parsear empleados:', e);
        }
    }

    // Ver fichajes
    const fichajesRaw = localStorage.getItem('fichajes');
    console.log('📋 Fichajes (raw):', fichajesRaw?.substring(0, 200) + '...');
    if (fichajesRaw) {
        try {
            const fichajes = JSON.parse(fichajesRaw);
            console.log('📊 Cantidad de fichajes:', fichajes.length);
            if (fichajes.length > 0) {
                console.log('📋 Primer fichaje:', fichajes[0]);
                console.log('📋 Último fichaje:', fichajes[fichajes.length - 1]);
            }
        } catch (e) {
            console.error('Error al parsear fichajes:', e);
        }
    }

    console.log('📊 === FIN ESTRUCTURA ===');
};

// ========================================
// FUNCIONES DE PRUEBA ADICIONALES
// ========================================

// Función para crear empleado desde consola
window.crearEmpleadoPrueba = function (nombre = null) {
    const menuManager = window.menuManager;
    if (!menuManager) {
        console.error('MenuManager no está disponible');
        return;
    }

    const nombreEmpleado = nombre || `Empleado Test ${Date.now()}`;
    console.log(`👤 Creando empleado: ${nombreEmpleado}`);

    // Simular formulario
    const formMock = {
        querySelector: (selector) => {
            if (selector === '#nombreEmpleado') {
                return {
                    value: nombreEmpleado,
                    trim: () => nombreEmpleado,
                    focus: () => console.log('Focus en nombre empleado')
                };
            }
        },
        reset: () => console.log('Form reset'),
    };

    return menuManager.crearEmpleado(formMock);
};

// Función para eliminar empleado por nombre
window.eliminarEmpleadoPorNombre = async function (nombre) {
    const menuManager = window.menuManager;
    if (!menuManager) {
        console.error('MenuManager no está disponible');
        return;
    }

    const empleados = await menuManager.obtenerEmpleados();
    const empleado = empleados.find(emp => emp.name.toLowerCase().includes(nombre.toLowerCase()));

    if (empleado) {
        console.log(`🗑️ Eliminando empleado: ${empleado.name} (ID: ${empleado.id})`);
        return menuManager.eliminarEmpleado(empleado.id);
    } else {
        console.error(`❌ No se encontró empleado con nombre: ${nombre}`);
        console.log('👥 Empleados disponibles:', empleados.map(e => e.name));
    }
};

// Función para crear fichaje específico
window.crearFichajePrueba = function (empleado, tipo = 'Entrada', fecha = null, hora = null) {
    const menuManager = window.menuManager;
    if (!menuManager) {
        console.error('MenuManager no está disponible');
        return;
    }

    const fechaFichaje = fecha ? new Date(fecha) : new Date();
    if (hora) {
        const [horas, minutos] = hora.split(':');
        fechaFichaje.setHours(parseInt(horas), parseInt(minutos), 0, 0);
    }

    console.log(`📝 Creando fichaje: ${empleado} - ${tipo} - ${fechaFichaje.toLocaleString('es-ES')}`);

    const fichajes = menuManager.obtenerFichajes();
    fichajes.push({
        employee: empleado,
        type: tipo,
        timestamp: fechaFichaje.toISOString()
    });

    menuManager.guardarFichajes(fichajes);
    console.log('✅ Fichaje creado exitosamente');
    return fichajes[fichajes.length - 1];
};

// Función para probar todas las exportaciones
window.probarTodasExportaciones = async function () {
    console.log('📤 Probando todas las exportaciones...');

    const menuManager = window.menuManager;
    if (!menuManager) {
        console.error('MenuManager no está disponible');
        return;
    }

    const fichajes = menuManager.obtenerFichajes();
    if (fichajes.length === 0) {
        console.log('⚠️ No hay fichajes para exportar, creando datos de prueba...');
        await crearFichajesPrueba();
    }

    console.log('📄 Probando exportación PDF...');
    setTimeout(() => {
        menuManager.exportarFichajes('pdf');
    }, 1000);

    console.log('📊 Probando exportación Excel...');
    setTimeout(() => {
        menuManager.exportarFichajes('excel');
    }, 2000);

    console.log('📋 Probando exportación CSV...');
    setTimeout(() => {
        menuManager.exportarFichajes('csv');
    }, 3000);

    console.log('✅ Todas las exportaciones iniciadas');
};

// Función para probar impresión de informes
window.probarImpresionInforme = async function (empleado = null, dias = 7) {
    console.log('🖨️ Probando impresión de informe...');

    const menuManager = window.menuManager;
    if (!menuManager) {
        console.error('MenuManager no está disponible');
        return;
    }

    const fechaFin = new Date();
    const fechaInicio = new Date();
    fechaInicio.setDate(fechaInicio.getDate() - dias);

    // Simular formulario de impresión
    const formMock = {
        querySelector: (selector) => {
            switch (selector) {
                case '#empleadoImprimir':
                    return { value: empleado || '' };
                case '#imprimirFechaInicio':
                    return { value: fechaInicio.toISOString().split('T')[0] };
                case '#imprimirFechaFin':
                    return { value: fechaFin.toISOString().split('T')[0] };
                default:
                    return null;
            }
        }
    };

    console.log(`📅 Generando informe desde ${fechaInicio.toLocaleDateString('es-ES')} hasta ${fechaFin.toLocaleDateString('es-ES')}`);
    return menuManager.consultarFichajesImprimir(formMock);
};

// Función para limpiar todos los datos
window.limpiarTodosLosDatos = async function () {
    console.log('🧹 Limpiando todos los datos...');

    const confirmacion = confirm('⚠️ ¿ESTÁS SEGURO? Esto eliminará TODOS los empleados y fichajes. ¿Continuar?');
    if (!confirmacion) {
        console.log('❌ Operación cancelada');
        return;
    }

    localStorage.removeItem('employees');
    localStorage.removeItem('fichajes');
    localStorage.removeItem('ultimaCopiaSeguridad');

    console.log('✅ Todos los datos eliminados');

    if (window.menuManager) {
        window.menuManager.actualizarTablaFichajes();
        window.menuManager.actualizarListaEmpleados();
        window.menuManager.actualizarTodosLosSelectores();
    }

    location.reload();
};

// Función para generar datos de prueba completos
window.generarDatosPruebaCompletos = async function () {
    console.log('🏗️ Generando datos de prueba completos...');

    const menuManager = window.menuManager;
    if (!menuManager) {
        console.error('MenuManager no está disponible');
        return;
    }

    // Crear empleados de prueba
    const nombresEmpleados = [
        'Juan Pérez',
        'María García',
        'Carlos López',
        'Ana Martínez',
        'Luis Rodríguez'
    ];

    console.log('👥 Creando empleados de prueba...');
    for (const nombre of nombresEmpleados) {
        await crearEmpleadoPrueba(nombre);
        await new Promise(resolve => setTimeout(resolve, 100)); // Pequeña pausa
    }

    // Crear fichajes de prueba para los últimos 30 días
    console.log('📋 Creando fichajes de prueba...');
    const empleados = await menuManager.obtenerEmpleados();
    const fichajes = [];

    for (let dia = 0; dia < 30; dia++) {
        const fecha = new Date();
        fecha.setDate(fecha.getDate() - dia);

        // Saltar fines de semana
        if (fecha.getDay() === 0 || fecha.getDay() === 6) continue;

        for (const empleado of empleados) {
            // 80% de probabilidad de que el empleado haya trabajado ese día
            if (Math.random() > 0.2) {
                // Hora de entrada aleatoria entre 8:00 y 9:30
                const horaEntrada = 8 + Math.random() * 1.5;
                const minutosEntrada = Math.floor((horaEntrada % 1) * 60);

                const entrada = new Date(fecha);
                entrada.setHours(Math.floor(horaEntrada), minutosEntrada, 0, 0);

                // Hora de salida aleatoria entre 17:00 y 18:30
                const horaSalida = 17 + Math.random() * 1.5;
                const minutosSalida = Math.floor((horaSalida % 1) * 60);

                const salida = new Date(fecha);
                salida.setHours(Math.floor(horaSalida), minutosSalida, 0, 0);

                fichajes.push({
                    employee: empleado.name,
                    type: 'Entrada',
                    timestamp: entrada.toISOString()
                });

                fichajes.push({
                    employee: empleado.name,
                    type: 'Salida',
                    timestamp: salida.toISOString()
                });
            }
        }
    }

    // Ordenar fichajes por fecha
    fichajes.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    // Guardar fichajes
    menuManager.guardarFichajes(fichajes);

    console.log(`✅ Datos de prueba generados:`);
    console.log(`   👥 ${empleados.length} empleados`);
    console.log(`   📋 ${fichajes.length} fichajes (${fichajes.length / 2} pares completos)`);
    console.log(`   📅 Últimos 30 días laborables`);

    // Actualizar vistas
    menuManager.actualizarTablaFichajes();
    menuManager.actualizarListaEmpleados();
    menuManager.actualizarTodosLosSelectores();

    return { empleados: empleados.length, fichajes: fichajes.length };
};

// Función para probar todas las validaciones
window.probarValidaciones = function () {
    console.log('🔍 Probando todas las validaciones...');

    const pruebas = [
        () => crearEmpleadoPrueba(''), // Nombre vacío
        () => crearEmpleadoPrueba('   '), // Solo espacios
        () => crearEmpleadoPrueba('Juan Pérez'), // Nombre duplicado (si existe)
        () => crearFichajePrueba('', 'Entrada'), // Empleado vacío
        () => crearFichajePrueba('EmpleadoInexistente', 'Entrada'), // Empleado que no existe
        () => eliminarEmpleadoPorNombre(''), // Nombre vacío para eliminar
        () => eliminarEmpleadoPorNombre('NoExiste'), // Empleado que no existe
    ];

    pruebas.forEach((prueba, index) => {
        console.log(`🧪 Prueba ${index + 1}:`);
        try {
            prueba();
        } catch (error) {
            console.log(`   ❌ Error esperado: ${error.message}`);
        }
    });

    console.log('✅ Pruebas de validación completadas');
};

// Función para probar responsive design
window.probarResponsiveDesign = function () {
    console.log('📱 Probando diseño responsive...');

    const tamaños = [
        { width: 320, height: 568, name: 'iPhone SE' },
        { width: 375, height: 667, name: 'iPhone 8' },
        { width: 768, height: 1024, name: 'iPad' },
        { width: 1024, height: 768, name: 'iPad Landscape' },
        { width: 1920, height: 1080, name: 'Desktop FHD' }
    ];

    let indice = 0;

    function cambiarTamaño() {
        if (indice >= tamaños.length) {
            console.log('✅ Prueba responsive completada');
            return;
        }

        const tamaño = tamaños[indice];
        console.log(`📐 Probando: ${tamaño.name} (${tamaño.width}x${tamaño.height})`);

        // Cambiar tamaño de ventana
        window.resizeTo(tamaño.width, tamaño.height);

        // Abrir modal para probar
        setTimeout(() => {
            window.menuManager.mostrarModal('fichaje-manual');

            setTimeout(() => {
                window.menuManager.cerrarModal();
                indice++;
                cambiarTamaño();
            }, 2000);
        }, 1000);
    }

    cambiarTamaño();
};

// Función para simular errores
window.simularErrores = function () {
    console.log('⚠️ Simulando errores para probar manejo...');

    const menuManager = window.menuManager;
    if (!menuManager) {
        console.error('MenuManager no está disponible');
        return;
    }

    // Simular error de localStorage lleno
    console.log('💾 Simulando localStorage lleno...');
    const datosOriginales = localStorage.getItem('fichajes');
    try {
        // Intentar llenar localStorage
        const datosGrandes = 'x'.repeat(5000000); // 5MB de datos
        localStorage.setItem('test_error', datosGrandes);
    } catch (error) {
        console.log('   ✅ Error de localStorage capturado:', error.message);
    } finally {
        localStorage.removeItem('test_error');
    }

    // Simular datos corruptos
    console.log('🔧 Simulando datos corruptos...');
    localStorage.setItem('employees', 'datos_invalidos{');
    try {
        menuManager.obtenerEmpleados();
    } catch (error) {
        console.log('   ✅ Error de datos corruptos capturado:', error.message);
    } finally {
        if (datosOriginales) {
            localStorage.setItem('fichajes', datosOriginales);
        }
    }

    console.log('✅ Simulación de errores completada');
};

// Función para probar toda la funcionalidad del sistema
window.pruebaCompleta = async function () {
    console.log('🚀 === INICIANDO PRUEBA COMPLETA DEL SISTEMA ===');

    const pasos = [
        { nombre: 'Verificar datos iniciales', funcion: () => verEstructuraDatos() },
        { nombre: 'Generar datos de prueba', funcion: () => generarDatosPruebaCompletos() },
        { nombre: 'Probar validaciones', funcion: () => probarValidaciones() },
        { nombre: 'Probar exportaciones', funcion: () => probarTodasExportaciones() },
        { nombre: 'Probar impresión', funcion: () => probarImpresionInforme() },
        { nombre: 'Probar mensajes', funcion: () => probarMensajesPersonalizados() },
        { nombre: 'Probar modales', funcion: () => probarModalResponsive() },
        { nombre: 'Crear copia de seguridad', funcion: () => crearCopiaManual() },
        { nombre: 'Simular errores', funcion: () => simularErrores() },
        { nombre: 'Verificar datos finales', funcion: () => verEstructuraDatos() }
    ];

    for (let i = 0; i < pasos.length; i++) {
        const paso = pasos[i];
        console.log(`\n📋 Paso ${i + 1}/${pasos.length}: ${paso.nombre}`);

        try {
            await paso.funcion();
            console.log(`   ✅ ${paso.nombre} completado`);
        } catch (error) {
            console.error(`   ❌ Error en ${paso.nombre}:`, error);
        }

        // Pausa entre pasos
        await new Promise(resolve => setTimeout(resolve, 2000));
    }

    console.log('\n🎉 === PRUEBA COMPLETA FINALIZADA ===');
};

// ========================================
// MENÚ INTERACTIVO DE COMANDOS
// ========================================

window.menuComandos = function () {
    console.clear();
    console.log('');
    console.log('🎯 ═══════════════════════════════════════════════════════════════');
    console.log('🚀 MENÚ INTERACTIVO DE FUNCIONES DE PRUEBA - Mi Casita de Patch');
    console.log('🎯 ═══════════════════════════════════════════════════════════════');
    console.log('');

    const funciones = [
        // DATOS Y ESTRUCTURA
        {
            categoria: '📊 DATOS Y ESTRUCTURA', funciones: [
                { num: 1, nombre: 'verEstructuraDatos()', desc: 'Ver estructura de datos en localStorage', funcion: verEstructuraDatos },
                { num: 2, nombre: 'verificarDatos()', desc: 'Verificar datos detallados del sistema', funcion: verificarDatos }
            ]
        },

        // EMPLEADOS
        {
            categoria: '👥 EMPLEADOS', funciones: [
                { num: 3, nombre: 'crearEmpleadoPrueba("Nombre")', desc: 'Crear empleado de prueba', funcion: () => crearEmpleadoPrueba(`Test${Date.now()}`) },
                {
                    num: 4, nombre: 'eliminarEmpleadoPorNombre("Nombre")', desc: 'Eliminar empleado por nombre', funcion: () => {
                        console.log('💡 Ejemplo: eliminarEmpleadoPorNombre("Test")');
                        console.log('Escribe: ejecutar(4, "NombreEmpleado")');
                    }
                }
            ]
        },

        // FICHAJES
        {
            categoria: '📋 FICHAJES', funciones: [
                {
                    num: 5, nombre: 'crearFichajePrueba()', desc: 'Crear fichaje específico', funcion: () => {
                        console.log('💡 Ejemplo: crearFichajePrueba("Juan", "Entrada", "2024-01-15", "09:00")');
                        console.log('Escribe: ejecutar(5, "Empleado", "Entrada", "2024-01-15", "09:00")');
                    }
                },
                { num: 6, nombre: 'crearFichajesPrueba()', desc: 'Crear fichajes de prueba básicos', funcion: crearFichajesPrueba },
                { num: 7, nombre: 'probarFichajeFuturo()', desc: 'Crear fichaje futuro programáticamente', funcion: probarFichajeFuturo },
                { num: 8, nombre: 'completarSalidasPendientes()', desc: 'Completar salidas que faltan', funcion: completarSalidasPendientes }
            ]
        },

        // EXPORTACIÓN E IMPRESIÓN
        {
            categoria: '📤 EXPORTACIÓN E IMPRESIÓN', funciones: [
                { num: 9, nombre: 'probarTodasExportaciones()', desc: 'Probar PDF, Excel y CSV automáticamente', funcion: probarTodasExportaciones },
                { num: 10, nombre: 'probarImpresionInforme()', desc: 'Probar impresión de informes', funcion: () => probarImpresionInforme() },
                { num: 11, nombre: 'debugJsPDF()', desc: 'Verificar si jsPDF está funcionando', funcion: debugJsPDF },
                { num: 12, nombre: 'probarExportPDF()', desc: 'Probar exportación PDF con datos de prueba', funcion: probarExportPDF }
            ]
        },

        // COPIAS DE SEGURIDAD
        {
            categoria: '💾 COPIAS DE SEGURIDAD', funciones: [
                { num: 13, nombre: 'crearCopiaManual()', desc: 'Crear copia de seguridad de datos', funcion: crearCopiaManual },
                { num: 14, nombre: 'crearBackupCompleto()', desc: 'Crear backup completo del proyecto', funcion: crearBackupCompleto },
                { num: 15, nombre: 'mostrarEstructuraBackups()', desc: 'Ver estructura organizada de backups', funcion: mostrarEstructuraBackups }
            ]
        },

        // PRUEBAS DE INTERFAZ
        {
            categoria: '🧪 PRUEBAS DE INTERFAZ', funciones: [
                { num: 16, nombre: 'probarModalResponsive()', desc: 'Probar todos los modales responsive', funcion: probarModalResponsive },
                { num: 17, nombre: 'probarModalFichajeFuturo()', desc: 'Probar modal con fecha futura', funcion: probarModalFichajeFuturo },
                { num: 18, nombre: 'probarCentradoModal()', desc: 'Verificar centrado de modales', funcion: probarCentradoModal },
                { num: 19, nombre: 'testCentrado()', desc: 'Test rápido de centrado', funcion: testCentrado },
                { num: 20, nombre: 'testSimple()', desc: 'Test simple de centrado', funcion: testSimple },
                { num: 21, nombre: 'probarResponsiveDesign()', desc: 'Probar diseño responsive', funcion: probarResponsiveDesign }
            ]
        },

        // VALIDACIONES
        {
            categoria: '✅ PRUEBAS DE VALIDACIONES', funciones: [
                { num: 22, nombre: 'probarValidaciones()', desc: 'Probar todas las validaciones del sistema', funcion: probarValidaciones },
                { num: 23, nombre: 'probarMensajesPersonalizados()', desc: 'Probar sistema de mensajes y toasts', funcion: probarMensajesPersonalizados }
            ]
        },

        // CÁLCULO DE HORAS
        {
            categoria: '⏰ CÁLCULO DE HORAS', funciones: [
                { num: 24, nombre: 'diagnosticarCalculoHoras()', desc: 'Diagnosticar problemas con cálculo de horas', funcion: diagnosticarCalculoHoras },
                { num: 25, nombre: 'probarCalculoHoras()', desc: 'Probar cálculo de horas trabajadas', funcion: probarCalculoHoras }
            ]
        },

        // CONTADOR DE TIEMPO EN VIVO
        {
            categoria: '🕐 CONTADOR DE TIEMPO EN VIVO', funciones: [
                { num: 32, nombre: 'probarContadorTiempo()', desc: 'Probar contador de tiempo acumulado con fichaje de 30 min', funcion: () => window.probarContadorTiempo && window.probarContadorTiempo() },
                { num: 33, nombre: 'verFichajes()', desc: 'Ver todos los fichajes actuales en localStorage', funcion: () => window.verFichajes && window.verFichajes() },
                { num: 34, nombre: 'testCalculoDirecto()', desc: 'Test directo de función de cálculo de tiempo', funcion: testCalculoDirecto }
            ]
        },

        // SISTEMA DE AUTENTICACIÓN
        {
            categoria: '🔐 SISTEMA DE AUTENTICACIÓN', funciones: [
                { num: 26, nombre: 'mostrarUsuarios()', desc: 'Ver todos los usuarios y contraseñas del sistema', funcion: () => window.mostrarUsuarios && window.mostrarUsuarios() },
                {
                    num: 27, nombre: 'crearUsuario()', desc: 'Crear nuevo usuario del sistema', funcion: () => {
                        console.log('💡 Uso: ejecutar(27, "username", "Nombre Completo", "role", "password")');
                        console.log('📝 Ejemplo: ejecutar(27, "juan", "Juan Pérez", "employee", "123456")');
                        console.log('🎯 Roles: "admin" o "employee"');
                    }
                },
                {
                    num: 28, nombre: 'cambiarPassword()', desc: 'Cambiar contraseña de usuario', funcion: () => {
                        console.log('💡 Uso: ejecutar(28, "username", "nuevaPassword")');
                        console.log('📝 Ejemplo: ejecutar(28, "juan", "654321")');
                    }
                },
                { num: 29, nombre: 'cerrarSesion()', desc: 'Cerrar sesión actual', funcion: () => window.authSystem && window.authSystem.logout() }
            ]
        },

        // FECHAS Y RANGOS
        {
            categoria: '🗓️ FECHAS Y RANGOS', funciones: [
                { num: 41, nombre: 'probarRangoFechasEdicion()', desc: 'Probar edición con rango de fechas', funcion: probarRangoFechasEdicion }
            ]
        },

        // ELIMINACIÓN
        {
            categoria: '🗑️ ELIMINACIÓN', funciones: [
                { num: 42, nombre: 'probarEliminarFichajes()', desc: 'Probar eliminación masiva de fichajes', funcion: probarEliminarFichajes }
            ]
        },

        // GENERACIÓN Y LIMPIEZA
        {
            categoria: '🏗️ GENERACIÓN Y LIMPIEZA DE DATOS', funciones: [
                { num: 43, nombre: 'generarDatosPruebaCompletos()', desc: 'Generar datos completos (5 empleados + 30 días)', funcion: generarDatosPruebaCompletos },
                { num: 44, nombre: 'limpiarTodosLosDatos()', desc: 'Limpiar TODOS los datos (con confirmación)', funcion: limpiarTodosLosDatos }
            ]
        },

        // SIMULACIÓN DE ERRORES
        {
            categoria: '⚠️ SIMULACIÓN DE ERRORES', funciones: [
                { num: 45, nombre: 'simularErrores()', desc: 'Simular errores para probar manejo', funcion: simularErrores }
            ]
        },

        // PRUEBAS AUTOMÁTICAS
        {
            categoria: '🚀 PRUEBAS AUTOMÁTICAS COMPLETAS', funciones: [
                { num: 46, nombre: 'pruebaCompleta()', desc: 'EJECUTAR TODAS LAS PRUEBAS AUTOMÁTICAMENTE', funcion: pruebaCompleta }
            ]
        }
    ];

    // Mostrar el menú
    funciones.forEach(categoria => {
        console.log(`%c${categoria.categoria}`, 'color: #4CAF50; font-weight: bold; font-size: 14px;');
        categoria.funciones.forEach(func => {
            console.log(`   ${func.num}. ${func.nombre} - ${func.desc}`);
        });
        console.log('');
    });

    console.log('🎯 ═══════════════════════════════════════════════════════════════');
    console.log('');
    console.log('💡 CÓMO USAR EL MENÚ:');
    console.log('   • Para ejecutar una función: escribir(NÚMERO)');
    console.log('   • Ejemplo: escribir(28) - Ejecuta generarDatosPruebaCompletos()');
    console.log('   • Para funciones con parámetros: ejecutar(NÚMERO, "param1", "param2")');
    console.log('   • Ejemplo: ejecutar(4, "Juan") - Elimina empleado Juan');
    console.log('');
    console.log('🔄 COMANDOS ESPECIALES:');
    console.log('   • menu() - Mostrar este menú nuevamente');
    console.log('   • ayuda(NÚMERO) - Ver ayuda específica de una función');
    console.log('   • limpiar() - Limpiar consola');
    console.log('');

    // Crear función para ejecutar por número
    window.escribir = function (numero) {
        const todasFunciones = [];
        funciones.forEach(cat => {
            todasFunciones.push(...cat.funciones);
        });

        const funcionElegida = todasFunciones.find(f => f.num === numero);
        if (funcionElegida) {
            console.log(`🚀 Ejecutando: ${funcionElegida.nombre}`);
            console.log(`📝 ${funcionElegida.desc}`);
            console.log('');
            try {
                funcionElegida.funcion();
            } catch (error) {
                console.error('❌ Error al ejecutar función:', error);
            }
        } else {
            console.error(`❌ Función ${numero} no encontrada. Usa menu() para ver opciones disponibles.`);
        }
    };

    // Función para ejecutar con parámetros
    window.ejecutar = function (numero, ...parametros) {
        const todasFunciones = [];
        funciones.forEach(cat => {
            todasFunciones.push(...cat.funciones);
        });

        const funcionElegida = todasFunciones.find(f => f.num === numero);
        if (funcionElegida) {
            console.log(`🚀 Ejecutando: ${funcionElegida.nombre} con parámetros:`, parametros);
            console.log(`📝 ${funcionElegida.desc}`);
            console.log('');
            try {
                // Ejecutar funciones específicas con parámetros
                switch (numero) {
                    case 3: // crearEmpleadoPrueba
                        crearEmpleadoPrueba(parametros[0]);
                        break;
                    case 4: // eliminarEmpleadoPorNombre
                        eliminarEmpleadoPorNombre(parametros[0]);
                        break;
                    case 5: // crearFichajePrueba
                        crearFichajePrueba(parametros[0], parametros[1], parametros[2], parametros[3]);
                        break;
                    case 10: // probarImpresionInforme
                        probarImpresionInforme(parametros[0], parametros[1]);
                        break;
                    case 27: // crearUsuario
                        window.crearUsuario && window.crearUsuario(parametros[0], parametros[1], parametros[2], parametros[3]);
                        break;
                    case 28: // cambiarPassword
                        window.cambiarPassword && window.cambiarPassword(parametros[0], parametros[1]);
                        break;
                    default:
                        funcionElegida.funcion();
                }
            } catch (error) {
                console.error('❌ Error al ejecutar función:', error);
            }
        } else {
            console.error(`❌ Función ${numero} no encontrada. Usa menu() para ver opciones disponibles.`);
        }
    };

    // Función de ayuda
    window.ayuda = function (numero) {
        const todasFunciones = [];
        funciones.forEach(cat => {
            todasFunciones.push(...cat.funciones);
        });

        const funcionElegida = todasFunciones.find(f => f.num === numero);
        if (funcionElegida) {
            console.log(`🔍 AYUDA - Función ${numero}:`);
            console.log(`📝 Nombre: ${funcionElegida.nombre}`);
            console.log(`📋 Descripción: ${funcionElegida.desc}`);
            console.log('');

            // Ayuda específica para funciones con parámetros
            switch (numero) {
                case 3:
                    console.log('💡 Uso: ejecutar(3, "NombreEmpleado")');
                    console.log('📝 Ejemplo: ejecutar(3, "Ana García")');
                    break;
                case 4:
                    console.log('💡 Uso: ejecutar(4, "NombreEmpleado")');
                    console.log('📝 Ejemplo: ejecutar(4, "Ana García")');
                    break;
                case 5:
                    console.log('💡 Uso: ejecutar(5, "Empleado", "Tipo", "Fecha", "Hora")');
                    console.log('📝 Ejemplo: ejecutar(5, "Ana García", "Entrada", "2024-01-15", "09:00")');
                    break;
                case 10:
                    console.log('💡 Uso: ejecutar(10, "Empleado", días)');
                    console.log('📝 Ejemplo: ejecutar(10, "Ana García", 7)');
                    break;
                case 27:
                    console.log('💡 Uso: ejecutar(27, "username", "Nombre Completo", "role", "password")');
                    console.log('📝 Ejemplo: ejecutar(27, "juan", "Juan Pérez", "employee", "123456")');
                    console.log('🎯 Roles disponibles: "admin" o "employee"');
                    break;
                case 28:
                    console.log('💡 Uso: ejecutar(28, "username", "nuevaPassword")');
                    console.log('📝 Ejemplo: ejecutar(28, "juan", "654321")');
                    console.log('⚠️ La contraseña debe tener exactamente 6 dígitos');
                    break;
                default:
                    console.log('💡 Uso: escribir(' + numero + ')');
            }
        } else {
            console.error(`❌ Función ${numero} no encontrada.`);
        }
        console.log('');
    };

    // Función para mostrar el menú nuevamente
    window.menu = function () {
        menuComandos();
    };

    // Función para limpiar consola
    window.limpiar = function () {
        console.clear();
        console.log('✨ Consola limpiada. Escribe menu() para ver las opciones.');
    };

    console.log('✅ Menú cargado correctamente. ¡Elige una opción!');
    console.log('');

    return '🎯 Menú interactivo listo. Escribe escribir(NÚMERO) para ejecutar una función.';
};

// Función adicional para test directo del cálculo
function testCalculoDirecto() {
    console.log('🧪 === TEST DIRECTO DE CÁLCULO DE TIEMPO ===');

    if (!window.calcularTiempoAcumulado) {
        console.error('❌ Función calcularTiempoAcumulado no está disponible');
        return;
    }

    const ahora = new Date();
    const hace1Hora = new Date(ahora.getTime() - (60 * 60 * 1000));

    const fichajesPrueba = [
        {
            employee: 'TestDirecto',
            type: 'Entrada',
            timestamp: hace1Hora.toISOString()
        }
    ];

    console.log('📊 Datos de prueba:');
    console.log('   - Empleado: TestDirecto');
    console.log('   - Entrada:', hace1Hora.toLocaleString('es-ES'));
    console.log('   - Ahora:', ahora.toLocaleString('es-ES'));
    console.log('   - Diferencia esperada: ~60 minutos');

    const resultado = window.calcularTiempoAcumulado('TestDirecto', ahora, fichajesPrueba);

    console.log('🎯 Resultado del cálculo:', resultado);
    console.log('🧪 === FIN TEST DIRECTO ===');
}

// Ejecutar el menú automáticamente al cargar
menuComandos();

const oldMostrarModal = window.menuManager?.mostrarModal;
window.menuManager.mostrarModal = function (action) {
    const result = oldMostrarModal.call(this, action);
    if (action === 'exportarEmail') {
        // Rellenar empleados
        const select = document.getElementById('usuarioExportar');
        if (select) {
            select.innerHTML = '<option value="">Todos los empleados</option>';
            if (typeof this.cargarEmpleadosEnSelect === 'function') {
                this.cargarEmpleadosEnSelect('usuarioExportar');
            } else {
                const empleadosRaw = localStorage.getItem('employees');
                if (empleadosRaw) {
                    try {
                        const empleadosData = JSON.parse(empleadosRaw);
                        if (empleadosData.employees) {
                            empleadosData.employees.forEach(emp => {
                                select.innerHTML += `<option value="${emp.name}">${emp.name}</option>`;
                            });
                        }
                    } catch { }
                }
            }
        }
        // Fechas por defecto
        const hoy = new Date();
        const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
        const fechaInicio = document.getElementById('fechaInicioExportar');
        const fechaFin = document.getElementById('fechaFinExportar');
        if (fechaInicio) fechaInicio.valueAsDate = inicioMes;
        if (fechaFin) fechaFin.valueAsDate = hoy;
    }
    return result;
};
