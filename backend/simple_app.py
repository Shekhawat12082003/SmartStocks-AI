from flask import Flask, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173", "http://localhost:3000"])

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "message": "Backend is running!"})

@app.route("/test", methods=["GET"])
def test():
    return jsonify({"message": "Test endpoint working!"})

if __name__ == "__main__":
    print("Starting simple test server...")
    app.run(host="0.0.0.0", port=5001, debug=True)
