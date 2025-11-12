'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToken } from '@/lib/token'

export default function HomePage() {
  const router = useRouter()
  const accessToken = useToken((s) => s.accessToken)

  // If user is logged in, redirect to dashboard
  useEffect(() => {
    if (accessToken) {
      router.replace('/dashboard')
    }
  }, [accessToken, router])

  if (accessToken) {
    // while redirecting, show nothing
    return null
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <Card className="w-[450px] shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Welcome to Boardy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            A simple Kanban board built for learning full-stack architecture.
          </p>

          <div className="flex flex-col space-y-3">
            <Button asChild className="w-full">
              {/* Using asChild props allows shadcn Button to act as a Link */}
              <Link href="/login">Go to Login</Link>
            </Button>

            <Button asChild variant="outline" className="w-full">
              <Link href="/register">Go to Register</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
