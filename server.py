from flask import Flask, render_template, request, send_from_directory, jsonify, redirect
from flask_talisman import Talisman
import smtplib
from email.message import EmailMessage
import requests 

app = Flask(__name__)

from flask_talisman import Talisman

# 1. Definimos las reglas exactas
csp = {
    'default-src': [
        '\'self\'',
        '\'unsafe-inline\'',
        'https://*.googleapis.com',
        'https://*.gstatic.com',
        'https://*.googletagmanager.com',
        'https://cdnjs.cloudflare.com',
        'https://www.google-analytics.com'
    ],
    'script-src': [
        '\'self\'',
        '\'unsafe-inline\'',
        '\'unsafe-eval\'',
        'https://*.googletagmanager.com',
        'https://www.google-analytics.com'
    ],
    'style-src': [
        '\'self\'',
        '\'unsafe-inline\'',
        'https://*.googleapis.com',
        'https://cdnjs.cloudflare.com'
    ],
    'font-src': [
        '\'self\'',
        'https://*.gstatic.com',
        'https://cdnjs.cloudflare.com'
    ]
}

# 2. Le pasamos las reglas a Talisman (Asegúrate de que reemplace a tu Talisman anterior)
Talisman(app, force_https=False, content_security_policy=csp)
@app.before_request
def redirigir_www():
    # Si la URL empieza con www, lo quitamos y redirigimos
    if request.host.startswith('www.'):
        host_limpio = request.host[4:] 
        url_limpia = request.url.replace(request.host, host_limpio, 1)
        return redirect(url_limpia, code=301)

# 2. Rutas Principales de la Web
@app.route('/')
def inicio():
    return render_template('index.html')

@app.route('/auto')  
def stats_page():
    return render_template('auto.html')

@app.route('/servicios')  
def servicios_page():
    return render_template('servicios.html')

import requests # Asegúrate de agregar esto arriba con tus otros imports

# 3. Ruta para el Envío de Correos
@app.route('/enviar_correo', methods=['POST'])
def enviar_correo():
    # 1. Validación del Honeypot (Protección contra bots)
    honeypot = request.form.get('validacion_empresa')
    if honeypot:
        return jsonify({"status": "success", "message": "Mensaje enviado"})

    # 2. Captura de datos del formulario
    nombre = request.form.get('nombre')
    empresa = request.form.get('empresa', 'No especificada')
    correo = request.form.get('correo')
    telefono = request.form.get('telefono', 'No especificado')
    mensaje_cliente = request.form.get('mensaje')

    # 3. Configuración para Web3Forms (Reemplaza a smtplib)
    access_key = os.environ.get('WEB3FORMS_KEY') 

    # 4. Creación del paquete de datos
    payload = {
        "access_key": access_key,
        "subject": f"🟢 NUEVA COTIZACIÓN WEB: {nombre} ({empresa})",
        "from_name": nombre,
        "email": correo, 
        "message": f"DATOS DEL CLIENTE:\n- Nombre: {nombre}\n- Empresa: {empresa}\n- Correo: {correo}\n- Teléfono: {telefono}\n\nMENSAJE / REQUERIMIENTO:\n{mensaje_cliente}"
    }

    # 5. Envío Real y Respuesta JSON (Vía HTTP, permitido por Render)
    try:
        respuesta = requests.post("https://api.web3forms.com/submit", json=payload)
        
        # Si el envío fue exitoso, el JavaScript de L&D TECNOLÓGICA mostrará el éxito
        if respuesta.status_code == 200:
            return jsonify({'status': 'success', 'message': '¡Mensaje enviado con éxito!'})
        else:
            return jsonify({'status': 'error', 'message': 'No se pudo procesar el envío.'})
            
    except Exception as e:
        # Si falla el internet, el JavaScript mostrará el error
        return jsonify({'status': 'error', 'message': f"Error de conexión: {str(e)}"})
@app.route('/robots.txt')
def robots():
    return send_from_directory(app.static_folder, 'robots.txt')

@app.route('/sitemap.xml')
def sitemap():
    return send_from_directory(app.static_folder, 'sitemap.xml')

# 5. Manejo de Errores
@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404

# 6. Arranque del Servidor
if __name__ == '__main__':

    app.run(debug=False, port=5000)

