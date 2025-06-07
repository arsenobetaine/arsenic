from flask import Flask
import threading
import os

app = Flask(__name__)

@app.route('/')
def home():
    return "Arsenic"

def run_flask():
    port = int(os.environ.get("PORT", 3000))
    app.run(host="0.0.0.0", port=port)

def keep_alive():
    thread = threading.Thread(target=run_flask)
    thread.start()
