import type React from "react"
import "../globals.css";
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "AI-Native Component Dashboard",
  description: "Create AI-native components for web applications",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
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
          min-h-screen 
          w-screen
          max-w-screen
          overflow-x-hidden
          !m-0 
          !p-0 
          bg-background
          flex
          flex-row
        `}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <main className="flex-1 w-full max-w-full">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}

