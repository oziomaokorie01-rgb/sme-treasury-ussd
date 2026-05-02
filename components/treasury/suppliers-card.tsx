"use client"

import { motion } from "framer-motion"
import { Building2, MoreHorizontal, CheckCircle2, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface Supplier {
  id: string
  name: string
  status: "active" | "pending"
  lastPayment: string
  totalVolume: string
}

const suppliers: Supplier[] = [
  {
    id: "1",
    name: "Dangote Industries",
    status: "active",
    lastPayment: "2 hours ago",
    totalVolume: "₦45.2M",
  },
  {
    id: "2",
    name: "BUA Group",
    status: "active",
    lastPayment: "5 hours ago",
    totalVolume: "₦32.8M",
  },
  {
    id: "3",
    name: "Lafarge Africa",
    status: "pending",
    lastPayment: "1 day ago",
    totalVolume: "₦18.5M",
  },
  {
    id: "4",
    name: "Nestle Nigeria",
    status: "active",
    lastPayment: "3 days ago",
    totalVolume: "₦12.1M",
  },
]

export function SuppliersCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="relative overflow-hidden rounded-xl border border-border bg-card"
    >
      {/* Background Gradient */}
      <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-gradient-to-br from-purple-600/10 to-[#0052FF]/10 blur-3xl gradient-glow" />

      {/* Header */}
      <div className="relative flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-purple-600/10">
            <Building2 className="w-4 h-4 text-purple-500" />
          </div>
          <h3 className="font-semibold text-foreground">Active Suppliers</h3>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-secondary text-xs text-muted-foreground">
          {suppliers.length} total
        </span>
      </div>

      {/* Suppliers List */}
      <div className="relative divide-y divide-border">
        {suppliers.map((supplier, index) => (
          <motion.div
            key={supplier.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 * index }}
            className="flex items-center justify-between p-4 hover:bg-secondary/30 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-secondary text-foreground font-semibold text-sm">
                {supplier.name.charAt(0)}
              </div>
              <div>
                <p className="font-medium text-foreground text-sm">
                  {supplier.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  Last payment: {supplier.lastPayment}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="font-medium text-foreground text-sm">
                  {supplier.totalVolume}
                </p>
                <div
                  className={cn(
                    "flex items-center gap-1 text-xs",
                    supplier.status === "active"
                      ? "text-green-500"
                      : "text-yellow-500"
                  )}
                >
                  {supplier.status === "active" ? (
                    <CheckCircle2 className="w-3 h-3" />
                  ) : (
                    <Clock className="w-3 h-3" />
                  )}
                  <span className="capitalize">{supplier.status}</span>
                </div>
              </div>
              <button className="p-1.5 rounded-md hover:bg-secondary transition-colors">
                <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
