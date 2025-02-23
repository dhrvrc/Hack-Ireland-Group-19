import Link from "next/link";
import Image from "next/image"; // Import Next.js Image component

export default function Home() {
  return (
    <div
      className="min-h-screen text-white flex flex-col justify-center items-center p-4 relative"
      style={{
        background: "radial-gradient(circle, rgba(0,0,0,0.9) 0%, rgba(25,0,51,0.9) 100%), url('/path/to/dots.png')",
        backgroundSize: "cover",
      }}
    >
      {/* Sign In Button */}
      <div className="absolute top-4 right-4">
        <Link
          href="/signin"
          className="px-6 py-2 text-lg font-semibold rounded-lg bg-gray-800 hover:bg-gray-700 transition-all duration-300 shadow-md hover:shadow-lg"
        >
          Sign In
        </Link>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl w-full space-y-8 text-center">
        <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          Contex
        </h1>
        <p className="text-xl mb-8">Create AI agent-friendly React components with ease</p>
        <div className="flex flex-col sm:flex-row justify-center gap-8">
          <div className="text-center">
            <Link
              href="/generator"
              className="block px-12 py-8 text-2xl font-semibold rounded-xl bg-gradient-to-r from-purple-300 to-pink-400 hover:from-purple-400 hover:to-pink-500 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105"
            >
              <span>Generate</span>
              <p className="mt-2 text-lg">Generate React components that are AI agent-friendly.</p>
            </Link>
          </div>
          <div className="text-center">
            <Link
              href="/library"
              className="block px-12 py-8 text-2xl font-semibold rounded-xl bg-gradient-to-r from-purple-300 to-pink-400 hover:from-purple-400 hover:to-pink-500 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105"
            >
              <span>Library</span>
              <p className="mt-2 text-lg">Access a library of AI agent-friendly components.</p>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 text-gray-500">© 2025 Contex. All rights reserved.</footer>

      {/* GIF in Bottom Right Corner */}
      <div className="absolute bottom-4 right-4 w-32 h-32 pointer-events-none">
        <Image
          src="/cat-gif.gif" // Change this path to your GIF
          alt="Animated AI Assistant"
          layout="fill"
          objectFit="contain" // Keeps transparency intact
          priority
        />
      </div>
    </div>
  );
}
