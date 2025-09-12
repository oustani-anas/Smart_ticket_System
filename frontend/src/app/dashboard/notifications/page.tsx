'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Ticket, LogOut, User, Settings, Bell, Calendar, TrendingUp, DollarSign, Activity, Plus, Eye, Edit, ArrowLeft, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import NotificationBell from '@/components/NotificationBell'

interface UserData {
  id?: string
  email?: string
  firstName?: string
  lastName?: string
  name?: string
}

interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  timestamp: string
  read: boolean
}

export default function NotificationsPage() {
  const [user, setUser] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Welcome to SmartT!',
      message: 'Your account has been successfully created. Start by creating your first event.',
      type: 'success',
      timestamp: 'Just now',
      read: false
    },
    {
      id: '2',
      title: 'Account Setup Complete',
      message: 'Your profile is ready. You can now start managing events and selling tickets.',
      type: 'info',
      timestamp: '2 minutes ago',
      read: false
    },
    {
      id: '3',
      title: 'Getting Started Guide',
      message: 'Check out our getting started guide to learn how to create and manage events effectively.',
      type: 'info',
      timestamp: '5 minutes ago',
      read: true
    }
  ])
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

  const markAsRead = (id: string) => {
    setNotifications(prev => {
      const next = prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
      const remaining = next.filter(n => !n.read).length
      try { localStorage.setItem('unreadCount', String(remaining)) } catch {}
      return next
    })
  }

  const markAllAsRead = () => {
    setNotifications(prev => {
      const next = prev.map(notification => ({ ...notification, read: true }))
      try { localStorage.setItem('unreadCount', '0') } catch {}
      return next
    })
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => {
      const next = prev.filter(notification => notification.id !== id)
      const remaining = next.filter(n => !n.read).length
      try { localStorage.setItem('unreadCount', String(remaining)) } catch {}
      return next
    })
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <Check className="h-5 w-5 text-green-600" />
      case 'warning':
        return <Bell className="h-5 w-5 text-yellow-600" />
      case 'error':
        return <X className="h-5 w-5 text-red-600" />
      default:
        return <Bell className="h-5 w-5 text-blue-600" />
    }
  }

  const getNotificationBg = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200'
      case 'error':
        return 'bg-red-50 border-red-200'
      default:
        return 'bg-blue-50 border-blue-200'
    }
  }

  const displayName = (() => {
    const first = (user?.firstName || (user as any)?.first_name)?.trim()
    if (first) return first
    const combined = (user?.name || (user as any)?.fullName || (user as any)?.username || '').toString().trim()
    if (combined) return combined.split(' ')[0]
    return 'User'
  })()

  const unreadCount = notifications.filter(n => !n.read).length

  // Persist unread count whenever it changes
  useEffect(() => {
    try { localStorage.setItem('unreadCount', String(unreadCount)) } catch {}
  }, [unreadCount])

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
                active
                count={unreadCount}
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
              <h2 className="text-3xl font-bold text-gray-900">Notifications</h2>
              <p className="text-gray-600 mt-1">
                {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
              </p>
            </div>
            {unreadCount > 0 && (
              <Button 
                variant="outline"
                className="text-green-600 border-green-200 hover:bg-green-50"
                onClick={markAllAsRead}
              >
                <Check className="h-4 w-4 mr-2" />
                Mark All Read
              </Button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white rounded-2xl p-6 shadow-lg border transition-all duration-300 ${
                notification.read 
                  ? 'border-gray-100 opacity-75' 
                  : `${getNotificationBg(notification.type)} border-2`
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className={`rounded-full p-2 ${getNotificationBg(notification.type)}`}>
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className={`font-semibold ${notification.read ? 'text-gray-600' : 'text-gray-900'}`}>
                        {notification.title}
                      </h3>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      )}
                    </div>
                    <p className={`text-sm ${notification.read ? 'text-gray-500' : 'text-gray-700'} mb-2`}>
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-400">{notification.timestamp}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  {!notification.read && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-green-600 hover:text-green-700 hover:bg-green-50"
                      onClick={() => markAsRead(notification.id)}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-gray-400 hover:text-red-600 hover:bg-red-50"
                    onClick={() => deleteNotification(notification.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {notifications.length === 0 && (
            <div className="bg-white rounded-2xl p-12 shadow-lg border border-gray-100">
              <div className="text-center">
                <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No notifications</h3>
                <p className="text-gray-600">You're all caught up! New notifications will appear here.</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
