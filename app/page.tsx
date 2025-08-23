"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronRight, Trophy, Users, Star, Zap, Globe, Wallet, Gamepad2 } from "lucide-react"
import { useState } from "react"
import { X } from "lucide-react"

function ComingSoonModal({ isOpen, onClose }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-background-800 border border-gray-700 rounded-xl p-6 max-w-md mx-4 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <X className="h-5 w-5" />
        </button>
        <div className="text-center">
          <div className="relative h-16 w-16 rounded-md overflow-hidden mx-auto mb-4">
            <div className="absolute inset-0 rainbow-gradient animate-spin-slow"></div>
            <div className="absolute inset-[2px] bg-black rounded-[0.3rem] flex items-center justify-center">
              <Image src="/logo.png" alt="Everchess Logo" width={56} height={56} className="relative z-10" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Coming Soon!</h3>
          <p className="text-muted-foreground mb-4">
            Everchess is currently in development.       
          </p>
          <Button onClick={onClose} className="bg-red-600 text-white hover:bg-red-700">
            Got it!
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const [showComingSoon, setShowComingSoon] = useState(false)

  return (
    <div className="flex min-h-screen flex-col bg-background-800">
      <header className="sticky top-0 z-40 flex flex-col bg-background-800">
        <div className="flex h-16 items-center border-b border-transparent bg-background-800 px-4 md:px-6">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative h-10 w-10 rounded-md overflow-hidden">
                <div className="absolute inset-0 rainbow-gradient animate-spin-slow"></div>
                <div className="absolute inset-[2px] bg-black rounded-[0.3rem] flex items-center justify-center">
                  <Image src="/logo.png" alt="Everchess Logo" width={40} height={40} className="relative z-10" />
                </div>
              </div>
              <span className="text-xl font-bold text-white">EVERCHESS</span>
            </div>

            <nav className="hidden md:flex md:items-center md:gap-6">
              <Link href="#features" className="text-sm font-medium text-white hover:text-everchess-cyan">
                Features
              </Link>
              <div className="h-4 w-px bg-gray-600/50"></div>
              <Link href="#chess-sets" className="text-sm font-medium text-white hover:text-everchess-cyan">
                Chess Sets
              </Link>
              <div className="h-4 w-px bg-gray-600/50"></div>
              <Link href="#battlepass" className="text-sm font-medium text-white hover:text-everchess-cyan">
                Battlepass
              </Link>
              <div className="h-4 w-px bg-gray-600/50"></div>
              <Link href="#community" className="text-sm font-medium text-white hover:text-everchess-cyan">
                Community
              </Link>
              <div className="h-4 w-px bg-gray-600/50"></div>
              <Link href="#win-to-earn" className="text-sm font-medium text-white hover:text-everchess-cyan">
                Win-To-Earn
              </Link>
              <div className="h-4 w-px bg-gray-600/50"></div>
              <Link href="#web3" className="text-sm font-medium text-white hover:text-everchess-cyan">
                Web3
              </Link>
              <div className="h-4 w-px bg-gray-600/50"></div>
              <Link href="#ready-to-play" className="text-sm font-medium text-white hover:text-everchess-cyan">
                Play Now
              </Link>
            </nav>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                className="text-white hover:bg-background-800"
                onClick={() => setShowComingSoon(true)}
              >
                Log In
              </Button>
              <Button className="bg-red-600 text-white hover:bg-red-700" onClick={() => setShowComingSoon(true)}>
                Sign Up
              </Button>
            </div>
          </div>
        </div>
        <div className="gradient-line w-full"></div>
      </header>

      <main className="flex-1">
        <section className="relative overflow-hidden py-12 md:py-32 bg-background-900">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="hero-title text-2xl font-bold tracking-tighter text-white sm:text-4xl md:text-5xl xl:text-6xl/none whitespace-nowrap">
                    ANCIENT MADE MODERN
                  </h1>
                  <h2 className="hero-subtitle text-[1.6rem] font-bold tracking-tighter text-white sm:text-3xl md:text-4xl xl:text-5xl/none whitespace-nowrap">
                    A Gamified Chess Experience.
                  </h2>
                  <p className="max-w-[600px] text-muted-foreground font-serif md:text-xl">
                    Experience chess like never before. Everchess is a next-gen gamified chess app that combines
                    traditional gameplay with modern features. Available soon on Web, iOS, and Android.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button
                    variant="outline"
                    className="border-yellow-500 text-white hover:bg-yellow-500/10"
                    onClick={() => setShowComingSoon(true)}
                  >
                    Get Started
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button className="bg-red-600 text-white hover:bg-red-700" onClick={() => setShowComingSoon(true)}>
                    Play Now
                    <Gamepad2 className="ml-2 h-6 w-6" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="flex items-center justify-center">
                  <div className="relative w-[320px] h-[320px] rounded-xl overflow-hidden">
                    <div className="absolute inset-[-20px] rainbow-gradient animate-spin-slow"></div>
                    <div className="absolute inset-[4px] bg-black rounded-lg flex items-center justify-center">
                      <Image
                        src="/logo.png"
                        alt="Everchess Logo"
                        width={280}
                        height={280}
                        className="object-contain relative z-10"
                        priority
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="flex justify-center w-full">
          <div className="w-[80%] h-px bg-gradient-to-r from-transparent via-white/70 to-transparent"></div>
        </div>

        <section id="features" className="py-12 md:py-24 bg-background-800">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter text-white sm:text-4xl md:text-5xl">
                  Modern Gamified Features
                </h2>
                <p className="max-w-[900px] text-muted-foreground font-serif md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Everchess combines traditional chess with modern gaming elements for an unparalleled experience.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500/10">
                  <Zap className="h-8 w-8 text-yellow-500" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white">Levels | XP Missions</h3>
                  <p className="text-muted-foreground font-serif">
                    Level up your account by playing chess and completing XP missions to earn rewards.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-everchess-cyan/10">
                  <Image src="/chess-pawn-blue.png" alt="Chess Pawn" width={48} height={48} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white">3D Gameplay</h3>
                  <p className="text-muted-foreground font-serif">
                    Collect 3D chess sets and play with them on Everchess by purchasing them or earning them through the
                    battlepass.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-600/10">
                  <Star className="h-8 w-8 text-red-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white">Battlepass Rewards</h3>
                  <p className="text-muted-foreground font-serif">
                    Earn exclusive chess sets, coins, emotes, and more through our seasonal battlepass.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="flex justify-center w-full">
          <div className="w-[80%] h-px bg-gradient-to-r from-transparent via-white/70 to-transparent"></div>
        </div>

        <section id="chess-sets" className="py-12 md:py-24 bg-background-800">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter text-white sm:text-4xl md:text-5xl">
                    Collect 3D Chess Sets
                  </h2>
                  <p className="max-w-[600px] text-muted-foreground font-serif md:text-xl">
                    Customize your gameplay experience with unique 3D chess sets. From classic designs to fantasy-themed
                    pieces, express your style on the board.
                  </p>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-yellow-500/20">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-yellow-500"
                      >
                        <path
                          d="M5 12L10 17L20 7"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <span className="text-white">Build a collection of 3D Chess Sets</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-yellow-500/20">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-yellow-500"
                      >
                        <path
                          d="M5 12L10 17L20 7"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <span className="text-white">Earn sets through the battlepass</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-yellow-500/20">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-yellow-500"
                      >
                        <path
                          d="M5 12L10 17L20 7"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <span className="text-white">Purchase your favorite chess sets</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-yellow-500/20">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-yellow-500"
                      >
                        <path
                          d="M5 12L10 17L20 7"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <span className="text-white">Play with all your 3D chess sets</span>
                  </li>
                </ul>
                <div>
                  <Button className="bg-red-600 text-white hover:bg-red-700" onClick={() => setShowComingSoon(true)}>
                    Browse Chess Sets
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative h-[400px] w-full max-w-[500px] overflow-hidden rounded-xl bg-background-700 border border-gray-700/50 hover:border-everchess-cyan/30 transition-all duration-300">
                  <div className="absolute inset-0 flex flex-col">
                    <div className="p-6">
                      <div className="flex items-center gap-2">
                        <Image src="/chess-pawn-yellow.png" alt="Chess Pawn" width={32} height={32} />
                        <h3 className="text-xl font-bold text-white">Chess Set Collection</h3>
                      </div>
                    </div>
                    <div className="flex-1 flex items-center justify-center">
                      <div className="grid grid-cols-3 gap-3 w-full max-w-[90%] mx-auto h-full">
                        <div className="flex flex-col items-center justify-center rounded-md bg-background-800 p-4 h-full">
                          <Image
                            src="/chess-pawn-blue.png"
                            alt="Classic Chess Set"
                            width={64}
                            height={64}
                            className="mb-3"
                            style={{
                              filter: "sepia(100%) saturate(300%) brightness(70%) hue-rotate(320deg)",
                            }}
                          />
                          <span className="text-sm text-muted-foreground font-serif">Classic</span>
                        </div>
                        <div className="flex flex-col items-center justify-center rounded-md bg-background-800 p-4 h-full">
                          <Image
                            src="/chess-pawn-blue.png"
                            alt="Futuristic Chess Set"
                            width={64}
                            height={64}
                            className="mb-3"
                          />
                          <span className="text-sm text-muted-foreground font-serif">Futuristic</span>
                        </div>
                        <div className="flex flex-col items-center justify-center rounded-md bg-background-800 p-4 h-full">
                          <Image
                            src="/chess-pawn-red.png"
                            alt="Fantasy Chess Set"
                            width={64}
                            height={64}
                            className="mb-3"
                          />
                          <span className="text-sm text-muted-foreground font-serif">Fantasy</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <Button
                        className="w-full bg-red-600 text-white hover:bg-red-700"
                        onClick={() => setShowComingSoon(true)}
                      >
                        View All Sets
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="flex justify-center w-full">
          <div className="w-[80%] h-px bg-gradient-to-r from-transparent via-white/70 to-transparent"></div>
        </div>

        <section id="battlepass" className="py-12 md:py-24 bg-background-800">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter text-white sm:text-4xl md:text-5xl">
                    Seasonal Battlepass
                  </h2>
                  <p className="max-w-[600px] text-muted-foreground font-serif md:text-xl">
                    Progress through tiers to unlock exclusive rewards, chess sets, and more. Each season brings new
                    content and challenges.
                  </p>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-yellow-500/20">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-yellow-500"
                      >
                        <path
                          d="M5 12L10 17L20 7"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <span className="text-white">Exclusive chess piece designs</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-yellow-500/20">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-yellow-500"
                      >
                        <path
                          d="M5 12L10 17L20 7"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <span className="text-white">Animated emotes and reactions</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-yellow-500/20">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-yellow-500"
                      >
                        <path
                          d="M5 12L10 17L20 7"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <span className="text-white">Profile customization options</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-yellow-500/20">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-yellow-500"
                      >
                        <path
                          d="M5 12L10 17L20 7"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <span className="text-white">In-game currency rewards</span>
                  </li>
                </ul>
                <div>
                  <Button className="bg-red-600 text-white hover:bg-red-700" onClick={() => setShowComingSoon(true)}>
                    Join and Play Now
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative h-[500px] w-full max-w-[500px] overflow-hidden rounded-xl bg-background-700 border border-gray-700/50 hover:border-everchess-cyan/30 transition-all duration-300">
                  <div className="absolute inset-0 flex flex-col p-6">
                    <div className="flex items-center gap-2">
                      <Star className="h-6 w-6 text-yellow-500" />
                      <h3 className="text-xl font-bold text-white">Season 1 Battlepass</h3>
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground font-serif">Tier 24</span>
                        <span className="text-muted-foreground font-serif">24/100</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-background-800">
                        <div className="h-full w-[24%] bg-everchess-cyan" />
                      </div>
                      <div className="text-right text-xs text-muted-foreground font-serif">210/250 XP</div>
                    </div>

                    <div className="flex-1 flex items-center justify-center my-8">
                      <div className="gift-box h-32 w-32 bg-red-900/50 rounded-lg flex items-center justify-center">
                        <svg
                          width="80"
                          height="80"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="text-red-500"
                        >
                          <path
                            d="M20 12V22H4V12"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M22 7H2V12H22V7Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M12 22V7"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M12 7H7.5C6.83696 7 6.20107 6.73661 5.73223 6.26777C5.26339 5 5 5.16304 5 4.5C5 3.83696 5.26339 3.20107 5.73223 2.73223C6.20107 2.26339 6.83696 2 7.5 2C11 2 12 7 12 7Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M12 7H16.5C17.163 7 17.7989 6.73661 18.2678 6.26777C18.7366 5.79893 19 5.16304 19 4.5C19 3.83696 18.7366 3.20107 18.2678 2.73223C17.7989 2.26339 17.163 2 16.5 2C13 2 12 7 12 7Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="flex flex-col items-center justify-center py-4 px-2 rounded-md bg-background-800">
                        <svg
                          width="32"
                          height="32"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="text-yellow-500 mb-2"
                        >
                          <path
                            d="M16 2H8L2 8L12 22L22 8L16 2Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M2 8H22"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M8 2L12 22"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M16 2L12 22"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <span className="text-xs text-muted-foreground font-serif">App Coin</span>
                      </div>
                      <div className="flex flex-col items-center justify-center py-4 px-2 rounded-md bg-background-800">
                        <div className="flex items-center justify-center h-12 mb-2">
                          <Image
                            src="/chess-pawn-blue.png"
                            alt="Chess Set"
                            width={48}
                            height={48}
                            className="object-contain"
                          />
                        </div>
                        <span className="text-xs text-muted-foreground font-serif">Chess Set</span>
                      </div>
                      <div className="flex flex-col items-center justify-center py-4 px-2 rounded-md bg-background-800">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="32"
                          height="32"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-red-500 mb-2"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                          <line x1="9" y1="9" x2="9.01" y2="9" />
                          <line x1="15" y1="9" x2="15.01" y2="9" />
                        </svg>
                        <span className="text-xs text-muted-foreground font-serif">Emote</span>
                      </div>
                    </div>

                    <Button
                      className="w-full bg-red-600 text-white hover:bg-red-700"
                      onClick={() => setShowComingSoon(true)}
                    >
                      Start Earning Rewards
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="flex justify-center w-full">
          <div className="w-[80%] h-px bg-gradient-to-r from-transparent via-white/70 to-transparent"></div>
        </div>

        <section id="community" className="py-12 md:py-24 bg-background-800">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter text-white sm:text-4xl md:text-5xl">
                  Join Our Community
                </h2>
                <p className="max-w-[900px] text-muted-foreground font-serif md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Connect with players worldwide, participate in tournaments, and improve your chess skills.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500/10">
                  <Trophy className="h-8 w-8 text-yellow-500" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white">Standard Elo Ranking</h3>
                  <p className="text-muted-foreground font-serif">
                    Advance your ranking in regular matches and tournaments with players of all skill levels.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-everchess-cyan/10">
                  <Globe className="h-8 w-8 text-everchess-cyan" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white">Global Community</h3>
                  <p className="text-muted-foreground font-serif">
                    Connect with chess players from around the world and make new friends.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-600/10">
                  <Users className="h-8 w-8 text-red-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white">Play with Friends</h3>
                  <p className="text-muted-foreground font-serif">
                    Invite friends to custom games and challenge them to friendly matches.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="flex justify-center w-full">
          <div className="w-[80%] h-px bg-gradient-to-r from-transparent via-white/70 to-transparent"></div>
        </div>

        <section id="win-to-earn" className="py-12 md:py-24 bg-background-800">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter text-white sm:text-4xl md:text-5xl">
                    Win-To-Earn
                  </h2>
                  <p className="max-w-[600px] text-muted-foreground font-serif md:text-xl">
                    Compete in wagers and tournaments to earn rewards. Everchess offers a unique economy powered by an
                    in-app currency with plans to integrate USDC rewards in the future.
                  </p>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-yellow-500/20">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-yellow-500"
                      >
                        <path
                          d="M5 12L10 17L20 7"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <span className="text-white">Wager on matches with other players</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-yellow-500/20">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-yellow-500"
                      >
                        <path
                          d="M5 12L10 17L20 7"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <span className="text-white">Join paid tournaments with prize pools</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-yellow-500/20">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-yellow-500"
                      >
                        <path
                          d="M5 12L10 17L20 7"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <span className="text-white">Spend earnings in the app marketplace</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-yellow-500/20">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-yellow-500"
                      >
                        <path
                          d="M5 12L10 17L20 7"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <span className="text-white">USDC integration coming in the future</span>
                  </li>
                </ul>
                <div>
                  <Button className="bg-red-600 text-white hover:bg-red-700" onClick={() => setShowComingSoon(true)}>
                    Learn More
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative h-[400px] w-full max-w-[500px] overflow-hidden rounded-xl bg-background-700 border border-gray-700/50 hover:border-everchess-cyan/30 transition-all duration-300">
                  <div className="absolute inset-0 flex flex-col">
                    <div className="p-6">
                      <div className="flex items-center gap-2">
                        <Wallet className="h-6 w-6 text-yellow-500" />
                        <h3 className="text-xl font-bold text-white">Everchess Economy</h3>
                      </div>
                    </div>
                    <div className="flex-1 flex items-center justify-center">
                      <div className="flex flex-col items-center justify-center space-y-6">
                        <div className="h-24 w-24 rounded-full bg-yellow-500/20 flex items-center justify-center">
                          <svg
                            width="64"
                            height="64"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="text-yellow-500"
                          >
                            <path
                              d="M16 2H8L2 8L12 22L22 8L16 2Z"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M2 8H22"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M8 2L12 22"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path d="M16 2L12 22" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                        <div className="text-center">
                          <h4 className="text-lg font-bold text-white">In-Game Currency</h4>
                          <p className="text-sm text-muted-foreground font-serif">
                            Earn, wager, and spend in the Everchess ecosystem
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <Button
                        className="w-full bg-red-600 text-white hover:bg-red-700"
                        onClick={() => setShowComingSoon(true)}
                      >
                        Start Earning Now
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="flex justify-center w-full">
          <div className="w-[80%] h-px bg-gradient-to-r from-transparent via-white/70 to-transparent"></div>
        </div>

        <section id="web3" className="py-12 md:py-24 bg-background-800">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter text-white sm:text-4xl md:text-5xl">
                    Web3 Integration
                  </h2>
                  <p className="max-w-[600px] text-muted-foreground font-serif md:text-xl">
                    Everchess embraces web3 technology to provide unique ownership and value rewarding features.
                  </p>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-yellow-500/20">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-yellow-500"
                      >
                        <path
                          d="M5 12L10 17L20 7"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <span className="text-white">NFT chess sets with true ownership</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-yellow-500/20">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-yellow-500"
                      >
                        <path
                          d="M5 12L10 17L20 7"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <span className="text-white">Staking functionalities with benefits</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-yellow-500/20">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-yellow-500"
                      >
                        <path
                          d="M5 12L10 17L20 7"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <span className="text-white">Future USDC integration for rewards</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-yellow-500/20">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-yellow-500"
                      >
                        <path
                          d="M5 12L10 17L20 7"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <span className="text-white">Enhancing the Everchess experience</span>
                  </li>
                </ul>
                <div>
                  <Button className="bg-primary text-white hover:bg-primary/90" onClick={() => setShowComingSoon(true)}>
                    Explore Web3 Features
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative h-[400px] w-full max-w-[500px] overflow-hidden rounded-xl bg-background-700 border border-gray-700/50 hover:border-everchess-cyan/30 transition-all duration-300">
                  <div className="absolute inset-0 flex flex-col">
                    <div className="p-6">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          <Image
                            src="/solana-new-logo.png"
                            alt="Solana Logo"
                            width={28}
                            height={28}
                            className="h-7 w-7 mr-2"
                          />
                          <div className="flex items-center">
                            <span className="text-xl font-bold text-white mr-2">Powered by</span>
                            <div className="h-4">
                              <img
                                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/solanaWordMark-agrCfgqsJ1ULfV0Gp1ooUacbv0x4Eh.svg"
                                alt="Solana"
                                className="h-full"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 flex items-center justify-center">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <div className="h-44 w-52 rounded-lg flex items-center justify-center overflow-hidden">
                          <Image
                            src="/solana-new-logo.png"
                            alt="Solana Logo"
                            width={640}
                            height={640}
                            className="object-contain"
                          />
                        </div>
                        <div className="text-center">
                          <h4 className="text-lg font-bold text-white">Only Possible On Solana</h4>
                          <p className="text-sm text-muted-foreground font-serif">
                            Secure, fast, and user-friendly blockchain features
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <Button
                        className="w-full bg-primary text-white hover:bg-primary/90"
                        onClick={() => setShowComingSoon(true)}
                      >
                        Connect Wallet
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="flex justify-center w-full">
          <div className="w-[80%] h-px bg-gradient-to-r from-transparent via-white/70 to-transparent"></div>
        </div>

        <section id="app-demo" className="py-12 md:py-24 bg-background-800">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-8">
              <div className="space-y-2 text-center">
                <h2 className="text-3xl font-bold tracking-tighter text-white sm:text-4xl md:text-5xl">{"Everchess Hackathon Presentation"}</h2>
                <p className="max-w-[900px] text-muted-foreground font-serif md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  {"Diving into my story as the founder, the Everchess origins story,  and the overall vision as we scale."} 
                </p>
              </div>

              <div className="w-full max-w-4xl">
                <div className="relative aspect-video rounded-xl overflow-hidden bg-background-700 border border-gray-700/50 transition-all duration-300">
                  <iframe
                    className="w-full h-full"
                    src="https://www.youtube.com/embed/017bI0IzN_c"
                    title="Everchess App Demo"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="flex justify-center w-full">
          <div className="w-[80%] h-px bg-gradient-to-r from-transparent via-white/70 to-transparent"></div>
        </div>

        <section id="ready-to-play" className="py-12 md:py-24 bg-background-900">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter text-white sm:text-4xl md:text-5xl">
                  Ready to Play?
                </h2>
                <p className="max-w-[900px] text-muted-foreground font-serif md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Enter Everchess and start playing below.
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <div className="w-full flex justify-center">
                    <div className="w-full flex justify-center">
                      <Button
                        className="bg-primary text-white hover:bg-primary/90 w-full h-[40px]"
                        onClick={() => setShowComingSoon(true)}
                      >
                        Create Account
                      </Button>
                    </div>
                  </div>
                  <div className="w-full flex justify-center">
                    <div className="rainbow-button-wrapper w-full">
                      <Button
                        className="bg-black text-white hover:bg-black border-0 relative z-10 w-[calc(100%-5px)] h-[40px]"
                        onClick={() => setShowComingSoon(true)}
                      >
                        Start Playing Now
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4 min-[400px]:flex-row justify-center">
                  <div className="w-full max-w-[176px] mx-auto">
                    <a href="#" className="w-full block">
                      <div className="flex items-center justify-center h-[50px] border border-transparent">
                        <img
                          alt="Download on the App Store"
                          loading="lazy"
                          width="160"
                          height="48"
                          decoding="async"
                          data-nimg="1"
                          className="object-contain"
                          src="https://blobs.vusercontent.net/blob/download-on-the-app-store-apple-logo-svgrepo-com-syr0TI6UMjmDh6RLTTNUwf2ya8tr1V.svg"
                          style={{ color: "transparent" }}
                        />
                      </div>
                    </a>
                  </div>
                  <div className="w-full max-w-[176px] mx-auto">
                    <a href="#" className="w-full block">
                      <div className="flex items-center justify-center h-[50px] border border-transparent">
                        <img
                          alt="Get it on Google Play"
                          loading="lazy"
                          width="160"
                          height="48"
                          decoding="async"
                          data-nimg="1"
                          className="object-contain"
                          src="https://blobs.vusercontent.net/blob/google-play-badge-logo-svgrepo-com%20%281%29-wdKOMAnrQ7SpwY0HN6vGXyKbh8UDrX.svg"
                          style={{ color: "transparent" }}
                        />
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <ComingSoonModal isOpen={showComingSoon} onClose={() => setShowComingSoon(false)} />
    </div>
  )
}
