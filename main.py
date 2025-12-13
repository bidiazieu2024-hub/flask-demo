from flask import Flask, render_template, jsonify, request

# Initialize Flask app
app = Flask(__name__)

# ----------------------------
# ROUTES
# ----------------------------

@app.route('/')
def home():
    """Render the main Predikto dashboard."""
    return render_template('index.html')


@app.route('/api/forecasts')
def get_forecasts():
    """Example API endpoint for forecasts (placeholder data)."""
    forecasts = [
        {"title": "Will AI reach AGI by 2027?", "category": "Technology", "yes": 34, "no": 66},
        {"title": "Bitcoin above $100K by end of 2025?", "category": "Crypto", "yes": 72, "no": 28},
        {"title": "Global climate agreement in 2025?", "category": "Politics", "yes": 58, "no": 42},
    ]
    return jsonify(forecasts)


@app.route('/about')
def about():
    """Optional about page."""
    return "<h1>About Predikto</h1><p>Predikto is a crowdsourced forecasting app built with Flask.</p>"


# ----------------------------
# ENTRY POINT
# ----------------------------
if __name__ == '__main__':
    # Run locally; in production, Gunicorn (via Dockerfile) will handle this
    app.run(host='0.0.0.0', port=8080, debug=True)
