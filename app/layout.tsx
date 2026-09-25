import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ExpenseProvider } from '../context/ExpenseContext';

export const metadata: Metadata = {
  title: 'SpendIQ — Personal Expense Intelligence',
  description: 'A modern personal expense tracker and spending analytics dashboard.',
  keywords: [
    'expense tracker',
    'personal finance',
    'budget dashboard',
    'spending analytics',
    'money manager',
    'financial tracking',
    'fintech dashboard',
  ],
  authors: [{ name: 'SpendIQ' }],
  creator: 'SpendIQ',
  publisher: 'SpendIQ',
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
  openGraph: {
    title: 'SpendIQ — Personal Expense Intelligence',
    description: 'A modern personal expense tracker and spending analytics dashboard.',
    url: 'https://spendiq.vercel.app',
    siteName: 'SpendIQ',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
        width: 1200,
        height: 630,
        alt: 'SpendIQ Expense Intelligence Dashboard',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SpendIQ — Personal Expense Intelligence',
    description: 'A modern personal expense tracker and spending analytics dashboard.',
    images: ['https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#090d16',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="fintech-grid min-h-screen antialiased selection:bg-emerald-500 selection:text-white">
        <ExpenseProvider>
          {children}
        </ExpenseProvider>
      </body>
    </html>
  );
}
