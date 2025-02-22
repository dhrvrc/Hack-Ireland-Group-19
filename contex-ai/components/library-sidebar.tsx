"use client";

import Link from "next/link";
import { Book, Code, Layers, LayoutGrid } from "lucide-react";

export function LibrarySidebar() {
  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen p-6 border-r border-gray-800">
      <h2 className="text-lg font-semibold mb-6">Component Library</h2>
      <nav className="space-y-4">
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
