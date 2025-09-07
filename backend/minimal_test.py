from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "message": "Minimal backend is running!"})

@app.route("/test", methods=["GET"])
def test():
    return jsonify({"message": "Test endpoint working"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
