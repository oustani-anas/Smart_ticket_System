'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Ticket, LogOut, User, Settings, Bell, Calendar, TrendingUp, DollarSign, Activity, Plus, Eye, Edit } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface UserData {
  id?: string
  email?: string
  firstName?: string
  lastName?: string
  name?: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const init = async () => {
      // Try localStorage first for instant paint
      const userData = localStorage.getItem('user')
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData)
          setUser(parsedUser)
        } catch (error) {
          console.error('Error parsing user data:', error)
        }
      }

      // Always verify session via cookie-backed endpoint
      try {
        const res = await fetch('http://localhost:4000/user/profile', {
          method: 'GET',
          credentials: 'include',
        })
        if (res.ok) {
          const me = await res.json()
          const raw = me?.user || me
          if (raw) {
            const normalized = {
              id: raw.id || raw.sub,
              email: raw.email,
              firstName: raw.firstName || raw.firstname,
              lastName: raw.lastName || raw.lastname,
              name: raw.name,
            }
            setUser(normalized)
            localStorage.setItem('user', JSON.stringify(normalized))
          }
        } else if (res.status === 401) {
          // Not authenticated
          localStorage.removeItem('user')
          router.push('/auth/login')
          return
        }
      } catch (error) {
        console.error('Failed to verify session:', error)
      } finally {
        setIsLoading(false)
      }
    }

    init()
  }, [router])

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:4000/auth/logout', {
        method: 'GET',
        credentials: 'include',
      })
    } catch (e) {
      console.error('Logout error:', e)
    } finally {
      localStorage.removeItem('user')
      router.push('/auth/login')
    }
  }

  const handleNavigation = (path: string) => {
    router.push(path)
  }

  const handleStatsClick = (type: string) => {
    switch (type) {
      case 'tickets':
        handleNavigation('/dashboard/tickets')
        break
      case 'events':
        handleNavigation('/dashboard/events')
        break
      case 'revenue':
        handleNavigation('/dashboard/analytics')
        break
      case 'activity':
        handleNavigation('/dashboard/activity')
        break
      default:
        break
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    )
  }

  const displayName = (() => {
    const first = (user?.firstName || (user as any)?.first_name)?.trim()
    if (first) return first

    const combined = (user?.name || (user as any)?.fullName || (user as any)?.username || '').toString().trim()
    if (combined) return combined.split(' ')[0]

    return 'User'
  })()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
      {/* Enhanced Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-lg border-b border-green-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-2 mr-3 shadow-md">
                <Ticket className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                Smart Ticket
              </h1>
            </div>

            {/* Navigation Menu */}
            <nav className="hidden md:flex items-center space-x-6 md:space-x-8">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-gray-600 hover:text-green-600 hover:bg-green-50 px-4"
                onClick={() => handleNavigation('/dashboard')}
              >
                <Activity className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-gray-600 hover:text-green-600 hover:bg-green-50 px-4"
                onClick={() => handleNavigation('/dashboard/events')}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Events
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-gray-600 hover:text-green-600 hover:bg-green-50 px-4"
                onClick={() => handleNavigation('/dashboard/settings')}
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </nav>

            {/* User Menu */}
            <div className="flex items-center space-x-3">
              <Button 
                variant="ghost" 
                size="sm"
                className="relative text-gray-600 hover:text-green-600 hover:bg-green-50"
                onClick={() => handleNavigation('/dashboard/notifications')}
              >
                <Bell className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                  3
                </span>
              </Button>
              <div 
                className="flex items-center space-x-3 bg-green-50 rounded-full px-3 py-1 cursor-pointer hover:bg-green-100 transition-colors duration-200"
                onClick={() => handleNavigation('/dashboard/profile')}
              >
                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-full p-1.5">
                  <User className="h-3 w-3 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700 hidden sm:block">{displayName}</span>
              </div>
              <Button 
                onClick={handleLogout}
                variant="outline" 
                size="sm"
                className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 ml-6 md:ml-8 px-4"
              >
                <LogOut className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Welcome Section */}
        <div className="relative bg-gradient-to-r from-green-500 via-green-600 to-emerald-600 rounded-3xl p-8 text-white mb-8 overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center mb-3">
                <div className="bg-white/20 rounded-full p-2 mr-3">
                  <Activity className="h-5 w-5" />
                </div>
                <span className="text-green-100 text-sm font-medium">Dashboard Overview</span>
              </div>
              <h2 className="text-4xl font-bold mb-3">
                Welcome back, {displayName}! 
              </h2>
              <p className="text-green-100 text-lg mb-4 max-w-2xl">
                Your event management hub is ready. Create, manage, and track your events with powerful analytics and insights.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button 
                  className="h-12 px-6 rounded-full bg-white text-green-700 hover:bg-green-50 font-semibold shadow-md ring-1 ring-white/60 hover:ring-white transition-all duration-200 inline-flex items-center"
                  onClick={() => handleNavigation('/dashboard/events')}
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Create Event
                </Button>
                <Button 
                  variant="ghost" 
                  className="h-11 px-5 rounded-full border border-white/60 text-white hover:bg-white/10 font-semibold inline-flex items-center backdrop-blur-sm/0"
                  onClick={() => handleNavigation('/dashboard/analytics')}
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Analytics
                </Button>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <Ticket className="h-16 w-16 text-white/80" />
              </div>
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
        </div>

        {/* Interactive Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div 
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:border-green-200 transition-all duration-300 cursor-pointer group"
            onClick={() => handleStatsClick('tickets')}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-3 group-hover:scale-110 transition-transform duration-300">
                <Ticket className="h-6 w-6 text-white" />
              </div>
              <Eye className="h-4 w-4 text-gray-400 group-hover:text-green-500 transition-colors" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Tickets</p>
              <p className="text-3xl font-bold text-gray-900 mb-2">0</p>
              <p className="text-xs text-green-600 font-medium">Click to view details</p>
            </div>
          </div>

          <div 
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:border-green-200 transition-all duration-300 cursor-pointer group"
            onClick={() => handleStatsClick('events')}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-3 group-hover:scale-110 transition-transform duration-300">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <Eye className="h-4 w-4 text-gray-400 group-hover:text-green-500 transition-colors" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Active Events</p>
              <p className="text-3xl font-bold text-gray-900 mb-2">0</p>
              <p className="text-xs text-green-600 font-medium">Click to manage events</p>
            </div>
          </div>

          <div 
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:border-green-200 transition-all duration-300 cursor-pointer group"
            onClick={() => handleStatsClick('activity')}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-3 group-hover:scale-110 transition-transform duration-300">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <Eye className="h-4 w-4 text-gray-400 group-hover:text-green-500 transition-colors" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Tickets Sold</p>
              <p className="text-3xl font-bold text-gray-900 mb-2">0</p>
              <p className="text-xs text-green-600 font-medium">Click to view activity</p>
            </div>
          </div>

          <div 
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:border-green-200 transition-all duration-300 cursor-pointer group"
            onClick={() => handleStatsClick('revenue')}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl p-3 group-hover:scale-110 transition-transform duration-300">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <Eye className="h-4 w-4 text-gray-400 group-hover:text-green-500 transition-colors" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Revenue</p>
              <p className="text-3xl font-bold text-gray-900 mb-2">$0</p>
              <p className="text-xs text-green-600 font-medium">Click to view analytics</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Quick Actions</h3>
            <div className="bg-green-50 rounded-full px-3 py-1">
              <span className="text-sm font-medium text-green-700">Get Started</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              className="h-24 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => handleNavigation('/dashboard/events')}
            >
              <div className="text-center">
                <Plus className="h-6 w-6 mx-auto mb-2" />
                <span className="font-semibold">Create New Event</span>
              </div>
            </Button>
            <Button 
              variant="outline" 
              className="h-24 border-2 border-green-200 hover:border-green-300 hover:bg-green-50 text-green-700 font-semibold transition-all duration-300"
              onClick={() => handleNavigation('/dashboard/tickets')}
            >
              <div className="text-center">
                <Ticket className="h-6 w-6 mx-auto mb-2" />
                <span>Manage Tickets</span>
              </div>
            </Button>
            <Button 
              variant="outline" 
              className="h-24 border-2 border-green-200 hover:border-green-300 hover:bg-green-50 text-green-700 font-semibold transition-all duration-300"
              onClick={() => handleNavigation('/dashboard/settings')}
            >
              <div className="text-center">
                <Settings className="h-6 w-6 mx-auto mb-2" />
                <span>Settings</span>
              </div>
            </Button>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Events */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Upcoming Events</h3>
              <Button 
                variant="ghost" 
                size="sm"
                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                onClick={() => handleNavigation('/dashboard/events')}
              >
                <Eye className="h-4 w-4 mr-2" />
                View All
              </Button>
            </div>
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">Sample Event</h4>
                  <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded-full">
                    Active
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">A sample event to showcase the dashboard</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    Dec 25, 2024
                  </div>
                  <Button size="sm" variant="outline" className="text-green-600 border-green-200 hover:bg-green-50">
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                </div>
              </div>
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">No upcoming events</p>
                <p className="text-sm text-gray-400 mb-4">Create your first event to get started</p>
                <Button 
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => handleNavigation('/dashboard/events')}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Event
                </Button>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Recent Activity</h3>
              <Button 
                variant="ghost" 
                size="sm"
                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                onClick={() => handleNavigation('/dashboard/activity')}
              >
                <Activity className="h-4 w-4 mr-2" />
                View All
              </Button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="bg-green-100 rounded-full p-2 mr-3">
                  <User className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Account created</p>
                  <p className="text-xs text-gray-500">Welcome to SmartT! Your account is ready.</p>
                </div>
                <span className="text-xs text-gray-400">Just now</span>
              </div>
              <div className="text-center py-8">
                <Activity className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">No recent activity</p>
                <p className="text-sm text-gray-400">Your activity will appear here</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
