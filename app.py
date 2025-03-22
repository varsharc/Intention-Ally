from flask import Flask, render_template, jsonify, request
import pandas as pd
import plotly.express as px
import plotly.utils
import json
from datetime import datetime, timedelta
import logging
import os
import numpy as np

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Sample data structure
SAMPLE_KEYWORDS = [
    {"id": 1, "term": "carbon insetting", "active": True},
    {"id": 2, "term": "sustainable aviation", "active": True},
]

SAMPLE_RESULTS = {
    "carbon insetting": [
        {
            "title": "Understanding Carbon Insetting",
            "url": "https://example.com/1",
            "description": "An overview of carbon insetting practices",
            "date": datetime.now().strftime("%Y-%m-%d")
        }
    ],
    "sustainable aviation": [
        {
            "title": "Future of Sustainable Aviation",
            "url": "https://example.com/2",
            "description": "Exploring sustainable aviation technologies",
            "date": datetime.now().strftime("%Y-%m-%d")
        }
    ]
}

@app.route('/')
def index():
    return render_template('index.html', keywords=SAMPLE_KEYWORDS)

@app.route('/api/keywords', methods=['GET'])
def get_keywords():
    return jsonify(SAMPLE_KEYWORDS)

@app.route('/api/keywords', methods=['POST'])
def add_keyword():
    data = request.get_json()
    if not data or 'term' not in data:
        return jsonify({"error": "Missing keyword term"}), 400

    new_keyword = {
        "id": len(SAMPLE_KEYWORDS) + 1,
        "term": data['term'],
        "active": True
    }
    SAMPLE_KEYWORDS.append(new_keyword)
    return jsonify(new_keyword), 201

@app.route('/api/results')
def get_results():
    days = request.args.get('days', default=7, type=int)
    return jsonify(SAMPLE_RESULTS)

@app.route('/api/trends')
def get_trends():
    try:
        # Generate sample trend data
        dates = pd.date_range(end=datetime.now(), periods=7, freq='D')
        data = []

        for keyword in SAMPLE_KEYWORDS:
            for date in dates:
                data.append({
                    'date': date.strftime('%Y-%m-%d'),
                    'keyword': keyword['term'],
                    'mentions': np.random.randint(1, 10)
                })

        df = pd.DataFrame(data)

        # Create trend visualization
        fig = px.line(df, x='date', y='mentions', color='keyword',
                    title='Keyword Mentions Over Time')

        return jsonify({
            'plot': json.loads(fig.to_json())
        })
    except Exception as e:
        logger.error(f"Error generating trends: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Ensure templates directory exists
    os.makedirs('templates', exist_ok=True)

    # Start Flask app
    app.run(host='0.0.0.0', port=5000, debug=True)