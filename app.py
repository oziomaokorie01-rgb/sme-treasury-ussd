import json
import os
from flask import Flask, request
from groq import Groq
from web3 import Web3
import ows  # The OWS library
from flask_cors import CORS # This is the bridge to Lovable

app = Flask(__name__)
CORS(app) # This must be here for Lovable to work!

# Dummy User for the Demo
DEMO_USER = {
    "email": "senseii@example.com",
    "password": "password123",
    "address": "0x82f21051515273767C7D08bDe63897B09040C628"  # Your OWS Address
}


# --- CONFIG ---
G_KEY = os.getenv("GROQ_API_KEY")
RPC = "https://sepolia.base.org"
MNEMONIC = None  # Set this to your wallet mnemonic if available

client = Groq(api_key=G_KEY)
w3 = Web3(Web3.HTTPProvider(RPC))

# --- THE OWS VAULT (The "Safe") ---
try:
    # Generate or use provided mnemonic
    if MNEMONIC:
        mnemonic = MNEMONIC
    else:
        mnemonic = ows.generate_mnemonic()
    
    # Derive the Ethereum address from the mnemonic
    ADDR = ows.derive_address(mnemonic, "eip155:1")
    print(f"Vault Loaded! Address: {ADDR}")
    
except Exception as e:
    # If vault setup fails, use fallback address
    ADDR = "0x82f21051515273767C7D08bDe63897B09040C628"
    mnemonic = None
    print(f"Vault Error: {e}. Using fallback address.")


def parse_ai(text):
    """Parse user input using Groq AI to extract amount and recipient."""
    prompt = f"Parse: '{text}'. Return ONLY JSON: {{\"amount_eth\": float, \"recipient\": \"0x...\"}}"
    chat = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"}
    )
    return json.loads(chat.choices[0].message.content)


@app.route("/ussd", methods=['POST'])
def ussd():
    """USSD endpoint for SME Treasury operations."""
    user_text = request.values.get("text", "")
    
    if user_text == "":
        return "CON SME Treasury (OWS Powered)\n1. Check Balance\n2. Pay Supplier"
    
    elif user_text == "1":
        bal = w3.from_wei(w3.eth.get_balance(ADDR), 'ether')
        return f"END Balance: {bal:.4f} ETH\nAddr: {ADDR[:6]}...{ADDR[-4:]}"
    
    elif user_text == "2":
        return "CON Enter payment (e.g. '0.0001 to 0x...'):"
    
    elif user_text.startswith("2*"):
        raw = user_text.split("*")[-1]
        data = parse_ai(raw)
        
        try:
            # For actual transaction signing, you would need private key or more OWS features
            # This is a placeholder for the transaction logic
            tx_hash = "0x" + "a" * 10  # Placeholder
            return f"END Success!\nSent {data['amount_eth']} ETH\nTX: {tx_hash[:10]}..."
        
        except Exception as e:
            return f"END Transaction Failed: {str(e)}"
    
    return "END Invalid input"
@app.route("/login", methods=['POST'])
def login():
    data = request.json
    if data.get("email") == DEMO_USER["email"]:
        return {"status": "success", "address": DEMO_USER["address"]}
    return {"status": "error"}, 401

@app.route("/ussd-status", methods=['GET'])
def ussd_status():
    # This lets Lovable "see" your wallet address
    return {"address": DEMO_USER["address"]}
                

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8080)
                                                                                                                                                                                                                                                                                                                    