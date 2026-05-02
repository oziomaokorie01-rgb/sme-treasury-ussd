"use client"

import { motion } from "framer-motion"
import {
  LayoutDashboard,
  Shield,
  Smartphone,
  Wallet,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"

interface SidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
  vaultSecure: boolean
}

const navItems = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "vault", label: "Vault Security", icon: Shield },
  { id: "ussd", label: "USSD Activity", icon: Smartphone },
]

const bottomItems = [
  { id: "settings", label: "Settings", icon: Settings },
  { id: "help", label: "Help", icon: HelpCircle },
]

export function Sidebar({ activeTab, onTabChange, vaultSecure }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn(
        "relative flex flex-col h-full border-r border-border bg-sidebar transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 p-4 border-b border-border">
        <motion.div
          className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#0052FF] to-purple-600"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <Wallet className="w-5 h-5 text-white" />
        </motion.div>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <h1 className="font-semibold text-foreground">SME Treasury</h1>
            <p className="text-xs text-muted-foreground">AI Dashboard</p>
          </motion.div>
        )}
      </div>

      {/* Vault Status Badge */}
      <div className="px-3 py-4">
        {!collapsed && (
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2 px-1">
            Vault Status
          </p>
        )}
        <div className="relative">
          {/* Green pulse ring when secure */}
          <motion.div
            className="absolute inset-0 rounded-lg bg-green-500"
            initial={{ opacity: 0, scale: 1 }}
            animate={vaultSecure ? { 
              opacity: [0, 0.4, 0],
              scale: [1, 1.15, 1.2]
            } : { opacity: 0 }}
            transition={{ 
              duration: 1.2, 
              repeat: vaultSecure ? 3 : 0,
              ease: "easeOut"
            }}
            style={{ filter: "blur(8px)" }}
          />
          <motion.div
            className={cn(
              "relative flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors",
              vaultSecure
                ? "border-green-500/50 bg-green-500/10"
                : "border-border bg-card"
            )}
            animate={vaultSecure ? { 
              boxShadow: [
                "0 0 0 0 rgba(34, 197, 94, 0)", 
                "0 0 20px 6px rgba(34, 197, 94, 0.5)", 
                "0 0 0 0 rgba(34, 197, 94, 0)"
              ] 
            } : {}}
            transition={{ duration: 1.2, repeat: vaultSecure ? 3 : 0, ease: "easeInOut" }}
          >
            <motion.div
              className={cn(
                "w-2 h-2 rounded-full",
                vaultSecure ? "bg-green-500" : "bg-yellow-500"
              )}
              animate={vaultSecure ? { scale: [1, 1.3, 1] } : {}}
              transition={{ duration: 0.6, repeat: vaultSecure ? 6 : 0 }}
            />
            {!collapsed && (
              <span className={cn(
                "text-xs font-medium",
                vaultSecure ? "text-green-400" : "text-foreground"
              )}>
                {vaultSecure ? "Secure" : "Pending"}
              </span>
            )}
          </motion.div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2">
        <p className={cn(
          "text-[10px] uppercase tracking-wider text-muted-foreground mb-2 px-1",
          collapsed && "sr-only"
        )}>
          Navigation
        </p>
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id

            return (
              <li key={item.id}>
                <motion.button
                  onClick={() => onTabChange(item.id)}
                  className={cn(
                    "relative flex items-center w-full gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  )}
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#0052FF]/20 to-purple-600/10 border border-[#0052FF]/30"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <Icon className={cn(
                    "relative z-10 w-4 h-4",
                    isActive && "text-[#0052FF]"
                  )} />
                  {!collapsed && (
                    <span className="relative z-10">{item.label}</span>
                  )}
                </motion.button>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Bottom Navigation */}
      <div className="px-3 py-4 border-t border-border">
        <ul className="space-y-1">
          {bottomItems.map((item) => {
            const Icon = item.icon
            return (
              <li key={item.id}>
                <motion.button
                  className="flex items-center w-full gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon className="w-4 h-4" />
                  {!collapsed && <span>{item.label}</span>}
                </motion.button>
              </li>
            )
          })}
        </ul>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 flex items-center justify-center w-6 h-6 rounded-full bg-card border border-border text-muted-foreground hover:text-foreground transition-colors"
      >
        {collapsed ? (
          <ChevronRight className="w-3 h-3" />
        ) : (
          <ChevronLeft className="w-3 h-3" />
        )}
      </button>
    </motion.aside>
  )
}
