from flask import Flask, render_template, request, send_from_directory, jsonify, redirect
from flask_talisman import Talisman
import os
import requests 

app = Flask(__name__)

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

# 2. Le pasamos las reglas a Talisman 
Talisman(app, force_https=False, content_security_policy=csp)

@app.before_request
def redirigir_www():
    # Si la URL empieza con www, lo quitamos y redirigimos
    if request.host.startswith('www.'):
        host_limpio = request.host[4:] 
        url_limpia = request.url.replace(request.host, host_limpio, 1)
        return redirect(url_limpia, code=301)

# 3. Rutas Principales de la Web
@app.route('/')
def inicio():
    return render_template('index.html')

@app.route('/auto')  
def stats_page():
    return render_template('auto.html')

@app.route('/servicios')  
def servicios_page():
    return render_template('servicios.html')

# 4. Ruta para el Envío de Correos (Solo responde éxito, JS hace el resto)
@app.route('/enviar_correo', methods=['POST'])
def enviar_correo():
    return jsonify({"status": "success", "message": "Redireccionando..."})

# 5. Rutas SEO
@app.route('/robots.txt')
def robots():
    return send_from_directory(app.static_folder, 'robots.txt')

@app.route('/sitemap.xml')
def sitemap():
    return send_from_directory(app.static_folder, 'sitemap.xml')

# 6. Manejo de Errores
@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404

# 7. Arranque del Servidor (Corregido para Render)
if __name__ == '__main__':
    puerto = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=puerto, debug=False)
