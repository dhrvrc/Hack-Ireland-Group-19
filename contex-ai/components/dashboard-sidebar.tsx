"use client";

import Link from "next/link";
import { Home, Folder, Plus, LayoutGrid, Clipboard } from "lucide-react";
import { AgentButton } from "./agent-ui/AgentButton";
import { useRouter } from "next/navigation";


export function DashboardSidebar() {
  const router = useRouter();
  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen p-6 border-r border-gray-800">
      <h2 className="text-lg font-semibold mb-6">Dashboard</h2>
      <nav className="space-y-4">
        <AgentButton
            size="lg"
            controlId="home-button"
            onUniversalClick={() => router.push("/")}
            className="flex text-md items-center bg-purple-800 space-x-2 p-3 rounded-lg transition"
        >
          <Home className="h-5 w-5 text-purple-400" />
          Home
        </AgentButton>
        <Link href="/dashboard" className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-800 transition">
          <LayoutGrid className="h-5 w-5 text-purple-400" />
          <span>Overview</span>
        </Link>
        <Link href="/dashboard/projects" className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-800 transition">
          <Folder className="h-5 w-5 text-purple-400" />
          <span>Projects</span>
        </Link>
        <Link href="/dashboard/tasks" className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-800 transition">
          <Clipboard className="h-5 w-5 text-purple-400" />
          <span>Tasks</span>
        </Link>
        <Link href="/dashboard/new" className="flex items-center space-x-2 p-3 rounded-lg hover:bg-purple-800 transition">
          <Plus className="h-5 w-5 text-white" />
          <span>New Project</span>
        </Link>
      </nav>
    </aside>
  );
}
