from flask import Flask, render_template

# Tell Flask where to find templates and static assets
app = Flask(__name__, static_folder='static', template_folder='templates')

@app.route('/')
def home():
    return render_template('index.html')

if __name__ == '__main__':
    # Run on port 8080 for Cloud Run compatibility
    app.run(host='0.0.0.0', port=8080, debug=True)
