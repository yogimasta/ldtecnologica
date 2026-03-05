document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. ACORDEÓN FAQ (Exclusivo del inicio)
    // ==========================================
    document.querySelectorAll('.faq-question').forEach(button => {
        button.addEventListener('click', () => {
            const faqItem = button.parentElement;
            document.querySelectorAll('.faq-item').forEach(item => {
                if (item !== faqItem) item.classList.remove('active');
            });
            faqItem.classList.toggle('active');
        });
    });

    // ==========================================
    // 2. LÓGICA DE ENVÍO DE CORREO DIRECTO (WEB3FORMS)
    // ==========================================
    const contactForm = document.getElementById('hero-contact-form');
    
    if(contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Detiene la recarga de la página

            // Recolectamos todos los datos que escribió el cliente
            const formData = new FormData(contactForm);
            
            // AGREGAMOS TU LLAVE DE ACCESO DIRECTO AL PAQUETE
            formData.append("access_key", "dc10273e-0cba-4a71-abf0-73cc8e01c172");

            // Capturamos el botón para cambiar su diseño
            const btnSubmit = contactForm.querySelector('button[type="submit"]');
            const originalText = btnSubmit.innerHTML;
            
            // Cambiamos el estado a "Enviando..."
            btnSubmit.innerHTML = '<i class="fas fa-spinner fa-spin" style="margin-right: 8px;"></i> Enviando...';
            btnSubmit.disabled = true; // Bloqueamos el botón para evitar doble envío
            btnSubmit.style.opacity = '0.7';

            // Enviamos los datos directo a Web3Forms (Saltamos Python/Render)
            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json()) // Recibimos el JSON de Web3Forms
            .then(data => {
                // Web3Forms devuelve data.success en lugar de data.status
                if(data.success) {
                    // Si todo salió bien: Botón Verde
                    btnSubmit.innerHTML = '<i class="fas fa-check-circle" style="margin-right: 8px;"></i> ¡Enviado con Éxito!';
                    btnSubmit.style.backgroundColor = '#10b981'; // Color verde esmeralda
                    btnSubmit.style.borderColor = '#10b981';
                    btnSubmit.style.opacity = '1';
                    
                    contactForm.reset(); // Limpiamos el formulario para que quede en blanco
                    
                    // Después de 4 segundos, el botón vuelve a la normalidad
                    setTimeout(() => {
                        btnSubmit.innerHTML = originalText;
                        btnSubmit.style.backgroundColor = ''; // Vuelve al color original
                        btnSubmit.style.borderColor = '';
                        btnSubmit.disabled = false;
                    }, 4000);
                    
                } else {
                    // Si Web3Forms nos devuelve un error
                    alert("Hubo un problema al enviar: " + data.message);
                    btnSubmit.innerHTML = originalText;
                    btnSubmit.disabled = false;
                    btnSubmit.style.opacity = '1';
                }
            })
            .catch(error => {
                // Si se cae el internet
                console.error('Error:', error);
                alert("Error de conexión. Revisa tu internet e inténtalo de nuevo.");
                btnSubmit.innerHTML = originalText;
                btnSubmit.disabled = false;
                btnSubmit.style.opacity = '1';
            });
        });
    }

});
