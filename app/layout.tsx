// app/layout.tsx
import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { AppProviders } from '@/app/components/providers/AppProviders';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap', // Better font loading
  variable: '--font-inter', // CSS variable for flexibility
});

export const metadata: Metadata = {
  title: {
    default: 'SupersmartX - AI Meeting Assistant',
    template: '%s | SupersmartX',
  },
  description: 'Transform your meetings with AI-powered summaries and reports',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'SupersmartX - AI Meeting Assistant',
    description: 'Transform your meetings with AI-powered summaries and reports',
    url: 'https://yourdomain.com',
    siteName: 'SupersmartX',
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
    },
  },
  twitter: {
    title: 'SupersmartX',
    card: 'summary_large_image',
  },
};

export const viewport: Viewport = {
  themeColor: '#0D1117',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-[#0D1117] text-white min-h-screen`}>
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}