
import { ReactNode } from 'react'
import { 
  Ticket, 
  Atom, 
  Database, 
  Layers, 
  Code2, 
  Workflow,
  Zap,
  Cpu,
  Palette
} from 'lucide-react'

interface AuthLayoutProps {
  children: ReactNode
  title: string
  subtitle: string
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Form */}
      <div className="w-1/2 bg-white flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-16 -mt-12">
            <span className="text-5xl font-bold text-green-600 whitespace-nowrap">Smart Ticket System</span>
          </div>
          
          {/* Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
            <p className="text-gray-600">{subtitle}</p>
          </div>
          
          {/* Content */}
          {children}
        </div>
      </div>
      
      {/* Right Panel - Branded Background */}
      <div className="w-1/2 bg-gradient-to-br from-green-500 via-green-600 to-green-700 relative overflow-hidden" 
           style={{
             clipPath: 'polygon(15% 0%, 100% 0%, 100% 100%, 0% 100%)'
           }}>
        {/* Tech Icons Background */}
        <div className="absolute inset-0 opacity-20">
          {/* Floating Icons */}
          <div className="absolute top-16 left-16">
            <Atom className="h-12 w-12 text-white" />
          </div>
          <div className="absolute top-32 right-24">
            <Database className="h-10 w-10 text-white" />
          </div>
          <div className="absolute top-48 left-32">
            <Code2 className="h-8 w-8 text-white" />
          </div>
          <div className="absolute top-64 right-16">
            <Layers className="h-14 w-14 text-white" />
          </div>
          <div className="absolute bottom-64 left-24">
            <Workflow className="h-10 w-10 text-white" />
          </div>
          <div className="absolute bottom-48 right-32">
            <Zap className="h-8 w-8 text-white" />
          </div>
          <div className="absolute bottom-32 left-16">
            <Cpu className="h-12 w-12 text-white" />
          </div>
          <div className="absolute bottom-16 right-16">
            <Palette className="h-10 w-10 text-white" />
          </div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-center h-full p-16 text-center">
          <div className="max-w-lg">
            <h2 className="text-5xl font-bold text-white mb-6">
              Welcome To SmartT
            </h2>
            <p className="text-green-100 text-lg leading-relaxed mb-8">
              Manage your events and tickets with ease. Built with modern technology 
              for a seamless experience.
            </p>
            
            {/* Main Illustration */}
            <div className="mb-8 flex justify-center">
              <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm">
                <svg width="120" height="80" viewBox="0 0 120 80" className="text-white">
                  {/* Event Stage */}
                  <rect x="10" y="40" width="100" height="20" rx="10" fill="currentColor" opacity="0.3"/>
                  <rect x="15" y="45" width="90" height="10" rx="5" fill="currentColor" opacity="0.6"/>
                  
                  {/* Ticket */}
                  <rect x="50" y="20" width="20" height="15" rx="2" fill="currentColor" opacity="0.8"/>
                  <line x1="60" y1="20" x2="60" y2="35" stroke="currentColor" strokeWidth="0.5" opacity="0.4"/>
                  <circle cx="58" cy="27" r="1" fill="currentColor" opacity="0.6"/>
                  <circle cx="62" cy="27" r="1" fill="currentColor" opacity="0.6"/>
                  
                  {/* Payment Flow */}
                  <path d="M30 25 L45 25 L45 30 L30 30 Z" fill="currentColor" opacity="0.7"/>
                  <circle cx="37" cy="27" r="2" fill="currentColor" opacity="0.9"/>
                  <path d="M75 25 L90 25 L90 30 L75 30 Z" fill="currentColor" opacity="0.7"/>
                  <circle cx="82" cy="27" r="2" fill="currentColor" opacity="0.9"/>
                  
                  {/* Connection Lines */}
                  <path d="M30 27 L50 27" stroke="currentColor" strokeWidth="1" opacity="0.5" markerEnd="url(#arrowhead)"/>
                  <path d="M70 27 L90 27" stroke="currentColor" strokeWidth="1" opacity="0.5" markerEnd="url(#arrowhead)"/>
                  
                  {/* Arrow marker */}
                  <defs>
                    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                      <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" opacity="0.5"/>
                    </marker>
                  </defs>
                </svg>
              </div>
            </div>
            
            {/* Feature Boxes */}
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/20">
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 rounded-lg p-2">
                    <Ticket className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-white font-semibold text-sm">Smart Ticketing</h3>
                    <p className="text-green-100 text-xs">Digital tickets with facial recognition (and QR/NFC as fallback)</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/20">
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 rounded-lg p-2">
                    <Layers className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-white font-semibold text-sm">Event Management</h3>
                    <p className="text-green-100 text-xs">Organize and track your events</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/20">
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 rounded-lg p-2">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-white font-semibold text-sm">Secure Payments</h3>
                    <p className="text-green-100 text-xs">Fast and secure transactions</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
      </div>
    </div>
  )
}
