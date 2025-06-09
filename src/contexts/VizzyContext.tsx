
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface VizzyContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  messages: ChatMessage[];
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  position: { x: number; y: number };
  setPosition: (position: { x: number; y: number }) => void;
  apiKey: string;
  setApiKey: (key: string) => void;
}

const VizzyContext = createContext<VizzyContextType | undefined>(undefined);

export const useVizzy = () => {
  const context = useContext(VizzyContext);
  if (!context) {
    throw new Error('useVizzy must be used within a VizzyProvider');
  }
  return context;
};

interface VizzyProviderProps {
  children: ReactNode;
}

export const VizzyProvider: React.FC<VizzyProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: window.innerHeight - 100 });
  const [apiKey, setApiKey] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('vizzy_gemini_api_key') || '';
    }
    return '';
  });

  const addMessage = (message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMessage: ChatMessage = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
  };

  // Save API key to localStorage when it changes
  React.useEffect(() => {
    if (typeof window !== 'undefined' && apiKey) {
      localStorage.setItem('vizzy_gemini_api_key', apiKey);
    }
  }, [apiKey]);

  return (
    <VizzyContext.Provider
      value={{
        isOpen,
        setIsOpen,
        messages,
        addMessage,
        isLoading,
        setIsLoading,
        position,
        setPosition,
        apiKey,
        setApiKey,
      }}
    >
      {children}
    </VizzyContext.Provider>
  );
};
