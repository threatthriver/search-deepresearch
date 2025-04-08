'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  delay?: number;
  onClick?: () => void;
}

const AnimatedCard = ({
  children,
  className,
  hoverEffect = true,
  delay = 0,
  onClick,
}: AnimatedCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: delay * 0.1 }}
      whileHover={
        hoverEffect
          ? {
              y: -5,
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
              transition: { duration: 0.2 },
            }
          : undefined
      }
      className={cn(
        'bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm transition-all',
        hoverEffect && 'hover:shadow-md cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedCard;
