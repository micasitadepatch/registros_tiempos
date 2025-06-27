// Cargar empleados al inicio desde backend
async function cargarEmpleados() {
    try {
        const select = document.getElementById('empleado');
        if (!select) return;

        // Limpiar opciones existentes excepto la primera
        while (select.options.length > 1) {
            select.remove(1);
        }

        // Cargar empleados desde backend
        let empleados = [];
        try {
            const res = await fetch('/api/data/empleados');
            const data = await res.json();
            if (data && Array.isArray(data.employees)) {
                empleados = data.employees;
            }
        } catch (e) {
            console.error('Error al obtener empleados del backend:', e);
        }

        // Si no hay empleados, inicializar con empleados por defecto y guardar en backend
        if (empleados.length === 0) {
            empleados = [
                { id: '1', name: 'Asera' },
                { id: '2', name: 'Eva' }
            ];
            const estructura = { employees: empleados };
            await fetch('/api/data/empleados', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(estructura)
            });
        }

        // Añadir empleados al select ordenados alfabéticamente
        empleados
            .sort((a, b) => a.name.localeCompare(b.name))
            .forEach(emp => {
                const option = document.createElement('option');
                option.value = emp.name;
                option.textContent = emp.name;
                select.appendChild(option);
            });
    } catch (error) {
        console.error('Error al cargar empleados:', error);
        // En caso de error, añadir empleados por defecto
        const select = document.getElementById('empleado');
        if (select && select.options.length <= 1) {
            ['Asera', 'Eva'].forEach(nombre => {
                const option = document.createElement('option');
                option.value = nombre;
                option.textContent = nombre;
                select.appendChild(option);
            });
        }
    }
}

// Función para calcular tiempo acumulado de trabajo
window.calcularTiempoAcumulado = function calcularTiempoAcumulado(empleado, fechaLimite, todosFichajes) {
    try {
        console.log(`🕐 === CALCULANDO TIEMPO PARA ${empleado} ===`);
        console.log(`📅 Fecha límite: ${fechaLimite.toLocaleString('es-ES')}`);
        console.log(`📊 Total fichajes disponibles: ${todosFichajes.length}`);

        // Obtener fecha de hoy en formato comparable
        const hoy = new Date();
        const hoyCadena = hoy.toLocaleDateString('es-ES');
        console.log(`📆 Día actual: ${hoyCadena}`);

        // Filtrar fichajes del empleado del día actual
        const fichajesEmpleadoHoy = todosFichajes.filter(f => {
            const fechaFichaje = new Date(f.timestamp);
            const fechaFichajeStr = fechaFichaje.toLocaleDateString('es-ES');
            const esDelEmpleado = f.employee === empleado;
            const esDeHoy = fechaFichajeStr === hoyCadena;
            const antesDelLimite = fechaFichaje <= fechaLimite;

            console.log(`   📋 Fichaje: ${f.employee} - ${f.type} - ${fechaFichaje.toLocaleString('es-ES')}`);
            console.log(`      ✓ Es del empleado: ${esDelEmpleado}`);
            console.log(`      ✓ Es de hoy: ${esDeHoy} (${fechaFichajeStr} === ${hoyCadena})`);
            console.log(`      ✓ Antes del límite: ${antesDelLimite}`);

            return esDelEmpleado && esDeHoy && antesDelLimite;
        });

        console.log(`✅ Fichajes válidos encontrados: ${fichajesEmpleadoHoy.length}`);

        if (fichajesEmpleadoHoy.length === 0) {
            console.log(`❌ No hay fichajes para ${empleado} hoy`);
            return '<span class="tiempo-acumulado inicio">00:00</span>';
        }

        // Ordenar por fecha
        fichajesEmpleadoHoy.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

        let tiempoTotalMs = 0;
        let entradaActiva = null;

        console.log(`🔄 Procesando fichajes en orden...`);
        fichajesEmpleadoHoy.forEach((fichaje, index) => {
            const fechaFichaje = new Date(fichaje.timestamp);
            console.log(`${index + 1}. ${fichaje.type} - ${fechaFichaje.toLocaleString('es-ES')}`);

            if (fichaje.type === 'Entrada') {
                entradaActiva = fechaFichaje;
                console.log(`   🚪 Nueva entrada registrada`);
            } else if (fichaje.type === 'Salida' && entradaActiva) {
                const duracion = fechaFichaje - entradaActiva;
                tiempoTotalMs += duracion;
                const minutos = Math.floor(duracion / (1000 * 60));
                console.log(`   🏃 Salida - Duración del período: ${minutos} minutos`);
                entradaActiva = null;
            }
        });

        // Si queda una entrada sin salida
        if (entradaActiva) {
            const ahora = new Date();
            const tiempoHastaAhora = ahora - entradaActiva;
            tiempoTotalMs += tiempoHastaAhora;
            const minutos = Math.floor(tiempoHastaAhora / (1000 * 60));
            console.log(`   ⏰ Entrada sin salida - Tiempo hasta ahora: ${minutos} minutos`);
        }

        // Convertir a horas y minutos
        const totalMinutos = Math.floor(tiempoTotalMs / (1000 * 60));
        const horas = Math.floor(totalMinutos / 60);
        const minutos = totalMinutos % 60;

        console.log(`🎯 RESULTADO: ${horas}:${minutos.toString().padStart(2, '0')} (${totalMinutos} minutos totales)`);
        console.log(`🕐 === FIN CÁLCULO PARA ${empleado} ===`);

        if (totalMinutos === 0) {
            return '<span class="tiempo-acumulado inicio">00:00</span>';
        }

        return `<span class="tiempo-acumulado">${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}</span>`;

    } catch (error) {
        console.error('❌ Error en calcularTiempoAcumulado:', error);
        return '<span class="tiempo-acumulado error">ERROR</span>';
    }
}

// Cargar fichajes existentes desde backend
async function cargarFichajes() {
    try {
        let checks = [];
        try {
            const res = await fetch('/api/data/fichajes');
            const data = await res.json();
            if (Array.isArray(data)) {
                checks = data;
            } else if (data && Array.isArray(data.fichajes)) {
                checks = data.fichajes;
            }
        } catch (e) {
            console.error('Error al obtener fichajes del backend:', e);
        }
        const tbody = document.getElementById('registrosBody');
        tbody.innerHTML = '';

        // Filtrar solo los fichajes del día actual
        const hoy = new Date().toLocaleDateString('es-ES');
        const fichajesHoy = checks.filter(check =>
            new Date(check.timestamp).toLocaleDateString('es-ES') === hoy
        );

        // Mostrar fichajes ordenados por fecha descendente
        fichajesHoy.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .forEach(check => {
                const fechaFichaje = new Date(check.timestamp);
                const tiempoAcumulado = calcularTiempoAcumulado(check.employee, fechaFichaje, checks);

                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${check.employee}</td>
                    <td><span class="tipo ${check.type.toLowerCase()}">${check.type}</span></td>
                    <td>${fechaFichaje.toLocaleTimeString('es-ES')}</td>
                    <td>${tiempoAcumulado}</td>
                `;
                tbody.appendChild(tr);
            });
    } catch (error) {
        console.error('Error al cargar fichajes:', error);
    }
}

// Actualizar reloj
function actualizarReloj() {
    const now = new Date();
    document.getElementById('current-time').textContent =
        now.toLocaleTimeString('es-ES');
}

// Funciones para registrar entradas y salidas
function registrarEntrada() {
    registrarFichaje('Entrada');
}

function registrarSalida() {
    registrarFichaje('Salida');
}

async function registrarFichaje(tipo) {
    const empleado = document.getElementById('empleado').value;
    if (!empleado) {
        // Usar el sistema de mensajes de MenuManager si está disponible
        if (window.menuManager && window.menuManager.mostrarToast) {
            window.menuManager.mostrarToast('Por favor, selecciona un empleado', 'warning');
        } else {
            alert('Por favor, selecciona un empleado');
        }
        return;
    }

    const now = new Date();
    const nuevoFichaje = {
        employee: empleado,
        type: tipo,
        timestamp: now.toISOString()
    };

    try {
        // Obtener fichajes actuales del backend
        let checks = [];
        try {
            const res = await fetch('/api/data/fichajes');
            const data = await res.json();
            if (Array.isArray(data)) {
                checks = data;
            } else if (data && Array.isArray(data.fichajes)) {
                checks = data.fichajes;
            }
        } catch (e) {
            console.error('Error al obtener fichajes del backend:', e);
        }

        // Añadir nuevo fichaje
        checks.push(nuevoFichaje);

        // Guardar en backend
        await fetch('/api/data/fichajes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(checks)
        });

        // Actualizar la tabla
        cargarFichajes();

        // Reproducir un sonido de confirmación
        const audio = new Audio('data:audio/mp3;base64,SUQzBAAAAAABEVRYWFgAAAAtAAADY29tbWVudABCaWdTb3VuZEJhbmsuY29tLyBMYXJnZUNvbGxlY3Rpb24ABERJUkEAAAAVAAADZW5jb2RpbmdAZW5jb2RlZCBieSAAQ09NTQAAAAA8AAAAZW5nAFN5bnRoIHBvcCBtdXNpYyBzb3VuZCwgbm90ZSwgdG9uZSwgYmVlcCwgcGluZywgc3ludGg4Yml0AF9QUklWAAAAAQAAAFdNAAAAAAAAAA==');
        audio.play();

        // Limpiar el formulario y mostrar confirmación visual
        document.getElementById('empleado').value = '';
        const confirmacion = document.createElement('div');
        confirmacion.className = 'confirmacion';
        confirmacion.textContent = `✓ Fichaje de ${tipo.toLowerCase()} registrado`;
        document.querySelector('.check-form').appendChild(confirmacion);
        setTimeout(() => confirmacion.remove(), 3000);

    } catch (error) {
        console.error('Error al guardar el fichaje:', error);
        // Usar el sistema de mensajes de MenuManager si está disponible
        if (window.menuManager && window.menuManager.mostrarToast) {
            window.menuManager.mostrarToast('Error al guardar el fichaje. Por favor, inténtalo de nuevo.', 'error');
        } else {
            alert('Error al guardar el fichaje. Por favor, inténtalo de nuevo.');
        }
    }
}

// Función para actualizar contadores de tiempo en vivo (usando backend)
async function actualizarContadoresTiempo() {
    try {
        const tbody = document.getElementById('registrosBody');
        if (!tbody) return;

        let fichajes = [];
        try {
            const res = await fetch('/api/data/fichajes');
            const data = await res.json();
            if (Array.isArray(data)) {
                fichajes = data;
            } else if (data && Array.isArray(data.fichajes)) {
                fichajes = data.fichajes;
            }
        } catch (e) {
            console.error('Error al obtener fichajes del backend:', e);
        }
        const ahora = new Date();
        const hoy = ahora.toLocaleDateString('es-ES');
        const fichajesHoy = fichajes.filter(check =>
            new Date(check.timestamp).toLocaleDateString('es-ES') === hoy
        );
        if (fichajesHoy.length === 0) return;
        const filas = tbody.querySelectorAll('tr');
        filas.forEach(fila => {
            const celdas = fila.querySelectorAll('td');
            if (celdas.length >= 4) {
                const empleado = celdas[0].textContent;
                const tipoElement = celdas[1].querySelector('.tipo');
                const horaText = celdas[2].textContent;
                const tiempoCell = celdas[3];
                const fichajeFila = fichajesHoy.find(f =>
                    f.employee === empleado &&
                    new Date(f.timestamp).toLocaleTimeString('es-ES') === horaText &&
                    f.type === (tipoElement ? tipoElement.textContent : '')
                );
                if (fichajeFila) {
                    const fechaFichaje = new Date(fichajeFila.timestamp);
                    const tiempoAcumulado = calcularTiempoAcumulado(empleado, fechaFichaje, fichajes);
                    if (tiempoCell.innerHTML !== tiempoAcumulado) {
                        tiempoCell.innerHTML = tiempoAcumulado;
                        console.log(`✅ Actualizado tiempo para ${empleado}: ${tiempoAcumulado}`);
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error al actualizar contadores de tiempo:', error);
    }
}

// Función de test para probar el contador de tiempo (solo para desarrollo, mantiene localStorage)
window.probarContadorTiempo = function () {
    console.log('🧪 === PROBANDO CONTADOR DE TIEMPO ===');

    // Limpiar fichajes existentes para prueba limpia
    localStorage.setItem('fichajes', '[]');

    const ahora = new Date();
    const hace30min = new Date(ahora.getTime() - (30 * 60 * 1000));

    // Crear fichaje de prueba de hace 30 minutos
    const fichajeTest = {
        employee: 'Asera',
        type: 'Entrada',
        timestamp: hace30min.toISOString()
    };

    const fichajes = [fichajeTest];
    localStorage.setItem('fichajes', JSON.stringify(fichajes));

    console.log('✅ Fichaje de prueba creado:');
    console.log('   👤 Empleado:', fichajeTest.employee);
    console.log('   📋 Tipo:', fichajeTest.type);
    console.log('   📅 Fecha:', hace30min.toLocaleString('es-ES'));
    console.log('⏰ Debería mostrar aproximadamente 30 minutos');

    // Test directo de la función
    console.log('🔍 === TEST DIRECTO DE LA FUNCIÓN ===');
    const resultado = calcularTiempoAcumulado('Asera', ahora, fichajes);
    console.log('📊 Resultado función:', resultado);

    // Cargar fichajes para ver el resultado en la tabla
    cargarFichajes();

    console.log('🧪 === FIN PRUEBA ===');
};

// Función para ver todos los fichajes actuales (solo para desarrollo, mantiene localStorage)
window.verFichajes = async function () {
    let fichajes = [];
    try {
        const res = await fetch('/api/data/fichajes');
        const data = await res.json();
        if (Array.isArray(data)) {
            fichajes = data;
        } else if (data && Array.isArray(data.fichajes)) {
            fichajes = data.fichajes;
        }
    } catch (e) {
        console.error('Error al obtener fichajes del backend:', e);
    }
    console.log('📊 === FICHAJES ACTUALES ===');
    console.log('Total:', fichajes.length);
    fichajes.forEach((f, i) => {
        console.log(`${i + 1}. ${f.employee} - ${f.type} - ${new Date(f.timestamp).toLocaleString('es-ES')}`);
    });
    console.log('📊 === FIN FICHAJES ===');
};

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    cargarEmpleados();
    cargarFichajes();
    setInterval(actualizarReloj, 1000);
    actualizarReloj();

    // Actualizar contadores de tiempo cada 10 segundos para pruebas (luego cambiar a 30)
    setInterval(actualizarContadoresTiempo, 10000);

    // Mensaje de debug en consola
    console.log('🚀 Sistema de fichajes inicializado');
    console.log('💡 Para probar el contador: probarContadorTiempo()');
});
