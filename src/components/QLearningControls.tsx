import React, { useState } from 'react';
import { Play, Square, RotateCcw, Route, Settings, Zap, Clock, Gauge } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import InfoTooltip from './InfoTooltip';

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
        return 'Slow (Detailed)';
      case 'medium':
        return 'Medium (Balanced)';
      case 'fast':
        return 'Fast (Quick)';
      default:
        return 'Medium';
    }
  };

  return (
    <div className="space-y-6">
      {/* Training Controls */}
      <Card className="glass-panel">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Training Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={onStartTraining}
            disabled={isTraining}
            className="w-full control-btn-primary"
          >
            <Play className="h-4 w-4" />
            {isTraining ? `TRAINING... (${currentEpisode})` : `START TRAINING (+${maxEpisodes})`}
          </Button>

          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={onShowPath}
              disabled={isTraining}
              className="control-btn"
            >
              <Route className="h-4 w-4" />
              SHOW PATH
            </Button>

            <Button
              onClick={onResetAll}
              disabled={isTraining}
              className="control-btn-secondary"
            >
              <Square className="h-4 w-4" />
              RESET ALL
            </Button>
          </div>

          <Button
            onClick={onResetMaze}
            disabled={isTraining}
            className="w-full control-btn"
          >
            <RotateCcw className="h-4 w-4" />
            RESET MAZE
          </Button>
        </CardContent>
      </Card>

      {/* Training Configuration */}
      <Card className="glass-panel">
        <CardHeader>
          <CardTitle className="text-lg">Training Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Training Session Info */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center">
              Training Progress
              <InfoTooltip content="<b>Training Progress:</b><br>• Shows current episode number<br>• Each training session runs for the specified number of episodes<br>• Agent learns by exploring and updating Q-values" />
            </Label>
            <div className="text-sm space-y-1">
              <p><strong>Current Episode:</strong> {currentEpisode}</p>
              <p className="text-xs opacity-70">
                Next session will train episodes {currentEpisode + 1}-{currentEpisode + maxEpisodes}
              </p>
            </div>
          </div>

          {/* Episodes per Session */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center">
              Episodes per Training Session
              <InfoTooltip content="<b>Episodes per Session:</b><br>• Number of learning episodes per training run<br>• More episodes = better learning but takes longer<br>• Range: 100-2000 episodes<br>• Default: 500 episodes" />
            </Label>
            <Input
              type="number"
              value={episodesInput}
              onChange={handleEpisodesChange}
              onKeyPress={handleEpisodesKeyPress}
              onBlur={handleEpisodesBlur}
              disabled={isTraining}
              className="w-full"
              placeholder="100-2000"
              min={100}
              max={2000}
            />
            {episodesError && (
              <p className="text-xs text-red-400">{episodesError}</p>
            )}
            <p className="text-xs opacity-70">
              Enter a value between 100-2000. Press Enter to apply, or it will default to 500.
            </p>
          </div>

          {/* Speed Control */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center">
              Training Speed
              <InfoTooltip content="<b>Training Speed:</b><br>• <b>Slow:</b> Detailed visualization, see each step<br>• <b>Medium:</b> Balanced speed and detail<br>• <b>Fast:</b> Quick training with minimal visualization<br>• Faster speeds complete training quicker" />
            </Label>
            <Select 
              value={speed} 
              onValueChange={onSpeedChange}
              disabled={isTraining}
            >
              <SelectTrigger className="w-full">
                <SelectValue>
                  <div className="flex items-center gap-2">
                    {getSpeedIcon(speed)}
                    {getSpeedLabel(speed)}
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="slow">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Slow (Detailed)
                  </div>
                </SelectItem>
                <SelectItem value="medium">
                  <div className="flex items-center gap-2">
                    <Gauge className="h-4 w-4" />
                    Medium (Balanced)
                  </div>
                </SelectItem>
                <SelectItem value="fast">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Fast (Quick)
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Algorithm Parameters */}
      <Card className="glass-panel">
        <CardHeader>
          <CardTitle className="text-lg">Algorithm Parameters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center">
              Learning Rate (α): {alpha.toFixed(2)}
              <InfoTooltip content="<b>Learning Rate (α):</b><br>• Controls how much new information overrides old<br>• High α (0.8-1.0): Fast learning, may be unstable<br>• Low α (0.1-0.3): Slow learning, more stable<br>• Medium α (0.4-0.7): Balanced approach" />
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
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center">
              Initial Exploration Rate (ε): {epsilon.toFixed(2)}
              <InfoTooltip content="<b>Exploration Rate (ε):</b><br>• Probability of random action vs. best known action<br>• High ε (0.8-1.0): More exploration, less exploitation<br>• Low ε (0.0-0.2): More exploitation, less exploration<br>• Decays during training for exploration → exploitation" />
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
              Resets to this value at the start of each training session
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center">
              Maze Size: {mazeSize}x{mazeSize}
              <InfoTooltip content="<b>Maze Size:</b><br>• Dimensions of the learning environment<br>• Larger mazes = more complex problems<br>• Smaller mazes = faster learning<br>• Range: 5x5 to 10x10 grid" />
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QLearningControls;
