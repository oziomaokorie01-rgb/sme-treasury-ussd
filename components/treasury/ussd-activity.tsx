"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Smartphone, ArrowUpRight, ArrowDownLeft, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

export interface USSDTransaction {
  id: string
  type: "inbound" | "outbound"
  code: string
  amount: string
  phone: string
  status: "completed" | "pending" | "failed"
  timestamp: Date
}

interface USSDActivityProps {
  transactions: USSDTransaction[]
}

export function USSDActivity({ transactions }: USSDActivityProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="relative overflow-hidden rounded-xl border border-border bg-card"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#0052FF]/10">
            <Smartphone className="w-4 h-4 text-[#0052FF]" />
          </div>
          <h3 className="font-semibold text-foreground">Recent USSD Activity</h3>
        </div>
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="w-3 h-3" />
          Live
        </span>
      </div>

      {/* Transactions Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 py-3 text-left text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                Type
              </th>
              <th className="px-4 py-3 text-left text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                Code
              </th>
              <th className="px-4 py-3 text-left text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                Phone
              </th>
              <th className="px-4 py-3 text-right text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                Amount
              </th>
              <th className="px-4 py-3 text-right text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            <AnimatePresence mode="popLayout" initial={false}>
              {transactions.map((tx, index) => (
                <motion.tr
                  key={tx.id}
                  initial={{ opacity: 0, x: -30, height: 0 }}
                  animate={{ 
                    opacity: 1, 
                    x: 0, 
                    height: "auto",
                    transition: {
                      opacity: { duration: 0.3, delay: index === 0 ? 0.1 : 0 },
                      x: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94], delay: index === 0 ? 0.05 : 0 },
                      height: { duration: 0.3 }
                    }
                  }}
                  exit={{ 
                    opacity: 0, 
                    x: 30,
                    transition: { duration: 0.2 }
                  }}
                  layout="position"
                  layoutId={tx.id}
                  className="hover:bg-secondary/30 transition-colors relative"
                >
                  {/* Subtle highlight flash for new transactions */}
                  {index === 0 && (
                    <motion.td
                      className="absolute inset-0 bg-gradient-to-r from-[#0052FF]/5 via-purple-600/5 to-transparent pointer-events-none"
                      initial={{ opacity: 1 }}
                      animate={{ opacity: 0 }}
                      transition={{ duration: 2, delay: 0.5 }}
                      colSpan={5}
                    />
                  )}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <motion.div
                        className={cn(
                          "flex items-center justify-center w-7 h-7 rounded-lg",
                          tx.type === "inbound"
                            ? "bg-green-500/10"
                            : "bg-purple-500/10"
                        )}
                        initial={index === 0 ? { scale: 0.8 } : false}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 15 }}
                      >
                        {tx.type === "inbound" ? (
                          <ArrowDownLeft className="w-3.5 h-3.5 text-green-500" />
                        ) : (
                          <ArrowUpRight className="w-3.5 h-3.5 text-purple-500" />
                        )}
                      </motion.div>
                      <span className="text-sm text-foreground capitalize">
                        {tx.type}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <code className="text-sm font-mono text-[#0052FF]">
                      {tx.code}
                    </code>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-muted-foreground">
                      {tx.phone}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-sm font-medium text-foreground">
                      {tx.amount}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span
                      className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                        tx.status === "completed" &&
                          "bg-green-500/10 text-green-500",
                        tx.status === "pending" &&
                          "bg-yellow-500/10 text-yellow-500",
                        tx.status === "failed" && "bg-red-500/10 text-red-500"
                      )}
                    >
                      {tx.status}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {transactions.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <Smartphone className="w-8 h-8 mb-2 opacity-50" />
          <p className="text-sm">No recent USSD activity</p>
        </div>
      )}
    </motion.div>
  )
}
