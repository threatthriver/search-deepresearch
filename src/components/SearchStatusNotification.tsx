'use client';

import React, { useEffect, useState } from 'react';
import { Brain, Sparkles, MessageSquare } from 'lucide-react';

interface WelcomeMessageProps {
  onClose?: () => void;
}

const SearchStatusNotification: React.FC<WelcomeMessageProps> = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    // Add a slight delay before showing the animation
    const timer = setTimeout(() => {
      setShowAnimation(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className={`fixed bottom-4 right-4 max-w-md bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border border-blue-200 dark:border-blue-800 rounded-lg shadow-lg p-5 z-50 transition-all duration-500 ease-in-out backdrop-blur-sm ${showAnimation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0 relative">
          <Brain className="h-6 w-6 text-blue-500 dark:text-blue-400" />
          <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-amber-500 dark:text-amber-300" />
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">Welcome to InsightFlow!</h3>
          <div className="mt-1 text-sm text-blue-700 dark:text-blue-400">
            <p>
              I'm excited to have you try out InsightFlow, powered by Cerebras Llama 3.3 70B. Ask me anything, and I'll provide intelligent insights and answers.
            </p>
            <p className="mt-2 text-xs flex items-center">
              <MessageSquare className="inline h-3 w-3 mr-1" />
              <span className="font-medium">Created with ❤️ by Aniket Kumar</span>
            </p>
          </div>
        </div>
        <div className="ml-4 flex-shrink-0 flex">
          <button
            type="button"
            className="inline-flex text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 focus:outline-none"
            onClick={handleClose}
          >
            <span className="sr-only">Close</span>
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchStatusNotification;
