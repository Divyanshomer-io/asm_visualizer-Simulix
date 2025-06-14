
// Game types and interfaces
export interface GameState {
  currentCard: number;
  deck: number[];
  alpha: number;
  beta: number;
  score: number;
  history: ('correct' | 'incorrect')[];
  cardHistory: number[];
  bayesianEstimates: number[];
  trueProbabilities: number[];
  isGameActive: boolean;
}

export interface GameParams {
  numDecks: number;
  priorStrength: number;
  learningRate: number;
}

// Create a deck of cards (1-13, where 1=Ace, 11=Jack, 12=Queen, 13=King)
export const createDeck = (numDecks: number): number[] => {
  const singleDeck = Array.from({ length: 13 }, (_, i) => i + 1);
  const fullDeck: number[] = [];
  
  for (let deck = 0; deck < numDecks; deck++) {
    for (let suit = 0; suit < 4; suit++) {
      fullDeck.push(...singleDeck);
    }
  }
  
  // Shuffle the deck
  for (let i = fullDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [fullDeck[i], fullDeck[j]] = [fullDeck[j], fullDeck[i]];
  }
  
  return fullDeck;
};

// Draw a card from the deck
export const drawCard = (deck: number[]): number => {
  const cardIndex = Math.floor(Math.random() * deck.length);
  const card = deck[cardIndex];
  deck.splice(cardIndex, 1);
  return card;
};

// Calculate true probability based on remaining cards
export const calculateTrueProbability = (currentCard: number, deck: number[]): number => {
  if (deck.length === 0) return 0.5;
  
  const higherCards = deck.filter(card => card > currentCard).length;
  return higherCards / deck.length;
};

// Generate Beta distribution PDF for visualization
export const generateBetaPDF = (alpha: number, beta: number, points: number = 100) => {
  const x: number[] = [];
  const y: number[] = [];
  
  for (let i = 0; i <= points; i++) {
    const t = i / points;
    x.push(t);
    
    // Beta PDF formula: (t^(α-1) * (1-t)^(β-1)) / B(α,β)
    // We'll use a simplified version for visualization
    const pdf = Math.pow(t, alpha - 1) * Math.pow(1 - t, beta - 1);
    y.push(pdf);
  }
  
  // Normalize
  const maxY = Math.max(...y);
  if (maxY > 0) {
    for (let i = 0; i < y.length; i++) {
      y[i] = y[i] / maxY;
    }
  }
  
  return { x, y };
};

// Get card name for display
export const getCardName = (cardValue: number): string => {
  switch (cardValue) {
    case 1: return 'A';
    case 11: return 'J';
    case 12: return 'Q';
    case 13: return 'K';
    default: return cardValue.toString();
  }
};

// Calculate best winning streak
export const calculateBestStreak = (history: ('correct' | 'incorrect')[]): number => {
  let bestStreak = 0;
  let currentStreak = 0;
  
  for (const result of history) {
    if (result === 'correct') {
      currentStreak++;
      bestStreak = Math.max(bestStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  }
  
  return bestStreak;
};

// Calculate current winning streak
export const calculateCurrentStreak = (history: ('correct' | 'incorrect')[]): number => {
  let currentStreak = 0;
  
  for (let i = history.length - 1; i >= 0; i--) {
    if (history[i] === 'correct') {
      currentStreak++;
    } else {
      break;
    }
  }
  
  return currentStreak;
};
