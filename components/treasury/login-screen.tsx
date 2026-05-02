"use client"

import { useLogin } from "@privy-io/react-auth"
import { motion } from "framer-motion"
import { Shield, Wallet, Bot, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const features = [
  {
    icon: Bot,
    title: "AI-Powered Treasury",
    description: "Autonomous management of your business funds",
  },
  {
    icon: Shield,
    title: "Vault Security",
    description: "Multi-sig protection on Base Sepolia",
  },
  {
    icon: Wallet,
    title: "USSD Integration",
    description: "Seamless mobile money transactions",
  },
]

export function LoginScreen() {
  const { login } = useLogin({
    onComplete: () => {
      console.log("[v0] User logged in successfully")
    },
    onError: (error) => {
      console.log("[v0] Login error:", error)
    },
  })

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0052FF]/10 via-background to-purple-600/10 p-12 flex-col justify-between relative overflow-hidden">
        {/* Animated background elements */}
        <motion.div
          className="absolute top-20 left-20 w-64 h-64 bg-[#0052FF]/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, delay: 2 }}
        />

        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-[#0052FF] to-purple-600">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-semibold text-foreground">SME Treasury AI</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-bold text-foreground mb-4 text-balance"
          >
            Autonomous Treasury Management for African SMEs
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground mb-12 text-pretty"
          >
            Secure your business funds with AI-powered vault management, USSD integration, and blockchain security on Base.
          </motion.p>

          <div className="space-y-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex items-start gap-4"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-secondary/50 border border-border">
                  <feature.icon className="w-5 h-5 text-[#0052FF]" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-xs text-muted-foreground relative z-10"
        >
          Secured by Base Sepolia Network
        </motion.p>
      </div>

      {/* Right Panel - Login */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8 lg:hidden">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#0052FF] to-purple-600">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-semibold text-foreground">SME Treasury AI</span>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-8">
            <h2 className="text-2xl font-semibold text-foreground text-center mb-2">
              Welcome Back
            </h2>
            <p className="text-sm text-muted-foreground text-center mb-8">
              Sign in to access your treasury dashboard
            </p>

            <Button
              onClick={login}
              className="w-full h-12 bg-[#0052FF] hover:bg-[#0052FF]/90 text-white font-medium rounded-xl flex items-center justify-center gap-2 transition-all duration-200"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
              <ArrowRight className="w-4 h-4" />
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-card text-muted-foreground">or</span>
              </div>
            </div>

            <Button
              onClick={login}
              variant="outline"
              className="w-full h-12 rounded-xl flex items-center justify-center gap-2"
            >
              Continue with Email
            </Button>

            <p className="text-xs text-muted-foreground text-center mt-6">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>

          <p className="text-xs text-muted-foreground text-center mt-6">
            Built for the Zero to Agent Hackathon
          </p>
        </motion.div>
      </div>
    </div>
  )
}
