
import React, { useState } from "react";
import { Info } from "lucide-react";

interface InfoTooltipProps {
  content: React.ReactNode;
  title?: string;
  side?: "top" | "right" | "bottom" | "left";
  variant?: 'info' | 'warning' | 'technical';
  maxWidth?: number;
}

const InfoTooltip: React.FC<InfoTooltipProps> = ({ 
  content, 
  title, 
  side = "left", 
  variant = 'info',
  maxWidth = 320 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  
  const tooltipVariants = {
    info: 'info-tooltip-info',
    warning: 'info-tooltip-warning',
    technical: 'info-tooltip-technical'
  };
  
  const positionClasses = {
    top: 'bottom-full mb-2 left-1/2 transform -translate-x-1/2',
    bottom: 'top-full mt-2 left-1/2 transform -translate-x-1/2',
    left: 'right-full mr-2 top-1/2 transform -translate-y-1/2',
    right: 'left-full ml-2 top-1/2 transform -translate-y-1/2'
  };

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 -mt-1',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 -mb-1',
    left: 'left-full top-1/2 -translate-y-1/2 -ml-1',
    right: 'right-full top-1/2 -translate-y-1/2 -mr-1'
  };

  return (
    <div className="relative inline-block">
      <div
        className="info-tooltip-trigger"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
        tabIndex={0}
        role="button"
        aria-label={`Show information about ${title || 'this topic'}`}
      >
        <Info className="w-4 h-4" />
      </div>
      
      {isVisible && (
        <div 
          className={`info-tooltip-box ${tooltipVariants[variant]} ${positionClasses[side]}`}
          style={{ 
            width: 'min(320px, 90vw)',
            minHeight: '180px',
            maxHeight: '400px'
          }}
          role="tooltip"
          aria-live="polite"
        >
          {title && (
            <div className="info-tooltip-title">
              {title}
            </div>
          )}
          <div className="info-tooltip-content">
            {content}
          </div>
          
          {/* Tooltip arrow */}
          <div 
            className={`info-tooltip-arrow ${arrowClasses[side]}`}
          />
        </div>
      )}
    </div>
  );
};

// VAE-specific tooltip content definitions
export const VAETooltips = {
  latentDimension: {
    title: "Latent Dimension",
    content: (
      <div>
        <p className="mb-2">Size of the compressed representation space.</p>
        <ul className="space-y-1 text-sm">
          <li>• <strong>Higher values (80-100):</strong> Better reconstruction quality</li>
          <li>• <strong>Lower values (10-30):</strong> More compression, possible quality loss</li>
          <li>• <strong>Original MNIST:</strong> 784 dimensions (28×28 pixels)</li>
        </ul>
        <p className="mt-2 text-blue-300 text-sm">
          Current compression ratio: {((50/784)*100).toFixed(1)}% of original size
        </p>
      </div>
    ),
    variant: 'technical' as const
  },
  
  nuclearNorm: {
    title: "Nuclear Norm Regularization",
    content: (
      <div>
        <p className="mb-2"><code className="bg-black/30 px-1 rounded">||Z||* = Σσᵢ</code> (sum of singular values)</p>
        <ul className="space-y-1 text-sm">
          <li>• Forces latent vectors to be low-rank</li>
          <li>• Higher λ → stronger compression → blurrier reconstructions</li>
          <li>• λ=0: No constraint, λ=500: Very aggressive compression</li>
        </ul>
        <p className="mt-2 text-yellow-300 text-sm">
          Trade-off: Compression efficiency vs. reconstruction quality
        </p>
      </div>
    ),
    variant: 'technical' as const
  },
  
  epochs: {
    title: "Training Epochs",
    content: (
      <div>
        <p className="mb-2">Number of complete passes through the training dataset.</p>
        <ul className="space-y-1 text-sm">
          <li>• <strong>Early epochs (1-10):</strong> Rapid loss decrease, poor reconstructions</li>
          <li>• <strong>Mid epochs (10-30):</strong> Quality improvements, rank reduction</li>
          <li>• <strong>Late epochs (30-50):</strong> Fine-tuning, diminishing returns</li>
        </ul>
        <p className="mt-2 text-green-300 text-sm">
          More epochs = better convergence but longer training time
        </p>
      </div>
    ),
    variant: 'info' as const
  },
  
  lossComponents: {
    title: "VAE Loss Components",
    content: (
      <div>
        <p className="mb-2">Total Loss = Reconstruction + KL + Regularization</p>
        <ul className="space-y-1 text-sm">
          <li>• <span className="text-blue-300">Total Loss:</span> Combined optimization objective</li>
          <li>• <span className="text-green-300">Reconstruction:</span> How well images are rebuilt (MSE)</li>
          <li>• <span className="text-purple-300">KL Divergence:</span> Latent space regularization</li>
          <li>• <span className="text-orange-300">Regularization:</span> Rank penalty (nuclear/majorizer)</li>
        </ul>
        <p className="mt-2 text-gray-300 text-sm">
          Watch for: Exponential decay pattern indicates good training
        </p>
      </div>
    ),
    variant: 'technical' as const
  },
  
  qualityEvolution: {
    title: "Reconstruction Quality Evolution",
    content: (
      <div>
        <p className="mb-2">Measures how closely reconstructions match original digits.</p>
        <ul className="space-y-1 text-sm">
          <li>• <strong>0-30%:</strong> Very blurry, barely recognizable</li>
          <li>• <strong>30-60%:</strong> Recognizable shapes, some blur</li>
          <li>• <strong>60-90%:</strong> Clear digits with minor artifacts</li>
        </ul>
        <p className="mt-2 text-green-300 text-sm">
          S-curve shape indicates healthy VAE training progression
        </p>
      </div>
    ),
    variant: 'info' as const
  },
  
  mnistReconstruction: {
    title: "Progressive MNIST Reconstruction",
    content: (
      <div>
        <p className="mb-2"><strong className="text-yellow-300">⚠️ Synthetic Data Notice:</strong></p>
        <p className="mb-2 text-sm">We use algorithmically generated digit patterns instead of real MNIST data due to:</p>
        <ul className="space-y-1 text-sm">
          <li>• Browser CORS limitations for external datasets</li>
          <li>• Bundle size constraints (real MNIST = 60,000 images)</li>
          <li>• Performance optimization for smooth real-time training</li>
        </ul>
        <p className="mt-2 text-blue-300 text-sm">
          The synthetic patterns demonstrate the same VAE principles as real handwritten digits.
        </p>
        <p className="mt-2 text-gray-300 text-sm">
          <strong>Training Effect:</strong> Images progressively improve from blurry noise to clear digit shapes.
        </p>
      </div>
    ),
    variant: 'warning' as const
  }
};

export default InfoTooltip;
