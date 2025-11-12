'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import Toolbar from '@/components/layout/Toolbar'
import { useToken } from '@/lib/token'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { accessToken } = useToken()

  useEffect(() => {
    if (!accessToken) {
      router.replace('/login')
    }
  }, [accessToken, router])

  if (!accessToken) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-500">
        Redirecting to login...
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Toolbar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  )
}
