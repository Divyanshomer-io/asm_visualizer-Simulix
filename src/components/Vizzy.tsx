import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Maximize2, Minimize2 } from 'lucide-react';
import { useVizzy } from '@/contexts/VizzyContext';
import { callGeminiAPI } from '@/api/vizzy-chat';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const Vizzy: React.FC = () => {
  const {
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
  } = useVizzy();

  const [currentMessage, setCurrentMessage] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isMaximized, setIsMaximized] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    "What is Simulix?",
    "How does simulated annealing work?",
    "Explain bootstrapping in statistics",
    "What is the bias-variance tradeoff?",
    "How do random forests work?",
    "What is importance sampling?",
    "Explain neural networks simply",
    "What is the Huber M-estimator?",
  ];

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isOpen) return;
    setIsDragging(true);
    const rect = iconRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    
    const newX = Math.max(0, Math.min(window.innerWidth - 60, e.clientX - dragOffset.x));
    const newY = Math.max(0, Math.min(window.innerHeight - 60, e.clientY - dragOffset.y));
    
    setPosition({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;
    
    if (!apiKey) {
      toast.error('Please enter your Gemini API key first');
      return;
    }

    addMessage({ type: 'user', content: message });
    setCurrentMessage('');
    setIsLoading(true);

    try {
      const response = await callGeminiAPI(message, apiKey);
      addMessage({ type: 'assistant', content: response });
    } catch (error) {
      console.error('Chat error:', error);
      addMessage({ 
        type: 'assistant', 
        content: 'Sorry, I encountered an error. Please check your API key and try again.' 
      });
      toast.error('Failed to get response from Vizzy');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(currentMessage);
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen && messages.length === 0) {
      addMessage({
        type: 'assistant',
        content: "Hi! I'm Vizzy, your AI guide for Simulix. I can help you understand data science concepts, explain our visualizations, and answer questions about statistical methods. How can I help you today?"
      });
    }
  };

  return (
    <>
      {/* Floating Icon */}
      <div
        ref={iconRef}
        className={`fixed z-50 transition-all duration-300 ${
          isDragging ? 'cursor-grabbing' : 'cursor-pointer'
        } ${isOpen ? 'scale-0' : 'scale-100'}`}
        style={{
          left: position.x,
          top: position.y,
        }}
        onMouseDown={handleMouseDown}
        onClick={!isDragging ? toggleChat : undefined}
      >
        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group hover:scale-110">
          <MessageCircle className="w-6 h-6 text-white" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 ${
            isMaximized 
              ? 'inset-4' 
              : 'bottom-4 left-4 w-96 h-[500px]'
          }`}
        >
          <div className="glass-panel border border-white/20 rounded-xl shadow-2xl h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Vizzy</h3>
                  <p className="text-xs text-gray-400">AI Assistant for Simulix</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMaximized(!isMaximized)}
                  className="text-gray-400 hover:text-white"
                >
                  {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* API Key Input Section */}
            <div className="p-4 border-b border-white/10 bg-blue-900/20">
              <div className="space-y-2">
                <label className="text-sm text-gray-300">Gemini API Key:</label>
                <Input
                  type="password"
                  placeholder="Enter your Gemini API key..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="bg-background/50 text-white placeholder-gray-400"
                />
                <p className="text-xs text-gray-400">
                  Get your API key from{' '}
                  <a href="https://ai.google.dev/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                    Google AI Studio
                  </a>
                </p>
              </div>
            </div>

            {/* Messages */}
            <div
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-4 space-y-4"
            >
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.type === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-100'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-700 p-3 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Suggested Questions */}
            {messages.length <= 1 && (
              <div className="p-4 border-t border-white/10">
                <p className="text-sm text-gray-400 mb-2">Quick questions:</p>
                <div className="flex flex-wrap gap-1">
                  {suggestedQuestions.slice(0, 4).map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(question)}
                      className="text-xs px-2 py-1 bg-blue-900/30 text-blue-300 rounded-full hover:bg-blue-800/40 transition-colors"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-white/10">
              <div className="flex gap-2">
                <Textarea
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me about data science or Simulix..."
                  className="flex-1 bg-background/50 border-white/10 text-white placeholder-gray-400 resize-none"
                  rows={1}
                />
                <Button
                  onClick={() => handleSendMessage(currentMessage)}
                  disabled={!currentMessage.trim() || isLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Vizzy;
