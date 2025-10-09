document.addEventListener('DOMContentLoaded', () => {
    const adminPanel = new AdminPanel();
    adminPanel.init();
});

class AdminPanel {
    constructor() {
        this.token = localStorage.getItem('miCasitaPatch_token');
        this.user = null;
    }

    init() {
        this.authenticate();
        if (!this.user) return;

        this.setupUI();
        this.loadSection('users'); // Cargar la sección de usuarios por defecto
    }

    authenticate() {
        if (!this.token) {
            window.location.href = 'index.html';
            return;
        }
        try {
            const payload = JSON.parse(atob(this.token.split('.')[1]));
            const isExpired = payload.exp * 1000 < Date.now();

            if (isExpired || payload.role !== 'admin') {
                localStorage.removeItem('miCasitaPatch_token');
                window.location.href = 'index.html';
            } else {
                this.user = payload;
            }
        } catch (error) {
            localStorage.removeItem('miCasitaPatch_token');
            window.location.href = 'index.html';
        }
    }

    setupUI() {
        document.getElementById('currentUser').textContent =
            `Admin: ${this.user.name}`;
        document.getElementById('logoutBtn').addEventListener('click', () => {
            localStorage.removeItem('miCasitaPatch_token');
            window.location.href = 'index.html';
        });

        document.querySelectorAll('.admin-nav button').forEach((button) => {
            button.addEventListener('click', () =>
                this.loadSection(button.dataset.section)
            );
        });
    }

    async apiFetch(endpoint, options = {}) {
        const headers = {
            Authorization: `Bearer ${this.token}`,
            'Content-Type': 'application/json',
            ...options.headers,
        };

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

    async loadSection(section) {
        const content = document.getElementById('admin-content');
        content.innerHTML = '<h2>Cargando...</h2>';

        try {
            if (section === 'users') {
                await this.renderUserSection(content);
            } else if (section === 'fichajes') {
                await this.renderFichajesSection(content);
            } else if (section === 'reports') {
                await this.renderReportsSection(content);
            } else {
                content.innerHTML = '<h2>Sección no encontrada</h2>';
            }
        } catch (error) {
            content.innerHTML = `<h2 style="color: red;">Error: ${error.message}</h2>`;
        }
    }

    async renderUserSection(container) {
        container.innerHTML = `
            <h2>Gestionar Usuarios</h2>
            <div class="admin-card">
                <h3>Crear Nuevo Usuario</h3>
                <form id="form-create-user">
                    <div class="form-group"><label>Nombre de Usuario:</label><input type="text" id="username" required></div>
                    <div class="form-group"><label>Nombre Completo:</label><input type="text" id="name" required></div>
                    <div class="form-group"><label>Contraseña (6 dígitos):</label><input type="password" id="password" required pattern="[0-9]{6}" maxlength="6"></div>
                    <div class="form-group"><label>Rol:</label><select id="role"><option value="employee">Empleado</option><option value="admin">Administrador</option></select></div>
                    <button type="submit" class="btn">Crear Usuario</button>
                </form>
            </div>
            <div class="admin-card">
                <h3>Usuarios Existentes</h3>
                <div id="user-list"></div>
            </div>
        `;

        const userListDiv = container.querySelector('#user-list');
        const users = await this.apiFetch('/users');
        userListDiv.innerHTML = `
            <table>
                <thead><tr><th>Nombre</th><th>Usuario</th><th>Rol</th><th>Acciones</th></tr></thead>
                <tbody>
                    ${users
                        .map(
                            (user) => `
                        <tr>
                            <td>${user.name}</td>
                            <td>${user.username}</td>
                            <td>${user.role}</td>
                            <td>
                                ${this.user.id !== user.id ? `<button class="btn-icon btn-delete" data-id="${user.id}">Eliminar</button>` : ' (Tu cuenta)'}
                            </td>
                        </tr>
                    `
                        )
                        .join('')}
                </tbody>
            </table>
        `;

        container
            .querySelector('#form-create-user')
            .addEventListener('submit', async (e) => {
                e.preventDefault();
                const form = e.target;
                const body = JSON.stringify({
                    username: form.username.value,
                    name: form.name.value,
                    password: form.password.value,
                    role: form.role.value,
                });
                try {
                    await this.apiFetch('/register', { method: 'POST', body });
                    alert('Usuario creado');
                    this.loadSection('users');
                } catch (error) {
                    alert(`Error: ${error.message}`);
                }
            });

        container.querySelectorAll('.btn-delete').forEach((button) => {
            button.addEventListener('click', async (e) => {
                const userId = e.target.dataset.id;
                if (
                    confirm(
                        '¿Estás seguro de que quieres eliminar este usuario? Sus fichajes también serán eliminados.'
                    )
                ) {
                    try {
                        await this.apiFetch(`/users/${userId}`, {
                            method: 'DELETE',
                        });
                        alert('Usuario eliminado');
                        this.loadSection('users');
                    } catch (error) {
                        alert(`Error: ${error.message}`);
                    }
                }
            });
        });
    }

    async renderFichajesSection(container) {
        container.innerHTML = `
            <h2>Gestionar Fichajes</h2>
            <div class="admin-card">
                <h3>Buscar Fichajes</h3>
                <form id="form-search-fichajes">
                    <div class="form-group"><label>Empleado:</label><select id="user-filter"><option value="">Todos</option></select></div>
                    <div class="form-group"><label>Fecha:</label><input type="date" id="date-filter"></div>
                    <button type="submit" class="btn">Buscar</button>
                </form>
            </div>
            <div class="admin-card">
                <h3>Resultados</h3>
                <div id="fichajes-list"></div>
            </div>
        `;

        const users = await this.apiFetch('/users');
        const userFilterSelect = container.querySelector('#user-filter');
        users.forEach((user) => {
            userFilterSelect.innerHTML += `<option value="${user.id}">${user.name}</option>`;
        });

        container.querySelector('#date-filter').valueAsDate = new Date();

        const searchForm = container.querySelector('#form-search-fichajes');
        searchForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.searchFichajes();
        });

        await this.searchFichajes();
    }

    async searchFichajes() {
        const userId = document.getElementById('user-filter').value;
        const date = document.getElementById('date-filter').value;
        const listDiv = document.getElementById('fichajes-list');
        listDiv.innerHTML = 'Cargando...';

        try {
            const allFichajes = await this.apiFetch('/fichajes');
            const filteredFichajes = allFichajes.filter((f) => {
                const fDate = new Date(f.timestamp).toISOString().split('T')[0];
                const userMatch = !userId || f.user_id == userId;
                const dateMatch = !date || fDate === date;
                return userMatch && dateMatch;
            });

            if (filteredFichajes.length === 0) {
                listDiv.innerHTML = '<p>No se encontraron fichajes.</p>';
                return;
            }

            listDiv.innerHTML = `
                <table>
                    <thead><tr><th>Empleado</th><th>Tipo</th><th>Fecha y Hora</th><th>Acciones</th></tr></thead>
                    <tbody>
                        ${filteredFichajes
                            .map(
                                (f) => `
                            <tr data-id="${f.id}">
                                <td>${f.employee_name}</td>
                                <td>${f.type}</td>
                                <td>${new Date(f.timestamp).toLocaleString('es-ES')}</td>
                                <td>
                                    <button class="btn-icon btn-edit">Editar</button>
                                    <button class="btn-icon btn-delete">Eliminar</button>
                                </td>
                            </tr>
                        `
                            )
                            .join('')}
                    </tbody>
                </table>
            `;

            listDiv.querySelectorAll('.btn-delete').forEach((button) => {
                button.addEventListener('click', async (e) => {
                    const fichajeId = e.target.closest('tr').dataset.id;
                    if (confirm('¿Seguro?')) {
                        await this.apiFetch(`/fichajes/${fichajeId}`, {
                            method: 'DELETE',
                        });
                        await this.searchFichajes();
                    }
                });
            });

            listDiv.querySelectorAll('.btn-edit').forEach((button) => {
                button.addEventListener('click', (e) => {
                    const row = e.target.closest('tr');
                    this.showEditFichajeModal(row.dataset.id, filteredFichajes);
                });
            });
        } catch (error) {
            listDiv.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
        }
    }

    showEditFichajeModal(fichajeId, fichajes) {
        const fichaje = fichajes.find((f) => f.id == fichajeId);
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
                            <button type="submit" class="btn">Guardar</button>
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

        modal
            .querySelector('#form-edit-fichaje')
            .addEventListener('submit', async (e) => {
                e.preventDefault();
                const body = JSON.stringify({
                    timestamp: new Date(
                        e.target.querySelector('#edit-timestamp').value
                    ).toISOString(),
                    type: e.target.querySelector('#edit-type').value,
                });
                await this.apiFetch(`/fichajes/${fichajeId}`, {
                    method: 'PUT',
                    body,
                });
                modal.remove();
                await this.searchFichajes();
            });
    }

    async renderReportsSection(container) {
        container.innerHTML = `
            <h2>Informes y Exportación</h2>
            <div class="admin-card">
                <h3>Generar Informe</h3>
                <form id="form-generate-report">
                    <div class="form-group"><label>Empleado:</label><select id="report-user-filter"><option value="">Todos</option></select></div>
                    <div class="form-group"><label>Desde:</label><input type="date" id="report-date-start" required></div>
                    <div class="form-group"><label>Hasta:</label><input type="date" id="report-date-end" required></div>
                    <button type="submit" class="btn">Generar Informe</button>
                </form>
            </div>
            <div class="admin-card" id="report-results-card" style="display:none;">
                <h3>Resultados del Informe</h3>
                <div id="report-summary"></div>
                <div id="report-actions">
                    <button class="btn" id="export-pdf">Exportar a PDF</button>
                    <button class="btn" id="export-excel">Exportar a Excel</button>
                </div>
                <div id="report-data"></div>
            </div>
        `;

        const users = await this.apiFetch('/users');
        const userFilterSelect = container.querySelector('#report-user-filter');
        users.forEach((user) => {
            userFilterSelect.innerHTML += `<option value="${user.id}">${user.name}</option>`;
        });

        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        container.querySelector('#report-date-start').valueAsDate =
            startOfMonth;
        container.querySelector('#report-date-end').valueAsDate = today;

        container
            .querySelector('#form-generate-report')
            .addEventListener('submit', async (e) => {
                e.preventDefault();
                const userId = e.target.querySelector(
                    '#report-user-filter'
                ).value;
                const startDate =
                    e.target.querySelector('#report-date-start').value;
                const endDate =
                    e.target.querySelector('#report-date-end').value;

                const allFichajes = await this.apiFetch('/fichajes');
                const filtered = allFichajes.filter((f) => {
                    const fDate = new Date(f.timestamp);
                    const userMatch = !userId || f.user_id == userId;
                    const dateMatch =
                        fDate >= new Date(startDate) &&
                        fDate <=
                            new Date(
                                new Date(endDate).setHours(23, 59, 59, 999)
                            );
                    return userMatch && dateMatch;
                });

                this.displayReport(filtered);
            });
    }

    displayReport(fichajes) {
        const resultsCard = document.getElementById('report-results-card');
        resultsCard.style.display = 'block';
        const dataDiv = document.getElementById('report-data');
        const summaryDiv = document.getElementById('report-summary');

        if (fichajes.length === 0) {
            dataDiv.innerHTML = '<p>No hay datos para este informe.</p>';
            summaryDiv.innerHTML = '';
            return;
        }

        const { horasPorEmpleado, totalGeneral } =
            this.calculateHours(fichajes);
        summaryDiv.innerHTML = `<h4>Horas Totales: ${totalGeneral}</h4>`;

        dataDiv.innerHTML = `
            <table>
                <thead><tr><th>Empleado</th><th>Tipo</th><th>Fecha y Hora</th></tr></thead>
                <tbody>${fichajes
                    .map(
                        (f) => `
                    <tr><td>${f.employee_name}</td><td>${f.type}</td><td>${new Date(f.timestamp).toLocaleString('es-ES')}</td></tr>
                `
                    )
                    .join('')}</tbody>
            </table>
        `;

        document.getElementById('export-pdf').onclick = () =>
            this.exportToPDF(fichajes, horasPorEmpleado, totalGeneral);
        document.getElementById('export-excel').onclick = () =>
            this.exportToExcel(fichajes, horasPorEmpleado);
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
        doc.text('Informe de Fichajes', 10, 10);
        doc.text(`Total de Horas Trabajadas: ${total}`, 10, 20);

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
    }
}
