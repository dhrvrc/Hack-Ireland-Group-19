"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AgentButton } from "@/components/agent-ui/AgentButton";

export default function Home() {
  const router = useRouter();
  return (
    <div
      className="min-h-screen text-white flex flex-col justify-center items-center p-4 relative"
      style={{
        background:
          "radial-gradient(circle, rgba(0,0,0,0.9) 0%, rgba(25,0,51,0.9) 100%), url('/path/to/dots.png')",
        backgroundSize: "cover",
      }}
    >
      <main className="max-w-4xl w-full space-y-8 text-center">
        <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          Contex
        </h1>
        <p className="text-xl mb-8">
          Create AI agent-friendly React components with ease
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-8">
          <div className="text-center">
            {/* <Link
              href="/generator"
              className="block px-12 py-8 text-2xl font-semibold rounded-xl bg-gradient-to-r from-purple-300 to-pink-400 hover:from-purple-400 hover:to-pink-500 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105"
            >
              <span>Generate</span>
              <p className="mt-2 text-lg">
                Generate React components that are AI agent-friendly.
              </p>
            </Link> */}
            <AgentButton
              controlId="generator-button"
              className="block px-12 py-8 text-2xl font-semibold rounded-xl bg-gradient-to-r from-purple-300 to-pink-400 hover:from-purple-400 hover:to-pink-500 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105"
              onUniversalClick={() => {
                console.log("Clicked library button!");
                router.push("/generator");
              }}
            >
              Generator
            </AgentButton>
          </div>
          <div className="text-center">
            {/* <Link
              href="/library"
              className="block px-12 py-8 text-2xl font-semibold rounded-xl bg-gradient-to-r from-purple-300 to-pink-400 hover:from-purple-400 hover:to-pink-500 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105"
            >
              <span>Library</span>
              <p className="mt-2 text-lg">Access a library of AI agent-friendly components.</p>
            </Link> */}
            <AgentButton
              controlId="library-button"
              className="block px-12 py-8 text-2xl font-semibold rounded-xl bg-gradient-to-r from-purple-300 to-pink-400 hover:from-purple-400 hover:to-pink-500 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105"
              onUniversalClick={() => {
                console.log("Clicked library button!");
                router.push("/library");
              }}
            >
              Library
            </AgentButton>
          </div>
        </div>
      </main>
      <footer className="mt-16 text-gray-500">
        © 2023 Contex. All rights reserved.
      </footer>
    </div>
  );
}
