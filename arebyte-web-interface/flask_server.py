from flask import Flask, render_template, send_from_directory, request, jsonify
import os
import time
import random
import string
from werkzeug.middleware.proxy_fix import ProxyFix

import output_controller as output

app = Flask(__name__)
SVG_FOLDER = "generated_images/svgs"
PNG_FOLDER = "generated_images/pngs"
TEXT_FOLDER = "generated_text"

app.wsgi_app = ProxyFix(
    app.wsgi_app, x_for=1, x_proto=1, x_host=1, x_prefix=1
)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/css/<path:path>')
def send_css(path):
    return send_from_directory('css', path)

@app.route('/static/<path:path>')
def send_static(path):
    return send_from_directory('static', path)

@app.route('/js/<path:path>')
def send_js(path):
    return send_from_directory('js', path)

@app.route('/upload_svg', methods=['POST'])
def upload_svg():
    req_data = request.get_json()
    svg_content = req_data.get('svg_data')

    if not svg_content:
        return jsonify({"error": "No SVG data provided"}), 400

    # Ensure the upload directory exists
    os.makedirs(SVG_FOLDER, exist_ok=True)

    # Create a filename for the bug!
    circuit_name = ""
    while circuit_name == "" or circuit_name in os.listdir(SVG_FOLDER):
        circuit_name = ''.join(random.choice(string.ascii_uppercase + string.digits) for i in range(6)) + ".svg"

    # Save as a .svg file
    file_path = os.path.join(SVG_FOLDER, circuit_name)
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(svg_content)

    # Put the generation functions in motion!
    output.generate_interation(file_path, circuit_name)

    return jsonify({"success": "SVG uploaded successfully", "path": file_path}), 200

if __name__ == "__main__":
    app.run(debug=True)

