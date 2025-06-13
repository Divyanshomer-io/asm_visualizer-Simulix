
import React from 'react';
import { Play, Square, RotateCcw, Route, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface QLearningControlsProps {
  isTraining: boolean;
  currentEpisode: number;
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
}

const QLearningControls: React.FC<QLearningControlsProps> = ({
  isTraining,
  currentEpisode,
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
  onMazeSizeChange
}) => {
  return (
    <div className="space-y-6">
      {/* Control Buttons */}
      <Card className="glass-panel">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={onStartTraining}
            disabled={isTraining}
            className="w-full control-btn-primary"
          >
            <Play className="h-4 w-4" />
            {isTraining ? "TRAINING..." : "START TRAINING"}
          </Button>

          <Button
            onClick={onShowPath}
            disabled={isTraining}
            className="w-full control-btn"
          >
            <Route className="h-4 w-4" />
            SHOW PATH
          </Button>

          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={onResetMaze}
              disabled={isTraining}
              className="control-btn"
            >
              <RotateCcw className="h-4 w-4" />
              RESET MAZE
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
        </CardContent>
      </Card>

      {/* Parameters */}
      <Card className="glass-panel">
        <CardHeader>
          <CardTitle className="text-lg">Parameters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Learning Rate (α): {alpha.toFixed(2)}
            </label>
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
            <label className="text-sm font-medium">
              Exploration Rate (ε): {epsilon.toFixed(2)}
            </label>
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
            <label className="text-sm font-medium">
              Maze Size: {mazeSize}x{mazeSize}
            </label>
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

      {/* Info Panel */}
      <Card className="glass-panel">
        <CardHeader>
          <CardTitle className="text-lg">Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="space-y-1">
            <p><strong>Current Episode:</strong> {currentEpisode}</p>
            <p><strong>Maze Size:</strong> {mazeSize}×{mazeSize}</p>
            <p><strong>Total Walls:</strong> {totalWalls}</p>
          </div>
          
          {bestReward !== undefined && avgSteps !== undefined && (
            <div className="space-y-1">
              <p><strong>Best Reward:</strong> {bestReward.toFixed(1)}</p>
              <p><strong>Avg Steps:</strong> {avgSteps.toFixed(1)}</p>
            </div>
          )}

          <div className="pt-2 border-t border-white/10">
            <h4 className="font-medium mb-2">Instructions:</h4>
            <ul className="text-xs space-y-1 opacity-80">
              <li>• Click maze cells to add/remove walls</li>
              <li>• Use sliders to adjust parameters</li>
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
