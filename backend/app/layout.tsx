import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Geetesh Vaity - Portfolio API',
  description: 'Backend API for Geetesh Vaity portfolio',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
