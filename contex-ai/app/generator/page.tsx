import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { ChatInterface } from "@/components/chat-interface"
import { SidebarProvider } from "@/components/ui/sidebar"

export default function Home() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gradient-to-br from-purple-900 to-black">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <DashboardHeader />
          <main className="flex-1 overflow-y-auto flex flex-col">
            <div className="flex-1 min-h-[100%]">
              <ChatInterface />
            </div>
            <div className="border-t border-gray-800 p-4 bg-gray-950/50 min-h-[30%]">
              <h2 className="text-xl font-semibold mb-4">Component Preview</h2>
              <div className="rounded-lg border border-gray-800 bg-gray-950 p-4 h-full">
                {/* Preview content will go here */}
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}

