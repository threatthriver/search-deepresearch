'use client';

import { ThemeProvider } from 'next-themes';
import Sidebar from './Sidebar';
import { Toaster } from 'sonner';
import dynamic from 'next/dynamic';

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
      <Sidebar>{children}</Sidebar>
      <SearchStatusNotification />
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
