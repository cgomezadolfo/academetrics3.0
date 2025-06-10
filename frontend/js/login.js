// Login Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const togglePasswordBtn = document.getElementById('togglePassword');
    const loginSpinner = document.getElementById('loginSpinner');
    const loginText = document.getElementById('loginText');
    const rememberMeCheckbox = document.getElementById('rememberMe');

    // Toggle password visibility
    togglePasswordBtn.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        const icon = togglePasswordBtn.querySelector('i');
        icon.className = type === 'password' ? 'bi bi-eye' : 'bi bi-eye-slash';
    });

    // Handle form submission
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        const password = passwordInput.value;

        // Validación básica
        if (!email || !password) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos requeridos',
                text: 'Por favor, completa todos los campos.',
                confirmButtonColor: '#4e73df'
            });
            return;
        }

        // Validar formato de email
        if (!isValidEmail(email)) {
            Swal.fire({
                icon: 'error',
                title: 'Email inválido',
                text: 'Por favor, ingresa un email válido.',
                confirmButtonColor: '#4e73df'
            });
            return;
        }

        // Mostrar loading
        setLoadingState(true);

        try {
            // Intentar login
            const result = await window.authManager.login(email, password);
            
            if (result.success) {
                // Login exitoso
                Swal.fire({
                    icon: 'success',
                    title: '¡Bienvenido!',
                    text: `Hola ${result.user.nombre || result.user.email}`,
                    timer: 1500,
                    showConfirmButton: false,
                    confirmButtonColor: '#4e73df'
                }).then(() => {
                    // Redirigir al dashboard apropiado
                    window.authManager.redirectToDashboard();
                });
            }
        } catch (error) {
            // Error en login
            console.error('Error en login:', error);
            
            let errorMessage = 'Ocurrió un error inesperado. Inténtalo de nuevo.';
            
            if (error.message.includes('Invalid credentials') || 
                error.message.includes('Usuario no encontrado') ||
                error.message.includes('Contraseña incorrecta')) {
                errorMessage = 'Email o contraseña incorrectos.';
            } else if (error.message.includes('Usuario inactivo')) {
                errorMessage = 'Tu cuenta está inactiva. Contacta al administrador.';
            }
            
            Swal.fire({
                icon: 'error',
                title: 'Error de autenticación',
                text: errorMessage,
                confirmButtonColor: '#4e73df'
            });
        } finally {
            setLoadingState(false);
        }
    });

    // Función para validar email
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Función para manejar estado de loading
    function setLoadingState(loading) {
        if (loading) {
            loginSpinner.classList.remove('d-none');
            loginText.textContent = 'Iniciando sesión...';
            loginForm.querySelectorAll('input, button').forEach(el => el.disabled = true);
        } else {
            loginSpinner.classList.add('d-none');
            loginText.textContent = 'Iniciar Sesión';
            loginForm.querySelectorAll('input, button').forEach(el => el.disabled = false);
        }
    }

    // Cargar credenciales guardadas si existe "Remember Me"
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
        emailInput.value = savedEmail;
        rememberMeCheckbox.checked = true;
    }

    // Manejar "Remember Me"
    rememberMeCheckbox.addEventListener('change', function() {
        if (this.checked && emailInput.value) {
            localStorage.setItem('rememberedEmail', emailInput.value);
        } else {
            localStorage.removeItem('rememberedEmail');
        }
    });

    // Actualizar remembered email cuando cambie el email
    emailInput.addEventListener('change', function() {
        if (rememberMeCheckbox.checked) {
            localStorage.setItem('rememberedEmail', this.value);
        }
    });

    // Efectos visuales
    document.querySelectorAll('.form-control').forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });

    // Easter egg: Konami code para llenar todos los campos de prueba
    let konamiCode = [];
    const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // ↑↑↓↓←→←→BA
    
    document.addEventListener('keydown', function(e) {
        konamiCode.push(e.keyCode);
        
        if (konamiCode.length > konamiSequence.length) {
            konamiCode.shift();
        }
        
        if (konamiCode.length === konamiSequence.length && 
            konamiCode.every((code, index) => code === konamiSequence[index])) {
            
            Swal.fire({
                icon: 'info',
                title: '¡Easter Egg!',
                text: '¡Has encontrado el código secreto! 🎉',
                confirmButtonColor: '#4e73df'
            });
            
            konamiCode = [];
        }
    });
});

// Función global para llenar credenciales de prueba
function fillCredentials(email, password) {
    document.getElementById('email').value = email;
    document.getElementById('password').value = password;
    
    // Pequeña animación para mostrar que se llenaron los campos
    [document.getElementById('email'), document.getElementById('password')].forEach(input => {
        input.style.backgroundColor = '#e8f5e8';
        setTimeout(() => {
            input.style.backgroundColor = '';
        }, 1000);
    });
    
    // Toast notification
    Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'info',
        title: 'Credenciales cargadas',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true
    });
}

// Función para mostrar información de usuarios de prueba
function showTestUsers() {
    Swal.fire({
        title: 'Usuarios de Prueba',
        html: `
            <div class="text-start">
                <h6><i class="bi bi-person-badge text-info"></i> Administradores:</h6>
                <ul class="list-unstyled ms-3 mb-3">
                    <li><strong>Superadmin:</strong> superadmin@edumetrics.com</li>
                    <li><strong>Admin:</strong> admin@sanpatricio.cl</li>
                    <li><strong>UTP:</strong> utp@sanpatricio.cl</li>
                </ul>
                
                <h6><i class="bi bi-person-workspace text-success"></i> Personal Educativo:</h6>
                <ul class="list-unstyled ms-3 mb-3">
                    <li><strong>Profesor:</strong> profesor@sanpatricio.cl</li>
                </ul>
                
                <h6><i class="bi bi-backpack text-warning"></i> Estudiantes:</h6>
                <ul class="list-unstyled ms-3 mb-3">
                    <li><strong>Estudiante:</strong> estudiante@sanpatricio.cl</li>
                </ul>
                
                <p class="text-muted small mt-3">
                    <i class="bi bi-info-circle"></i> 
                    Todas las contraseñas siguen el patrón: [rol]123
                </p>
            </div>
        `,
        confirmButtonColor: '#4e73df',
        width: 600
    });
}
