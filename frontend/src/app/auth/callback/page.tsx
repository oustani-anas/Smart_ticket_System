'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function AuthCallbackPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get('token')
      const error = searchParams.get('error')

      console.log('Callback page - Token:', token)
      console.log('Callback page - Error:', error)

      if (error) {
        console.log('Callback page - Error detected:', error)
        setStatus('error')
        setMessage('Authentication failed. Please try again.')
        setTimeout(() => router.push('/auth/login'), 3000)
        return
      }

      if (token) {
        try {
          console.log('Callback page - Attempting to verify session...')
          // The JWT token is already set as an HTTP-only cookie by the backend
          // We just need to verify the session and get user data
          const response = await fetch('http://localhost:4000/user/profile', {
            method: 'GET',
            credentials: 'include',
          })
          
          console.log('Callback page - Profile response status:', response.status)
          console.log('Callback page - Profile response ok:', response.ok)
          
          if (response.ok) {
            const userData = await response.json()
            console.log('Callback page - User data received:', userData)
            const user = userData?.user || userData
            
            // Store user data in localStorage for quick access
            localStorage.setItem('user', JSON.stringify({
              id: user.id || user.sub,
              email: user.email,
              firstName: user.firstName || user.firstname,
              lastName: user.lastName || user.lastname,
              name: user.name
            }))
            
            setStatus('success')
            setMessage('Successfully signed in with Google!')
            
            // Redirect to dashboard after a short delay
            setTimeout(() => {
              router.push('/dashboard')
            }, 1500)
          } else {
            const errorText = await response.text()
            console.log('Callback page - Profile verification failed:', response.status, errorText)
            throw new Error(`Failed to verify session: ${response.status}`)
          }
        } catch (err) {
          console.error('Callback error:', err)
          setStatus('error')
          setMessage('Failed to process authentication. Please try again.')
          setTimeout(() => router.push('/auth/login'), 3000)
        }
      } else {
        setStatus('error')
        setMessage('No authentication token received.')
        setTimeout(() => router.push('/auth/login'), 3000)
      }
    }

    handleCallback()
  }, [searchParams, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          {status === 'loading' && (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Processing Authentication</h2>
              <p className="text-gray-600">Please wait while we complete your sign-in...</p>
            </>
          )}
          
          {status === 'success' && (
            <>
              <div className="rounded-full h-12 w-12 bg-green-100 mx-auto mb-4 flex items-center justify-center">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Success!</h2>
              <p className="text-gray-600">{message}</p>
            </>
          )}
          
          {status === 'error' && (
            <>
              <div className="rounded-full h-12 w-12 bg-red-100 mx-auto mb-4 flex items-center justify-center">
                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Failed</h2>
              <p className="text-gray-600">{message}</p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
