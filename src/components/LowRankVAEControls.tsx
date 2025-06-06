
import React, { useState, useCallback } from 'react';
import { Play, Square, Zap, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { VAEState, VAEParams } from '@/utils/lowRankVAE';
import InfoTooltip, { VAETooltips } from '@/components/InfoTooltip';

interface LowRankVAEControlsProps {
  params: VAEParams;
  state: VAEState;
  onParamsChange: (params: Partial<VAEParams>) => void;
  onStartTraining: (isFastRun?: boolean) => void;
  onStopTraining: () => void;
  onReset?: () => void;
}

// Default parameter values
const DEFAULT_PARAMS: VAEParams = {
  latentDim: 50,
  regularization: 'nuc',
  lambdaNuc: 100,
  lambdaMajorizer: 0.09,
  epochs: 10,
  batchSize: 128,
  learningRate: 0.001
};

const LowRankVAEControls: React.FC<LowRankVAEControlsProps> = ({
  params,
  state,
  onParamsChange,
  onStartTraining,
  onStopTraining,
  onReset
}) => {
  const [resetKey, setResetKey] = useState(0);
  
  const handleReset = useCallback(() => {
    // Reset parameters to defaults
    onParamsChange(DEFAULT_PARAMS);
    
    // Call parent reset if provided
    if (onReset) {
      onReset();
    }
    
    // Force component re-render
    setResetKey(prev => prev + 1);
    
    console.log('🔄 Interface reset to default state');
  }, [onParamsChange, onReset]);

  const getEstimatedTime = (epochs: number) => {
    if (epochs <= 5) return "~30-60 seconds";
    if (epochs <= 15) return "~2-4 minutes";
    if (epochs <= 30) return "~5-8 minutes";
    return "~8-15 minutes";
  };

  const getExpectedQuality = () => {
    if (params.regularization === 'none') return 'High';
    if (params.regularization === 'nuc' && params.lambdaNuc > 200) return 'Low';
    if (params.regularization === 'majorizer' && params.lambdaMajorizer > 0.5) return 'Low';
    return 'Medium';
  };

  const getCompressionRatio = () => ((params.latentDim / 784) * 100).toFixed(1);

  return (
    <div key={resetKey} className="glass-panel p-6 rounded-xl space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-accent flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Model Configuration
        </h3>

        {/* Latent Dimension */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label className="text-sm font-medium">
              Latent Dimension: {params.latentDim}
            </Label>
            <InfoTooltip {...VAETooltips.latentDimension} side="bottom" />
          </div>
          <Slider
            value={[params.latentDim]}
            onValueChange={([value]) => onParamsChange({ latentDim: value })}
            min={10}
            max={100}
            step={10}
            disabled={state.isTraining}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>10</span>
            <span>100</span>
          </div>
          <div className="text-xs text-muted-foreground">
            Compression: <span className="text-accent">{getCompressionRatio()}%</span>
          </div>
        </div>

        {/* Regularization */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label className="text-sm font-medium">Regularization</Label>
            <InfoTooltip {...VAETooltips.nuclearNorm} side="right"/>
          </div>
          <Select
            value={params.regularization}
            onValueChange={(value: 'nuc' | 'majorizer' | 'none') => 
              onParamsChange({ regularization: value })
            }
            disabled={state.isTraining}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nuc">Nuclear Norm (||Z||*)</SelectItem>
              <SelectItem value="majorizer">Log-Det Majorizer</SelectItem>
              <SelectItem value="none">No Regularization</SelectItem>
            </SelectContent>
          </Select>
        </div>

{/* Epochs */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label className="text-sm font-medium">
              Epochs: {params.epochs}
            </Label>
            <InfoTooltip {...VAETooltips.epochs} side="right" />
          </div>
          <Slider
            value={[params.epochs]}
            onValueChange={([value]) => onParamsChange({ epochs: value })}
            min={1}
            max={50}
            step={1}
            disabled={state.isTraining}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>1</span>
            <span>25</span>
            <span>50</span>
          </div>
          <div className="text-xs text-muted-foreground">
            Estimated time: {getEstimatedTime(params.epochs)}
          </div>
        </div>

        {/* Lambda Nuclear - Conditional */}
        {params.regularization === 'nuc' && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              λ Nuclear: {params.lambdaNuc}
            </Label>
            <Slider
              value={[params.lambdaNuc]}
              onValueChange={([value]) => onParamsChange({ lambdaNuc: value })}
              min={0}
              max={500}
              step={25}
              disabled={state.isTraining}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0</span>
              <span>250</span>
              <span>500</span>
            </div>
          </div>
        )}

        {/* Lambda Majorizer - Conditional */}
        {params.regularization === 'majorizer' && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              λ Majorizer: {params.lambdaMajorizer.toFixed(2)}
            </Label>
            <Slider
              value={[params.lambdaMajorizer]}
              onValueChange={([value]) => onParamsChange({ lambdaMajorizer: value })}
              min={0}
              max={1}
              step={0.01}
              disabled={state.isTraining}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0.0</span>
              <span>0.5</span>
              <span>1.0</span>
            </div>
          </div>
        )}
      </div>

      {/* Training Controls */}
      <div className="space-y-4 pt-4 border-t border-white/10">
        <h4 className="text-md font-semibold">Training</h4>
        
        <div className="space-y-3">
          <Button
            onClick={() => onStartTraining(true)}
            disabled={state.isTraining}
            variant="outline"
            className="w-full hover:border-orange-400/40 hover:bg-orange-400/10"
          >
            <Zap className="h-4 w-4 mr-2" />
            Fast Run (3 epochs)
          </Button>
          
          {!state.isTraining ? (
            <Button
              onClick={() => onStartTraining(false)}
              className="w-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/30 hover:from-green-500/30 hover:to-emerald-500/30"
            >
              <Play className="h-4 w-4 mr-2" />
              Run Training
            </Button>
          ) : (
            <Button
              onClick={onStopTraining}
              variant="destructive"
              className="w-full"
            >
              <Square className="h-4 w-4 mr-2" />
              Stop Training
            </Button>
          )}
        </div>

        {/* Training Progress */}
        {state.isTraining && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{Math.round(state.trainingProgress)}%</span>
            </div>
            <Progress value={state.trainingProgress} className="w-full" />
            <p className="text-xs text-muted-foreground">
              Epoch {state.epoch}/{state.totalEpochs}
              {state.reconstructionQuality && (
                <span className="ml-2 text-accent">
                  Quality: {(state.reconstructionQuality * 100).toFixed(0)}%
                </span>
              )}
            </p>
          </div>
        )}

        {/* Status */}
        <div className="p-3 glass-panel rounded-lg">
          <p className="text-sm font-medium text-center">
            {state.status}
          </p>
        </div>

        {/* Parameter Summary */}
        <div className="bg-background/30 p-3 rounded-lg">
          <div className="text-xs text-muted-foreground space-y-1">
            <div>Expected Quality: <span className="text-accent">{getExpectedQuality()}</span></div>
            {state.reconstructionQuality && (
              <div>Current Quality: <span className="text-accent">{(state.reconstructionQuality * 100).toFixed(0)}%</span></div>
            )}
          </div>
        </div>
      </div>

      {/* Reset Section */}
      <div className="reset-section bg-red-500/10 border border-red-500/20 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-red-400">Reset Interface</h4>
          <InfoTooltip 
            content="Restore all parameters, plots, and training data to initial state. This will clear all training progress and reset parameters to defaults."
            variant="warning"
          />
        </div>
        
        <Button
          onClick={handleReset}
          disabled={state.isTraining}
          variant="outline"
          className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-400/50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset to Default
        </Button>
        
        <div className="text-xs text-gray-400 mt-2 text-center">
          Clears all training progress and resets parameters
        </div>
      </div>
    </div>
  );
};

export default LowRankVAEControls;
