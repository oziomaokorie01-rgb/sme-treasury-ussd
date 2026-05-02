"use client"

import { createContext, useContext, useState, ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Ear, X, Volume2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface VocalGuideContextType {
  isActive: boolean
  setIsActive: (active: boolean) => void
  showTranscript: (id: string) => void
  hideTranscript: () => void
  activeTranscript: string | null
}

const VocalGuideContext = createContext<VocalGuideContextType | undefined>(undefined)

// Pidgin English transcripts for each feature
export const pidginTranscripts: Record<string, { title: string; text: string }> = {
  "add-funds": {
    title: "Add Funds",
    text: "Oga, dis one na for put money inside your treasury o! You fit use your card or bank transfer. Once you pay, e go show for your balance sharp sharp. No wahala!",
  },
  "deposit-naira": {
    title: "Deposit Naira",
    text: "See, dis na local deposit o! We go give you bank account number wey you go transfer your Naira to. Once money land, we go change am to dollar for your treasury. Na so e easy!",
  },
  "cash-out": {
    title: "Cash Out to Bank",
    text: "You wan collect your money? No problem! Put the amount you wan withdraw, choose your bank, put your account number. We go send the Naira straight to your bank. E fast die!",
  },
  "vault-status": {
    title: "Vault Security",
    text: "Dis one na your money safe o! E dey for Base Sepolia blockchain. Nobody fit touch am unless you give permission. When e show green, your money dey secure. Sleep well!",
  },
  "ussd-activity": {
    title: "USSD Activity",
    text: "Na here you go see all the USSD transactions wey dey happen. Whether money dey come in or go out through phone banking, everything dey show here. You fit track am well well.",
  },
  "suppliers": {
    title: "Active Suppliers",
    text: "Dis na the companies wey you dey do business with. You fit see who you don pay, who still dey wait for payment. Na like your supplier ledger be this one.",
  },
  "overview": {
    title: "Dashboard Overview",
    text: "Welcome to your treasury dashboard o! From here, you fit see everything - your total balance, how much dey move every month, and all the transactions wey dey happen. Na control room be dis!",
  },
  "currency-toggle": {
    title: "Currency Toggle",
    text: "E get two way you fit look your money. 'Market View' go show am for Naira - na wetin you go spend for Nigeria. 'Global View' go show am for USDC - na the dollar value. Switch am dey play!",
  },
  "security-check": {
    title: "Security Check",
    text: "Your phone number na your Master Key o! Na the same number wey dey do your banking. Nobody fit access your treasury without am. Keep your SIM safe like your life!",
  },
}

export function VocalGuideProvider({ children }: { children: ReactNode }) {
  const [isActive, setIsActive] = useState(false)
  const [activeTranscript, setActiveTranscript] = useState<string | null>(null)

  const showTranscript = (id: string) => {
    if (isActive) {
      setActiveTranscript(id)
    }
  }

  const hideTranscript = () => {
    setActiveTranscript(null)
  }

  return (
    <VocalGuideContext.Provider value={{ isActive, setIsActive, showTranscript, hideTranscript, activeTranscript }}>
      {children}
      
      {/* Floating Transcript Modal */}
      <AnimatePresence>
        {activeTranscript && pidginTranscripts[activeTranscript] && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4"
          >
            <div className="relative rounded-2xl bg-card border border-[#0052FF]/30 shadow-2xl shadow-[#0052FF]/10 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-3 border-b border-border bg-gradient-to-r from-[#0052FF]/10 to-purple-600/10">
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#0052FF]/20">
                    <Volume2 className="w-4 h-4 text-[#0052FF]" />
                  </div>
                  <span className="text-sm font-semibold text-foreground">
                    {pidginTranscripts[activeTranscript].title}
                  </span>
                </div>
                <button
                  onClick={hideTranscript}
                  className="p-1.5 rounded-lg hover:bg-secondary transition-colors"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
              
              {/* Content */}
              <div className="p-4">
                <p className="text-sm text-foreground leading-relaxed">
                  {pidginTranscripts[activeTranscript].text}
                </p>
              </div>
              
              {/* Footer */}
              <div className="px-4 py-2 bg-secondary/30 border-t border-border">
                <p className="text-[10px] text-muted-foreground text-center">
                  Vocal Guide - Pidgin English
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </VocalGuideContext.Provider>
  )
}

export function useVocalGuide() {
  const context = useContext(VocalGuideContext)
  if (context === undefined) {
    throw new Error("useVocalGuide must be used within a VocalGuideProvider")
  }
  return context
}

// Ear icon button component for individual features
interface VocalGuideButtonProps {
  featureId: string
  className?: string
}

export function VocalGuideButton({ featureId, className }: VocalGuideButtonProps) {
  const { isActive, showTranscript } = useVocalGuide()

  if (!isActive) return null

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      onClick={() => showTranscript(featureId)}
      className={cn(
        "flex items-center justify-center w-6 h-6 rounded-full bg-[#0052FF]/20 hover:bg-[#0052FF]/30 transition-colors",
        className
      )}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <Ear className="w-3 h-3 text-[#0052FF]" />
    </motion.button>
  )
}

// Toggle button for sidebar
export function VocalGuideToggle() {
  const { isActive, setIsActive } = useVocalGuide()

  return (
    <motion.button
      onClick={() => setIsActive(!isActive)}
      className={cn(
        "flex items-center w-full gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
        isActive
          ? "bg-[#0052FF]/20 text-[#0052FF] border border-[#0052FF]/30"
          : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
      )}
      whileHover={{ x: 2 }}
      whileTap={{ scale: 0.98 }}
    >
      <motion.div
        animate={isActive ? { scale: [1, 1.2, 1] } : {}}
        transition={{ duration: 0.5, repeat: isActive ? Infinity : 0, repeatDelay: 1 }}
      >
        <Ear className={cn("w-4 h-4", isActive && "text-[#0052FF]")} />
      </motion.div>
      <span>Vocal Guide</span>
      {isActive && (
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="ml-auto text-[10px] uppercase tracking-wider bg-[#0052FF]/30 px-1.5 py-0.5 rounded"
        >
          ON
        </motion.span>
      )}
    </motion.button>
  )
}
