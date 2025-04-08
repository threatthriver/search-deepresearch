'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft, Lightbulb, Brain, Zap, Search, FileText, Code, Share2, Download, Sparkles, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import InsightFlowLogo from '@/components/InsightFlowLogo';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface Insight {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  detailedInfo?: string;
  link?: string;
  linkText?: string;
  LucideIcon?: React.ElementType;
}

interface DidYouKnow {
  id: string;
  fact: string;
}

const didYouKnowFacts: DidYouKnow[] = [
  {
    id: '1',
    fact: 'Llama 3.3 70B is one of the most advanced open-source large language models, with 70 billion parameters.',
  },
  {
    id: '2',
    fact: 'InsightFlow uses browser storage to keep your chat history private and secure.',
  },
  {
    id: '3',
    fact: 'You can search for research papers and get detailed summaries with just one click.',
  },
  {
    id: '4',
    fact: 'The app includes a dark mode that reduces eye strain during nighttime use.',
  },
  {
    id: '5',
    fact: 'InsightFlow can analyze and summarize web content from various sources.',
  },
];

const insights: Insight[] = [
  {
    id: '1',
    title: 'Cerebras Llama 3.3 70B',
    description: 'InsightFlow is powered by Cerebras Llama 3.3 70B, one of the most advanced open-source large language models available today.',
    category: 'Technology',
    icon: '🧠',
    LucideIcon: Brain,
    detailedInfo: 'Llama 3.3 70B is a state-of-the-art language model with 70 billion parameters, trained on a diverse dataset of text and code. It excels at understanding context, generating human-like responses, and solving complex problems.',
    link: 'https://www.cerebras.net/blog/cerebras-llama-3-3-70b',
    linkText: 'Learn more about Llama 3.3',
  },
  {
    id: '2',
    title: 'Web Search Integration',
    description: 'InsightFlow can search the web to provide you with up-to-date information and answers to your questions.',
    category: 'Feature',
    icon: '🔍',
    LucideIcon: Search,
    detailedInfo: 'The web search feature allows InsightFlow to retrieve real-time information from the internet, ensuring that you get the most current and accurate answers to your questions.',
  },
  {
    id: '3',
    title: 'Browser Storage',
    description: 'Your chat history is stored securely in your browser, allowing you to access your conversations anytime.',
    category: 'Feature',
    icon: '💾',
    LucideIcon: Download,
    detailedInfo: 'InsightFlow uses your browser\'s localStorage to securely store your chat history. This means your data stays on your device and is not sent to any external servers, ensuring your privacy.',
  },
  {
    id: '4',
    title: 'Created by Aniket Kumar',
    description: 'InsightFlow was created by Aniket Kumar as a powerful AI assistant for providing intelligent insights and answers.',
    category: 'About',
    icon: '👨‍💻',
    LucideIcon: Code,
    detailedInfo: 'Aniket Kumar developed InsightFlow to make advanced AI capabilities accessible to everyone. The application is designed to be user-friendly, fast, and reliable.',
  },
  {
    id: '5',
    title: 'Research Paper Analysis',
    description: 'InsightFlow can analyze and summarize research papers, helping you understand complex academic content quickly.',
    category: 'Feature',
    icon: '📄',
    LucideIcon: FileText,
    detailedInfo: 'The research paper analysis feature uses advanced natural language processing to extract key information from academic papers, providing concise summaries and highlighting important findings.',
  },
  {
    id: '6',
    title: 'Performance Optimized',
    description: 'InsightFlow is optimized for speed and performance, with features like lazy loading and code splitting.',
    category: 'Technology',
    icon: '⚡',
    LucideIcon: Zap,
    detailedInfo: 'The application uses modern web technologies like Next.js, React, and Tailwind CSS to deliver a fast and responsive user experience. Features like code splitting, lazy loading, and optimized assets ensure that the app loads quickly and runs smoothly.',
  },
  {
    id: '7',
    title: 'Animations & Transitions',
    description: 'Smooth animations and transitions enhance the user experience and make the app feel more responsive.',
    category: 'Feature',
    icon: '✨',
    LucideIcon: Sparkles,
    detailedInfo: 'InsightFlow uses Framer Motion to create smooth, natural animations that enhance the user experience without sacrificing performance. These subtle animations provide visual feedback and make the app feel more polished and responsive.',
  },
];

export default function InsightsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filteredInsights, setFilteredInsights] = useState<Insight[]>(insights);
  const [selectedInsight, setSelectedInsight] = useState<Insight | null>(null);
  const [currentFactIndex, setCurrentFactIndex] = useState<number>(0);
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filter insights based on category and search query
  useEffect(() => {
    let filtered = insights;

    if (selectedCategory) {
      filtered = filtered.filter(insight => insight.category === selectedCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        insight =>
          insight.title.toLowerCase().includes(query) ||
          insight.description.toLowerCase().includes(query)
      );
    }

    setFilteredInsights(filtered);
  }, [selectedCategory, searchQuery]);

  // Rotate through "Did You Know" facts every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFactIndex(prev => (prev + 1) % didYouKnowFacts.length);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const categories = Array.from(new Set(insights.map(insight => insight.category)));

  const handleInsightClick = (insight: Insight) => {
    setSelectedInsight(insight);
    setShowDetailModal(true);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'InsightFlow Made By Aniket Kumar',
        text: 'Check out this amazing AI assistant powered by Cerebras Llama 3.3 70B!',
        url: window.location.href
      }).catch(err => {
        console.error('Error sharing:', err);
        // Fallback
        navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
      });
    } else {
      // Fallback for browsers that don't support sharing
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link href="/" className="mr-4">
            <ArrowLeft className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" />
          </Link>
          <h1 className="text-2xl font-semibold flex items-center">
            <Lightbulb className="mr-2" /> Insights
          </h1>
        </div>
        <button
          onClick={handleShare}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          aria-label="Share insights"
        >
          <Share2 size={20} />
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg relative overflow-hidden"
      >
        <div className="flex items-center mb-4">
          <InsightFlowLogo size={32} />
        </div>
        <h2 className="text-xl font-semibold mb-2">Welcome to InsightFlow Insights</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Discover key information about InsightFlow and how it can help you get intelligent answers and insights.
        </p>

        <div className="mt-6 p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
          <h3 className="text-sm font-medium mb-2 flex items-center">
            <Sparkles className="mr-2" size={16} />
            Did you know?
          </h3>
          <AnimatePresence mode="wait">
            <motion.p
              key={currentFactIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="text-sm text-gray-600 dark:text-gray-400"
            >
              {didYouKnowFacts[currentFactIndex].fact}
            </motion.p>
          </AnimatePresence>
        </div>
      </motion.div>

      <div className="mb-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full text-sm transition-colors ${
                selectedCategory === null
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              All
            </button>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Search insights..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 pl-10 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
          />
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {filteredInsights.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-lg font-medium mb-4">No insights found</p>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Try adjusting your search or category filter</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory(null);
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Reset filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredInsights.map((insight, index) => (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index % 2 * 0.1 }}
              onClick={() => handleInsightClick(insight)}
              className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-start">
                {insight.LucideIcon ? (
                  <div className="mr-4 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-500">
                    <insight.LucideIcon size={24} />
                  </div>
                ) : (
                  <div className="text-3xl mr-4">{insight.icon}</div>
                )}
                <div>
                  <h3 className="font-medium text-lg mb-2">{insight.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{insight.description}</p>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="inline-block px-3 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                      {insight.category}
                    </span>
                    <button className="text-blue-500 text-sm hover:underline">
                      Learn more
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <div className="mt-12 text-center text-gray-500 dark:text-gray-400 text-sm">
        <p>InsightFlow v1.0.0 • Created by Aniket Kumar</p>
        <p className="mt-1">Powered by Cerebras Llama 3.3 70B</p>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedInsight && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    {selectedInsight.LucideIcon ? (
                      <div className="mr-4 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-500">
                        <selectedInsight.LucideIcon size={24} />
                      </div>
                    ) : (
                      <div className="text-3xl mr-4">{selectedInsight.icon}</div>
                    )}
                    <h2 className="text-xl font-semibold">{selectedInsight.title}</h2>
                  </div>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    ×
                  </button>
                </div>

                <div className="mb-4">
                  <span className="inline-block px-3 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 mb-4">
                    {selectedInsight.category}
                  </span>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">{selectedInsight.description}</p>
                  {selectedInsight.detailedInfo && (
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg mb-4">
                      <p className="text-gray-600 dark:text-gray-400">{selectedInsight.detailedInfo}</p>
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-2">
                  {selectedInsight.link && (
                    <a
                      href={selectedInsight.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center"
                    >
                      {selectedInsight.linkText || 'Learn more'}
                      <ExternalLink size={16} className="ml-2" />
                    </a>
                  )}
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
