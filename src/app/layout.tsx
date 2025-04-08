import type { Metadata, Viewport } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import ClientLayout from '@/components/ClientLayout';
import Script from 'next/script';

const montserrat = Montserrat({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  fallback: ['Arial', 'sans-serif'],
});

export const metadata: Metadata = {
  title: 'InsightFlow Made By Aniket Kumar - AI-Powered Insights',
  description:
    'InsightFlow is an advanced AI assistant powered by Cerebras Llama 3.3 70B, providing intelligent insights and answers to your questions.',
  keywords: ['AI', 'Cerebras', 'Llama 3.3', 'Research', 'InsightFlow', 'Aniket Kumar'],
  authors: [{ name: 'Aniket Kumar' }],
  creator: 'Aniket Kumar',
  publisher: 'InsightFlow',
  formatDetection: {
    email: false,
    telephone: false,
    address: false,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [{ media: '(prefers-color-scheme: dark)', color: '#0f172a' }, { media: '(prefers-color-scheme: light)', color: '#ffffff' }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="h-full" lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="InsightFlow" />
        <link rel="apple-touch-icon" href="/icons/apple-icon-180.png" />
      </head>
      <body className={cn('h-full', montserrat.className)}>
        <ClientLayout>{children}</ClientLayout>
        {/* Analytics script - load after page content */}
        <Script
          strategy="afterInteractive"
          id="analytics"
          dangerouslySetInnerHTML={{
            __html: `
              // Simple performance measurement
              window.addEventListener('load', () => {
                setTimeout(() => {
                  const timing = window.performance.timing;
                  const pageLoadTime = timing.loadEventEnd - timing.navigationStart;
                  console.log('Page load time:', pageLoadTime, 'ms');
                }, 0);
              });
            `,
          }}
        />

        {/* Service Worker Registration */}
        <Script
          strategy="afterInteractive"
          src="/register-sw.js"
        />
      </body>
    </html>
  );
}
