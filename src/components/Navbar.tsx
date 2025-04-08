import { Clock, Edit, Share, Trash, Download, Copy, Star, StarOff } from 'lucide-react';
import { Message } from './ChatWindow';
import { useEffect, useState } from 'react';
import { formatTimeDifference } from '@/lib/utils';
import DeleteChat from './DeleteChat';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import AnimatedButton from './ui/AnimatedButton';
import { useAuth } from '@/lib/firebase/auth/AuthContext';

const Navbar = ({
  chatId,
  messages,
}: {
  messages: Message[];
  chatId: string;
}) => {
  const [title, setTitle] = useState<string>('');
  const [timeAgo, setTimeAgo] = useState<string>('');
  const [isStarred, setIsStarred] = useState<boolean>(false);
  const [isShareMenuOpen, setIsShareMenuOpen] = useState<boolean>(false);
  const { user } = useAuth();

  useEffect(() => {
    if (messages.length > 0) {
      const newTitle =
        messages[0].content.length > 20
          ? `${messages[0].content.substring(0, 20).trim()}...`
          : messages[0].content;
      setTitle(newTitle);
      const newTimeAgo = formatTimeDifference(
        new Date(),
        messages[0].createdAt,
      );
      setTimeAgo(newTimeAgo);
    }
  }, [messages]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (messages.length > 0) {
        const newTimeAgo = formatTimeDifference(
          new Date(),
          messages[0].createdAt,
        );
        setTimeAgo(newTimeAgo);
      }
    }, 1000);

    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Check if chat is starred
  useEffect(() => {
    if (user && chatId) {
      // Get starred chats from localStorage
      const starredChats = JSON.parse(localStorage.getItem('starredChats') || '[]');
      setIsStarred(starredChats.includes(chatId));
    }
  }, [chatId, user]);

  // Handle starring/unstarring chat
  const handleStarToggle = () => {
    if (!user) {
      toast.error('Please log in to star conversations');
      return;
    }

    // Get current starred chats
    const starredChats = JSON.parse(localStorage.getItem('starredChats') || '[]');

    if (isStarred) {
      // Remove from starred
      const updatedStarredChats = starredChats.filter((id: string) => id !== chatId);
      localStorage.setItem('starredChats', JSON.stringify(updatedStarredChats));
      setIsStarred(false);
      toast.success('Removed from favorites');
    } else {
      // Add to starred
      starredChats.push(chatId);
      localStorage.setItem('starredChats', JSON.stringify(starredChats));
      setIsStarred(true);
      toast.success('Added to favorites');
    }
  };

  // Handle sharing chat
  const handleShare = () => {
    setIsShareMenuOpen(!isShareMenuOpen);
  };

  // Copy chat link to clipboard
  const copyToClipboard = () => {
    const url = `${window.location.origin}/?chatId=${chatId}`;
    navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard');
    setIsShareMenuOpen(false);
  };

  // Download chat as text
  const downloadChat = () => {
    if (messages.length === 0) {
      toast.error('No messages to download');
      return;
    }

    const chatContent = messages
      .map((msg) => `${msg.role === 'user' ? 'You' : 'AI'}: ${msg.content}`)
      .join('\n\n');

    const blob = new Blob([chatContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('Chat downloaded successfully');
    setIsShareMenuOpen(false);
  };

  return (
    <div className="fixed z-40 top-0 left-0 right-0 px-4 lg:pl-[104px] lg:pr-6 lg:px-8 flex flex-row items-center justify-between w-full py-4 text-sm text-black dark:text-white/70 border-b bg-light-primary dark:bg-dark-primary border-light-100 dark:border-dark-200">
      <motion.a
        href="/"
        whileTap={{ scale: 0.95 }}
        className="transition duration-100 cursor-pointer lg:hidden bg-gray-100 dark:bg-gray-800 p-2 rounded-full"
      >
        <Edit size={17} />
      </motion.a>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="hidden lg:flex flex-row items-center justify-center space-x-2 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full"
      >
        <Clock size={16} className="text-blue-500" />
        <p className="text-xs font-medium">{timeAgo} ago</p>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="hidden lg:flex font-medium truncate max-w-md"
      >
        {title}
      </motion.p>

      <div className="flex flex-row items-center space-x-3">
        {/* Star button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleStarToggle}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          title={isStarred ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isStarred ? (
            <Star size={18} className="text-yellow-500 fill-yellow-500" />
          ) : (
            <StarOff size={18} />
          )}
        </motion.button>

        {/* Share button with dropdown */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleShare}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title="Share conversation"
          >
            <Share size={18} />
          </motion.button>

          {isShareMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden z-50"
            >
              <div className="py-1">
                <button
                  onClick={copyToClipboard}
                  className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Copy size={16} className="mr-2" />
                  Copy link
                </button>
                <button
                  onClick={downloadChat}
                  className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Download size={16} className="mr-2" />
                  Download chat
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Delete chat button */}
        <DeleteChat redirect chatId={chatId} chats={[]} setChats={() => {}} />
      </div>
    </div>
  );
};

export default Navbar;
