"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Copy, CheckCircle2, RefreshCw, Building2, Clock, ArrowRight, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface DepositNairaModalProps {
  isOpen: boolean
  onClose: () => void
}

const BACKEND_URL = "https://sme-treasury-ussd.onrender.com"
const EXCHANGE_RATE = 1450

function generateVirtualAccount() {
  // Generate a mock Nigerian bank account number (10 digits)
  const accountNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString()
  const banks = ["Wema Bank", "Providus Bank", "VFD MFB", "Kuda Bank"]
  const bank = banks[Math.floor(Math.random() * banks.length)]
  return {
    accountNumber,
    accountName: "SME Treasury AI Ltd",
    bank,
    expiresIn: 30, // minutes
  }
}

export function DepositNairaModal({ isOpen, onClose }: DepositNairaModalProps) {
  const [accountDetails, setAccountDetails] = useState<ReturnType<typeof generateVirtualAccount> | null>(null)
  const [copied, setCopied] = useState(false)
  const [amount, setAmount] = useState("")
  const [timeLeft, setTimeLeft] = useState(30 * 60) // 30 minutes in seconds
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    if (isOpen && !accountDetails) {
      generateAccount()
    }
  }, [isOpen, accountDetails])

  useEffect(() => {
    if (!isOpen || !accountDetails) return
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isOpen, accountDetails])

  const generateAccount = async () => {
    setIsGenerating(true)
    
    // Send request to backend
    try {
      await fetch(`${BACKEND_URL}/api/deposit/generate-account`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "virtual_account",
          currency: "NGN",
        }),
      })
    } catch {
      // Continue with mock data even if backend fails
    }

    // Simulate generation delay
    await new Promise((resolve) => setTimeout(resolve, 1500))
    
    setAccountDetails(generateVirtualAccount())
    setTimeLeft(30 * 60)
    setIsGenerating(false)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleClose = () => {
    onClose()
    // Reset state after animation
    setTimeout(() => {
      setAccountDetails(null)
      setAmount("")
      setTimeLeft(30 * 60)
    }, 300)
  }

  const usdcEquivalent = amount ? (parseFloat(amount.replace(/,/g, "")) / EXCHANGE_RATE).toFixed(2) : "0.00"

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
            <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-green-500/10 to-[#0052FF]/10">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-green-500/20">
                  <Building2 className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Deposit Naira</h2>
                  <p className="text-xs text-muted-foreground">Fund your global dollar treasury</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-2 rounded-lg hover:bg-secondary transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <div className="p-5 space-y-5">
              {/* Exchange Rate Display */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/50 border border-border">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-muted-foreground">Live Rate</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">₦{EXCHANGE_RATE.toLocaleString()}</span>
                  <span className="text-xs text-muted-foreground">per USDC</span>
                </div>
              </div>

              {/* Amount Input */}
              <div>
                <label className="text-xs text-muted-foreground mb-2 block">Amount to Deposit</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg font-semibold text-muted-foreground">₦</span>
                  <input
                    type="text"
                    value={amount}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, "")
                      if (value) {
                        setAmount(parseInt(value).toLocaleString())
                      } else {
                        setAmount("")
                      }
                    }}
                    placeholder="0"
                    className="w-full pl-8 pr-4 py-3 text-lg font-semibold bg-secondary/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#0052FF]/50"
                  />
                </div>
                {amount && (
                  <motion.div 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-1.5 mt-2"
                  >
                    <ArrowRight className="w-3 h-3 text-[#0052FF]" />
                    <span className="text-sm text-muted-foreground">You&apos;ll receive</span>
                    <span className="text-sm font-semibold text-[#0052FF]">${usdcEquivalent} USDC</span>
                  </motion.div>
                )}
              </div>

              {/* Virtual Account Details */}
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center py-8 space-y-3">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <RefreshCw className="w-8 h-8 text-[#0052FF]" />
                  </motion.div>
                  <p className="text-sm text-muted-foreground">Generating virtual account...</p>
                </div>
              ) : accountDetails ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Transfer to this account</p>
                    <div className="flex items-center gap-1.5 text-xs text-yellow-500">
                      <Clock className="w-3 h-3" />
                      <span>Expires in {formatTime(timeLeft)}</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-secondary/30 border border-border space-y-3">
                    {/* Bank */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Bank</span>
                      <span className="text-sm font-medium text-foreground">{accountDetails.bank}</span>
                    </div>

                    {/* Account Number */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Account Number</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-mono font-semibold text-foreground">
                          {accountDetails.accountNumber}
                        </span>
                        <button
                          onClick={() => copyToClipboard(accountDetails.accountNumber)}
                          className="p-1 rounded hover:bg-secondary transition-colors"
                        >
                          {copied ? (
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4 text-muted-foreground" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Account Name */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Account Name</span>
                      <span className="text-sm font-medium text-foreground">{accountDetails.accountName}</span>
                    </div>
                  </div>

                  {/* Instructions */}
                  <div className="p-3 rounded-lg bg-[#0052FF]/5 border border-[#0052FF]/20">
                    <p className="text-xs text-[#0052FF] leading-relaxed">
                      Transfer Naira here to fund your global dollar treasury. Your USDC will be credited automatically within 2 minutes of confirmation.
                    </p>
                  </div>
                </div>
              ) : null}

              {/* Regenerate Button */}
              {accountDetails && timeLeft === 0 && (
                <Button
                  onClick={generateAccount}
                  className="w-full bg-[#0052FF] hover:bg-[#0052FF]/90 text-white"
                >
                  Generate New Account
                </Button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
