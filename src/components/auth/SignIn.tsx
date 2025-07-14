'use client'

import { signIn, signOut, useSession } from 'next-auth/react'

export default function SignIn() {
  const { data: session, status } = useSession()

  if (status === 'loading') return <p>Loading...</p>

  if (session) {
    return (
      <div className="flex items-center space-x-4">
        <img 
          src={session.user?.image || ''} 
          alt="Profile" 
          className="w-8 h-8 rounded-full"
        />
        <span>Welcome, {session.user?.name}</span>
        <button
          onClick={() => signOut()}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Sign Out
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => signIn('google')}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      Sign in with Google
    </button>
  )
}