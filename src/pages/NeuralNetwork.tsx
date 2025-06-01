
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import NeuralNetworkVisualization from "@/components/NeuralNetworkVisualization";
import NeuralNetworkControls from "@/components/NeuralNetworkControls";
import NeuralNetworkEducation from "@/components/NeuralNetworkEducation";
import { NeuralNetworkParams, DEFAULT_PARAMS } from "@/utils/neuralNetwork";

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

const NeuralNetwork: React.FC = () => {
  const [params, setParams] = useState<NeuralNetworkParams>(DEFAULT_PARAMS);
  const [visualizationKey, setVisualizationKey] = useState(0);
  const [inputValues, setInputValues] = useState<number[]>(DEFAULT_INPUT_VALUES[DEFAULT_PARAMS.inputNeurons]);
  const [hasInputErrors, setHasInputErrors] = useState(false);

  const handleUpdate = () => {
    setVisualizationKey(prev => prev + 1);
    toast.success("Neural network updated successfully!");
  };

  const handleReset = () => {
    setParams(DEFAULT_PARAMS);
    setInputValues(DEFAULT_INPUT_VALUES[DEFAULT_PARAMS.inputNeurons]);
    setHasInputErrors(false);
    setVisualizationKey(prev => prev + 1);
    toast.info("Parameters reset to default values");
  };

  const handleInputValuesChange = (values: number[]) => {
    setInputValues(values);
  };

  return (
    <div className="min-h-screen bg-background text-foreground antialiased overflow-x-hidden">
      {/* Header */}
      <header className="w-full glass-panel border-b border-white/5 mb-8">
        <div className="container py-6 px-4 md:px-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-light tracking-tight">
              Neural Network Visualizer
              <span className="text-sm ml-3 opacity-70 font-normal">
                Interactive Learning
              </span>
            </h1>
            <p className="text-sm opacity-70">Multi-Layer Perceptron Training & Visualization</p>
          </div>
          <Link to="/" className="control-btn flex items-center gap-2 text-sm">
            <ArrowLeft className="h-4 w-4" />
            Back to Visualizations
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 md:px-8 pb-16">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-8">
          {/* Visualizations */}
          <div className="xl:col-span-3">
            <NeuralNetworkVisualization 
              key={visualizationKey}
              params={params}
              inputValues={inputValues}
              hasInputErrors={hasInputErrors}
            />
          </div>

          {/* Control Panel */}
          <div className="xl:col-span-1">
            <NeuralNetworkControls
              params={params}
              onParamsChange={setParams}
              onUpdate={handleUpdate}
              onReset={handleReset}
              inputValues={inputValues}
              onInputValuesChange={handleInputValuesChange}
              hasInputErrors={hasInputErrors}
            />
          </div>
        </div>

        {/* Educational Content */}
        <div className="w-full">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">
              Learn About Neural Networks
            </h2>
            <p className="text-slate-300">
              Understand network architecture, training, and activation functions
            </p>
          </div>
          
          <NeuralNetworkEducation />
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full glass-panel border-t border-white/5 mt-auto">
        <div className="container py-4 px-4 md:px-8 text-center">
          <p className="text-sm opacity-70">
            <span className="inline-block">Applied Statistical Mathematics • Interactive Visualizations</span>
            <span className="mx-2">•</span>
            <span className="inline-block">BITS Pilani, K.K. Birla Goa Campus</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default NeuralNetwork;
