import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Play, Pause, RotateCcw, ChevronRight, ChevronDown, ChevronUp, Info } from "lucide-react";

interface HuberControlsProps {
  dataInput: string;
  setDataInput: (value: string) => void;
  initialEstimate: number;
  setInitialEstimate: (value: number) => void;
  k: number;
  setK: (value: number) => void;
  maxIterations: number;
  setMaxIterations: (value: number) => void;
  convergenceThreshold: number;
  setConvergenceThreshold: (value: number) => void;
  isAutoMode: boolean;
  setIsAutoMode: (value: boolean) => void;
  iterationSpeed: number;
  setIterationSpeed: (value: number) => void;
  currentIteration: number;
  currentEstimate: number;
  simpleMean: number;
  hasConverged: boolean;
  isLogScale: boolean;
  setIsLogScale: (value: boolean) => void;
  yAxisDecimals: number;
  setYAxisDecimals: (value: number) => void;
  onParseData: () => void;
  onPerformIteration: () => void;
  onToggleAutoMode: () => void;
  onReset: () => void;
  isRunning: boolean;
}

const HuberControls: React.FC<HuberControlsProps> = ({
  dataInput,
  setDataInput,
  initialEstimate,
  setInitialEstimate,
  k,
  setK,
  maxIterations,
  setMaxIterations,
  convergenceThreshold,
  setConvergenceThreshold,
  isAutoMode,
  iterationSpeed,
  setIterationSpeed,
  currentIteration,
  currentEstimate,
  simpleMean,
  hasConverged,
  isLogScale,
  setIsLogScale,
  yAxisDecimals,
  setYAxisDecimals,
  onParseData,
  onPerformIteration,
  onToggleAutoMode,
  onReset,
  isRunning,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="glass-panel rounded-xl p-6 space-y-6">
      <div className="space-y-4">
        <h2 className="text-lg font-medium">IRLS Controls</h2>
        
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Label htmlFor="data-input" className="text-sm font-medium">Data (comma separated)</Label>
            <Tooltip>
              <TooltipTrigger>
                <Info size={14} className="text-muted-foreground hover:text-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-xs">
                  Enter comma-separated values for regression analysis. The algorithm will identify and downweight outliers automatically.
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="flex gap-2">
            <Input
              id="data-input"
              value={dataInput}
              onChange={(e) => setDataInput(e.target.value)}
              placeholder="e.g., 1, 2, 3, 50, 100"
              className="flex-1 input-field"
            />
            <Button onClick={onParseData} className="control-btn">Update</Button>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-1">
            <Label htmlFor="initial-estimate" className="text-sm font-medium">Initial Estimate: {initialEstimate}</Label>
            <Tooltip>
              <TooltipTrigger>
                <Info size={14} className="text-muted-foreground hover:text-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-xs">
                  Starting value for the parameter estimation. IRLS iteratively refines this estimate. Try different values to see convergence behavior.
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
          <Slider
            value={[initialEstimate]}
            min={-100}
            max={100}
            step={1}
            onValueChange={([value]) => setInitialEstimate(value)}
            className="mt-2"
          />
          <div className="flex justify-between text-xs opacity-60 mt-1">
            <span>-100</span>
            <span>100</span>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-1">
            <Label htmlFor="k-value" className="text-sm font-medium">Tuning Constant (k): {k}</Label>
            <Tooltip>
              <TooltipTrigger>
                <Info size={14} className="text-muted-foreground hover:text-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-xs">
                  Controls outlier sensitivity. Smaller k = more aggressive outlier rejection but less efficiency. Standard value: k=1.345 for 95% efficiency on normal data.
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
          <Slider
            value={[k]}
            min={0.1}
            max={20}
            step={0.1}
            onValueChange={([value]) => setK(value)}
            className="mt-2"
          />
          <div className="flex justify-between text-xs opacity-60 mt-1">
            <span>0.1</span>
            <span>20</span>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-1">
            <Label htmlFor="max-iterations" className="text-sm font-medium">Max Iterations: {maxIterations}</Label>
            <Tooltip>
              <TooltipTrigger>
                <Info size={14} className="text-muted-foreground hover:text-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-xs">
                  Maximum number of IRLS iterations before stopping. Algorithm usually converges within 10-20 iterations.
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
          <Slider
            value={[maxIterations]}
            min={5}
            max={50}
            step={1}
            onValueChange={([value]) => setMaxIterations(value)}
            className="mt-2"
          />
          <div className="flex justify-between text-xs opacity-60 mt-1">
            <span>5</span>
            <span>50</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium">Auto Mode</h3>
            <p className="text-xs text-muted-foreground">Run automatically</p>
          </div>
          <Switch checked={isAutoMode} onCheckedChange={onToggleAutoMode} />
        </div>

        {isAutoMode && (
          <div>
            <Label className="text-sm font-medium">Speed: {iterationSpeed}ms</Label>
            <Slider
              value={[iterationSpeed]}
              min={200}
              max={2000}
              step={100}
              onValueChange={([value]) => setIterationSpeed(value)}
              className="mt-2"
            />
            <div className="flex justify-between text-xs opacity-60 mt-1">
              <span>Fast</span>
              <span>Slow</span>
            </div>
          </div>
        )}

        {/* New Y-Axis Controls Section */}
        <div className="space-y-4 p-4 glass-panel rounded-lg">
          <h3 className="text-sm font-medium">Y-Axis Controls</h3>
          
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Y-Axis Scale</label>
            <button
              onClick={() => setIsLogScale(!isLogScale)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                isLogScale 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {isLogScale ? 'Log Scale' : 'Linear Scale'}
            </button>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Y-Axis Decimals: {yAxisDecimals}</label>
            <input
              type="range"
              min="0"
              max="4"
              step="1"
              value={yAxisDecimals}
              onChange={(e) => setYAxisDecimals(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>0</span>
              <span>4</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            onClick={onPerformIteration}
            disabled={isAutoMode || currentIteration >= maxIterations || hasConverged}
            className="control-btn-primary flex items-center gap-2"
          >
            <ChevronRight size={16} />
            Step
          </Button>
          
          <Button
            onClick={onToggleAutoMode}
            variant={isAutoMode ? "destructive" : "default"}
            className="control-btn flex items-center gap-2"
            disabled={currentIteration >= maxIterations || hasConverged}
          >
            {isAutoMode ? <Pause size={16} /> : <Play size={16} />}
            {isAutoMode ? "Pause" : "Run"}
          </Button>
          
          <Button
            onClick={onReset}
            variant="outline"
            className="control-btn flex items-center gap-2"
          >
            <RotateCcw size={16} />
            Reset
          </Button>
        </div>

        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center text-sm text-accent hover:text-accent/80 transition-colors font-medium"
        >
          {showAdvanced ? (
            <>
              <ChevronUp size={16} className="mr-1" /> Hide Advanced
            </>
          ) : (
            <>
              <ChevronDown size={16} className="mr-1" /> Show Advanced
            </>
          )}
        </button>

        {showAdvanced && (
          <div className="space-y-4 animate-fade-in">
            <Separator />
            <div>
              <Label className="text-sm font-medium">Convergence Threshold: {convergenceThreshold}</Label>
              <Input
                type="number"
                value={convergenceThreshold}
                onChange={(e) => setConvergenceThreshold(parseFloat(e.target.value) || 0.001)}
                step="0.0001"
                className="mt-1"
              />
            </div>
          </div>
        )}

        <Separator />
        
        <div className="space-y-2 p-4 glass-panel rounded-lg">
          <p className="text-sm"><strong>Iteration:</strong> {currentIteration} / {maxIterations}</p>
          <p className="text-sm"><strong>Current Estimate:</strong> {currentEstimate.toFixed(4)}</p>
          <p className="text-sm"><strong>Simple Mean:</strong> {simpleMean.toFixed(4)}</p>
          <p className="text-sm"><strong>Status:</strong> {hasConverged ? "Converged ✓" : "Running..."}</p>
        </div>
      </div>
    </div>
  );
};

export default HuberControls;
