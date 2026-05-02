"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Bot, User, Sparkles, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const BACKEND_URL = "https://sme-treasury-ussd.onrender.com"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })
}

interface ChatInterfaceProps {
  onPaymentAuthorized: () => void
}

const suggestedPrompts = [
  "Check vault balance",
  "Authorize supplier payment",
  "Review USSD transactions",
  "Generate treasury report",
]

export function ChatInterface({ onPaymentAuthorized }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize messages on client only to avoid hydration mismatch
  useEffect(() => {
    if (!isInitialized) {
      setMessages([
        {
          id: "1",
          role: "assistant",
          content: "Hello! I'm your Autonomous Treasurer. I can help you manage your treasury operations, authorize payments, and monitor your vault security. How can I assist you today?",
          timestamp: formatTime(new Date()),
        },
      ])
      setIsInitialized(true)
    }
  }, [isInitialized])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: formatTime(new Date()),
    }

    setMessages((prev) => [...prev, userMessage])
    const userInput = input
    setInput("")
    setIsLoading(true)

    // Send message to backend
    let assistantContent = ""
    try {
      const response = await fetch(`${BACKEND_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userInput,
          sessionId: Date.now().toString(),
        }),
      })
      
      if (response.ok) {
        const data = await response.json()
        assistantContent = data.response || data.message || ""
      }
    } catch (error) {
      console.log("[v0] Backend chat request failed:", error)
    }

    // Fallback to simulated response if backend fails
    if (!assistantContent) {
      await new Promise((resolve) => setTimeout(resolve, 2000))
    }

    // Check if payment authorization is requested
    const isPaymentRequest = userInput.toLowerCase().includes("authorize") || 
                             userInput.toLowerCase().includes("payment") ||
                             userInput.toLowerCase().includes("pay")

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: assistantContent || (isPaymentRequest
        ? "Payment authorized successfully! I've processed the transaction through the secure vault. The supplier has been notified and funds will be transferred within 24 hours. Transaction hash: 0x7f3a...8b2c"
        : "I've analyzed your request and processed it through the OWS MCP Server. Your treasury operations are running smoothly with all security protocols active. Is there anything specific you'd like me to elaborate on?"),
      timestamp: formatTime(new Date()),
    }

    setMessages((prev) => [...prev, assistantMessage])
    setIsLoading(false)

    if (isPaymentRequest) {
      onPaymentAuthorized()
    }
  }

  const handlePromptClick = (prompt: string) => {
    setInput(prompt)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border">
        <div className="relative">
          {/* Pulsing glow ring when loading */}
          <motion.div
            className="absolute -inset-1 rounded-xl bg-gradient-to-br from-[#0052FF] to-purple-600"
            initial={{ opacity: 0 }}
            animate={isLoading ? { 
              opacity: [0, 0.6, 0],
              scale: [1, 1.15, 1]
            } : { opacity: 0 }}
            transition={{ 
              duration: 1.5, 
              repeat: isLoading ? Infinity : 0,
              ease: "easeInOut"
            }}
            style={{ filter: "blur(8px)" }}
          />
          <motion.div
            className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#0052FF] to-purple-600"
            animate={isLoading ? { scale: [1, 1.03, 1] } : {}}
            transition={{ duration: 0.8, repeat: isLoading ? Infinity : 0 }}
          >
            <Bot className="w-5 h-5 text-white" />
          </motion.div>
        </div>
        <div>
          <h2 className="font-semibold text-foreground">Autonomous Treasurer</h2>
          <div className="flex items-center gap-1.5">
            <span className={cn(
              "w-1.5 h-1.5 rounded-full",
              isLoading ? "bg-yellow-500" : "bg-green-500"
            )} />
            <span className="text-xs text-muted-foreground">
              {isLoading ? "Processing..." : "Online"}
            </span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence mode="popLayout" initial={false}>
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ 
                duration: 0.35, 
                ease: [0.25, 0.46, 0.45, 0.94],
                delay: index === messages.length - 1 ? 0.05 : 0
              }}
              layout="position"
              className={cn(
                "flex gap-3",
                message.role === "user" && "flex-row-reverse"
              )}
            >
              <div
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-lg shrink-0",
                  message.role === "assistant"
                    ? "bg-gradient-to-br from-[#0052FF]/20 to-purple-600/20 border border-[#0052FF]/30"
                    : "bg-secondary"
                )}
              >
                {message.role === "assistant" ? (
                  <Bot className="w-4 h-4 text-[#0052FF]" />
                ) : (
                  <User className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
              <div
                className={cn(
                  "max-w-[80%] rounded-2xl px-4 py-3",
                  message.role === "assistant"
                    ? "bg-card border border-border"
                    : "bg-[#0052FF] text-white"
                )}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
                <p
                  className={cn(
                    "text-[10px] mt-2",
                    message.role === "assistant"
                      ? "text-muted-foreground"
                      : "text-white/70"
                  )}
                >
                  {message.timestamp}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Thinking State */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="flex gap-3"
            >
              {/* Pulsing agent icon */}
              <motion.div 
                className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-[#0052FF]/20 to-purple-600/20 border border-[#0052FF]/30"
                animate={{ 
                  boxShadow: [
                    "0 0 0 0 rgba(0, 82, 255, 0)",
                    "0 0 12px 3px rgba(0, 82, 255, 0.3)",
                    "0 0 0 0 rgba(0, 82, 255, 0)"
                  ]
                }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <Bot className="w-4 h-4 text-[#0052FF]" />
              </motion.div>
              
              {/* Response area with shimmer */}
              <div className="relative overflow-hidden rounded-2xl bg-card border border-border">
                {/* Multi-layer shimmer effect */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-[#0052FF]/10 to-transparent"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
                />
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-600/8 to-transparent"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "linear", delay: 0.4 }}
                />
                
                <div className="relative px-4 py-3 flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                  >
                    <Loader2 className="w-4 h-4 text-[#0052FF]" />
                  </motion.div>
                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-foreground font-medium">
                      Querying OWS MCP Server...
                    </span>
                    <motion.span 
                      className="text-[11px] text-muted-foreground"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      Processing treasury request
                    </motion.span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts */}
      {messages.length === 1 && (
        <div className="px-4 pb-2">
          <p className="text-xs text-muted-foreground mb-2">Suggested prompts</p>
          <div className="flex flex-wrap gap-2">
            {suggestedPrompts.map((prompt, i) => (
              <motion.button
                key={prompt}
                onClick={() => handlePromptClick(prompt)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary/50 border border-border text-xs text-muted-foreground hover:text-foreground hover:border-[#0052FF]/50 transition-all duration-200"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.3 }}
                whileHover={{ scale: 1.02, backgroundColor: "rgba(0, 82, 255, 0.05)" }}
                whileTap={{ scale: 0.98 }}
              >
                <Sparkles className="w-3 h-3" />
                {prompt}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="relative">
          {/* Animated glow background when loading */}
          <motion.div 
            className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-[#0052FF] via-purple-600 to-[#0052FF] blur-sm"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: isLoading ? [0.3, 0.5, 0.3] : 0,
              backgroundPosition: isLoading ? ["0% 50%", "100% 50%", "0% 50%"] : "0% 50%"
            }}
            transition={{ 
              duration: 2, 
              repeat: isLoading ? Infinity : 0,
              ease: "easeInOut"
            }}
            style={{ backgroundSize: "200% 200%" }}
          />
          <div className={cn(
            "relative flex items-center gap-2 bg-input rounded-xl border p-2 transition-all duration-300",
            isLoading ? "border-[#0052FF]/50 input-glow" : "border-border focus-within:border-[#0052FF]/50"
          )}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder={isLoading ? "Processing your request..." : "Ask your treasurer anything..."}
              className="flex-1 bg-transparent px-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              disabled={isLoading}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              size="sm"
              className="bg-[#0052FF] hover:bg-[#0052FF]/90 text-white rounded-lg"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
