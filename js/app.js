// Este script ahora espera a ser inicializado por auth.js

let userList = []; // Caché para la lista de usuarios

// --- ¡NUEVO! Escuchamos el evento de autenticación exitosa ---
document.body.addEventListener('authSuccess', () => {
    console.log('Evento authSuccess recibido. Inicializando app.js...');
    inicializarApp();
});

// Esta función ahora es llamada por el evento 'authSuccess'
async function inicializarApp() {
    console.log('🚀 Inicializando aplicación principal (app.js)...');
    await cargarUsuariosParaFichaje();
    await cargarFichajes();
    setInterval(actualizarReloj, 1000);
    actualizarReloj(); // Llamada inicial para que no haya retraso
}

// Cargar la lista de usuarios para el desplegable de fichar
async function cargarUsuariosParaFichaje() {
    try {
        // Usamos el método apiFetch del menuManager que ya existe y maneja el token
        const users = await window.menuManager.apiFetch('/users');
        userList = users;
        const select = document.getElementById('empleado');
        if (!select) return;

        select.innerHTML = '<option value="">Selecciona un empleado</option>';
        users
            .sort((a, b) => a.name.localeCompare(b.name))
            .forEach((user) => {
                const option = document.createElement('option');
                option.value = user.id; // Usar ID como valor
                option.textContent = user.name;
                select.appendChild(option);
            });
    } catch (error) {
        console.error('Error al cargar usuarios para fichaje:', error);
        window.menuManager.mostrarToast(
            'No se pudieron cargar los usuarios',
            'error'
        );
    }
}

// Cargar y mostrar los fichajes del día
async function cargarFichajes() {
    try {
        const todosLosFichajes = await window.menuManager.apiFetch('/fichajes');
        const tbody = document.getElementById('registrosBody');
        tbody.innerHTML = '';

        const hoy = new Date().toLocaleDateString('es-ES');
        const fichajesHoy = todosLosFichajes.filter(
            (f) => new Date(f.timestamp).toLocaleDateString('es-ES') === hoy
        );

        if (fichajesHoy.length === 0) {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td colspan="4" style="text-align: center; color: #888;">No hay registros para hoy.</td>`;
            tbody.appendChild(tr);
            return;
        }

        fichajesHoy
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .forEach((fichaje) => {
                const fechaFichaje = new Date(fichaje.timestamp);
                const tiempoAcumulado = calcularTiempoAcumulado(
                    fichaje.employee_name,
                    fechaFichaje,
                    todosLosFichajes
                );

                const tr = document.createElement('tr');
                tr.innerHTML = `
                <td>${fichaje.employee_name}</td>
                <td><span class="tipo ${fichaje.type.toLowerCase()}">${fichaje.type}</span></td>
                <td>${fechaFichaje.toLocaleTimeString('es-ES')}</td>
                <td>${tiempoAcumulado}</td>
            `;
                tbody.appendChild(tr);
            });
    } catch (error) {
        console.error('Error al cargar fichajes:', error);
        window.menuManager.mostrarToast(
            'No se pudieron cargar los fichajes',
            'error'
        );
    }
}

// Registrar un fichaje de entrada o salida
async function registrarFichaje(tipo) {
    const userId = document.getElementById('empleado').value;
    if (!userId) {
        return window.menuManager.mostrarToast(
            'Por favor, selecciona un empleado.',
            'warning'
        );
    }

    try {
        await window.menuManager.apiFetch('/fichajes', {
            method: 'POST',
            body: JSON.stringify({
                user_id: userId,
                type: tipo.toLowerCase(),
                timestamp: new Date().toISOString(),
            }),
        });

        await cargarFichajes(); // Recargar la tabla
        document.getElementById('empleado').value = '';
        window.menuManager.mostrarToast(
            `Fichaje de ${tipo} registrado correctamente.`,
            'success'
        );
    } catch (error) {
        console.error(`Error al registrar ${tipo}:`, error);
        window.menuManager.mostrarToast(
            `Error al registrar el fichaje: ${error.message}`,
            'error'
        );
    }
}

window.registrarEntrada = () => registrarFichaje('Entrada');
window.registrarSalida = () => registrarFichaje('Salida');

function calcularTiempoAcumulado(employeeName, fechaLimite, todosFichajes) {
    const hoyCadena = new Date(fechaLimite).toLocaleDateString('es-ES');

    const fichajesEmpleadoHoy = todosFichajes
        .filter(
            (f) =>
                f.employee_name === employeeName &&
                new Date(f.timestamp).toLocaleDateString('es-ES') ===
                    hoyCadena &&
                new Date(f.timestamp) <= fechaLimite
        )
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    if (fichajesEmpleadoHoy.length === 0) return '00:00';

    let tiempoTotalMs = 0;
    let entradaActiva = null;

    fichajesEmpleadoHoy.forEach((fichaje) => {
        if (fichaje.type === 'entrada') {
            entradaActiva = new Date(fichaje.timestamp);
        } else if (fichaje.type === 'salida' && entradaActiva) {
            tiempoTotalMs += new Date(fichaje.timestamp) - entradaActiva;
            entradaActiva = null;
        }
    });

    const totalMinutos = Math.floor(tiempoTotalMs / (1000 * 60));
    const horas = Math.floor(totalMinutos / 60);
    const minutos = totalMinutos % 60;

    return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`;
}

function actualizarReloj() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
    const dateString = now.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const timeElement = document.getElementById('current-time');
    if (timeElement) {
        timeElement.innerHTML = `<span class="time">${timeString}</span><span class="date">${dateString}</span>`;
    }
}

// Hacemos la función de cargar fichajes global para poder llamarla desde otros módulos si es necesario
window.cargarFichajes = cargarFichajes;
