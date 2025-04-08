'use client';

import { Brain, Sparkles } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

interface InsightFlowLogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
}

const InsightFlowLogo = ({ size = 24, showText = true, className = '' }: InsightFlowLogoProps) => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = theme === 'dark';
  
  return (
    <div className={`flex items-center ${className}`}>
      <div className="relative">
        <Brain 
          size={size} 
          className={`text-blue-600 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} 
        />
        <Sparkles 
          size={size/2} 
          className={`absolute -top-1 -right-1 ${isDark ? 'text-amber-300' : 'text-amber-500'}`} 
        />
      </div>
      
      {showText && (
        <div className="ml-2 font-semibold text-lg">
          <span className={isDark ? 'text-white' : 'text-gray-800'}>Insight</span>
          <span className={`${isDark ? 'text-blue-400' : 'text-blue-600'}`}>Flow</span>
          <span className="text-xs ml-1 text-gray-500 font-normal">by Aniket Kumar</span>
        </div>
      )}
    </div>
  );
};

export default InsightFlowLogo;
