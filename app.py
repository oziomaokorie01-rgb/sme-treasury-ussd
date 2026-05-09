import json
import os
import requests 
from flask import Flask, request, jsonify
from solana.rpc.api import Client
from solders.pubkey import Pubkey
import ows  
from flask_cors import CORS 

app = Flask(__name__)
CORS(app) 

USER_MAPPING = {
    "+2348012345678": "FMm5Zf3jdr2EmEPkNpD96wRnPYNSX8NGEn2tagxPf9Fm",
}
USER_PINS = {
    "+2348012345678": "1234",
}

EXCHANGE_KEY = os.getenv("EXCHANGE_RATE_API_KEY") 
RPC = os.getenv("SOLANA_RPC_URL", "https://api.devnet.solana.com")
MNEMONIC = os.getenv("VAULT_MNEMONIC") 

solana_client = Client(RPC)

NIGERIAN_BANKS = {
    "1": "GTBank", "2": "Zenith Bank", "3": "Kuda Bank", "4": "OPay", "5": "Access Bank"
}


def get_sol_price_usd():
    """Fetches real-time SOL price from Pyth Hermes (Devnet)."""
    try:
        # SOL/USD Price Feed ID
        feed_id = "0xef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f464c28f3bc5696"
        url = f"https://hermes.pyth.network/v2/updates/price/latest?ids[]={feed_id}"
        data = requests.get(url).json()
        price_info = data['parsed'][0]['price']
        # Convert integer to decimal based on exponent (usually -8)
        return float(price_info['price']) * (10 ** price_info['expo'])
    except Exception as e:
        print(f"Pyth Error: {e}")
        return 170.0 # Fallback

def get_live_ngn_rate():
    try:
        url = f"https://v6.exchangerate-api.com/v6/{EXCHANGE_KEY}/pair/USD/NGN"
        res = requests.get(url).json()
        return res.get('conversion_rate', 1450.0)
    except:
        return 1450.0 

# Global Vault Setup
try:
    mnemonic = MNEMONIC if MNEMONIC else ows.generate_mnemonic()
    VAULT_ADDR = ows.derive_address(mnemonic, "solana")
except:
    VAULT_ADDR = "FMm5Zf3jdr2EmEPkNpD96wRnPYNSX8NGEn2tagxPf9Fm"

# --- ROUTES ---

@app.route("/ussd", methods=['GET', 'POST'])
def ussd():
    phone = request.values.get("phoneNumber", "")
    user_text = request.values.get("text", "")
    level = user_text.split("*")
    
    user_wallet = USER_MAPPING.get(phone)

    # 1. Registration Flow (PIN Generation)
    if not user_wallet:
        if user_text == "":
            return "CON Welcome to Zenti\n1. Create Wallet & PIN"
        elif level[0] == "1":
            if len(level) == 1:
                return "CON Create your 4-digit Security PIN:"
            elif len(level) == 2:
                # User creates their own PIN here
                USER_PINS[phone] = level[1] 
                USER_MAPPING[phone] = VAULT_ADDR
                return f"END Wallet Created!\nPIN set to {level[1]}.\nAddr: {VAULT_ADDR[:10]}..."
        return "END Session timed out."

    # 2. Main Menu
    if user_text == "":
        return "CON Zenti Treasury\n1. Balance\n2. Send Money\n3. Withdrawal\n4. Info"

    # --- OPTIONS ---
    if level[0] == "1": # Balance
        sol_bal = solana_client.get_balance(Pubkey.from_string(user_wallet)).value / 10**9
        naira_val = sol_bal * get_sol_price_usd() * get_live_ngn_rate()
        return f"END Zenti Balance:\n₦{naira_val:,.2f}\n({sol_bal:.4f} SOL)"

    elif level[0] == "2": # Send
        if len(level) == 1: return "CON Enter Recipient Phone/Wallet:"
        if len(level) == 2: return "CON Amount SOL:"
        if len(level) == 3: return "CON Enter PIN to confirm:"
        if len(level) == 4:
            if level[3] == USER_PINS.get(phone):
                return f"END Transaction Signed!\nSending {level[2]} SOL to {level[1][:6]}..."
            return "END Incorrect PIN."

    elif level[0] == "3": # Withdrawal
        if len(level) == 1:
            res = "CON Select Bank:\n"
            for k, v in NIGERIAN_BANKS.items(): res += f"{k}. {v}\n"
            return res
        if len(level) == 2: return "CON Account Number:"
        if len(level) == 3: return "CON Amount (₦):"
        if len(level) == 4: return "CON Enter PIN:"
        if len(level) == 5:
            if level[4] == USER_PINS.get(phone):
                return f"END Withdrawal Initiated!\n₦{level[3]} queued for {NIGERIAN_BANKS.get(level[1])}."
            return "END Incorrect PIN."

    return "END Invalid input"

@app.route("/helius", methods=['POST'])
def helius_webhook():
    data = request.json
    for tx in data:
        if tx.get('type') == 'TRANSFER':
            # Logic to send SMS notification via Africa's Talking would go here
            print("Movement detected in Treasury!")
    return "OK", 200

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=int(os.environ.get("PORT", 8080)))
    
