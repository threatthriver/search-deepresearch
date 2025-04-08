import { Brain, Settings, History, Sparkles } from 'lucide-react';
import EmptyChatMessageInput from './EmptyChatMessageInput';
import { useEffect, useState } from 'react';
import { File } from './ChatWindow';
import Link from 'next/link';
import { useLocalStorage } from '@/lib/hooks/useLocalStorage';

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

  // Get current model information from localStorage
  const [chatModel] = useLocalStorage<string>('chatModel', '');
  const [chatModelProvider] = useLocalStorage<string>('chatModelProvider', '');

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
          <History className="cursor-pointer lg:hidden" />
        </Link>
        <Link href="/settings">
          <Settings className="cursor-pointer lg:hidden" />
        </Link>
      </div>
      <div className="flex flex-col items-center justify-center min-h-screen max-w-screen-sm mx-auto p-2 space-y-8">
        <div className="flex flex-col items-center -mt-8 space-y-4">
          <div className="flex items-center mb-2">
            <div className="relative mr-3">
              <Brain size={36} className="text-blue-500 dark:text-blue-400" />
              <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-amber-500 dark:text-amber-300" />
            </div>
            <h2 className="text-black/80 dark:text-white/90 text-3xl font-medium bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
              InsightFlow
            </h2>
          </div>
          <p className="text-black/60 dark:text-white/60 text-center max-w-md text-lg">
            Powered by Cerebras Llama 3.3 70B
          </p>
          <div className="mt-2 text-black/50 dark:text-white/50 text-center text-sm">
            <p>Created by Aniket Kumar</p>
          </div>
        </div>
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
      </div>
    </div>
  );
};

export default EmptyChat;
