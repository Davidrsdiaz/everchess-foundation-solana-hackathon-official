"use client"

import type * as React from "react"
import { cn } from "@/lib/utils"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { useSidebar } from "./sidebar-provider"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: "left" | "right"
  collapsible?: "offcanvas" | "icon" | "none"
}

export function Sidebar({ side = "left", collapsible = "offcanvas", className, children, ...props }: SidebarProps) {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar()
  const sidebarWidth = "16rem"
  const sidebarWidthCollapsed = "4rem"

  if (collapsible === "none") {
    return (
      <div className={cn("flex h-full w-64 flex-col bg-background-875 text-white", className)} {...props}>
        {children}
      </div>
    )
  }

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile}>
        <SheetContent side={side} className="w-64 border-r-0 bg-background-800 p-0 text-white">
          <div className="flex h-full w-full flex-col bg-background-800">{children}</div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <div
      className="group peer hidden md:block"
      data-state={state}
      data-collapsible={state === "collapsed" ? collapsible : ""}
      data-side={side}
    >
      {/* This handles the sidebar gap on desktop */}
      <div
        className={cn(
          "relative h-screen w-64 bg-background-800 transition-all duration-300 ease-in-out",
          "group-data-[collapsible=offcanvas]:w-0",
          "group-data-[collapsible=icon]:w-16",
        )}
        style={{
          width: state === "collapsed" ? (collapsible === "icon" ? sidebarWidthCollapsed : "0px") : sidebarWidth,
        }}
      />
      <div
        className={cn(
          "fixed inset-y-0 z-30 hidden h-screen w-64 flex-col bg-background-800 transition-all duration-300 ease-in-out md:flex",
          side === "left"
            ? "left-0 border-r border-border group-data-[collapsible=offcanvas]:left-[-16rem]"
            : "right-0 border-l border-border group-data-[collapsible=offcanvas]:right-[-16rem]",
          "group-data-[collapsible=icon]:w-16",
          className,
        )}
        style={{
          width: state === "collapsed" && collapsible === "icon" ? sidebarWidthCollapsed : sidebarWidth,
        }}
        {...props}
      >
        <div className="flex h-full w-full flex-col bg-background-800">{children}</div>
      </div>
    </div>
  )
}

export function SidebarHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex h-14 items-center border-b border-border px-4", className)} {...props} />
}

export function SidebarContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex-1 overflow-auto", className)} {...props} />
}

export function SidebarFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex items-center border-t border-border p-4", className)} {...props} />
}

export function SidebarTrigger({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { toggleSidebar } = useSidebar()

  return (
    <button
      type="button"
      onClick={toggleSidebar}
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-md text-white hover:bg-accent",
        className,
      )}
      {...props}
    />
  )
}
