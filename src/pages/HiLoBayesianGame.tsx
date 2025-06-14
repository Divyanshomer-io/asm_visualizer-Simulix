
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Spade, RotateCcw, TrendingUp, Brain, Target } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface Card {
  value: number;
  suit: string;
  isVisible: boolean;
}

interface ProbabilityData {
  card: number;
  probability: number;
}

interface GameState {
  deck: Card[];
  currentCard: Card | null;
  nextCard: Card | null;
  score: number;
  round: number;
  gameHistory: Array<{
    round: number;
    currentCard: number;
    guess: 'higher' | 'lower';
    actualNext: number;
    correct: boolean;
    priorProbability: number;
    posteriorProbability: number;
  }>;
  probabilityHistory: Array<{
    round: number;
    data: ProbabilityData[];
  }>;
}

const HiLoBayesianGame = () => {
  const [gameState, setGameState] = useState<GameState>({
    deck: [],
    currentCard: null,
    nextCard: null,
    score: 0,
    round: 0,
    gameHistory: [],
    probabilityHistory: []
  });

  const [currentProbabilities, setCurrentProbabilities] = useState<ProbabilityData[]>([]);
  const [isGameActive, setIsGameActive] = useState(false);
  const [lastGuess, setLastGuess] = useState<'higher' | 'lower' | null>(null);

  // Initialize deck
  const initializeDeck = () => {
    const suits = ['♠', '♥', '♦', '♣'];
    const deck: Card[] = [];
    
    for (let suit of suits) {
      for (let value = 1; value <= 13; value++) {
        deck.push({ value, suit, isVisible: false });
      }
    }
    
    // Shuffle deck
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    
    return deck;
  };

  // Calculate Bayesian probabilities
  const calculateProbabilities = (currentCardValue: number, remainingDeck: Card[]) => {
    const probabilities: ProbabilityData[] = [];
    
    for (let value = 1; value <= 13; value++) {
      const count = remainingDeck.filter(card => card.value === value).length;
      const probability = count / remainingDeck.length;
      probabilities.push({ card: value, probability });
    }
    
    return probabilities;
  };

  // Start new game
  const startNewGame = () => {
    const newDeck = initializeDeck();
    const currentCard = newDeck.pop()!;
    const remainingDeck = newDeck;
    
    const probabilities = calculateProbabilities(currentCard.value, remainingDeck);
    
    setGameState({
      deck: remainingDeck,
      currentCard,
      nextCard: null,
      score: 0,
      round: 1,
      gameHistory: [],
      probabilityHistory: [{ round: 1, data: probabilities }]
    });
    
    setCurrentProbabilities(probabilities);
    setIsGameActive(true);
    setLastGuess(null);
  };

  // Make a guess
  const makeGuess = (guess: 'higher' | 'lower') => {
    if (!gameState.currentCard || gameState.deck.length === 0) return;
    
    const nextCard = gameState.deck[gameState.deck.length - 1];
    const newDeck = [...gameState.deck];
    newDeck.pop();
    
    const currentValue = gameState.currentCard.value;
    const nextValue = nextCard.value;
    
    const correct = (guess === 'higher' && nextValue > currentValue) || 
                   (guess === 'lower' && nextValue < currentValue) ||
                   (nextValue === currentValue);
    
    const priorProbability = guess === 'higher' 
      ? currentProbabilities.filter(p => p.card > currentValue).reduce((sum, p) => sum + p.probability, 0)
      : currentProbabilities.filter(p => p.card < currentValue).reduce((sum, p) => sum + p.probability, 0);
    
    // Update probabilities based on Bayesian inference
    const newProbabilities = calculateProbabilities(nextValue, newDeck);
    
    const newHistory = [...gameState.gameHistory, {
      round: gameState.round,
      currentCard: currentValue,
      guess,
      actualNext: nextValue,
      correct,
      priorProbability,
      posteriorProbability: newProbabilities.find(p => p.card === nextValue)?.probability || 0
    }];
    
    const newProbabilityHistory = [...gameState.probabilityHistory, {
      round: gameState.round + 1,
      data: newProbabilities
    }];
    
    setGameState({
      ...gameState,
      deck: newDeck,
      currentCard: nextCard,
      nextCard: null,
      score: correct ? gameState.score + 1 : gameState.score,
      round: gameState.round + 1,
      gameHistory: newHistory,
      probabilityHistory: newProbabilityHistory
    });
    
    setCurrentProbabilities(newProbabilities);
    setLastGuess(guess);
    
    if (newDeck.length === 0) {
      setIsGameActive(false);
    }
  };

  // Reset game
  const resetGame = () => {
    setGameState({
      deck: [],
      currentCard: null,
      nextCard: null,
      score: 0,
      round: 0,
      gameHistory: [],
      probabilityHistory: []
    });
    setCurrentProbabilities([]);
    setIsGameActive(false);
    setLastGuess(null);
  };

  // Get card display
  const getCardDisplay = (card: Card) => {
    const getValue = (value: number) => {
      if (value === 1) return 'A';
      if (value === 11) return 'J';
      if (value === 12) return 'Q';
      if (value === 13) return 'K';
      return value.toString();
    };
    
    return `${getValue(card.value)}${card.suit}`;
  };

  // Calculate higher/lower probabilities
  const higherProbability = gameState.currentCard 
    ? currentProbabilities.filter(p => p.card > gameState.currentCard!.value).reduce((sum, p) => sum + p.probability, 0)
    : 0;
  
  const lowerProbability = gameState.currentCard 
    ? currentProbabilities.filter(p => p.card < gameState.currentCard!.value).reduce((sum, p) => sum + p.probability, 0)
    : 0;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="w-full glass-panel border-b border-white/5 sticky top-0 z-50 backdrop-blur-xl">
        <div className="container py-6 px-4 md:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Spade className="h-8 w-8 text-accent" />
              <div>
                <h1 className="text-2xl font-bold">Hi-Lo Bayesian Game</h1>
                <p className="text-sm opacity-70">Learn Bayesian inference through card prediction</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="bg-accent/10">
                Score: {gameState.score}/{gameState.round > 0 ? gameState.round - 1 : 0}
              </Badge>
              <Badge variant="outline" className="bg-blue-500/10">
                Round: {gameState.round}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container py-8 px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Game Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Game Controls */}
            <Card className="glass-panel">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-accent" />
                  Game Controls
                </CardTitle>
                <CardDescription>
                  Predict whether the next card will be higher or lower
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!isGameActive ? (
                  <div className="text-center space-y-4">
                    <Button onClick={startNewGame} className="control-btn-primary">
                      Start New Game
                    </Button>
                    <p className="text-sm opacity-70">
                      Click to start a new Hi-Lo game with Bayesian probability tracking
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Current Card */}
                    <div className="text-center">
                      <div className="text-sm opacity-70 mb-2">Current Card</div>
                      {gameState.currentCard && (
                        <div className="w-24 h-32 mx-auto bg-white rounded-lg shadow-lg flex items-center justify-center text-2xl font-bold text-black border">
                          {getCardDisplay(gameState.currentCard)}
                        </div>
                      )}
                    </div>

                    {/* Prediction Buttons */}
                    <div className="flex gap-4 justify-center">
                      <Button 
                        onClick={() => makeGuess('higher')} 
                        className="control-btn flex-1 max-w-32"
                        disabled={gameState.deck.length === 0}
                      >
                        Higher
                      </Button>
                      <Button 
                        onClick={() => makeGuess('lower')} 
                        className="control-btn flex-1 max-w-32"
                        disabled={gameState.deck.length === 0}
                      >
                        Lower
                      </Button>
                    </div>

                    {/* Probability Display */}
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="glass-panel p-4 rounded-lg">
                        <div className="text-sm opacity-70">Higher Probability</div>
                        <div className="text-2xl font-bold text-green-400">
                          {(higherProbability * 100).toFixed(1)}%
                        </div>
                      </div>
                      <div className="glass-panel p-4 rounded-lg">
                        <div className="text-sm opacity-70">Lower Probability</div>
                        <div className="text-2xl font-bold text-red-400">
                          {(lowerProbability * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <Button onClick={resetGame} variant="outline" size="sm">
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reset Game
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Probability Distribution Chart */}
            {currentProbabilities.length > 0 && (
              <Card className="glass-panel">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-accent" />
                    Current Probability Distribution
                  </CardTitle>
                  <CardDescription>
                    Bayesian posterior probabilities for each card value
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={currentProbabilities}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey="card" stroke="rgba(255,255,255,0.7)" />
                        <YAxis stroke="rgba(255,255,255,0.7)" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(0,0,0,0.8)', 
                            border: '1px solid rgba(255,255,255,0.2)',
                            borderRadius: '8px'
                          }}
                          formatter={(value: number) => [(value * 100).toFixed(2) + '%', 'Probability']}
                        />
                        <Bar 
                          dataKey="probability" 
                          fill="url(#probabilityGradient)"
                          radius={[4, 4, 0, 0]}
                        />
                        <defs>
                          <linearGradient id="probabilityGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8} />
                            <stop offset="100%" stopColor="#1e40af" stopOpacity={0.3} />
                          </linearGradient>
                        </defs>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Game Statistics */}
            <Card className="glass-panel">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-accent" />
                  Game Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm opacity-70">Accuracy</span>
                    <span className="font-medium">
                      {gameState.gameHistory.length > 0 
                        ? ((gameState.score / gameState.gameHistory.length) * 100).toFixed(1) + '%'
                        : '0%'
                      }
                    </span>
                  </div>
                  <Progress 
                    value={gameState.gameHistory.length > 0 ? (gameState.score / gameState.gameHistory.length) * 100 : 0} 
                    className="h-2"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-400">{gameState.score}</div>
                    <div className="text-xs opacity-70">Correct</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-400">
                      {gameState.gameHistory.length - gameState.score}
                    </div>
                    <div className="text-xs opacity-70">Incorrect</div>
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-lg font-bold">{52 - gameState.round}</div>
                  <div className="text-xs opacity-70">Cards Remaining</div>
                </div>
              </CardContent>
            </Card>

            {/* Educational Panel */}
            <Card className="glass-panel">
              <CardHeader>
                <CardTitle>How It Works</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <strong className="text-accent">Bayesian Inference:</strong> As cards are revealed, the probability distribution updates using Bayes' theorem.
                </div>
                <div>
                  <strong className="text-accent">Prior Knowledge:</strong> Initially, all remaining cards have equal probability.
                </div>
                <div>
                  <strong className="text-accent">Posterior Update:</strong> Each revealed card provides evidence that updates our beliefs about remaining cards.
                </div>
                <div>
                  <strong className="text-accent">Strategy:</strong> Use the probability distribution to make informed predictions about the next card.
                </div>
              </CardContent>
            </Card>

            {/* Recent History */}
            {gameState.gameHistory.length > 0 && (
              <Card className="glass-panel">
                <CardHeader>
                  <CardTitle>Recent Predictions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {gameState.gameHistory.slice(-5).reverse().map((history, index) => (
                      <div key={index} className="flex items-center justify-between text-sm p-2 glass-panel rounded">
                        <div className="flex items-center gap-2">
                          <span className="font-mono">{history.currentCard} → {history.actualNext}</span>
                          <Badge variant={history.correct ? "default" : "destructive"} className="text-xs">
                            {history.guess}
                          </Badge>
                        </div>
                        <div className={`font-medium ${history.correct ? 'text-green-400' : 'text-red-400'}`}>
                          {history.correct ? '✓' : '✗'}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HiLoBayesianGame;
