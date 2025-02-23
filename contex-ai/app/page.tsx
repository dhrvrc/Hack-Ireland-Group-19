"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AgentButton } from "@/components/agent-ui/AgentButton";
import { useAuth, SignOutButton } from "@clerk/nextjs"

export default function Home() {
  const router = useRouter();
  const { isSignedIn } = useAuth()
  return (
    <div
      className="min-h-screen text-white flex flex-col justify-center items-center p-4 relative"
      style={{
        background: "radial-gradient(circle, rgba(0,0,0,0.4) 0%, rgba(25,0,51,0.4) 100%), url('/path/to/dots.png')",
        backgroundSize: "cover",
      }}
    >
      {/* Auth Button */}
      <div className="absolute top-4 right-4">
        {isSignedIn ? (
          <SignOutButton>
            <button className="block px-12 py-12 pb-24 text-lg font-semibold rounded-lg bg-gray-800 hover:bg-gray-700 transition-all duration-300 shadow-md hover:shadow-lg">
              Sign Out
            </button>
          </SignOutButton>
        ) : (
          <Link
            href="/signin"
            className="px-6 py-2 text-lg font-semibold rounded-lg bg-gray-800 hover:bg-gray-700 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Sign In
          </Link>
        )}
      </div>

      {/* Main Content */}
      <main className="max-w-4xl w-full space-y-8 text-center">
        <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          Contex
        </h1>
        <p className="text-xl mb-8">
          Create AI agent-friendly React components with ease
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-8">
          <div className="text-center">
            <AgentButton
              controlId="generator-button"
              className="block px-12 py-12 pb-24 text-2xl font-semibold rounded-xl bg-gradient-to-r from-purple-300 to-pink-400 hover:from-purple-400 hover:to-pink-500 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105"
              onUniversalClick={() => {
                console.log("Clicked library button!");
                router.push("/generator");
              }}
            >
              Generator
              <p className="mt-2 text-lg">
                Generate React components that are AI agent-friendly.
              </p>
            </AgentButton>
          </div>
          <div className="text-center">
            <AgentButton
              controlId="library-button"
              className="block px-12 py-12 pb-24 text-2xl font-semibold rounded-xl bg-gradient-to-r from-purple-300 to-pink-400 hover:from-purple-400 hover:to-pink-500 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105"
              onUniversalClick={() => {
                console.log("Clicked library button!");
                router.push("/library");
              }}
            >
              <span>Library</span>
              <p className="mt-2 text-lg">Access a library of AI agent-friendly components.</p>
            </AgentButton>
          </div>
        </div>
      </main>
      <footer className="mt-16 text-gray-500">
        © 2025 Contex. All rights reserved.
      </footer>
    </div>
  );
}