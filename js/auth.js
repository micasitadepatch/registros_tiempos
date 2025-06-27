// Sistema de Autenticación - Mi Casita de Patch
class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.userDb = this.initializeUsers();
        this.sessionKey = 'miCasitaPatch_session';
        this.init();
    }

    // Inicializar usuarios por defecto
    initializeUsers() {
        // Usuarios correctos del sistema
        const correctUsers = {
            'asera': {
                name: 'Asera Jiménez',
                role: 'employee',
                password: '123456',
                fullAccess: false
            },
            'eva': {
                name: 'Eva Huércano',
                role: 'admin',
                password: '090906',
                fullAccess: true
            },
            'admin': {
                name: 'Juanma',
                role: 'admin',
                password: '090906',
                fullAccess: true
            }
        };

        // Cargar usuarios desde localStorage
        const savedUsers = localStorage.getItem('systemUsers');
        if (savedUsers) {
            try {
                const loadedUsers = JSON.parse(savedUsers);
                const expectedUsers = ['asera', 'eva', 'admin'];
                const currentUsers = Object.keys(loadedUsers);

                // Verificar si tenemos usuarios incorrectos o duplicados
                const hasIncorrectUsers = currentUsers.some(user => !expectedUsers.includes(user)) ||
                    expectedUsers.some(user => !currentUsers.includes(user)) ||
                    currentUsers.length !== expectedUsers.length;

                if (hasIncorrectUsers) {
                    console.log('⚠️ Usuarios incorrectos o duplicados detectados, corrigiendo...');
                    console.log('   Usuarios encontrados:', currentUsers);
                    console.log('   Usuarios esperados:', expectedUsers);
                    this.saveUsers(correctUsers);
                    return correctUsers;
                } else {
                    console.log('✅ Usuarios correctos cargados desde localStorage');
                    return loadedUsers;
                }
            } catch (error) {
                console.error('Error al cargar usuarios guardados:', error);
                this.saveUsers(correctUsers);
                return correctUsers;
            }
        }

        // No hay usuarios guardados, crear los correctos
        console.log('📋 Creando usuarios correctos por primera vez...');
        this.saveUsers(correctUsers);
        return correctUsers;
    }

    // Guardar usuarios en localStorage
    saveUsers(users = this.userDb) {
        try {
            localStorage.setItem('systemUsers', JSON.stringify(users));
        } catch (error) {
            console.error('Error al guardar usuarios:', error);
        }
    }

    // Inicializar sistema
    init() {
        this.loadUserList();
        this.bindEvents();
        this.checkExistingSession();
    }

    // Cargar lista de usuarios en el select
    loadUserList() {
        console.log('👥 Cargando lista de usuarios...');
        const userSelect = document.getElementById('loginUsuario');

        if (!userSelect) {
            console.error('❌ Select de usuarios no encontrado');
            return;
        }

        console.log('📋 Select encontrado, limpiando opciones...');
        userSelect.innerHTML = '<option value="">Seleccionar usuario...</option>';

        console.log('👤 Usuarios disponibles:', Object.keys(this.userDb).length);
        Object.entries(this.userDb).forEach(([username, userData]) => {
            const option = document.createElement('option');
            option.value = username;
            option.textContent = `${userData.name} ${userData.role === 'admin' ? '👑' : '👤'}`;
            userSelect.appendChild(option);
            console.log(`✅ Añadido: ${username} - ${userData.name}`);
        });

        console.log(`✅ Lista de usuarios cargada: ${userSelect.options.length - 1} usuarios`);
    }

    // Vincular eventos
    bindEvents() {
        console.log('🔗 Vinculando eventos...');
        const loginForm = document.getElementById('loginForm');
        const logoutBtn = document.getElementById('logoutBtn');

        if (loginForm) {
            console.log('✅ Formulario de login encontrado, añadiendo listener...');
            loginForm.addEventListener('submit', (e) => {
                console.log('📤 Evento submit recibido en formulario de login');
                this.handleLogin(e);
            });

            // También añadir listener al botón específicamente
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            if (submitBtn) {
                console.log('✅ Botón submit encontrado, añadiendo listener adicional...');
                submitBtn.addEventListener('click', (e) => {
                    console.log('🖱️ Click detectado en botón de login');
                    // Si el formulario no se envía automáticamente, forzarlo
                    setTimeout(() => {
                        const form = e.target.closest('form');
                        if (form) {
                            console.log('🔄 Forzando envío del formulario...');
                            const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
                            form.dispatchEvent(submitEvent);
                        }
                    }, 10);
                });
            } else {
                console.error('❌ Botón submit NO encontrado');
            }
        } else {
            console.error('❌ Formulario de login NO encontrado');
        }

        if (logoutBtn) {
            console.log('✅ Botón logout encontrado, añadiendo listener...');
            logoutBtn.addEventListener('click', () => this.logout());
        } else {
            console.log('⚠️ Botón logout no encontrado (normal si no hay usuario logueado)');
        }

        // Autocompletado de contraseña para testing
        const userSelect = document.getElementById('loginUsuario');
        const passwordInput = document.getElementById('loginPassword');

        if (userSelect && passwordInput) {
            userSelect.addEventListener('change', (e) => {
                const username = e.target.value;
                if (username && this.userDb[username]) {
                    // Solo para desarrollo - en producción esto no debería estar
                    console.log(`💡 Contraseña para ${username}: ${this.userDb[username].password}`);
                }
            });
        }
    }

    // Verificar sesión existente al cargar
    checkExistingSession() {
        console.log('🔍 Verificando sesión existente...');
        const session = localStorage.getItem(this.sessionKey);
        console.log('🔍 Sesión encontrada:', session ? 'Sí' : 'No');

        if (session) {
            try {
                const sessionData = JSON.parse(session);
                const user = this.userDb[sessionData.username];
                const sessionAge = Date.now() - sessionData.timestamp;
                const maxAge = 24 * 60 * 60 * 1000; // 24 horas

                console.log('🔍 Datos de sesión:', {
                    username: sessionData.username,
                    timestamp: new Date(sessionData.timestamp).toLocaleString(),
                    ageHours: Math.round(sessionAge / (60 * 60 * 1000)),
                    userExists: !!user,
                    isValid: sessionAge < maxAge
                });

                if (user && sessionAge < maxAge) {
                    // Sesión válida (24 horas)
                    console.log('✅ Sesión válida encontrada, auto-login para:', user.name);
                    this.currentUser = { username: sessionData.username, ...user };
                    this.showMainInterface();
                    return;
                } else {
                    console.log('❌ Sesión expirada o usuario no válido, limpiando...');
                    localStorage.removeItem(this.sessionKey);
                }
            } catch (error) {
                console.error('❌ Error al verificar sesión:', error);
                localStorage.removeItem(this.sessionKey);
            }
        }

        // No hay sesión válida, mostrar login
        console.log('🔐 Mostrando modal de login...');
        this.showLoginModal();
    }

    // Manejar login
    async handleLogin(event) {
        console.log('🔐 === HANDLE LOGIN LLAMADO ===');
        console.log('🔐 Event:', event.type, event.target.tagName);

        event.preventDefault();
        console.log('🔐 preventDefault ejecutado');
        console.log('🔐 Iniciando proceso de login...');

        const usernameElement = document.getElementById('loginUsuario');
        const passwordElement = document.getElementById('loginPassword');

        console.log('🔍 Elementos del formulario:');
        console.log('   - usernameElement:', !!usernameElement, usernameElement?.tagName);
        console.log('   - passwordElement:', !!passwordElement, passwordElement?.tagName);

        if (!usernameElement || !passwordElement) {
            console.error('❌ Elementos del formulario no encontrados');
            console.error('   - usernameElement:', usernameElement);
            console.error('   - passwordElement:', passwordElement);
            this.showError('Error en el formulario de login');
            return;
        }

        const username = usernameElement.value;
        const password = passwordElement.value;

        console.log('📝 Valores leídos:');
        console.log('   - username:', `"${username}"`);
        console.log('   - password:', `"${password}" (length: ${password.length})`);

        console.log('🔐 Datos ingresados:', { username, passwordLength: password.length });
        console.log('🔐 Usuarios disponibles:', Object.keys(this.userDb));

        if (!username || !password) {
            console.log('❌ Campos incompletos');
            this.showError('Por favor, completa todos los campos');
            return;
        }

        if (password.length !== 6 || !/^\d{6}$/.test(password)) {
            console.log('❌ Formato de contraseña incorrecto');
            this.showError('La contraseña debe tener exactamente 6 dígitos');
            return;
        }

        const user = this.userDb[username];
        console.log('🔐 Usuario encontrado:', user ? 'Sí' : 'No');

        if (user) {
            console.log('🔐 Contraseña esperada:', user.password);
            console.log('🔐 Contraseña ingresada:', password);
        }

        if (!user || user.password !== password) {
            console.log('❌ Credenciales incorrectas');
            this.showError('Usuario o contraseña incorrectos');
            return;
        }

        // Login exitoso
        console.log('✅ Credenciales correctas, iniciando sesión...');
        this.currentUser = { username, ...user };
        this.createSession(username);
        this.showMainInterface();

        console.log(`✅ Login exitoso: ${user.name} (${user.role})`);
    }

    // Crear sesión
    createSession(username) {
        const sessionData = {
            username,
            timestamp: Date.now()
        };
        localStorage.setItem(this.sessionKey, JSON.stringify(sessionData));
    }

    // Mostrar interfaz principal
    showMainInterface() {
        console.log('✨ Iniciando transición a interfaz principal...');
        const loginModal = document.getElementById('loginModal');
        const currentUserSpan = document.getElementById('currentUser');

        // Primero actualizar información del usuario y desbloquear interfaz inmediatamente
        if (currentUserSpan && this.currentUser) {
            const roleIcon = this.currentUser.role === 'admin' ? '👑' : '👤';
            currentUserSpan.textContent = `${roleIcon} ${this.currentUser.name} (${this.currentUser.role === 'admin' ? 'Administrador' : 'Empleado'})`;
        }

        // Aplicar restricciones de rol inmediatamente (esto desbloquea la interfaz)
        this.applyRoleRestrictions();

        // Luego ocultar el modal de login INMEDIATAMENTE
        if (loginModal) {
            console.log('🎭 Ocultando modal de login...');

            // Ocultar inmediatamente sin transición para evitar problemas
            loginModal.style.display = 'none';
            loginModal.style.opacity = '0';
            loginModal.style.visibility = 'hidden';
            loginModal.classList.remove('show');

            // También ocultar el overlay si existe
            const modalOverlay = document.querySelector('.modal-overlay.login-modal');
            if (modalOverlay) {
                modalOverlay.style.display = 'none';
                modalOverlay.style.opacity = '0';
                modalOverlay.style.visibility = 'hidden';
            }

            console.log('✅ Modal de login ocultado completamente');
        } else {
            console.log('✅ Interfaz principal activada');
        }

        console.log('✅ Transición a interfaz principal completada');
    }

    // Aplicar restricciones según el rol
    applyRoleRestrictions() {
        if (!this.currentUser) {
            // Si no hay usuario, bloquear toda la interfaz
            this.blockMainInterface();
            return;
        }

        const menuButtons = document.querySelectorAll('.menu-btn');
        const isAdmin = this.currentUser.role === 'admin';

        menuButtons.forEach((button, index) => {
            // Los primeros 4 botones solo para admin
            if (index < 4 && !isAdmin) {
                button.classList.add('disabled');
                button.title = 'Acceso restringido - Solo administradores';
            } else {
                button.classList.remove('disabled');
                button.title = '';
            }
        });

        // Desbloquear la interfaz principal
        this.unblockMainInterface();
        console.log(`🔐 Restricciones aplicadas para rol: ${this.currentUser.role}`);
    }

    // Bloquear interfaz principal cuando no hay usuario autenticado
    blockMainInterface() {
        const mainContent = document.querySelector('main');
        const header = document.querySelector('header');

        if (mainContent) {
            mainContent.style.transition = 'opacity 0.1s ease-out, filter 0.1s ease-out';
            mainContent.style.pointerEvents = 'none';
            mainContent.style.opacity = '0.3';
            mainContent.style.filter = 'blur(2px)';
        }

        if (header) {
            // Mantener solo el botón de logout visible pero deshabilitado
            const logoutBtn = header.querySelector('#logoutBtn');
            if (logoutBtn) {
                logoutBtn.style.transition = 'opacity 0.1s ease-out';
                logoutBtn.style.pointerEvents = 'none';
                logoutBtn.style.opacity = '0.5';
            }
        }

        console.log('🚫 Interfaz principal bloqueada - requiere autenticación');
    }

    // Desbloquear interfaz principal cuando hay usuario autenticado
    unblockMainInterface() {
        const mainContent = document.querySelector('main');
        const header = document.querySelector('header');

        if (mainContent) {
            mainContent.style.transition = 'opacity 0.15s ease-in, filter 0.15s ease-in';
            mainContent.style.pointerEvents = '';
            mainContent.style.opacity = '';
            mainContent.style.filter = '';

            // Limpiar transición después de completarse
            setTimeout(() => {
                if (mainContent.style.transition) {
                    mainContent.style.transition = '';
                }
            }, 150);
        }

        if (header) {
            const logoutBtn = header.querySelector('#logoutBtn');
            if (logoutBtn) {
                logoutBtn.style.transition = 'opacity 0.15s ease-in';
                logoutBtn.style.pointerEvents = '';
                logoutBtn.style.opacity = '';

                // Limpiar transición después de completarse
                setTimeout(() => {
                    if (logoutBtn.style.transition) {
                        logoutBtn.style.transition = '';
                    }
                }, 150);
            }
        }

        console.log('✅ Interfaz principal desbloqueada');
    }

    // Cerrar sesión
    logout() {
        console.log('🚪 Iniciando proceso de logout...');
        localStorage.removeItem(this.sessionKey);
        this.currentUser = null;

        // Limpiar información del usuario inmediatamente
        const currentUserSpan = document.getElementById('currentUser');
        if (currentUserSpan) {
            currentUserSpan.textContent = '';
        }

        // Bloquear interfaz inmediatamente
        this.blockMainInterface();

        // Mostrar modal de login INMEDIATAMENTE sin transiciones
        const loginModal = document.getElementById('loginModal');
        if (loginModal) {
            console.log('🎭 Mostrando modal de login tras logout...');

            // Recargar lista de usuarios
            this.loadUserList();

            // Mostrar inmediatamente
            loginModal.style.display = 'block';
            loginModal.style.opacity = '1';
            loginModal.style.visibility = 'visible';
            loginModal.style.transform = 'scale(1)';
            loginModal.style.zIndex = '10000';
            loginModal.classList.add('show');

            // Asegurar que el overlay también esté visible
            const modalOverlay = document.querySelector('.modal-overlay.login-modal');
            if (modalOverlay) {
                modalOverlay.style.display = 'flex';
                modalOverlay.style.opacity = '1';
                modalOverlay.style.visibility = 'visible';
            }

            console.log('✅ Modal de login mostrado tras logout');
        } else {
            console.error('❌ No se encontró el modal de login');
        }

        // Limpiar formulario
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.reset();
        }

        console.log('✅ Logout completado - modal de login activado');
    }

    // Mostrar modal de login
    showLoginModal() {
        const loginModal = document.getElementById('loginModal');
        if (loginModal) {
            // Cargar lista de usuarios cada vez que se muestra el modal
            this.loadUserList();

            // Preparar el modal para animación
            loginModal.style.display = 'block';
            loginModal.style.opacity = '0';
            loginModal.style.transform = 'scale(0.95)';

            // Forzar reflow para asegurar que los estilos se apliquen
            loginModal.offsetHeight;

            // Usar requestAnimationFrame para transición fluida
            requestAnimationFrame(() => {
                loginModal.style.transition = 'opacity 0.15s ease-out, transform 0.15s ease-out';
                loginModal.style.opacity = '1';
                loginModal.style.transform = 'scale(1)';
                loginModal.classList.add('show');

                // Limpiar transición después
                setTimeout(() => {
                    loginModal.style.transition = '';
                }, 150);
            });
        }
    }

    // Mostrar error
    showError(message) {
        console.error('🔐 Auth Error:', message);

        // Usar el sistema de toast si está disponible
        if (window.menuManager && window.menuManager.mostrarToast) {
            window.menuManager.mostrarToast(message, 'error');
        } else {
            // Crear toast básico si menuManager no está disponible
            const toast = document.createElement('div');
            toast.style.cssText = `
                position: fixed; top: 20px; right: 20px; z-index: 10000;
                background: #dc3545; color: white; padding: 12px 20px;
                border-radius: 5px; box-shadow: 0 4px 8px rgba(0,0,0,0.3);
                font-family: Arial, sans-serif; font-size: 14px;
                max-width: 300px; word-wrap: break-word;
            `;
            toast.textContent = message;
            document.body.appendChild(toast);

            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 5000);
        }
    }

    // Verificar si el usuario actual es admin
    isAdmin() {
        return this.currentUser && this.currentUser.role === 'admin';
    }

    // Obtener usuario actual
    getCurrentUser() {
        return this.currentUser;
    }

    // Verificar si existe un usuario
    verificarExistenciaUsuario(username) {
        return !!this.userDb[username];
    }

    // Crear usuario (versión mejorada)
    crearUsuario(username, name, role, password) {
        console.log(`🔧 Creando usuario: ${username} (${name}) con rol ${role}`);

        // Validaciones
        if (!username || !name || !role || !password) {
            throw new Error('Todos los campos son requeridos');
        }

        if (this.userDb[username]) {
            throw new Error('El usuario ya existe');
        }

        if (!/^\d{6}$/.test(password)) {
            throw new Error('La contraseña debe tener exactamente 6 dígitos');
        }

        if (!['admin', 'employee'].includes(role)) {
            throw new Error('El rol debe ser "admin" o "employee"');
        }

        // Crear usuario
        const userData = {
            name,
            role,
            password,
            fullAccess: role === 'admin'
        };

        this.userDb[username] = userData;
        this.saveUsers();
        this.loadUserList();

        console.log(`✅ Usuario ${username} creado exitosamente`);
        return true;
    }

    // Añadir nuevo usuario (solo admin) - versión legacy
    addUser(username, userData) {
        if (!this.isAdmin()) {
            this.showError('Solo los administradores pueden añadir usuarios');
            return false;
        }

        if (this.userDb[username]) {
            this.showError('El usuario ya existe');
            return false;
        }

        this.userDb[username] = userData;
        this.saveUsers();
        this.loadUserList();

        console.log(`✅ Usuario ${username} añadido exitosamente`);
        return true;
    }

    // Cambiar contraseña
    changePassword(username, newPassword) {
        if (!this.userDb[username]) {
            this.showError('Usuario no encontrado');
            return false;
        }

        if (!/^\d{6}$/.test(newPassword)) {
            this.showError('La contraseña debe tener exactamente 6 dígitos');
            return false;
        }

        this.userDb[username].password = newPassword;
        this.saveUsers();

        console.log(`✅ Contraseña cambiada para ${username}`);
        return true;
    }
}

// Funciones de utilidad para la consola
window.mostrarUsuarios = function () {
    if (!window.authSystem) {
        console.error('❌ Sistema de autenticación no disponible');
        return;
    }

    console.log('👥 === USUARIOS DEL SISTEMA ===');
    Object.entries(window.authSystem.userDb).forEach(([username, userData]) => {
        const roleIcon = userData.role === 'admin' ? '👑' : '👤';
        console.log(`${roleIcon} ${username}: ${userData.name} (${userData.role}) - Contraseña: ${userData.password}`);
    });
    console.log('👥 === FIN USUARIOS ===');
};

window.crearUsuario = function (username, name, role = 'employee', password = '000000') {
    if (!window.authSystem) {
        console.error('❌ Sistema de autenticación no disponible');
        return;
    }

    const userData = {
        name,
        role,
        password,
        fullAccess: role === 'admin'
    };

    return window.authSystem.addUser(username, userData);
};

window.cambiarPassword = function (username, newPassword) {
    if (!window.authSystem) {
        console.error('❌ Sistema de autenticación no disponible');
        return;
    }

    return window.authSystem.changePassword(username, newPassword);
};

// Función de emergencia para forzar logout
window.forzarLogout = function () {
    console.log('🚨 Forzando logout...');
    localStorage.removeItem('miCasitaPatch_session');
    if (window.authSystem) {
        window.authSystem.currentUser = null;
        window.authSystem.showLoginModal();
    }
    location.reload();
};

// Función para verificar estado del auth
window.verificarAuth = function () {
    console.log('🔍 === ESTADO DE AUTENTICACIÓN ===');
    console.log('authSystem:', !!window.authSystem);
    console.log('currentUser:', window.authSystem?.currentUser);
    console.log('sesión localStorage:', localStorage.getItem('miCasitaPatch_session'));
    console.log('Modal visible:', document.getElementById('loginModal')?.style.display !== 'none');
    console.log('🔍 === FIN ESTADO ===');
};

// Función para debug del login
window.debugLogin = function () {
    console.log('🔧 === DEBUG DE LOGIN ===');

    // Verificar elementos del formulario
    const loginForm = document.getElementById('loginForm');
    const usernameElement = document.getElementById('loginUsuario');
    const passwordElement = document.getElementById('loginPassword');
    const submitBtn = document.querySelector('#loginForm button[type="submit"]');

    console.log('📋 Formulario:', !!loginForm);
    console.log('👤 Campo usuario:', !!usernameElement, usernameElement?.value);
    console.log('🔑 Campo contraseña:', !!passwordElement, passwordElement?.value);
    console.log('🚀 Botón submit:', !!submitBtn);

    // Verificar eventos
    if (loginForm) {
        console.log('📋 Eventos del formulario:');
        console.log('   - onsubmit:', typeof loginForm.onsubmit);

        // Verificar listeners
        const events = getEventListeners ? getEventListeners(loginForm) : 'No disponible en esta consola';
        console.log('   - Event listeners:', events);
    }

    // Verificar usuarios disponibles
    if (window.authSystem) {
        console.log('👥 Usuarios disponibles:', Object.keys(window.authSystem.userDb));
        Object.entries(window.authSystem.userDb).forEach(([username, userData]) => {
            console.log(`   - ${username}: ${userData.name} (${userData.role}) - Password: ${userData.password}`);
        });
    }

    console.log('🔧 === FIN DEBUG LOGIN ===');
};

// Función para probar login manual
window.probarLogin = function (username, password) {
    console.log(`🧪 Probando login: ${username} / ${password}`);

    const usernameElement = document.getElementById('loginUsuario');
    const passwordElement = document.getElementById('loginPassword');

    if (usernameElement && passwordElement) {
        usernameElement.value = username;
        passwordElement.value = password;

        console.log('✅ Campos completados, enviando formulario...');

        // Simular evento de submit
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
            loginForm.dispatchEvent(submitEvent);
        }
    } else {
        console.error('❌ No se encontraron los campos del formulario');
    }
};

// Función para limpiar usuarios duplicados y mantener solo los correctos
// Función para testear el botón de login directamente
window.testearBotonLogin = function () {
    console.log('🧪 === TESTEANDO BOTÓN DE LOGIN ===');

    const loginForm = document.getElementById('loginForm');
    const submitBtn = document.querySelector('#loginForm button[type="submit"]');
    const usernameSelect = document.getElementById('loginUsuario');
    const passwordInput = document.getElementById('loginPassword');

    console.log('📋 Formulario:', !!loginForm);
    console.log('🚀 Botón submit:', !!submitBtn);
    console.log('👤 Select usuario:', !!usernameSelect);
    console.log('🔑 Input contraseña:', !!passwordInput);

    if (submitBtn) {
        console.log('🖱️ Simulando click en botón...');

        // Llenar campos para testing
        if (usernameSelect && passwordInput) {
            usernameSelect.value = 'eva';
            passwordInput.value = '090906';
            console.log('✅ Campos llenados: eva / 090906');
        }

        // Simular click
        submitBtn.click();
        console.log('🔄 Click simulado');
    } else {
        console.error('❌ No se pudo encontrar el botón submit');
    }

    console.log('🧪 === FIN TEST BOTÓN ===');
};

// Función para forzar login manualmente
// Función para verificar estado visual del modal
window.verificarEstadoModal = function () {
    console.log('👁️ === VERIFICANDO ESTADO VISUAL DEL MODAL ===');

    const loginModal = document.getElementById('loginModal');
    const modalOverlay = document.querySelector('.modal-overlay.login-modal');
    const mainContent = document.querySelector('main');
    const currentUserSpan = document.getElementById('currentUser');

    console.log('📋 Elementos encontrados:');
    console.log('   - loginModal:', !!loginModal);
    console.log('   - modalOverlay:', !!modalOverlay);
    console.log('   - mainContent:', !!mainContent);
    console.log('   - currentUserSpan:', !!currentUserSpan);

    if (loginModal) {
        console.log('🎭 Estado del modal de login:');
        console.log('   - display:', loginModal.style.display || 'default');
        console.log('   - opacity:', loginModal.style.opacity || 'default');
        console.log('   - visibility:', loginModal.style.visibility || 'default');
        console.log('   - classes:', Array.from(loginModal.classList));
        console.log('   - zIndex:', getComputedStyle(loginModal).zIndex);
    }

    if (modalOverlay) {
        console.log('📄 Estado del overlay:');
        console.log('   - display:', modalOverlay.style.display || 'default');
        console.log('   - opacity:', modalOverlay.style.opacity || 'default');
        console.log('   - visibility:', modalOverlay.style.visibility || 'default');
    }

    if (mainContent) {
        console.log('🏠 Estado del contenido principal:');
        console.log('   - opacity:', mainContent.style.opacity || 'default');
        console.log('   - pointerEvents:', mainContent.style.pointerEvents || 'default');
        console.log('   - filter:', mainContent.style.filter || 'default');
    }

    if (currentUserSpan) {
        console.log('👤 Usuario actual mostrado:', `"${currentUserSpan.textContent}"`);
    }

    console.log('🔐 AuthSystem currentUser:', window.authSystem?.currentUser?.name || 'No logueado');
    console.log('👁️ === FIN VERIFICACIÓN VISUAL ===');
};

// Función para forzar ocultación del modal
window.forzarOcultarModal = function () {
    console.log('🚫 === FORZANDO OCULTACIÓN DEL MODAL ===');

    const loginModal = document.getElementById('loginModal');
    const modalOverlay = document.querySelector('.modal-overlay.login-modal');

    if (loginModal) {
        loginModal.style.display = 'none !important';
        loginModal.style.opacity = '0';
        loginModal.style.visibility = 'hidden';
        loginModal.style.zIndex = '-1000';
        loginModal.classList.remove('show');
        console.log('✅ Modal principal ocultado');
    }

    if (modalOverlay) {
        modalOverlay.style.display = 'none !important';
        modalOverlay.style.opacity = '0';
        modalOverlay.style.visibility = 'hidden';
        modalOverlay.style.zIndex = '-1000';
        console.log('✅ Overlay ocultado');
    }

    // Desbloquear la interfaz por si acaso
    if (window.authSystem) {
        window.authSystem.unblockMainInterface();
        console.log('✅ Interfaz desbloqueada');
    }

    console.log('🚫 === OCULTACIÓN FORZADA COMPLETADA ===');
};

// Función para probar logout
window.probarLogout = function () {
    console.log('🚪 === PROBANDO LOGOUT ===');

    if (!window.authSystem) {
        console.error('❌ AuthSystem no disponible');
        return;
    }

    if (!window.authSystem.currentUser) {
        console.log('⚠️ No hay usuario logueado, haciendo login primero...');
        window.authSystem.currentUser = {
            username: 'eva',
            name: 'Eva Huércano',
            role: 'admin',
            fullAccess: true
        };
        window.authSystem.createSession('eva');
        window.authSystem.showMainInterface();

        setTimeout(() => {
            console.log('🔄 Ahora haciendo logout...');
            window.authSystem.logout();
        }, 1000);
    } else {
        console.log('👤 Usuario actual:', window.authSystem.currentUser.name);
        console.log('🔄 Haciendo logout...');
        window.authSystem.logout();
    }

    console.log('🚪 === FIN PRUEBA LOGOUT ===');
};

window.forzarLogin = function (username = 'eva', password = '090906') {
    console.log(`🚀 === FORZANDO LOGIN: ${username} ===`);

    if (!window.authSystem) {
        console.error('❌ AuthSystem no disponible');
        return;
    }

    // Simular el proceso de login directamente
    const user = window.authSystem.userDb[username];
    console.log('👤 Usuario encontrado:', !!user);

    if (user && user.password === password) {
        console.log('✅ Credenciales válidas, forzando login...');

        // Establecer usuario actual
        window.authSystem.currentUser = { username, ...user };

        // Crear sesión
        window.authSystem.createSession(username);

        // Mostrar interfaz principal
        window.authSystem.showMainInterface();

        console.log('✅ Login forzado completado');
    } else {
        console.error('❌ Credenciales incorrectas');
        console.log('   - Usuario existe:', !!user);
        if (user) {
            console.log('   - Password esperada:', user.password);
            console.log('   - Password ingresada:', password);
        }
    }
};

window.limpiarUsuarios = function () {
    console.log('🧹 === LIMPIANDO USUARIOS DUPLICADOS ===');

    if (!window.authSystem) {
        console.error('❌ Sistema de autenticación no disponible');
        return;
    }

    // Usuarios correctos que deben existir
    const usuariosCorrectos = {
        'asera': {
            name: 'Asera Jiménez',
            role: 'employee',
            password: '123456',
            fullAccess: false
        },
        'eva': {
            name: 'Eva Huércano',
            role: 'admin',
            password: '090906',
            fullAccess: true
        },
        'admin': {
            name: 'Juanma',
            role: 'admin',
            password: '090906',
            fullAccess: true
        }
    };

    console.log('📋 Usuarios antes de limpiar:', Object.keys(window.authSystem.userDb).length);

    // Reemplazar completamente la base de datos
    window.authSystem.userDb = usuariosCorrectos;

    // Guardar los cambios
    window.authSystem.saveUsers();

    console.log('✅ Usuarios después de limpiar:', Object.keys(window.authSystem.userDb).length);
    console.log('👥 Usuarios correctos:');
    Object.entries(usuariosCorrectos).forEach(([username, userData]) => {
        const roleIcon = userData.role === 'admin' ? '👑' : '👤';
        console.log(`   ${roleIcon} ${username}: ${userData.name} (${userData.role}) - Password: ${userData.password}`);
    });

    // Recargar la lista en el select
    window.authSystem.loadUserList();

    console.log('🧹 === LIMPIEZA COMPLETADA ===');
    console.log('💡 Ahora puedes usar: asera/123456, eva/090906, admin/090906');
};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.authSystem = new AuthSystem();
    console.log('🔐 Sistema de autenticación inicializado');
    console.log('💡 Funciones disponibles: mostrarUsuarios(), crearUsuario(), cambiarPassword(), forzarLogout(), verificarAuth()');

    // Bloquear interfaz inmediatamente hasta autenticación
    setTimeout(() => {
        if (!window.authSystem.currentUser) {
            window.authSystem.blockMainInterface();
        }
    }, 100);
});

// Verificación adicional de seguridad cada 5 segundos
setInterval(() => {
    if (window.authSystem && !window.authSystem.currentUser) {
        const loginModal = document.getElementById('loginModal');
        if (!loginModal || loginModal.style.display === 'none') {
            console.log('🚨 SEGURIDAD: Usuario no autenticado detectado, mostrando modal de login');
            window.authSystem.showLoginModal();
            window.authSystem.blockMainInterface();
        }
    }
}, 5000); 