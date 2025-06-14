import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import HiLoControls from '@/components/HiLoControls';
import HiLoVisualization from '@/components/HiLoVisualization';
import HiLoEducation from '@/components/HiLoEducation';
import InfoTooltip, { HiLoTooltips } from '@/components/InfoTooltip';
import { GameState, GameParams, createDeck, drawCard, calculateTrueProbability, calculateBestStreak, calculateCurrentStreak } from '@/utils/hiLoGame';
import { toast } from 'sonner';

const HiLoBayesianGame = () => {
  const [state, setState] = useState<GameState>({
    currentCard: 0,
    deck: [],
    alpha: 2.0,
    beta: 2.0,
    score: 0,
    history: [],
    cardHistory: [],
    bayesianEstimates: [],
    trueProbabilities: [],
    isGameActive: true
  });

  const [params, setParams] = useState<GameParams>({
    numDecks: 6,
    priorStrength: 2.0,
    learningRate: 0.5
  });

  const initializeGame = useCallback(() => {
    const newDeck = createDeck(params.numDecks);
    const firstCard = drawCard(newDeck);
    
    setState({
      currentCard: firstCard,
      deck: newDeck,
      alpha: params.priorStrength,
      beta: params.priorStrength,
      score: 0,
      history: [],
      cardHistory: [firstCard],
      bayesianEstimates: [],
      trueProbabilities: [],
      isGameActive: true
    });
    
    toast.success('New game started!');
  }, [params.numDecks, params.priorStrength]);

  const handleParamsChange = useCallback((newParams: Partial<GameParams>) => {
    setParams(prev => ({ ...prev, ...newParams }));
  }, []);

  const makeGuess = useCallback((guess: 'high' | 'low') => {
    if (state.deck.length === 0) {
      toast.error('Deck is empty! Starting new game...');
      initializeGame();
      return;
    }

    const nextCard = drawCard(state.deck);
    const correct = (guess === 'high' && nextCard > state.currentCard) || 
                   (guess === 'low' && nextCard < state.currentCard);

    // Bayesian update with learning rate
    const updateAmount = params.learningRate;
    let newAlpha = state.alpha;
    let newBeta = state.beta;

    if (correct) {
      if (guess === 'high') {
        newAlpha += updateAmount;
      } else {
        newBeta += updateAmount;
      }
    } else {
      if (guess === 'high') {
        newBeta += updateAmount;
      } else {
        newAlpha += updateAmount;
      }
    }

    // Ensure alpha and beta don't go too low
    newAlpha = Math.max(0.1, newAlpha);
    newBeta = Math.max(0.1, newBeta);

    const bayesianEstimate = newAlpha / (newAlpha + newBeta);
    const trueProbability = calculateTrueProbability(state.currentCard, state.deck);

    // Updated reward structure: win +1, lose -2
    const scoreChange = correct ? 1 : -2;

    setState(prev => ({
      ...prev,
      currentCard: nextCard,
      alpha: newAlpha,
      beta: newBeta,
      score: prev.score + scoreChange,
      history: [...prev.history, correct ? 'correct' : 'incorrect'],
      cardHistory: [...prev.cardHistory, nextCard],
      bayesianEstimates: [...prev.bayesianEstimates, bayesianEstimate],
      trueProbabilities: [...prev.trueProbabilities, trueProbability]
    }));

    if (correct) {
      toast.success('Correct guess! +1 point 🎉');
    } else {
      toast.error('Wrong guess! -2 points 😔');
    }
  }, [state, params.learningRate, initializeGame]);

  const resetGame = useCallback(() => {
    initializeGame();
  }, [initializeGame]);

  useEffect(() => {
    initializeGame();
  }, []);

  // Update game when params change
  useEffect(() => {
    if (params.numDecks !== 6 || params.priorStrength !== 2.0) {
      initializeGame();
    }
  }, [params.numDecks, params.priorStrength, initializeGame]);

  // Calculate statistics for the enhanced statistics panel
  const bayesianEstimate = state.alpha / (state.alpha + state.beta);
  const confidence = state.alpha + state.beta;
  const winRate = state.history.length > 0 ? 
    state.history.filter(h => h === 'correct').length / state.history.length : 0;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 antialiased overflow-x-hidden">
      {/* Header */}
      <header className="w-full glass-panel border-b border-white/5 mb-8">
        <div className="container py-6 px-4 md:px-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-light tracking-tight">
              Bayesian Visualization
            </h1>
            <p className="text-sm opacity-70 mt-1">
              Hi-Lo Bayesian Game with Adaptive Learning
            </p>
          </div>
          <Link to="/" className="control-btn flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Visualizations
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 md:px-8 pb-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Visualization Panel - Left Side */}
          <div className="xl:col-span-3 space-y-6">
            <HiLoVisualization state={state} params={params} />
            
            {/* Game History */}
            {state.history.length > 0 && (
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-blue-400 mb-4">Recent Game History</h3>
                <div className="flex flex-wrap gap-2">
                  {state.history.slice(-20).map((result, i) => (
                    <div
                      key={i}
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                        result === 'correct' 
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}
                    >
                      {result === 'correct' ? '✓' : '✗'}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Enhanced Statistics Panel with Tooltips */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-blue-400 mb-6">Game Analytics Dashboard</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {/* Performance Metrics */}
                <div className="bg-slate-900/40 p-4 rounded-lg border border-slate-600/30">
                  <h4 className="text-sm font-medium text-slate-300 mb-3">Performance</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-1">
                        <span className="text-slate-400">Score:</span>
{/*                         <InfoTooltip
                          title={HiLoTooltips.score.title}
                          content={HiLoTooltips.score.content}
                          variant={HiLoTooltips.score.variant}
                          side="left"
                        /> */}
                      </div>
                      <span className={`font-medium ${state.score >= 0 ? 'text-green-400' : 'text-red-400'}`}>{state.score}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Games:</span>
                      <span className="text-blue-400 font-medium">{state.history.length}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-1">
                        <span className="text-slate-400">Win Rate:</span>
{/*                         <InfoTooltip
                          title={HiLoTooltips.winRate.title}
                          content={HiLoTooltips.winRate.content}
                          variant={HiLoTooltips.winRate.variant}
                          side="left"
                        /> */}
                      </div>
                      <span className="text-emerald-400 font-medium">{(winRate * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                </div>

                {/* Streak Information */}
                <div className="bg-slate-900/40 p-4 rounded-lg border border-slate-600/30">
                  <h4 className="text-sm font-medium text-slate-300 mb-3">Streaks</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Best:</span>
                      <span className="text-yellow-400 font-medium">{calculateBestStreak(state.history)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Current:</span>
                      <span className="text-orange-400 font-medium">{calculateCurrentStreak(state.history)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Cards Left:</span>
                      <span className="text-cyan-400 font-medium">{state.deck.length}</span>
                    </div>
                  </div>
                </div>

                {/* Bayesian Parameters */}
                <div className="bg-slate-900/40 p-4 rounded-lg border border-slate-600/30">
                  <h4 className="text-sm font-medium text-slate-300 mb-3">Bayesian State</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Estimate:</span>
                      <span className="text-purple-400 font-medium">{bayesianEstimate.toFixed(3)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Confidence:</span>
                      <span className="text-indigo-400 font-medium">{confidence.toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Learning:</span>
                      <span className="text-pink-400 font-medium">{params.learningRate.toFixed(1)}</span>
                    </div>
                  </div>
                </div>

                {/* Model Parameters */}
                <div className="bg-slate-900/40 p-4 rounded-lg border border-slate-600/30">
                  <h4 className="text-sm font-medium text-slate-300 mb-3">Model Params</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Alpha (α):</span>
                      <span className="text-green-400 font-medium">{state.alpha.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Beta (β):</span>
                      <span className="text-red-400 font-medium">{state.beta.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Decks:</span>
                      <span className="text-slate-300 font-medium">{params.numDecks}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Controls Panel - Right Side */}
          <div className="xl:col-span-1">
            <HiLoControls
              params={params}
              state={state}
              onParamsChange={handleParamsChange}
              onMakeGuess={makeGuess}
              onResetGame={resetGame}
            />
          </div>
        </div>

        {/* Educational Section */}
        <div className="mt-16">
          <HiLoEducation />
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full glass-panel border-t border-white/5 mt-16">
        <div className="container py-4 px-4 md:px-8 text-center">
          <p className="text-sm opacity-70">
            Bootstrap Visualization • Statistical Resampling • BITS Pilani, K.K. Birla Goa Campus
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HiLoBayesianGame;
