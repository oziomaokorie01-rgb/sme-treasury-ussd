import json
import os
import requests 
import jwt      
from flask import Flask, request, jsonify
from groq import Groq
# NEW: Solana imports (Requires: pip install solana solders)
from solana.rpc.api import Client
from solders.pubkey import Pubkey
import ows  
from flask_cors import CORS 

app = Flask(__name__)
CORS(app) 

# Dummy User for the Demo (Updated with a Solana Address)
DEMO_USER = {
    "email": "senseii@example.com",
    "password": "password123",
    "address": "6x9Gv7P...YourSolanaAddress..." 
}

# --- CONFIG ---
G_KEY = os.getenv("GROQ_API_KEY")
EXCHANGE_KEY = os.getenv("EXCHANGE_RATE_API_KEY") 
# Solana RPC (Devnet for testing, change to mainnet-beta for production)
RPC = "https://api.devnet.solana.com"
MNEMONIC = None 

client = Groq(api_key=G_KEY)
# Initialize Solana Client
solana_client = Client(RPC)

# --- HELPER: NAIRA RATE ---
def get_live_ngn_rate():
    try:
        url = f"https://v6.exchangerate-api.com/v6/{EXCHANGE_KEY}/pair/USD/NGN"
        response = requests.get(url).json()
        return response.get('conversion_rate', 1450.0)
    except:
        return 1450.0 

# --- THE OWS VAULT ---
try:
    if MNEMONIC:
        mnemonic = MNEMONIC
    else:
        mnemonic = ows.generate_mnemonic()
    
    # Note: ows must support Solana derivation for ADDR to be a valid Sol address
    ADDR = ows.derive_address(mnemonic, "solana:mainnet")
    print(f"Vault Loaded! Address: {ADDR}")
    
except Exception as e:
    ADDR = DEMO_USER["address"]
    mnemonic = None
    print(f"Vault Error: {e}. Using fallback address.")

def parse_ai(text):
    prompt = f"Parse: '{text}'. Return ONLY JSON: {{\"amount_sol\": float, \"recipient\": \"6x...\"}}"
    chat = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"}
    )
    return json.loads(chat.choices.message.content)

# --- ROUTES ---

@app.route("/ussd", methods=['GET', 'POST'])
def ussd():
    user_text = request.values.get("text", "")
    if user_text == "":
        return "CON SME Treasury (OWS Powered)\n1. Check Balance\n2. Pay Supplier"
    elif user_text == "1":
        # Fetch Solana Balance
        pubkey = Pubkey.from_string(ADDR)
        response = solana_client.get_balance(pubkey)
        sol_bal = response.value / 10**9 # Convert Lamports to SOL
        
        rate = get_live_ngn_rate()
        # Using a placeholder SOL price (~$150) for Naira conversion
        naira_bal = float(sol_bal) * 150 * rate 
        return f"END Balance: ₦{naira_bal:,.2f}\n({sol_bal:.4f} SOL)"
    
    elif user_text == "2":
        return "CON Enter payment (e.g. '0.1 to recipient_address'):"
    
    elif user_text.startswith("2*"):
        raw = user_text.split("*")[-1]
        data = parse_ai(raw)
        try:
            # Placeholder for actual Solana transaction logic
            tx_hash = "SolanaTxHashExample111111111" 
            return f"END Success!\nSent {data.get('amount_sol')} SOL\nTX: {tx_hash[:10]}..."
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
    rate = get_live_ngn_rate()
    pubkey = Pubkey.from_string(ADDR)
    sol_bal = solana_client.get_balance(pubkey).value / 10**9
    naira_total = float(sol_bal) * 150 * rate
    return {
        "address": ADDR,
        "naira_balance": f"₦{naira_total:,.2f}",
        "crypto_balance": f"{sol_bal:.4f} SOL",
        "rate": rate,
        "status": "OWS Secured (Solana)"
    }

@app.route("/verify-user", methods=['POST'])
def verify_privy_user():
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    try:
        payload = jwt.decode(token, options={"verify_signature": False})
        return {"status": "authorized", "user_id": payload.get("sub")}
    except:
        return {"error": "Unauthorized"}, 401

@app.route("/withdraw", methods=['POST'])
def handle_withdrawal():
    data = request.json
    return {
        "status": "Success",
        "message": f"₦{data.get('amount')} is being sent to {data.get('bank')}",
        "account": data.get("account_number")
    }

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8080)
    
