
import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';

interface InfoTooltipProps {
  content: string;
  className?: string;
}

const InfoTooltip: React.FC<InfoTooltipProps> = ({ content, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const iconRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const showTooltip = (event: React.MouseEvent) => {
    event.stopPropagation();
    
    if (!iconRef.current || !tooltipRef.current) return;
    
    setIsVisible(true);
    
    // Get icon position
    const iconRect = iconRef.current.getBoundingClientRect();
    let x = iconRect.right + 10;
    let y = iconRect.top;
    
    // Wait for next frame to get tooltip dimensions
    setTimeout(() => {
      if (!tooltipRef.current) return;
      
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      
      // Right boundary check
      if (x + tooltipRect.width > window.innerWidth - 10) {
        x = iconRect.left - tooltipRect.width - 10;
      }
      
      // Bottom boundary check
      if (y + tooltipRect.height > window.innerHeight - 10) {
        y = iconRect.bottom - tooltipRect.height;
      }
      
      // Top boundary check
      if (y < 10) {
        y = 10;
      }
      
      // Left boundary check
      if (x < 10) {
        x = 10;
      }
      
      setPosition({ x, y });
    }, 0);
  };

  const hideTooltip = () => {
    setIsVisible(false);
  };

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        hideTooltip();
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isVisible]);

  return (
    <>
      <span
        ref={iconRef}
        role="button"
        aria-label="More information"
        tabIndex={0}
        className={`info-icon cursor-help text-blue-400 ml-2 text-sm hover:text-blue-300 transition-colors ${className}`}
        onClick={showTooltip}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            showTooltip(e as any);
          }
        }}
      >
        ⓘ
      </span>
      
      {isVisible && (
        <div
          ref={tooltipRef}
          className="fixed z-[9999] bg-gray-800 border border-gray-600 rounded-md p-3 text-white text-sm leading-relaxed max-w-[280px] shadow-lg"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
          }}
        >
          <button
            onClick={hideTooltip}
            className="absolute top-1 right-1 text-gray-400 hover:text-white transition-colors"
            aria-label="Close tooltip"
          >
            <X size={14} />
          </button>
          <div 
            className="pr-4"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      )}
    </>
  );
};

export default InfoTooltip;
