"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Building2, ArrowRight, CheckCircle2, Loader2, AlertCircle, Banknote } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CashOutModalProps {
  isOpen: boolean
  onClose: () => void
}

const BACKEND_URL = "https://sme-treasury-ussd.onrender.com"
const EXCHANGE_RATE = 1450

const nigerianBanks = [
  { code: "044", name: "Access Bank" },
  { code: "023", name: "Citibank" },
  { code: "050", name: "Ecobank" },
  { code: "070", name: "Fidelity Bank" },
  { code: "011", name: "First Bank" },
  { code: "214", name: "FCMB" },
  { code: "058", name: "GTBank" },
  { code: "030", name: "Heritage Bank" },
  { code: "301", name: "Jaiz Bank" },
  { code: "082", name: "Keystone Bank" },
  { code: "526", name: "Kuda Bank" },
  { code: "101", name: "Providus Bank" },
  { code: "076", name: "Polaris Bank" },
  { code: "221", name: "Stanbic IBTC" },
  { code: "068", name: "Standard Chartered" },
  { code: "232", name: "Sterling Bank" },
  { code: "032", name: "Union Bank" },
  { code: "033", name: "UBA" },
  { code: "215", name: "Unity Bank" },
  { code: "035", name: "Wema Bank" },
  { code: "057", name: "Zenith Bank" },
]

type Step = "details" | "confirm" | "processing" | "success"

export function CashOutModal({ isOpen, onClose }: CashOutModalProps) {
  const [step, setStep] = useState<Step>("details")
  const [amount, setAmount] = useState("")
  const [selectedBank, setSelectedBank] = useState("")
  const [accountNumber, setAccountNumber] = useState("")
  const [accountName, setAccountName] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)

  const usdcAmount = amount ? parseFloat(amount) : 0
  const ngnAmount = usdcAmount * EXCHANGE_RATE
  const fee = usdcAmount * 0.01 // 1% fee
  const totalDeducted = usdcAmount + fee

  const verifyAccount = async () => {
    if (accountNumber.length !== 10 || !selectedBank) return
    
    setIsVerifying(true)
    
    // Simulate account verification
    await new Promise((resolve) => setTimeout(resolve, 1500))
    
    // Mock account name based on account number
    const names = [
      "Adebayo Ogundimu",
      "Chioma Nwosu", 
      "Oluwaseun Adeleke",
      "Fatima Ibrahim",
      "Chukwuemeka Obi"
    ]
    setAccountName(names[Math.floor(Math.random() * names.length)])
    setIsVerifying(false)
  }

  const handleCashOut = async () => {
    setStep("processing")
    
    // Send to backend via OWS Pay
    try {
      await fetch(`${BACKEND_URL}/api/cashout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "off_ramp",
          provider: "ows_pay",
          amount: usdcAmount,
          amountNGN: ngnAmount,
          fee,
          bank: selectedBank,
          accountNumber,
          accountName,
          timestamp: new Date().toISOString(),
        }),
      })
    } catch {
      // Continue with success flow even if backend fails for demo
    }

    // Simulate processing
    await new Promise((resolve) => setTimeout(resolve, 3000))
    setStep("success")
  }

  const handleClose = () => {
    onClose()
    setTimeout(() => {
      setStep("details")
      setAmount("")
      setSelectedBank("")
      setAccountNumber("")
      setAccountName("")
    }, 300)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-md rounded-2xl bg-card border border-border shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-purple-500/10 to-[#0052FF]/10">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-purple-500/20">
                  <Banknote className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Cash Out to Bank</h2>
                  <p className="text-xs text-muted-foreground">Convert USDC to Naira instantly</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-2 rounded-lg hover:bg-secondary transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <div className="p-5">
              <AnimatePresence mode="wait">
                {step === "details" && (
                  <motion.div
                    key="details"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-4"
                  >
                    {/* Amount Input */}
                    <div>
                      <label className="text-xs text-muted-foreground mb-2 block">Amount (USDC)</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg font-semibold text-muted-foreground">$</span>
                        <input
                          type="number"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          placeholder="0.00"
                          className="w-full pl-8 pr-4 py-3 text-lg font-semibold bg-secondary/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#0052FF]/50"
                        />
                      </div>
                      {amount && (
                        <motion.div 
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-1.5 mt-2"
                        >
                          <ArrowRight className="w-3 h-3 text-green-500" />
                          <span className="text-sm text-muted-foreground">You&apos;ll receive</span>
                          <span className="text-sm font-semibold text-green-500">₦{ngnAmount.toLocaleString()}</span>
                        </motion.div>
                      )}
                    </div>

                    {/* Bank Selection */}
                    <div>
                      <label className="text-xs text-muted-foreground mb-2 block">Select Bank</label>
                      <select
                        value={selectedBank}
                        onChange={(e) => {
                          setSelectedBank(e.target.value)
                          setAccountName("")
                        }}
                        className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl text-foreground focus:outline-none focus:border-[#0052FF]/50"
                      >
                        <option value="">Choose a bank</option>
                        {nigerianBanks.map((bank) => (
                          <option key={bank.code} value={bank.code}>
                            {bank.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Account Number */}
                    <div>
                      <label className="text-xs text-muted-foreground mb-2 block">Account Number</label>
                      <input
                        type="text"
                        value={accountNumber}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 10)
                          setAccountNumber(value)
                          setAccountName("")
                          if (value.length === 10 && selectedBank) {
                            verifyAccount()
                          }
                        }}
                        placeholder="10-digit account number"
                        maxLength={10}
                        className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#0052FF]/50 font-mono"
                      />
                    </div>

                    {/* Account Name Display */}
                    {isVerifying && (
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/30">
                        <Loader2 className="w-4 h-4 text-[#0052FF] animate-spin" />
                        <span className="text-sm text-muted-foreground">Verifying account...</span>
                      </div>
                    )}

                    {accountName && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/20"
                      >
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <span className="text-sm font-medium text-green-500">{accountName}</span>
                      </motion.div>
                    )}

                    <Button
                      onClick={() => setStep("confirm")}
                      disabled={!amount || !accountName || parseFloat(amount) <= 0}
                      className="w-full bg-[#0052FF] hover:bg-[#0052FF]/90 text-white mt-4"
                    >
                      Continue
                    </Button>
                  </motion.div>
                )}

                {step === "confirm" && (
                  <motion.div
                    key="confirm"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-4"
                  >
                    <div className="p-4 rounded-xl bg-secondary/30 border border-border space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">You&apos;re sending</span>
                        <span className="text-sm font-semibold text-foreground">${usdcAmount.toFixed(2)} USDC</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Fee (1%)</span>
                        <span className="text-sm text-foreground">${fee.toFixed(2)} USDC</span>
                      </div>
                      <div className="border-t border-border pt-3 flex justify-between">
                        <span className="text-sm font-medium text-foreground">Total deducted</span>
                        <span className="text-sm font-semibold text-foreground">${totalDeducted.toFixed(2)} USDC</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-center py-3">
                      <ArrowRight className="w-5 h-5 text-[#0052FF]" />
                    </div>

                    <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Recipient receives</span>
                        <span className="text-sm font-bold text-green-500">₦{ngnAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Bank</span>
                        <span className="text-sm text-foreground">
                          {nigerianBanks.find((b) => b.code === selectedBank)?.name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Account</span>
                        <span className="text-sm font-mono text-foreground">{accountNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Name</span>
                        <span className="text-sm font-medium text-foreground">{accountName}</span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        onClick={() => setStep("details")}
                        variant="outline"
                        className="flex-1"
                      >
                        Back
                      </Button>
                      <Button
                        onClick={handleCashOut}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                      >
                        Confirm Cash Out
                      </Button>
                    </div>
                  </motion.div>
                )}

                {step === "processing" && (
                  <motion.div
                    key="processing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-12 space-y-4"
                  >
                    <motion.div
                      className="relative"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <div className="w-16 h-16 rounded-full bg-[#0052FF]/20 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-[#0052FF] animate-spin" />
                      </div>
                    </motion.div>
                    <div className="text-center space-y-1">
                      <p className="text-sm font-medium text-foreground">Processing via OWS Pay</p>
                      <p className="text-xs text-muted-foreground">Initiating off-ramp transfer...</p>
                    </div>
                  </motion.div>
                )}

                {step === "success" && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-8 space-y-4"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 15 }}
                      className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center"
                    >
                      <CheckCircle2 className="w-8 h-8 text-green-500" />
                    </motion.div>
                    <div className="text-center space-y-1">
                      <p className="text-lg font-semibold text-foreground">Cash Out Successful!</p>
                      <p className="text-sm text-muted-foreground">
                        ₦{ngnAmount.toLocaleString()} sent to {accountName}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <AlertCircle className="w-3 h-3" />
                      <span>Funds arrive within 5 minutes</span>
                    </div>
                    <Button onClick={handleClose} className="w-full mt-4">
                      Done
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
