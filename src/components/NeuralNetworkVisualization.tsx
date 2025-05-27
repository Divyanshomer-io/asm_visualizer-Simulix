
import React, { useState, useEffect, useRef } from "react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from "recharts";
import { NeuralNetworkParams, SimpleMLP, generateClassificationDataset, PARAM_LIMITS } from "@/utils/neuralNetwork";

interface NeuralNetworkVisualizationProps {
  params: NeuralNetworkParams;
}

const NeuralNetworkVisualization: React.FC<NeuralNetworkVisualizationProps> = ({ params }) => {
  const [model, setModel] = useState<SimpleMLP | null>(null);
  const [dataset, setDataset] = useState<{ X: number[][], y: number[] } | null>(null);
  const [activations, setActivations] = useState<number[][] | null>(null);
  const [isTraining, setIsTraining] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Validate parameters
  useEffect(() => {
    if (params.inputNeurons > PARAM_LIMITS.maxInput ||
        params.hiddenLayers > PARAM_LIMITS.maxHiddenLayers ||
        params.neuronsPerHidden > PARAM_LIMITS.maxNeurons) {
      setErrorMessage(`Max exceeded: Input=${PARAM_LIMITS.maxInput}, Layers=${PARAM_LIMITS.maxHiddenLayers}, Neurons=${PARAM_LIMITS.maxNeurons}`);
    } else {
      setErrorMessage("");
      // Generate new dataset
      const newDataset = generateClassificationDataset(PARAM_LIMITS.maxSamples, params.inputNeurons);
      setDataset(newDataset);
      
      // Reset model
      setModel(null);
      setActivations(null);
    }
  }, [params]);

  // Draw network visualization
  useEffect(() => {
    if (!canvasRef.current || errorMessage) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Network structure
    const layers = [params.inputNeurons, ...Array(params.hiddenLayers).fill(params.neuronsPerHidden), 1];
    const maxNeurons = Math.max(...layers);
    
    // Calculate positions
    const padding = 60;
    const width = canvas.width - 2 * padding;
    const height = canvas.height - 2 * padding;
    
    const layerSpacing = width / (layers.length - 1);
    const neuronSpacing = height / (maxNeurons - 1);

    const positions: { x: number, y: number }[][] = [];

    // Calculate neuron positions
    layers.forEach((numNeurons, layerIndex) => {
      const layerPositions: { x: number, y: number }[] = [];
      const startY = (height - (numNeurons - 1) * neuronSpacing) / 2;
      
      for (let neuronIndex = 0; neuronIndex < numNeurons; neuronIndex++) {
        const x = padding + layerIndex * layerSpacing;
        const y = padding + startY + neuronIndex * neuronSpacing;
        layerPositions.push({ x, y });
      }
      positions.push(layerPositions);
    });

    // Draw connections
    if (model) {
      const weights = model.getWeights();
      weights.forEach((layerWeights, layerIndex) => {
        layerWeights.forEach((neuronWeights, neuronIndex) => {
          neuronWeights.forEach((weight, prevNeuronIndex) => {
            if (prevNeuronIndex < positions[layerIndex].length && 
                neuronIndex < positions[layerIndex + 1].length) {
              
              const start = positions[layerIndex][prevNeuronIndex];
              const end = positions[layerIndex + 1][neuronIndex];
              
              // Weight visualization
              const absWeight = Math.abs(weight);
              const alpha = Math.min(0.8, 0.3 + 0.5 * absWeight);
              const lineWidth = Math.max(0.5, Math.min(4, absWeight * 3));
              
              ctx.strokeStyle = weight > 0 ? `rgba(34, 197, 94, ${alpha})` : `rgba(239, 68, 68, ${alpha})`;
              ctx.lineWidth = lineWidth;
              
              ctx.beginPath();
              ctx.moveTo(start.x, start.y);
              ctx.lineTo(end.x, end.y);
              ctx.stroke();
            }
          });
        });
      });
    }

    // Draw neurons
    positions.forEach((layerPositions, layerIndex) => {
      layerPositions.forEach((pos, neuronIndex) => {
        // Determine neuron appearance
        let color = '#64748b'; // Default gray
        let radius = 15;
        
        if (activations && layerIndex < activations.length && neuronIndex < activations[layerIndex].length) {
          const activation = activations[layerIndex][neuronIndex];
          const intensity = Math.min(1.0, Math.abs(activation));
          
          if (layerIndex === 0) {
            color = `hsl(217, ${50 + intensity * 50}%, ${60 + intensity * 20}%)`; // Blue
          } else if (layerIndex === positions.length - 1) {
            color = `hsl(142, ${50 + intensity * 50}%, ${60 + intensity * 20}%)`; // Green
          } else {
            color = `hsl(38, ${50 + intensity * 50}%, ${60 + intensity * 20}%)`; // Orange
          }
          
          radius = 12 + intensity * 8;
        } else {
          // Default colors
          if (layerIndex === 0) color = '#3b82f6'; // Blue
          else if (layerIndex === positions.length - 1) color = '#10b981'; // Green
          else color = '#f59e0b'; // Orange
        }

        // Draw neuron
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, radius, 0, 2 * Math.PI);
        ctx.fill();
        
        // Draw border
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw activation value
        if (activations && layerIndex < activations.length && neuronIndex < activations[layerIndex].length) {
          const activation = activations[layerIndex][neuronIndex];
          ctx.fillStyle = '#fff';
          ctx.font = '10px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(activation.toFixed(1), pos.x, pos.y + 3);
        }
      });
    });

  }, [params, model, activations, errorMessage]);

  const trainNetwork = async () => {
    if (!dataset || errorMessage) return;

    setIsTraining(true);
    try {
      const layers = [params.inputNeurons, ...Array(params.hiddenLayers).fill(params.neuronsPerHidden), 1];
      const newModel = new SimpleMLP(layers, params.activation, params.learningRate, params.alpha);
      
      newModel.train(dataset.X, dataset.y, 100);
      
      // Get sample activations
      const sampleActivations = newModel.forward(dataset.X[0]);
      
      setModel(newModel);
      setActivations(sampleActivations);
    } catch (error) {
      setErrorMessage(`Training error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsTraining(false);
    }
  };

  const stepTraining = async () => {
    if (!dataset || errorMessage) return;

    setIsTraining(true);
    try {
      let currentModel = model;
      if (!currentModel) {
        const layers = [params.inputNeurons, ...Array(params.hiddenLayers).fill(params.neuronsPerHidden), 1];
        currentModel = new SimpleMLP(layers, params.activation, params.learningRate, params.alpha);
      }
      
      currentModel.train(dataset.X, dataset.y, 1);
      
      // Get sample activations
      const sampleActivations = currentModel.forward(dataset.X[0]);
      
      setModel(currentModel);
      setActivations(sampleActivations);
    } catch (error) {
      setErrorMessage(`Training error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsTraining(false);
    }
  };

  const resetNetwork = () => {
    setModel(null);
    setActivations(null);
    setErrorMessage("");
  };

  // Prepare chart data
  const lossData = model ? model.trainingHistory.iteration.map((iter, i) => ({
    iteration: iter,
    loss: model.trainingHistory.loss[i]
  })) : [];

  const accuracyData = model ? model.trainingHistory.iteration.map((iter, i) => ({
    iteration: iter,
    accuracy: model.trainingHistory.accuracy[i] * 100
  })) : [];

  const weightData = model ? (() => {
    const weights = model.getWeights();
    const allWeights = weights.flat().flat();
    const bins = 20;
    const min = Math.min(...allWeights);
    const max = Math.max(...allWeights);
    const binSize = (max - min) / bins;
    
    const histogram = Array(bins).fill(0);
    allWeights.forEach(weight => {
      const binIndex = Math.min(bins - 1, Math.floor((weight - min) / binSize));
      histogram[binIndex]++;
    });

    return histogram.map((count, i) => ({
      bin: (min + i * binSize).toFixed(2),
      count
    }));
  })() : [];

  const getTitle = () => {
    const activationDisplay = params.activation === 'sigmoid' ? 'Sigmoid' : 
                            params.activation.charAt(0).toUpperCase() + params.activation.slice(1);
    let title = `Network: ${params.inputNeurons}-`;
    title += Array(params.hiddenLayers).fill(params.neuronsPerHidden).join('-') + '-1\n';
    title += `Activation: ${activationDisplay}`;
    if (model) {
      title += `, Iteration: ${model.trainingHistory.iteration.length}`;
      if (model.loss) {
        title += `, Loss: ${model.loss.toFixed(4)}`;
      }
    }
    return title;
  };

  return (
    <div className="space-y-6">
      {/* Network Visualization */}
      <div className="glass-panel p-6 rounded-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Network Architecture</h3>
          <div className="flex gap-2">
            <button
              onClick={trainNetwork}
              disabled={isTraining || !!errorMessage}
              className="control-btn-primary disabled:opacity-50"
            >
              {isTraining ? "Training..." : "Train Network"}
            </button>
            <button
              onClick={stepTraining}
              disabled={isTraining || !!errorMessage}
              className="control-btn disabled:opacity-50"
            >
              Step Training
            </button>
            <button
              onClick={resetNetwork}
              className="control-btn-secondary"
            >
              Reset
            </button>
          </div>
        </div>
        
        {errorMessage ? (
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 text-center">
            <p className="text-red-300">{errorMessage}</p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm opacity-70 text-center">{getTitle()}</p>
            <canvas
              ref={canvasRef}
              width={800}
              height={400}
              className="w-full bg-secondary/20 rounded-lg border border-white/10"
            />
          </div>
        )}
      </div>

      {/* Training Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Loss Chart */}
        <div className="glass-panel p-6 rounded-xl">
          <h3 className="text-lg font-semibold mb-4">
            Loss: {model && model.loss ? model.loss.toFixed(4) : "Not trained yet"}
          </h3>
          <div className="h-64">
            {lossData.length > 0 ? (
              <ChartContainer config={{ loss: { label: "Loss", color: "#3b82f6" } }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={lossData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="iteration" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line 
                      type="monotone" 
                      dataKey="loss" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No training data yet
              </div>
            )}
          </div>
        </div>

        {/* Accuracy Chart */}
        <div className="glass-panel p-6 rounded-xl">
          <h3 className="text-lg font-semibold mb-4">
            Accuracy: {model && model.trainingHistory.accuracy.length > 0 ? 
              `${(model.trainingHistory.accuracy[model.trainingHistory.accuracy.length - 1] * 100).toFixed(1)}%` : 
              "Not trained yet"}
          </h3>
          <div className="h-64">
            {accuracyData.length > 0 ? (
              <ChartContainer config={{ accuracy: { label: "Accuracy", color: "#10b981" } }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={accuracyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="iteration" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" domain={[0, 100]} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line 
                      type="monotone" 
                      dataKey="accuracy" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No training data yet
              </div>
            )}
          </div>
        </div>

        {/* Weight Distribution */}
        <div className="glass-panel p-6 rounded-xl">
          <h3 className="text-lg font-semibold mb-4">
            Weight Distribution
          </h3>
          <div className="h-64">
            {weightData.length > 0 ? (
              <ChartContainer config={{ count: { label: "Count", color: "#8b5cf6" } }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weightData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="bin" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="count" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No weights to display
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NeuralNetworkVisualization;
