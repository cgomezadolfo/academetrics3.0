// Dashboard JavaScript
class Dashboard {
    constructor() {
        this.currentSection = 'dashboard';
        this.charts = {};
        this.init();
    }

    async init() {
        // Verificar autenticación
        if (!window.authManager.isAuthenticated()) {
            window.location.href = '../index.html';
            return;
        }

        // Cargar información del usuario
        this.loadUserInfo();
        
        // Configurar navegación
        this.setupNavigation();
        
        // Configurar eventos
        this.setupEventListeners();
        
        // Cargar datos del dashboard
        await this.loadDashboardData();
        
        // Inicializar gráficos
        this.initCharts();
    }

    loadUserInfo() {
        const user = window.authManager.getCurrentUser();
        
        document.getElementById('userName').textContent = user.nombre || user.email;
        document.getElementById('userRole').textContent = user.rol?.nombre || 'Sin rol';
        document.getElementById('userCollege').textContent = user.colegio?.nombre || 'Sin colegio';
    }

    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link[data-section]');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.getAttribute('data-section');
                this.showSection(section);
                
                // Update active nav item
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            });
        });
    }

    setupEventListeners() {
        // Logout button
        document.getElementById('logoutBtn').addEventListener('click', (e) => {
            e.preventDefault();
            this.logout();
        });

        // Refresh button
        document.getElementById('refreshBtn').addEventListener('click', () => {
            this.refreshCurrentSection();
        });

        // Quick action button
        document.getElementById('quickActionBtn').addEventListener('click', () => {
            this.showQuickActions();
        });
    }    showSection(sectionName) {
        // Hide all sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.add('d-none');
        });

        // Show selected section
        const targetSection = document.getElementById(`${sectionName}-section`);
        if (targetSection) {
            targetSection.classList.remove('d-none');
            this.currentSection = sectionName;
            
            // Update page title
            const titles = {
                'dashboard': 'Dashboard',
                'usuarios': 'Gestión de Usuarios',
                'cursos': 'Gestión de Cursos',
                'asignaturas': 'Gestión de Asignaturas',
                'estudiantes': 'Gestión de Estudiantes',
                'evaluaciones': 'Gestión de Evaluaciones',
                'reportes': 'Reportes y Estadísticas',
                'perfil': 'Mi Perfil'
            };
            
            document.getElementById('pageTitle').textContent = titles[sectionName] || 'EduMetrics';
            
            // Load section-specific data
            this.loadSectionData(sectionName);
        }
    }    loadSectionData(sectionName) {
        // Load data when switching to specific sections
        if (typeof adminDashboard !== 'undefined') {
            switch(sectionName) {
                case 'usuarios':
                    adminDashboard.loadUsers();
                    break;
                case 'cursos':
                    adminDashboard.loadCourses();
                    break;
                case 'asignaturas':
                    adminDashboard.loadSubjects();
                    break;
                case 'estudiantes':
                    adminDashboard.loadStudents();
                    break;
                case 'perfil':
                    if (typeof loadUserProfile !== 'undefined') {
                        loadUserProfile();
                    }
                    break;
                // Add more cases as needed
            }
        }
    }

    async loadDashboardData() {
        try {
            // Cargar estadísticas generales
            await Promise.all([
                this.loadUserStats(),
                this.loadStudentStats(),
                this.loadEvaluationStats(),
                this.loadCourseStats(),
                this.loadRecentActivity()
            ]);
        } catch (error) {
            console.error('Error cargando datos del dashboard:', error);
            this.showError('Error al cargar los datos del dashboard');
        }
    }

    async loadUserStats() {
        try {
            const response = await window.authManager.authenticatedFetch(
                `${window.authManager.apiBaseUrl}/usuarios`
            );
            
            if (response.ok) {
                const users = await response.json();
                document.getElementById('totalUsers').textContent = Array.isArray(users) ? users.length : 0;
            }
        } catch (error) {
            console.error('Error cargando estadísticas de usuarios:', error);
            document.getElementById('totalUsers').textContent = '0';
        }
    }

    async loadStudentStats() {
        try {
            const response = await window.authManager.authenticatedFetch(
                `${window.authManager.apiBaseUrl}/estudiantes`
            );
            
            if (response.ok) {
                const students = await response.json();
                document.getElementById('totalStudents').textContent = Array.isArray(students) ? students.length : 0;
            }
        } catch (error) {
            console.error('Error cargando estadísticas de estudiantes:', error);
            document.getElementById('totalStudents').textContent = '0';
        }
    }

    async loadEvaluationStats() {
        try {
            const response = await window.authManager.authenticatedFetch(
                `${window.authManager.apiBaseUrl}/evaluaciones`
            );
            
            if (response.ok) {
                const evaluations = await response.json();
                document.getElementById('totalEvaluations').textContent = Array.isArray(evaluations) ? evaluations.length : 0;
            }
        } catch (error) {
            console.error('Error cargando estadísticas de evaluaciones:', error);
            document.getElementById('totalEvaluations').textContent = '0';
        }
    }

    async loadCourseStats() {
        try {
            const response = await window.authManager.authenticatedFetch(
                `${window.authManager.apiBaseUrl}/cursos`
            );
            
            if (response.ok) {
                const courses = await response.json();
                document.getElementById('totalCourses').textContent = Array.isArray(courses) ? courses.length : 0;
            }
        } catch (error) {
            console.error('Error cargando estadísticas de cursos:', error);
            document.getElementById('totalCourses').textContent = '0';
        }
    }

    async loadRecentActivity() {
        const activityContainer = document.getElementById('recentActivity');
        
        // Simulamos actividad reciente por ahora
        const mockActivity = [
            {
                icon: 'bi-person-plus',
                color: 'success',
                text: 'Nuevo usuario registrado: profesor@sanpatricio.cl',
                time: 'Hace 2 horas'
            },
            {
                icon: 'bi-clipboard-check',
                color: 'info',
                text: 'Evaluación "Matemáticas Unidad 1" completada',
                time: 'Hace 4 horas'
            },
            {
                icon: 'bi-book',
                color: 'warning',
                text: 'Nuevo curso "Ciencias Naturales 8° Básico" creado',
                time: 'Ayer'
            },
            {
                icon: 'bi-mortarboard',
                color: 'primary',
                text: '25 estudiantes completaron evaluaciones hoy',
                time: 'Ayer'
            }
        ];

        activityContainer.innerHTML = mockActivity.map(activity => `
            <div class="list-group-item list-group-item-action">
                <div class="d-flex w-100 justify-content-between">
                    <div class="d-flex align-items-center">
                        <i class="bi ${activity.icon} text-${activity.color} me-3"></i>
                        <span>${activity.text}</span>
                    </div>
                    <small class="text-muted">${activity.time}</small>
                </div>
            </div>
        `).join('');
    }

    initCharts() {
        // Gráfico de evaluaciones por mes
        const evaluationsCtx = document.getElementById('evaluationsChart');
        if (evaluationsCtx) {
            this.charts.evaluations = new Chart(evaluationsCtx, {
                type: 'line',
                data: {
                    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
                    datasets: [{
                        label: 'Evaluaciones',
                        data: [12, 19, 8, 15, 22, 13],
                        borderColor: '#4e73df',
                        backgroundColor: 'rgba(78, 115, 223, 0.1)',
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: 'rgba(0, 0, 0, 0.05)'
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }
            });
        }

        // Gráfico de distribución por roles
        const rolesCtx = document.getElementById('rolesChart');
        if (rolesCtx) {
            this.charts.roles = new Chart(rolesCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Estudiantes', 'Profesores', 'UTP', 'Admins'],
                    datasets: [{
                        data: [65, 25, 7, 3],
                        backgroundColor: [
                            '#1cc88a',
                            '#36b9cc',
                            '#f6c23e',
                            '#e74a3b'
                        ],
                        borderWidth: 2,
                        borderColor: '#fff'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                padding: 20,
                                usePointStyle: true
                            }
                        }
                    }
                }
            });
        }
    }

    async refreshCurrentSection() {
        const refreshBtn = document.getElementById('refreshBtn');
        const originalText = refreshBtn.innerHTML;
        
        refreshBtn.innerHTML = '<i class="bi bi-arrow-clockwise spinner-border spinner-border-sm"></i> Actualizando...';
        refreshBtn.disabled = true;
        
        try {
            if (this.currentSection === 'dashboard') {
                await this.loadDashboardData();
            }
            
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: 'Datos actualizados',
                showConfirmButton: false,
                timer: 2000
            });
        } catch (error) {
            console.error('Error al actualizar:', error);
            this.showError('Error al actualizar los datos');
        } finally {
            refreshBtn.innerHTML = originalText;
            refreshBtn.disabled = false;
        }
    }

    showQuickActions() {
        const user = window.authManager.getCurrentUser();
        const role = user.rol?.nombre;
        
        let actions = [];
        
        switch (role) {
            case 'Superadmin':
            case 'Admin':
                actions = [
                    { text: 'Crear Usuario', icon: 'bi-person-plus', action: 'createUser' },
                    { text: 'Crear Curso', icon: 'bi-book', action: 'createCourse' },
                    { text: 'Ver Reportes', icon: 'bi-graph-up', action: 'viewReports' }
                ];
                break;
            case 'UTP':
                actions = [
                    { text: 'Crear Evaluación', icon: 'bi-clipboard-plus', action: 'createEvaluation' },
                    { text: 'Ver Estudiantes', icon: 'bi-mortarboard', action: 'viewStudents' },
                    { text: 'Ver Reportes', icon: 'bi-graph-up', action: 'viewReports' }
                ];
                break;
            case 'Profesor':
                actions = [
                    { text: 'Crear Evaluación', icon: 'bi-clipboard-plus', action: 'createEvaluation' },
                    { text: 'Ver Mis Estudiantes', icon: 'bi-mortarboard', action: 'viewMyStudents' },
                    { text: 'Ver Calificaciones', icon: 'bi-card-list', action: 'viewGrades' }
                ];
                break;
        }
        
        if (actions.length === 0) {
            Swal.fire({
                icon: 'info',
                title: 'Sin acciones disponibles',
                text: 'No hay acciones rápidas disponibles para tu rol.',
                confirmButtonColor: '#4e73df'
            });
            return;
        }
        
        const actionsHtml = actions.map(action => `
            <button class="btn btn-outline-primary btn-sm m-1" onclick="dashboard.executeQuickAction('${action.action}')">
                <i class="bi ${action.icon}"></i> ${action.text}
            </button>
        `).join('');
        
        Swal.fire({
            title: 'Acciones Rápidas',
            html: `<div class="text-center">${actionsHtml}</div>`,
            showConfirmButton: false,
            showCloseButton: true,
            width: 500
        });
    }

    executeQuickAction(action) {
        Swal.close();
        
        switch (action) {
            case 'createUser':
                this.showSection('usuarios');
                break;
            case 'createCourse':
                this.showSection('cursos');
                break;
            case 'createEvaluation':
                this.showSection('evaluaciones');
                break;
            case 'viewStudents':
            case 'viewMyStudents':
                this.showSection('estudiantes');
                break;
            case 'viewReports':
                this.showSection('reportes');
                break;
            case 'viewGrades':
                this.showSection('evaluaciones');
                break;
            default:
                Swal.fire({
                    icon: 'info',
                    title: 'Función en desarrollo',
                    text: 'Esta funcionalidad estará disponible pronto.',
                    confirmButtonColor: '#4e73df'
                });
        }
    }

    logout() {
        Swal.fire({
            title: '¿Cerrar sesión?',
            text: '¿Estás seguro de que quieres cerrar tu sesión?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#4e73df',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Sí, cerrar sesión',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                window.authManager.logout();
            }
        });
    }

    showError(message) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: message,
            confirmButtonColor: '#4e73df'
        });
    }
}

// Inicializar dashboard cuando la página esté lista
document.addEventListener('DOMContentLoaded', function() {
    window.dashboard = new Dashboard();
});
