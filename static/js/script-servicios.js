document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. BASE DE DATOS DE SERVICIOS
    // ==========================================
    const serviciosData = {
        "card-1": {
            titulo: "Automatización Industrial",
            subtitulo: "Control preciso, seguro y escalable para maximizar la productividad de su planta.",
            alcance: [
                "Programación de PLC y pantallas HMI (Siemens, Rockwell, Schneider, etc.).",
                "Desarrollo e integración de arquitecturas SCADA robustas.",
                "Migración y actualización de sistemas de control obsoletos.",
                "Integración de redes de comunicación industrial (Profinet, Modbus, Ethernet/IP)."
            ],
            limitaciones: [
                "Ejemplo: No incluye obra civil ni canalización (modificar a gusto).",
                "Ejemplo: Las licencias de software SCADA se cotizan por separado."
            ],
            entregables: [
                "Código fuente de programación abierto y documentado.",
                "Planos eléctricos As-Built en AutoCAD.",
                "Manual de operación y mantenimiento del sistema.",
                "Capacitación al personal de planta y soporte Post-Venta."
            ],
            whatsapp: "Hola L&D, deseo cotizar un proyecto de Automatización Industrial."
        },
        "card-2": {
            titulo: "Tableros Eléctricos",
            subtitulo: "Diseño y manufactura de tableros bajo estrictas normativas internacionales IEC / NEMA.",
            alcance: [
                "Diseño y ensamblaje de Tableros Generales de Distribución (TGD).",
                "Fabricación de Centros de Control de Motores (CCM) convencionales e inteligentes.",
                "Montaje de Tableros de Transferencia Automática (TTA) y Banco de Condensadores.",
                "Mantenimiento preventivo, limpieza integral y ajuste de borneras en tableros existentes."
            ],
            limitaciones: [
                "Ejemplo: El transporte al sitio de instalación final no está incluido.",
                "Ejemplo: Solo se utilizan componentes de marcas previamente aprobadas por el cliente."
            ],
            entregables: [
                "Protocolos de Pruebas FAT (Factory Acceptance Test).",
                "Certificado de operatividad y garantía.",
                "Diagramas unifilares y de control actualizados.",
                "Dossier de calidad con fichas técnicas de componentes."
            ],
            whatsapp: "Hola L&D, requiero la fabricación o mantenimiento de un Tablero Eléctrico."
        },
        "card-3": {
            titulo: "Instrumentación y Control",
            subtitulo: "Medición precisa y confiable para asegurar la calidad de sus procesos industriales.",
            alcance: [
                "Selección y dimensionamiento de sensores (presión, temperatura, caudal, nivel).",
                "Calibración y sintonización de lazos de control PID.",
                "Instalación de transmisores, posicionadores de válvulas e indicadores locales.",
                "Diagnóstico de fallas y mantenimiento de instrumentación de campo."
            ],
            limitaciones: [
                "Ejemplo: La paralización de planta para instalación debe ser gestionada por el cliente.",
                "Ejemplo: No realizamos modificaciones en tuberías de alta presión sin certificación externa."
            ],
            entregables: [
                "Certificados de calibración de instrumentos.",
                "Protocolos de pruebas de lazo (Loop Test).",
                "Planos P&ID (Diagramas de Tuberías e Instrumentación) actualizados.",
                "Reporte técnico de estado de la instrumentación en planta."
            ],
            whatsapp: "Hola L&D, deseo asesoría y cotización para servicios de Instrumentación."
        },
        "card-4": {
            titulo: "Sistemas de Bombeo Constante",
            subtitulo: "Soluciones hidroneumáticas eficientes para un suministro de agua ininterrumpido y optimizado.",
            alcance: [
                "Diseño de sistemas de bombeo alternado y simultáneo.",
                "Integración y parametrización de Variadores de Frecuencia (VFD).",
                "Automatización del control de nivel de cisternas y tanques elevados.",
                "Mantenimiento mecánico y eléctrico de electrobombas y tableros asociados."
            ],
            limitaciones: [
                "Ejemplo: No incluye perforación de pozos ni estudios de napa freática.",
                "Ejemplo: El suministro eléctrico principal hasta el tablero debe estar habilitado."
            ],
            entregables: [
                "Memoria de cálculo hidráulico y eléctrico.",
                "Curvas de rendimiento y eficiencia del sistema.",
                "Protocolos de pruebas de presión y caudal en sitio.",
                "Manual de operación del sistema hidroneumático."
            ],
            whatsapp: "Hola L&D, necesito cotizar un sistema de Bombeo de Presión Constante."
        },
        "card-5": {
            titulo: "Consultoría y Calidad de Energía",
            subtitulo: "Auditorías y estudios técnicos para garantizar la seguridad y eficiencia energética de su instalación.",
            alcance: [
                "Estudios de calidad de energía (medición de armónicos, factor de potencia, transitorios).",
                "Levantamiento de información en campo y actualización de planos eléctricos.",
                "Auditorías de seguridad eléctrica bajo normativa técnica peruana (CNE, Indeci).",
                "Diseño, medición y mantenimiento de mallas de puesta a tierra."
            ],
            limitaciones: [
                "Ejemplo: El costo del analizador de redes se considera como alquiler diario.",
                "Ejemplo: La subsanación de observaciones no se incluye en el costo de la auditoría inicial."
            ],
            entregables: [
                "Informe técnico detallado con resultados del analizador de redes.",
                "Cuadro de cargas y diagramas unifilares firmados por ingeniero colegiado.",
                "Certificados de operatividad eléctrica vigentes.",
                "Protocolos de medición de resistencia de pozos a tierra."
            ],
            whatsapp: "Hola L&D, requiero un servicio de Consultoría, planos o Estudio de Calidad de Energía."
        }
    };

    // ==========================================
    // 2. LÓGICA DEL MODAL DE SERVICIOS
    // ==========================================
    const modal = document.getElementById('service-modal');
    const btnClose = document.getElementById('close-modal');
    const cards = document.querySelectorAll('.gallery-card');

    if(modal && cards.length > 0) {
        // Elementos del modal a cambiar
        const mTitle = document.getElementById('modal-title');
        const mSubtitle = document.getElementById('modal-subtitle');
        const mScope = document.getElementById('modal-scope');
        const mLimitations = document.getElementById('modal-limitations');
        const mDeliverables = document.getElementById('modal-deliverables');
        const mWhatsapp = document.getElementById('modal-whatsapp');

        cards.forEach(card => {
            card.addEventListener('click', function() {
                // Identificar qué tarjeta se clicó (card-1, card-2, etc.)
                const cardClass = Array.from(this.classList).find(cls => cls.startsWith('card-')); 
                const data = cardClass ? serviciosData[cardClass] : null;

                if(data) {
                    // Llenar el modal con los datos
                    if(mTitle) mTitle.textContent = data.titulo;
                    if(mSubtitle) mSubtitle.textContent = data.subtitulo;
                    
                    // Generar listas
                    if(mScope) mScope.innerHTML = data.alcance.map(item => `<li>${item}</li>`).join('');
                    if(mLimitations) mLimitations.innerHTML = data.limitaciones.map(item => `<li>${item}</li>`).join('');
                    if(mDeliverables) mDeliverables.innerHTML = data.entregables.map(item => `<li>${item}</li>`).join('');
                    
                    // Configurar enlace de WhatsApp
                    if(mWhatsapp) mWhatsapp.href = `https://wa.me/51947924204?text=${encodeURIComponent(data.whatsapp)}`;

                    // Mostrar Modal
                    modal.classList.add('active');
                    document.body.style.overflow = 'hidden'; 
                }
            });
        });

        // Cerrar Modal con botón
        if(btnClose) {
            btnClose.addEventListener('click', () => {
                modal.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        }

        // Cerrar Modal haciendo clic afuera de la caja blanca
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }
});