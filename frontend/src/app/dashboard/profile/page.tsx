'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Ticket, LogOut, User, Settings, Calendar, TrendingUp, DollarSign, Activity, Plus, Eye, Edit, ArrowLeft, Mail, Phone, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import NotificationBell from '@/components/NotificationBell'

interface UserData {
  id?: string
  email?: string
  firstName?: string
  lastName?: string
  name?: string
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const init = async () => {
      const userData = localStorage.getItem('user')
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData)
          setUser(parsedUser)
        } catch (error) {
          console.error('Error parsing user data:', error)
        }
      }

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
          localStorage.removeItem('user')
          router.push('/auth/login')
          return
        }
      } catch (e) {
        console.error('Failed to fetch profile:', e)
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

  const displayName = (() => {
    const first = (user?.firstName || (user as any)?.first_name)?.trim()
    if (first) return first
    const combined = (user?.name || (user as any)?.fullName || (user as any)?.username || '').toString().trim()
    if (combined) return combined.split(' ')[0]
    return 'User'
  })()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    )
  }

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
              <NotificationBell
                count={typeof window !== 'undefined' ? Number(localStorage.getItem('unreadCount') || '0') : 0}
                onClick={() => handleNavigation('/dashboard/notifications')}
              />
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
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => handleNavigation('/dashboard')}
              className="text-gray-600 hover:text-green-600"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Profile Settings</h2>
              <p className="text-gray-600 mt-1">Manage your account information</p>
            </div>
            <Button 
              variant="outline"
              className="text-green-600 border-green-200 hover:bg-green-50"
              onClick={() => handleNavigation('/dashboard/settings')}
            >
              <Settings className="h-4 w-4 mr-2" />
              Account Settings
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
              <div className="text-center">
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-full p-6 w-28 h-28 mx-auto mb-6 flex items-center justify-center shadow-lg">
                  <User className="h-14 w-14 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3 capitalize">{displayName}</h3>
                <div className="mb-6 flex justify-center">
                  <p className="text-gray-600 text-sm">{user?.email}</p>
                </div>
                <div className="space-y-3">
                  <Button 
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                    onClick={() => handleNavigation('/dashboard/profile/edit')}
                  >
                    <Edit className="h-5 w-5 mr-2" />
                    Edit Profile
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 py-3 rounded-xl"
                    onClick={() => handleNavigation('/dashboard/settings')}
                  >
                    <Settings className="h-5 w-5 mr-2" />
                    Account Settings
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Information */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Profile Information</h3>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <User className="h-4 w-4 text-gray-400 mr-3" />
                      <span className="text-gray-900">{user?.firstName || 'Not provided'}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <User className="h-4 w-4 text-gray-400 mr-3" />
                      <span className="text-gray-900">{user?.lastName || 'Not provided'}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <Mail className="h-4 w-4 text-gray-400 mr-3" />
                    <span className="text-gray-900">{user?.email}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <Phone className="h-4 w-4 text-gray-400 mr-3" />
                      <span className="text-gray-500">Not provided</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <MapPin className="h-4 w-4 text-gray-400 mr-3" />
                      <span className="text-gray-500">Not provided</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Stats */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mt-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Account Statistics</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <Calendar className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">0</p>
                  <p className="text-sm text-gray-600">Events Created</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <Ticket className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">0</p>
                  <p className="text-sm text-gray-600">Tickets Sold</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-xl">
                  <DollarSign className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">$0</p>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
