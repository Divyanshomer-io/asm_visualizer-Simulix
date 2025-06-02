
import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { BiasVarianceParams, PARAM_LIMITS } from "@/utils/biasVariance";
import { RotateCcw, Play, Pause, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface BiasVarianceControlsProps {
  params: BiasVarianceParams;
  onParamsChange: (params: BiasVarianceParams) => void;
  onUpdate: () => void;
  onReset: () => void;
  onPlay: () => void;
  onPause: () => void;
  isPlaying: boolean;
}

const BiasVarianceControls: React.FC<BiasVarianceControlsProps> = ({
  params,
  onParamsChange,
  onUpdate,
  onReset,
  onPlay,
  onPause,
  isPlaying
}) => {
  const updateParam = (key: keyof BiasVarianceParams, value: number) => {
    onParamsChange({
      ...params,
      [key]: value
    });
  };

  const InfoTooltip = ({ content }: { content: string }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Info className="h-4 w-4 opacity-50 hover:opacity-100 transition-opacity" />
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-xs">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          Model Configuration
          <InfoTooltip content="Configure polynomial model parameters and training settings" />
        </h2>

        <div className="space-y-6">
          {/* Polynomial Degree */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                Polynomial Degree
                <InfoTooltip content="Model complexity: higher degrees can fit more complex patterns but may overfit" />
              </Label>
              <span className="text-sm font-mono bg-secondary/50 px-2 py-1 rounded">
                {params.polynomialDegree}
              </span>
            </div>
            <Slider
              value={[params.polynomialDegree]}
              onValueChange={(value) => updateParam('polynomialDegree', value[0])}
              min={PARAM_LIMITS.minDegree}
              max={PARAM_LIMITS.maxDegree}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{PARAM_LIMITS.minDegree}</span>
              <span>{PARAM_LIMITS.maxDegree}</span>
            </div>
          </div>

          {/* Noise Level */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                Noise Level
                <InfoTooltip content="Standard deviation of Gaussian noise added to training data" />
              </Label>
              <span className="text-sm font-mono bg-secondary/50 px-2 py-1 rounded">
                {params.noiseLevel.toFixed(2)}
              </span>
            </div>
            <Slider
              value={[params.noiseLevel]}
              onValueChange={(value) => updateParam('noiseLevel', value[0])}
              min={PARAM_LIMITS.minNoise}
              max={PARAM_LIMITS.maxNoise}
              step={0.05}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{PARAM_LIMITS.minNoise}</span>
              <span>{PARAM_LIMITS.maxNoise}</span>
            </div>
          </div>

          {/* Sample Size */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                Sample Size
                <InfoTooltip content="Number of training samples used to fit each model" />
              </Label>
              <span className="text-sm font-mono bg-secondary/50 px-2 py-1 rounded">
                {params.sampleSize}
              </span>
            </div>
            <Slider
              value={[params.sampleSize]}
              onValueChange={(value) => updateParam('sampleSize', value[0])}
              min={PARAM_LIMITS.minSamples}
              max={PARAM_LIMITS.maxSamples}
              step={10}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{PARAM_LIMITS.minSamples}</span>
              <span>{PARAM_LIMITS.maxSamples}</span>
            </div>
          </div>

          {/* Current Iteration */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                Iterations
                <InfoTooltip content="Number of models aggregated in current visualization" />
              </Label>
              <span className="text-sm font-mono bg-secondary/50 px-2 py-1 rounded">
                {params.currentIteration}
              </span>
            </div>
            <Slider
              value={[params.currentIteration]}
              onValueChange={(value) => updateParam('currentIteration', value[0])}
              min={1}
              max={params.maxIterations}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1</span>
              <span>{params.maxIterations}</span>
            </div>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex flex-col gap-3 mt-8">
          <Button onClick={onUpdate} className="w-full" size="lg">
            <RotateCcw className="h-4 w-4 mr-2" />
            Update Visualization
          </Button>
          
          <div className="grid grid-cols-2 gap-2">
            {!isPlaying ? (
              <Button onClick={onPlay} variant="outline" className="w-full">
                <Play className="h-4 w-4 mr-2" />
                Play
              </Button>
            ) : (
              <Button onClick={onPause} variant="outline" className="w-full">
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </Button>
            )}
            
            <Button onClick={onReset} variant="outline" className="w-full">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>
      </div>

      {/* Current Configuration */}
      <div className="glass-panel p-4 rounded-xl">
        <h3 className="text-sm font-semibold mb-3">Current Model</h3>
        <div className="text-xs space-y-1 font-mono">
          <div>Polynomial Degree: {params.polynomialDegree}</div>
          <div>Noise Level: {params.noiseLevel.toFixed(2)}</div>
          <div>Sample Size: {params.sampleSize}</div>
          <div>Iteration: {params.currentIteration}/{params.maxIterations}</div>
          <div>Status: {isPlaying ? 'Playing' : 'Paused'}</div>
        </div>
      </div>
    </div>
  );
};

export default BiasVarianceControls;
