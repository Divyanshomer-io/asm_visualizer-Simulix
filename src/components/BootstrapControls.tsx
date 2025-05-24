
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Pause, RefreshCw, BarChart3, TrendingUp, Eye, EyeOff, ChevronDown, ChevronUp } from "lucide-react";
import { BootstrapState, BootstrapParams } from "@/pages/Bootstrapping";

interface BootstrapControlsProps {
  state: BootstrapState;
  params: BootstrapParams;
  onParamsChange: (params: Partial<BootstrapParams>) => void;
  onStateChange: (state: Partial<BootstrapState>) => void;
  onStartStop: () => void;
  onReset: () => void;
}

const BootstrapControls: React.FC<BootstrapControlsProps> = ({
  state,
  params,
  onParamsChange,
  onStateChange,
  onStartStop,
  onReset,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Convert speed to relative scale (1-100)
  const getSpeedPercentage = (speed: number) => {
    const minSpeed = 0.5;
    const maxSpeed = 200;
    return Math.round(((speed - minSpeed) / (maxSpeed - minSpeed)) * 100);
  };

  const getSpeedFromPercentage = (percentage: number) => {
    const minSpeed = 0.5;
    const maxSpeed = 200;
    return minSpeed + (percentage / 100) * (maxSpeed - minSpeed);
  };

  return (
    <div className="space-y-4">
      {/* Main Controls */}
      <Card className="glass-panel">
        <CardHeader>
          <CardTitle className="text-lg">Simulation Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={onStartStop}
              className={`flex items-center gap-2 ${
                state.isRunning ? 'bg-amber-600 hover:bg-amber-700' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {state.isRunning ? (
                <>
                  <Pause size={18} /> Pause
                </>
              ) : (
                <>
                  <Play size={18} /> Start
                </>
              )}
            </Button>
            
            <Button
              onClick={onReset}
              className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
              disabled={state.isRunning}
            >
              <RefreshCw size={18} /> Reset
            </Button>
          </div>

          {/* Animation Speed - showing relative scale */}
          <div>
            <label className="text-sm opacity-80 mb-2 block">
              Animation Speed
            </label>
            <Slider
              value={[getSpeedPercentage(state.animationSpeed)]}
              min={0}
              max={100}
              step={5}
              onValueChange={([value]) => onStateChange({ animationSpeed: getSpeedFromPercentage(value) })}
              className="py-2"
            />
            <div className="flex justify-between text-xs opacity-60 mt-1">
              <span>Slow</span>
              <span>Fast</span>
            </div>
          </div>

          {/* Statistic Selection */}
          <div className="flex gap-2">
            <Button
              onClick={() => onParamsChange({ statistic: 'mean' })}
              className={`flex-1 ${
                params.statistic === 'mean' 
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'bg-secondary hover:bg-secondary/80'
              }`}
              disabled={state.isRunning}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Mean
            </Button>
            <Button
              onClick={() => onParamsChange({ statistic: 'median' })}
              className={`flex-1 ${
                params.statistic === 'median' 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-secondary hover:bg-secondary/80'
              }`}
              disabled={state.isRunning}
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Median
            </Button>
          </div>

          {/* Display Options */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Display Options</h4>
            <div className="flex gap-2">
              <Button
                onClick={() => onStateChange({ showCI: !state.showCI })}
                className={`flex-1 text-xs ${
                  state.showCI 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-gray-600 hover:bg-gray-700'
                }`}
              >
                {state.showCI ? <Eye className="h-3 w-3 mr-1" /> : <EyeOff className="h-3 w-3 mr-1" />}
                Confidence Interval
              </Button>
              <Button
                onClick={() => onStateChange({ showNormalFit: !state.showNormalFit })}
                className={`flex-1 text-xs ${
                  state.showNormalFit 
                    ? 'bg-purple-600 hover:bg-purple-700' 
                    : 'bg-gray-600 hover:bg-gray-700'
                }`}
              >
                {state.showNormalFit ? <Eye className="h-3 w-3 mr-1" /> : <EyeOff className="h-3 w-3 mr-1" />}
                Normal Fit
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Parameters */}
      <Card className="glass-panel">
        <CardHeader className="pb-3">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center text-sm text-accent hover:text-accent/80 transition-colors font-medium w-full justify-between"
          >
            Bootstrap Parameters
            {showAdvanced ? (
              <ChevronUp size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
          </button>
        </CardHeader>
        
        {showAdvanced && (
          <CardContent className="space-y-4">
            {/* Sample Size */}
            <div>
              <label className="text-sm opacity-80 mb-2 block">
                Sample Size: {params.sampleSize}
              </label>
              <Slider
                value={[params.sampleSize]}
                min={10}
                max={100}
                step={5}
                onValueChange={([value]) => onParamsChange({ sampleSize: value })}
                disabled={state.isRunning}
                className="py-2"
              />
              <div className="flex justify-between text-xs opacity-60 mt-1">
                <span>Small (10)</span>
                <span>Large (100)</span>
              </div>
            </div>

            {/* Number of Bootstrap Samples */}
            <div>
              <label className="text-sm opacity-80 mb-2 block">
                Bootstrap Samples: {params.numBootstrapSamples}
              </label>
              <Slider
                value={[params.numBootstrapSamples]}
                min={50}
                max={1000}
                step={50}
                onValueChange={([value]) => onParamsChange({ numBootstrapSamples: value })}
                disabled={state.isRunning}
                className="py-2"
              />
              <div className="flex justify-between text-xs opacity-60 mt-1">
                <span>Few (50)</span>
                <span>Many (1000)</span>
              </div>
            </div>

            {/* Confidence Level */}
            <div>
              <label className="text-sm opacity-80 mb-2 block">
                Confidence Level: {(params.confidenceLevel * 100).toFixed(1)}%
              </label>
              <Slider
                value={[params.confidenceLevel * 100]}
                min={80}
                max={99}
                step={1}
                onValueChange={([value]) => onParamsChange({ confidenceLevel: value / 100 })}
                className="py-2"
              />
              <div className="flex justify-between text-xs opacity-60 mt-1">
                <span>80%</span>
                <span>99%</span>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default BootstrapControls;
