import React from 'react'

interface ErrorAlertProps {
  message?: string
  title?: string
  onClose?: () => void
  closeable?: boolean
  variant?: 'error' | 'warning' | 'info'
}

/**
 * Error Alert Component
 * Displays error messages with optional close button
 */
export function ErrorAlert({
  message,
  title,
  onClose,
  closeable = true,
  variant = 'error',
}: ErrorAlertProps) {
  if (!message) return null

  const bgColor = {
    error: 'bg-red-50 border-red-200',
    warning: 'bg-yellow-50 border-yellow-200',
    info: 'bg-blue-50 border-blue-200',
  }[variant]

  const textColor = {
    error: 'text-red-800',
    warning: 'text-yellow-800',
    info: 'text-blue-800',
  }[variant]

  const titleColor = {
    error: 'text-red-900',
    warning: 'text-yellow-900',
    info: 'text-blue-900',
  }[variant]

  return (
    <div className={`border rounded-lg p-4 ${bgColor}`} role="alert">
      <div className="flex justify-between items-start">
        <div>
          {title && <h3 className={`font-semibold ${titleColor} mb-1`}>{title}</h3>}
          <p className={textColor}>{message}</p>
        </div>
        {closeable && onClose && (
          <button
            onClick={onClose}
            className={`ml-4 font-semibold ${textColor} hover:opacity-70 transition-opacity`}
            aria-label="Close alert"
          >
            ×
          </button>
        )}
      </div>
    </div>
  )
}

/**
 * Loading Skeleton Component
 * Shows placeholder while data is loading
 */
interface SkeletonProps {
  count?: number
  height?: string
  className?: string
}

export function LoadingSkeleton({ count = 1, height = 'h-12', className = '' }: SkeletonProps) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`${height} bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg animate-pulse ${className}`}
        />
      ))}
    </div>
  )
}

/**
 * Loading Spinner Component
 * Shows loading indicator
 */
export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-4">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

/**
 * Empty State Component
 * Shows message when no data available
 */
interface EmptyStateProps {
  title: string
  description?: string
  icon?: React.ReactNode
}

export function EmptyState({ title, description, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      {icon && <div className="text-4xl mb-4 opacity-50">{icon}</div>}
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      {description && <p className="text-gray-600 text-sm">{description}</p>}
    </div>
  )
}
