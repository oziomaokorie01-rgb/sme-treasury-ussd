import json
import os
import requests 
import jwt      
from flask import Flask, request, jsonify
from groq import Groq
from solana.rpc.api import Client
from solders.pubkey import Pubkey
import ows  
from flask_cors import CORS 

app = Flask(__name__)
CORS(app) 

# Dummy User for the Demo
DEMO_USER = {
    "email": "senseii@example.com",
    "password": "password123",
    # Replace with your actual Devnet test address
    "address": "FMm5Zf3jdr2EmEPkNpD96wRnPYNSX8NGEn2tagxPf9Fm" 
}

# --- CONFIG ---
G_KEY = os.getenv("GROQ_API_KEY")
EXCHANGE_KEY = os.getenv("EXCHANGE_RATE_API_KEY") 
# Use Environment Variable for RPC, default to Devnet
RPC = os.getenv("SOLANA_RPC_URL", "https://api.devnet.solana.com")
MNEMONIC = os.getenv("VAULT_MNEMONIC") 

client = Groq(api_key=G_KEY)
solana_client = Client(RPC)

# --- HELPER: RATES & CONVERSION ---
def get_live_ngn_rate():
    try:
        url = f"https://v6.exchangerate-api.com/v6/{EXCHANGE_KEY}/pair/USD/NGN"
        response = requests.get(url).json()
        return response.get('conversion_rate', 1450.0)
    except:
        return 1450.0 

def get_sol_price_usd():
    # Real-world: Use a CoinGecko/Pyth API. Demo: Fixed price.
    return 170.0 

# --- THE OWS VAULT ---
try:
    mnemonic = MNEMONIC if MNEMONIC else ows.generate_mnemonic()
    # Deriving Solana address
    ADDR = ows.derive_address(mnemonic, "solana")
    print(f"Vault Live! Address: {ADDR}")
except Exception as e:
    ADDR = DEMO_USER["address"]
    print(f"Vault Fallback to Demo Address: {ADDR}")

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
        return "CON Zenti SME Treasury\n1. Check Balance\n2. Pay Supplier"
    
    elif user_text == "1":
        # Balance Calculation
        pubkey = Pubkey.from_string(ADDR)
        raw_balance = solana_client.get_balance(pubkey).value
        sol_bal = raw_balance / 10**9
        
        usd_val = sol_bal * get_sol_price_usd()
        ngn_rate = get_live_ngn_rate()
        naira_bal = usd_val * ngn_rate
        
        return (f"END Zenti Balance:\n"
                f"₦{naira_bal:,.2f}\n"
                f"(${usd_val:,.2f} USDC)\n"
                f"{sol_bal:.4f} SOL")
    
    elif user_text == "2":
        return "CON Enter payment (e.g. '0.5 to address'):"
    
    elif user_text.startswith("2*"):
        raw = user_text.split("*")[-1]
        data = parse_ai(raw)
        return f"END Success!\nSent {data.get('amount_sol')} SOL\nTarget: {data.get('recipient')[:6]}..."

    return "END Invalid input"

@app.route("/ussd-status", methods=['GET'])
def ussd_status():
    ngn_rate = get_live_ngn_rate()
    sol_price = get_sol_price_usd()
    pubkey = Pubkey.from_string(ADDR)
    sol_bal = solana_client.get_balance(pubkey).value / 10**9
    
    usd_total = sol_bal * sol_price
    naira_total = usd_total * ngn_rate
    
    return {
        "address": ADDR,
        "naira_balance": f"₦{naira_total:,.2f}",
        "usd_balance": f"${usd_total:,.2f}",
        "sol_balance": f"{sol_bal:.4f} SOL",
        "rate_ngn": ngn_rate,
        "network": "Solana Devnet"
    }

@app.route("/login", methods=['POST'])
def login():
    data = request.json
    if data.get("email") == DEMO_USER["email"]:
        return {"status": "success", "address": ADDR}
    return {"status": "error"}, 401

if __name__ == "__main__":
    # Railway dynamic port
    port = int(os.environ.get("PORT", 8080))
    app.run(host='0.0.0.0', port=port)
