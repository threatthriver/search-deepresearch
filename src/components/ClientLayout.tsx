'use client';

import { ThemeProvider } from 'next-themes';
import { Suspense, lazy } from 'react';
import { Toaster } from 'sonner';
import dynamic from 'next/dynamic';
import LoadingSpinner from './LoadingSpinner';

// Lazy load the Sidebar component
const Sidebar = lazy(() => import('./Sidebar'));

// Dynamically import the SearchStatusNotification component
const SearchStatusNotification = dynamic(
  () => import('./SearchStatusNotification'),
  { ssr: false }
);

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider attribute="class" enableSystem={false} defaultTheme="dark">
      <Suspense fallback={<div className="flex h-screen w-screen items-center justify-center"><LoadingSpinner size="lg" /></div>}>
        <Sidebar>{children}</Sidebar>
      </Suspense>
      <Suspense fallback={null}>
        <SearchStatusNotification />
      </Suspense>
      <Toaster
        toastOptions={{
          unstyled: true,
          classNames: {
            toast:
              'bg-light-primary dark:bg-dark-secondary dark:text-white/70 text-black-70 rounded-lg p-4 flex flex-row items-center space-x-2',
          },
        }}
      />
    </ThemeProvider>
  );
}
