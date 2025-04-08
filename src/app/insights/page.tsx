'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft, Lightbulb, Brain } from 'lucide-react';
import Link from 'next/link';
import InsightFlowLogo from '@/components/InsightFlowLogo';

interface Insight {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: string;
}

const insights: Insight[] = [
  {
    id: '1',
    title: 'Cerebras Llama 3.3 70B',
    description: 'InsightFlow is powered by Cerebras Llama 3.3 70B, one of the most advanced open-source large language models available today.',
    category: 'Technology',
    icon: '🧠',
  },
  {
    id: '2',
    title: 'Web Search Integration',
    description: 'InsightFlow can search the web to provide you with up-to-date information and answers to your questions.',
    category: 'Feature',
    icon: '🔍',
  },
  {
    id: '3',
    title: 'Browser Storage',
    description: 'Your chat history is stored securely in your browser, allowing you to access your conversations anytime.',
    category: 'Feature',
    icon: '💾',
  },
  {
    id: '4',
    title: 'Created by Aniket Kumar',
    description: 'InsightFlow was created by Aniket Kumar as a powerful AI assistant for providing intelligent insights and answers.',
    category: 'About',
    icon: '👨‍💻',
  },
];

export default function InsightsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filteredInsights, setFilteredInsights] = useState<Insight[]>(insights);

  useEffect(() => {
    if (selectedCategory) {
      setFilteredInsights(insights.filter(insight => insight.category === selectedCategory));
    } else {
      setFilteredInsights(insights);
    }
  }, [selectedCategory]);

  const categories = Array.from(new Set(insights.map(insight => insight.category)));

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link href="/" className="mr-4">
          <ArrowLeft className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" />
        </Link>
        <h1 className="text-2xl font-semibold flex items-center">
          <Lightbulb className="mr-2" /> Insights
        </h1>
      </div>

      <div className="mb-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <div className="flex items-center mb-4">
          <InsightFlowLogo size={32} />
        </div>
        <h2 className="text-xl font-semibold mb-2">Welcome to InsightFlow Insights</h2>
        <p className="text-gray-700 dark:text-gray-300">
          Discover key information about InsightFlow and how it can help you get intelligent answers and insights.
        </p>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-full text-sm ${
            selectedCategory === null
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          All
        </button>
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm ${
              selectedCategory === category
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredInsights.map(insight => (
          <div
            key={insight.id}
            className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-start">
              <div className="text-3xl mr-4">{insight.icon}</div>
              <div>
                <h3 className="font-medium text-lg mb-2">{insight.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{insight.description}</p>
                <div className="mt-4">
                  <span className="inline-block px-3 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                    {insight.category}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center text-gray-500 dark:text-gray-400 text-sm">
        <p>InsightFlow v1.0.0 • Created by Aniket Kumar</p>
        <p className="mt-1">Powered by Cerebras Llama 3.3 70B</p>
      </div>
    </div>
  );
}
