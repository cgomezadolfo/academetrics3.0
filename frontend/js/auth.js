// EduMetrics Auth Module
class AuthManager {
    constructor() {
        this.apiBaseUrl = 'http://localhost:3000/api';
        this.token = localStorage.getItem('authToken');
        this.user = JSON.parse(localStorage.getItem('user') || 'null');
    }

    // Realizar login
    async login(email, password) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error en el login');
            }

            // Guardar token y usuario en localStorage
            this.token = data.token;
            this.user = data.user;
            
            localStorage.setItem('authToken', this.token);
            localStorage.setItem('user', JSON.stringify(this.user));

            return { success: true, user: this.user };
        } catch (error) {
            console.error('Error en login:', error);
            throw error;
        }
    }

    // Realizar logout
    logout() {
        this.token = null;
        this.user = null;
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        
        // Redirigir al login
        window.location.href = 'index.html';
    }

    // Verificar si está autenticado
    isAuthenticated() {
        return !!(this.token && this.user);
    }

    // Obtener usuario actual
    getCurrentUser() {
        return this.user;
    }

    // Obtener token
    getToken() {
        return this.token;
    }

    // Verificar rol del usuario
    hasRole(role) {
        if (!this.user || !this.user.rol) return false;
        return this.user.rol.nombre === role;
    }

    // Verificar si tiene alguno de los roles especificados
    hasAnyRole(roles) {
        if (!this.user || !this.user.rol) return false;
        return roles.includes(this.user.rol.nombre);
    }    // Realizar petición autenticada
    async authenticatedFetch(url, options = {}) {
        if (!this.token) {
            throw new Error('No hay token de autenticación');
        }        // Construir URL completa - solo agregar baseUrl si no es una URL completa
        const fullUrl = url.startsWith('http') ? url : `${this.apiBaseUrl}${url}`;

        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`,
                'user-id': this.user?.id?.toString() || ''
            }
        };

        const mergedOptions = {
            ...defaultOptions,
            ...options,
            headers: {
                ...defaultOptions.headers,
                ...(options.headers || {})
            }
        };

        try {
            const response = await fetch(fullUrl, mergedOptions);

            // Si no está autorizado, hacer logout
            if (response.status === 401) {
                this.logout();
                return;
            }

            return response;
        } catch (error) {
            console.error('Error en petición autenticada:', error);
            throw error;
        }
    }

    // Obtener información del perfil
    async getProfile() {
        try {
            const response = await this.authenticatedFetch(`${this.apiBaseUrl}/auth/profile`);
            
            if (!response.ok) {
                throw new Error('Error al obtener el perfil');
            }

            const profileData = await response.json();
            return profileData;
        } catch (error) {
            console.error('Error al obtener perfil:', error);
            throw error;
        }
    }

    // Cambiar contraseña
    async changePassword(currentPassword, newPassword) {
        try {
            const response = await this.authenticatedFetch(`${this.apiBaseUrl}/auth/change-password`, {
                method: 'POST',
                body: JSON.stringify({
                    currentPassword,
                    newPassword
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error al cambiar contraseña');
            }

            return { success: true, message: data.message };
        } catch (error) {
            console.error('Error al cambiar contraseña:', error);
            throw error;
        }
    }

    // Obtener nombre para mostrar
    getDisplayName() {
        if (!this.user) return 'Usuario';
        return this.user.nombre || this.user.email || 'Usuario';
    }

    // Obtener rol para mostrar
    getRoleName() {
        if (!this.user || !this.user.rol) return 'Sin rol';
        return this.user.rol.nombre;
    }

    // Obtener colegio para mostrar
    getCollegeName() {
        if (!this.user || !this.user.colegio) return 'Sin colegio';
        return this.user.colegio.nombre;
    }

    // Verificar si debe redirigir al dashboard
    redirectToDashboard() {
        if (this.isAuthenticated()) {
            const role = this.getRoleName();
            
            // Determinar la página de dashboard según el rol
            let dashboardPage = 'dashboard/admin.html'; // Default
            
            switch (role) {
                case 'Superadmin':
                    dashboardPage = 'dashboard/superadmin.html';
                    break;
                case 'Admin':
                    dashboardPage = 'dashboard/admin.html';
                    break;
                case 'UTP':
                    dashboardPage = 'dashboard/utp.html';
                    break;
                case 'Profesor':
                    dashboardPage = 'dashboard/profesor.html';
                    break;
                case 'Estudiante':
                    dashboardPage = 'dashboard/estudiante.html';
                    break;
            }
            
            window.location.href = dashboardPage;
        }
    }

    // Proteger página (verificar autenticación)
    protectPage() {
        if (!this.isAuthenticated()) {
            window.location.href = '../index.html';
        }
    }
}

// Crear instancia global
window.authManager = new AuthManager();

// Verificar autenticación al cargar cualquier página
document.addEventListener('DOMContentLoaded', function() {
    // Si estamos en la página de login y ya estamos autenticados, redirigir
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        if (window.authManager.isAuthenticated()) {
            window.authManager.redirectToDashboard();
        }
    }
    
    // Si estamos en una página del dashboard, protegerla
    if (window.location.pathname.includes('dashboard/')) {
        window.authManager.protectPage();
    }
});
