class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.token = null;
        this.sessionKey = 'miCasitaPatch_token';
        this.init();
    }

    async init() {
        this.loadTokenFromStorage();
        this.bindEvents();
        await this.checkSessionAndRoute();
    }

    bindEvents() {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', this.handleLogin.bind(this));
        }
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', this.logout.bind(this));
        }
    }

    loadTokenFromStorage() {
        this.token = localStorage.getItem(this.sessionKey);
    }

    async checkSessionAndRoute() {
        if (this.token) {
            try {
                const payload = JSON.parse(atob(this.token.split('.')[1]));
                if (payload.exp * 1000 < Date.now()) {
                    return this.logout(); // Token expirado
                }
                // Si hay un token válido, estamos logueados.
                this.currentUser = payload;
                this.showMainInterface();
            } catch (error) {
                this.logout(); // Token corrupto o inválido
            }
        } else {
            // Si no hay token, mostramos el login.
            await this.loadUserList();
            this.showLoginModal();
        }
    }

    async handleLogin(event) {
        event.preventDefault();
        const username = document.getElementById('loginUsuario').value;
        const password = document.getElementById('loginPassword').value;

        if (!username || !password) {
            return this.showError('Por favor, completa todos los campos.');
        }

        try {
            const response = await fetch('http://localhost:3001/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();
            if (!response.ok)
                throw new Error(data.error || 'Error en el servidor');

            // Lógica clave: guardar token y FORZAR recarga de la página.
            localStorage.setItem(this.sessionKey, data.token);
            window.location.reload();
        } catch (error) {
            this.showError(error.message || 'Credenciales incorrectas');
        }
    }

    async loadUserList() {
        try {
            const response = await fetch('http://localhost:3001/api/users');
            if (!response.ok) return;
            const users = await response.json();
            const userSelect = document.getElementById('loginUsuario');
            if (!userSelect) return;

            userSelect.innerHTML =
                '<option value="">Seleccionar usuario...</option>';
            users.forEach((user) => {
                const option = document.createElement('option');
                option.value = user.username;
                option.textContent = `${user.name} ${user.role === 'admin' ? '👑' : '👤'}`;
                userSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error al cargar usuarios:', error);
        }
    }

    logout() {
        localStorage.removeItem(this.sessionKey);
        this.currentUser = null;
        this.token = null;
        window.location.href = 'index.html';
    }

    showMainInterface() {
        const loginModal = document.getElementById('loginModal');
        if (loginModal) {
            loginModal.classList.remove('show');
            loginModal.style.display = 'none';
        }

        const currentUserSpan = document.getElementById('currentUser');
        if (currentUserSpan && this.currentUser) {
            const icon = this.currentUser.role === 'admin' ? '👑' : '👤';
            currentUserSpan.textContent = `${icon} ${this.currentUser.name}`;
        }
        this.applyRoleRestrictions();

        // **AVISAMOS** que el login fue exitoso. No hacemos nada más.
        document.body.dispatchEvent(new CustomEvent('authSuccess'));
    }

    showLoginModal() {
        const loginModal = document.getElementById('loginModal');
        if (loginModal) {
            loginModal.classList.add('show');
            loginModal.style.display = 'flex';
        }
    }

    applyRoleRestrictions() {
        const isAdmin = this.currentUser && this.currentUser.role === 'admin';
        const allAdminActions = [
            'crear-empleado',
            'fichaje-manual',
            'editar-fichajes',
            'eliminar-fichajes',
            'exportar',
            'imprimir',
        ];

        document
            .querySelectorAll('.menu-btn[data-action]')
            .forEach((button) => {
                const action = button.dataset.action;

                if (action === 'ver-fichajes') {
                    button.style.display = 'flex';
                    return;
                }

                if (allAdminActions.includes(action)) {
                    button.style.display = isAdmin ? 'flex' : 'none';
                }
            });
    }

    showError(message) {
        alert(message);
    }

    getToken() {
        return this.token;
    }
    getCurrentUser() {
        return this.currentUser;
    }
    isAdmin() {
        return this.currentUser && this.currentUser.role === 'admin';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.authSystem = new AuthSystem();
});
