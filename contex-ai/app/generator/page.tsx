"use client";

import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { ChatInterface } from "@/components/chat-interface"
import { SidebarProvider } from "@/components/ui/sidebar"

export default function Home() {
  return (
    <div className="bg-gradient-to-br from-purple-800 to-black">
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <DashboardSidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <DashboardHeader />
            <main className="flex-1 overflow-y-auto flex flex-col">
              <div className="flex-1 min-h-[100%]">
                <ChatInterface />
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </div>
  )
}

