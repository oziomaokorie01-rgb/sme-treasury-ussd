"use client"

import { createContext, useContext, useState, ReactNode } from "react"

export type CurrencyView = "ngn" | "usdc"

interface CurrencyContextType {
  view: CurrencyView
  setView: (view: CurrencyView) => void
  exchangeRate: number
  formatCurrency: (amountNGN: number) => string
  formatCurrencyValue: (amountNGN: number) => { value: string; symbol: string }
}

const EXCHANGE_RATE = 1450 // ₦1,450 per $1 USDC

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<CurrencyView>("ngn")

  const formatCurrency = (amountNGN: number): string => {
    if (view === "ngn") {
      return `₦${amountNGN.toLocaleString()}`
    } else {
      const usdcAmount = amountNGN / EXCHANGE_RATE
      return `$${usdcAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDC`
    }
  }

  const formatCurrencyValue = (amountNGN: number): { value: string; symbol: string } => {
    if (view === "ngn") {
      return { value: amountNGN.toLocaleString(), symbol: "₦" }
    } else {
      const usdcAmount = amountNGN / EXCHANGE_RATE
      return { 
        value: usdcAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), 
        symbol: "USDC" 
      }
    }
  }

  return (
    <CurrencyContext.Provider value={{ view, setView, exchangeRate: EXCHANGE_RATE, formatCurrency, formatCurrencyValue }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider")
  }
  return context
}
