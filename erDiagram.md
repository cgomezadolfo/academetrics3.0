````mermaid`
erDiagram
    %% Relaciones principales
    ROL ||--o{ USUARIO : tiene
    COLEGIO ||--o{ USUARIO : pertenece_a
    USUARIO ||--o{ EVALUACION : crea
    USUARIO ||--|{ ESTUDIANTE : es

    COLEGIO ||--o{ CURSO : tiene
    CURSO ||--o{ ASIGNATURA : tiene

    CURSO ||--o{ ESTUDIANTE : inscribe
    ASIGNATURA ||--o{ EVALUACION : corresponde_a

    EVALUACION ||--o{ PREGUNTA : contiene
    PREGUNTA ||--o{ ALTERNATIVA : tiene

    EVALUACION ||--o{ APLICACION_EVALUACION : es_aplicada_en
    CURSO ||--o{ APLICACION_EVALUACION : recibe_aplicacion

    APLICACION_EVALUACION ||--o{ CALIFICACION : genera
    ESTUDIANTE ||--o{ CALIFICACION : obtiene

    CALIFICACION ||--o{ RESPUESTA_ESTUDIANTE : detalla
    PREGUNTA ||--o{ RESPUESTA_ESTUDIANTE : respondida_por

    %% Entidades
    USUARIO {
        INT id PK
        VARCHAR email UK
        VARCHAR passwordHash
        VARCHAR nombre
        VARCHAR apellidoPaterno
        VARCHAR apellidoMaterno
        VARCHAR rut UK
        BOOLEAN activo
        DATETIME createdAt
        DATETIME updatedAt
        INT rolId FK
        INT colegioId FK
    }

    ROL {
        INT id PK
        VARCHAR nombre UK
        TEXT descripcion
        DATETIME createdAt
        DATETIME updatedAt
    }

    COLEGIO {
        INT id PK
        VARCHAR nombre
        VARCHAR direccion
        VARCHAR telefono
        DATETIME createdAt
        DATETIME updatedAt
    }

    CURSO {
        INT id PK
        VARCHAR nivel
        VARCHAR letra
        VARCHAR jornada
        INT colegioId FK
        DATETIME createdAt
        DATETIME updatedAt
    }

    ASIGNATURA {
        INT id PK
        VARCHAR nombre
        INT cursoId FK
        DATETIME createdAt
        DATETIME updatedAt
    }

    ESTUDIANTE {
        INT id PK
        INT usuarioId UK FK
        INT cursoId FK
        DATETIME createdAt
        DATETIME updatedAt
    }

    EVALUACION {
        INT id PK
        VARCHAR titulo
        TEXT descripcion
        DECIMAL puntajeTotal
        INT profesorId FK
        INT asignaturaId FK
        INT colegioId FK
        VARCHAR estado
        BOOLEAN mostrarCalificaciones
        DECIMAL notaMinima
        DECIMAL notaMaxima
        DECIMAL porcentajeAprobacion
        DATETIME createdAt
        DATETIME updatedAt
    }

    PREGUNTA {
        INT id PK
        INT evaluacionId FK
        VARCHAR tipoPregunta
        TEXT enunciado
        VARCHAR rutaImagen
        DECIMAL puntajeMaximo
        INT orden
        DATETIME createdAt
        DATETIME updatedAt
    }

    ALTERNATIVA {
        INT id PK
        INT preguntaId FK
        TEXT textoAlternativa
        BOOLEAN esCorrecta
        DATETIME createdAt
        DATETIME updatedAt
    }

    APLICACION_EVALUACION {
        INT id PK
        INT evaluacionId FK
        INT cursoId FK
        DATETIME fechaAplicacion
        DATETIME createdAt
        DATETIME updatedAt
    }

    CALIFICACION {
        INT id PK
        INT aplicacionEvaluacionId FK
        INT estudianteId FK
        DECIMAL puntajeObtenido
        DECIMAL calificacionFinal
        TEXT observaciones
        DATETIME createdAt
        DATETIME updatedAt
    }

    RESPUESTA_ESTUDIANTE {
        INT id PK
        INT calificacionId FK
        INT preguntaId FK
        TEXT respuestaTexto
        INT alternativaSeleccionadaId FK
        DECIMAL puntajeObtenidoPregunta
        BOOLEAN esCorrecta
        DATETIME createdAt
        DATETIME updatedAt
    }
````