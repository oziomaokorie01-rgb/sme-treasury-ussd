"use client"

import { PrivyProvider } from "@privy-io/react-auth"

const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID

export function PrivyAuthProvider({ children }: { children: React.ReactNode }) {
  // If no Privy app ID is configured, render children without Privy wrapper
  // This allows the app to work in development/demo mode
  if (!PRIVY_APP_ID) {
    return <>{children}</>
  }

  return (
    <PrivyProvider
      appId={PRIVY_APP_ID}
      config={{
        loginMethods: ["google", "email"],
        appearance: {
          theme: "dark",
          accentColor: "#0052FF",
          logo: "/icon.svg",
          showWalletLoginFirst: false,
        },
        embeddedWallets: {
          createOnLogin: "users-without-wallets",
        },
      }}
    >
      {children}
    </PrivyProvider>
  )
}
