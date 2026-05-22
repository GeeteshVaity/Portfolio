import { useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface AdminMFAVerifyProps {
  userId: string
  onSuccess: (user: any) => void
  onCancel: () => void
}

export function AdminMFAVerify({ userId, onSuccess, onCancel }: AdminMFAVerifyProps) {
  const [token, setToken] = useState('')
  const [useBackupCode, setUseBackupCode] = useState(false)
  const [backupCode, setBackupCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmitToken = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const verificationToken = useBackupCode ? backupCode : token
      
      const res = await fetch(`${import.meta.env.VITE_API_URL || '/api'}/auth/mfa/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId, 
          token: verificationToken
        })
      })

      const data = await res.json()

      if (data.success) {
        onSuccess(data.data)
      } else {
        setError(data.message || 'Invalid MFA token')
      }
    } catch (err) {
      setError('Error verifying MFA')
      console.error('MFA verification error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      className="w-full max-w-md mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={cn(
        'bg-white dark:bg-stone-900 p-8 md:p-10 rounded-2xl',
        'border-2 border-stone-800 dark:border-stone-600',
        'shadow-[6px_6px_0px_0px_rgba(44,44,44,1)]',
        'dark:shadow-[6px_6px_0px_0px_rgba(120,113,108,0.5)]',
        'rotate-1'
      )}>
        <header className="mb-8">
          <h2 className="font-h2 text-2xl md:text-3xl text-stone-900 dark:text-stone-100 mb-2">
            Two-Factor Authentication
          </h2>
          <div className="h-1 w-20 bg-orange-300 dark:bg-orange-600 rounded-full"></div>
        </header>

        <form onSubmit={handleSubmitToken} className="space-y-6">
          {!useBackupCode ? (
            <>
              {/* TOTP Code Input */}
              <div>
                <label htmlFor="token" className="block font-label-hand text-stone-700 dark:text-stone-300 mb-2 ml-1">
                  Enter 6-Digit Code
                </label>
                <p className="text-xs text-stone-500 dark:text-stone-400 mb-3 ml-1">
                  Open your authenticator app (Google Authenticator, Authy, etc.)
                </p>
                <input
                  id="token"
                  type="text"
                  value={token}
                  onChange={(e) => setToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  maxLength={6}
                  required
                  className={cn(
                    'w-full px-4 py-3',
                    'bg-stone-50 dark:bg-stone-800',
                    'border-2 border-stone-800 dark:border-stone-600',
                    'rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400',
                    'text-stone-900 dark:text-stone-100',
                    'font-body-md text-2xl tracking-widest text-center',
                    'shadow-[2px_2px_0px_0px_rgba(44,44,44,0.1)]',
                    'transition-all'
                  )}
                  autoComplete="off"
                />
              </div>

              <div className="flex justify-between items-center text-sm">
                <button
                  type="button"
                  onClick={() => {
                    setUseBackupCode(true)
                    setToken('')
                    setError('')
                  }}
                  className="text-orange-600 dark:text-orange-400 hover:underline font-label-hand"
                >
                  Use backup code instead
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Backup Code Input */}
              <div>
                <label htmlFor="backupCode" className="block font-label-hand text-stone-700 dark:text-stone-300 mb-2 ml-1">
                  Enter Backup Code
                </label>
                <p className="text-xs text-stone-500 dark:text-stone-400 mb-3 ml-1">
                  Format: XXXXXXXX (8 characters)
                </p>
                <input
                  id="backupCode"
                  type="text"
                  value={backupCode}
                  onChange={(e) => setBackupCode(e.target.value.toUpperCase())}
                  placeholder="ABCD1234"
                  maxLength={8}
                  required
                  className={cn(
                    'w-full px-4 py-3',
                    'bg-stone-50 dark:bg-stone-800',
                    'border-2 border-stone-800 dark:border-stone-600',
                    'rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400',
                    'text-stone-900 dark:text-stone-100',
                    'font-body-md font-mono tracking-wider',
                    'shadow-[2px_2px_0px_0px_rgba(44,44,44,0.1)]',
                    'transition-all'
                  )}
                  autoComplete="off"
                />
              </div>

              <div className="flex justify-between items-center text-sm">
                <button
                  type="button"
                  onClick={() => {
                    setUseBackupCode(false)
                    setBackupCode('')
                    setError('')
                  }}
                  className="text-orange-600 dark:text-orange-400 hover:underline font-label-hand"
                >
                  Back to authenticator code
                </button>
              </div>
            </>
          )}

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
            disabled={loading || (useBackupCode ? backupCode.length !== 8 : token.length !== 6)}
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
              'flex items-center justify-center gap-3'
            )}
          >
            {loading ? 'Verifying...' : 'Verify'}
            {!loading && <span className="text-lg">✓</span>}
          </button>

          {/* Cancel Button */}
          <button
            type="button"
            onClick={onCancel}
            className={cn(
              'w-full py-3 px-6',
              'bg-stone-200 dark:bg-stone-700',
              'text-stone-900 dark:text-stone-100',
              'font-label-hand text-sm uppercase',
              'rounded-xl border-2 border-stone-400 dark:border-stone-600',
              'hover:bg-stone-300 dark:hover:bg-stone-600 transition-all'
            )}
          >
            Cancel
          </button>
        </form>
      </div>
    </motion.div>
  )
}
