
import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { NeuralNetworkParams, PARAM_LIMITS } from "@/utils/neuralNetwork";
import { RotateCcw, Play, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface NeuralNetworkControlsProps {
  params: NeuralNetworkParams;
  onParamsChange: (params: NeuralNetworkParams) => void;
  onUpdate: () => void;
  onReset: () => void;
}

const NeuralNetworkControls: React.FC<NeuralNetworkControlsProps> = ({
  params,
  onParamsChange,
  onUpdate,
  onReset
}) => {
  const updateParam = (key: keyof NeuralNetworkParams, value: any) => {
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
          Network Configuration
          <InfoTooltip content="Configure the neural network architecture and training parameters" />
        </h2>

        <div className="space-y-6">
          {/* Input Neurons */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                Input Neurons
                <InfoTooltip content="Number of input features. Determines the dimensionality of your data." />
              </Label>
              <span className="text-sm font-mono bg-secondary/50 px-2 py-1 rounded">
                {params.inputNeurons}
              </span>
            </div>
            <Slider
              value={[params.inputNeurons]}
              onValueChange={(value) => updateParam('inputNeurons', value[0])}
              min={1}
              max={PARAM_LIMITS.maxInput}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1</span>
              <span>{PARAM_LIMITS.maxInput}</span>
            </div>
          </div>

          {/* Hidden Layers */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                Hidden Layers
                <InfoTooltip content="Number of hidden layers. More layers can learn more complex patterns but may overfit." />
              </Label>
              <span className="text-sm font-mono bg-secondary/50 px-2 py-1 rounded">
                {params.hiddenLayers}
              </span>
            </div>
            <Slider
              value={[params.hiddenLayers]}
              onValueChange={(value) => updateParam('hiddenLayers', value[0])}
              min={1}
              max={PARAM_LIMITS.maxHiddenLayers}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1</span>
              <span>{PARAM_LIMITS.maxHiddenLayers}</span>
            </div>
          </div>

          {/* Neurons per Hidden Layer */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                Neurons per Hidden
                <InfoTooltip content="Number of neurons in each hidden layer. More neurons increase model capacity." />
              </Label>
              <span className="text-sm font-mono bg-secondary/50 px-2 py-1 rounded">
                {params.neuronsPerHidden}
              </span>
            </div>
            <Slider
              value={[params.neuronsPerHidden]}
              onValueChange={(value) => updateParam('neuronsPerHidden', value[0])}
              min={1}
              max={PARAM_LIMITS.maxNeurons}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1</span>
              <span>{PARAM_LIMITS.maxNeurons}</span>
            </div>
          </div>

          {/* Alpha (Regularization) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                Alpha (Regularization)
                <InfoTooltip content="L2 regularization parameter. Higher values prevent overfitting by penalizing large weights." />
              </Label>
              <span className="text-sm font-mono bg-secondary/50 px-2 py-1 rounded">
                {params.alpha.toFixed(4)}
              </span>
            </div>
            <Slider
              value={[params.alpha]}
              onValueChange={(value) => updateParam('alpha', value[0])}
              min={0.0001}
              max={0.1}
              step={0.0001}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0.0001</span>
              <span>0.1</span>
            </div>
          </div>

          {/* Learning Rate */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                Learning Rate
                <InfoTooltip content="Step size for weight updates during training. Too high may cause instability, too low may be slow." />
              </Label>
              <span className="text-sm font-mono bg-secondary/50 px-2 py-1 rounded">
                {params.learningRate.toFixed(4)}
              </span>
            </div>
            <Slider
              value={[params.learningRate]}
              onValueChange={(value) => updateParam('learningRate', value[0])}
              min={0.001}
              max={0.1}
              step={0.001}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0.001</span>
              <span>0.1</span>
            </div>
          </div>

          {/* Activation Function */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              Activation Function
              <InfoTooltip content="Function applied to neuron outputs. ReLU is fast, Sigmoid is smooth, Tanh is centered." />
            </Label>
            <RadioGroup
              value={params.activation}
              onValueChange={(value) => updateParam('activation', value as 'relu' | 'sigmoid' | 'tanh')}
              className="grid grid-cols-1 gap-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="relu" id="relu" />
                <Label htmlFor="relu" className="cursor-pointer">ReLU</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sigmoid" id="sigmoid" />
                <Label htmlFor="sigmoid" className="cursor-pointer">Sigmoid</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="tanh" id="tanh" />
                <Label htmlFor="tanh" className="cursor-pointer">Tanh</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 mt-8">
          <Button onClick={onUpdate} className="w-full" size="lg">
            <Play className="h-4 w-4 mr-2" />
            Update Network
          </Button>
          <Button onClick={onReset} variant="outline" className="w-full">
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset Parameters
          </Button>
        </div>
      </div>

      {/* Current Configuration */}
      <div className="glass-panel p-4 rounded-xl">
        <h3 className="text-sm font-semibold mb-3">Current Network</h3>
        <div className="text-xs space-y-1 font-mono">
          <div>Architecture: {params.inputNeurons}-{Array(params.hiddenLayers).fill(params.neuronsPerHidden).join('-')}-1</div>
          <div>Activation: {params.activation}</div>
          <div>Learning Rate: {params.learningRate}</div>
          <div>Regularization: {params.alpha}</div>
        </div>
      </div>
    </div>
  );
};

export default NeuralNetworkControls;
