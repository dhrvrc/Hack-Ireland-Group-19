import type React from "react";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AgentProcessor } from "@/components/ai-agent/AgentProcessor";
import { AgentCursor } from "@/components/ai-agent/AgentCursor";
import { AgentChatButton } from "@/components/ai-agent/AgentChatButton";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Contex - AI-Friendly React Components",
  description: "Generate AI agent-friendly React components with ease",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-gray-900 text-gray-100`}>
        {children}
        <AgentProcessor />
        <AgentCursor />
        <AgentChatButton />
      </body>
    </html>
  );
}
