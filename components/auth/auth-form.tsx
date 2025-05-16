"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { WalletModal } from "@/components/auth/wallet-modal"
import { SocialButton } from "@/components/auth/social-button"
import { GoogleIcon, XIcon, DiscordIcon, FacebookIcon, AppleIcon } from "@/components/icons/social-icons"

interface AuthFormProps {
  isLogin: boolean
}

export function AuthForm({ isLogin }: AuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showWalletModal, setShowWalletModal] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate auth process
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username" className="text-white">
            <span className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
                  stroke="#fcdf3a"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M4 21V19C4 16.7909 5.79086 15 8 15H16C18.2091 15 20 16.7909 20 19V21"
                  stroke="#fcdf3a"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Username
            </span>
          </Label>
          <Input id="username" placeholder="Username" className="bg-background-800 text-white" required />
        </div>

        {!isLogin && (
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">
              <span className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z"
                    stroke="#fcdf3a"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M22 6L12 13L2 6"
                    stroke="#fcdf3a"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Email
              </span>
            </Label>
            <Input id="email" type="email" placeholder="Email" className="bg-background-800 text-white" required />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="password" className="text-white">
            <span className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M19 11H5C3.89543 11 3 11.8954 3 13V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V13C21 11.8954 20.1046 11 19 11Z"
                  stroke="#fcdf3a"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11"
                  stroke="#fcdf3a"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 16.5C12.8284 16.5 13.5 15.8284 13.5 15C13.5 14.1716 12.8284 13.5 12 13.5C11.1716 13.5 10.5 14.1716 10.5 15C10.5 15.8284 11.1716 16.5 12 16.5Z"
                  fill="#fcdf3a"
                />
              </svg>
              Password
            </span>
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="Password"
            className="bg-background-800 text-white"
            required
          />
        </div>

        {!isLogin && (
          <div className="space-y-2">
            <Label htmlFor="confirm-password" className="text-white">
              <span className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M19 11H5C3.89543 11 3 11.8954 3 13V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V13C21 11.8954 20.1046 11 19 11Z"
                    stroke="#fcdf3a"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11"
                    stroke="#fcdf3a"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 16.5C12.8284 16.5 13.5 15.8284 13.5 15C13.5 14.1716 12.8284 13.5 12 13.5C11.1716 13.5 10.5 14.1716 10.5 15C10.5 15.8284 11.1716 16.5 12 16.5Z"
                    fill="#fcdf3a"
                  />
                </svg>
                Confirm Password
              </span>
            </Label>
            <Input
              id="confirm-password"
              type="password"
              placeholder="Confirm Password"
              className="bg-background-800 text-white"
              required
            />
          </div>
        )}

        <Button type="submit" className="w-full bg-red-600 text-white hover:bg-red-700" disabled={isLoading}>
          {isLoading ? (isLogin ? "Logging in..." : "Signing up...") : isLogin ? "Login" : "Sign Up"}
        </Button>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-background-900 px-2 text-muted-foreground">or</span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-5 gap-2 social-icons-grid">
          <SocialButton bgColor="bg-white" size="sm" iconScale={1.3} aria-label="Continue with Google">
            <GoogleIcon size={20} />
          </SocialButton>
          <SocialButton bgColor="bg-black" size="sm" iconScale={1.3} aria-label="Continue with X">
            <XIcon size={18} />
          </SocialButton>
          <SocialButton bgColor="bg-[#5865F2]" size="sm" iconScale={1.3} aria-label="Continue with Discord">
            <DiscordIcon size={20} />
          </SocialButton>
          <SocialButton bgColor="bg-[#1877F2]" size="sm" iconScale={1.3} aria-label="Continue with Facebook">
            <FacebookIcon size={20} />
          </SocialButton>
          <SocialButton bgColor="bg-black" size="sm" iconScale={1.3} aria-label="Continue with Apple">
            <AppleIcon size={20} />
          </SocialButton>
        </div>

        <Button
          variant="outline"
          className="mt-4 w-full bg-background-700 text-white"
          onClick={() => setShowWalletModal(true)}
        >
          Continue With Wallet
        </Button>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          By continuing, you agree to the{" "}
          <Link href="/privacy" className="text-primary hover:underline">
            Privacy Policy
          </Link>{" "}
          and{" "}
          <Link href="/terms" className="text-primary hover:underline">
            Terms of Service
          </Link>
        </p>
      </div>

      {showWalletModal && <WalletModal onClose={() => setShowWalletModal(false)} />}
    </>
  )
}
