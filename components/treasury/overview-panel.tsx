"use client"

import { motion } from "framer-motion"
import { TrendingUp, TrendingDown, Wallet, ArrowRightLeft, Activity } from "lucide-react"
import { cn } from "@/lib/utils"

const stats = [
  {
    label: "Total Balance",
    value: "₦142.5M",
    change: "+12.5%",
    trend: "up" as const,
    icon: Wallet,
  },
  {
    label: "Monthly Volume",
    value: "₦89.2M",
    change: "+8.3%",
    trend: "up" as const,
    icon: ArrowRightLeft,
  },
  {
    label: "Active Transactions",
    value: "234",
    change: "-3.2%",
    trend: "down" as const,
    icon: Activity,
  },
]

export function OverviewPanel() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {stats.map((stat, index) => {
        const Icon = stat.icon
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
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
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
  )
}
