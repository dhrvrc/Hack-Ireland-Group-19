"use client";

import Link from "next/link";
import { Home, Book, Code, Layers, LayoutGrid } from "lucide-react";
import { AgentButton } from "./agent-ui/AgentButton";
import { useRouter } from "next/navigation";

export function LibrarySidebar() {
  const router = useRouter();
  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen p-6 border-r border-gray-800">
      <h2 className="text-lg font-semibold mb-6">Component Library</h2>
      <nav className="space-y-4">
        {/* Home Button */}
        <AgentButton
            size="lg"
            controlId="home-button"
            onUniversalClick={() => router.push("/")}
            className="flex bg-transparent text-md items-center space-x-2 p-3 rounded-lg transition hover:bg-transparent"
        >
          <Home className="h-5 w-5 text-purple-400" />
          Home
        </AgentButton>
        <Link href="/library" className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-800 transition">
          <LayoutGrid className="h-5 w-5 text-purple-400" />
          <span>All Components</span>
        </Link>
        <Link href="/library/buttons" className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-800 transition">
          <Code className="h-5 w-5 text-purple-400" />
          <span>Buttons</span>
        </Link>
        <Link href="/library/cards" className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-800 transition">
          <Layers className="h-5 w-5 text-purple-400" />
          <span>Cards</span>
        </Link>
        <Link href="/library/forms" className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-800 transition">
          <Book className="h-5 w-5 text-purple-400" />
          <span>Forms</span>
        </Link>
      </nav>
    </aside>
  );
}
