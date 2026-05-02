"use client"

import { motion } from "framer-motion"
import { Shield, Copy, ExternalLink, CheckCircle2 } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { useCurrency } from "./currency-context"
import { VocalGuideButton } from "./vocal-guide"

interface VaultStatusCardProps {
  isSecure: boolean
}

export function VaultStatusCard({ isSecure }: VaultStatusCardProps) {
  const [copied, setCopied] = useState(false)
  const { view, exchangeRate } = useCurrency()
  const vaultAddress = "0x7f3a8b2c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a"
  const truncatedAddress = `${vaultAddress.slice(0, 6)}...${vaultAddress.slice(-4)}`
  
  // Balance in ETH equivalent to NGN
  const balanceETH = 12.458
  const balanceUSD = 24916.00
  const balanceNGN = balanceUSD * exchangeRate // Convert USD to NGN

  const copyAddress = () => {
    navigator.clipboard.writeText(vaultAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="relative overflow-hidden rounded-xl border border-border bg-card p-4"
    >
      {/* Background Gradient */}
      <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-gradient-to-br from-[#0052FF]/10 to-purple-600/10 blur-3xl gradient-glow" />

      {/* Header */}
      <div className="relative flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#0052FF]/10">
            <Shield className="w-4 h-4 text-[#0052FF]" />
          </div>
          <h3 className="font-semibold text-foreground">Vault Status</h3>
          <VocalGuideButton featureId="vault-status" />
        </div>
        <motion.div
          className={cn(
            "flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium",
            isSecure
              ? "bg-green-500/10 text-green-500 border border-green-500/20"
              : "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"
          )}
          animate={
            isSecure
              ? {
                  boxShadow: [
                    "0 0 0 0 rgba(34, 197, 94, 0)",
                    "0 0 15px 3px rgba(34, 197, 94, 0.3)",
                    "0 0 0 0 rgba(34, 197, 94, 0)",
                  ],
                }
              : {}
          }
          transition={{ duration: 1.5, repeat: isSecure ? 2 : 0 }}
        >
          {isSecure && <CheckCircle2 className="w-3 h-3" />}
          {isSecure ? "Secured" : "Pending"}
        </motion.div>
      </div>

      {/* Network Badge */}
      <div className="relative mb-3">
        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-[#0052FF]/10 text-[#0052FF] text-xs font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0052FF]" />
          Base Sepolia
        </span>
      </div>

      {/* Address */}
      <div className="relative">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">
          Vault Address
        </p>
        <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border">
          <code className="text-sm font-mono text-foreground">
            {truncatedAddress}
          </code>
          <div className="flex items-center gap-1">
            <motion.button
              onClick={copyAddress}
              className="p-1.5 rounded-md hover:bg-secondary transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {copied ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-muted-foreground" />
              )}
            </motion.button>
            <motion.a
              href={`https://sepolia.basescan.org/address/${vaultAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-md hover:bg-secondary transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
            </motion.a>
          </div>
        </div>
      </div>

      {/* Balance */}
      <div className="relative mt-4 pt-4 border-t border-border">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
          Available Balance
        </p>
        <motion.div
          key={view}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {view === "ngn" ? (
            <>
              <p className="text-2xl font-bold text-foreground">
                ₦{balanceNGN.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                ≈ {balanceETH} ETH / ${balanceUSD.toLocaleString()} USDC
              </p>
            </>
          ) : (
            <>
              <p className="text-2xl font-bold text-foreground">
                ${balanceUSD.toLocaleString()}{" "}
                <span className="text-sm font-normal text-muted-foreground">USDC</span>
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                ≈ {balanceETH} ETH / ₦{balanceNGN.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
            </>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}
