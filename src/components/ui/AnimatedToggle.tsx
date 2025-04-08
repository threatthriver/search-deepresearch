'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedToggleProps {
  isOn: boolean;
  onToggle: () => void;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
}

const AnimatedToggle = ({
  isOn,
  onToggle,
  label,
  size = 'md',
  disabled = false,
  className,
}: AnimatedToggleProps) => {
  // Size configurations
  const sizes = {
    sm: {
      track: 'w-8 h-4',
      thumb: 'w-3 h-3',
      translate: 'translate-x-4',
    },
    md: {
      track: 'w-11 h-6',
      thumb: 'w-5 h-5',
      translate: 'translate-x-5',
    },
    lg: {
      track: 'w-14 h-7',
      thumb: 'w-6 h-6',
      translate: 'translate-x-7',
    },
  };

  return (
    <div className={cn('flex items-center', className)}>
      {label && (
        <span className="mr-3 text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </span>
      )}
      
      <motion.button
        type="button"
        onClick={onToggle}
        disabled={disabled}
        className={cn(
          'relative inline-flex flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent',
          'transition-colors ease-in-out duration-200',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
          isOn ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700',
          disabled && 'opacity-50 cursor-not-allowed',
          sizes[size].track
        )}
        aria-pressed={isOn}
        aria-label={label || 'Toggle'}
        whileTap={{ scale: 0.95 }}
      >
        <span className="sr-only">{label || 'Toggle'}</span>
        <motion.span
          className={cn(
            'pointer-events-none inline-block rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200',
            sizes[size].thumb
          )}
          animate={{
            x: isOn ? parseInt(sizes[size].translate.split('-x-')[1]) : 0,
          }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </motion.button>
    </div>
  );
};

export default AnimatedToggle;
