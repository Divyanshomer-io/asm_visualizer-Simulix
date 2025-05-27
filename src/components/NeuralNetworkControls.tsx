import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { NeuralNetworkParams, PARAM_LIMITS } from "@/utils/neuralNetwork";
import { RotateCcw, Play, Info, ChevronDown, ChevronUp } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface NeuralNetworkControlsProps {
  params: NeuralNetworkParams;
  onParamsChange: (params: NeuralNetworkParams) => void;
  onUpdate: () => void;
  onReset: () => void;
  inputValues: number[];
  onInputValuesChange: (values: number[]) => void;
  hasInputErrors: boolean;
}

// Default input values for different neuron counts
const DEFAULT_INPUT_VALUES: Record<number, number[]> = {
  1: [0.5],
  2: [-1.2, 1.8],
  3: [0.5, -1.2, 2.0],
  4: [1.0, -0.5, 2.5, -2.0],
  5: [0.0, -1.5, 2.2, -0.8, 1.0],
  6: [0.3, -2.0, 1.5, -1.0, 2.5, -0.5],
  7: [2.0, -1.8, 0.5, -2.5, 1.2, -0.2, 3.0],
  8: [0.7, -1.0, 2.8, -0.3, 1.5, -2.2, 0.9, -1.5]
};

interface InputFieldState {
  value: string;
  isValid: boolean;
  errorMessage: string;
}

const NeuralNetworkControls: React.FC<NeuralNetworkControlsProps> = ({
  params,
  onParamsChange,
  onUpdate,
  onReset,
  inputValues,
  onInputValuesChange,
  hasInputErrors
}) => {
  const [showInputConfig, setShowInputConfig] = useState(false);
  const [inputFields, setInputFields] = useState<InputFieldState[]>([]);

  const updateParam = (key: keyof NeuralNetworkParams, value: any) => {
    onParamsChange({
      ...params,
      [key]: value
    });
  };

  // Initialize input fields when input neurons change or inputValues change
  useEffect(() => {
    const count = params.inputNeurons;
    const currentValues = inputValues.length === count ? inputValues : DEFAULT_INPUT_VALUES[count] || [];
    
    const fields = currentValues.map((value, index) => ({
      value: value.toString(),
      isValid: true,
      errorMessage: ""
    }));
    
    setInputFields(fields);
    
    // Only update parent if values actually changed
    if (inputValues.length !== count) {
      onInputValuesChange([...currentValues]);
    }
  }, [params.inputNeurons]);

  // Sync input fields when inputValues prop changes
  useEffect(() => {
    if (inputValues.length === params.inputNeurons) {
      setInputFields(prev => 
        inputValues.map((value, index) => ({
          value: value.toString(),
          isValid: prev[index]?.isValid ?? true,
          errorMessage: prev[index]?.errorMessage ?? ""
        }))
      );
    }
  }, [inputValues, params.inputNeurons]);

  // Validate input value
  const validateInput = (value: string): { isValid: boolean; errorMessage: string; numericValue?: number } => {
    if (value.trim() === "") {
      return { isValid: false, errorMessage: "Value cannot be empty" };
    }
    
    const numericValue = parseFloat(value);
    
    if (isNaN(numericValue)) {
      return { isValid: false, errorMessage: "Invalid number" };
    }
    
    if (numericValue < -3.0 || numericValue > 3.0) {
      return { isValid: false, errorMessage: "Value must be between -3.0 and 3.0" };
    }
    
    return { isValid: true, errorMessage: "", numericValue };
  };

  // Handle input field changes
  const handleInputChange = (index: number, value: string) => {
    const validation = validateInput(value);
    
    // Update the input field state immediately
    const newFields = [...inputFields];
    newFields[index] = {
      value,
      isValid: validation.isValid,
      errorMessage: validation.errorMessage
    };
    
    setInputFields(newFields);
    
    // Update parent with valid values immediately
    if (validation.isValid && validation.numericValue !== undefined) {
      const newValidValues = [...inputValues];
      newValidValues[index] = validation.numericValue;
      onInputValuesChange(newValidValues);
    }
  };

  // Handle input blur (focus loss) - auto-correct invalid values
  const handleInputBlur = (index: number) => {
    const field = inputFields[index];
    
    if (!field.isValid) {
      // Restore to last valid value or default
      const defaultValue = DEFAULT_INPUT_VALUES[params.inputNeurons][index];
      const restoredValue = inputValues[index] !== undefined ? inputValues[index] : defaultValue;
      
      const newFields = [...inputFields];
      newFields[index] = {
        value: restoredValue.toString(),
        isValid: true,
        errorMessage: ""
      };
      
      setInputFields(newFields);
      
      // Update parent with restored value
      const newValidValues = [...inputValues];
      newValidValues[index] = restoredValue;
      onInputValuesChange(newValidValues);
    }
  };

  // Handle Enter key press - auto-correct invalid values
  const handleInputKeyDown = (index: number, event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleInputBlur(index);
    }
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

          {/* Input Configuration - Collapsible */}
          <Collapsible open={showInputConfig} onOpenChange={setShowInputConfig}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-2 h-auto">
                <span className="text-sm font-medium">Input Configuration</span>
                {showInputConfig ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 mt-4">
              <div className="bg-secondary/20 p-4 rounded-lg border border-white/10">
                <h4 className="text-sm font-medium mb-3">Input Values (Range: -3.0 to 3.0)</h4>
                <div className={`grid gap-3 ${params.inputNeurons <= 4 ? 'grid-cols-2' : 'grid-cols-2'}`}>
                  {inputFields.map((field, index) => (
                    <div key={index} className="space-y-1">
                      <label className="block text-xs font-medium opacity-80">
                        Input {index + 1}
                      </label>
                      <input
                        type="number"
                        min="-3.0"
                        max="3.0"
                        step="0.1"
                        value={field.value}
                        onChange={(e) => handleInputChange(index, e.target.value)}
                        onBlur={() => handleInputBlur(index)}
                        onKeyDown={(e) => handleInputKeyDown(index, e)}
                        className={`w-full px-2 py-1 text-xs rounded border bg-secondary focus:outline-none focus:ring-1 transition-colors ${
                          field.isValid 
                            ? 'border-green-500/50 focus:ring-green-500' 
                            : 'border-red-500 focus:ring-red-500'
                        }`}
                        placeholder="Enter value"
                      />
                      {!field.isValid && (
                        <p className="text-red-400 text-xs">{field.errorMessage}</p>
                      )}
                    </div>
                  ))}
                </div>
                
                {hasInputErrors && (
                  <div className="bg-yellow-500/20 border border-yellow-500/30 rounded p-2 mt-3">
                    <p className="text-yellow-300 text-xs">
                      ⚠️ Some inputs have errors. Training will use the last valid values.
                    </p>
                  </div>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>

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
