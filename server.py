from flask import Flask, render_template, request, send_from_directory, jsonify, redirect
from flask_talisman import Talisman
import smtplib
from email.message import EmailMessage

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

    # 3. Configuración de credenciales
    mi_correo = "cruzcarazasmelvin@gmail.com" 
    password = "bfjy xoll gdsy txoz" 

    # 4. Creación del mensaje
    msg = EmailMessage()
    msg['Subject'] = f"🟢 NUEVA COTIZACIÓN WEB: {nombre} ({empresa})"
    msg['From'] = mi_correo
    msg['To'] = mi_correo 
    
    cuerpo_correo = f"""
    Has recibido un nuevo mensaje desde la página web corporativa:

    DATOS DEL CLIENTE:
    - Nombre: {nombre}
    - Empresa: {empresa}
    - Correo: {correo}
    - Teléfono: {telefono}

    MENSAJE / REQUERIMIENTO:
    {mensaje_cliente}
    """
    msg.set_content(cuerpo_correo)

    # 5. Envío Real y Respuesta JSON
    try:
        # Esta es la parte que faltaba: la conexión con Gmail
        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
            smtp.login(mi_correo, password)
            smtp.send_message(msg)
        
        # Si el envío fue exitoso, el JavaScript de L&D TECNOLÓGICA mostrará el éxito
        return jsonify({'status': 'success', 'message': '¡Mensaje enviado con éxito!'})
        
    except Exception as e:
        # Si falla la clave o el internet, el JavaScript mostrará el error
        return jsonify({'status': 'error', 'message': f"Error al enviar: {str(e)}"})# 4. Rutas para SEO (Buscadores)
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