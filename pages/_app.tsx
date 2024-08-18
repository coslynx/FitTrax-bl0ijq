import type { Metadata } from 'next'
import { SessionProvider } from 'next-auth/react'
import { Session } from 'next-auth/react/types'
import { useState } from 'react'

import { store } from '../store'
import '../styles/global.css'

export const metadata: Metadata = {
  title: 'FitTrax',
  description: 'Your fitness journey starts here.',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [session, setSession] = useState<Session | null>(null)

  return (
    <html lang="en">
      <body>
        <SessionProvider
          session={session}
          onSessionChange={(newSession) => setSession(newSession)}
        >
          <store.Provider>
            <main>{children}</main>
          </store.Provider>
        </SessionProvider>
      </body>
    </html>
  )
}