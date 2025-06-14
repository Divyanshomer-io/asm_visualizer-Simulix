
import React from 'react';
import { Spade } from 'lucide-react';
import { getCardName } from '@/utils/hiLoGame';

interface HiLoCardDisplayProps {
  currentCard: number;
}

const HiLoCardDisplay: React.FC<HiLoCardDisplayProps> = ({ currentCard }) => {
  const cardName = getCardName(currentCard);
  
  // Determine card color (red for hearts/diamonds, black for spades/clubs)
  const isRed = Math.random() > 0.5; // Simplified for demo
  
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <h4 className="text-sm font-medium text-slate-300 mb-2">Current Card</h4>
      
      {/* Card Display */}
      <div className="relative w-24 h-32 bg-white rounded-lg border-2 border-slate-300 shadow-lg flex flex-col justify-between p-2">
        {/* Top left corner */}
        <div className={`flex flex-col items-center ${isRed ? 'text-red-600' : 'text-black'}`}>
          <span className="text-lg font-bold">{cardName}</span>
          <Spade className="h-4 w-4" />
        </div>
        
        {/* Center symbol */}
        <div className={`flex justify-center ${isRed ? 'text-red-600' : 'text-black'}`}>
          <Spade className="h-8 w-8" />
        </div>
        
        {/* Bottom right corner (rotated) */}
        <div className={`flex flex-col items-center transform rotate-180 ${isRed ? 'text-red-600' : 'text-black'}`}>
          <span className="text-lg font-bold">{cardName}</span>
          <Spade className="h-4 w-4" />
        </div>
      </div>
      
      {/* Card Value Info */}
      <div className="text-center">
        <p className="text-xs text-slate-400">Card Value: {currentCard}</p>
        <p className="text-xs text-slate-500 mt-1">
          {currentCard === 1 ? 'Ace (Low)' : 
           currentCard === 11 ? 'Jack' :
           currentCard === 12 ? 'Queen' :
           currentCard === 13 ? 'King' : 
           'Number Card'}
        </p>
      </div>
    </div>
  );
};

export default HiLoCardDisplay;
