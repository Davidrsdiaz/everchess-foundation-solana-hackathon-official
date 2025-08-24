"use client"

import type React from "react"

import { Header } from "@/components/header"
import { Sidebar, SidebarContent, SidebarHeader } from "@/components/sidebar/sidebar"
import { SidebarProvider } from "@/components/sidebar/sidebar-provider"
import { EverchessSidebarNav } from "@/components/sidebar/sidebar-nav"
import { UserProfile } from "@/components/user-profile"
import { QueueProvider } from "@/contexts/queue-context"
import { QueueTimer } from "@/components/queue-timer"
import Link from "next/link"
import Image from "next/image"
import { StatusProvider } from "@/contexts/status-context"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <QueueProvider>
      <StatusProvider>
        <SidebarProvider>
          <div className="flex min-h-screen flex-col bg-background-875">
            <div className="sticky top-0 z-40 bg-background-800 border-b border-gray-800/30">
              <Header className="border-b-0" />
              <div className="gradient-line w-full"></div>
            </div>
            <div className="flex flex-1">
              <Sidebar>
                <SidebarHeader>
                  <Link href="/" className="flex items-center gap-2">
                    <div className="relative h-8 w-8 rounded-md overflow-hidden">
                      <div className="rainbow-gradient absolute inset-0 animate-spin-slow"></div>
                      <div className="absolute inset-[2px] bg-black rounded-[0.3rem] flex items-center justify-center">
                        <Image src="/logo.png" alt="Everchess Logo" width={32} height={32} className="relative z-10" />
                      </div>
                    </div>
                    <span className="font-bold text-white">EVERCHESS</span>
                  </Link>
                </SidebarHeader>
                <SidebarContent className="px-2 py-4">
                  <UserProfile />
                  <div className="mt-4">
                    <EverchessSidebarNav />
                  </div>
                </SidebarContent>
              </Sidebar>
              <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
            </div>
            <QueueTimer />
          </div>
        </SidebarProvider>
      </StatusProvider>
    </QueueProvider>
  )
}
