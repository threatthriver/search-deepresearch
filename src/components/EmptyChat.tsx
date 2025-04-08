import { Brain, Settings, History, Sparkles, Zap, Search, FileText, Code, BookOpen } from 'lucide-react';
import EmptyChatMessageInput from './EmptyChatMessageInput';
import { useEffect, useState } from 'react';
import { File } from './ChatWindow';
import Link from 'next/link';
import { useLocalStorage } from '@/lib/hooks/useLocalStorage';
import { motion } from 'framer-motion';
import AnimatedCard from './ui/AnimatedCard';
import { useAuth } from '@/lib/firebase/auth/AuthContext';

const EmptyChat = ({
  sendMessage,
  focusMode,
  setFocusMode,
  optimizationMode,
  setOptimizationMode,
  fileIds,
  setFileIds,
  files,
  setFiles,
}: {
  sendMessage: (message: string) => void;
  focusMode: string;
  setFocusMode: (mode: string) => void;
  optimizationMode: string;
  setOptimizationMode: (mode: string) => void;
  fileIds: string[];
  setFileIds: (fileIds: string[]) => void;
  files: File[];
  setFiles: (files: File[]) => void;
}) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { user } = useAuth();

  // Get current model information from localStorage
  const [chatModel] = useLocalStorage<string>('chatModel', '');
  const [chatModelProvider] = useLocalStorage<string>('chatModelProvider', '');

  // Example prompts
  const examplePrompts = [
    {
      title: "Summarize Research Paper",
      prompt: "Summarize this research paper: https://arxiv.org/abs/2402.17764",
      icon: FileText,
      color: "bg-blue-500"
    },
    {
      title: "Explain a Concept",
      prompt: "Explain quantum computing in simple terms",
      icon: BookOpen,
      color: "bg-purple-500"
    },
    {
      title: "Generate Code",
      prompt: "Write a Python function to calculate the Fibonacci sequence",
      icon: Code,
      color: "bg-green-500"
    },
    {
      title: "Web Search",
      prompt: "Search for the latest advancements in AI research",
      icon: Search,
      color: "bg-amber-500"
    },
  ];

  // Format model name for display
  const getDisplayModelName = () => {
    if (chatModelProvider === 'cerebras' && chatModel === 'llama-3.3-70b') {
      return 'Llama 3.3 70B';
    }
    return chatModel?.replace(/-/g, ' ')?.replace(/\b\w/g, l => l.toUpperCase()) || 'AI';
  };

  return (
    <div className="relative">
      <div className="absolute w-full flex flex-row items-center justify-end space-x-4 mr-5 mt-5">
        <Link href="/history">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 cursor-pointer lg:hidden"
          >
            <History size={18} className="text-gray-700 dark:text-gray-300" />
          </motion.div>
        </Link>
        <Link href="/settings">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 cursor-pointer lg:hidden"
          >
            <Settings size={18} className="text-gray-700 dark:text-gray-300" />
          </motion.div>
        </Link>
      </div>

      <div className="flex flex-col items-center justify-center min-h-screen max-w-screen-lg mx-auto p-4 space-y-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center -mt-8 space-y-4"
        >
          <div className="flex items-center mb-2">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{
                duration: 0.5,
                type: "spring",
                stiffness: 200
              }}
              className="relative mr-3"
            >
              <Brain size={40} className="text-blue-500 dark:text-blue-400" />
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.2, 1]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3
                }}
              >
                <Sparkles className="absolute -top-1 -right-1 h-5 w-5 text-amber-500 dark:text-amber-300" />
              </motion.div>
            </motion.div>
            <h2 className="text-black/80 dark:text-white/90 text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
              InsightFlow
            </h2>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <p className="text-black/60 dark:text-white/60 text-center max-w-md text-lg">
              Powered by Cerebras Llama 3.3 70B
            </p>
            <div className="mt-2 text-black/50 dark:text-white/50 text-center text-sm">
              <p>Created by Aniket Kumar</p>
            </div>
          </motion.div>

          {user && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mt-2 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-full"
            >
              <p className="text-blue-700 dark:text-blue-300 text-sm">
                Welcome back, {user.displayName || 'User'}!
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Example prompts */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="w-full max-w-3xl"
        >
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4 text-center">Try asking about</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {examplePrompts.map((example, index) => (
              <AnimatedCard
                key={index}
                delay={index}
                onClick={() => sendMessage(example.prompt)}
                className="p-4 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${example.color} text-white`}>
                    <example.icon size={18} />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">{example.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{example.prompt}</p>
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="w-full max-w-2xl"
        >
          <EmptyChatMessageInput
            sendMessage={sendMessage}
            focusMode={focusMode}
            setFocusMode={setFocusMode}
            optimizationMode={optimizationMode}
            setOptimizationMode={setOptimizationMode}
            fileIds={fileIds}
            setFileIds={setFileIds}
            files={files}
            setFiles={setFiles}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default EmptyChat;
