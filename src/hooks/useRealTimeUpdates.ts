import { useEffect } from 'react'
import { usePortfolioStore } from '@/store/usePortfolioStore'

/**
 * Hook for managing real-time data updates with polling
 * Automatically fetches and refreshes portfolio data
 *
 * @param startPolling - Whether to start polling on mount (default: true)
 * @param pollInterval - Polling interval in milliseconds (default: 30000 = 30 seconds)
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   useRealTimeUpdates(true, 60000) // Poll every 60 seconds
 *   const { projects, loading } = usePortfolioStore()
 *
 *   return (
 *     <div>
 *       {loading.projects ? <Spinner /> : <ProjectsList projects={projects} />}
 *     </div>
 *   )
 * }
 * ```
 */
export function useRealTimeUpdates(startPolling = true, pollInterval = 30000) {
  const { startRealTimeUpdates, stopRealTimeUpdates, fetchProjects, fetchSkills } =
    usePortfolioStore()

  useEffect(() => {
    if (startPolling) {
      // Start real-time polling with custom interval
      startRealTimeUpdates(pollInterval)

      // Cleanup on unmount
      return () => {
        stopRealTimeUpdates()
      }
    }
  }, [startPolling, pollInterval, startRealTimeUpdates, stopRealTimeUpdates])

  // Allow manual refresh
  const refresh = async () => {
    await Promise.all([fetchProjects(), fetchSkills()])
  }

  return { refresh }
}

/**
 * Hook for managing async operations with loading and error states
 * Useful for API calls and data mutations
 *
 * @example
 * ```tsx
 * function LoginForm() {
 *   const { loading, error, execute } = useAsyncOperation()
 *
 *   const handleSubmit = async (email, password) => {
 *     await execute(async () => {
 *       await apiClient.login({ email, password })
 *     })
 *   }
 *
 *   return (
 *     <>
 *       {error && <ErrorAlert message={error} />}
 *       <button disabled={loading} onClick={handleSubmit}>
 *         {loading ? 'Loading...' : 'Login'}
 *       </button>
 *     </>
 *   )
 * }
 * ```
 */
export function useAsyncOperation() {
  const [loading, setLoading] = useLocalState(false)
  const [error, setError] = useLocalState<string | null>(null)

  const execute = async (fn: () => Promise<void>) => {
    setLoading(true)
    setError(null)
    try {
      await fn()
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || 'An error occurred'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return { loading, error, execute, clearError: () => setError(null) }
}

/**
 * Local state hook (simple alternative to useState for this module)
 */
function useLocalState<T>(initialValue: T) {
  const [state, setState] = useLocalStateImpl(initialValue)
  return [state, setState] as const
}

// Simple hook implementation
import { useState } from 'react'
function useLocalStateImpl<T>(initialValue: T) {
  return useState<T>(initialValue)
}
