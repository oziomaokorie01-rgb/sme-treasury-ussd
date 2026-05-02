"use client"

import { motion } from "framer-motion"
import { TrendingUp, TrendingDown, Wallet, ArrowRightLeft, Activity } from "lucide-react"
import { cn } from "@/lib/utils"
import { useCurrency } from "./currency-context"
import { VocalGuideButton } from "./vocal-guide"

// Base values in NGN
const baseStats = [
  {
    label: "Total Balance",
    valueNGN: 142500000, // ₦142.5M
    change: "+12.5%",
    trend: "up" as const,
    icon: Wallet,
  },
  {
    label: "Monthly Volume",
    valueNGN: 89200000, // ₦89.2M
    change: "+8.3%",
    trend: "up" as const,
    icon: ArrowRightLeft,
  },
  {
    label: "Active Transactions",
    valueNGN: 0, // Not a currency value
    displayValue: "234",
    change: "-3.2%",
    trend: "down" as const,
    icon: Activity,
  },
]

function formatLargeNumber(value: number, symbol: string): string {
  if (symbol === "₦") {
    if (value >= 1000000) {
      return `₦${(value / 1000000).toFixed(1)}M`
    }
    return `₦${value.toLocaleString()}`
  } else {
    // USDC
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`
    }
    return `$${value.toFixed(2)}`
  }
}

export function OverviewPanel() {
  const { view, formatCurrencyValue, exchangeRate } = useCurrency()

  return (
    <div className="relative">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">Treasury Overview</h3>
        <VocalGuideButton featureId="overview" />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {baseStats.map((stat, index) => {
          const Icon = stat.icon
          
          // Calculate display value based on currency view
          let displayValue = stat.displayValue
          if (!displayValue && stat.valueNGN > 0) {
            const { value, symbol } = formatCurrencyValue(stat.valueNGN)
            if (symbol === "₦") {
              displayValue = formatLargeNumber(stat.valueNGN, "₦")
            } else {
              displayValue = formatLargeNumber(stat.valueNGN / exchangeRate, "USDC")
            }
          }
          
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="relative overflow-hidden rounded-xl border border-border bg-card p-5"
            >
              {/* Background Gradient */}
              <div
                className={cn(
                  "absolute -top-10 -right-10 w-24 h-24 rounded-full blur-3xl opacity-20",
                  index === 0 && "bg-[#0052FF]",
                  index === 1 && "bg-purple-600",
                  index === 2 && "bg-green-500"
                )}
              />

              <div className="relative flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    {stat.label}
                  </p>
                  <motion.p 
                    key={`${stat.label}-${view}`}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-2xl font-bold text-foreground"
                  >
                    {displayValue}
                  </motion.p>
                  <div
                    className={cn(
                      "flex items-center gap-1 mt-2 text-xs font-medium",
                      stat.trend === "up" ? "text-green-500" : "text-red-500"
                    )}
                  >
                    {stat.trend === "up" ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    <span>{stat.change}</span>
                    <span className="text-muted-foreground font-normal">
                      vs last month
                    </span>
                  </div>
                </div>
                <div
                  className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-xl",
                    index === 0 && "bg-[#0052FF]/10",
                    index === 1 && "bg-purple-600/10",
                    index === 2 && "bg-green-500/10"
                  )}
                >
                  <Icon
                    className={cn(
                      "w-5 h-5",
                      index === 0 && "text-[#0052FF]",
                      index === 1 && "text-purple-500",
                      index === 2 && "text-green-500"
                    )}
                  />
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
