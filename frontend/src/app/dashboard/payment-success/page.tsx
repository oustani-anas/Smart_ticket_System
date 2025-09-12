'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Ticket, CheckCircle2, Download, Loader2, LogOut, User, Settings, Bell, Calendar, TrendingUp, DollarSign, Activity, Eye, Edit } from 'lucide-react'
import NotificationBell from '@/components/NotificationBell'

export default function PaymentSuccessPage() {
  const router = useRouter()
  const params = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [ticketId, setTicketId] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [unreadCount, setUnreadCount] = useState(0)

  // Check authentication and get user data
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('http://localhost:4000/user/profile', {
          method: 'GET',
          credentials: 'include',
        })

        if (response.ok) {
          const userData = await response.json()
          setUser(userData?.user || userData)
        } else {
          router.push('/auth/login')
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        router.push('/auth/login')
      }
    }

    checkAuth()
  }, [router])

  // Get unread notifications count
  useEffect(() => {
    const storedCount = localStorage.getItem('unreadNotificationsCount')
    if (storedCount !== null) {
      setUnreadCount(parseInt(storedCount, 10))
    }
  }, [])

  useEffect(() => {
    const fetchBySession = async () => {
      const sessionId = params.get('session_id') || params.get('sessionId')
      if (!sessionId) {
        setError('Missing payment information.')
        setLoading(false)
        return
      }

      // Sometimes webhook is a bit behind; poll a couple times
      const maxAttempts = 5
      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          const res = await fetch(`http://localhost:4000/ticket/ticket-id/${sessionId}`, {
            method: 'GET',
            credentials: 'include',
          })
          if (res.ok) {
            const data = await res.json()
            const id = data?.ticketId || data?.id || data?.ticket?.id
            if (id) {
              setTicketId(id)
              setLoading(false)
              return
            }
          }
        } catch {}

        // wait 800ms then retry
        await new Promise(r => setTimeout(r, 800))
      }

      setError('Payment confirmed but ticket is not ready yet. Please try again shortly.')
      setLoading(false)
    }

    fetchBySession()
  }, [params])

  const handleDownload = async () => {
    if (!ticketId) return
    const resp = await fetch(`http://localhost:4000/ticket/${ticketId}/download`, {
      method: 'GET',
      credentials: 'include',
    })
    const blob = await resp.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ticket-${ticketId}.pdf`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:4000/auth/logout', {
        method: 'GET',
        credentials: 'include',
      })
      localStorage.removeItem('user')
      router.push('/auth/login')
    } catch (error) {
      console.error('Logout failed:', error)
      router.push('/auth/login')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Navbar */}
        <nav className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <h1 className="text-xl font-bold text-green-600">Smart Ticket System</h1>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <NotificationBell initialUnreadCount={unreadCount} />
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </nav>
        
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-green-600 mx-auto mb-4" />
            <p className="text-gray-600">Processing your payment...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Navbar */}
        <nav className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <h1 className="text-xl font-bold text-green-600">Smart Ticket System</h1>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <NotificationBell initialUnreadCount={unreadCount} />
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </nav>
        
        <div className="flex items-center justify-center h-96">
          <div className="bg-red-50 border border-red-200 p-8 rounded-2xl max-w-md text-center shadow-lg">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-red-800 mb-2">Payment Error</h2>
            <p className="text-red-700 mb-6">{error}</p>
            <Button onClick={() => router.push('/dashboard/events')} className="bg-red-600 hover:bg-red-700">
              Back to Events
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-blue-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold text-green-600">Smart Ticket System</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <NotificationBell initialUnreadCount={unreadCount} />
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-12">
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 max-w-2xl w-full overflow-hidden">
          {/* Success Header */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 px-8 py-12 text-center">
            <div className="mx-auto mb-6 w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <CheckCircle2 className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Payment Successful!</h1>
            <p className="text-green-100 text-lg">Your ticket has been generated successfully</p>
          </div>

          {/* Ticket Details */}
          <div className="px-8 py-8">
            <div className="bg-gradient-to-r from-gray-50 to-green-50 rounded-2xl p-6 mb-8 border border-gray-200">
              <div className="flex items-center justify-center space-x-4 mb-4">
                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 shadow-lg">
                  <Ticket className="h-8 w-8 text-white" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Ticket ID</p>
                  <p className="text-lg font-bold text-gray-900 font-mono bg-white px-3 py-1 rounded-lg border border-gray-200 mt-1">
                    {ticketId}
                  </p>
                </div>
              </div>
              <div className="text-center">
                <p className="text-gray-600 text-sm">
                  Keep this ticket ID safe. You can download your ticket below.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <Button 
                onClick={handleDownload} 
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-lg font-semibold"
              >
                <Download className="h-5 w-5 mr-3" />
                Download Your Ticket
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => router.push('/dashboard/events')}
                className="w-full border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 py-4 rounded-xl text-lg font-semibold transition-all duration-200"
              >
                <Calendar className="h-5 w-5 mr-3" />
                Back to Events
              </Button>
            </div>

            {/* Additional Info */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500">
                Need help? Contact our support team or visit your dashboard for more options.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


