from flask import Flask, request

app = Flask(__name__)

@app.route("/ussd", methods=['POST'])
def ussd_callback():
    # Africa's Talking sends data as form parameters
    session_id = request.values.get("sessionId", "")
    service_code = request.values.get("serviceCode", "")
    phone_number = request.values.get("phoneNumber", "")
    text = request.values.get("text", "")

    if text == "":
        # Initial menu
        response = "CON Welcome to SME Treasury\n"
        response += "1. Check Balance\n"
        response += "2. Pay Supplier"
    elif text == "1":
        # Logic for balance
        response = "END Your balance is 50,000 NGN"
    elif text == "2":
        # Logic for payment
        response = "CON Enter amount and recipient wallet:"
    else:
        response = "END Invalid choice. Try again."

    return response

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8080)
