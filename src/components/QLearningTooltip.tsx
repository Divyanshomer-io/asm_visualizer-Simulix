
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
  maxWidth = 320 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const iconRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const showTimeoutRef = useRef<NodeJS.Timeout>();
  const hideTimeoutRef = useRef<NodeJS.Timeout>();

  const positionTooltip = () => {
    if (!iconRef.current || !tooltipRef.current) return;
    
    const iconRect = iconRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    
    let left = iconRect.right + 10;
    let top = iconRect.top - tooltipRect.height / 2;
    
    // Smart positioning to avoid screen edges
    if (left + tooltipRect.width > window.innerWidth) {
      left = iconRect.left - tooltipRect.width - 10;
    }
    if (top < 10) top = 10;
    if (top + tooltipRect.height > window.innerHeight - 10) {
      top = window.innerHeight - tooltipRect.height - 10;
    }
    
    setPosition({ x: left, y: top });
  };

  const handleMouseEnter = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }
    showTimeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, 300);
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
  }, [isVisible]);

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

    if (isPinned) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isPinned]);

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
        className="info-icon inline-flex items-center justify-center w-4 h-4 bg-blue-500 text-white rounded-full cursor-pointer hover:bg-blue-600 transition-colors ml-2 text-xs font-bold"
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
          className="tooltip-container fixed z-[9999] bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-blue-500/50 rounded-lg p-3 text-gray-100 shadow-2xl backdrop-blur-sm opacity-0 animate-in fade-in-0 zoom-in-95 duration-200"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            maxWidth: `${maxWidth}px`,
            pointerEvents: isPinned ? 'auto' : 'none',
            opacity: 1,
            animationFillMode: 'forwards'
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
          
          {/* Tooltip arrow */}
          <div 
            className="absolute w-2 h-2 bg-gradient-to-br from-slate-800 to-slate-900 transform rotate-45 border-l border-t border-blue-500/50"
            style={{
              left: '-5px',
              top: '50%',
              transform: 'translateY(-50%) rotate(45deg)'
            }}
          />
        </div>
      )}
    </>
  );
};

export default QLearningTooltip;
