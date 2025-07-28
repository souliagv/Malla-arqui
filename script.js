document.addEventListener('DOMContentLoaded', () => {
    // --- SELECCIÓN DE ELEMENTOS Y DEFINICIÓN DE FRASES ---
    const ramos = document.querySelectorAll('.ramo');
    const popup = document.getElementById('mensaje-popup');

    const frasesMotivacionales = [
        "¡Eres seca!",
        "Inteligente prometida",
        "Novia arquitecta",
        "Fantastiarquitectonico",
        "Te queda poquito",
        "Hazlo por nosotros",
        "Flash está orgulloso",
        "Recuerda, el novio te ama"
    ];
    const fraseSemestre5 = "¡Yujuu, ya eres casi 50% arquitecta!";

    // --- LÓGICA PRINCIPAL ---

    /**
     * Carga el estado de los ramos aprobados desde el localStorage del navegador.
     */
    const cargarEstado = () => {
        const aprobadosGuardados = JSON.parse(localStorage.getItem('ramosAprobadosArq')) || [];
        aprobadosGuardados.forEach(id => {
            const ramo = document.getElementById(id);
            if (ramo) {
                ramo.classList.add('aprobado');
            }
        });
    };

    /**
     * Guarda los IDs de los ramos aprobados en el localStorage.
     */
    const guardarEstado = () => {
        const ramosAprobados = document.querySelectorAll('.ramo.aprobado');
        const idsAprobados = Array.from(ramosAprobados).map(ramo => ramo.id);
        localStorage.setItem('ramosAprobadosArq', JSON.stringify(idsAprobados));
    };

    /**
     * Actualiza el estado visual (bloqueado/desbloqueado) de todos los ramos.
     */
    const actualizarEstadoBloqueo = () => {
        ramos.forEach(ramo => {
            if (ramo.classList.contains('aprobado')) {
                ramo.classList.remove('bloqueado');
                return;
            }

            const requisitos = ramo.dataset.requisitos.split(',').filter(Boolean);
            if (requisitos.length === 0) {
                ramo.classList.remove('bloqueado');
                return;
            }

            const requisitosCumplidos = requisitos.every(reqId => {
                const reqRamo = document.getElementById(reqId);
                return reqRamo && reqRamo.classList.contains('aprobado');
            });

            ramo.classList.toggle('bloqueado', !requisitosCumplidos);
        });
    };
    
    /**
     * Muestra un mensaje emergente.
     */
    let popupTimer;
    const mostrarMensaje = (texto, duracion, esError = false) => {
        clearTimeout(popupTimer);
        popup.textContent = texto;
        popup.classList.toggle('error', esError);
        popup.classList.add('visible');

        popupTimer = setTimeout(() => {
            popup.classList.remove('visible');
        }, duracion);
    };
    
    /**
     * Verifica si todos los ramos del semestre 5 están aprobados.
     */
    const verificarSemestre5Completo = () => {
        const ramosSemestre5 = document.querySelectorAll('.semestre[data-semestre="5"] .ramo');
        const todosAprobados = Array.from(ramosSemestre5).every(ramo => ramo.classList.contains('aprobado'));
        
        if (todosAprobados) {
            mostrarMensaje(fraseSemestre5, 20000);
        }
    };

    // --- MANEJADOR DE EVENTOS ---
    
    /**
     * Función que se ejecuta al hacer clic en un ramo.
     */
    const handleRamoClick = (e) => {
        const ramoSeleccionado = e.currentTarget;

        if (ramoSeleccionado.classList.contains('bloqueado')) {
            const requisitosFaltantes = ramoSeleccionado.dataset.requisitos
                .split(',')
                .filter(reqId => !document.getElementById(reqId)?.classList.contains('aprobado'))
                .map(reqId => document.getElementById(reqId)?.textContent)
                .join(', ');
            
            mostrarMensaje(`🐧 ¡Aún no! Debes aprobar: ${requisitosFaltantes}`, 5000, true);
            return;
        }

        const fueAprobado = ramoSeleccionado.classList.toggle('aprobado');

        if (fueAprobado) {
            const fraseAleatoria = frasesMotivacionales[Math.floor(Math.random() * frasesMotivacionales.length)];
            mostrarMensaje(fraseAleatoria, 10000);
            verificarSemestre5Completo();
        }
        
        guardarEstado();
        actualizarEstadoBloqueo();
    };

    // --- INICIALIZACIÓN ---
    
    ramos.forEach(ramo => ramo.addEventListener('click', handleRamoClick));

    cargarEstado();
    actualizarEstadoBloqueo();
});
