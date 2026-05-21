import { useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface AdminMFASetupProps {
  onSuccess: () => void
  onCancel: () => void
}

export function AdminMFASetup({ onSuccess, onCancel }: AdminMFASetupProps) {
  const [step, setStep] = useState<'init' | 'qr' | 'verify' | 'complete'>('init')
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [backupCodes, setBackupCodes] = useState<string[]>([])
  const [secret, setSecret] = useState('')
  const [verifyToken, setVerifyToken] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [copiedCodes, setCopiedCodes] = useState(false)

  const handleStartSetup = async () => {
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/mfa/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      const data = await res.json()

      if (data.success) {
        setSecret(data.data.secret)
        setQrCodeUrl(data.data.qrCode)
        setBackupCodes(data.data.backupCodes)
        setStep('qr')
      } else {
        setError(data.message || 'Failed to start MFA setup')
      }
    } catch (err) {
      setError('Error starting MFA setup')
      console.error('MFA setup error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleVerifySetup = async () => {
    if (!verifyToken || verifyToken.length !== 6) {
      setError('Please enter a valid 6-digit code')
      return
    }

    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/mfa/setup', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret, token: verifyToken }),
      })

      const data = await res.json()

      if (data.success) {
        setStep('complete')
      } else {
        setError(data.message || 'Invalid verification code')
      }
    } catch (err) {
      setError('Error verifying MFA setup')
      console.error('MFA verify error:', err)
    } finally {
      setLoading(false)
    }
  }

  const copyBackupCodes = async () => {
    const text = backupCodes.join('\n')
    try {
      await navigator.clipboard.writeText(text)
      setCopiedCodes(true)
      setTimeout(() => setCopiedCodes(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
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
        {step === 'init' && (
          <>
            <header className="mb-8">
              <h2 className="font-h2 text-2xl md:text-3xl text-stone-900 dark:text-stone-100 mb-2">
                Enable 2FA
              </h2>
              <div className="h-1 w-20 bg-orange-300 dark:bg-orange-600 rounded-full"></div>
            </header>

            <div className="space-y-6">
              <div className="bg-blue-100 dark:bg-blue-900/30 border border-blue-400 dark:border-blue-600 rounded-lg p-4">
                <p className="text-stone-700 dark:text-stone-300 text-sm font-label-hand">
                  📱 Two-Factor Authentication adds an extra security layer. You'll need to enter a code from your phone to login.
                </p>
              </div>

              <button
                onClick={handleStartSetup}
                disabled={loading}
                className={cn(
                  'w-full py-4 px-6',
                  'bg-stone-900 dark:bg-orange-600',
                  'text-white dark:text-white',
                  'font-bold text-base md:text-lg',
                  'rounded-xl border-2 border-stone-900 dark:border-orange-600',
                  'hover:shadow-[0_0_20px_rgba(231,195,101,0.4)]',
                  'hover:translate-y-0.5 transition-all',
                  'active:translate-y-1 active:shadow-none',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  'flex items-center justify-center gap-3'
                )}
              >
                {loading ? 'Setting up...' : 'Start Setup'}
                {!loading && <span className="text-lg">🔐</span>}
              </button>

              <button
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
            </div>
          </>
        )}

        {step === 'qr' && (
          <>
            <header className="mb-8">
              <h2 className="font-h2 text-2xl md:text-3xl text-stone-900 dark:text-stone-100 mb-2">
                Scan QR Code
              </h2>
              <div className="h-1 w-20 bg-orange-300 dark:bg-orange-600 rounded-full"></div>
            </header>

            <div className="space-y-6">
              <div>
                <p className="text-stone-700 dark:text-stone-300 text-sm mb-4 text-center font-label-hand">
                  Scan this QR code with your authenticator app:
                </p>
                {qrCodeUrl && (
                  <div className="flex justify-center bg-white p-4 rounded-lg">
                    <img
                      src={qrCodeUrl}
                      alt="MFA QR Code"
                      className="w-64 h-64"
                    />
                  </div>
                )}
              </div>

              <div>
                <p className="text-stone-700 dark:text-stone-300 text-xs mb-2 text-center font-label-hand">
                  👇 Or enter this code manually:
                </p>
                <div className="bg-stone-100 dark:bg-stone-800 p-3 rounded-lg text-center font-mono text-sm break-all border border-stone-300 dark:border-stone-600">
                  {secret}
                </div>
              </div>

              <div className="bg-amber-100 dark:bg-amber-900/30 border border-amber-400 dark:border-amber-600 rounded-lg p-4">
                <p className="text-stone-700 dark:text-stone-300 text-xs font-label-hand">
                  📥 <strong>Recommended apps:</strong> Google Authenticator, Microsoft Authenticator, or Authy
                </p>
              </div>

              <button
                onClick={() => setStep('verify')}
                className={cn(
                  'w-full py-4 px-6',
                  'bg-stone-900 dark:bg-orange-600',
                  'text-white dark:text-white',
                  'font-bold text-base md:text-lg',
                  'rounded-xl border-2 border-stone-900 dark:border-orange-600',
                  'hover:shadow-[0_0_20px_rgba(231,195,101,0.4)]',
                  'hover:translate-y-0.5 transition-all',
                  'flex items-center justify-center gap-3'
                )}
              >
                Next: Verify Code
                <span className="text-lg">→</span>
              </button>
            </div>
          </>
        )}

        {step === 'verify' && (
          <>
            <header className="mb-8">
              <h2 className="font-h2 text-2xl md:text-3xl text-stone-900 dark:text-stone-100 mb-2">
                Verify Setup
              </h2>
              <div className="h-1 w-20 bg-orange-300 dark:bg-orange-600 rounded-full"></div>
            </header>

            <div className="space-y-6">
              <div>
                <label className="block font-label-hand text-stone-700 dark:text-stone-300 mb-2 ml-1">
                  Enter the 6-digit code from your authenticator app:
                </label>
                <input
                  type="text"
                  value={verifyToken}
                  onChange={(e) => setVerifyToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  maxLength={6}
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

              {error && (
                <motion.div
                  className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {error}
                </motion.div>
              )}

              <button
                onClick={handleVerifySetup}
                disabled={loading || verifyToken.length !== 6}
                className={cn(
                  'w-full py-4 px-6',
                  'bg-stone-900 dark:bg-orange-600',
                  'text-white dark:text-white',
                  'font-bold text-base md:text-lg',
                  'rounded-xl border-2 border-stone-900 dark:border-orange-600',
                  'hover:shadow-[0_0_20px_rgba(231,195,101,0.4)]',
                  'hover:translate-y-0.5 transition-all',
                  'active:translate-y-1 active:shadow-none',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  'flex items-center justify-center gap-3'
                )}
              >
                {loading ? 'Verifying...' : 'Verify & Enable 2FA'}
                {!loading && <span className="text-lg">✓</span>}
              </button>
            </div>
          </>
        )}

        {step === 'complete' && (
          <>
            <header className="mb-8">
              <h2 className="font-h2 text-2xl md:text-3xl text-stone-900 dark:text-stone-100 mb-2">
                ✅ 2FA Enabled!
              </h2>
              <div className="h-1 w-20 bg-green-500 dark:bg-green-600 rounded-full"></div>
            </header>

            <div className="space-y-6">
              <div className="bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-600 rounded-lg p-4">
                <p className="text-stone-700 dark:text-stone-300 font-label-hand">
                  🎉 Two-factor authentication is now enabled on your account!
                </p>
              </div>

              <div>
                <p className="text-red-600 dark:text-red-400 font-bold mb-3 text-sm">
                  ⚠️ Save these backup codes in a safe place:
                </p>
                <div className="bg-stone-100 dark:bg-stone-800 p-4 rounded-lg border-2 border-stone-300 dark:border-stone-600">
                  <div className="space-y-2">
                    {backupCodes.map((code, i) => (
                      <div key={i} className="font-mono text-sm text-stone-700 dark:text-stone-300">
                        {code}
                      </div>
                    ))}
                  </div>
                </div>
                <button
                  onClick={copyBackupCodes}
                  className="mt-2 text-sm text-orange-600 dark:text-orange-400 hover:underline font-label-hand"
                >
                  {copiedCodes ? '✓ Copied!' : 'Copy codes'}
                </button>
              </div>

              <div className="bg-amber-100 dark:bg-amber-900/30 border border-amber-400 dark:border-amber-600 rounded-lg p-4 text-xs">
                <p className="text-stone-700 dark:text-stone-300 font-label-hand">
                  <strong>💡 Tip:</strong> Store these codes in a password manager or safe location. Each code can be used once if you lose access to your authenticator app.
                </p>
              </div>

              <button
                onClick={onSuccess}
                className={cn(
                  'w-full py-4 px-6',
                  'bg-stone-900 dark:bg-orange-600',
                  'text-white dark:text-white',
                  'font-bold text-base md:text-lg',
                  'rounded-xl border-2 border-stone-900 dark:border-orange-600',
                  'hover:shadow-[0_0_20px_rgba(231,195,101,0.4)]',
                  'hover:translate-y-0.5 transition-all',
                  'flex items-center justify-center gap-3'
                )}
              >
                Done
                <span className="text-lg">→</span>
              </button>
            </div>
          </>
        )}
      </div>
    </motion.div>
  )
}
