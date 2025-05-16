"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useSidebar } from "./sidebar-provider"
import { Home, Gamepad2, Star, CastleIcon, Trophy, ShoppingCart, User } from "lucide-react"

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string
    title: string
    icon: React.ElementType
  }[]
}

// Update the SidebarNav component to use red background for active items
export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const pathname = usePathname()
  const { state } = useSidebar()

  return (
    <nav className={cn("flex flex-col gap-1 px-2", className)} {...props}>
      {items.map((item) => {
        const Icon = item.icon
        // Check if the current path matches the nav item, with special handling for home/dashboard
        const isActive =
          pathname === item.href ||
          // Consider both root path and /dashboard as "Home"
          (item.href === "/dashboard" && (pathname === "/" || pathname === "/dashboard"))

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors",
              isActive ? "bg-red-600 text-white" : "text-muted-foreground hover:bg-accent/50 hover:text-white",
              state === "collapsed" && "justify-center px-2",
            )}
          >
            <Icon className="h-5 w-5" />
            {state !== "collapsed" && <span>{item.title}</span>}
          </Link>
        )
      })}
    </nav>
  )
}

// Update the EverchessSidebarNav component to match the menu items in the image
export function EverchessSidebarNav() {
  const items = [
    {
      title: "Home",
      href: "/dashboard",
      icon: Home,
    },
    {
      title: "Play Now",
      href: "/play",
      icon: Gamepad2,
    },
    {
      title: "Chess Sets",
      href: "/chess-sets",
      icon: CastleIcon,
    },
    {
      title: "Battlepass",
      href: "/battlepass",
      icon: Star,
    },
    {
      title: "Ranking",
      href: "/ranking",
      icon: Trophy,
    },
    {
      title: "Market",
      href: "/market",
      icon: ShoppingCart,
    },
    {
      title: "Profile",
      href: "/profile",
      icon: User,
    },
  ]

  return <SidebarNav items={items} />
}
