'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AuthLayout } from '@/components/auth/auth-layout'
import { GoogleIcon } from '@/components/icons/google-icon'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  useEffect(() => {
    const message = searchParams.get('message')
    if (message) {
      setSuccessMessage(message)
      // Clear the URL parameter without reloading the page
      router.replace('/auth/login')
    }
  }, [searchParams, router])

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    setError('')
    setSuccessMessage('')
    
    try {
      const response = await fetch('http://localhost:4000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // receive httpOnly cookie
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (response.ok) {
        // Store the returned user object only (token is in httpOnly cookie)
        if (result?.user) {
          const raw = result.user
          // normalize backend fields to frontend shape
          const normalized = {
            id: raw.id || raw.sub,
            email: raw.email,
            firstName: raw.firstName || raw.firstname,
            lastName: raw.lastName || raw.lastname,
            name: raw.name,
          }
          localStorage.setItem('user', JSON.stringify(normalized))
        }
        
        // Redirect to dashboard
        router.push('/dashboard')
      } else {
        setError(result.message || 'Login failed')
      }
    } catch (err) {
      setError('Failed to connect to server')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = () => {
    // Redirect to backend Google OAuth endpoint
    window.location.href = 'http://localhost:4000/auth/google'
  }

  return (
    <AuthLayout 
      title="Sign in to your account" 
      subtitle="Welcome back! Please sign in to your account."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-sm text-green-600">{successMessage}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="h-12 pl-10 border-gray-300 focus:border-green-500 focus:ring-green-500 rounded-lg"
              {...register('email')}
            />
          </div>
          {errors.email && (
            <p className="text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-sm font-medium text-gray-700">
              Password
            </Label>
            <Link 
              href="/auth/forgot-password" 
              className="text-sm text-green-600 hover:text-green-700 transition-colors"
            >
              Forgot Password?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              className="h-12 pr-12 border-gray-300 focus:border-green-500 focus:ring-green-500 rounded-lg"
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        {/* Remember Me Checkbox */}
        <div className="flex items-center">
          <input
            id="remember"
            type="checkbox"
            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
          />
          <Label htmlFor="remember" className="ml-2 text-sm text-gray-700">
            Remember me
          </Label>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200"
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </Button>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-4 text-gray-500">or continue with</span>
          </div>
        </div>

        {/* Google Sign In Button */}
        <Button
          type="button"
          onClick={handleGoogleSignIn}
          variant="outline"
          className="w-full h-12 border-gray-200 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-colors duration-200"
        >
          <GoogleIcon className="h-5 w-5 mr-2" />
          Sign in with Google
        </Button>

        {/* Register Link */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link 
              href="/auth/register" 
              className="text-green-600 hover:text-green-700 font-medium transition-colors"
            >
              Sign up now
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  )
}
