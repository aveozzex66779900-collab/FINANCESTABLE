from flask import Flask, request, jsonify
app = Flask(__name__)

@app.route('/risk', methods=['POST'])
def risk():
    data = request.json

    risk = 0

    if data.get("newDevice"):
        risk += 30

    if data.get("amount", 0) > 10000:
        risk += 25

    if data.get("hour") < 6:
        risk += 20

    if data.get("typingSpeed", 0) < 2:
        risk += 25

    return jsonify({
        "riskScore": risk,
        "requireOTP": risk > 50
    })

app.run(port=8000)