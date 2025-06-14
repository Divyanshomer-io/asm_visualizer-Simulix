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

export const createDeck = (numDecks: number): number[] => {
  const deck: number[] = [];
  for (let i = 0; i < numDecks; i++) {
    for (let suit = 0; suit < 4; suit++) {
      for (let rank = 1; rank <= 13; rank++) {
        deck.push(rank);
      }
    }
  }
  
  // Shuffle deck
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  
  return deck;
};

export const drawCard = (deck: number[]): number => {
  if (deck.length === 0) {
    throw new Error('Cannot draw from empty deck');
  }
  return deck.pop()!;
};

export const calculateTrueProbability = (currentCard: number, deck: number[]): number => {
  const higher = deck.filter(card => card > currentCard).length;
  const lower = deck.filter(card => card < currentCard).length;
  const total = higher + lower;
  
  return total > 0 ? higher / total : 0.5;
};

export const getCardName = (value: number): string => {
  const names: { [key: number]: string } = {
    1: 'A',
    11: 'J',
    12: 'Q',
    13: 'K'
  };
  return names[value] || value.toString();
};

export const calculateBestStreak = (history: ('correct' | 'incorrect')[]): number => {
  if (history.length === 0) return 0;
  
  let currentStreak = 0;
  let bestStreak = 0;
  
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

export const calculateCurrentStreak = (history: ('correct' | 'incorrect')[]): number => {
  if (history.length === 0) return 0;
  
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

export const generateBetaPDF = (alpha: number, beta: number, points: number = 100): { x: number[], y: number[] } => {
  const x: number[] = [];
  const y: number[] = [];
  
  for (let i = 0; i <= points; i++) {
    const t = i / points;
    x.push(t * 12 + 1); // Scale to card range 1-13
    
    // Beta PDF calculation
    const betaValue = Math.pow(t, alpha - 1) * Math.pow(1 - t, beta - 1);
    y.push(betaValue);
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
