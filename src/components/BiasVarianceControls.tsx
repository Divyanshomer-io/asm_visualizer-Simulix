
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Play, Pause, RotateCcw, RefreshCw, Shuffle } from 'lucide-react';
import { BiasVarianceParams, BiasVarianceState } from '@/utils/biasVariance';

interface BiasVarianceControlsProps {
  params: BiasVarianceParams;
  state: BiasVarianceState;
  onParamChange: (params: Partial<BiasVarianceParams>) => void;
  onPlayPause: () => void;
  onReset: () => void;
  onResetAll: () => void;
  onGenerate: () => void;
}

const BiasVarianceControls: React.FC<BiasVarianceControlsProps> = ({
  params,
  state,
  onParamChange,
  onPlayPause,
  onReset,
  onResetAll,
  onGenerate
}) => {
  return (
    <div className="space-y-6">
      {/* Animation Controls */}
      <Card className="glass-panel">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            Animation Control
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm">Iteration: {state.currentIteration}/50</span>
            <div className="flex gap-2">
              <Button
                onClick={onPlayPause}
                disabled={state.currentIteration >= 50}
                size="sm"
                variant="outline"
                className="control-btn"
              >
                {state.isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Button
                onClick={onReset}
                size="sm"
                variant="outline"
                className="control-btn"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="w-full bg-secondary rounded-full h-2">
            <div 
              className="bg-accent h-2 rounded-full transition-all duration-200"
              style={{ width: `${(state.currentIteration / 50) * 100}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Model Parameters */}
      <Card className="glass-panel">
        <CardHeader>
          <CardTitle className="text-lg">Model Parameters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Polynomial Degree */}
          <div className="space-y-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex justify-between items-center cursor-help">
                  <label className="text-sm font-medium">Model Complexity</label>
                  <span className="text-sm opacity-70">{params.degree}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <div className="space-y-2">
                  <h4 className="font-semibold">Polynomial Degree</h4>
                  <p className="text-sm">Controls function flexibility:</p>
                  <code className="text-xs">ŷ = β₀ + β₁x + ... + βₙxⁿ</code>
                  <p className="text-sm">
                    Low values → High bias (underfit)<br/>
                    High values → High variance (overfit)
                  </p>
                </div>
              </TooltipContent>
            </Tooltip>
            <Slider
              value={[params.degree]}
              onValueChange={([value]) => onParamChange({ degree: value })}
              min={1}
              max={15}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs opacity-60">
              <span>Simple (1)</span>
              <span>Complex (15)</span>
            </div>
          </div>

          {/* Noise Level */}
          <div className="space-y-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex justify-between items-center cursor-help">
                  <label className="text-sm font-medium">Noise Level</label>
                  <span className="text-sm opacity-70">{params.noise.toFixed(2)}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <div className="space-y-2">
                  <h4 className="font-semibold">Data Noise</h4>
                  <p className="text-sm">
                    Random error in observations. Higher noise makes the learning problem more challenging and increases irreducible error.
                  </p>
                  <code className="text-xs">y = f(x) + ε, ε ~ N(0, σ²)</code>
                </div>
              </TooltipContent>
            </Tooltip>
            <Slider
              value={[params.noise]}
              onValueChange={([value]) => onParamChange({ noise: value })}
              min={0.05}
              max={1.0}
              step={0.05}
              className="w-full"
            />
            <div className="flex justify-between text-xs opacity-60">
              <span>Low (0.05)</span>
              <span>High (1.0)</span>
            </div>
          </div>

          {/* Sample Size */}
          <div className="space-y-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex justify-between items-center cursor-help">
                  <label className="text-sm font-medium">Training Samples</label>
                  <span className="text-sm opacity-70">{params.samples}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <div className="space-y-2">
                  <h4 className="font-semibold">Sample Size</h4>
                  <p className="text-sm">
                    Number of training examples. More samples generally reduce variance but require more computation.
                  </p>
                </div>
              </TooltipContent>
            </Tooltip>
            <Slider
              value={[params.samples]}
              onValueChange={([value]) => onParamChange({ samples: value })}
              min={20}
              max={200}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-xs opacity-60">
              <span>Few (20)</span>
              <span>Many (200)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Card className="glass-panel">
        <CardContent className="space-y-3 pt-6">
          <Button
            onClick={onGenerate}
            disabled={state.isPlaying}
            className="w-full control-btn-primary"
          >
            <Shuffle className="h-4 w-4 mr-2" />
            Generate New Data
          </Button>
          
          <Button
            onClick={onResetAll}
            disabled={state.isPlaying}
            variant="outline"
            className="w-full control-btn"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset All Parameters
          </Button>
        </CardContent>
      </Card>

      {/* Current Statistics */}
      {state.errorDecomposition.bias.length > 0 && (
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle className="text-lg">Error Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="space-y-1">
                <span className="opacity-70">Bias²</span>
                <div className="font-mono text-green-400">
                  {(state.errorDecomposition.bias.reduce((a, b) => a + b, 0) / state.errorDecomposition.bias.length).toFixed(3)}
                </div>
              </div>
              
              <div className="space-y-1">
                <span className="opacity-70">Variance</span>
                <div className="font-mono text-blue-400">
                  {(state.errorDecomposition.variance.reduce((a, b) => a + b, 0) / state.errorDecomposition.variance.length).toFixed(3)}
                </div>
              </div>
              
              <div className="space-y-1">
                <span className="opacity-70">Noise</span>
                <div className="font-mono text-yellow-400">
                  {(state.errorDecomposition.noise.reduce((a, b) => a + b, 0) / state.errorDecomposition.noise.length).toFixed(3)}
                </div>
              </div>
              
              <div className="space-y-1">
                <span className="opacity-70">Total Error</span>
                <div className="font-mono text-red-400">
                  {(state.errorDecomposition.total.reduce((a, b) => a + b, 0) / state.errorDecomposition.total.length).toFixed(3)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BiasVarianceControls;
