// import type React from "react";
// import "./globals.css";
// import type { Metadata } from "next";
// import { Inter } from "next/font/google";
// import { AgentProcessor } from "@/components/ai-agent/AgentProcessor";
// import { AgentCursor } from "@/components/ai-agent/AgentCursor";
// import { AgentChatButton } from "@/components/ai-agent/AgentChatButton";

// const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "Contex - AI-Friendly React Components",
//   description: "Generate AI agent-friendly React components with ease",
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en" className="dark">
//       <body className={`${inter.className} bg-gray-900 text-gray-100`}>
//         {children}
//         <AgentProcessor />
//         <AgentCursor />
//         <AgentChatButton />
//       </body>
//     </html>
//   );
// }

// app/layout.tsx
import type { Metadata } from "next"
import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { AgentProcessor } from "@/components/ai-agent/AgentProcessor"
import { AgentCursor } from "@/components/ai-agent/AgentCursor"
import { AgentChatButton } from "@/components/ai-agent/AgentChatButton"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Contex - AI-Friendly React Components",
  description: "Generate AI agent-friendly React components with ease",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        {/* Optionally replicate the style tag you had before, 
            for overflow-x and max-width, etc. */}
        <style>{`
          :root, body {
            overflow-x: hidden;
            max-width: 100vw;
            width: 100vw;
          }
        `}</style>
      </head>

      <body
        className={`
          ${inter.className} 
          bg-gray-900 
          text-gray-100 
          min-h-screen 
          w-full 
          overflow-x-hidden 
          !m-0 
          !p-0 
          flex 
          flex-row
        `}
      >
        {/* The theme provider from your generator layout */}
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <main className="flex-1 w-full overflow-x-hidden">
            {children}
          </main>
        </ThemeProvider>

        {/* The AI agent components from your root layout */}
        <AgentProcessor />
        <AgentCursor />
        <AgentChatButton />
      </body>
    </html>
  )
}
