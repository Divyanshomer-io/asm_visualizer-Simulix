
import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';

interface InfoTooltipProps {
  content: string | React.ReactNode;
  className?: string;
  variant?: 'info' | 'warning' | 'error';
  side?: 'top' | 'bottom' | 'left' | 'right';
}

const InfoTooltip: React.FC<InfoTooltipProps> = ({ 
  content, 
  className = '', 
  variant = 'info',
  side = 'right'
}) => {
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

  // Close on outside click when visible
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node) &&
          iconRef.current && !iconRef.current.contains(event.target as Node)) {
        hideTooltip();
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isVisible]);

  const getVariantStyles = () => {
    switch (variant) {
      case 'warning':
        return 'bg-yellow-800 border-yellow-600 text-yellow-100';
      case 'error':
        return 'bg-red-800 border-red-600 text-red-100';
      default:
        return 'bg-gray-800 border-gray-600 text-white';
    }
  };

  return (
    <>
      <span
        ref={iconRef}
        role="button"
        aria-label="More information"
        tabIndex={0}
        className={`info-icon cursor-help text-blue-400 ml-2 text-sm hover:text-blue-300 transition-colors ${className}`}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={(e) => showTooltip(e as any)}
        onBlur={hideTooltip}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (isVisible) {
              hideTooltip();
            } else {
              showTooltip(e as any);
            }
          }
        }}
      >
        ⓘ
      </span>
      
      {isVisible && (
        <div
          ref={tooltipRef}
          className={`fixed z-[9999] border rounded-md p-3 text-sm leading-relaxed max-w-[280px] shadow-lg ${getVariantStyles()}`}
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
          }}
          onMouseEnter={() => setIsVisible(true)}
          onMouseLeave={hideTooltip}
        >
          <button
            onClick={hideTooltip}
            className="absolute top-1 right-1 text-gray-400 hover:text-white transition-colors"
            aria-label="Close tooltip"
          >
            <X size={14} />
          </button>
          <div className="pr-4">
            {typeof content === 'string' ? (
              <div dangerouslySetInnerHTML={{ __html: content }} />
            ) : (
              content
            )}
          </div>
        </div>
      )}
    </>
  );
};

// VAE-specific tooltip content
export const VAETooltips = {
  latentDimension: {
    content: "<b>Latent Dimension:</b><br>• Size of the compressed representation<br>• Lower dimensions = more compression<br>• Higher dimensions = better reconstruction<br>• Trade-off between quality and efficiency"
  },
  nuclearNorm: {
    content: "<b>Nuclear Norm Regularization:</b><br>• Promotes low-rank structure in latent space<br>• Higher λ = stronger regularization<br>• Helps prevent overfitting<br>• Encourages sparse latent representations"
  },
  epochs: {
    content: "<b>Training Epochs:</b><br>• Number of complete passes through data<br>• More epochs = longer training<br>• Watch for overfitting with too many epochs<br>• Quality typically improves with more training"
  },
  mnistReconstruction: {
    content: "<b>MNIST Reconstruction:</b><br>• Shows how well the VAE reconstructs handwritten digits<br>• Top row: original images<br>• Bottom row: reconstructed images<br>• Better models show cleaner reconstructions"
  },
  lossComponents: {
    content: "<b>Loss Components:</b><br>• Total Loss: Overall training objective<br>• Reconstruction Loss: How well images are reconstructed<br>• KL Divergence: Regularization term for latent space<br>• Regularization Loss: Nuclear norm penalty"
  },
  qualityEvolution: {
    content: "<b>Quality Evolution:</b><br>• Tracks reconstruction quality over training<br>• Quality improves as model learns<br>• Plateaus indicate convergence<br>• Drops may indicate overfitting"
  }
};

export default InfoTooltip;
