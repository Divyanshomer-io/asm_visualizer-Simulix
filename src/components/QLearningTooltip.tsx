import React, { useState, useRef, useEffect } from 'react';
import { Info } from 'lucide-react';

interface QLearningTooltipProps {
  content: string;
  title?: string;
  side?: "top" | "right" | "bottom" | "left";
  maxWidth?: number;
}

const QLearningTooltip: React.FC<QLearningTooltipProps> = ({ 
  content, 
  title, 
  side = "right", 
  maxWidth = 280 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const iconRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const showTimeoutRef = useRef<NodeJS.Timeout>();
  const hideTimeoutRef = useRef<NodeJS.Timeout>();

  const positionTooltip = () => {
    if (!iconRef.current) return;
    
    const iconRect = iconRef.current.getBoundingClientRect();
    const spacing = 4; // Very close to icon
    
    let left = 0;
    let top = 0;
    
    // Simple positioning - right next to icon
    switch (side) {
      case "right":
        left = iconRect.right + spacing;
        top = iconRect.top;
        break;
      case "left":
        left = iconRect.left - maxWidth - spacing;
        top = iconRect.top;
        break;
      case "bottom":
        left = iconRect.left;
        top = iconRect.bottom + spacing;
        break;
      case "top":
        left = iconRect.left;
        top = iconRect.top - 100 - spacing; // Estimated tooltip height
        break;
    }
    
    // Only check viewport bounds, don't move too much
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Keep within viewport but stay close to icon
    if (left + maxWidth > viewportWidth) {
      left = Math.max(4, viewportWidth - maxWidth - 4);
    }
    if (left < 4) {
      left = 4;
    }
    
    if (top < 4) {
      top = 4;
    }
    if (top + 200 > viewportHeight) {
      top = Math.max(4, viewportHeight - 200 - 4);
    }
    
    setPosition({ x: left, y: top });
  };

  const handleMouseEnter = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }
    showTimeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, 100);
  };

  const handleMouseLeave = () => {
    if (showTimeoutRef.current) {
      clearTimeout(showTimeoutRef.current);
    }
    if (!isPinned) {
      hideTimeoutRef.current = setTimeout(() => {
        setIsVisible(false);
      }, 100);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isVisible) {
      setIsPinned(!isPinned);
    } else {
      setIsVisible(true);
      setIsPinned(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick(e as any);
    }
    if (e.key === 'Escape') {
      setIsVisible(false);
      setIsPinned(false);
    }
  };

  useEffect(() => {
    if (isVisible) {
      positionTooltip();
    }
  }, [isVisible, side, maxWidth]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node) &&
          iconRef.current && !iconRef.current.contains(event.target as Node)) {
        if (isPinned) {
          setIsVisible(false);
          setIsPinned(false);
        }
      }
    };

    const handleScroll = () => {
      if (isVisible) {
        positionTooltip();
      }
    };

    if (isPinned) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    if (isVisible) {
      window.addEventListener('scroll', handleScroll, true);
      window.addEventListener('resize', positionTooltip);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', positionTooltip);
    };
  }, [isPinned, isVisible]);

  const formatContent = (text: string) => {
    return text.split('\n').map((line, index) => {
      // Handle bullet points
      if (line.trim().startsWith('•')) {
        return (
          <div key={index} className="flex items-start gap-2 mb-1">
            <span className="text-blue-400 text-sm">•</span>
            <span className="text-xs leading-relaxed">{line.trim().substring(1).trim()}</span>
          </div>
        );
      }
      // Handle formula lines
      if (line.includes('←') || line.includes('×') || line.includes('=')) {
        return (
          <div key={index} className="bg-slate-800/50 px-2 py-1 rounded font-mono text-xs my-2 border-l-2 border-blue-400">
            {line.trim()}
          </div>
        );
      }
      // Regular lines
      if (line.trim()) {
        return (
          <div key={index} className="mb-2 text-xs leading-relaxed">
            {line.trim()}
          </div>
        );
      }
      return null;
    });
  };

  return (
    <>
      <div
        ref={iconRef}
        className="inline-flex items-center justify-center w-4 h-4 bg-blue-500 text-white rounded-full cursor-pointer hover:bg-blue-600 transition-colors ml-1 text-xs font-bold flex-shrink-0"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-label="Show information"
        style={{ fontSize: '10px' }}
      >
        <Info className="w-2.5 h-2.5" />
      </div>
      
      {isVisible && (
        <div
          ref={tooltipRef}
          className="fixed z-[99999] bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-blue-500/50 rounded-lg p-3 text-gray-100 shadow-2xl backdrop-blur-sm"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            maxWidth: `${maxWidth}px`,
            minWidth: '200px',
            pointerEvents: isPinned ? 'auto' : 'none'
          }}
          onMouseEnter={() => {
            if (hideTimeoutRef.current) {
              clearTimeout(hideTimeoutRef.current);
            }
          }}
          onMouseLeave={() => {
            if (!isPinned) {
              hideTimeoutRef.current = setTimeout(() => {
                setIsVisible(false);
              }, 100);
            }
          }}
        >
          {title && (
            <div className="font-semibold text-sm mb-2 border-b border-blue-400/30 pb-1 text-blue-300">
              {title}
            </div>
          )}
          <div className="text-xs leading-relaxed">
            {formatContent(content)}
          </div>
          
          {isPinned && (
            <div className="absolute top-1 right-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default QLearningTooltip;
