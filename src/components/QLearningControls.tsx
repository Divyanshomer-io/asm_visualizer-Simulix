
import React, { useState } from 'react';
import { Play, Square, RotateCcw, Route, Settings, Zap, Clock, Gauge, Brain, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface QLearningControlsProps {
  isTraining: boolean;
  currentEpisode: number;
  maxEpisodes: number;
  speed: 'slow' | 'medium' | 'fast';
  mazeSize: number;
  totalWalls: number;
  bestReward?: number;
  avgSteps?: number;
  alpha: number;
  epsilon: number;
  onStartTraining: () => void;
  onShowPath: () => void;
  onResetMaze: () => void;
  onResetAll: () => void;
  onAlphaChange: (value: number[]) => void;
  onEpsilonChange: (value: number[]) => void;
  onMazeSizeChange: (value: number[]) => void;
  onMaxEpisodesChange: (value: number) => void;
  onSpeedChange: (speed: 'slow' | 'medium' | 'fast') => void;
}

const QLearningControls: React.FC<QLearningControlsProps> = ({
  isTraining,
  currentEpisode,
  maxEpisodes,
  speed,
  mazeSize,
  totalWalls,
  bestReward,
  avgSteps,
  alpha,
  epsilon,
  onStartTraining,
  onShowPath,
  onResetMaze,
  onResetAll,
  onAlphaChange,
  onEpsilonChange,
  onMazeSizeChange,
  onMaxEpisodesChange,
  onSpeedChange
}) => {
  const [episodesInput, setEpisodesInput] = useState(maxEpisodes.toString());
  const [episodesError, setEpisodesError] = useState('');

  const validateEpisodes = (value: string) => {
    const num = parseInt(value);
    if (isNaN(num) || num < 100 || num > 2000) {
      setEpisodesError('Please enter a value between 100 and 2000');
      return false;
    }
    setEpisodesError('');
    return true;
  };

  const handleEpisodesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEpisodesInput(value);
    
    if (value.trim() !== '') {
      validateEpisodes(value);
    } else {
      setEpisodesError('');
    }
  };

  const handleEpisodesKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const value = episodesInput.trim();
      if (value === '' || !validateEpisodes(value)) {
        setEpisodesInput('500');
        setEpisodesError('');
        onMaxEpisodesChange(500);
      } else {
        onMaxEpisodesChange(parseInt(value));
      }
    }
  };

  const handleEpisodesBlur = () => {
    const value = episodesInput.trim();
    if (value === '' || !validateEpisodes(value)) {
      setEpisodesInput(maxEpisodes.toString());
      setEpisodesError('');
    } else {
      onMaxEpisodesChange(parseInt(value));
    }
  };

  const getSpeedIcon = (speedValue: string) => {
    switch (speedValue) {
      case 'slow':
        return <Clock className="h-4 w-4" />;
      case 'medium':
        return <Gauge className="h-4 w-4" />;
      case 'fast':
        return <Zap className="h-4 w-4" />;
      default:
        return <Gauge className="h-4 w-4" />;
    }
  };

  const getSpeedLabel = (speedValue: string) => {
    switch (speedValue) {
      case 'slow':
        return '🐌 Slow (Detailed)';
      case 'medium':
        return '⚡ Medium (Balanced)';
      case 'fast':
        return '🚀 Fast (Quick)';
      default:
        return 'Medium';
    }
  };

  return (
    <div className="space-y-6">
      {/* Training Controls */}
      <Card className="glass-panel border-green-500/30 bg-gradient-to-br from-green-900/10 to-emerald-900/10">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="h-5 w-5 text-green-400" />
            🎯 Mission Control
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={onStartTraining}
            disabled={isTraining}
            className="w-full control-btn-primary bg-gradient-to-r from-green-600/80 to-blue-600/80 hover:from-green-500/90 hover:to-blue-500/90 border-green-400/30"
          >
            <Play className="h-4 w-4" />
            {isTraining ? `🧠 LEARNING... (${currentEpisode})` : `🚀 START TRAINING (+${maxEpisodes})`}
          </Button>

          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={onShowPath}
              disabled={isTraining}
              className="control-btn bg-gradient-to-r from-blue-600/30 to-purple-600/30 hover:from-blue-500/40 hover:to-purple-500/40 border-blue-400/30"
            >
              <Route className="h-4 w-4" />
              🗺️ PATH
            </Button>

            <Button
              onClick={onResetAll}
              disabled={isTraining}
              className="control-btn-secondary bg-gradient-to-r from-red-600/80 to-pink-600/80 hover:from-red-500/90 hover:to-pink-500/90"
            >
              <Square className="h-4 w-4" />
              🗑️ RESET
            </Button>
          </div>

          <Button
            onClick={onResetMaze}
            disabled={isTraining}
            className="w-full control-btn bg-gradient-to-r from-orange-600/30 to-red-600/30 hover:from-orange-500/40 hover:to-red-500/40 border-orange-400/30"
          >
            <RotateCcw className="h-4 w-4" />
            🧱 RESET MAZE
          </Button>
        </CardContent>
      </Card>

      {/* Training Configuration */}
      <Card className="glass-panel border-blue-500/30 bg-gradient-to-br from-blue-900/10 to-cyan-900/10">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Settings className="h-5 w-5 text-blue-400" />
            ⚙️ Training Setup
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Training Session Info */}
          <div className="space-y-2 bg-slate-500/10 p-3 rounded-lg border border-slate-500/20">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Zap className="h-4 w-4 text-yellow-400" />
              📊 Training Progress
            </Label>
            <div className="text-sm space-y-1">
              <p><strong className="text-cyan-400">Current Episode:</strong> {currentEpisode}</p>
              <p className="text-xs opacity-70">
                🎯 Next session: episodes {currentEpisode + 1}-{currentEpisode + maxEpisodes}
              </p>
            </div>
          </div>

          {/* Episodes per Session */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4 text-purple-400" />
              🎮 Episodes per Training Session
            </Label>
            <Input
              type="number"
              value={episodesInput}
              onChange={handleEpisodesChange}
              onKeyPress={handleEpisodesKeyPress}
              onBlur={handleEpisodesBlur}
              disabled={isTraining}
              className="w-full bg-purple-500/10 border-purple-500/30 focus:border-purple-400/50"
              placeholder="100-2000"
              min={100}
              max={2000}
            />
            {episodesError && (
              <p className="text-xs text-red-400">{episodesError}</p>
            )}
            <p className="text-xs opacity-70">
              🎯 Enter 100-2000. Press Enter to apply, defaults to 500.
            </p>
          </div>

          {/* Speed Control */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Gauge className="h-4 w-4 text-green-400" />
              ⚡ Training Speed
            </Label>
            <Select 
              value={speed} 
              onValueChange={onSpeedChange}
              disabled={isTraining}
            >
              <SelectTrigger className="w-full bg-green-500/10 border-green-500/30">
                <SelectValue>
                  <div className="flex items-center gap-2">
                    {getSpeedIcon(speed)}
                    {getSpeedLabel(speed)}
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="slow">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    🐌 Slow (Detailed)
                  </div>
                </SelectItem>
                <SelectItem value="medium">
                  <div className="flex items-center gap-2">
                    <Gauge className="h-4 w-4" />
                    ⚡ Medium (Balanced)
                  </div>
                </SelectItem>
                <SelectItem value="fast">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    🚀 Fast (Quick)
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Algorithm Parameters */}
      <Card className="glass-panel border-purple-500/30 bg-gradient-to-br from-purple-900/10 to-pink-900/10">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-400" />
            🧠 AI Parameters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-400 rounded"></div>
              📈 Learning Rate (α): {alpha.toFixed(2)}
            </Label>
            <Slider
              value={[alpha]}
              onValueChange={onAlphaChange}
              min={0.1}
              max={1.0}
              step={0.1}
              className="w-full"
              disabled={isTraining}
            />
            <p className="text-xs opacity-70">🧠 How fast the AI learns from new experiences</p>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <div className="w-3 h-3 bg-green-400 rounded"></div>
              🎲 Exploration Rate (ε): {epsilon.toFixed(2)}
            </Label>
            <Slider
              value={[epsilon]}
              onValueChange={onEpsilonChange}
              min={0.0}
              max={1.0}
              step={0.1}
              className="w-full"
              disabled={isTraining}
            />
            <p className="text-xs opacity-70">
              🔄 Chance of random exploration (resets each training session)
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <div className="w-3 h-3 border-2 border-cyan-400 rounded"></div>
              🗺️ Maze Grid Size: {mazeSize}x{mazeSize}
            </Label>
            <Slider
              value={[mazeSize]}
              onValueChange={onMazeSizeChange}
              min={5}
              max={10}
              step={1}
              className="w-full"
              disabled={isTraining}
            />
            <p className="text-xs opacity-70">🧩 Size of the maze grid (creates new maze)</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QLearningControls;
