from flask import Flask, render_template

# Explicitly register where static and templates live
app = Flask(
    __name__,
    static_folder='static',          # where styles.css and script.js live
    template_folder='templates'      # where index.html lives
)

@app.route('/')
def home():
    return render_template('index.html')

if __name__ == '__main__':
    # Use debug=True locally; Cloud Run ignores it
    app.run(host='0.0.0.0', port=8080, debug=True)
