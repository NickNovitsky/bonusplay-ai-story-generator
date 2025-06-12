'use client'
import { ErrorBoundary } from '@sentry/react'

export function SentryErrorBoundary({ children } : { children: React.ReactNode }) {
  return (
    <ErrorBoundary fallback={<p>Sorry, something went wrong.</p>}>
      {children}
    </ErrorBoundary>
  )
}
