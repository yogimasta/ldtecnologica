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
            e.preventDefault(); 

            // Recolectamos los datos
            const formData = new FormData(contactForm);
            formData.append("access_key", "dc10273e-0cba-4a71-abf0-73cc8e01c172"); // Pon tu llave aquí

            // Convertimos a JSON (Formato a prueba de bloqueos)
            const object = Object.fromEntries(formData);
            const json = JSON.stringify(object);

            const btnSubmit = contactForm.querySelector('button[type="submit"]');
            const originalText = btnSubmit.innerHTML;
            
            btnSubmit.innerHTML = '<i class="fas fa-spinner fa-spin" style="margin-right: 8px;"></i> Enviando...';
            btnSubmit.disabled = true; 
            btnSubmit.style.opacity = '0.7';

            // Enviamos en formato JSON
            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: json
            })
            .then(response => response.json()) 
            .then(data => {
                if(data.success) {
                    btnSubmit.innerHTML = '<i class="fas fa-check-circle" style="margin-right: 8px;"></i> ¡Enviado con Éxito!';
                    btnSubmit.style.backgroundColor = '#10b981'; 
                    btnSubmit.style.borderColor = '#10b981';
                    btnSubmit.style.opacity = '1';
                    
                    contactForm.reset(); 
                    
                    setTimeout(() => {
                        btnSubmit.innerHTML = originalText;
                        btnSubmit.style.backgroundColor = ''; 
                        btnSubmit.style.borderColor = '';
                        btnSubmit.disabled = false;
                    }, 4000);
                    
                } else {
                    alert("Hubo un problema al enviar: " + data.message);
                    btnSubmit.innerHTML = originalText;
                    btnSubmit.disabled = false;
                    btnSubmit.style.opacity = '1';
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert("Error de conexión. Revisa tu internet e inténtalo de nuevo.");
                btnSubmit.innerHTML = originalText;
                btnSubmit.disabled = false;
                btnSubmit.style.opacity = '1';
            });
        });
    }

});


