"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { usePrivy } from "@privy-io/react-auth"
import { Sidebar } from "@/components/treasury/sidebar"
import { ChatInterface } from "@/components/treasury/chat-interface"
import { VaultStatusCard } from "@/components/treasury/vault-status-card"
import { SuppliersCard } from "@/components/treasury/suppliers-card"
import { USSDActivity, type USSDTransaction } from "@/components/treasury/ussd-activity"
import { OverviewPanel } from "@/components/treasury/overview-panel"
import { Footer } from "@/components/treasury/footer"
import { LoginScreen } from "@/components/treasury/login-screen"
import { BackupPhraseModal } from "@/components/treasury/backup-phrase-modal"
import { AddFundsModal } from "@/components/treasury/add-funds-modal"
import { DepositNairaModal } from "@/components/treasury/deposit-naira-modal"
import { CashOutModal } from "@/components/treasury/cash-out-modal"
import { CurrencyProvider } from "@/components/treasury/currency-context"
import { CurrencyToggle } from "@/components/treasury/currency-toggle"
import { VocalGuideProvider, VocalGuideButton } from "@/components/treasury/vocal-guide"
import { SecurityCheck } from "@/components/treasury/security-check"
import { Plus, Shield, Building2, Banknote } from "lucide-react"
import { Button } from "@/components/ui/button"

const BACKEND_URL = "https://sme-treasury-ussd.onrender.com"

const initialTransactions: USSDTransaction[] = [
  {
    id: "1",
    type: "inbound",
    code: "*737*1#",
    amount: "₦50,000",
    phone: "+234 812 ***",
    status: "completed",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
  },
  {
    id: "2",
    type: "outbound",
    code: "*919*1#",
    amount: "₦125,000",
    phone: "+234 903 ***",
    status: "completed",
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
  },
  {
    id: "3",
    type: "inbound",
    code: "*737*2#",
    amount: "₦75,000",
    phone: "+234 805 ***",
    status: "pending",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: "4",
    type: "outbound",
    code: "*894#",
    amount: "₦200,000",
    phone: "+234 701 ***",
    status: "completed",
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
  },
]

const newTransactionTemplates = [
  {
    type: "inbound" as const,
    code: "*737*3#",
    amount: "₦180,000",
    phone: "+234 811 ***",
    status: "completed" as const,
  },
  {
    type: "outbound" as const,
    code: "*901#",
    amount: "₦95,000",
    phone: "+234 909 ***",
    status: "pending" as const,
  },
  {
    type: "inbound" as const,
    code: "*919*2#",
    amount: "₦320,000",
    phone: "+234 802 ***",
    status: "completed" as const,
  },
]

export default function TreasuryDashboard() {
  const { ready, authenticated, user } = usePrivy()
  const [activeTab, setActiveTab] = useState("overview")
  const [vaultSecure, setVaultSecure] = useState(false)
  const [transactions, setTransactions] = useState<USSDTransaction[]>(initialTransactions)
  const [showBackupModal, setShowBackupModal] = useState(false)
  const [showAddFundsModal, setShowAddFundsModal] = useState(false)
  const [showDepositNairaModal, setShowDepositNairaModal] = useState(false)
  const [showCashOutModal, setShowCashOutModal] = useState(false)
  const [hasBackedUp, setHasBackedUp] = useState(false)
  const [isNewUser, setIsNewUser] = useState(false)

  // Check if user is new and show backup modal
  useEffect(() => {
    if (authenticated && user) {
      const backupKey = `treasury_backup_${user.id}`
      const hasBackup = localStorage.getItem(backupKey)
      if (!hasBackup) {
        setIsNewUser(true)
        // Show backup modal after a short delay for new users
        const timer = setTimeout(() => {
          setShowBackupModal(true)
        }, 1500)
        return () => clearTimeout(timer)
      }
    }
  }, [authenticated, user])

  const handleBackupComplete = () => {
    if (user) {
      localStorage.setItem(`treasury_backup_${user.id}`, "true")
    }
    setHasBackedUp(true)
    setIsNewUser(false)
  }

  const handlePaymentAuthorized = useCallback(async () => {
    setVaultSecure(true)
    
    // Add a new transaction when payment is authorized
    const template = newTransactionTemplates[Math.floor(Math.random() * newTransactionTemplates.length)]
    const newTransaction: USSDTransaction = {
      id: Date.now().toString(),
      ...template,
      timestamp: new Date(),
    }
    setTransactions((prev) => [newTransaction, ...prev.slice(0, 5)])

    // Send payment data to backend
    try {
      await fetch(`${BACKEND_URL}/api/payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transactionId: newTransaction.id,
          type: newTransaction.type,
          amount: newTransaction.amount,
          status: "authorized",
          timestamp: new Date().toISOString(),
        }),
      })
    } catch {
      // Silent fail for demo
    }
  }, [])

  // Simulate incoming transactions periodically
  useEffect(() => {
    if (!authenticated) return

    const interval = setInterval(async () => {
      if (Math.random() > 0.7) {
        const template = newTransactionTemplates[Math.floor(Math.random() * newTransactionTemplates.length)]
        const newTransaction: USSDTransaction = {
          id: Date.now().toString(),
          ...template,
          timestamp: new Date(),
        }
        setTransactions((prev) => [newTransaction, ...prev.slice(0, 7)])

        // Send USSD activity to backend
        try {
          await fetch(`${BACKEND_URL}/api/ussd/activity`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              transactionId: newTransaction.id,
              code: newTransaction.code,
              type: newTransaction.type,
              amount: newTransaction.amount,
              phone: newTransaction.phone,
              status: newTransaction.status,
              timestamp: new Date().toISOString(),
            }),
          })
        } catch {
          // Silent fail for demo
        }
      }
    }, 15000)

    return () => clearInterval(interval)
  }, [authenticated])

  // Show loading state while Privy initializes
  if (!ready) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0052FF] to-purple-600">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div className="flex items-center gap-2">
            <motion.div
              className="w-2 h-2 rounded-full bg-[#0052FF]"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
            />
            <motion.div
              className="w-2 h-2 rounded-full bg-[#0052FF]"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
            />
            <motion.div
              className="w-2 h-2 rounded-full bg-[#0052FF]"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
            />
          </div>
        </motion.div>
      </div>
    )
  }

  // Show login screen if not authenticated
  if (!authenticated) {
    return <LoginScreen />
  }

  return (
    <CurrencyProvider>
      <VocalGuideProvider>
        <div className="flex h-screen bg-background overflow-hidden">
          {/* Sidebar */}
          <Sidebar
            activeTab={activeTab}
            onTabChange={setActiveTab}
            vaultSecure={vaultSecure}
          />

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <motion.header
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between px-6 py-4 border-b border-border bg-card/50 backdrop-blur-sm"
            >
              <div>
                <h1 className="text-xl font-semibold text-foreground">
                  {activeTab === "overview" && "Dashboard Overview"}
                  {activeTab === "vault" && "Vault Security"}
                  {activeTab === "ussd" && "USSD Activity"}
                  {activeTab === "security" && "Security Check"}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {activeTab === "overview" && "Monitor your treasury operations in real-time"}
                  {activeTab === "vault" && "Manage and secure your vault assets"}
                  {activeTab === "ussd" && "Track all USSD transactions"}
                  {activeTab === "security" && "Verify your identity and security settings"}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {/* Currency Toggle */}
                <div className="flex items-center gap-2">
                  <CurrencyToggle />
                  <VocalGuideButton featureId="currency-toggle" />
                </div>

                {/* OWS Secured Status */}
                <motion.div 
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/30"
                  animate={{
                    boxShadow: [
                      "0 0 0 0 rgba(34, 197, 94, 0)",
                      "0 0 12px 2px rgba(34, 197, 94, 0.3)",
                      "0 0 0 0 rgba(34, 197, 94, 0)"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <motion.div 
                    className="w-2 h-2 rounded-full bg-green-500"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  <span className="text-xs font-medium text-green-500">OWS Secured</span>
                </motion.div>

                {/* Deposit Naira Button */}
                <Button
                  onClick={() => setShowDepositNairaModal(true)}
                  variant="outline"
                  className="h-9 px-3 rounded-lg flex items-center gap-2 border-green-500/30 text-green-500 hover:bg-green-500/10"
                >
                  <Building2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Deposit ₦</span>
                  <VocalGuideButton featureId="deposit-naira" className="ml-1" />
                </Button>

                {/* Cash Out Button */}
                <Button
                  onClick={() => setShowCashOutModal(true)}
                  variant="outline"
                  className="h-9 px-3 rounded-lg flex items-center gap-2 border-purple-500/30 text-purple-500 hover:bg-purple-500/10"
                >
                  <Banknote className="w-4 h-4" />
                  <span className="hidden sm:inline">Cash Out</span>
                  <VocalGuideButton featureId="cash-out" className="ml-1" />
                </Button>

                {/* Add Funds Button */}
                <Button
                  onClick={() => setShowAddFundsModal(true)}
                  className="h-9 px-4 bg-[#0052FF] hover:bg-[#0052FF]/90 text-white rounded-lg flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Add Funds</span>
                  <VocalGuideButton featureId="add-funds" className="ml-1" />
                </Button>
              </div>
            </motion.header>

            {/* Content Area */}
            <div className="flex-1 flex overflow-hidden">
              {/* Main Panel */}
              <main className="flex-1 overflow-y-auto p-6">
                <AnimatePresence mode="wait">
                  {activeTab === "overview" && (
                    <motion.div
                      key="overview"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <OverviewPanel />
                      <div className="grid gap-6 lg:grid-cols-2">
                        <VaultStatusCard isSecure={vaultSecure} />
                        <SuppliersCard />
                      </div>
                      <USSDActivity transactions={transactions} />
                    </motion.div>
                  )}

                  {activeTab === "vault" && (
                    <motion.div
                      key="vault"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <VaultStatusCard isSecure={vaultSecure} />
                      <SuppliersCard />
                    </motion.div>
                  )}

                  {activeTab === "ussd" && (
                    <motion.div
                      key="ussd"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <USSDActivity transactions={transactions} />
                    </motion.div>
                  )}

                  {activeTab === "security" && (
                    <motion.div
                      key="security"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="py-8"
                    >
                      <SecurityCheck 
                        phoneNumber={user?.phone?.number || "+234 812 345 6789"}
                        onComplete={() => setVaultSecure(true)}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </main>

              {/* Chat Panel */}
              <aside className="w-[400px] border-l border-border bg-card/30 flex flex-col">
                <ChatInterface onPaymentAuthorized={handlePaymentAuthorized} />
              </aside>
            </div>

            {/* Footer */}
            <Footer />
          </div>

          {/* Backup Phrase Modal - shows once for new users */}
          <BackupPhraseModal
            isOpen={showBackupModal && isNewUser && !hasBackedUp}
            onClose={() => setShowBackupModal(false)}
            onBackupComplete={handleBackupComplete}
          />

          {/* Add Funds Modal */}
          <AddFundsModal
            isOpen={showAddFundsModal}
            onClose={() => setShowAddFundsModal(false)}
          />

          {/* Deposit Naira Modal */}
          <DepositNairaModal
            isOpen={showDepositNairaModal}
            onClose={() => setShowDepositNairaModal(false)}
          />

          {/* Cash Out Modal */}
          <CashOutModal
            isOpen={showCashOutModal}
            onClose={() => setShowCashOutModal(false)}
          />
        </div>
      </VocalGuideProvider>
    </CurrencyProvider>
  )
}
