"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, CreditCard, Wallet, ArrowRight, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AddFundsModalProps {
  isOpen: boolean
  onClose: () => void
}

const PRESET_AMOUNTS = [50, 100, 250, 500]

const PAYMENT_METHODS = [
  { id: "card", name: "Credit/Debit Card", icon: CreditCard, fee: "2.5%" },
  { id: "bank", name: "Bank Transfer", icon: Wallet, fee: "0.5%" },
]

export function AddFundsModal({ isOpen, onClose }: AddFundsModalProps) {
  const [amount, setAmount] = useState("")
  const [selectedMethod, setSelectedMethod] = useState("card")
  const [isProcessing, setIsProcessing] = useState(false)
  const [step, setStep] = useState<"amount" | "confirm">("amount")

  const handleContinue = () => {
    if (step === "amount" && amount) {
      setStep("confirm")
    } else if (step === "confirm") {
      handlePurchase()
    }
  }

  const handlePurchase = async () => {
    setIsProcessing(true)
    
    try {
      // Send to backend
      await fetch("https://sme-treasury-ussd.onrender.com/api/fund", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseFloat(amount),
          method: selectedMethod,
          currency: "USD",
        }),
      })
    } catch (error) {
      console.log("[v0] Fund request error:", error)
    }

    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false)
      onClose()
      setStep("amount")
      setAmount("")
    }, 2000)
  }

  const handleClose = () => {
    onClose()
    setStep("amount")
    setAmount("")
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50 p-4"
          >
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              {/* Header */}
              <div className="relative p-6 pb-4 bg-gradient-to-br from-[#0052FF]/10 to-purple-600/10 border-b border-border">
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 p-2 rounded-lg hover:bg-secondary/50 transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#0052FF] to-purple-600">
                    <Wallet className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Add Funds</h2>
                    <p className="text-sm text-muted-foreground">Fund your treasury vault</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                <AnimatePresence mode="wait">
                  {step === "amount" && (
                    <motion.div
                      key="amount"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="space-y-6"
                    >
                      {/* Amount Input */}
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          Amount (USD)
                        </label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-semibold text-muted-foreground">
                            $
                          </span>
                          <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            className="w-full h-14 pl-10 pr-4 text-2xl font-semibold bg-secondary/50 border border-border rounded-xl focus:outline-none focus:border-[#0052FF]/50 transition-colors text-foreground"
                          />
                        </div>
                      </div>

                      {/* Preset Amounts */}
                      <div className="flex gap-2">
                        {PRESET_AMOUNTS.map((preset) => (
                          <button
                            key={preset}
                            onClick={() => setAmount(preset.toString())}
                            className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-all ${
                              amount === preset.toString()
                                ? "border-[#0052FF] bg-[#0052FF]/10 text-[#0052FF]"
                                : "border-border hover:border-[#0052FF]/50 text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            ${preset}
                          </button>
                        ))}
                      </div>

                      {/* Payment Method */}
                      <div>
                        <label className="text-sm font-medium text-foreground mb-3 block">
                          Payment Method
                        </label>
                        <div className="space-y-2">
                          {PAYMENT_METHODS.map((method) => (
                            <button
                              key={method.id}
                              onClick={() => setSelectedMethod(method.id)}
                              className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                                selectedMethod === method.id
                                  ? "border-[#0052FF] bg-[#0052FF]/5"
                                  : "border-border hover:border-[#0052FF]/50"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <method.icon className="w-5 h-5 text-muted-foreground" />
                                <span className="text-sm font-medium text-foreground">{method.name}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">{method.fee} fee</span>
                                {selectedMethod === method.id && (
                                  <Check className="w-4 h-4 text-[#0052FF]" />
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {step === "confirm" && (
                    <motion.div
                      key="confirm"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      {/* Summary */}
                      <div className="p-4 rounded-xl bg-secondary/30 border border-border space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Amount</span>
                          <span className="text-lg font-semibold text-foreground">${amount}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Fee</span>
                          <span className="text-sm text-foreground">
                            ${(parseFloat(amount || "0") * (selectedMethod === "card" ? 0.025 : 0.005)).toFixed(2)}
                          </span>
                        </div>
                        <div className="pt-3 border-t border-border flex items-center justify-between">
                          <span className="text-sm font-medium text-foreground">Total</span>
                          <span className="text-lg font-bold text-[#0052FF]">
                            ${(parseFloat(amount || "0") * (selectedMethod === "card" ? 1.025 : 1.005)).toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {/* MoonPay branding placeholder */}
                      <div className="text-center py-4">
                        <p className="text-xs text-muted-foreground">Powered by</p>
                        <p className="text-sm font-semibold text-foreground">MoonPay</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div className="p-6 pt-0 flex gap-3">
                {step === "confirm" && (
                  <Button
                    onClick={() => setStep("amount")}
                    variant="outline"
                    className="flex-1 h-12 rounded-xl"
                    disabled={isProcessing}
                  >
                    Back
                  </Button>
                )}
                <Button
                  onClick={handleContinue}
                  disabled={!amount || isProcessing}
                  className="flex-1 h-12 bg-[#0052FF] hover:bg-[#0052FF]/90 text-white font-medium rounded-xl disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : step === "amount" ? (
                    <>
                      Continue
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  ) : (
                    "Confirm Purchase"
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
