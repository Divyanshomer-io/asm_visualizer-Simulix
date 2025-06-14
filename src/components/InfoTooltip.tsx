
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
    
    if (!iconRef.current) return;
    
    // Get icon position immediately
    const iconRect = iconRef.current.getBoundingClientRect();
    const x = iconRect.right + 10;
    const y = iconRect.top;
    
    setPosition({ x, y });
    setIsVisible(true);
  };

  const hideTooltip = () => {
    setIsVisible(false);
  };

  // Adjust position if tooltip goes off screen
  useEffect(() => {
    if (isVisible && tooltipRef.current) {
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      let newX = position.x;
      let newY = position.y;
      
      // Right boundary check
      if (newX + tooltipRect.width > window.innerWidth - 20) {
        newX = position.x - tooltipRect.width - 20;
      }
      
      // Bottom boundary check
      if (newY + tooltipRect.height > window.innerHeight - 20) {
        newY = window.innerHeight - tooltipRect.height - 20;
      }
      
      // Top boundary check
      if (newY < 20) {
        newY = 20;
      }
      
      // Left boundary check
      if (newX < 20) {
        newX = 20;
      }
      
      if (newX !== position.x || newY !== position.y) {
        setPosition({ x: newX, y: newY });
      }
    }
  }, [isVisible, position.x, position.y]);

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
      >
        ⓘ
      </span>
      
      {isVisible && (
        <div
          ref={tooltipRef}
          className={`fixed z-[99999] border rounded-md p-3 text-sm leading-relaxed max-w-[280px] shadow-xl ${getVariantStyles()}`}
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            pointerEvents: 'auto'
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
