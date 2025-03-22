from flask import Flask, jsonify
import logging
import os

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = Flask(__name__)

@app.route('/')
def index():
    resp = "Hello World - Search Keyword Tracker"
    return resp, 200, {'Content-Type': 'text/plain'}

@app.route('/health')
def health():
    resp = jsonify({"status": "healthy"})
    resp.status_code = 200
    resp.headers['Content-Type'] = 'application/json'
    return resp

@app.errorhandler(Exception)
def handle_error(e):
    logger.exception("An error occurred: %s", str(e))
    return jsonify({"error": str(e)}), 500, {'Content-Type': 'application/json'}


if __name__ == '__main__':
    #Remove template directory handling as per instruction
    #os.makedirs('templates', exist_ok=True) 
    logger.info("Starting Flask server on 0.0.0.0:5000")
    app.run(host='0.0.0.0', port=5000, debug=False)