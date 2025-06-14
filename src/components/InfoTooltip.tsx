
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
    
    const iconRect = iconRef.current.getBoundingClientRect();
    let x = iconRect.right + 10;
    let y = iconRect.top;
    
    // Adjust position based on side prop
    switch (side) {
      case 'left':
        x = iconRect.left - 10;
        y = iconRect.top;
        break;
      case 'top':
        x = iconRect.left;
        y = iconRect.top - 10;
        break;
      case 'bottom':
        x = iconRect.left;
        y = iconRect.bottom + 10;
        break;
      default: // right
        x = iconRect.right + 10;
        y = iconRect.top;
    }
    
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
        newX = window.innerWidth - tooltipRect.width - 20;
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
        return 'bg-yellow-900/90 border-yellow-500/50 text-yellow-100';
      case 'error':
        return 'bg-red-900/90 border-red-500/50 text-red-100';
      default:
        return 'bg-gray-900/95 border-gray-500/50 text-white';
    }
  };

  return (
    <>
      <span
        ref={iconRef}
        role="button"
        aria-label="More information"
        tabIndex={0}
        className={`inline-flex items-center justify-center w-4 h-4 text-xs cursor-help text-blue-400 ml-2 hover:text-blue-300 transition-colors rounded-full border border-blue-400/50 ${className}`}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={(e) => showTooltip(e as any)}
        onBlur={hideTooltip}
      >
        ?
      </span>
      
      {isVisible && (
        <div
          ref={tooltipRef}
          className={`fixed z-[99999] border rounded-lg p-4 text-sm leading-relaxed max-w-[320px] shadow-2xl backdrop-blur-sm ${getVariantStyles()}`}
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
            className="absolute top-2 right-2 text-gray-400 hover:text-white transition-colors"
            aria-label="Close tooltip"
          >
            <X size={14} />
          </button>
          <div className="pr-6">
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

// VAE Tooltips content definitions
export const VAETooltips = {
  latentDimension: {
    content: "<b>Latent Dimension:</b><br/>The size of the compressed representation. Lower values = more compression but potentially lower quality. Higher values = less compression but better reconstruction.",
    variant: "info" as const
  },
  nuclearNorm: {
    content: "<b>Regularization:</b><br/>• <b>Nuclear Norm:</b> Promotes low-rank structure in latent space<br/>• <b>Log-Det Majorizer:</b> Alternative low-rank promotion method<br/>• <b>None:</b> No regularization (may overfit)",
    variant: "info" as const
  },
  epochs: {
    content: "<b>Training Epochs:</b><br/>Number of complete passes through the training data. More epochs = longer training but potentially better results. Watch for overfitting with too many epochs.",
    variant: "info" as const
  },
  mnistReconstruction: {
    content: "<b>MNIST Reconstruction:</b><br/>Shows how well the VAE can reconstruct handwritten digits after compression through the latent space. Better reconstruction indicates better learned representations.",
    variant: "info" as const
  },
  lossComponents: {
    content: "<b>Loss Components:</b><br/>• <b>Total Loss:</b> Overall training objective<br/>• <b>Reconstruction:</b> How well images are rebuilt<br/>• <b>KL Divergence:</b> Regularization term<br/>• <b>Regularization:</b> Low-rank penalty",
    variant: "info" as const
  },
  qualityEvolution: {
    content: "<b>Quality Evolution:</b><br/>Tracks reconstruction fidelity over training epochs. Quality improves as the model learns better representations of the input data.",
    variant: "info" as const
  }
};

export default InfoTooltip;
