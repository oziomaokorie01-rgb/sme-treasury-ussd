#  SME Treasury AI
**Agentic Finance for the Unbanked via USSD & Base**

###  The Problem
Nigerian SMEs face high barriers to Web3: expensive data, complex seed phrases, and lack of professional treasury tools.

### 💡 The Solution
An **AI Agent Coordinator** that allows SMEs to manage business funds via **USSD** (no internet required). 
- **AI-Powered**: Uses Groq to parse natural language USSD commands.
- **OWS Secured**: Manages vaults via the Open Wallet Standard, removing the need for users to manage private keys.
- **Base Network**: Built on Base Sepolia for near-instant, low-fee business payments.

### 🛠 Tech Stack
- **Backend**: Flask (Python) in GitHub Codespaces
- **Blockchain**: Base Sepolia + OWS
- **Frontend**: Lovable (React)
- **Mobile**: Africa's Talking USSD Gateway
- **Storage**: In-memory (Mock DB) for rapid hackathon deployment

### How to Use
1. Dial `*384*57157#` on a mobile device (Nigeria sandbox).
2. Choose '1' to check your OWS Vault balance.
3. Choose '2' to authorize a supplier payment.
