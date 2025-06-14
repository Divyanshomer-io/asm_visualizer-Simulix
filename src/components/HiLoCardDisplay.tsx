import React from 'react';
import { getCardName } from '@/utils/hiLoGame';

interface HiLoCardDisplayProps {
  currentCard: number;
  isFlipping?: boolean;
}

const HiLoCardDisplay: React.FC<HiLoCardDisplayProps> = ({ currentCard, isFlipping = false }) => {
  const getSuitSymbol = (card: number) => {
    const suits = ['♠', '♥', '♦', '♣'];
    // Use card value to determine suit for consistency
    const suitIndex = card % 4;
    return suits[suitIndex];
  };

  const getCardColor = (suit: string) => {
    return suit === '♥' || suit === '♦' ? 'text-red-500' : 'text-black';
  };

  const suit = getSuitSymbol(currentCard);
  const cardName = getCardName(currentCard);
  const cardColor = getCardColor(suit);

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="text-sm text-muted-foreground">Current Card</div>
      
      {/* Card Container */}
      <div className="relative">
        {/* Main Playing Card */}
        <div className="w-24 h-36 bg-white rounded-lg border-2 border-gray-800 shadow-xl flex flex-col justify-between p-2">
          {/* Top corner */}
          <div className={`flex flex-col items-start ${cardColor} font-bold`}>
            <div className="text-lg leading-none">{cardName}</div>
            <div className="text-xl leading-none">{suit}</div>
          </div>
          
          {/* Center symbol */}
          <div className={`text-4xl ${cardColor} self-center font-bold`}>
            {suit}
          </div>
          
          {/* Bottom corner (rotated) */}
          <div className={`flex flex-col items-end rotate-180 ${cardColor} font-bold`}>
            <div className="text-lg leading-none">{cardName}</div>
            <div className="text-xl leading-none">{suit}</div>
          </div>
        </div>
      </div>
      
      {/* Card floating animation */}
      <div className="flex space-x-1">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 bg-blue-500 rounded-full animate-bounce`}
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
      
      <div className="text-sm text-muted-foreground text-center">
        Will the next card be higher or lower?
      </div>
    </div>
  );
};

export default HiLoCardDisplay;
