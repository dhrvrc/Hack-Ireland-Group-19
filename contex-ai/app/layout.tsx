import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"

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
    <html lang="en" className="dark">
      <ClerkProvider>
        <body className={`${inter.className} bg-gray-900 text-gray-100`}>{children}</body>
      </ClerkProvider>
    </html>
  )
}

