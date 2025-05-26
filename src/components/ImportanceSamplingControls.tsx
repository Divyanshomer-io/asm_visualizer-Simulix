
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { RotateCcw, Play } from "lucide-react";
import { ImportanceSamplingParams, DEFAULT_PARAMS } from "@/utils/importanceSampling";

interface ImportanceSamplingControlsProps {
  params: ImportanceSamplingParams;
  onParamsChange: (params: ImportanceSamplingParams) => void;
  onUpdate: () => void;
  onReset: () => void;
}

const ImportanceSamplingControls: React.FC<ImportanceSamplingControlsProps> = ({
  params,
  onParamsChange,
  onUpdate,
  onReset,
}) => {
  const handleSliderChange = (key: keyof ImportanceSamplingParams, value: number[]) => {
    onParamsChange({
      ...params,
      [key]: value[0]
    });
  };

  const handleMethodChange = (value: string) => {
    onParamsChange({
      ...params,
      method: value as 'standard' | 'normalized'
    });
  };

  return (
    <Card className="glass-panel border-white/10">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Control Panel</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Method Selection */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Sampling Method</Label>
          <RadioGroup 
            value={params.method} 
            onValueChange={handleMethodChange}
            className="flex flex-col space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="standard" id="standard" />
              <Label htmlFor="standard" className="text-sm">Standard IS</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="normalized" id="normalized" />
              <Label htmlFor="normalized" className="text-sm">Normalized IS</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Proposal Shift */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">
            Proposal Shift (t): {params.proposalT.toFixed(1)}
          </Label>
          <Slider
            value={[params.proposalT]}
            onValueChange={(value) => handleSliderChange('proposalT', value)}
            min={-3}
            max={3}
            step={0.1}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            Adjusts the mean of the proposal distribution
          </p>
        </div>

        {/* Scale h(x) */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">
            h(x) Scale: {params.scaleH.toFixed(1)}
          </Label>
          <Slider
            value={[params.scaleH]}
            onValueChange={(value) => handleSliderChange('scaleH', value)}
            min={0.1}
            max={1.0}
            step={0.1}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            Controls function steepness
          </p>
        </div>

        {/* Demo Samples */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">
            Demo Samples: {params.nDemo}
          </Label>
          <Slider
            value={[params.nDemo]}
            onValueChange={(value) => handleSliderChange('nDemo', value)}
            min={50}
            max={500}
            step={50}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            Number of samples for visualization
          </p>
        </div>

        {/* Convergence Trials */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">
            Convergence Trials: {params.nTrialsConv}
          </Label>
          <Slider
            value={[params.nTrialsConv]}
            onValueChange={(value) => handleSliderChange('nTrialsConv', value)}
            min={50}
            max={300}
            step={50}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            Trials for convergence analysis
          </p>
        </div>

        {/* Variance Trials */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">
            Variance Trials: {params.nTrialsVar}
          </Label>
          <Slider
            value={[params.nTrialsVar]}
            onValueChange={(value) => handleSliderChange('nTrialsVar', value)}
            min={30}
            max={150}
            step={20}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            Trials for variance analysis
          </p>
        </div>

        {/* Max Samples */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">
            Max Samples: {params.maxSamples}
          </Label>
          <Slider
            value={[params.maxSamples]}
            onValueChange={(value) => handleSliderChange('maxSamples', value)}
            min={1000}
            max={10000}
            step={1000}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            Maximum sample size for convergence
          </p>
        </div>

        {/* Control Buttons */}
        <div className="flex flex-col gap-3 pt-4">
          <Button 
            onClick={onUpdate}
            className="w-full"
            size="lg"
          >
            <Play className="w-4 h-4 mr-2" />
            Update Visualizations
          </Button>
          
          <Button 
            onClick={onReset}
            variant="destructive"
            className="w-full"
            size="lg"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset to Defaults
          </Button>
        </div>

        {/* Current Estimates */}
        <div className="pt-4 space-y-2 border-t border-white/10">
          <h4 className="text-sm font-medium">Current Parameters</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="space-y-1">
              <div>Method: {params.method}</div>
              <div>Proposal t: {params.proposalT.toFixed(1)}</div>
              <div>Scale: {params.scaleH.toFixed(1)}</div>
            </div>
            <div className="space-y-1">
              <div>Demo: {params.nDemo}</div>
              <div>Conv: {params.nTrialsConv}</div>
              <div>Var: {params.nTrialsVar}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImportanceSamplingControls;
