"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { WalletModal } from "@/components/auth/wallet-modal"
import { SocialButton } from "@/components/auth/social-button"
import { GoogleIcon, XIcon, DiscordIcon, FacebookIcon, AppleIcon } from "@/components/icons/social-icons"
import { useAuth } from "@/contexts/auth-context"

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showWalletModal, setShowWalletModal] = useState(false)
  const { login, socialLogin, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, router])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!isLogin && password !== confirmPassword) {
      // Show error message
      return
    }

    const success = await login({ username, password })
    if (success) {
      router.push("/dashboard")
    }
  }

  const handleSocialLogin = async (provider: string) => {
    const success = await socialLogin(provider)
    if (success) {
      router.push("/dashboard")
    }
  }

  return (
    <div className="flex min-h-screen w-full bg-background-800">
      {/* Left side - Auth form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo (only visible on mobile) */}
          <div className="flex md:hidden flex-col items-center mb-8 p-4 rounded-xl">
            <div className="relative h-16 w-16 rounded-md overflow-hidden mb-3">
              <div className="absolute inset-0 rainbow-gradient animate-spin-slow"></div>
              <div className="absolute inset-[2px] bg-black rounded-[0.3rem] flex items-center justify-center">
                <Image src="/logo.png" alt="Everchess Logo" width={56} height={56} className="relative z-10" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white">EVERCHESS</h1>
            <p className="text-sm text-everchess-yellow">ANCIENT MADE MODERN</p>
          </div>

          <div className="bg-background-700 rounded-2xl shadow-xl border border-gray-700/50 overflow-hidden">
            {/* Auth header with tabs */}
            <div className="flex border-b border-gray-700">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-4 text-center font-medium transition-colors ${
                  isLogin ? "text-white tab-underline" : "text-gray-400 hover:text-[#00B6FF80]"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-4 text-center font-medium transition-colors ${
                  !isLogin ? "text-white tab-underline" : "text-gray-400 hover:text-[#00B6FF80]"
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Auth form */}
            <div className="p-6">
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
                  <Input
                    id="username"
                    placeholder="Username"
                    className="bg-background-800 text-white border-gray-700 focus:border-[#00B6FF] focus:ring-[#00B6FF]/30 placeholder:text-gray-400 focus-visible:outline-[#00B6FF] focus-visible:outline-offset-2"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
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
                    <Input
                      id="email"
                      type="email"
                      placeholder="Email"
                      className="bg-background-800 text-white border-gray-700 focus:border-[#00B6FF] focus:ring-[#00B6FF]/30 placeholder:text-gray-400 focus-visible:outline-[#00B6FF] focus-visible:outline-offset-2"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
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
                    className="bg-background-800 text-white border-gray-700 focus:border-[#00B6FF] focus:ring-[#00B6FF]/30 placeholder:text-gray-400 focus-visible:outline-[#00B6FF] focus-visible:outline-offset-2"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                      className="bg-background-800 text-white border-gray-700 focus:border-[#00B6FF] focus:ring-[#00B6FF]/30 placeholder:text-gray-400 focus-visible:outline-[#00B6FF] focus-visible:outline-offset-2"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                )}

                {isLogin && (
                  <div className="flex justify-end">
                    <Link
                      href="#"
                      className="text-sm text-white hover:text-[#00B6FF] hover:underline transition-colors focus-visible:outline-[#00B6FF] focus-visible:outline-offset-2 focus-visible:rounded-sm"
                    >
                      Forgot password?
                    </Link>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-red-600 text-white hover:bg-red-700 font-medium transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  disabled={isLoading}
                >
                  {isLoading ? (isLogin ? "Logging in..." : "Signing up...") : isLogin ? "Login" : "Sign Up"}
                </Button>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-700" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-background-700 px-2 text-gray-400">or continue with</span>
                  </div>
                </div>

                {/* Social icons section with optimized Apple icon */}
                <div className="mt-6 grid grid-cols-5 gap-2 social-icons-grid">
                  <SocialButton
                    bgColor="bg-white"
                    size="sm"
                    iconScale={1.3}
                    aria-label="Continue with Google"
                    onClick={() => handleSocialLogin("Google")}
                    disabled={isLoading}
                  >
                    <GoogleIcon size={20} />
                  </SocialButton>
                  <SocialButton
                    bgColor="bg-black"
                    size="sm"
                    iconScale={1.3}
                    aria-label="Continue with X"
                    onClick={() => handleSocialLogin("Twitter")}
                    disabled={isLoading}
                  >
                    <XIcon size={18} />
                  </SocialButton>
                  <SocialButton
                    bgColor="bg-[#5865F2]"
                    size="sm"
                    iconScale={1.3}
                    aria-label="Continue with Discord"
                    onClick={() => handleSocialLogin("Discord")}
                    disabled={isLoading}
                  >
                    <DiscordIcon size={20} />
                  </SocialButton>
                  <SocialButton
                    bgColor="bg-[#1877F2]"
                    size="sm"
                    iconScale={1.3}
                    aria-label="Continue with Facebook"
                    onClick={() => handleSocialLogin("Facebook")}
                    disabled={isLoading}
                  >
                    <FacebookIcon size={20} />
                  </SocialButton>
                  <SocialButton
                    bgColor="bg-black"
                    size="sm"
                    iconScale={1.3}
                    aria-label="Continue with Apple"
                    onClick={() => handleSocialLogin("Apple")}
                    disabled={isLoading}
                  >
                    <AppleIcon size={20} />
                  </SocialButton>
                </div>

                <Button
                  variant="outline"
                  className="mt-4 w-full bg-background-800 text-white border-gray-700 hover:bg-background-700 hover:border-everchess-yellow hover:shadow-[0_0_15px_rgba(252,223,58,0.4)] transition-all duration-300 group"
                  onClick={() => setShowWalletModal(true)}
                  disabled={isLoading}
                >
                  <span className="transition-transform duration-300 group-hover:scale-[1.02]">
                    Continue With Wallet
                  </span>
                </Button>

                <p className="mt-6 text-center text-xs text-gray-400">
                  By continuing, you agree to the{" "}
                  <Link
                    href="/privacy"
                    className="text-white hover:text-[#00B6FF] hover:underline transition-colors focus-visible:outline-[#00B6FF] focus-visible:outline-offset-2 focus-visible:rounded-sm"
                  >
                    Privacy Policy
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/terms"
                    className="text-white hover:text-[#00B6FF] hover:underline transition-colors focus-visible:outline-[#00B6FF] focus-visible:outline-offset-2 focus-visible:rounded-sm"
                  >
                    Terms of Service
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Back to home link */}
          <div className="mt-6 text-center">
            <Link href="/" className="text-sm text-gray-400 hover:text-white flex items-center justify-center gap-1">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path
                  d="M12 19L5 12L12 5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Back to home
            </Link>
          </div>
        </div>
      </div>

      {/* Right side - Brand section */}
      <div className="hidden md:flex md:w-1/2 flex-col items-center justify-center p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background-800 via-background-850 to-background-700 z-0"></div>
        <div className="relative z-10 flex flex-col items-center text-center max-w-md">
          <div className="relative h-24 w-24 rounded-xl overflow-hidden mb-6">
            <div className="absolute inset-0 rainbow-gradient animate-spin-slow"></div>
            <div className="absolute inset-[3px] bg-background-800 rounded-lg flex items-center justify-center">
              <Image src="/logo.png" alt="Everchess Logo" width={80} height={80} className="relative z-10" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-white mb-3">EVERCHESS</h1>
          <p className="text-lg text-everchess-yellow mb-8">ANCIENT MADE MODERN</p>

          <div className="space-y-6 mt-8 w-full max-w-sm">
            <div className="bg-background-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-800/50">
              <h2 className="text-xl font-medium text-white mb-4">Experience Chess Like Never Before</h2>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <div className="h-6 w-6 rounded-full bg-everchess-yellow/20 flex items-center justify-center">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M5 12L10 17L20 7"
                        stroke="#fcdf3a"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-300 text-sm">Collect unique 3D chess sets</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="h-6 w-6 rounded-full bg-everchess-yellow/20 flex items-center justify-center">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M5 12L10 17L20 7"
                        stroke="#fcdf3a"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-300 text-sm">Earn rewards through the battlepass</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="h-6 w-6 rounded-full bg-everchess-yellow/20 flex items-center justify-center">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M5 12L10 17L20 7"
                        stroke="#fcdf3a"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-300 text-sm">Compete in tournaments and win prizes</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {showWalletModal && <WalletModal onClose={() => setShowWalletModal(false)} />}
    </div>
  )
}
