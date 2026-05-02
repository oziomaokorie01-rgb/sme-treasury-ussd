"use client"

import { motion } from "framer-motion"
import { useCurrency } from "./currency-context"
import { cn } from "@/lib/utils"
import { Globe, TrendingUp } from "lucide-react"

export function CurrencyToggle() {
  const { view, setView, exchangeRate } = useCurrency()

  return (
    <div className="flex items-center gap-3">
      {/* Live Exchange Rate */}
      <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-secondary/50 border border-border">
        <TrendingUp className="w-3 h-3 text-green-500" />
        <span className="text-[11px] font-medium text-muted-foreground">
          ₦{exchangeRate.toLocaleString()}/USDC
        </span>
      </div>

      {/* Toggle */}
      <div className="relative flex items-center p-1 rounded-lg bg-secondary/50 border border-border">
        <motion.div
          className="absolute top-1 bottom-1 rounded-md bg-[#0052FF]"
          initial={false}
          animate={{
            left: view === "ngn" ? 4 : "50%",
            width: "calc(50% - 4px)",
          }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
        
        <button
          onClick={() => setView("ngn")}
          className={cn(
            "relative z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
            view === "ngn" ? "text-white" : "text-muted-foreground hover:text-foreground"
          )}
        >
          <span className="text-sm">₦</span>
          <span className="hidden sm:inline">Market View</span>
        </button>
        
        <button
          onClick={() => setView("usdc")}
          className={cn(
            "relative z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
            view === "usdc" ? "text-white" : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Globe className="w-3 h-3" />
          <span className="hidden sm:inline">Global View</span>
        </button>
      </div>
    </div>
  )
}
