import { useState, useEffect } from 'react';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
}

const STORAGE_KEY = 'insightflow_chat_history';

export function useChatHistory() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load chat history from localStorage on component mount
  useEffect(() => {
    const loadHistory = () => {
      try {
        const storedHistory = localStorage.getItem(STORAGE_KEY);
        if (storedHistory) {
          const parsedHistory = JSON.parse(storedHistory) as {
            sessions: ChatSession[];
            currentSessionId: string | null;
          };
          setSessions(parsedHistory.sessions);
          setCurrentSessionId(parsedHistory.currentSessionId);
        }
      } catch (error) {
        console.error('Error loading chat history:', error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadHistory();
  }, []);

  // Save chat history to localStorage whenever it changes
  useEffect(() => {
    if (!isLoaded) return;

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          sessions,
          currentSessionId,
        })
      );
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  }, [sessions, currentSessionId, isLoaded]);

  // Create a new chat session
  const createSession = (title: string = 'New Chat'): string => {
    const id = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const now = Date.now();
    
    const newSession: ChatSession = {
      id,
      title,
      messages: [],
      createdAt: now,
      updatedAt: now,
    };
    
    setSessions((prev) => [...prev, newSession]);
    setCurrentSessionId(id);
    return id;
  };

  // Get the current chat session
  const getCurrentSession = (): ChatSession | null => {
    if (!currentSessionId) return null;
    return sessions.find((session) => session.id === currentSessionId) || null;
  };

  // Add a message to the current session
  const addMessage = (role: 'user' | 'assistant', content: string): void => {
    if (!currentSessionId) {
      const newSessionId = createSession();
      setCurrentSessionId(newSessionId);
    }
    
    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const now = Date.now();
    
    const newMessage: ChatMessage = {
      id: messageId,
      role,
      content,
      timestamp: now,
    };
    
    setSessions((prev) => 
      prev.map((session) => 
        session.id === currentSessionId
          ? {
              ...session,
              messages: [...session.messages, newMessage],
              updatedAt: now,
              // Update title based on first user message if it's still the default
              title: session.title === 'New Chat' && role === 'user' && session.messages.length === 0
                ? content.substring(0, 30) + (content.length > 30 ? '...' : '')
                : session.title,
            }
          : session
      )
    );
  };

  // Switch to a different session
  const switchSession = (sessionId: string): void => {
    if (sessions.some((session) => session.id === sessionId)) {
      setCurrentSessionId(sessionId);
    }
  };

  // Delete a session
  const deleteSession = (sessionId: string): void => {
    setSessions((prev) => prev.filter((session) => session.id !== sessionId));
    
    if (currentSessionId === sessionId) {
      const remainingSessions = sessions.filter((session) => session.id !== sessionId);
      setCurrentSessionId(remainingSessions.length > 0 ? remainingSessions[0].id : null);
    }
  };

  // Clear all sessions
  const clearAllSessions = (): void => {
    setSessions([]);
    setCurrentSessionId(null);
  };

  // Get all sessions
  const getAllSessions = (): ChatSession[] => {
    return [...sessions].sort((a, b) => b.updatedAt - a.updatedAt);
  };

  return {
    sessions: getAllSessions(),
    currentSession: getCurrentSession(),
    currentSessionId,
    isLoaded,
    createSession,
    addMessage,
    switchSession,
    deleteSession,
    clearAllSessions,
  };
}

export default useChatHistory;
