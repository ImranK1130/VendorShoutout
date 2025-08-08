import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Mehfil Vendor Shoutout - Get Featured on Social Media',
  description: 'Submit your business information to get featured on Mehfil\'s social media platforms. Professional, reliable, and trusted vendor showcase.',
  keywords: 'vendor, shoutout, business, social media, Mehfil, featured',
  openGraph: {
    title: 'Mehfil Vendor Shoutout',
    description: 'Get featured on Mehfil\'s social media! Submit your business information for a professional shoutout.',
    type: 'website',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
