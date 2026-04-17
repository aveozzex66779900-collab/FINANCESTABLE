from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    return jsonify({
        "status": "success",
        "received": data
    })

if __name__ == "__main__":
    app.run(port=8000, debug=True)
