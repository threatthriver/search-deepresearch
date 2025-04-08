'use client';

import React from 'react';
import { Brain } from 'lucide-react';

interface ThinkBoxProps {
  content: string;
}

const ThinkBox: React.FC<ThinkBoxProps> = ({ content }) => {
  return (
    <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg my-2 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center mb-2">
        <Brain size={16} className="text-gray-500 mr-2" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Thinking...</span>
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-400">
        {content}
      </div>
    </div>
  );
};

export default ThinkBox;
