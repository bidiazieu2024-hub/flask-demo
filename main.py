from flask import Flask, render_template

# Explicitly tell Flask where templates and static files are
app = Flask(__name__, static_folder='static', template_folder='templates')

@app.route('/')
def home():
    return render_template('index.html')

if __name__ == '__main__':
    # Flask runs on port 8080 in Cloud Run
    app.run(host='0.0.0.0', port=8080, debug=True)
