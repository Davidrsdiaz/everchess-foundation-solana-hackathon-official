"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Bell,
  Menu,
  ChevronDown,
  User,
  Settings,
  Wallet,
  LogOut,
  MessageSquare,
  X,
  Clock,
  Users,
  Check,
  Gamepad2,
  UserPlus,
  Send,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/sidebar/sidebar"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { useIsMobile } from "@/hooks/use-mobile"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { useQueue } from "@/contexts/queue-context"
import { WalletModal } from "@/components/auth/wallet-modal"
import { SettingsModal } from "@/components/auth/settings-modal"
import { useStatus } from "@/contexts/status-context"
import { useAuth } from "@/contexts/auth-context"

interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  notificationCount?: number
  cartCount?: number
  userImage?: string
}

export function Header({ notificationCount = 3, cartCount = 5, userImage, className, ...props }: HeaderProps) {
  const { user, logout } = useAuth()
  const username = user?.username || "Guest"
  const isMobile = useIsMobile()
  const [isOpen, setIsOpen] = useState(false)
  const [notificationOpen, setNotificationOpen] = useState(false)
  const [showFriendSearch, setShowFriendSearch] = useState(false)
  const [friendUsername, setFriendUsername] = useState("")
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [activeTab, setActiveTab] = useState("chat")
  const bellRef = useRef<HTMLButtonElement>(null)
  const sidebarRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const notificationContentRef = useRef<HTMLDivElement>(null)
  const timerPositionRef = useRef<HTMLDivElement>(null)
  const { queueStatus } = useQueue()
  const [showWalletModal, setShowWalletModal] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const { statusColor } = useStatus()

  // CSS-only animation approach - no animation state in React
  const mobileNotificationRef = useRef(false)
  const hasAnimatedRef = useRef(false)

  // Toggle notification panel
  const toggleNotification = useCallback(() => {
    if (isMobile) {
      if (notificationOpen) {
        // Closing animation handled by CSS transition
        setNotificationOpen(false)
      } else {
        // Opening - set state first, animation handled by CSS
        setNotificationOpen(true)
      }
    } else {
      // For desktop, just toggle
      setNotificationOpen(!notificationOpen)
    }
  }, [isMobile, notificationOpen])

  // Toggle friend search bar
  const toggleFriendSearch = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent event from bubbling up
    setShowFriendSearch(!showFriendSearch)
    setShowSuccessMessage(false)
    // Focus the input when search bar appears
    if (!showFriendSearch) {
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 100)
    }
  }

  // Handle sending friend request
  const handleSendFriendRequest = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation() // Prevent event from bubbling up

    if (friendUsername.trim()) {
      // Here you would typically make an API call to send the friend request
      console.log(`Sending friend request to: ${friendUsername}`)

      // Show success message and reset
      setShowSuccessMessage(true)
      setFriendUsername("")

      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccessMessage(false)
      }, 3000)
    }
  }

  // Close friend search when tab changes
  useEffect(() => {
    setShowFriendSearch(false)
    setShowSuccessMessage(false)
  }, [activeTab])

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationOpen &&
        !isMobile &&
        bellRef.current &&
        !bellRef.current.contains(event.target as Node) &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setNotificationOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [notificationOpen, isMobile])

  // Add CSS to document head for animation
  useEffect(() => {
    // Create a style element for our custom animation CSS
    const styleEl = document.createElement("style")
    styleEl.innerHTML = `
      .mobile-notification-enter {
        transform: translateY(-100%);
        transition: transform 300ms ease-out;
      }
      .mobile-notification-enter-active {
        transform: translateY(0);
      }
      .mobile-notification-exit {
        transform: translateY(0);
        transition: transform 300ms ease-out;
      }
      .mobile-notification-exit-active {
        transform: translateY(-100%);
      }
      
      @keyframes queueTimerAppear {
        0% {
          opacity: 0;
          transform: scale(0.5);
        }
        100% {
          opacity: 1;
          transform: scale(1);
        }
      }
      
      @keyframes fadeIn {
        from { opacity: 0; transform: scale(0.9); }
        to { opacity: 1; transform: scale(1); }
      }
      
      @keyframes pulse-glow {
        0% { box-shadow: 0 0 8px rgba(0, 182, 255, 0.5); }
        50% { box-shadow: 0 0 18px rgba(0, 182, 255, 0.7); }
        100% { box-shadow: 0 0 8px rgba(0, 182, 255, 0.5); }
      }
      
      .queue-timer-header {
        animation: pulse-glow 2s infinite ease-in-out;
      }
    `
    document.head.appendChild(styleEl)

    return () => {
      document.head.removeChild(styleEl)
    }
  }, [])

  // Custom notification content component that doesn't close the sheet
  const NotificationContent = () => {
    // Local state for tabs to prevent affecting parent state
    const [localActiveTab, setLocalActiveTab] = useState(activeTab)

    // Update parent state when local state changes
    useEffect(() => {
      setActiveTab(localActiveTab)
    }, [localActiveTab])

    return (
      <div className="relative" ref={notificationContentRef}>
        <div className="w-full">
          {/* Custom tabs implementation to avoid shadcn/ui Tabs component issues */}
          <div className="grid w-full grid-cols-3 bg-background-900 rounded-none">
            <button
              className={cn(
                "py-2 flex items-center justify-center transition-colors",
                localActiveTab === "invites"
                  ? "bg-red-600 text-white"
                  : "text-muted-foreground hover:bg-background-700 hover:text-white",
              )}
              onClick={(e) => {
                e.stopPropagation()
                setLocalActiveTab("invites")
              }}
            >
              <Gamepad2 className="h-5 w-5" />
            </button>
            <button
              className={cn(
                "py-2 flex items-center justify-center transition-colors",
                localActiveTab === "chat"
                  ? "bg-red-600 text-white"
                  : "text-muted-foreground hover:bg-background-700 hover:text-white",
              )}
              onClick={(e) => {
                e.stopPropagation()
                setLocalActiveTab("chat")
              }}
            >
              <MessageSquare className="h-5 w-5" />
            </button>
            <button
              className={cn(
                "py-2 flex items-center justify-center transition-colors",
                localActiveTab === "friends"
                  ? "bg-red-600 text-white"
                  : "text-muted-foreground hover:bg-background-700 hover:text-white",
              )}
              onClick={(e) => {
                e.stopPropagation()
                setLocalActiveTab("friends")
              }}
            >
              <Users className="h-5 w-5" />
            </button>
          </div>

          {/* Game Invites Tab Content */}
          {localActiveTab === "invites" && (
            <div className="p-3 border-b border-gray-700">
              <h4 className="text-sm font-medium text-white mb-2">Game Invites</h4>
              <div className="space-y-3 max-h-[300px] overflow-y-auto">
                <div className="p-3 hover:bg-background-700 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8 border border-gray-700">
                        <AvatarImage src="/male-avatar.svg" />
                        <AvatarFallback className="bg-background-900">CM</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-white">ChessMaster99</p>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>10 min | Ranked</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0 text-red-500 hover:text-red-400 hover:bg-gray-700/50 rounded-sm"
                      >
                        <X className="h-5 w-5" />
                        <span className="sr-only">Decline</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0 text-green-500 hover:text-green-400 hover:bg-gray-700/50 rounded-sm"
                      >
                        <Check className="h-5 w-5" />
                        <span className="sr-only">Accept</span>
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="p-3 hover:bg-background-700 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8 border border-gray-700">
                        <AvatarImage src="/male-avatar.svg" />
                        <AvatarFallback className="bg-background-900">QK</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-white">QueenKnight42</p>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>5 min | Casual</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0 text-red-500 hover:text-red-400 hover:bg-gray-700/50 rounded-sm"
                      >
                        <X className="h-5 w-5" />
                        <span className="sr-only">Decline</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0 text-green-500 hover:text-green-400 hover:bg-gray-700/50 rounded-sm"
                      >
                        <Check className="h-5 w-5" />
                        <span className="sr-only">Accept</span>
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="p-3 hover:bg-background-700 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8 border border-gray-700">
                        <AvatarImage src="/male-avatar.svg" />
                        <AvatarFallback className="bg-background-900">RK</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-white">RookMaster</p>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>15 min | Tournament</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0 text-red-500 hover:text-red-400 hover:bg-gray-700/50 rounded-sm"
                      >
                        <X className="h-5 w-5" />
                        <span className="sr-only">Decline</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0 text-green-500 hover:text-green-400 hover:bg-gray-700/50 rounded-sm"
                      >
                        <Check className="h-5 w-5" />
                        <span className="sr-only">Accept</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Chat Tab Content */}
          {localActiveTab === "chat" && (
            <div className="p-3 border-b border-gray-700">
              <h4 className="text-sm font-medium text-white mb-2">Chats</h4>
              <div className="max-h-[300px] overflow-y-auto">
                {/* Recent chats */}
                <div className="flex items-center gap-3 p-3 hover:bg-background-700 cursor-pointer transition-colors">
                  <Avatar className="h-10 w-10 border border-gray-700">
                    <AvatarImage src="/male-avatar.svg" />
                    <AvatarFallback className="bg-background-900">CM</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium text-white truncate">ChessMaster99</p>
                      <span className="text-xs text-muted-foreground">2m</span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">Good game! Want to play again?</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 hover:bg-background-700 cursor-pointer transition-colors">
                  <Avatar className="h-10 w-10 border border-gray-700">
                    <AvatarImage src="/male-avatar.svg" />
                    <AvatarFallback className="bg-background-900">QK</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium text-white truncate">QueenKnight42</p>
                      <span className="text-xs text-muted-foreground">1h</span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">Let's join the tournament tomorrow!</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 hover:bg-background-700 cursor-pointer transition-colors">
                  <Avatar className="h-10 w-10 border border-gray-700">
                    <AvatarImage src="/male-avatar.svg" />
                    <AvatarFallback className="bg-background-900">BP</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium text-white truncate">BishopPro</p>
                      <span className="text-xs text-muted-foreground">1d</span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">Thanks for the tips on my opening!</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Friends Tab Content */}
          {localActiveTab === "friends" && (
            <>
              <div className="p-3 border-b border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  {showFriendSearch ? (
                    <div className="flex-1 relative">
                      <Input
                        ref={searchInputRef}
                        placeholder="Search for username"
                        className="pl-3 pr-10 bg-background-900 border-gray-700 focus-visible:ring-everchess-cyan text-white"
                        value={friendUsername}
                        onChange={(e) => setFriendUsername(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSendFriendRequest()
                        }}
                      />
                      <div className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 flex items-center justify-center">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0 text-white hover:text-white hover:brightness-125 hover:bg-gray-700/50 rounded-sm"
                          onClick={(e) => handleSendFriendRequest(e)}
                        >
                          <Send className="h-4 w-4 transform rotate-45 -translate-x-0.5" />
                          <span className="sr-only">Send Friend Request</span>
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <h4 className="text-sm font-medium text-white">Friend Requests</h4>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 w-7 p-0 text-white hover:text-white hover:brightness-125 hover:bg-gray-700/50 rounded-sm ml-2 flex-shrink-0"
                    onClick={toggleFriendSearch}
                  >
                    {showFriendSearch ? <X className="h-5 w-5" /> : <UserPlus className="h-5 w-5" />}
                    <span className="sr-only">{showFriendSearch ? "Cancel" : "Add Friend"}</span>
                  </Button>
                </div>

                {showSuccessMessage && (
                  <div className="mb-3 p-2 bg-green-900/30 border border-green-700 rounded-md text-xs text-green-400 flex items-center">
                    <Check className="h-3 w-3 mr-1" />
                    Friend request sent successfully!
                  </div>
                )}

                <div className="space-y-2 max-h-[120px] overflow-y-auto">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8 border border-gray-700">
                        <AvatarImage src="/male-avatar.svg" />
                        <AvatarFallback className="bg-background-900">RK</AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-white">RookMaster</span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0 text-red-500 hover:text-red-400 hover:bg-gray-700/50 rounded-sm"
                      >
                        <X className="h-5 w-5" />
                        <span className="sr-only">Ignore</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0 text-green-500 hover:text-green-400 hover:bg-gray-700/50 rounded-sm"
                      >
                        <Check className="h-5 w-5" />
                        <span className="sr-only">Accept</span>
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8 border border-gray-700">
                        <AvatarImage src="/male-avatar.svg" />
                        <AvatarFallback className="bg-background-900">KN</AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-white">KnightRider</span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0 text-red-500 hover:text-red-400 hover:bg-gray-700/50 rounded-sm"
                      >
                        <X className="h-5 w-5" />
                        <span className="sr-only">Ignore</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0 text-green-500 hover:text-green-400 hover:bg-gray-700/50 rounded-sm"
                      >
                        <Check className="h-5 w-5" />
                        <span className="sr-only">Accept</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3">
                <h4 className="text-sm font-medium text-white mb-2">Online Friends</h4>
                <div className="space-y-2 max-h-[120px] overflow-y-auto">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Avatar className="h-8 w-8 border border-gray-700">
                          <AvatarImage src="/male-avatar.svg" />
                          <AvatarFallback className="bg-background-900">CM</AvatarFallback>
                        </Avatar>
                        <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-green-500 ring-1 ring-background-800"></span>
                      </div>
                      <span className="text-sm text-white">ChessMaster99</span>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 w-7 p-0 text-white hover:text-white hover:brightness-125 hover:bg-gray-700/50 rounded-sm"
                    >
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Avatar className="h-8 w-8 border border-gray-700">
                          <AvatarImage src="/male-avatar.svg" />
                          <AvatarFallback className="bg-background-900">QK</AvatarFallback>
                        </Avatar>
                        <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-green-500 ring-1 ring-background-800"></span>
                      </div>
                      <span className="text-sm text-white">QueenKnight42</span>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 w-7 p-0 text-white hover:text-white hover:brightness-125 hover:bg-gray-700/50 rounded-sm"
                    >
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Close button for mobile view */}
        {isMobile && (
          <Button
            size="sm"
            variant="ghost"
            className="absolute right-1 top-0.5 z-10 h-6 w-6 p-0 text-white opacity-70 hover:opacity-100"
            onClick={() => setNotificationOpen(false)}
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </Button>
        )}
      </div>
    )
  }

  return (
    <header
      className={cn(
        "flex h-14 items-center border-b border-transparent bg-background-800 px-4 relative z-50",
        className,
      )}
      {...props}
    >
      {isMobile && (
        <SidebarTrigger className="mr-2">
          <Menu className="h-6 w-6 text-white" />
          <span className="sr-only">Toggle sidebar</span>
        </SidebarTrigger>
      )}

      <div className="flex flex-1 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative h-8 w-8 rounded-md overflow-hidden">
            <div className="absolute inset-0 rainbow-gradient animate-spin-slow"></div>
            <div className="absolute inset-[2px] bg-black rounded-[0.3rem] flex items-center justify-center">
              <Image src="/logo.png" alt="Everchess Logo" width={32} height={32} className="relative z-10" />
            </div>
          </div>
          <span className="font-bold text-white">EVERCHESS</span>
        </Link>

        <div className="flex-1" />

        <div className={`flex items-center ${isMobile ? "gap-2" : "gap-3"} relative`}>
          {/* Dedicated container for the queue timer - update with proper positioning */}
          <div
            id="header-queue-timer-container"
            className={`flex items-center relative ${
              queueStatus?.active ? (isMobile ? "mr-0" : "mr-2") : "mr-0"
            } transition-all duration-300`}
          ></div>

          {/* Bell button for both mobile and desktop */}
          <Button
            ref={bellRef}
            variant="ghost"
            size="icon"
            className="relative text-white"
            onClick={toggleNotification}
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            {notificationCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -right-1 -top-1 h-5 w-5 rounded-full flex items-center justify-center text-xs"
              >
                {notificationCount}
              </Badge>
            )}
          </Button>

          <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 px-2 text-white hover:bg-transparent focus:bg-transparent active:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
              >
                <div className="relative">
                  <Avatar className="h-8 w-8 border-2 border-primary">
                    <AvatarImage src="/male-avatar.svg" alt={username} />
                    <AvatarFallback className="bg-[#FFD700] text-white">{username.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div
                    className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full ${statusColor} ring-1 ring-background-800`}
                    aria-label={`Status indicator`}
                  />
                </div>
                {!isMobile && (
                  <>
                    <span className="text-sm font-medium">{username}</span>
                    <ChevronDown className="h-4 w-4" />
                  </>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault()
                  setIsOpen(false)
                  setShowSettingsModal(true)
                }}
              >
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault()
                  setShowWalletModal(true)
                }}
              >
                <Wallet className="mr-2 h-4 w-4" />
                <span>Wallet</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => logout()}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile notification panel with CSS-only animation */}
      {isMobile && (
        <div
          className="fixed inset-0 z-50 bg-background-800 overflow-auto"
          style={{
            transform: notificationOpen ? "translateY(0)" : "translateY(-100%)",
            transition: "transform 300ms ease-out",
            visibility: notificationOpen ? "visible" : "hidden",
          }}
        >
          <NotificationContent />
        </div>
      )}

      {/* Right side panel for desktop */}
      {!isMobile && notificationOpen && (
        <>
          {/* Overlay */}
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setNotificationOpen(false)} />

          {/* Side panel */}
          <div
            ref={sidebarRef}
            className={cn(
              "fixed top-0 right-0 h-full w-80 bg-background-800 border-l border-gray-700 z-50 transition-transform duration-300 ease-in-out",
              notificationOpen ? "translate-x-0" : "translate-x-full",
            )}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <h2 className="text-lg font-semibold text-white">Notifications</h2>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-background-700"
                onClick={() => setNotificationOpen(false)}
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
            <div className="h-[calc(100%-60px)] overflow-y-auto">
              <NotificationContent />
            </div>
          </div>
        </>
      )}
      {showWalletModal && <WalletModal onClose={() => setShowWalletModal(false)} />}
      {showSettingsModal && <SettingsModal onClose={() => setShowSettingsModal(false)} />}
    </header>
  )
}
