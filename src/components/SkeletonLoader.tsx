'use client';

import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  count?: number;
  type?: 'card' | 'text' | 'circle' | 'button' | 'image';
}

const SkeletonLoader = ({ className, count = 1, type = 'text' }: SkeletonProps) => {
  const skeletons = Array.from({ length: count }, (_, i) => i);

  const getSkeletonClass = () => {
    switch (type) {
      case 'card':
        return 'h-[300px] w-full rounded-lg';
      case 'text':
        return 'h-4 w-full rounded';
      case 'circle':
        return 'h-12 w-12 rounded-full';
      case 'button':
        return 'h-10 w-24 rounded-md';
      case 'image':
        return 'h-48 w-full rounded-lg';
      default:
        return 'h-4 w-full rounded';
    }
  };

  return (
    <>
      {skeletons.map((index) => (
        <div
          key={index}
          className={cn(
            'animate-pulse bg-gray-200 dark:bg-gray-700',
            getSkeletonClass(),
            className
          )}
        />
      ))}
    </>
  );
};

export default SkeletonLoader;
