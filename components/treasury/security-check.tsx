"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Smartphone, Shield, CheckCircle2, Lock, Fingerprint, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { VocalGuideButton } from "./vocal-guide"

interface SecurityCheckProps {
  phoneNumber?: string
  onComplete?: () => void
}

export function SecurityCheck({ phoneNumber = "+234 812 345 6789", onComplete }: SecurityCheckProps) {
  const [isVerified, setIsVerified] = useState(false)
  const [showOTP, setShowOTP] = useState(false)
  const [otp, setOtp] = useState(["", "", "", "", "", ""])

  const maskedPhone = phoneNumber.replace(/(\+234 \d{3}) \d{3} (\d{4})/, "$1 *** $2")

  const handleOTPChange = (index: number, value: string) => {
    if (value.length > 1) return
    
    const newOTP = [...otp]
    newOTP[index] = value
    setOtp(newOTP)

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      nextInput?.focus()
    }

    // Auto-verify when all digits entered
    if (newOTP.every((d) => d) && newOTP.join("").length === 6) {
      setTimeout(() => {
        setIsVerified(true)
        onComplete?.()
      }, 1000)
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`)
      prevInput?.focus()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative max-w-lg mx-auto"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <motion.div
            className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0052FF] to-purple-600"
            animate={isVerified ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.5 }}
          >
            {isVerified ? (
              <CheckCircle2 className="w-8 h-8 text-white" />
            ) : (
              <Shield className="w-8 h-8 text-white" />
            )}
          </motion.div>
          <VocalGuideButton featureId="security-check" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Security Check</h2>
        <p className="text-sm text-muted-foreground">
          Your phone number is your Master Key to this treasury
        </p>
      </div>

      {/* Master Key Card */}
      <motion.div
        className={cn(
          "relative overflow-hidden rounded-2xl border p-6 mb-6 transition-colors",
          isVerified
            ? "border-green-500/50 bg-green-500/5"
            : "border-border bg-card"
        )}
        animate={isVerified ? {
          boxShadow: [
            "0 0 0 0 rgba(34, 197, 94, 0)",
            "0 0 30px 8px rgba(34, 197, 94, 0.3)",
            "0 0 0 0 rgba(34, 197, 94, 0)"
          ]
        } : {}}
        transition={{ duration: 1.5, repeat: isVerified ? 2 : 0 }}
      >
        {/* Background decoration */}
        <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br from-[#0052FF]/10 to-purple-600/10 blur-2xl" />

        <div className="relative space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#0052FF]/10">
              <Smartphone className="w-6 h-6 text-[#0052FF]" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Master Key</p>
              <p className="text-xl font-bold font-mono text-foreground">{maskedPhone}</p>
            </div>
          </div>

          {/* Security Indicators */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border">
            <div className="flex flex-col items-center gap-1.5 p-3 rounded-lg bg-secondary/30">
              <Lock className="w-4 h-4 text-green-500" />
              <span className="text-[10px] text-muted-foreground text-center">SIM-Linked</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 p-3 rounded-lg bg-secondary/30">
              <Fingerprint className="w-4 h-4 text-[#0052FF]" />
              <span className="text-[10px] text-muted-foreground text-center">Biometric</span>
            </div>
            <div className={cn(
              "flex flex-col items-center gap-1.5 p-3 rounded-lg",
              isVerified ? "bg-green-500/10" : "bg-secondary/30"
            )}>
              <CheckCircle2 className={cn(
                "w-4 h-4",
                isVerified ? "text-green-500" : "text-muted-foreground"
              )} />
              <span className={cn(
                "text-[10px] text-center",
                isVerified ? "text-green-500" : "text-muted-foreground"
              )}>
                {isVerified ? "Verified" : "Pending"}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Trust Explanation */}
      <div className="p-4 rounded-xl bg-[#0052FF]/5 border border-[#0052FF]/20 mb-6">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <Shield className="w-5 h-5 text-[#0052FF]" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground mb-1">
              Why your phone is your bank
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Just like mobile banking in Nigeria, your SIM card acts as your unique identifier. 
              No one can access your treasury without your phone number. Keep your SIM safe - it&apos;s your digital vault key.
            </p>
          </div>
        </div>
      </div>

      {/* OTP Verification Section */}
      {!isVerified && (
        <div className="space-y-4">
          {!showOTP ? (
            <Button
              onClick={() => setShowOTP(true)}
              className="w-full bg-[#0052FF] hover:bg-[#0052FF]/90 text-white"
            >
              Verify My Number
            </Button>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <p className="text-center text-sm text-muted-foreground">
                Enter the 6-digit code sent to {maskedPhone}
              </p>
              
              <div className="flex justify-center gap-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOTPChange(index, e.target.value.replace(/[^0-9]/g, ""))}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-14 text-center text-xl font-bold bg-secondary/50 border border-border rounded-xl text-foreground focus:outline-none focus:border-[#0052FF] transition-colors"
                  />
                ))}
              </div>

              <p className="text-center text-xs text-muted-foreground">
                Demo: Enter any 6 digits to verify
              </p>
            </motion.div>
          )}
        </div>
      )}

      {/* Verified State */}
      {isVerified && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-center"
        >
          <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <p className="text-sm font-semibold text-green-500">Identity Verified</p>
          <p className="text-xs text-green-500/80 mt-1">Your treasury is now fully secured</p>
        </motion.div>
      )}

      {/* Warning */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20"
      >
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-yellow-500 flex-shrink-0" />
          <p className="text-xs text-yellow-500">
            Never share your OTP or SIM card with anyone. We will never call to ask for these.
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}
