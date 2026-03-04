document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. LÓGICA DEL HEADER SCROLL
    // ==========================================
    const navbar = document.getElementById("navbar");
    if(navbar) {
        window.addEventListener("scroll", () => {
            navbar.classList.toggle("scrolled", window.scrollY > 50);
        });
    }

    // ==========================================
    // 2. ANIMACIÓN REVEAL (Aparición al hacer scroll)
    // ==========================================
    function reveal(){
        const reveals = document.querySelectorAll('.reveal');
        reveals.forEach(element => {
            if(element.getBoundingClientRect().top < window.innerHeight - 100) {
                element.classList.add('active');
            }
        });
    }
    window.addEventListener('scroll', reveal);
    reveal(); // Dispara la animación al cargar la página por primera vez

    // ==========================================
    // 3. MENÚ MÓVIL BLINDADO
    // ==========================================
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const closeMenuBtn = document.getElementById('close-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    function closeMenu() {
        if(mobileMenu) {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = 'auto'; 
        }
    }
    
    if(hamburgerBtn && mobileMenu) {
        hamburgerBtn.addEventListener('click', () => {
            mobileMenu.classList.add('active');
            document.body.style.overflow = 'hidden'; 
        });
    }
    if(closeMenuBtn) closeMenuBtn.addEventListener('click', closeMenu);

    document.querySelectorAll('.mobile-links a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // ==========================================
    // 4. BANNER DE COOKIES
    // ==========================================
    const cookieBanner = document.getElementById("cookie-banner");
    if (cookieBanner && !localStorage.getItem("cookieConsent")) {
        setTimeout(() => { cookieBanner.classList.add("show"); }, 1000);
    }
    
    const btnAcceptCookies = document.getElementById("btn-accept-cookies");
    const btnRejectCookies = document.getElementById("btn-reject-cookies");
    
    if(btnAcceptCookies) {
        btnAcceptCookies.addEventListener("click", () => {
            localStorage.setItem("cookieConsent", "accepted");
            cookieBanner.classList.remove("show");
            // Nota: Aquí se asume que tu script en base.html carga Analytics
        });
    }
    if(btnRejectCookies) {
        btnRejectCookies.addEventListener("click", () => {
            localStorage.setItem("cookieConsent", "rejected");
            cookieBanner.classList.remove("show");
        });
    }

    // ==========================================
    // 5. MODAL LEGAL (Privacidad y Términos)
    // ==========================================
    const legalModal = document.getElementById('legal-modal');
    const closeLegalBtn = document.getElementById('close-legal-btn');
    const legalTitle = document.getElementById('legal-title');
    const legalBody = document.getElementById('legal-body');

    // Textos del Modal
    const legalTexts = {
        privacidad: {
            title: "Política de Privacidad",
            content: `
                <p><strong>Última actualización: Febrero 2026</strong></p>
                <p>En L&D Tecnológica S.A.C. respetamos su privacidad y protegemos sus datos personales. Esta política explica cómo recopilamos, usamos y resguardamos la información obtenida a través de nuestro sitio web.</p>
                <br>
                <h4 style="color: var(--primary); margin-bottom: 5px;">1. Información que recopilamos</h4>
                <p>Solo recopilamos información que usted nos proporciona voluntariamente a través de nuestros formularios de contacto, incluyendo nombre, correo electrónico, empresa y número telefónico.</p>
                <br>
                <h4 style="color: var(--primary); margin-bottom: 5px;">2. Uso de la información</h4>
                <p>Los datos recopilados son utilizados exclusivamente para: responder a sus consultas técnicas, enviar cotizaciones de proyectos, y establecer comunicación comercial B2B.</p>
                <br>
                <p><em>Para cualquier consulta legal, contáctenos en: ld.servicios.ventas@gmail.com</em></p>
            `
        },
        terminos: {
            title: "Términos de Servicio",
            content: `
                <p><strong>Última actualización: Febrero 2026</strong></p>
                <p>Al acceder y utilizar el sitio web de L&D Tecnológica S.A.C., usted acepta estar sujeto a los siguientes términos y condiciones de uso.</p>
                <br>
                <h4 style="color: var(--primary); margin-bottom: 5px;">1. Propiedad Intelectual</h4>
                <br>
                <h4 style="color: var(--primary); margin-bottom: 5px;">2. Limitación de Responsabilidad</h4>
                <p>La información proporcionada en esta web es de carácter informativo. Para especificaciones técnicas exactas y garantías de proyectos, se deberá firmar un contrato formal de servicios con nuestra empresa.</p>
            `
        }
    };

    function openModal(type) {
        if(legalModal && legalTitle && legalBody && legalTexts[type]) {
            legalTitle.textContent = legalTexts[type].title;
            legalBody.innerHTML = legalTexts[type].content;
            legalModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    const linkPrivacidad = document.getElementById('link-privacidad');
    const linkTerminos = document.getElementById('link-terminos');
    
    if(linkPrivacidad) linkPrivacidad.addEventListener('click', () => openModal('privacidad'));
    if(linkTerminos) linkTerminos.addEventListener('click', () => openModal('terminos'));

    if(closeLegalBtn) {
        closeLegalBtn.addEventListener('click', () => {
            legalModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    }
    
    window.addEventListener('click', (e) => {
        if (e.target === legalModal) {
            legalModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });

    // ==========================================
    // 6. RASTREO DE BOTONES PARA ANALYTICS
    // ==========================================
    const botones = document.querySelectorAll('.btn-servicio, .btn-abrir, .btn-cerrar, .btn-primary');

    botones.forEach(boton => {
        boton.addEventListener('click', function() {
            // Leemos los datos del botón
            const nombreExacto = this.getAttribute('data-nombre') || this.innerText;
            const tipoDeBoton = this.className;

            // Enviamos el evento SOLO si la función gtag existe (es decir, si aceptó cookies)
            if (typeof gtag === 'function') {
                gtag('event', 'clic_en_boton', {
                    'boton_presionado': nombreExacto,
                    'clase_del_boton': tipoDeBoton
                });
            } else {
                console.log("Analytics bloqueado por cookies. Clic detectado en:", nombreExacto);
            }
        });
    });

});