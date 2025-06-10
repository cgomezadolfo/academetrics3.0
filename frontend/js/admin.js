// Admin Dashboard Functionality
class AdminDashboard {
    constructor() {
        this.currentPage = 1;
        this.pageSize = 10;
        this.filters = {
            users: {},
            courses: {}
        };
        this.currentSection = 'dashboard';
        this.init();
    }

    async init() {
        console.log('🚀 Iniciando AdminDashboard...');
        
        console.log('1️⃣ Cargando información del usuario...');
        await this.loadUserInfo();
        
        console.log('2️⃣ Cargando colegios...');
        await this.loadColleges();
        
        console.log('3️⃣ Cargando roles...');
        await this.loadRoles();
        
        console.log('4️⃣ Cargando estadísticas del dashboard...');
        await this.loadDashboardStats();
        
        console.log('5️⃣ Configurando event listeners...');
        this.setupEventListeners();
        
        console.log('6️⃣ Configurando navegación...');
        this.setupNavigation();
        
        console.log('7️⃣ Mostrando sección dashboard...');
        this.showSection('dashboard'); // Show dashboard by default
        
        console.log('✅ ¡AdminDashboard inicializado completamente!');
    }

    async loadUserInfo() {
        try {
            const user = authManager.getCurrentUser();
            if (user) {
                document.getElementById('userName').textContent = `${user.nombre} ${user.apellidoPaterno}`;
                document.getElementById('userRole').textContent = user.rol?.nombre || 'Usuario';
                document.getElementById('userCollege').textContent = user.colegio?.nombre || 'Sin asignar';
            }
        } catch (error) {
            console.error('Error loading user info:', error);
        }
    }

    setupEventListeners() {
        // User filters
        document.getElementById('roleFilter')?.addEventListener('change', () => this.loadUsers());
        document.getElementById('collegeFilter')?.addEventListener('change', () => this.loadUsers());
        document.getElementById('searchUser')?.addEventListener('input', this.debounce(() => this.loadUsers(), 300));

        // Course filters
        document.getElementById('gradeFilter')?.addEventListener('change', () => this.loadCourses());
        document.getElementById('levelFilter')?.addEventListener('change', () => this.loadCourses());
        document.getElementById('searchCourse')?.addEventListener('input', this.debounce(() => this.loadCourses(), 300));

        // Subject filters
        document.getElementById('searchSubject')?.addEventListener('input', this.debounce(() => this.loadSubjects(), 300));
        document.getElementById('subjectCourseFilter')?.addEventListener('change', () => this.loadSubjects());
        document.getElementById('subjectProfessorFilter')?.addEventListener('change', () => this.loadSubjects());

        // Student filters
        document.getElementById('searchStudent')?.addEventListener('input', this.debounce(() => this.loadStudents(), 300));
        document.getElementById('studentCourseFilter')?.addEventListener('change', () => this.loadStudents());
        document.getElementById('studentStatusFilter')?.addEventListener('change', () => this.loadStudents());
    }

    setupNavigation() {
        // Setup navigation event listeners
        document.querySelectorAll('[data-section]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = e.currentTarget.getAttribute('data-section');
                this.showSection(section);
            });
        });

        // Setup logout
        document.getElementById('logoutBtn')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.logout();
        });

        // Setup refresh button
        document.getElementById('refreshBtn')?.addEventListener('click', () => {
            this.refreshCurrentSection();
        });

        // Setup quick action button
        document.getElementById('quickActionBtn')?.addEventListener('click', () => {
            this.showQuickAction();
        });
    }

    showSection(sectionName) {
        // Update current section
        this.currentSection = sectionName;
        
        // Hide all sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.style.display = 'none';
        });

        // Show selected section
        const targetSection = document.getElementById(`${sectionName}-section`);
        if (targetSection) {
            targetSection.style.display = 'block';
        }

        // Update navigation active state
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[data-section="${sectionName}"]`)?.classList.add('active');

        // Update page title
        const titles = {
            'dashboard': 'Dashboard',
            'usuarios': 'Gestión de Usuarios',
            'cursos': 'Gestión de Cursos',
            'asignaturas': 'Gestión de Asignaturas',
            'estudiantes': 'Gestión de Estudiantes',
            'evaluaciones': 'Evaluaciones',
            'reportes': 'Reportes',
            'perfil': 'Mi Perfil'
        };
        document.getElementById('pageTitle').textContent = titles[sectionName] || 'Dashboard';

        // Load section-specific data
        this.loadSectionData(sectionName);
    }

    async loadSectionData(sectionName) {
        switch(sectionName) {
            case 'dashboard':
                await this.loadDashboardStats();
                break;
            case 'usuarios':
                await this.loadUsers();
                break;
            case 'cursos':
                await this.loadCourses();
                break;
            case 'asignaturas':
                await this.loadSubjects();
                break;
            case 'estudiantes':
                await this.loadStudents();
                break;
            // Add more sections as needed
        }
    }

    refreshCurrentSection() {
        this.loadSectionData(this.currentSection);
    }

    showQuickAction() {
        // Show quick action based on current section
        switch(this.currentSection) {
            case 'usuarios':
                openUserModal();
                break;
            case 'cursos':
                openCourseModal();
                break;
            case 'asignaturas':
                openSubjectModal();
                break;
            case 'estudiantes':
                openStudentModal();
                break;
            default:
                Swal.fire('Info', 'No hay acciones rápidas disponibles para esta sección', 'info');
        }
    }

    async logout() {
        const result = await Swal.fire({
            title: '¿Cerrar sesión?',
            text: '¿Estás seguro de que quieres cerrar sesión?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, cerrar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            authManager.logout();
            window.location.href = '../index.html';
        }
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }    async loadColleges() {
        try {
            console.log('🏫 Iniciando carga de colegios...');
            const response = await authManager.authenticatedFetch('/colegios');
            console.log('📡 Respuesta de /colegios:', response.status);
            
            const colleges = await response.json();
            console.log('🏫 Colegios obtenidos:', colleges);
            console.log('📊 Cantidad de colegios:', colleges.length);
            
            // Store colleges for later use
            this.colleges = colleges;
            
            // Populate college selects
            const collegeSelects = ['collegeFilter', 'colegioId', 'courseColegioId', 'studentColegioId'];
            console.log('🎯 IDs de dropdowns a llenar:', collegeSelects);
            
            collegeSelects.forEach(selectId => {
                const select = document.getElementById(selectId);
                console.log(`🔍 Elemento ${selectId}:`, select);
                
                if (select) {
                    console.log(`✅ Elemento ${selectId} encontrado, limpiando opciones...`);
                    // Clear existing options (except first one)
                    while (select.children.length > 1) {
                        select.removeChild(select.lastChild);
                    }
                    
                    console.log(`📝 Agregando ${colleges.length} opciones a ${selectId}...`);
                    colleges.forEach(college => {
                        const option = document.createElement('option');
                        option.value = college.id;
                        option.textContent = college.nombre;
                        select.appendChild(option);
                        console.log(`✅ Opción agregada: ${college.nombre} (ID: ${college.id})`);
                    });
                    
                    console.log(`🎉 Dropdown ${selectId} completado con ${select.children.length - 1} opciones`);
                } else {
                    console.warn(`❌ Elemento ${selectId} no encontrado en el DOM`);
                }
            });
            
            console.log('🏫 ¡Carga de colegios completada!');
        } catch (error) {
            console.error('❌ Error loading colleges:', error);
            console.error('📄 Stack trace:', error.stack);
        }
    }

    async loadRoles() {
        try {
            console.log('👥 Iniciando carga de roles...');
            const response = await authManager.authenticatedFetch('/roles');
            console.log('📡 Respuesta de /roles:', response.status);
            
            const roles = await response.json();
            console.log('👥 Roles obtenidos:', roles);
            console.log('📊 Cantidad de roles:', roles.length);
            
            // Store roles for later use
            this.roles = roles;
            
            // Populate role selects
            const roleSelects = ['roleFilter', 'rolId'];
            console.log('🎯 IDs de dropdowns de roles a llenar:', roleSelects);
            
            roleSelects.forEach(selectId => {
                const select = document.getElementById(selectId);
                console.log(`🔍 Elemento ${selectId}:`, select);
                
                if (select) {
                    console.log(`✅ Elemento ${selectId} encontrado, limpiando opciones...`);
                    // Clear existing options (except first one)
                    while (select.children.length > 1) {
                        select.removeChild(select.lastChild);
                    }
                    
                    console.log(`📝 Agregando ${roles.length} opciones a ${selectId}...`);
                    roles.forEach(role => {
                        const option = document.createElement('option');
                        option.value = role.id;
                        option.textContent = role.nombre;
                        select.appendChild(option);
                        console.log(`✅ Opción agregada: ${role.nombre} (ID: ${role.id})`);
                    });
                    
                    console.log(`🎉 Dropdown ${selectId} completado con ${select.children.length - 1} opciones`);
                } else {
                    console.warn(`❌ Elemento ${selectId} no encontrado en el DOM`);
                }
            });
            
            console.log('👥 ¡Carga de roles completada!');
        } catch (error) {
            console.error('❌ Error loading roles:', error);
            console.error('📄 Stack trace:', error.stack);
        }
    }async loadDashboardStats() {
        try {
            console.log('📊 Iniciando carga de estadísticas del dashboard...');
            
            // Load users count
            console.log('👥 Cargando estadísticas de usuarios...');
            const usersResponse = await authManager.authenticatedFetch('/usuarios');
            const users = await usersResponse.json();
            console.log('👥 Usuarios obtenidos:', users.length);
            
            // Update dashboard counters
            document.getElementById('totalUsers').textContent = users.length;
            
            // Load courses count
            console.log('📚 Cargando estadísticas de cursos...');
            const coursesResponse = await authManager.authenticatedFetch('/cursos');
            const courses = await coursesResponse.json();
            console.log('📚 Cursos obtenidos:', courses.length);
            
            document.getElementById('totalCourses').textContent = courses.length;
            
            // Load students count
            console.log('🎓 Cargando estadísticas de estudiantes...');
            const studentsResponse = await authManager.authenticatedFetch('/estudiantes');
            const students = await studentsResponse.json();
            console.log('🎓 Estudiantes obtenidos:', students.length);
            
            document.getElementById('totalStudents').textContent = students.length;
            
            // Load evaluations count (might fail if endpoint doesn't exist)
            try {
                console.log('📝 Cargando estadísticas de evaluaciones...');
                const evaluationsResponse = await authManager.authenticatedFetch('/evaluaciones');
                const evaluations = await evaluationsResponse.json();
                console.log('📝 Evaluaciones obtenidas:', evaluations.length);
                
                document.getElementById('totalEvaluations').textContent = evaluations.length;
            } catch (error) {
                console.warn('⚠️ No se pudieron cargar las evaluaciones:', error);
                document.getElementById('totalEvaluations').textContent = '0';
            }
            
            console.log('📊 ¡Estadísticas del dashboard cargadas completamente!');
        } catch (error) {
            console.error('❌ Error loading dashboard stats:', error);
            console.error('📄 Stack trace:', error.stack);
        }
    }

    async loadUsers() {
        const tableBody = document.getElementById('usersTableBody');
        if (!tableBody) return;

        // Show loading
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center">
                    <div class="spinner-border" role="status">
                        <span class="visually-hidden">Cargando...</span>
                    </div>
                </td>
            </tr>
        `;        try {
            const response = await authManager.authenticatedFetch('/usuarios');
            const users = await response.json();

            // Apply filters
            let filteredUsers = users;            const roleFilter = document.getElementById('roleFilter')?.value;
            if (roleFilter) {
                filteredUsers = filteredUsers.filter(user => user.rol.id == roleFilter);
            }

            const collegeFilter = document.getElementById('collegeFilter')?.value;
            if (collegeFilter) {
                filteredUsers = filteredUsers.filter(user => user.colegioId == collegeFilter);
            }

            const searchTerm = document.getElementById('searchUser')?.value.toLowerCase();
            if (searchTerm) {
                filteredUsers = filteredUsers.filter(user => 
                    user.nombre.toLowerCase().includes(searchTerm) ||
                    user.apellidoPaterno.toLowerCase().includes(searchTerm) ||
                    user.apellidoMaterno.toLowerCase().includes(searchTerm) ||
                    user.email.toLowerCase().includes(searchTerm)
                );
            }

            // Render table
            if (filteredUsers.length === 0) {
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="7" class="text-center text-muted">
                            No se encontraron usuarios
                        </td>
                    </tr>
                `;
                return;
            }            tableBody.innerHTML = filteredUsers.map(user => `
                <tr>
                    <td>${user.id}</td>
                    <td>${user.nombre} ${user.apellidoPaterno} ${user.apellidoMaterno}</td>
                    <td>${user.email}</td>
                    <td><span class="badge bg-${this.getRoleBadgeColor(user.rol.nombre)}">${user.rol.nombre}</span></td>
                    <td>${user.colegio?.nombre || 'N/A'}</td>
                    <td>
                        <span class="badge bg-${user.activo ? 'success' : 'danger'}">
                            ${user.activo ? 'Activo' : 'Inactivo'}
                        </span>
                    </td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary" onclick="editUser(${user.id})">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="deleteUser(${user.id})">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                </tr>
            `).join('');

        } catch (error) {
            console.error('Error loading users:', error);
            tableBody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center text-danger">
                        Error al cargar usuarios
                    </td>
                </tr>
            `;
        }
    }

    async loadCourses() {
        const tableBody = document.getElementById('coursesTableBody');
        if (!tableBody) return;

        // Show loading
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center">
                    <div class="spinner-border" role="status">
                        <span class="visually-hidden">Cargando...</span>
                    </div>
                </td>
            </tr>        `;

        try {
            const response = await authManager.authenticatedFetch('/cursos');
            const courses = await response.json();

            // Apply filters
            let filteredCourses = courses;
              const gradeFilter = document.getElementById('gradeFilter')?.value;
            if (gradeFilter) {
                filteredCourses = filteredCourses.filter(course => course.nivel == gradeFilter);
            }

            const levelFilter = document.getElementById('levelFilter')?.value;
            if (levelFilter) {
                filteredCourses = filteredCourses.filter(course => course.jornada === levelFilter);
            }

            const searchTerm = document.getElementById('searchCourse')?.value.toLowerCase();
            if (searchTerm) {
                filteredCourses = filteredCourses.filter(course => 
                    course.nivel.toString().includes(searchTerm) ||
                    course.letra.toLowerCase().includes(searchTerm) ||
                    course.jornada.toLowerCase().includes(searchTerm)
                );
            }

            // Render table
            if (filteredCourses.length === 0) {
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="7" class="text-center text-muted">
                            No se encontraron cursos
                        </td>
                    </tr>
                `;
                return;
            }            tableBody.innerHTML = filteredCourses.map(course => `
                <tr>
                    <td>${course.id}</td>
                    <td>${course.nivel}° ${course.letra}</td>
                    <td>${course.nivel}°</td>
                    <td>${course.letra}</td>
                    <td><span class="badge bg-info">${course.jornada}</span></td>
                    <td>${course.estudiantes?.length || 0}</td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary" onclick="editCourse(${course.id})">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="deleteCourse(${course.id})">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                </tr>
            `).join('');

        } catch (error) {
            console.error('Error loading courses:', error);
            tableBody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center text-danger">
                        Error al cargar cursos
                    </td>
                </tr>
            `;
        }
    }

    async loadSubjects() {
        const tableBody = document.getElementById('subjectsTableBody');
        if (!tableBody) return;

        // Show loading
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center">
                    <div class="spinner-border" role="status">
                        <span class="visually-hidden">Cargando...</span>
                    </div>
                </td>
            </tr>
        `;        try {
            const response = await authManager.authenticatedFetch('/asignaturas');
            const subjects = await response.json();

            // Apply filters
            let filteredSubjects = subjects;
              const searchTerm = document.getElementById('searchSubject')?.value.toLowerCase();
            if (searchTerm) {
                filteredSubjects = filteredSubjects.filter(subject => 
                    subject.nombre.toLowerCase().includes(searchTerm)
                );
            }

            const courseFilter = document.getElementById('subjectCourseFilter')?.value;
            if (courseFilter) {
                filteredSubjects = filteredSubjects.filter(subject => subject.cursoId == courseFilter);
            }

            const professorFilter = document.getElementById('subjectProfessorFilter')?.value;
            if (professorFilter) {
                filteredSubjects = filteredSubjects.filter(subject => subject.profesorId == professorFilter);
            }

            // Render table
            if (filteredSubjects.length === 0) {
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="6" class="text-center text-muted">
                            No se encontraron asignaturas
                        </td>
                    </tr>
                `;
                return;
            }            tableBody.innerHTML = filteredSubjects.map(subject => `
                <tr>
                    <td>${subject.id}</td>
                    <td>${subject.nombre}</td>
                    <td>${subject.descripcion || 'Sin descripción'}</td>
                    <td>${subject.curso ? `${subject.curso.nivel}° ${subject.curso.letra}` : 'N/A'}</td>
                    <td>${subject.profesor ? `${subject.profesor.nombre} ${subject.profesor.apellidoPaterno}` : 'Sin asignar'}</td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary" onclick="editSubject(${subject.id})">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="deleteSubject(${subject.id})">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                </tr>
            `).join('');

        } catch (error) {
            console.error('Error loading subjects:', error);
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center text-danger">
                        Error al cargar asignaturas
                    </td>
                </tr>
            `;
        }
    }

    async loadStudents() {
        const tableBody = document.getElementById('studentsTableBody');
        if (!tableBody) return;

        // Show loading
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center">
                    <div class="spinner-border" role="status">
                        <span class="visually-hidden">Cargando...</span>
                    </div>
                </td>
            </tr>
        `;        try {
            // Load students from estudiantes endpoint
            const response = await authManager.authenticatedFetch('/estudiantes');
            const students = await response.json();

            // Apply filters
            let filteredStudents = students;
              const searchTerm = document.getElementById('searchStudent')?.value.toLowerCase();
            if (searchTerm) {
                filteredStudents = filteredStudents.filter(student => 
                    student.usuario.nombre.toLowerCase().includes(searchTerm) ||
                    student.usuario.apellidoPaterno.toLowerCase().includes(searchTerm) ||
                    student.usuario.apellidoMaterno.toLowerCase().includes(searchTerm) ||
                    student.usuario.email.toLowerCase().includes(searchTerm)
                );
            }

            const courseFilter = document.getElementById('studentCourseFilter')?.value;
            if (courseFilter) {
                filteredStudents = filteredStudents.filter(student => 
                    student.cursoId == courseFilter
                );
            }

            const statusFilter = document.getElementById('studentStatusFilter')?.value;
            if (statusFilter !== '') {
                filteredStudents = filteredStudents.filter(student => 
                    student.usuario.activo === (statusFilter === 'true')
                );
            }

            // Render table
            if (filteredStudents.length === 0) {
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="6" class="text-center text-muted">
                            No se encontraron estudiantes
                        </td>
                    </tr>
                `;
                return;
            }            tableBody.innerHTML = filteredStudents.map(student => `
                <tr>
                    <td>${student.id}</td>
                    <td>${student.usuario.nombre} ${student.usuario.apellidoPaterno} ${student.usuario.apellidoMaterno}</td>
                    <td>${student.usuario.email}</td>
                    <td>${student.curso?.nivel}° ${student.curso?.letra} - ${student.curso?.jornada}</td>
                    <td>
                        <span class="badge bg-${student.usuario.activo ? 'success' : 'danger'}">
                            ${student.usuario.activo ? 'Activo' : 'Inactivo'}
                        </span>
                    </td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary" onclick="editStudent(${student.id})">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="deleteStudent(${student.id})">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                </tr>
            `).join('');

        } catch (error) {
            console.error('Error loading students:', error);
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center text-danger">
                        Error al cargar estudiantes
                    </td>
                </tr>
            `;
        }
    }    async loadProfessors() {
        try {
            // Load professors using the role filter
            const response = await authManager.authenticatedFetch('/usuarios');
            const users = await response.json();
            
            // Filter only professors
            const professors = users.filter(user => user.rol.nombre === 'Profesor');
            
            // Populate professor selects
            const professorSelects = ['subjectProfessorFilter', 'subjectProfessorId'];
            professorSelects.forEach(selectId => {
                const select = document.getElementById(selectId);
                if (select) {
                    // Clear existing options (except first one)
                    while (select.children.length > 1) {
                        select.removeChild(select.lastChild);
                    }
                    
                    professors.forEach(professor => {
                        const option = document.createElement('option');
                        option.value = professor.id;
                        option.textContent = `${professor.nombre} ${professor.apellidoPaterno}`;
                        select.appendChild(option);
                    });
                }
            });
        } catch (error) {
            console.error('Error loading professors:', error);
        }
    }

    async loadCoursesForFilters() {
        try {            const response = await authManager.authenticatedFetch('/cursos');
            const courses = await response.json();
            
            // Populate course filter selects
            const courseSelects = ['subjectCourseFilter', 'studentCourseFilter', 'subjectCursoId', 'studentCursoId'];
            courseSelects.forEach(selectId => {
                const select = document.getElementById(selectId);
                if (select) {
                    // Clear existing options (except first one)
                    while (select.children.length > 1) {
                        select.removeChild(select.lastChild);
                    }
                      courses.forEach(course => {
                        const option = document.createElement('option');
                        option.value = course.id;
                        option.textContent = `${course.nivel}° ${course.letra} - ${course.jornada}`;
                        select.appendChild(option);
                    });
                }
            });
        } catch (error) {
            console.error('Error loading courses for filters:', error);
        }
    }    getRoleBadgeColor(role) {
        const colors = {
            'Administrador': 'danger',
            'Profesor': 'primary',
            'Estudiante': 'success',
            'UTP': 'warning',
            'Superadmin': 'dark'
        };
        return colors[role] || 'secondary';
    }
}

// User Management Functions
async function openUserModal(userId = null) {
    const modal = document.getElementById('userModal');
    const form = document.getElementById('userForm');
    const title = document.getElementById('userModalLabel');
    
    // Reset form
    form.reset();
    document.getElementById('userId').value = '';
    
    // Load data for selects
    await adminDashboard.loadColleges();
    await adminDashboard.loadRoles();
    
    if (userId) {
        title.textContent = 'Editar Usuario';
        // Load user data
        try {
            const response = await authManager.authenticatedFetch(`/usuarios/${userId}`);
            
            // Verificar si la respuesta fue exitosa
            if (!response.ok) {
                const errorData = await response.json();
                console.log('❌ Error del servidor:', errorData);
                
                // Manejar diferentes tipos de errores
                if (response.status === 403) {
                    // Error de permisos - usuario con rol superior
                    Swal.fire({
                        icon: 'warning',
                        title: 'Permisos insuficientes',
                        text: 'No tienes permisos para editar un usuario con este rol. Solo puedes editar usuarios con roles iguales o inferiores al tuyo.',
                        confirmButtonText: 'Entendido'
                    });
                } else if (response.status === 404) {
                    // Usuario no encontrado
                    Swal.fire({
                        icon: 'error',
                        title: 'Usuario no encontrado',
                        text: 'El usuario que intentas editar no existe o ha sido eliminado.',
                        confirmButtonText: 'Entendido'
                    });
                } else {
                    // Otros errores
                    Swal.fire({
                        icon: 'error',
                        title: 'Error del servidor',
                        text: errorData.message || 'Ocurrió un error al cargar los datos del usuario.',
                        confirmButtonText: 'Entendido'
                    });
                }
                return; // Salir de la función sin continuar
            }
            
            const user = await response.json();
            
            // Debug: Mostrar los datos que llegan del backend (solo en modo desarrollo)
            console.log('🔍 Datos del usuario recibidos del backend:', user);
            
            // Verificar que el objeto user tenga la estructura esperada
            if (!user || !user.id) {
                throw new Error('Los datos del usuario no tienen el formato esperado');
            }
            
            document.getElementById('userId').value = user.id;
            document.getElementById('nombre').value = user.nombre;
            document.getElementById('apellidoPaterno').value = user.apellidoPaterno;
            document.getElementById('apellidoMaterno').value = user.apellidoMaterno;
            document.getElementById('email').value = user.email;
            document.getElementById('rut').value = user.rut;
            document.getElementById('rolId').value = user.rol.id;
            document.getElementById('colegioId').value = user.colegioId;
            document.getElementById('activo').checked = user.activo;
            
            // Make password optional for editing
            document.getElementById('password').removeAttribute('required');
        } catch (error) {
            console.error('Error loading user:', error);
            
            // Mostrar mensaje de error más específico
            Swal.fire({
                icon: 'error',
                title: 'Error al cargar usuario',
                text: 'Ocurrió un problema al cargar los datos del usuario. Por favor, intenta nuevamente.',
                confirmButtonText: 'Entendido'
            });
        }
    } else {
        title.textContent = 'Nuevo Usuario';
        document.getElementById('password').setAttribute('required', 'required');
    }
    
    // Setup RUT formatting for this modal
    setTimeout(() => {
        setupRUTFormatting();
    }, 100);
}

async function saveUser() {
    const form = document.getElementById('userForm');
    const formData = new FormData(form);
    const userId = formData.get('userId');
    
    const userData = {
        nombre: formData.get('nombre'),
        apellidoPaterno: formData.get('apellidoPaterno'),
        apellidoMaterno: formData.get('apellidoMaterno'),
        email: formData.get('email'),
        rut: cleanRUT(formData.get('rut')), // Limpiar formato del RUT antes de enviar
        rolId: parseInt(formData.get('rolId')),
        colegioId: parseInt(formData.get('colegioId')),
        activo: formData.has('activo')
    };
    
    // Only include password if provided
    const password = formData.get('password');
    if (password && password.trim() !== '') {
        userData.password = password;
    }

    // 🔍 Debug: Mostrar datos que se van a enviar
    console.log('📤 Datos a enviar al servidor:', userData);
    console.log('📤 URL objetivo:', userId ? `/usuarios/${userId}` : '/usuarios');
    console.log('📤 Método HTTP:', userId ? 'PUT' : 'POST');

    try {
        let response;
        if (userId) {
            // Update user
            response = await authManager.authenticatedFetch(`/usuarios/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });
        } else {
            // Create user
            response = await authManager.authenticatedFetch('/usuarios', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });
        }

        // 🔍 Debug: Mostrar respuesta del servidor
        console.log('📡 Status de respuesta:', response.status);
        console.log('📡 Respuesta completa:', response);

        if (response.ok) {
            const modal = bootstrap.Modal.getInstance(document.getElementById('userModal'));
            modal.hide();
            
            Swal.fire({
                title: 'Éxito',
                text: userId ? 'Usuario actualizado correctamente' : 'Usuario creado correctamente',
                icon: 'success',
                timer: 2000
            });
            
            // Reload users
            adminDashboard.loadUsers();
            adminDashboard.loadDashboardStats();
        } else {
            // 🔍 Debug: Mostrar error específico del servidor
            const errorText = await response.text();
            console.log('❌ Error del servidor (texto completo):', errorText);
            
            let errorData;
            try {
                errorData = JSON.parse(errorText);
                console.log('❌ Error del servidor (JSON):', errorData);
            } catch (parseError) {
                console.log('❌ No se pudo parsear la respuesta como JSON');
                errorData = { error: errorText };
            }
            
            throw new Error(errorData.error || errorData.message || 'Error desconocido del servidor');
        }
    } catch (error) {
        console.error('💥 Error completo en saveUser:', error);
        console.error('💥 Stack trace:', error.stack);
        Swal.fire('Error', error.message || 'Error al guardar el usuario', 'error');
    }
}

async function editUser(userId) {
    await openUserModal(userId);
    const modal = new bootstrap.Modal(document.getElementById('userModal'));
    modal.show();
}

async function deleteUser(userId) {
    const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta acción no se puede deshacer',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
        try {
            const response = await authManager.authenticatedFetch(`/usuarios/${userId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                Swal.fire('Eliminado', 'Usuario eliminado correctamente', 'success');
                adminDashboard.loadUsers();
                adminDashboard.loadDashboardStats();
            } else {
                const error = await response.json();
                throw new Error(error.message);
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            Swal.fire('Error', error.message || 'Error al eliminar el usuario', 'error');
        }
    }
}

// Course Management Functions
async function openCourseModal(courseId = null) {
    const modal = document.getElementById('courseModal');
    const form = document.getElementById('courseForm');
    const title = document.getElementById('courseModalLabel');
    
    // Reset form
    form.reset();
    document.getElementById('courseId').value = '';
    
    // Load data for selects
    await adminDashboard.loadColleges();
    
    if (courseId) {
        title.textContent = 'Editar Curso';
        // Load course data
        try {
            const response = await authManager.authenticatedFetch(`/cursos/${courseId}`);
            const course = await response.json();
            
            document.getElementById('courseId').value = course.id;
            document.getElementById('nivel').value = course.nivel;
            document.getElementById('letra').value = course.letra;
            document.getElementById('jornada').value = course.jornada;
            document.getElementById('courseColegioId').value = course.colegioId;
        } catch (error) {
            console.error('Error loading course:', error);
            Swal.fire('Error', 'Error al cargar los datos del curso', 'error');
        }
    } else {
        title.textContent = 'Nuevo Curso';
    }
}

async function saveCourse() {
    const form = document.getElementById('courseForm');
    const formData = new FormData(form);
    const courseId = formData.get('courseId');
    
    const courseData = {
        nivel: formData.get('nivel'),
        letra: formData.get('letra'),
        jornada: formData.get('jornada'),
        colegioId: parseInt(formData.get('colegioId'))
    };

    try {
        let response;
        if (courseId) {
            // Update course
            response = await authManager.authenticatedFetch(`/cursos/${courseId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(courseData)
            });
        } else {
            // Create course
            response = await authManager.authenticatedFetch('/cursos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(courseData)
            });
        }

        if (response.ok) {
            const modal = bootstrap.Modal.getInstance(document.getElementById('courseModal'));
            modal.hide();
            
            Swal.fire({
                title: 'Éxito',
                text: courseId ? 'Curso actualizado correctamente' : 'Curso creado correctamente',
                icon: 'success',
                timer: 2000
            });
            
            // Reload courses
            adminDashboard.loadCourses();
            adminDashboard.loadDashboardStats();
        } else {
            const error = await response.json();
            throw new Error(error.message);
        }
    } catch (error) {
        console.error('Error saving course:', error);
        Swal.fire('Error', error.message || 'Error al guardar el curso', 'error');
    }
}

async function editCourse(courseId) {
    await openCourseModal(courseId);
    const modal = new bootstrap.Modal(document.getElementById('courseModal'));
    modal.show();
}

async function deleteCourse(courseId) {
    const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta acción no se puede deshacer',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
        try {
            const response = await authManager.authenticatedFetch(`/cursos/${courseId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                Swal.fire('Eliminado', 'Curso eliminado correctamente', 'success');
                adminDashboard.loadCourses();
                adminDashboard.loadDashboardStats();
            } else {
                const error = await response.json();
                throw new Error(error.message);
            }
        } catch (error) {
            console.error('Error deleting course:', error);
            Swal.fire('Error', error.message || 'Error al eliminar el curso', 'error');
        }
    }
}

// Subject Management Functions
async function openSubjectModal(subjectId = null) {
    const modal = document.getElementById('subjectModal');
    const form = document.getElementById('subjectForm');
    const title = document.getElementById('subjectModalLabel');
    
    // Reset form
    form.reset();
    document.getElementById('subjectId').value = '';
    
    // Load courses for dropdown
    await adminDashboard.loadCoursesForFilters();
    
    if (subjectId) {
        title.textContent = 'Editar Asignatura';
        // Load subject data
        try {
            const response = await authManager.authenticatedFetch(`/asignaturas/${subjectId}`);
            const subject = await response.json();
            
            document.getElementById('subjectId').value = subject.id;
            document.getElementById('subjectNombre').value = subject.nombre;
            document.getElementById('subjectCursoId').value = subject.cursoId;
        } catch (error) {
            console.error('Error loading subject:', error);
            Swal.fire('Error', 'Error al cargar los datos de la asignatura', 'error');
        }
    } else {
        title.textContent = 'Nueva Asignatura';
    }
}

async function saveSubject() {
    console.log('💾 Iniciando guardado de asignatura...');
    
    const form = document.getElementById('subjectForm');
    const formData = new FormData(form);
    const subjectId = formData.get('subjectId');
    
    console.log('📋 FormData obtenida:', {
        subjectId: subjectId,
        nombre: formData.get('nombre'),
        cursoId: formData.get('cursoId')
    });
    
    // Validar campos obligatorios en el frontend
    const nombre = formData.get('nombre');
    const cursoId = formData.get('cursoId');
    
    if (!nombre || nombre.trim() === '') {
        Swal.fire({
            title: 'Error de validación',
            text: 'El nombre de la asignatura es obligatorio',
            icon: 'warning'
        });
        return;
    }
    
    if (!cursoId || cursoId === '') {
        Swal.fire({
            title: 'Error de validación', 
            text: 'Debe seleccionar un curso',
            icon: 'warning'
        });
        return;
    }
    
    // Preparar datos según el modelo de la base de datos
    const subjectData = {
        nombre: nombre.trim(),
        cursoId: parseInt(cursoId)
    };
    
    console.log('📤 Datos a enviar:', subjectData);

    try {
        let response;
        if (subjectId) {
            // Actualizar asignatura
            console.log(`🔄 Actualizando asignatura ID: ${subjectId}`);
            response = await authManager.authenticatedFetch(`/asignaturas/${subjectId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(subjectData)
            });
        } else {
            // Crear asignatura
            console.log('➕ Creando nueva asignatura');
            response = await authManager.authenticatedFetch('/asignaturas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(subjectData)
            });
        }

        console.log('📡 Respuesta del servidor:', response.status);

        if (response.ok) {
            const result = await response.json();
            console.log('✅ Asignatura guardada exitosamente:', result);
            
            const modal = bootstrap.Modal.getInstance(document.getElementById('subjectModal'));
            modal.hide();
            
            Swal.fire({
                title: 'Éxito',
                text: subjectId ? 'Asignatura actualizada correctamente' : 'Asignatura creada correctamente',
                icon: 'success',
                timer: 2000
            });
            
            // Recargar lista de asignaturas
            adminDashboard.loadSubjects();
        } else {
            const error = await response.json();
            console.error('❌ Error del servidor:', error);
            throw new Error(error.error || error.message);
        }
    } catch (error) {
        console.error('💥 Error saving subject:', error);
        Swal.fire({
            title: 'Error', 
            text: error.message || 'Error al guardar la asignatura', 
            icon: 'error'
        });
    }
}

async function editSubject(subjectId) {
    await openSubjectModal(subjectId);
    const modal = new bootstrap.Modal(document.getElementById('subjectModal'));
    modal.show();
}

async function deleteSubject(subjectId) {
    const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta acción no se puede deshacer',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
        try {
            const response = await authManager.authenticatedFetch(`/asignaturas/${subjectId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                Swal.fire('Eliminado', 'Asignatura eliminada correctamente', 'success');
                adminDashboard.loadSubjects();
            } else {
                const error = await response.json();
                throw new Error(error.message);
            }
        } catch (error) {
            console.error('Error deleting subject:', error);
            Swal.fire('Error', error.message || 'Error al eliminar la asignatura', 'error');
        }
    }
}

// Student Management Functions (Enhanced)
async function openStudentModal(studentId = null) {
    const modal = document.getElementById('studentModal');
    const form = document.getElementById('studentForm');
    const title = document.getElementById('studentModalLabel');
    
    // Reset form
    form.reset();
    document.getElementById('studentId').value = '';
    
    // Load data for selects
    await adminDashboard.loadCoursesForFilters();
    await adminDashboard.loadColleges();
    
    if (studentId) {
        title.textContent = 'Editar Estudiante';        // Load student data
        try {
            const response = await authManager.authenticatedFetch(`/usuarios/${studentId}`);
            const student = await response.json();
            
            document.getElementById('studentId').value = student.id;
            document.getElementById('studentNombre').value = student.nombre;
            document.getElementById('studentApellidoPaterno').value = student.apellidoPaterno;
            document.getElementById('studentApellidoMaterno').value = student.apellidoMaterno;
            document.getElementById('studentEmail').value = student.email;
            document.getElementById('studentRut').value = student.rut;
            document.getElementById('studentColegioId').value = student.colegioId;
            document.getElementById('studentActivo').checked = student.activo;
            
            // Handle course selection (if student has enrollments)
            if (student.estudiantes && student.estudiantes.length > 0) {
                document.getElementById('studentCursoId').value = student.estudiantes[0].cursoId;
            }
            
            // Make password optional for editing
            document.getElementById('studentPassword').removeAttribute('required');
        } catch (error) {
            console.error('Error loading student:', error);
            Swal.fire('Error', 'Error al cargar los datos del estudiante', 'error');
        }
    } else {
        title.textContent = 'Nuevo Estudiante';
        document.getElementById('studentPassword').setAttribute('required', 'required');
    }
    
    // Setup RUT formatting for this modal
    setTimeout(() => {
        setupRUTFormatting();
    }, 100);
}

async function saveStudent() {
    const form = document.getElementById('studentForm');
    const formData = new FormData(form);
    const studentId = formData.get('studentId');
    
    // Get role ID for "Estudiante"
    const estudianteRole = adminDashboard.roles.find(role => role.nombre === 'Estudiante');
    if (!estudianteRole) {
        Swal.fire('Error', 'No se encontró el rol de estudiante', 'error');
        return;
    }
    
    const studentData = {
        nombre: formData.get('nombre'),
        apellidoPaterno: formData.get('apellidoPaterno'),
        apellidoMaterno: formData.get('apellidoMaterno'),
        email: formData.get('email'),
        rut: cleanRUT(formData.get('rut')), // Limpiar formato del RUT antes de enviar
        rolId: estudianteRole.id,
        colegioId: parseInt(formData.get('colegioId')),
        activo: formData.has('activo')
    };
    
    // Only include password if provided
    const password = formData.get('password');
    if (password) {
        studentData.password = password;
    }

    try {
        let response;
        let userId;
        
        if (studentId) {
            // If editing, get the user ID from the student record
            const studentResponse = await authManager.authenticatedFetch(`/estudiantes/${studentId}`);
            const student = await studentResponse.json();
            userId = student.usuarioId;
            
            // Update user
            response = await authManager.authenticatedFetch(`/usuarios/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(studentData)
            });
        } else {
            // Create user first
            response = await authManager.authenticatedFetch('/usuarios', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(studentData)
            });
        }        if (response.ok) {
            const result = await response.json();
            userId = result.id;
            
            // If creating a new student, create the student record
            if (!studentId) {
                const cursoId = formData.get('cursoId');
                if (cursoId) {
                    try {
                        await authManager.authenticatedFetch('/estudiantes', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                usuarioId: userId,
                                cursoId: parseInt(cursoId)
                            })
                        });
                    } catch (enrollError) {
                        console.error('Error creating student record:', enrollError);
                    }
                }
            }
            
            const modal = bootstrap.Modal.getInstance(document.getElementById('studentModal'));
            modal.hide();
            
            Swal.fire({
                title: 'Éxito',
                text: studentId ? 'Estudiante actualizado correctamente' : 'Estudiante creado correctamente',
                icon: 'success',
                timer: 2000
            });
              // Reload students
            adminDashboard.loadStudents();
            adminDashboard.loadDashboardStats();
        } else {
            const error = await response.json();
            throw new Error(error.message);
        }
    } catch (error) {
        console.error('Error saving student:', error);
        Swal.fire('Error', error.message || 'Error al guardar el estudiante', 'error');
    }
}

async function editStudent(studentId) {
    await openStudentModal(studentId);
    const modal = new bootstrap.Modal(document.getElementById('studentModal'));
    modal.show();
}

async function deleteStudent(studentId) {
    const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta acción eliminará al estudiante permanentemente',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
        try {
            const response = await authManager.authenticatedFetch(`/estudiantes/${studentId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                Swal.fire('Eliminado', 'Estudiante eliminado correctamente', 'success');
                adminDashboard.loadStudents();
                adminDashboard.loadDashboardStats();
            } else {
                const error = await response.json();
                throw new Error(error.message);
            }
        } catch (error) {
            console.error('Error deleting student:', error);
            Swal.fire('Error', error.message || 'Error al eliminar el estudiante', 'error');
        }
    }
}

// Profile Management Functions
async function loadUserProfile() {
    try {
        const user = authManager.getCurrentUser();
        
        document.getElementById('profileFirstName').value = user.firstName || '';
        document.getElementById('profileLastName').value = user.lastName || '';
        document.getElementById('profileEmail').value = user.email || '';
        document.getElementById('profileRole').value = user.role || '';
        document.getElementById('profileCollege').value = user.college?.name || 'N/A';
    } catch (error) {
        console.error('Error loading user profile:', error);
        Swal.fire('Error', 'Error al cargar el perfil del usuario', 'error');
    }
}

async function updateProfile() {
    const form = document.getElementById('profileForm');
    const formData = new FormData(form);
    
    const profileData = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName')
    };    try {
        const user = authManager.getCurrentUser();
        const response = await authManager.authenticatedFetch(`/usuarios/${user.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(profileData)
        });

        if (response.ok) {
            const updatedUser = await response.json();
            
            // Update stored user data
            const currentUser = authManager.getCurrentUser();
            currentUser.firstName = updatedUser.firstName;
            currentUser.lastName = updatedUser.lastName;
            localStorage.setItem('user', JSON.stringify(currentUser));
            
            // Update UI
            document.getElementById('userName').textContent = `${updatedUser.firstName} ${updatedUser.lastName}`;
            
            Swal.fire({
                title: 'Éxito',
                text: 'Perfil actualizado correctamente',
                icon: 'success',
                timer: 2000
            });
        } else {
            const error = await response.json();
            throw new Error(error.message);
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        Swal.fire('Error', error.message || 'Error al actualizar el perfil', 'error');
    }
}

async function changePassword() {
    const form = document.getElementById('passwordForm');
    const formData = new FormData(form);
    
    const currentPassword = formData.get('currentPassword');
    const newPassword = formData.get('newPassword');
    const confirmPassword = formData.get('confirmPassword');
    
    // Validate passwords
    if (newPassword !== confirmPassword) {
        Swal.fire('Error', 'Las contraseñas no coinciden', 'error');
        return;
    }
    
    if (newPassword.length < 6) {
        Swal.fire('Error', 'La contraseña debe tener al menos 6 caracteres', 'error');
        return;
    }

    try {
        const user = authManager.getCurrentUser();        const response = await authManager.authenticatedFetch(`/usuarios/${user.id}/change-password`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                currentPassword: currentPassword,
                newPassword: newPassword
            })
        });

        if (response.ok) {
            form.reset();
            Swal.fire({
                title: 'Éxito',
                text: 'Contraseña actualizada correctamente',
                icon: 'success',
                timer: 2000
            });
        } else {
            const error = await response.json();
            throw new Error(error.message);
        }
    } catch (error) {
        console.error('Error changing password:', error);
        Swal.fire('Error', error.message || 'Error al cambiar la contraseña', 'error');
    }
}

// RUT Formatting Functions
function formatRUT(rut) {
    if (!rut || typeof rut !== 'string') return rut;
    
    // Remover espacios, puntos y guiones para limpiar
    const cleanRut = rut.trim().replace(/\s/g, '').replace(/\./g, '').replace(/-/g, '');
    
    // Verificar que tenga al menos 8 caracteres y solo números + k/K al final
    if (cleanRut.length < 8 || cleanRut.length > 9) return rut;
    if (!/^\d+[0-9kK]$/.test(cleanRut)) return rut;
    
    // Separar número y dígito verificador
    const rutNumber = cleanRut.slice(0, -1);
    const verificador = cleanRut.slice(-1).toUpperCase();
    
    // Formatear con puntos cada 3 dígitos desde la derecha
    const formattedNumber = rutNumber.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    
    return `${formattedNumber}-${verificador}`;
}

function cleanRUT(rut) {
    if (!rut || typeof rut !== 'string') return '';
    return rut.trim().replace(/\s/g, '').replace(/\./g, '').replace(/-/g, '');
}

function formatRUTAsUserTypes(input) {
    let value = input.value;
    
    // Remover todo excepto números y K/k
    value = value.replace(/[^0-9kK]/g, '');
    
    // Convertir k minúscula a mayúscula
    value = value.replace(/k/g, 'K');
    
    // Limitar longitud (máximo 9 caracteres sin formato)
    if (value.length > 9) {
        value = value.slice(0, 9);
    }
    
    // Solo aplicar formato si hay contenido y al menos 2 caracteres
    if (value.length >= 2) {
        // Separar número del dígito verificador
        const rutNumber = value.slice(0, -1);
        const verificador = value.slice(-1);
        
        // Solo aplicar puntos si hay al menos 4 dígitos en el número
        let formattedNumber = rutNumber;
        if (rutNumber.length >= 4) {
            formattedNumber = rutNumber.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        }
        
        // Retornar con guión si hay dígito verificador
        value = `${formattedNumber}-${verificador}`;
    }
    
    input.value = value;
}

function setupRUTFormatting() {
    // Buscar todos los campos RUT dinámicamente
    const rutInputs = document.querySelectorAll('input[name="rut"], #rut, #studentRut');
    
    rutInputs.forEach(input => {
        // Remover event listeners existentes para evitar duplicados
        const newInput = input.cloneNode(true);
        input.parentNode.replaceChild(newInput, input);
        
        // Configurar event listeners
        newInput.addEventListener('input', function() {
            formatRUTAsUserTypes(this);
        });
        
        newInput.addEventListener('focus', function() {
            if (this.value) {
                formatRUTAsUserTypes(this);
            }
        });
        
        newInput.addEventListener('blur', function() {
            const cleanValue = cleanRUT(this.value);
            if (cleanValue && !validateRUTClient(cleanValue)) {
                this.classList.add('is-invalid');
                // Mostrar feedback de error
                let feedback = this.parentNode.querySelector('.invalid-feedback');
                if (!feedback) {
                    feedback = document.createElement('div');
                    feedback.className = 'invalid-feedback';
                    this.parentNode.appendChild(feedback);
                }
                feedback.textContent = 'RUT no válido. Ejemplo: 12.345.678-9';
            } else {
                this.classList.remove('is-invalid');
                const feedback = this.parentNode.querySelector('.invalid-feedback');
                if (feedback) {
                    feedback.remove();
                }
            }
        });
    });
}

function validateRUTClient(rut) {
    if (!rut || typeof rut !== 'string') return false;
    
    // Remover espacios, puntos y guiones
    const cleanRut = rut.trim().replace(/\s/g, '').replace(/\./g, '').replace(/-/g, '');
    
    // Verificar que tenga entre 8 y 9 caracteres
    if (cleanRut.length < 8 || cleanRut.length > 9) return false;
    
    // Extraer número y dígito verificador
    const rutNumber = cleanRut.slice(0, -1);
    const verificador = cleanRut.slice(-1).toLowerCase();
    
    // Verificar que el número sea válido
    if (!/^\d+$/.test(rutNumber)) return false;
    
    // Verificar que el dígito verificador sea válido
    if (!/^[0-9k]$/.test(verificador)) return false;
    
    // Calcular dígito verificador
    let suma = 0;
    let multiplicador = 2;
    
    for (let i = rutNumber.length - 1; i >= 0; i--) {
        suma += parseInt(rutNumber[i]) * multiplicador;
        multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
    }
    
    const resto = suma % 11;
    const dvCalculado = resto === 0 ? '0' : resto === 1 ? 'k' : (11 - resto).toString();
    
    return verificador === dvCalculado;
}

// Initialize admin dashboard
let adminDashboard;
document.addEventListener('DOMContentLoaded', () => {
    adminDashboard = new AdminDashboard();
    
    // Setup RUT formatting after DOM is loaded
    setTimeout(() => {
        setupRUTFormatting();
    }, 500);
});
