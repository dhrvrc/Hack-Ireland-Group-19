"use client";

import { useState } from "react";
import { Copy, LayoutGrid } from "lucide-react";
import { LibrarySidebar } from "@/components/library-sidebar";
import { DashboardHeader } from "@/components/dashboard-header";

// Import Agent UI Components
import { AgentButton } from "@/components/agent-ui/AgentButton";
import { AgentCard } from "@/components/agent-ui/AgentCard";
import { AgentInput } from "@/components/agent-ui/AgentInput";

const components = [
  {
    name: "Button",
    code: `<AgentButton className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded-md">Click Me</AgentButton>`,
  },
  {
    name: "Card",
    code: `<AgentCard className="p-6 border border-gray-700 bg-gray-900 text-white">This is a card.</AgentCard>`,
  },
  {
    name: "Input",
    code: `<AgentInput className="p-2 bg-gray-800 text-white border border-gray-700 rounded-md" placeholder="Type here..." />`,
  },
];

export default function LibraryPage() {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (code: string, name: string) => {
    navigator.clipboard.writeText(code);
    setCopied(name);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="bg-gradient-to-br from-purple-900 to-black min-h-screen flex">
      <LibrarySidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 p-6 overflow-y-auto">
          <h1 className="text-3xl font-bold text-white flex items-center">
            <LayoutGrid className="mr-3 h-6 w-6 text-purple-400" />
            Component Library
          </h1>
          <p className="text-gray-300 mt-2 mb-6">Easily copy and use pre-built AI-friendly React components.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {components.map((component) => (
              <div key={component.name} className="bg-gray-900 p-4 rounded-lg border border-gray-800">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-lg font-semibold text-white">{component.name}</h2>
                  <AgentButton
                    controlId="copy-button"
                    variant="ghost"
                    onClick={() => handleCopy(component.code, component.name)}
                    className="text-gray-400 hover:text-white"
                  >
                    <Copy className="h-5 w-5" />
                  </AgentButton>
                </div>
                <div className="p-4 bg-gray-800 rounded-md">
                  {component.name === "Button" && (
                    <AgentButton
                      controlId="demo-button"
                      className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded-md"
                    >
                      Click Me
                    </AgentButton>
                  )}
                  {component.name === "Card" && (
                    <AgentCard
                      controlId="demo-card"
                      className="p-6 border border-gray-700 bg-gray-900 text-white"
                    >
                      This is a card.
                    </AgentCard>
                  )}
                  {component.name === "Input" && (
                    <AgentInput
                      controlId="demo-input"
                      className="p-2 bg-gray-800 text-white border border-gray-700 rounded-md"
                      placeholder="Type here..."
                    />
                  )}
                </div>
                {copied === component.name && <p className="mt-2 text-sm text-green-400">Copied!</p>}
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
