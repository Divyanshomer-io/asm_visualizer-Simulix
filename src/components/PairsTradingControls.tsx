import React from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info, Play, RotateCcw, TrendingUp, TrendingDown } from "lucide-react";
import { PHARMA_TICKERS, ThresholdLevels } from "@/utils/pairsTrading";

export interface PairsTradingParams {
  stockA: string;
  stockB: string;
  rollingWindow: number;
  lowerQuantile: number;
  upperQuantile: number;
  period: 'training' | 'testing';
}

interface PairsTradingControlsProps {
  params: PairsTradingParams;
  onParamsChange: (params: PairsTradingParams) => void;
  onRunAnalysis: () => void;
  onReset: () => void;
  thresholds: ThresholdLevels | null;
  isAnalyzing: boolean;
}

const InfoTooltip: React.FC<{ content: string }> = ({ content }) => (
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

const PairsTradingControls: React.FC<PairsTradingControlsProps> = ({
  params,
  onParamsChange,
  onRunAnalysis,
  onReset,
  thresholds,
  isAnalyzing
}) => {
  const updateParam = <K extends keyof PairsTradingParams>(
    key: K,
    value: PairsTradingParams[K]
  ) => {
    onParamsChange({ ...params, [key]: value });
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          Trading Configuration
          <InfoTooltip content="Configure the pairs trading strategy parameters" />
        </h2>

        <div className="space-y-6">
          {/* Stock A Selection */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              Stock A (Long Leg)
              <InfoTooltip content="The first stock in the pair. Position is long when spread is below lower threshold." />
            </Label>
            <Select
              value={params.stockA}
              onValueChange={(value) => updateParam('stockA', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PHARMA_TICKERS.filter(t => t !== params.stockB).map(ticker => (
                  <SelectItem key={ticker} value={ticker}>
                    {ticker.replace('.NS', '')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Stock B Selection */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              Stock B (Short Leg)
              <InfoTooltip content="The second stock in the pair. Used to hedge the first stock position." />
            </Label>
            <Select
              value={params.stockB}
              onValueChange={(value) => updateParam('stockB', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PHARMA_TICKERS.filter(t => t !== params.stockA).map(ticker => (
                  <SelectItem key={ticker} value={ticker}>
                    {ticker.replace('.NS', '')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Period Selection */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              Data Period
              <InfoTooltip content="Training period for parameter estimation, Testing for out-of-sample evaluation." />
            </Label>
            <Select
              value={params.period}
              onValueChange={(value) => updateParam('period', value as 'training' | 'testing')}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="training">Training (2017-2020)</SelectItem>
                <SelectItem value="testing">Testing (2020-2023)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Rolling Window */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                Rolling Window
                <InfoTooltip content="Number of days for calculating rolling mean and standard deviation of the spread." />
              </Label>
              <span className="text-sm font-mono bg-secondary/50 px-2 py-1 rounded">
                {params.rollingWindow} days
              </span>
            </div>
            <Slider
              value={[params.rollingWindow]}
              onValueChange={(value) => updateParam('rollingWindow', value[0])}
              min={20}
              max={252}
              step={10}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>20</span>
              <span>252</span>
            </div>
          </div>

          {/* Lower Quantile */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                Lower Entry Quantile
                <InfoTooltip content="Percentile for lower entry threshold. Long when z-score is below this level." />
              </Label>
              <span className="text-sm font-mono bg-secondary/50 px-2 py-1 rounded">
                {(params.lowerQuantile * 100).toFixed(0)}%
              </span>
            </div>
            <Slider
              value={[params.lowerQuantile]}
              onValueChange={(value) => updateParam('lowerQuantile', value[0])}
              min={0.01}
              max={0.20}
              step={0.01}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1%</span>
              <span>20%</span>
            </div>
          </div>

          {/* Upper Quantile */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                Upper Entry Quantile
                <InfoTooltip content="Percentile for upper entry threshold. Short when z-score is above this level." />
              </Label>
              <span className="text-sm font-mono bg-secondary/50 px-2 py-1 rounded">
                {(params.upperQuantile * 100).toFixed(0)}%
              </span>
            </div>
            <Slider
              value={[params.upperQuantile]}
              onValueChange={(value) => updateParam('upperQuantile', value[0])}
              min={0.80}
              max={0.99}
              step={0.01}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>80%</span>
              <span>99%</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 mt-8">
          <Button onClick={onRunAnalysis} className="w-full" size="lg" disabled={isAnalyzing}>
            <Play className="h-4 w-4 mr-2" />
            {isAnalyzing ? "Analyzing..." : "Run Analysis"}
          </Button>
          <Button onClick={onReset} variant="outline" className="w-full">
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset Parameters
          </Button>
        </div>
      </div>

      {/* Threshold Levels */}
      {thresholds && (
        <div className="glass-panel p-4 rounded-xl">
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            Z-Score Thresholds
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-green-400">
                <TrendingUp className="h-4 w-4" />
                Lower Entry
              </span>
              <span className="font-mono">{thresholds.lowerEntry.toFixed(3)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-red-400">
                <TrendingDown className="h-4 w-4" />
                Upper Entry
              </span>
              <span className="font-mono">{thresholds.upperEntry.toFixed(3)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-blue-400">
                Exit Level
              </span>
              <span className="font-mono">{thresholds.exitLevel.toFixed(3)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Current Configuration */}
      <div className="glass-panel p-4 rounded-xl">
        <h3 className="text-sm font-semibold mb-3">Current Pair</h3>
        <div className="text-xs space-y-1 font-mono">
          <div>Pair: {params.stockA.replace('.NS', '')} / {params.stockB.replace('.NS', '')}</div>
          <div>Window: {params.rollingWindow} days</div>
          <div>Entry: {(params.lowerQuantile * 100).toFixed(0)}% / {(params.upperQuantile * 100).toFixed(0)}%</div>
          <div>Period: {params.period === 'training' ? '2017-2020' : '2020-2023'}</div>
        </div>
      </div>
    </div>
  );
};

export default PairsTradingControls;
