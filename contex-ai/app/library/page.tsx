"use client";

import { useState } from "react";
import { AgentButton } from "@/components/agent-ui/AgentButton";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AgentChart } from "@/components/agent-ui/AgentChart";
import { AgentSwitch } from "@/components/agent-ui/AgentSwitch";
import { Copy, LayoutGrid } from "lucide-react";
import { LibrarySidebar } from "@/components/library-sidebar";
import { DashboardHeader } from "@/components/dashboard-header";
import { AgentNavigationMenu } from "@/components/agent-ui/AgentNavMenu";

const components = [
  {
    name: "Button",
    code: `<Button className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded-md">Click Me</Button>`,
  },
  {
    name: "Card",
    code: `<Card className="p-6 border border-gray-700 bg-gray-900 text-white">This is a card.</Card>`,
  },
  {
    name: "Input",
    code: `<Input className="p-2 bg-gray-800 text-white border border-gray-700 rounded-md" placeholder="Type here..." />`,
  },
  {
    name: "Chart",
    code: `<AgentChart controlId="demo-chart" className="w-full h-80 col-span-2" />`,
  },
  {
    name: "Toggle",
    code: `<AgentSwitch controlId="demo-toggle" className="" />`,
  },
  {
    name: "Navigation Menu",
    code: `<AgentNavigationMenu controlId="demo-nav-menu" className="" />`,
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
                  <Button
                    variant="ghost"
                    onClick={() => handleCopy(component.code, component.name)}
                    className="text-gray-400 hover:text-white"
                  >
                    <Copy className="h-5 w-5" />
                  </Button>
                </div>
                <div className="p-4 bg-gray-800 rounded-md">
                  {component.name === "Button" && <AgentButton controlId="demo-button" className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded-md">Click Me</AgentButton>}
                  {component.name === "Card" && <Card className="p-6 border border-gray-700 bg-gray-900 text-white">This is a card.</Card>}
                  {component.name === "Input" && <Input className="p-2 bg-gray-800 text-white border border-gray-700 rounded-md" placeholder="Type here..." />}
                  {component.name === "Chart" && <AgentChart controlId="demo-chart" className="w-full h-80 lg:col-span-2" />}
                  {component.name === "Toggle" && <AgentSwitch controlId="demo-toggle" className="" />}
                  {component.name === "Navigation Menu" && <AgentNavigationMenu controlId="demo-nav-menu" className="" />}
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
