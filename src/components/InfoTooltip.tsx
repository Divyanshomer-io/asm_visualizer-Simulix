
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
  maxWidth = 350 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  
  const tooltipVariants = {
    info: 'bg-slate-800/95 border-blue-500/50 text-blue-100 backdrop-blur-sm',
    warning: 'bg-orange-900/95 border-orange-500/50 text-orange-100 backdrop-blur-sm',
    technical: 'bg-slate-900/95 border-gray-500/50 text-gray-100 backdrop-blur-sm'
  };
  
  const positionClasses = {
    top: 'bottom-full mb-3 left-1/2 transform -translate-x-1/2',
    bottom: 'top-full mt-3 left-1/2 transform -translate-x-1/2',
    left: 'right-full mr-3 top-1/2 transform -translate-y-1/2',
    right: 'left-full ml-3 top-1/2 transform -translate-y-1/2'
  };

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-slate-800/95',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-slate-800/95',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-slate-800/95',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-slate-800/95'
  };

  return (
    <div className="relative inline-block">
      <div
        className="w-4 h-4 rounded-full bg-blue-500/80 hover:bg-blue-400 text-white text-xs flex items-center justify-center cursor-help transition-all duration-200 hover:scale-110"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        <Info className="w-2.5 h-2.5" />
      </div>
      
      {isVisible && (
        <div 
          className={`absolute z-[99999] p-4 rounded-lg border shadow-2xl ${tooltipVariants[variant]} ${positionClasses[side]}`}
          style={{ 
            width: `${Math.min(maxWidth, 350)}px`,
            minWidth: '250px'
          }}
        >
          {title && (
            <div className="font-semibold text-sm mb-3 border-b border-current/30 pb-2 text-blue-300">
              {title}
            </div>
          )}
          <div className="text-xs leading-relaxed space-y-2">
            {content}
          </div>
          
          {/* Tooltip arrow */}
          <div 
            className={`absolute w-0 h-0 border-4 border-transparent ${arrowClasses[side]}`}
          />
        </div>
      )}
    </div>
  );
};

// HiLo-specific tooltip content definitions
export const HiLoTooltips = {
  betaDistribution: {
    title: "Beta Distribution Visualization",
    content: (
      <div>
        <p className="mb-2">Visual representation of our current belief about card probabilities using the Beta distribution.</p>
        <ul className="space-y-1 text-xs">
          <li>• <span className="text-orange-400 font-semibold">Orange line:</span> Current card position</li>
          <li>• <span className="text-green-400 font-semibold">Green line:</span> Bayesian probability estimate</li>
          <li>• <span className="text-red-400 font-semibold">Red dashed:</span> True probability based on remaining cards</li>
          <li>• <span className="text-blue-300 font-semibold">Blue area:</span> Probability density function</li>
        </ul>
        <p className="mt-2 text-blue-300 text-xs">
          <strong>Mathematical insight:</strong> Shape becomes more peaked as confidence increases (α + β grows)
        </p>
      </div>
    ),
    variant: 'technical' as const
  },

  learningProgress: {
    title: "Bayesian Learning Convergence",
    content: (
      <div>
        <p className="mb-2">Tracks how our Bayesian estimate converges toward the true probability over time.</p>
        <ul className="space-y-1 text-xs">
          <li>• <span className="text-green-400 font-semibold">Green line:</span> Bayesian estimate evolution</li>
          <li>• <span className="text-red-400 font-semibold">Red line:</span> True probability (varies as deck depletes)</li>
          <li>• <strong>Good learning:</strong> Lines converge over time</li>
          <li>• <strong>Poor learning:</strong> Large persistent gaps between lines</li>
        </ul>
        <p className="mt-2 text-purple-300 text-xs">
          <strong>Educational insight:</strong> Faster convergence indicates effective parameter tuning
        </p>
      </div>
    ),
    variant: 'info' as const
  },

  deckComposition: {
    title: "Remaining Card Analysis",
    content: (
      <div>
        <p className="mb-2">Strategic visualization of remaining cards affecting true probability calculations.</p>
        <ul className="space-y-1 text-xs">
          <li>• <strong>Height:</strong> Number of each card type remaining</li>
          <li>• <strong>Strategy:</strong> More higher cards = bet "Higher" more often</li>
          <li>• <strong>Pattern:</strong> Uniform distribution = balanced probabilities</li>
          <li>• <strong>Depletion:</strong> Skewed distribution = clearer optimal choices</li>
        </ul>
        <p className="mt-2 text-cyan-300 text-xs">
          <strong>Practical use:</strong> Optimal decisions depend on both current card and remaining deck composition
        </p>
      </div>
    ),
    variant: 'info' as const
  },

  numDecks: {
    title: "Number of Decks Parameter",
    content: (
      <div>
        <p className="mb-2">Controls the total number of standard 52-card decks used in the game.</p>
        <ul className="space-y-1 text-xs">
          <li>• <strong>1 Deck:</strong> High variance, rapid probability changes</li>
          <li>• <strong>4-6 Decks:</strong> Balanced learning environment</li>
          <li>• <strong>8 Decks:</strong> Stable probabilities, slower changes</li>
        </ul>
        <p className="mt-2 text-green-300 text-xs">
          <strong>Mathematical effect:</strong> More decks → more stable true probabilities → easier convergence
        </p>
      </div>
    ),
    variant: 'technical' as const
  },

  priorStrength: {
    title: "Prior Strength (α₀, β₀)",
    content: (
      <div>
        <p className="mb-2">Initial values for Beta distribution parameters: α₀ = β₀ = prior strength</p>
        <ul className="space-y-1 text-xs">
          <li>• <strong>Low (1.1-2.0):</strong> Weak prior, rapid adaptation</li>
          <li>• <strong>Medium (2.0-3.0):</strong> Balanced influence</li>
          <li>• <strong>High (3.0-5.0):</strong> Strong prior, slower learning</li>
        </ul>
        <p className="mt-2 text-blue-300 text-xs">
          <strong>Formula:</strong> Initial belief = α₀/(α₀ + β₀) = 0.5 (neutral prior)
        </p>
      </div>
    ),
    variant: 'technical' as const
  },

  learningRate: {
    title: "Learning Rate (η)",
    content: (
      <div>
        <p className="mb-2">Controls how much each observation updates our belief parameters.</p>
        <ul className="space-y-1 text-xs">
          <li>• <strong>Low (0.1-0.3):</strong> Conservative, stable updates</li>
          <li>• <strong>Medium (0.5-0.8):</strong> Balanced adaptation speed</li>
          <li>• <strong>High (1.0-2.0):</strong> Aggressive, rapid learning</li>
        </ul>
        <p className="mt-2 text-yellow-300 text-xs">
          <strong>Update rule:</strong> α_new = α_old + η (for correct "Higher" guesses)
        </p>
      </div>
    ),
    variant: 'technical' as const
  },

  alphaParameter: {
    title: "Alpha Parameter (α)",
    content: (
      <div>
        <p className="mb-2">Represents successful "Higher" predictions in our Beta distribution.</p>
        <ul className="space-y-1 text-xs">
          <li>• <strong>Higher α:</strong> More evidence for higher cards being likely</li>
          <li>• <strong>Updates:</strong> Increases with correct "Higher" guesses</li>
          <li>• <strong>Confidence:</strong> α + β indicates total confidence</li>
        </ul>
        <p className="mt-2 text-green-300 text-xs">
          <strong>Interpretation:</strong> Think of α as "virtual successes" for higher outcomes
        </p>
      </div>
    ),
    variant: 'technical' as const
  },

  betaParameter: {
    title: "Beta Parameter (β)",
    content: (
      <div>
        <p className="mb-2">Represents successful "Lower" predictions in our Beta distribution.</p>
        <ul className="space-y-1 text-xs">
          <li>• <strong>Higher β:</strong> More evidence for lower cards being likely</li>
          <li>• <strong>Updates:</strong> Increases with correct "Lower" guesses</li>
          <li>• <strong>Balance:</strong> α vs β ratio determines probability estimate</li>
        </ul>
        <p className="mt-2 text-red-300 text-xs">
          <strong>Interpretation:</strong> Think of β as "virtual successes" for lower outcomes
        </p>
      </div>
    ),
    variant: 'technical' as const
  },

  score: {
    title: "Game Score",
    content: (
      <div>
        <p className="mb-2">Cumulative performance measure with asymmetric reward structure.</p>
        <ul className="space-y-1 text-xs">
          <li>• <strong>+1 point:</strong> Correct prediction</li>
          <li>• <strong>-2 points:</strong> Incorrect prediction</li>
          <li>• <strong>Strategy:</strong> Encourages high-confidence, accurate predictions</li>
        </ul>
        <p className="mt-2 text-blue-300 text-xs">
          <strong>Insight:</strong> Negative scoring penalizes poor probability estimation
        </p>
      </div>
    ),
    variant: 'info' as const
  },

  winRate: {
    title: "Win Rate Percentage",
    content: (
      <div>
        <p className="mb-2">Percentage of correct predictions across all game rounds.</p>
        <ul className="space-y-1 text-xs">
          <li>• <strong>Random guessing:</strong> ~50% win rate</li>
          <li>• <strong>Good learning:</strong> 60-70% win rate</li>
          <li>• <strong>Optimal play:</strong> 70%+ win rate possible</li>
        </ul>
        <p className="mt-2 text-emerald-300 text-xs">
          <strong>Target:</strong> Sustained {'>'}60% indicates effective Bayesian learning
        </p>
      </div>
    ),
    variant: 'info' as const
  }
};

export default InfoTooltip;
