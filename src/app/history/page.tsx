'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft, Clock, Trash2, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import useChatHistory, { ChatSession } from '@/lib/hooks/useChatHistory';
// Format date to relative time (e.g., '2 hours ago')
const formatDistanceToNow = (date: Date | number, options?: { addSuffix?: boolean }) => {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  let timeAgo;
  if (diffInSeconds < 60) {
    timeAgo = 'just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    timeAgo = `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    timeAgo = `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400);
    timeAgo = `${days} ${days === 1 ? 'day' : 'days'}`;
  } else if (diffInSeconds < 31536000) {
    const months = Math.floor(diffInSeconds / 2592000);
    timeAgo = `${months} ${months === 1 ? 'month' : 'months'}`;
  } else {
    const years = Math.floor(diffInSeconds / 31536000);
    timeAgo = `${years} ${years === 1 ? 'year' : 'years'}`;
  }

  return options?.addSuffix ? `${timeAgo} ago` : timeAgo;
};

export default function HistoryPage() {
  const router = useRouter();
  const {
    sessions,
    currentSessionId,
    switchSession,
    deleteSession,
    clearAllSessions,
    isLoaded,
  } = useChatHistory();
  const [isConfirmingClear, setIsConfirmingClear] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSessions, setFilteredSessions] = useState<ChatSession[]>([]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredSessions(sessions);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredSessions(
        sessions.filter(
          (session) =>
            session.title.toLowerCase().includes(query) ||
            session.messages.some((msg) => msg.content.toLowerCase().includes(query))
        )
      );
    }
  }, [searchQuery, sessions]);

  const handleSessionClick = (sessionId: string) => {
    switchSession(sessionId);
    router.push('/');
  };

  const handleDeleteSession = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    deleteSession(sessionId);
  };

  const handleClearAll = () => {
    if (isConfirmingClear) {
      clearAllSessions();
      setIsConfirmingClear(false);
    } else {
      setIsConfirmingClear(true);
      // Auto-reset confirmation state after 5 seconds
      setTimeout(() => setIsConfirmingClear(false), 5000);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link href="/" className="mr-4">
          <ArrowLeft className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" />
        </Link>
        <h1 className="text-2xl font-semibold flex items-center">
          <Clock className="mr-2" /> Chat History
        </h1>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search conversations..."
          className="w-full p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {sessions.length > 0 ? (
        <>
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {filteredSessions.length} {filteredSessions.length === 1 ? 'conversation' : 'conversations'}
            </p>
            <button
              onClick={handleClearAll}
              className={`flex items-center px-3 py-1 rounded-md text-sm ${
                isConfirmingClear
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              <Trash2 size={16} className="mr-1" />
              {isConfirmingClear ? 'Confirm Clear All' : 'Clear All'}
            </button>
          </div>

          <div className="space-y-3">
            {filteredSessions.map((session) => (
              <div
                key={session.id}
                onClick={() => handleSessionClick(session.id)}
                className={`p-4 rounded-lg cursor-pointer transition-colors ${
                  session.id === currentSessionId
                    ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                    : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-start space-x-3">
                    <MessageSquare className="text-gray-400 mt-1" size={18} />
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {session.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                        {session.messages.length > 0
                          ? session.messages[session.messages.length - 1].content
                          : 'No messages'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xs text-gray-500 dark:text-gray-400 mr-3">
                      {formatDistanceToNow(new Date(session.updatedAt), { addSuffix: true })}
                    </span>
                    <button
                      onClick={(e) => handleDeleteSession(e, session.id)}
                      className="text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  {session.messages.length} {session.messages.length === 1 ? 'message' : 'messages'}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">No chat history</h3>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Your conversations will appear here once you start chatting.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Start a new chat
          </Link>
        </div>
      )}
    </div>
  );
}
