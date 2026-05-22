import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useAdminStore } from '@/store/useAdminStore'
import { AdminMFAVerify } from './AdminMFAVerify'

export function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [mfaRequired, setMfaRequired] = useState(false)
  const [userId, setUserId] = useState('')
  const navigate = useNavigate()
  const { setUser } = useAdminStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const API_URL = import.meta.env.VITE_API_URL || '/api'
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || 'Login failed')
        return
      }

      if (data.mfaRequired) {
        // MFA is required - show verification screen
        setMfaRequired(true)
        setUserId(data.userId)
        return
      }

      // Login successful without MFA - update store and navigate
      if (data.user) {
        setUser(data.user)
      }
      setEmail('')
      setPassword('')
      navigate('/admin/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleMFASuccess = (userData: any) => {
    // MFA verified - update store and navigate to dashboard
    if (userData) {
      setUser(userData)
    }
    setEmail('')
    setPassword('')
    setMfaRequired(false)
    navigate('/admin/dashboard')
  }

  const handleMFACancel = () => {
    // Go back to login form
    setMfaRequired(false)
    setUserId('')
    setPassword('')
    setError('')
  }

  // Show MFA verification if required
  if (mfaRequired) {
    return (
      <div className="min-h-screen bg-stone-100 dark:bg-stone-950 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 opacity-20">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="text-orange-300">
            <path
              d="M0,0 Q50,10 100,0 T200,0 M20,0 L20,200 M40,0 L40,200 M60,0 L60,200 M80,0 L80,200 M100,0 L100,200 M0,20 L200,20 M0,40 L200,40 M0,60 L200,60 M0,80 L200,80 M0,100 L200,100"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
            />
          </svg>
        </div>

        <motion.div
          className="w-full max-w-md z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <AdminMFAVerify 
            userId={userId} 
            onSuccess={handleMFASuccess}
            onCancel={handleMFACancel}
          />
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-stone-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 right-0 w-64 h-64 opacity-20">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="text-orange-300">
          <path
            d="M0,0 Q50,10 100,0 T200,0 M20,0 L20,200 M40,0 L40,200 M60,0 L60,200 M80,0 L80,200 M100,0 L100,200 M0,20 L200,20 M0,40 L200,40 M0,60 L200,60 M0,80 L200,80 M0,100 L200,100"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
          />
        </svg>
      </div>

      <motion.div
        className="w-full max-w-md z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="text-center mb-8 -rotate-1">
          <h1 className="font-h1 text-2xl md:text-4xl text-stone-900 dark:text-stone-100 tracking-tighter mb-2">
            Geetesh
          </h1>
          <p className="font-label-hand text-xs uppercase tracking-widest text-orange-600 dark:text-orange-400 font-bold">
            Restricted Access
          </p>
        </div>

        {/* Login Form */}
        <motion.div
          className={cn(
            'bg-white dark:bg-stone-900 p-8 md:p-10 rounded-2xl',
            'border-2 border-stone-800 dark:border-stone-600',
            'shadow-[6px_6px_0px_0px_rgba(44,44,44,1)]',
            'dark:shadow-[6px_6px_0px_0px_rgba(120,113,108,0.5)]',
            'rotate-1'
          )}
          whileHover={{ shadow: '8px 8px 0px 0px rgba(44,44,44,1)' }}
        >
          <header className="mb-8">
            <h2 className="font-h2 text-2xl md:text-3xl text-stone-900 dark:text-stone-100 mb-2">
              Admin Login
            </h2>
            <div className="h-1 w-20 bg-orange-300 dark:bg-orange-600 rounded-full"></div>
          </header>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block font-label-hand text-stone-700 dark:text-stone-300 mb-2 ml-1">
                Identity (Email)
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="geetesh@example.com"
                required
                className={cn(
                  'w-full px-4 py-3',
                  'bg-stone-50 dark:bg-stone-800',
                  'border-2 border-stone-800 dark:border-stone-600',
                  'rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400',
                  'text-stone-900 dark:text-stone-100',
                  'font-body-md',
                  'shadow-[2px_2px_0px_0px_rgba(44,44,44,0.1)]',
                  'transition-all'
                )}
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block font-label-hand text-stone-700 dark:text-stone-300 mb-2 ml-1">
                Secret Code (Password)
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className={cn(
                  'w-full px-4 py-3',
                  'bg-stone-50 dark:bg-stone-800',
                  'border-2 border-stone-800 dark:border-stone-600',
                  'rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400',
                  'text-stone-900 dark:text-stone-100',
                  'font-body-md',
                  'shadow-[2px_2px_0px_0px_rgba(44,44,44,0.1)]',
                  'transition-all'
                )}
              />
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {error}
              </motion.div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={cn(
                'w-full py-4 px-6',
                'bg-stone-900 dark:bg-orange-600',
                'text-white dark:text-white',
                'font-bold text-base md:text-lg',
                'rounded-xl border-2 border-stone-900 dark:border-orange-600',
                'hover:shadow-[0_0_20px_rgba(231,195,101,0.4)] dark:hover:shadow-[0_0_20px_rgba(234,179,8,0.3)]',
                'hover:translate-y-0.5 transition-all',
                'active:translate-y-1 active:shadow-none',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                'flex items-center justify-center gap-3 whitespace-nowrap'
              )}
            >
              {loading ? 'Logging in...' : 'Log In as Geetesh'}
              {!loading && <span className="text-lg">⚡</span>}
            </button>
          </form>

          {/* Info Box */}
          <div className="mt-8 pt-6 border-t-2 border-dashed border-stone-300 dark:border-stone-700">
            <div className="flex items-start gap-3 bg-orange-100/30 dark:bg-orange-900/20 p-4 rounded-lg -rotate-1 border border-orange-300 dark:border-orange-700">
              <span className="text-lg shrink-0">ℹ️</span>
              <p className="text-stone-700 dark:text-stone-300 font-label-hand text-sm italic">
                Only Geetesh can access. Default credentials: geetesh@example.com / password
              </p>
            </div>
          </div>
        </motion.div>

        {/* Back Link */}
        <div className="mt-8 text-center">
          <Link
            to="/"
            className={cn(
              'inline-flex items-center gap-2',
              'text-stone-500 dark:text-stone-400',
              'hover:text-stone-900 dark:hover:text-stone-100',
              'transition-colors font-label-hand',
              'group'
            )}
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span>
            Back to Portfolio
          </Link>
        </div>
      </motion.div>
    </div>
  )
}