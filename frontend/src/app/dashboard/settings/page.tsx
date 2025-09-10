'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Ticket, LogOut, User, Settings, Bell, Calendar, TrendingUp, DollarSign, Activity, Plus, Eye, Edit, ArrowLeft, Shield, Palette, Globe, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface UserData {
  id?: string
  email?: string
  firstName?: string
  lastName?: string
  name?: string
}

export default function SettingsPage() {
  const [user, setUser] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
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
        console.error('Auth check failed:', error)
        // Don't redirect on network errors, just use cached data
      }

      setIsLoading(false)
    }

    checkAuth()
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
                className="text-green-600 bg-green-50 px-4"
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
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Settings</h2>
            <p className="text-gray-600 mt-1">Manage your account and application preferences</p>
          </div>
        </div>

        <div className="space-y-8">
          {/* Account Settings */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="bg-green-100 rounded-xl p-3 mr-4">
                <User className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Account Settings</h3>
                <p className="text-gray-600">Manage your personal information and account details</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="h-16 border-green-200 hover:bg-green-50 text-green-700"
                onClick={() => handleNavigation('/dashboard/profile')}
              >
                <div className="text-center">
                  <User className="h-5 w-5 mx-auto mb-2" />
                  <span className="font-medium">Edit Profile</span>
                </div>
              </Button>
              <Button 
                variant="outline" 
                className="h-16 border-green-200 hover:bg-green-50 text-green-700"
                onClick={() => handleNavigation('/dashboard/profile/security')}
              >
                <div className="text-center">
                  <Shield className="h-5 w-5 mx-auto mb-2" />
                  <span className="font-medium">Security</span>
                </div>
              </Button>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="bg-blue-100 rounded-xl p-3 mr-4">
                <Bell className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Notifications</h3>
                <p className="text-gray-600">Control how and when you receive notifications</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Email Notifications</h4>
                  <p className="text-sm text-gray-600">Receive notifications via email</p>
                </div>
                <Button variant="outline" size="sm" className="text-green-600 border-green-200">
                  Enabled
                </Button>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Push Notifications</h4>
                  <p className="text-sm text-gray-600">Receive push notifications in your browser</p>
                </div>
                <Button variant="outline" size="sm" className="text-green-600 border-green-200">
                  Enabled
                </Button>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Event Updates</h4>
                  <p className="text-sm text-gray-600">Get notified about event changes and updates</p>
                </div>
                <Button variant="outline" size="sm" className="text-green-600 border-green-200">
                  Enabled
                </Button>
              </div>
            </div>
          </div>

          {/* Appearance Settings */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="bg-purple-100 rounded-xl p-3 mr-4">
                <Palette className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Appearance</h3>
                <p className="text-gray-600">Customize the look and feel of your dashboard</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Theme</h4>
                  <p className="text-sm text-gray-600">Choose your preferred color scheme</p>
                </div>
                <Button variant="outline" size="sm" className="text-green-600 border-green-200">
                  Light
                </Button>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Language</h4>
                  <p className="text-sm text-gray-600">Select your preferred language</p>
                </div>
                <Button variant="outline" size="sm" className="text-green-600 border-green-200">
                  English
                </Button>
              </div>
            </div>
          </div>

          {/* Privacy & Security */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="bg-red-100 rounded-xl p-3 mr-4">
                <Shield className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Privacy & Security</h3>
                <p className="text-gray-600">Manage your privacy settings and security preferences</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                  <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                </div>
                <Button variant="outline" size="sm" className="text-gray-500 border-gray-200">
                  Disabled
                </Button>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Data Export</h4>
                  <p className="text-sm text-gray-600">Download a copy of your data</p>
                </div>
                <Button variant="outline" size="sm" className="text-green-600 border-green-200">
                  Export
                </Button>
              </div>
              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                <div>
                  <h4 className="font-medium text-red-900">Delete Account</h4>
                  <p className="text-sm text-red-600">Permanently delete your account and all data</p>
                </div>
                <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
