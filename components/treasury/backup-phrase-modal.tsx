"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Shield, Copy, Check, AlertTriangle, X, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BackupPhraseModalProps {
  isOpen: boolean
  onClose: () => void
  onBackupComplete: () => void
}

const PLACEHOLDER_PHRASE = [
  "venture", "obscure", "melody", "ancient", "wisdom", "crystal",
  "phantom", "zenith", "epoch", "quantum", "nebula", "cipher"
]

export function BackupPhraseModal({ isOpen, onClose, onBackupComplete }: BackupPhraseModalProps) {
  const [copied, setCopied] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(PLACEHOLDER_PHRASE.join(" "))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleConfirm = () => {
    onBackupComplete()
    onClose()
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
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-50 p-4"
          >
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#0052FF] to-purple-600">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Backup Your Wallet</h2>
                    <p className="text-sm text-muted-foreground">Secure your recovery phrase</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-secondary transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Warning */}
                <div className="flex items-start gap-3 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                  <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-500">Important Security Notice</p>
                    <p className="text-xs text-yellow-500/80 mt-1">
                      Never share your recovery phrase. Anyone with access to it can control your funds.
                    </p>
                  </div>
                </div>

                {/* Recovery Phrase Grid */}
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-foreground">Recovery Phrase</span>
                    <button
                      onClick={() => setRevealed(!revealed)}
                      className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {revealed ? (
                        <>
                          <EyeOff className="w-3.5 h-3.5" />
                          Hide
                        </>
                      ) : (
                        <>
                          <Eye className="w-3.5 h-3.5" />
                          Reveal
                        </>
                      )}
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {PLACEHOLDER_PHRASE.map((word, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/50 border border-border"
                      >
                        <span className="text-xs text-muted-foreground w-4">{index + 1}.</span>
                        <span className={`text-sm font-mono ${revealed ? "text-foreground" : "blur-sm select-none"}`}>
                          {word}
                        </span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Copy Button */}
                  <Button
                    onClick={handleCopy}
                    variant="outline"
                    className="w-full mt-4 h-10 rounded-xl"
                    disabled={!revealed}
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 mr-2 text-green-500" />
                        Copied to Clipboard
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Recovery Phrase
                      </>
                    )}
                  </Button>
                </div>

                {/* Confirmation Checkbox */}
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={confirmed}
                    onChange={(e) => setConfirmed(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-border bg-secondary accent-[#0052FF]"
                  />
                  <span className="text-sm text-muted-foreground">
                    I have saved my recovery phrase in a secure location and understand that losing it means losing access to my funds.
                  </span>
                </label>
              </div>

              {/* Footer */}
              <div className="p-6 pt-0">
                <Button
                  onClick={handleConfirm}
                  disabled={!confirmed || !revealed}
                  className="w-full h-12 bg-[#0052FF] hover:bg-[#0052FF]/90 text-white font-medium rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  I&apos;ve Backed Up My Phrase
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
