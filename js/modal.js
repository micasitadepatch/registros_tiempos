class ModalManager {
    static show(title, content, onInit = null) {
        // Crear overlay y modal usando createElement para evitar IDs duplicados
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.style.display = 'flex';
        overlay.style.alignItems = 'flex-start';
        overlay.style.justifyContent = 'center';
        overlay.style.zIndex = '20000';

        const modal = document.createElement('div');
        modal.className = 'modal';
        // Forzar estilos inline para evitar que reglas CSS oculten el modal
        modal.style.display = 'flex';
        modal.style.zIndex = '20001';
        modal.style.opacity = '1';
        modal.style.visibility = 'visible';
        modal.style.transform = 'translateY(0)';

        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="modal-close" aria-label="Cerrar">&times;</button>
                </div>
                <div class="modal-body">${content}</div>
            </div>
        `;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // Evitar scroll del body mientras el modal esté abierto
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';

        const close = () => {
            overlay.classList.remove('show');
            modal.classList.remove('show');
            // Restaurar scroll
            document.documentElement.style.overflow = '';
            document.body.style.overflow = '';
            setTimeout(() => {
                if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
            }, 200);
        };

        // Cierres
        const closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) closeBtn.addEventListener('click', close);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) close();
        });

        // Mostrar con clases y forzar reflow
        requestAnimationFrame(() => {
            overlay.classList.add('show');
            modal.classList.add('show');
            // refuerzo inline por si alguna regla CSS sigue ocultándolo
            modal.style.display = 'flex';
            modal.style.opacity = '1';
            modal.style.visibility = 'visible';
        });

        // Log para depuración en consola del navegador
        console.debug('ModalManager.show: modal creado', { title, overlay, modal });

        // Inicializar contenido si hace falta
        if (typeof onInit === 'function') {
            try {
                onInit();
            } catch (err) {
                // asegurarnos de que errores en init no rompan la UI
                console.error('Error en onInit del modal:', err);
            }
        }

        return { close, overlay, modal };
    }
}

// exportar globalmente (ya está en window cuando se carga en navegador)
window.ModalManager = ModalManager;
