class MenuManager {
    constructor() {
        this.bindEvents();
        this.initializeToastContainer();
    }

    //region UI Components
    initializeToastContainer() {
        if (!document.querySelector('.toast-container')) {
            const container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }
    }

    mostrarToast(mensaje, tipo = 'info', duracion = 4000) {
        const container = document.querySelector('.toast-container');
        if (!container) return;
        const toast = document.createElement('div');
        toast.className = `toast ${tipo}`;
        const icono = {
            success: 'fa-check-circle',
            error: 'fa-times-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle',
        }[tipo];
        toast.innerHTML = `<div class="toast-icon"><i class="fas ${icono}"></i></div><div class="toast-text">${mensaje}</div><button class="toast-close">&times;</button>`;
        toast
            .querySelector('.toast-close')
            .addEventListener('click', () => this.cerrarToast(toast));
        container.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => this.cerrarToast(toast), duracion);
    }

    cerrarToast(toastElement) {
        toastElement.classList.remove('show');
        setTimeout(() => toastElement.remove(), 300);
    }

    async mostrarConfirmacion(mensaje, titulo = '¿Confirmar acción?') {
        return new Promise((resolve) => {
            const modalOverlay = document.createElement('div');
            modalOverlay.className = 'modal-mensaje show';
            modalOverlay.innerHTML = `
                <div class="modal-mensaje-content">
                    <div class="modal-mensaje-title">${titulo}</div>
                    <div class="modal-mensaje-text">${mensaje}</div>
                    <div class="modal-mensaje-buttons">
                        <button class="btn btn-cancel">Cancelar</button>
                        <button class="btn btn-confirm">Confirmar</button>
                    </div>
                </div>
            `;
            modalOverlay.querySelector('.btn-confirm').onclick = () => {
                modalOverlay.remove();
                resolve(true);
            };
            modalOverlay.querySelector('.btn-cancel').onclick = () => {
                modalOverlay.remove();
                resolve(false);
            };
            document.body.appendChild(modalOverlay);
        });
    }
    //endregion

    //region API Communication
    async apiFetch(endpoint, options = {}) {
        const token = window.authSystem.getToken();
        const headers = {
            Authorization: `Bearer ${token}`,
            ...options.headers,
        };
        if (!(options.body instanceof FormData))
            headers['Content-Type'] = 'application/json';
        const response = await fetch(`http://localhost:3001/api${endpoint}`, {
            ...options,
            headers,
        });
        if (!response.ok) {
            const errorData = await response
                .json()
                .catch(() => ({ error: 'Error desconocido' }));
            throw new Error(errorData.error || `Error ${response.status}`);
        }
        if (
            response.status === 204 ||
            response.headers.get('content-length') === '0'
        )
            return null;
        return response.json();
    }
    //endregion

    bindEvents() {
        document.body.addEventListener('click', (e) => {
            const menuBtn = e.target.closest('.menu-btn');
            if (menuBtn && !menuBtn.disabled)
                this.showModal(menuBtn.dataset.action);
        });
    }

    async showModal(action) {
        const modalConfig = this.getModalConfig(action);
        if (!modalConfig) return;

        // Usar el nuevo ModalManager
        ModalManager.show(
            modalConfig.title,
            modalConfig.content,
            () => {
                if (modalConfig.init) {
                    modalConfig.init.call(this);
                }
            }
        );
    }

    async populateUserSelect(selectId, includeAllOption = false) {
        const select = document.getElementById(selectId);
        if (!select) return;
        const users = await this.apiFetch('/users');
        select.innerHTML = '';
        if (includeAllOption)
            select.innerHTML += '<option value="">Todos</option>';
        users.forEach((user) => {
            select.innerHTML += `<option value="${user.id}">${user.name}</option>`;
        });
    }

    //region Modal Definitions
    getModalConfig(action) {
        const configs = {
            'crear-empleado': {
                title: 'Gestionar Empleados',
                content: `
                    <form id="formNuevoEmpleado">
                        <div class="form-group"><label for="username">Nombre de Usuario:</label><input type="text" id="username" required></div>
                        <div class="form-group"><label for="name">Nombre Completo:</label><input type="text" id="name" required></div>
                        <div class="form-group"><label for="password">Contraseña (6 dígitos):</label><input type="password" id="password" required pattern="[0-9]{6}" maxlength="6"></div>
                        <div class="form-group"><label for="role">Rol:</label><select id="role"><option value="employee">Empleado</option><option value="admin">Administrador</option></select></div>
                        <button type="submit" class="btn">Crear Usuario</button>
                    </form>
                    <hr style="margin: 2rem 0;">
                    <h4>Usuarios Actuales</h4>
                    <div id="listaEmpleados"></div>
                `,
                init: this.initGestionarEmpleados,
            },
            'fichaje-manual': {
                title: 'Registrar Fichaje Manual',
                content: `
                    <form id="formFichajeManual">
                        <div class="form-group"><label for="empleadoManual">Empleado:</label><select id="empleadoManual" required></select></div>
                        <div class="form-group"><label for="tipoFichaje">Tipo:</label><select id="tipoFichaje" required><option value="entrada">Entrada</option><option value="salida">Salida</option></select></div>
                        <div class="form-group"><label for="fichajeManualFecha">Fecha y Hora:</label><input type="datetime-local" id="fichajeManualFecha" required></div>
                        <button type="submit" class="btn">Registrar</button>
                    </form>
                `,
                init: this.initFichajeManual,
            },
            'ver-fichajes': {
                title: 'Consultar Mis Fichajes',
                content: `
                    <form id="form-ver-fichajes">
                        <div class="form-group"><label>Desde:</label><input type="date" id="ver-fecha-inicio" required></div>
                        <div class="form-group"><label>Hasta:</label><input type="date" id="ver-fecha-fin" required></div>
                        <button type="submit" class="btn">Consultar</button>
                    </form>
                    <div id="resultados-fichajes" style="margin-top: 1.5rem;"></div>
                `,
                init: this.initVerFichajes,
            },
            'editar-fichajes': {
                title: 'Editar Fichajes',
                content: `
                    <form id="form-search-fichajes">
                        <div class="form-group"><label>Empleado:</label><select id="user-filter"><option value="">Todos</option></select></div>
                        <div class="form-group"><label>Fecha:</label><input type="date" id="date-filter"></div>
                        <button type="submit" class="btn">Buscar</button>
                    </form>
                    <div id="fichajes-list" style="margin-top: 1.5rem;"></div>
                `,
                init: this.initEditarFichajes,
            },
            'eliminar-fichajes': {
                title: 'Eliminar Fichajes en Bloque',
                content: `
                    <form id="form-eliminar-fichajes">
                        <p>Busque los fichajes que desea eliminar. Esta acción no se puede deshacer.</p>
                        <div class="form-group"><label>Empleado:</label><select id="user-filter"><option value="">Todos</option></select></div>
                        <div class="form-group"><label>Desde:</label><input type="date" id="date-start" required></div>
                        <div class="form-group"><label>Hasta:</label><input type="date" id="date-end" required></div>
                        <button type="submit" class="btn">Buscar Fichajes a Eliminar</button>
                    </form>
                    <div id="fichajes-eliminar-list" style="margin-top: 1.5rem;"></div>
                `,
                init: this.initEliminarFichajes,
            },
            exportar: {
                title: 'Informes y Exportación',
                content: `
                    <form id="form-informe">
                        <div class="form-group"><label>Empleado:</label><select id="report-user-filter"><option value="">Todos</option></select></div>
                        <div class="form-group"><label>Desde:</label><input type="date" id="report-date-start" required></div>
                        <div class="form-group"><label>Hasta:</label><input type="date" id="report-date-end" required></div>
                        <button type="submit" class="btn">Generar Informe</button>
                    </form>
                    <div id="report-results" style="display:none; margin-top: 1.5rem;">
                        <h4>Resultados</h4>
                        <div id="report-summary"></div>
                        <div id="report-actions" style="display:flex; gap:1rem; margin:1rem 0;">
                            <button class="btn" id="export-pdf">Exportar PDF</button>
                            <button class="btn" id="export-excel">Exportar Excel</button>
                            <button class="btn" id="imprimir-informe">Imprimir</button>
                        </div>
                        <div id="report-data-preview"></div>
                    </div>
                `,
                init: this.initInformes,
            },
        };
        configs.imprimir = configs.exportar; // Ambos botones abren el mismo modal
        return configs[action];
    }

    async initGestionarEmpleados() {
        const form = document.getElementById('formNuevoEmpleado');
        form.onsubmit = async (e) => {
            e.preventDefault();
            const body = JSON.stringify({
                username: form.username.value,
                name: form.name.value,
                password: form.password.value,
                role: form.role.value,
            });
            try {
                await this.apiFetch('/register', { method: 'POST', body });
                this.mostrarToast('Usuario creado', 'success');
                this.initGestionarEmpleados();
            } catch (error) {
                this.mostrarToast(error.message, 'error');
            }
        };

        const userListDiv = document.getElementById('listaEmpleados');
        const users = await this.apiFetch('/users');
        userListDiv.innerHTML = users
            .map(
                (user) => `
            <div class="empleado-item">
                <span>${user.name} (${user.role})</span>
                ${window.authSystem.getCurrentUser().id !== user.id ? `<button class="btn-icon btn-delete-user" data-id="${user.id}">Eliminar</button>` : ''}
            </div>
        `
            )
            .join('');

        userListDiv.querySelectorAll('.btn-delete-user').forEach((btn) => {
            btn.onclick = async () => {
                if (
                    await this.mostrarConfirmacion(
                        `¿Seguro que quieres eliminar este usuario?`
                    )
                ) {
                    try {
                        await this.apiFetch(`/users/${btn.dataset.id}`, {
                            method: 'DELETE',
                        });
                        this.mostrarToast('Usuario eliminado', 'success');
                        this.initGestionarEmpleados();
                    } catch (error) {
                        this.mostrarToast(error.message, 'error');
                    }
                }
            };
        });
    }

    async initFichajeManual() {
        await this.populateUserSelect('empleadoManual');
        document.getElementById('fichajeManualFecha').value = new Date()
            .toISOString()
            .slice(0, 16);

        document.getElementById('formFichajeManual').onsubmit = async (e) => {
            e.preventDefault();
            const form = e.target;
            const body = JSON.stringify({
                user_id: form.empleadoManual.value,
                type: form.tipoFichaje.value,
                timestamp: new Date(
                    form.fichajeManualFecha.value
                ).toISOString(),
            });
            try {
                await this.apiFetch('/fichajes', { method: 'POST', body });
                this.mostrarToast('Fichaje manual registrado', 'success');
                this.cerrarModal();
                if (window.cargarFichajes) window.cargarFichajes();
            } catch (error) {
                this.mostrarToast(error.message, 'error');
            }
        };
    }

    async initVerFichajes() {
        const form = document.getElementById('form-ver-fichajes');
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        form.querySelector('#ver-fecha-inicio').valueAsDate = startOfMonth;
        form.querySelector('#ver-fecha-fin').valueAsDate = today;

        form.onsubmit = async (e) => {
            e.preventDefault();
            const startDate = form.querySelector('#ver-fecha-inicio').value;
            const endDate = form.querySelector('#ver-fecha-fin').value;
            const resultsDiv = document.getElementById('resultados-fichajes');
            resultsDiv.innerHTML = 'Cargando...';

            try {
                const fichajes = await this.apiFetch('/fichajes');
                const filtered = fichajes.filter((f) => {
                    const fDate = new Date(f.timestamp);
                    return (
                        fDate >= new Date(startDate) &&
                        fDate <=
                            new Date(
                                new Date(endDate).setHours(23, 59, 59, 999)
                            )
                    );
                });

                if (filtered.length === 0) {
                    resultsDiv.innerHTML =
                        '<p>No hay fichajes en este rango de fechas.</p>';
                    return;
                }

                resultsDiv.innerHTML = `
                    <div class="table-responsive">
                        <table>
                            <thead><tr><th>Empleado</th><th>Tipo</th><th>Fecha y Hora</th></tr></thead>
                            <tbody>
                                ${filtered.map((f) => `<tr><td>${f.employee_name}</td><td>${f.type}</td><td>${new Date(f.timestamp).toLocaleString('es-ES')}</td></tr>`).join('')}
                            </tbody>
                        </table>
                    </div>
                `;
            } catch (error) {
                resultsDiv.innerHTML = `<p style="color:red;">${error.message}</p>`;
            }
        };
        form.requestSubmit();
    }

    async initEditarFichajes() {
        await this.populateUserSelect('user-filter', true);
        document.getElementById('date-filter').valueAsDate = new Date();

        const searchFichajes = async () => {
            const userId = document.getElementById('user-filter').value;
            const date = document.getElementById('date-filter').value;
            const listDiv = document.getElementById('fichajes-list');
            listDiv.innerHTML = 'Cargando...';

            try {
                const allFichajes = await this.apiFetch('/fichajes');
                const filtered = allFichajes.filter((f) => {
                    const fDate = new Date(f.timestamp)
                        .toISOString()
                        .split('T')[0];
                    const userMatch = !userId || f.user_id == userId;
                    const dateMatch = !date || fDate === date;
                    return userMatch && dateMatch;
                });

                this.renderFichajesParaEdicion(filtered);
            } catch (error) {
                listDiv.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
            }
        };

        document.getElementById('form-search-fichajes').onsubmit = (e) => {
            e.preventDefault();
            searchFichajes();
        };

        await searchFichajes();
    }

    renderFichajesParaEdicion(fichajes) {
        const listDiv = document.getElementById('fichajes-list');
        if (fichajes.length === 0) {
            listDiv.innerHTML = '<p>No se encontraron fichajes.</p>';
            return;
        }

        listDiv.innerHTML = `
            <div class="table-responsive">
                <table>
                    <thead><tr><th>Empleado</th><th>Tipo</th><th>Fecha y Hora</th><th>Acciones</th></tr></thead>
                    <tbody>
                        ${fichajes
                            .map(
                                (f) => `
                            <tr data-id="${f.id}">
                                <td>${f.employee_name}</td>
                                <td>${f.type}</td>
                                <td>${new Date(f.timestamp).toLocaleString('es-ES')}</td>
                                <td>
                                    <button class="btn-icon btn-edit-fichaje" data-id="${f.id}">Editar</button>
                                    <button class="btn-icon btn-delete-fichaje" data-id="${f.id}">Eliminar</button>
                                </td>
                            </tr>
                        `
                            )
                            .join('')}
                    </tbody>
                </table>
            </div>
        `;

        listDiv.querySelectorAll('.btn-delete-fichaje').forEach((btn) => {
            btn.onclick = async () => {
                if (await this.mostrarConfirmacion('¿Eliminar este fichaje?')) {
                    try {
                        await this.apiFetch(`/fichajes/${btn.dataset.id}`, {
                            method: 'DELETE',
                        });
                        document
                            .getElementById('form-search-fichajes')
                            .requestSubmit();
                    } catch (error) {
                        this.mostrarToast(error.message, 'error');
                    }
                }
            };
        });

        listDiv.querySelectorAll('.btn-edit-fichaje').forEach((btn) => {
            btn.onclick = () => {
                const fichaje = fichajes.find((f) => f.id == btn.dataset.id);
                this.showEditFichajeModal(fichaje);
            };
        });
    }

    showEditFichajeModal(fichaje) {
        if (!fichaje) return;

        const modal = document.createElement('div');
        modal.className = 'modal-overlay show';
        modal.innerHTML = `
            <div class="modal show">
                <div class="modal-content">
                    <div class="modal-header"><h3>Editar Fichaje</h3><button class="modal-close">&times;</button></div>
                    <div class="modal-body">
                        <form id="form-edit-fichaje">
                            <div class="form-group"><label>Fecha y Hora:</label><input type="datetime-local" id="edit-timestamp" required></div>
                            <div class="form-group"><label>Tipo:</label><select id="edit-type"><option value="entrada">Entrada</option><option value="salida">Salida</option></select></div>
                            <button type="submit" class="btn">Guardar Cambios</button>
                        </form>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        modal.querySelector('.modal-close').onclick = () => modal.remove();

        const localDate = new Date(
            new Date(fichaje.timestamp).getTime() -
                new Date().getTimezoneOffset() * 60000
        )
            .toISOString()
            .slice(0, 16);
        modal.querySelector('#edit-timestamp').value = localDate;
        modal.querySelector('#edit-type').value = fichaje.type;

        modal.querySelector('#form-edit-fichaje').onsubmit = async (e) => {
            e.preventDefault();
            const body = JSON.stringify({
                timestamp: new Date(
                    e.target.querySelector('#edit-timestamp').value
                ).toISOString(),
                type: e.target.querySelector('#edit-type').value,
            });
            try {
                await this.apiFetch(`/fichajes/${fichaje.id}`, {
                    method: 'PUT',
                    body,
                });
                this.mostrarToast('Fichaje actualizado', 'success');
                modal.remove();
                document.getElementById('form-search-fichajes').requestSubmit();
            } catch (error) {
                this.mostrarToast(error.message, 'error');
            }
        };
    }

    async initEliminarFichajes() {
        await this.populateUserSelect('user-filter', true);
        const form = document.getElementById('form-eliminar-fichajes');
        const today = new Date();
        form.querySelector('#date-start').valueAsDate = new Date(
            today.getFullYear(),
            today.getMonth(),
            1
        );
        form.querySelector('#date-end').valueAsDate = today;

        form.onsubmit = async (e) => {
            e.preventDefault();
            console.log('Ejecutando la nueva lógica para mostrar fichajes a eliminar...'); // Log de depuración
            const listDiv = document.getElementById('fichajes-eliminar-list');
            listDiv.innerHTML = 'Buscando...';
            try {
                const allFichajes = await this.apiFetch('/fichajes');
                const userId = form.querySelector('#user-filter').value;
                const startDate = new Date(
                    form.querySelector('#date-start').value
                );
                const endDate = new Date(
                    new Date(form.querySelector('#date-end').value).setHours(
                        23,
                        59,
                        59,
                        999
                    )
                );
                const fichajes = allFichajes.filter(
                    (f) =>
                        (!userId || f.user_id == userId) &&
                        new Date(f.timestamp) >= startDate &&
                        new Date(f.timestamp) <= endDate
                );

                if (fichajes.length === 0) {
                    listDiv.innerHTML =
                        '<p>No se encontraron fichajes para estos criterios.</p>';
                    return;
                }

                // --- INICIO DE LA CORRECCIÓN ---
                const tableHTML = `
                    <div class="table-responsive">
                        <h4>Fichajes encontrados:</h4>
                        <table>
                            <thead>
                                <tr>
                                    <th>Empleado</th>
                                    <th>Tipo</th>
                                    <th>Fecha y Hora</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${fichajes.map(f => `
                                    <tr>
                                        <td>${f.employee_name}</td>
                                        <td><span class="tipo ${f.type.toLowerCase()}">${f.type}</span></td>
                                        <td>${new Date(f.timestamp).toLocaleString('es-ES')}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                `;

                const summaryHTML = `
                    <p style="margin-top: 1rem; font-weight: bold;">${fichajes.length} fichajes serán eliminados.</p>
                    <button id="btn-eliminar-todos" class="btn btn-danger" style="margin-top: 1rem;">
                        <i class="fas fa-trash-alt"></i> Confirmar eliminación de estos ${fichajes.length} fichajes
                    </button>
                `;

                listDiv.innerHTML = tableHTML + summaryHTML;
                // --- FIN DE LA CORRECCIÓN ---

                listDiv.querySelector('#btn-eliminar-todos').onclick =
                    async () => {
                        if (
                            await this.mostrarConfirmacion(
                                `¿Está seguro de que desea eliminar ${fichajes.length} fichajes de forma permanente? Esta acción no se puede deshacer.`
                            )
                        ) {
                            try {
                                const promises = fichajes.map((f) =>
                                    this.apiFetch(`/fichajes/${f.id}`, {
                                        method: 'DELETE',
                                    })
                                );
                                await Promise.all(promises);
                                this.mostrarToast(
                                    `${fichajes.length} fichajes eliminados.`,
                                    'success'
                                );
                                listDiv.innerHTML = '<p>¡Eliminación completada!</p>';
                                if (window.cargarFichajes)
                                    window.cargarFichajes();
                            } catch (error) {
                                this.mostrarToast(error.message, 'error');
                            }
                        }
                    };
            } catch (error) {
                this.mostrarToast(error.message, 'error');
            }
        };
    }

    async initInformes() {
        await this.populateUserSelect('report-user-filter', true);
        const form = document.getElementById('form-informe');
        const today = new Date();
        form.querySelector('#report-date-start').valueAsDate = new Date(
            today.getFullYear(),
            today.getMonth(),
            1
        );
        form.querySelector('#report-date-end').valueAsDate = today;

        form.onsubmit = async (e) => {
            e.preventDefault();
            const resultsDiv = document.getElementById('report-results');
            resultsDiv.style.display = 'block';
            document.getElementById('report-data-preview').innerHTML =
                'Generando informe...';

            try {
                const allFichajes = await this.apiFetch('/fichajes');
                const userId = form.querySelector('#report-user-filter').value;
                const startDate = new Date(
                    form.querySelector('#report-date-start').value
                );
                const endDate = new Date(
                    new Date(
                        form.querySelector('#report-date-end').value
                    ).setHours(23, 59, 59, 999)
                );
                const fichajes = allFichajes.filter(
                    (f) =>
                        (!userId || f.user_id == userId) &&
                        new Date(f.timestamp) >= startDate &&
                        new Date(f.timestamp) <= endDate
                );

                this.renderReport(fichajes);
            } catch (error) {
                this.mostrarToast(error.message, 'error');
            }
        };
    }

    renderReport(fichajes) {
        const previewDiv = document.getElementById('report-data-preview');
        const summaryDiv = document.getElementById('report-summary');
        if (fichajes.length === 0) {
            previewDiv.innerHTML = '<p>No hay datos para este informe.</p>';
            summaryDiv.innerHTML = '';
            return;
        }

        const { horasPorEmpleado, totalGeneral } =
            this.calculateHours(fichajes);
        summaryDiv.innerHTML = `<h4>Horas Totales: ${totalGeneral}</h4>`;
        previewDiv.innerHTML = `
            <div class="table-responsive">
                <table>
                    <thead><tr><th>Empleado</th><th>Tipo</th><th>Fecha y Hora</th></tr></thead>
                    <tbody>${fichajes.map((f) => `<tr><td>${f.employee_name}</td><td>${f.type}</td><td>${new Date(f.timestamp).toLocaleString('es-ES')}</td></tr>`).join('')}</tbody>
                </table>
            </div>
        `;

        document.getElementById('export-pdf').onclick = () =>
            this.exportToPDF(fichajes, horasPorEmpleado, totalGeneral);
        document.getElementById('export-excel').onclick = () =>
            this.exportToExcel(fichajes, horasPorEmpleado);
        document.getElementById('imprimir-informe').onclick = () =>
            this.printReport(fichajes, horasPorEmpleado, totalGeneral);
    }

    calculateHours(fichajes) {
        const fichajesPorEmpleado = fichajes.reduce((acc, f) => {
            if (!acc[f.employee_name]) acc[f.employee_name] = [];
            acc[f.employee_name].push(f);
            return acc;
        }, {});

        const horasPorEmpleado = {};
        let totalMinutosGeneral = 0;

        for (const [empleado, fichajesEmpleado] of Object.entries(
            fichajesPorEmpleado
        )) {
            fichajesEmpleado.sort(
                (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
            );
            let totalMinutosEmpleado = 0;
            let entrada = null;
            fichajesEmpleado.forEach((f) => {
                if (f.type === 'entrada') {
                    entrada = new Date(f.timestamp);
                } else if (f.type === 'salida' && entrada) {
                    totalMinutosEmpleado +=
                        (new Date(f.timestamp) - entrada) / 60000;
                    entrada = null;
                }
            });
            totalMinutosGeneral += totalMinutosEmpleado;
            const horas = Math.floor(totalMinutosEmpleado / 60);
            const minutos = Math.round(totalMinutosEmpleado % 60);
            horasPorEmpleado[empleado] =
                `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`;
        }

        const horasTotal = Math.floor(totalMinutosGeneral / 60);
        const minutosTotal = Math.round(totalMinutosGeneral % 60);
        const totalGeneral = `${horasTotal.toString().padStart(2, '0')}:${minutosTotal.toString().padStart(2, '0')}`;

        return { horasPorEmpleado, totalGeneral };
    }

    exportToPDF(fichajes, horas, total) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        doc.text('Informe de Fichajes', 14, 16);
        doc.setFontSize(12);
        doc.text(`Total de Horas Trabajadas: ${total}`, 14, 24);

        const tableData = fichajes.map((f) => [
            f.employee_name,
            f.type,
            new Date(f.timestamp).toLocaleString('es-ES'),
        ]);
        doc.autoTable({
            head: [['Empleado', 'Tipo', 'Fecha y Hora']],
            body: tableData,
            startY: 30,
        });

        doc.save('informe_fichajes.pdf');
        this.mostrarToast('PDF generado correctamente', 'success');
    }

    exportToExcel(fichajes, horas) {
        const dataForSheet = fichajes.map((f) => ({
            Empleado: f.employee_name,
            Tipo: f.type,
            Fecha: new Date(f.timestamp).toLocaleDateString('es-ES'),
            Hora: new Date(f.timestamp).toLocaleTimeString('es-ES'),
        }));

        const summarySheet = Object.entries(horas).map(
            ([empleado, tiempo]) => ({
                Empleado: empleado,
                'Horas Totales': tiempo,
            })
        );

        const wb = XLSX.utils.book_new();
        const wsFichajes = XLSX.utils.json_to_sheet(dataForSheet);
        const wsResumen = XLSX.utils.json_to_sheet(summarySheet);

        XLSX.utils.book_append_sheet(wb, wsFichajes, 'Fichajes');
        XLSX.utils.book_append_sheet(wb, wsResumen, 'Resumen Horas');

        XLSX.writeFile(wb, 'informe_fichajes.xlsx');
        this.mostrarToast('Excel generado correctamente', 'success');
    }

    printReport(fichajes, horas, total) {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(
            '<html><head><title>Informe de Fichajes</title><style>body{font-family:sans-serif} table{width:100%;border-collapse:collapse} th,td{border:1px solid #ddd;padding:8px}</style></head><body>'
        );
        printWindow.document.write(
            `<h1>Informe de Fichajes</h1><h3>Total Horas: ${total}</h3>`
        );
        printWindow.document.write(
            document.getElementById('report-data-preview').innerHTML
        );
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
    }
    //endregion
}

// Instanciamos la clase para que el menú funcione
window.menuManager = new MenuManager();
