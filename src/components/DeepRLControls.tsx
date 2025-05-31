import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Play, Pause, RotateCcw, Info, Settings } from 'lucide-react';
import { DeepRLParams } from '@/pages/DeepRL';

interface DeepRLControlsProps {
  params: DeepRLParams;
  onParamsChange: (params: DeepRLParams) => void;
  isTraining: boolean;
  onStartTraining: () => void;
  onStopTraining: () => void;
  onReset: () => void;
}

const DeepRLControls: React.FC<DeepRLControlsProps> = ({
  params,
  onParamsChange,
  isTraining,
  onStartTraining,
  onStopTraining,
  onReset
}) => {
  const updateParam = (key: keyof DeepRLParams, value: any) => {
    onParamsChange({
      ...params,
      [key]: value
    });
  };

  const InfoTooltip = ({ content }: { content: string }) => (
    <Tooltip>
      <TooltipTrigger>
        <Info className="h-4 w-4 opacity-50 hover:opacity-100 transition-opacity" />
      </TooltipTrigger>
      <TooltipContent>
        <p className="max-w-xs">{content}</p>
      </TooltipContent>
    </Tooltip>
  );

  // Convert update frequency to slider value and vice versa
  const getFrequencyValue = () => {
    switch (params.updateFrequency) {
      case 'Slow': return 1;
      case 'Normal': return 50;
      case 'Fast': return 100;
      default: return 50;
    }
  };

  const setFrequencyFromValue = (value: number) => {
    if (value <= 33) {
      updateParam('updateFrequency', 'Slow');
    } else if (value <= 66) {
      updateParam('updateFrequency', 'Normal');
    } else {
      updateParam('updateFrequency', 'Fast');
    }
  };

  const getFrequencyLabel = () => {
    switch (params.updateFrequency) {
      case 'Slow': return '🐌 Slow (300ms)';
      case 'Normal': return '⚡ Normal (200ms)';
      case 'Fast': return '🚀 Fast (100ms)';
      default: return '⚡ Normal (200ms)';
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Controls */}
      <Card className="glass-panel border-white/10">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Training Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Control Buttons */}
          <div className="space-y-3">
            <Button
              onClick={isTraining ? onStopTraining : onStartTraining}
              className={`w-full ${isTraining ? 'bg-amber-600 hover:bg-amber-700' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {isTraining ? (
                <>
                  <Pause className="h-4 w-4 mr-2" />
                  Stop Training
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Start Training
                </>
              )}
            </Button>
            
            <Button
              onClick={onReset}
              variant="outline"
              className="w-full"
              disabled={isTraining}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>

          {/* Update Frequency Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                Update Speed
                <InfoTooltip content="Controls how fast the training visualization updates" />
              </Label>
              <span className="text-sm font-mono bg-secondary/50 px-2 py-1 rounded">
                {getFrequencyLabel()}
              </span>
            </div>
            <Slider
              value={[getFrequencyValue()]}
              onValueChange={(value) => setFrequencyFromValue(value[0])}
              min={1}
              max={100}
              step={1}
              disabled={isTraining}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Slow</span>
              <span>Fast</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Core Learning Parameters */}
      <Card className="glass-panel border-white/10">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Core Learning Parameters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Epsilon Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                ε (Epsilon) - Exploration Rate
                <InfoTooltip content="Controls exploration vs exploitation balance. High = more exploration, Low = more exploitation." />
              </Label>
              <span className="text-sm font-mono bg-secondary/50 px-2 py-1 rounded">
                {params.epsilon.toFixed(3)}
              </span>
            </div>
            <Slider
              value={[params.epsilon]}
              onValueChange={(value) => updateParam('epsilon', value[0])}
              min={0.01}
              max={1.0}
              step={0.01}
              disabled={isTraining}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Exploit (0.01)</span>
              <span>Explore (1.0)</span>
            </div>
          </div>

          {/* Learning Rate */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                Learning Rate
                <InfoTooltip content="How quickly the network updates weights. Too high may cause instability." />
              </Label>
              <span className="text-sm font-mono bg-secondary/50 px-2 py-1 rounded">
                {params.learningRate.toFixed(4)}
              </span>
            </div>
            <Slider
              value={[params.learningRate]}
              onValueChange={(value) => updateParam('learningRate', value[0])}
              min={0.0001}
              max={0.01}
              step={0.0001}
              disabled={isTraining}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0.0001</span>
              <span>0.01</span>
            </div>
          </div>

          {/* Gamma (Discount Factor) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                γ (Gamma) - Discount Factor
                <InfoTooltip content="How much future rewards matter vs immediate rewards. Higher = more long-term thinking." />
              </Label>
              <span className="text-sm font-mono bg-secondary/50 px-2 py-1 rounded">
                {params.gamma.toFixed(3)}
              </span>
            </div>
            <Slider
              value={[params.gamma]}
              onValueChange={(value) => updateParam('gamma', value[0])}
              min={0.8}
              max={0.99}
              step={0.01}
              disabled={isTraining}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Short-term (0.8)</span>
              <span>Long-term (0.99)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Parameters */}
      <Card className="glass-panel border-white/10">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Advanced Parameters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Batch Size */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                Batch Size
                <InfoTooltip content="Number of experiences used per training step. Larger = more stable but slower." />
              </Label>
              <span className="text-sm font-mono bg-secondary/50 px-2 py-1 rounded">
                {params.batchSize}
              </span>
            </div>
            <Slider
              value={[params.batchSize]}
              onValueChange={(value) => updateParam('batchSize', value[0])}
              min={16}
              max={128}
              step={16}
              disabled={isTraining}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>16</span>
              <span>128</span>
            </div>
          </div>

          {/* Memory Size */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                Experience Buffer Size
                <InfoTooltip content="Maximum number of experiences stored for replay training." />
              </Label>
              <span className="text-sm font-mono bg-secondary/50 px-2 py-1 rounded">
                {params.memorySize}
              </span>
            </div>
            <Slider
              value={[params.memorySize]}
              onValueChange={(value) => updateParam('memorySize', value[0])}
              min={500}
              max={5000}
              step={500}
              disabled={isTraining}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>500</span>
              <span>5000</span>
            </div>
          </div>

          {/* Epsilon Decay */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                ε Decay Rate
                <InfoTooltip content="How quickly exploration decreases over time. Higher = slower decay." />
              </Label>
              <span className="text-sm font-mono bg-secondary/50 px-2 py-1 rounded">
                {params.epsilonDecay.toFixed(4)}
              </span>
            </div>
            <Slider
              value={[params.epsilonDecay]}
              onValueChange={(value) => updateParam('epsilonDecay', value[0])}
              min={0.99}
              max={0.999}
              step={0.001}
              disabled={isTraining}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Fast decay (0.99)</span>
              <span>Slow decay (0.999)</span>
            </div>
          </div>

          {/* Network Size */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              Network Size
              <InfoTooltip content="Number of neurons per hidden layer. More neurons = more capacity but slower training." />
            </Label>
            <RadioGroup
              value={params.networkSize.toString()}
              onValueChange={(value) => updateParam('networkSize', parseInt(value))}
              disabled={isTraining}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="16" id="net16" />
                <Label htmlFor="net16" className="text-sm">16 neurons</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="24" id="net24" />
                <Label htmlFor="net24" className="text-sm">24 neurons</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="32" id="net32" />
                <Label htmlFor="net32" className="text-sm">32 neurons</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="64" id="net64" />
                <Label htmlFor="net64" className="text-sm">64 neurons</Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      {/* Current Configuration */}
      <Card className="glass-panel border-white/10">
        <CardHeader className="pb-4">
          <CardTitle className="text-sm">Current Network</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xs space-y-1 font-mono">
            <div>Architecture: 4-{params.networkSize}-{params.networkSize}-2</div>
            <div>Total Parameters: {(4 * params.networkSize + params.networkSize * params.networkSize + params.networkSize * 2).toLocaleString()}</div>
            <div>Update Frequency: {params.updateFrequency}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeepRLControls;
