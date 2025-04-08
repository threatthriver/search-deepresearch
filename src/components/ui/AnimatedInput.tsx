'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
  error?: string;
  fullWidth?: boolean;
  className?: string;
  containerClassName?: string;
}

const AnimatedInput = ({
  label,
  icon,
  error,
  fullWidth = false,
  className,
  containerClassName,
  ...props
}: AnimatedInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  
  return (
    <div className={cn('relative', fullWidth && 'w-full', containerClassName)}>
      {label && (
        <label 
          className={cn(
            "block text-sm font-medium mb-1 transition-colors",
            isFocused ? "text-blue-600 dark:text-blue-400" : "text-gray-700 dark:text-gray-300"
          )}
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        
        <motion.input
          whileFocus={{ scale: 1.01 }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={cn(
            "block rounded-md shadow-sm transition-all duration-200",
            "border border-gray-300 dark:border-gray-700",
            "bg-white dark:bg-gray-800",
            "text-gray-900 dark:text-white",
            "placeholder-gray-400 dark:placeholder-gray-500",
            "focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none",
            icon ? "pl-10" : "pl-4",
            "pr-4 py-2",
            error && "border-red-500 focus:ring-red-500 focus:border-red-500",
            fullWidth && "w-full",
            className
          )}
          {...props}
        />
        
        {error && (
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-1 text-sm text-red-600 dark:text-red-400"
          >
            {error}
          </motion.p>
        )}
      </div>
    </div>
  );
};

export default AnimatedInput;
