"use client"

import { SignInButton } from "@clerk/nextjs"
import { useAuth } from "@clerk/nextjs"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function SignIn() {
  const { isSignedIn } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isSignedIn) {
      router.push("/generator")
    }
  }, [isSignedIn, router])

  if (isSignedIn) {
    return null
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-800 to-black">
      <div className="rounded-lg bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-2xl font-bold text-center text-gray-800">Welcome to Contex</h1>
        <div className="space-y-4">
          <SignInButton>
            <button className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50">
              <Image src="/google.svg" alt="Google" width={20} height={20} />
              <span>Continue with Google</span>
            </button>
          </SignInButton>

          <SignInButton>
            <button className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50">
              <Image src="/microsoft.svg" alt="Microsoft" width={20} height={20} />
              <span>Continue with Microsoft</span>
            </button>
          </SignInButton>

          <SignInButton>
            <button className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50">
              <Image src="/github.svg" alt="GitHub" width={20} height={20} />
              <span>Continue with GitHub</span>
            </button>
          </SignInButton>
        </div>
      </div>
    </div>
  )
}
