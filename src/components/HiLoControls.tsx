import React from 'react';
import { TrendingUp, TrendingDown, RotateCcw, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { GameState, GameParams, calculateBestStreak, calculateCurrentStreak } from '@/utils/hiLoGame';
import HiLoCardDisplay from './HiLoCardDisplay';

interface HiLoControlsProps {
  params: GameParams;
  state: GameState;
  onParamsChange: (params: Partial<GameParams>) => void;
  onMakeGuess: (guess: 'high' | 'low') => void;
  onResetGame: () => void;
}

const HiLoControls: React.FC<HiLoControlsProps> = ({
  params,
  state,
  onParamsChange,
  onMakeGuess,
  onResetGame
}) => {
  
  const bayesianEstimate = state.alpha / (state.alpha + state.beta);
  const confidence = state.alpha + state.beta;
  const winRate = state.history.length > 0 ? 
    state.history.filter(h => h === 'correct').length / state.history.length : 0;

  return (
    <div className="space-y-6">
      {/* Game Controls */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 p-6 rounded-xl space-y-6">
        <h3 className="text-lg font-semibold text-blue-400 flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Game Controls
        </h3>

        {/* Card Display with Animation */}
        <div className="bg-slate-900/40 p-6 rounded-lg border border-slate-600/30">
          <HiLoCardDisplay currentCard={state.currentCard} />
        </div>

        {/* Game Buttons */}
        <div className="space-y-3">
          <Button
            onClick={() => onMakeGuess('high')}
            disabled={!state.isGameActive || state.deck.length === 0}
            className="w-full bg-green-600/20 border-green-500/30 hover:bg-green-600/30 hover:border-green-400/50 text-green-100"
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            Higher
          </Button>
          
          <Button
            onClick={() => onMakeGuess('low')}
            disabled={!state.isGameActive || state.deck.length === 0}
            className="w-full bg-red-600/20 border-red-500/30 hover:bg-red-600/30 hover:border-red-400/50 text-red-100"
          >
            <TrendingDown className="h-4 w-4 mr-2" />
            Lower
          </Button>

          <Button
            onClick={onResetGame}
            variant="outline"
            className="w-full hover:border-blue-400/40 hover:bg-blue-400/10 border-slate-600"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset Game
          </Button>
        </div>
      </div>

      {/* Game Parameters */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 p-6 rounded-xl space-y-4">
        <h4 className="text-md font-semibold text-blue-400">Parameters</h4>
        
        {/* Number of Decks */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-slate-300">
            Number of Decks: {params.numDecks}
          </Label>
          <Slider
            value={[params.numDecks]}
            onValueChange={([value]) => onParamsChange({ numDecks: value })}
            min={1}
            max={8}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-slate-400">
            <span>1</span>
            <span>4</span>
            <span>8</span>
          </div>
        </div>

        {/* Prior Strength */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-slate-300">
            Prior Strength: {params.priorStrength.toFixed(1)}
          </Label>
          <Slider
            value={[params.priorStrength]}
            onValueChange={([value]) => onParamsChange({ priorStrength: value })}
            min={0.1}
            max={5.0}
            step={0.1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-slate-400">
            <span>0.1</span>
            <span>2.5</span>
            <span>5.0</span>
          </div>
        </div>

        {/* Learning Rate */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-slate-300">
            Learning Rate: {params.learningRate.toFixed(1)}
          </Label>
          <Slider
            value={[params.learningRate]}
            onValueChange={([value]) => onParamsChange({ learningRate: value })}
            min={0.1}
            max={2.0}
            step={0.1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-slate-400">
            <span>0.1</span>
            <span>1.0</span>
            <span>2.0</span>
          </div>
        </div>
      </div>

      {/* Game Statistics */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 p-6 rounded-xl space-y-4">
        <h4 className="text-md font-semibold text-blue-400">Statistics</h4>
        
        <div className="bg-slate-900/40 p-4 rounded-lg border border-slate-600/30">
          <div className="text-xs text-slate-300 space-y-2">
            <div className="flex justify-between">
              <span>Score:</span>
              <span className="text-blue-400 font-medium">{state.score}</span>
            </div>
            <div className="flex justify-between">
              <span>Games Played:</span>
              <span className="text-blue-400 font-medium">{state.history.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Win Rate:</span>
              <span className="text-blue-400 font-medium">{(winRate * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span>Best Streak:</span>
              <span className="text-blue-400 font-medium">{calculateBestStreak(state.history)}</span>
            </div>
            <div className="flex justify-between">
              <span>Current Streak:</span>
              <span className="text-blue-400 font-medium">{calculateCurrentStreak(state.history)}</span>
            </div>
            <div className="flex justify-between">
              <span>Cards Left:</span>
              <span className="text-blue-400 font-medium">{state.deck.length}</span>
            </div>
          </div>
        </div>

        {/* Bayesian Info */}
        <div className="bg-slate-900/40 p-4 rounded-lg border border-slate-600/30">
          <div className="text-xs text-slate-300 space-y-2">
            <div className="flex justify-between">
              <span>Bayesian Est.:</span>
              <span className="text-blue-400 font-medium">{bayesianEstimate.toFixed(3)}</span>
            </div>
            <div className="flex justify-between">
              <span>Confidence:</span>
              <span className="text-blue-400 font-medium">{confidence.toFixed(1)}</span>
            </div>
            <div className="flex justify-between">
              <span>Alpha (α):</span>
              <span className="text-green-400 font-medium">{state.alpha.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Beta (β):</span>
              <span className="text-red-400 font-medium">{state.beta.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HiLoControls;
