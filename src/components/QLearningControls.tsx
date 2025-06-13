
import React from 'react';
import { Play, Square, RotateCcw, Route, Settings, Zap, Clock, Gauge } from 'lucide-react';
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
  const handleEpisodesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1 && value <= 1500) {
      onMaxEpisodesChange(value);
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
            {isTraining ? `TRAINING... (${currentEpisode}/${maxEpisodes})` : "START TRAINING"}
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
          {/* Episodes Input */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Max Episodes: {maxEpisodes}
            </Label>
            <Input
              type="number"
              min="1"
              max="1500"
              value={maxEpisodes}
              onChange={handleEpisodesChange}
              disabled={isTraining}
              className="w-full"
              placeholder="Enter number of episodes (1-1500)"
            />
            <p className="text-xs opacity-70">
              Training will resume from episode {currentEpisode + 1}
            </p>
          </div>

          {/* Speed Control */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Training Speed
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
            <Label className="text-sm font-medium">
              Learning Rate (α): {alpha.toFixed(2)}
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
            <Label className="text-sm font-medium">
              Exploration Rate (ε): {epsilon.toFixed(2)}
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
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Maze Size: {mazeSize}x{mazeSize}
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

      {/* Status Information */}
      <Card className="glass-panel">
        <CardHeader>
          <CardTitle className="text-lg">Status Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="space-y-1">
            <p><strong>Current Episode:</strong> {currentEpisode}</p>
            <p><strong>Progress:</strong> {((currentEpisode / maxEpisodes) * 100).toFixed(1)}%</p>
            <p><strong>Maze Size:</strong> {mazeSize}×{mazeSize}</p>
            <p><strong>Total Walls:</strong> {totalWalls}</p>
          </div>
          
          {bestReward !== undefined && avgSteps !== undefined && (
            <div className="space-y-1 pt-2 border-t border-white/10">
              <p><strong>Best Reward:</strong> {bestReward.toFixed(1)}</p>
              <p><strong>Avg Steps:</strong> {avgSteps.toFixed(1)}</p>
            </div>
          )}

          <div className="pt-2 border-t border-white/10">
            <h4 className="font-medium mb-2">Instructions:</h4>
            <ul className="text-xs space-y-1 opacity-80">
              <li>• Click maze cells to add/remove walls</li>
              <li>• Adjust parameters before training</li>
              <li>• Training resumes from last episode</li>
              <li>• Green circle (S) = Start position</li>
              <li>• Red circle (G) = Goal position</li>
              <li>• Blue arrows show learned policy</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QLearningControls;
