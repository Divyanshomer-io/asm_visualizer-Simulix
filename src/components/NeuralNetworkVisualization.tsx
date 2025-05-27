import React, { useState, useEffect, useRef } from "react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar, ReferenceLine, ErrorBar } from "recharts";
import { Info } from "lucide-react";
import { NeuralNetworkParams, SimpleMLP, generateClassificationDataset, PARAM_LIMITS, TrainingHistory } from "@/utils/neuralNetwork";

interface NeuralNetworkVisualizationProps {
  params: NeuralNetworkParams;
}

const NeuralNetworkVisualization: React.FC<NeuralNetworkVisualizationProps> = ({ params }) => {
  const [model, setModel] = useState<SimpleMLP | null>(null);
  const [dataset, setDataset] = useState<{ X: number[][], y: number[] } | null>(null);
  const [activations, setActivations] = useState<number[][] | null>(null);
  const [trainingHistory, setTrainingHistory] = useState<TrainingHistory | null>(null);
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
      // Generate more challenging dataset
      const newDataset = generateClassificationDataset(PARAM_LIMITS.maxSamples, params.inputNeurons);
      setDataset(newDataset);
      
      // Reset model and training history
      setModel(null);
      setActivations(null);
      setTrainingHistory(null);
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
      
      // Use new validation-aware training
      const history = newModel.trainWithValidation(dataset.X, dataset.y, 150); // More epochs for realistic training
      
      // Get sample activations
      const sampleActivations = newModel.forward(dataset.X[0]);
      
      setModel(newModel);
      setActivations(sampleActivations);
      setTrainingHistory(history);
      
      // Log quality warnings
      if (history.qualityWarnings.length > 0) {
        console.warn('Training Quality Warnings:', history.qualityWarnings);
      }
      
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
      
      // Single epoch training
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
    setTrainingHistory(null);
    setErrorMessage("");
  };

  // Prepare training/validation chart data
  const trainingData = trainingHistory ? trainingHistory.metrics.map(metric => ({
    epoch: metric.epoch,
    trainLoss: parseFloat(metric.trainLoss.toFixed(4)),
    valLoss: parseFloat(metric.valLoss.toFixed(4)),
    trainAccuracy: parseFloat((metric.trainAccuracy * 100).toFixed(2)),
    valAccuracy: parseFloat((metric.valAccuracy * 100).toFixed(2)),
    overfitting: metric.overfittingWarning
  })) : [];

  // Weight distribution data
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
    if (trainingHistory) {
      title += `, Epochs: ${trainingHistory.finalEpoch}`;
      if (trainingHistory.earlyStopped) {
        title += ' (Early Stopped)';
      }
      const finalMetrics = trainingHistory.metrics[trainingHistory.metrics.length - 1];
      if (finalMetrics) {
        title += `, Val Acc: ${(finalMetrics.valAccuracy * 100).toFixed(1)}%`;
      }
    }
    return title;
  };

  return (
    <TooltipProvider>
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
                {isTraining ? "Training..." : "Train with Validation"}
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
              
              {/* Quality Warnings */}
              {trainingHistory && (trainingHistory.qualityWarnings.length > 0 || trainingHistory.datasetValidation.warnings.length > 0) && (
                <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-300 mb-2">Training Quality Warnings:</h4>
                  <ul className="text-sm text-yellow-200 space-y-1">
                    {trainingHistory.qualityWarnings.map((warning, i) => (
                      <li key={i}>• {warning}</li>
                    ))}
                    {trainingHistory.datasetValidation.warnings.map((warning, i) => (
                      <li key={`dataset-${i}`}>• {warning}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Training Metrics - Updated Layout */}
        <div className="space-y-6">
          {/* Accuracy Chart - Full Width with increased height */}
          <div className="glass-panel p-6 rounded-xl">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-lg font-semibold">
                Accuracy Curves
                {trainingHistory && trainingHistory.metrics.length > 0 && (
                  <span className="text-sm font-normal opacity-70 ml-2">
                    (Final: {(trainingHistory.metrics[trainingHistory.metrics.length - 1].valAccuracy * 100).toFixed(1)}%)
                  </span>
                )}
              </h3>
              <Tooltip>
                <TooltipTrigger>
                  <Info size={16} className="text-muted-foreground hover:text-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs text-xs">
                    Graph showing how the model's accuracy improves over training iterations, reflecting the model's performance on the training or validation data.
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="h-96 w-full overflow-hidden">
              {trainingData.length > 0 ? (
                <ChartContainer config={{ 
                  trainAccuracy: { label: "Training Accuracy", color: "#10b981" },
                  valAccuracy: { label: "Validation Accuracy", color: "#f59e0b" }
                }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trainingData} margin={{ top: 10, right: 10, bottom: 40, left: 40 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis 
                        dataKey="epoch" 
                        stroke="#9ca3af" 
                        label={{ 
                          value: 'Epoch', 
                          position: 'insideBottom', 
                          offset: -10,
                          style: { textAnchor: 'middle', fontWeight: 'bold', fill: 'currentColor' }
                        }} 
                      />
                      <YAxis 
                        stroke="#9ca3af" 
                        domain={[0, 100]} 
                        label={{ 
                          value: 'Accuracy (%)', 
                          angle: -90, 
                          position: 'insideLeft',
                          style: { textAnchor: 'middle', fontWeight: 'bold', fill: 'currentColor' }
                        }}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line 
                        type="monotone" 
                        dataKey="trainAccuracy" 
                        stroke="#10b981" 
                        strokeWidth={2}
                        dot={{ r: 2 }}
                        name="Training Accuracy"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="valAccuracy" 
                        stroke="#f59e0b" 
                        strokeWidth={2}
                        dot={{ r: 2 }}
                        name="Validation Accuracy"
                      />
                      {/* Overfitting warning markers */}
                      {trainingData.some(d => d.overfitting) && (
                        <ReferenceLine 
                          y={95} 
                          stroke="#ef4444" 
                          strokeDasharray="3 3"
                          label={{ value: "Overfitting Zone", position: "insideTopRight" }}
                        />
                      )}
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

          {/* Loss and Weight Distribution - Side by Side with increased heights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Loss Chart with Train/Val Curves */}
            <div className="glass-panel p-6 rounded-xl">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-lg font-semibold">
                  Loss Curves {trainingHistory && trainingHistory.earlyStopped && '(Early Stopped)'}
                </h3>
                <Tooltip>
                  <TooltipTrigger>
                    <Info size={16} className="text-muted-foreground hover:text-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs text-xs">
                      Graph showing how the training loss decreases over iterations, indicating how well the model is minimizing error.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="h-96">
                {trainingData.length > 0 ? (
                  <ChartContainer config={{ 
                    trainLoss: { label: "Training Loss", color: "#3b82f6" },
                    valLoss: { label: "Validation Loss", color: "#ef4444" }
                  }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={trainingData} margin={{ top: 10, right: 10, bottom: 40, left: 40 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis 
                          dataKey="epoch" 
                          stroke="#9ca3af" 
                          label={{ 
                            value: 'Epoch', 
                            position: 'insideBottom', 
                            offset: -10,
                            style: { textAnchor: 'middle', fontWeight: 'bold', fill: 'currentColor' }
                          }} 
                        />
                        <YAxis 
                          stroke="#9ca3af" 
                          label={{ 
                            value: 'Loss', 
                            angle: -90, 
                            position: 'insideLeft',
                            style: { textAnchor: 'middle', fontWeight: 'bold', fill: 'currentColor' }
                          }}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line 
                          type="monotone" 
                          dataKey="trainLoss" 
                          stroke="#3b82f6" 
                          strokeWidth={2}
                          dot={{ r: 2 }}
                          name="Training Loss"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="valLoss" 
                          stroke="#ef4444" 
                          strokeWidth={2}
                          dot={{ r: 2 }}
                          name="Validation Loss"
                        />
                        {trainingHistory?.earlyStopped && (
                          <ReferenceLine 
                            x={trainingHistory.finalEpoch} 
                            stroke="#10b981" 
                            strokeDasharray="5 5"
                            label={{ value: "Early Stop", position: "top" }}
                          />
                        )}
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
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-lg font-semibold">
                  Weight Distribution
                </h3>
                <Tooltip>
                  <TooltipTrigger>
                    <Info size={16} className="text-muted-foreground hover:text-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs text-xs">
                      Histogram displaying the distribution of all connection weights in the network, showing how weights are spread and updated during training.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="h-96">
                {weightData.length > 0 ? (
                  <ChartContainer config={{ count: { label: "Count", color: "#8b5cf6" } }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={weightData} margin={{ top: 10, right: 10, bottom: 40, left: 40 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis 
                          dataKey="bin" 
                          stroke="#9ca3af" 
                          label={{ 
                            value: 'Weight Value', 
                            position: 'insideBottom', 
                            offset: -10,
                            style: { textAnchor: 'middle', fontWeight: 'bold', fill: 'currentColor' }
                          }}
                        />
                        <YAxis 
                          stroke="#9ca3af" 
                          label={{ 
                            value: 'Frequency', 
                            angle: -90, 
                            position: 'insideLeft',
                            style: { textAnchor: 'middle', fontWeight: 'bold', fill: 'currentColor' }
                          }}
                        />
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

        {/* Dataset Validation Summary */}
        {trainingHistory?.datasetValidation && (
          <div className="glass-panel p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-4">Dataset Validation Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Duplicates Found</p>
                <p className="font-medium">{trainingHistory.datasetValidation.duplicatesFound}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Simple Model Accuracy</p>
                <p className="font-medium">{(trainingHistory.datasetValidation.simpleModelAccuracy * 100).toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-muted-foreground">Train Class Distribution</p>
                <p className="font-medium">{trainingHistory.datasetValidation.trainClassDistribution.join(' / ')}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Dataset Quality</p>
                <p className={`font-medium ${trainingHistory.datasetValidation.datasetTooSimple ? 'text-yellow-400' : 'text-green-400'}`}>
                  {trainingHistory.datasetValidation.datasetTooSimple ? 'Too Simple' : 'Appropriate'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};

export default NeuralNetworkVisualization;
