"use client"

import Image from "next/image"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { X, Loader2 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

interface WalletModalProps {
  onClose: () => void
}

export function WalletModal({ onClose }: WalletModalProps) {
  const { walletLogin, isLoading } = useAuth()
  const [connectingWallet, setConnectingWallet] = useState<string | null>(null)
  const router = useRouter()

  const wallets = [
    {
      name: "Phantom",
      icon: "/phantom-icon.png",
      installed: true,
    },
    {
      name: "Solflare",
      icon: "/solflare-icon.png",
      installed: true,
    },
    {
      name: "Backpack",
      icon: "/backpack-icon.png",
      installed: true,
    },
    {
      name: "Magic Eden",
      icon: "/magic-eden-icon.png",
      installed: true,
    },
  ]

  const handleWalletConnect = async (walletName: string) => {
    setConnectingWallet(walletName)
    const success = await walletLogin(walletName)
    if (success) {
      onClose()
      router.push("/dashboard")
    }
    setConnectingWallet(null)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-background-800 p-6 shadow-2xl border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Connect Wallet</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-gray-400 hover:text-white hover:bg-background-700 rounded-full"
            aria-label="Close"
            disabled={isLoading}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="space-y-3">
          {wallets.map((wallet) => (
            <button
              key={wallet.name}
              className="w-full flex items-center justify-between py-3 px-4 border border-gray-700 hover:border-everchess-yellow/50 hover:bg-background-700 rounded-xl cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-everchess-yellow/50 focus:border-transparent active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
              onClick={() => handleWalletConnect(wallet.name)}
              disabled={isLoading || connectingWallet !== null}
            >
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-background-700 flex items-center justify-center overflow-hidden">
                  <Image
                    src={wallet.icon || "/placeholder.svg"}
                    alt={wallet.name}
                    width={36}
                    height={36}
                    className="object-contain"
                  />
                </div>
                <span className="text-white font-medium">{wallet.name}</span>
              </div>
              <div className="bg-everchess-yellow/10 text-everchess-yellow px-2.5 py-1 rounded-md text-xs font-medium flex items-center">
                {connectingWallet === wallet.name ? (
                  <>
                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    CONNECTING
                  </>
                ) : (
                  "INSTALLED"
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Bottom margin for spacing */}
        <div className="mt-2"></div>
      </div>
    </div>
  )
}
