import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI Accounting - Manage Your Firm Finances',
  description: 'Complete accounting solution for your business',
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
