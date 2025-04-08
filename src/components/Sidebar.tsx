'use client';

import { cn } from '@/lib/utils';
import { BookOpenText, Home, Search, Settings, Lightbulb, History, User, LogIn } from 'lucide-react';
import Link from 'next/link';
import { useSelectedLayoutSegments } from 'next/navigation';
import React, { useState, useEffect, type ReactNode } from 'react';
import Layout from './Layout';
import InsightFlowLogo from './InsightFlowLogo';
import { useAuth } from '@/lib/firebase/auth/AuthContext';
import Image from 'next/image';

const VerticalIconContainer = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col items-center gap-y-3 w-full">{children}</div>
  );
};

const Sidebar = ({ children }: { children: React.ReactNode }) => {
  const segments = useSelectedLayoutSegments();
  const { user, loading } = useAuth();

  const navLinks = [
    {
      icon: Home,
      href: '/',
      active: segments.length === 0 || segments.includes('c'),
      label: 'Chat',
    },
    {
      icon: Search,
      href: '/discover',
      active: segments.includes('discover'),
      label: 'Search',
    },
    {
      icon: Lightbulb,
      href: '/insights',
      active: segments.includes('insights'),
      label: 'Insights',
    },
    {
      icon: History,
      href: '/history',
      active: segments.includes('history'),
      label: 'History',
    },
  ];

  return (
    <div>
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-20 lg:flex-col">
        <div className="flex grow flex-col items-center justify-between gap-y-5 overflow-y-auto bg-light-secondary dark:bg-dark-secondary px-2 py-8">
          <a href="/" className="flex justify-center items-center">
            <InsightFlowLogo showText={false} size={28} />
          </a>
          <VerticalIconContainer>
            {navLinks.map((link, i) => (
              <Link
                key={i}
                href={link.href}
                className={cn(
                  'relative flex flex-row items-center justify-center cursor-pointer hover:bg-black/10 dark:hover:bg-white/10 duration-150 transition w-full py-2 rounded-lg',
                  link.active
                    ? 'text-black dark:text-white'
                    : 'text-black/70 dark:text-white/70',
                )}
              >
                <link.icon />
                {link.active && (
                  <div className="absolute right-0 -mr-2 h-full w-1 rounded-l-lg bg-black dark:bg-white" />
                )}
              </Link>
            ))}
          </VerticalIconContainer>

          <div className="space-y-4">
            {!loading && (
              <>
                {user ? (
                  <Link
                    href="/profile"
                    title={user.displayName || 'Profile'}
                  >
                    {user.photoURL ? (
                      <div className="w-8 h-8 rounded-full overflow-hidden">
                        <Image
                          src={user.photoURL}
                          alt={user.displayName || 'User'}
                          width={32}
                          height={32}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center">
                        <User size={16} />
                      </div>
                    )}
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    title="Login"
                  >
                    <LogIn className="cursor-pointer text-blue-500" />
                  </Link>
                )}
              </>
            )}
            <Link href="/settings">
              <Settings className="cursor-pointer" />
            </Link>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 w-full z-50 flex flex-row items-center gap-x-6 bg-light-primary dark:bg-dark-primary px-4 py-4 shadow-sm lg:hidden">
        {navLinks.slice(0, 4).map((link, i) => (
          <Link
            href={link.href}
            key={i}
            className={cn(
              'relative flex flex-col items-center space-y-1 text-center w-full',
              link.active
                ? 'text-black dark:text-white'
                : 'text-black dark:text-white/70',
            )}
          >
            {link.active && (
              <div className="absolute top-0 -mt-4 h-1 w-full rounded-b-lg bg-black dark:bg-white" />
            )}
            <link.icon />
            <p className="text-xs">{link.label}</p>
          </Link>
        ))}

        {/* Profile or Login Link */}
        <Link
          href={user ? '/profile' : '/login'}
          className="relative flex flex-col items-center space-y-1 text-center w-full"
        >
          {user ? (
            <>
              {user.photoURL ? (
                <div className="w-6 h-6 rounded-full overflow-hidden">
                  <Image
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    width={24}
                    height={24}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <User size={20} />
              )}
              <p className="text-xs">Profile</p>
            </>
          ) : (
            <>
              <LogIn size={20} />
              <p className="text-xs">Login</p>
            </>
          )}
        </Link>
      </div>

      <Layout>{children}</Layout>
    </div>
  );
};

export default Sidebar;
