import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar, ReferenceLine } from "recharts";
import { Info } from "lucide-react";
import { NeuralNetworkParams, SimpleMLP, generateClassificationDataset, PARAM_LIMITS, TrainingHistory } from "@/utils/neuralNetwork";

interface NeuralNetworkVisualizationProps {
  params: NeuralNetworkParams;
  inputValues: number[];
  hasInputErrors: boolean;
}

const NeuralNetworkVisualization: React.FC<NeuralNetworkVisualizationProps> = ({ 
  params, 
  inputValues, 
  hasInputErrors 
}) => {
  const [model, setModel] = useState<SimpleMLP | null>(null);
  const [dataset, setDataset] = useState<{ X: number[][], y: number[] } | null>(null);
  const [activations, setActivations] = useState<number[][] | null>(null);
  const [trainingHistory, setTrainingHistory] = useState<TrainingHistory | null>(null);
  const [isTraining, setIsTraining] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isStepTrainingInitialized, setIsStepTrainingInitialized] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Initialize empty training history for plot initialization
  const [plotsInitialized, setPlotsInitialized] = useState(false);

  // Validate parameters
  useEffect(() => {
    if (params.inputNeurons > PARAM_LIMITS.maxInput ||
        params.hiddenLayers > PARAM_LIMITS.maxHiddenLayers ||
        params.neuronsPerHidden > PARAM_LIMITS.maxNeurons) {
      setErrorMessage(`Max exceeded: Input=${PARAM_LIMITS.maxInput}, Layers=${PARAM_LIMITS.maxHiddenLayers}, Neurons=${PARAM_LIMITS.maxNeurons}`);
    } else {
      setErrorMessage("");
      // Generate dataset with current input count
      const newDataset = generateClassificationDataset(PARAM_LIMITS.maxSamples, params.inputNeurons);
      setDataset(newDataset);
      
      // Reset model and training history
      setModel(null);
      setActivations(null);
      setTrainingHistory(null);
      setIsStepTrainingInitialized(false);
      setPlotsInitialized(false);
    }
  }, [params.inputNeurons, params.hiddenLayers, params.neuronsPerHidden]);

  // Initialize empty plots on component mount
  useEffect(() => {
    if (!errorMessage && !plotsInitialized) {
      // Initialize empty training history for plot display
      const emptyHistory: TrainingHistory = {
        metrics: [],
        datasetValidation: {
          duplicatesFound: 0,
          trainClassDistribution: [],
          valClassDistribution: [],
          datasetTooSimple: false,
          simpleModelAccuracy: 0,
          warnings: []
        },
        qualityWarnings: [],
        earlyStopped: false,
        finalEpoch: 0,
        stepTrainingMode: false
      };
      setTrainingHistory(emptyHistory);
      setPlotsInitialized(true);
    }
  }, [errorMessage, plotsInitialized]);

  // Draw network visualization
  useEffect(() => {
    if (!canvasRef.current || errorMessage) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Network structure with current input count
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

    // Draw neurons with user input highlighting
    positions.forEach((layerPositions, layerIndex) => {
      layerPositions.forEach((pos, neuronIndex) => {
        // Determine neuron appearance
        let color = '#64748b'; // Default gray
        let radius = 15;
        
        if (layerIndex === 0) {
          // Input layer - highlight based on user input values
          const inputValue = inputValues[neuronIndex];
          if (inputValue !== undefined) {
            // Color gradient from blue (-3.0) to red (3.0)
            const normalizedValue = (inputValue + 3.0) / 6.0; // Normalize to [0, 1]
            const hue = (1 - normalizedValue) * 240; // Blue (240) to Red (0)
            const saturation = 70 + Math.abs(inputValue) * 10; // Increase saturation with magnitude
            const lightness = 50 + Math.abs(inputValue) * 5; // Increase lightness with magnitude
            color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
            radius = 12 + Math.abs(inputValue) * 3; // Size based on magnitude
          } else {
            color = '#3b82f6'; // Default blue
          }
        } else if (activations && layerIndex < activations.length && neuronIndex < activations[layerIndex].length) {
          const activation = activations[layerIndex][neuronIndex];
          const intensity = Math.min(1.0, Math.abs(activation));
          
          if (layerIndex === positions.length - 1) {
            color = `hsl(142, ${50 + intensity * 50}%, ${60 + intensity * 20}%)`; // Green
          } else {
            color = `hsl(38, ${50 + intensity * 50}%, ${60 + intensity * 20}%)`; // Orange
          }
          
          radius = 12 + intensity * 8;
        } else {
          // Default colors
          if (layerIndex === positions.length - 1) color = '#10b981'; // Green
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

        // Draw value text
        let displayValue = '';
        if (layerIndex === 0 && inputValues[neuronIndex] !== undefined) {
          displayValue = inputValues[neuronIndex].toFixed(1);
        } else if (activations && layerIndex < activations.length && neuronIndex < activations[layerIndex].length) {
          displayValue = activations[layerIndex][neuronIndex].toFixed(1);
        }
        
        if (displayValue) {
          ctx.fillStyle = '#fff';
          ctx.font = '10px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(displayValue, pos.x, pos.y + 3);
        }
      });
    });

  }, [params, model, activations, errorMessage, inputValues]);

  const trainNetwork = async () => {
    if (!dataset || errorMessage) return;

    if (hasInputErrors) {
      // Pulse effect for button to indicate errors
      const button = document.querySelector('.train-button');
      if (button) {
        button.classList.add('animate-pulse', 'bg-red-500');
        setTimeout(() => {
          button.classList.remove('animate-pulse', 'bg-red-500');
        }, 1000);
      }
    }

    setIsTraining(true);
    try {
      const layers = [params.inputNeurons, ...Array(params.hiddenLayers).fill(params.neuronsPerHidden), 1];
      const newModel = new SimpleMLP(layers, params.activation, params.learningRate, params.alpha);
      
      // Use new validation-aware training
      const history = newModel.trainWithValidation(dataset.X, dataset.y, 150);
      
      // Get sample activations using current valid input values
      const sampleInput = inputValues.length === params.inputNeurons ? inputValues : dataset.X[0];
      const sampleActivations = newModel.forward(sampleInput);
      
      setModel(newModel);
      setActivations(sampleActivations);
      setTrainingHistory(history);
      setIsStepTrainingInitialized(false);
      
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

    if (hasInputErrors) {
      // Pulse effect for button to indicate errors
      const button = document.querySelector('.step-button');
      if (button) {
        button.classList.add('animate-pulse', 'bg-red-500');
        setTimeout(() => {
          button.classList.remove('animate-pulse', 'bg-red-500');
        }, 1000);
      }
    }

    setIsTraining(true);
    try {
      let currentModel = model;
      
      // Initialize model and step training if not already done
      if (!currentModel || !isStepTrainingInitialized) {
        const layers = [params.inputNeurons, ...Array(params.hiddenLayers).fill(params.neuronsPerHidden), 1];
        currentModel = new SimpleMLP(layers, params.activation, params.learningRate, params.alpha);
        
        // Initialize step training with dataset
        currentModel.initializeStepTraining(dataset.X, dataset.y);
        setIsStepTrainingInitialized(true);
        
        // Initialize training history for first step
        const initialHistory = currentModel.getTrainingHistory();
        setTrainingHistory(initialHistory);
      }
      
      // Perform single training step
      const stepMetrics = currentModel.trainSingleStep();
      
      if (stepMetrics) {
        // Update training history with new step
        const updatedHistory = currentModel.getTrainingHistory();
        setTrainingHistory({ ...updatedHistory });
        
        // Get sample activations using current valid input values
        const sampleInput = inputValues.length === params.inputNeurons ? inputValues : dataset.X[0];
        const sampleActivations = currentModel.forward(sampleInput);
        setActivations(sampleActivations);
        setModel(currentModel);
        
        console.log('Step training completed:', stepMetrics);
      }
      
    } catch (error) {
      setErrorMessage(`Training error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsTraining(false);
    }
  };

  const resetNetwork = () => {
    if (model) {
      model.resetStepTraining();
    }
    setModel(null);
    setActivations(null);
    setIsStepTrainingInitialized(false);
    setErrorMessage("");
    
    // Reset to empty training history to maintain plot structure
    const emptyHistory: TrainingHistory = {
      metrics: [],
      datasetValidation: {
        duplicatesFound: 0,
        trainClassDistribution: [],
        valClassDistribution: [],
        datasetTooSimple: false,
        simpleModelAccuracy: 0,
        warnings: []
      },
      qualityWarnings: [],
      earlyStopped: false,
      finalEpoch: 0,
      stepTrainingMode: false
    };
    setTrainingHistory(emptyHistory);
  };

  // Update activations when user changes input values (if model exists)
  useEffect(() => {
    if (model && inputValues.length === params.inputNeurons) {
      const newActivations = model.forward(inputValues);
      setActivations(newActivations);
    }
  }, [inputValues, model, params.inputNeurons]);

  // Prepare training/validation chart data with single-point handling
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
    if (trainingHistory && trainingHistory.metrics.length > 0) {
      title += `, Epochs: ${trainingHistory.finalEpoch || trainingHistory.metrics.length}`;
      if (trainingHistory.earlyStopped) {
        title += ' (Early Stopped)';
      }
      if (trainingHistory.stepTrainingMode) {
        title += ' (Step Mode)';
      }
      const finalMetrics = trainingHistory.metrics[trainingHistory.metrics.length - 1];
      if (finalMetrics) {
        title += `, Val Acc: ${(finalMetrics.valAccuracy * 100).toFixed(1)}%`;
      }
    }
    return title;
  };

  // Create placeholder data for empty plots
  const getPlaceholderData = () => [{
    epoch: 0,
    trainLoss: 0,
    valLoss: 0,
    trainAccuracy: 0,
    valAccuracy: 0,
    overfitting: false
  }];

  // Determine if we should show placeholder data
  const displayData = trainingData.length > 0 ? trainingData : getPlaceholderData();
  const isEmptyPlot = trainingData.length === 0;

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
                className="train-button control-btn-primary disabled:opacity-50 transition-all duration-300"
              >
                {isTraining ? "Training..." : "Train with Validation"}
              </button>
              <button
                onClick={stepTraining}
                disabled={isTraining || !!errorMessage}
                className="step-button control-btn disabled:opacity-50 transition-all duration-300"
              >
                {isStepTrainingInitialized ? "Next Step" : "Start Step Training"}
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
          {/* Accuracy Chart - Full Width with proper single-point handling */}
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
            <div className="h-80 w-full overflow-hidden">
              <ChartContainer config={{ 
                trainAccuracy: { label: "Training Accuracy", color: "#10b981" },
                valAccuracy: { label: "Validation Accuracy", color: "#f59e0b" }
              }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={displayData} margin={{ top: 20, right: 30, bottom: 60, left: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="epoch" 
                      stroke="#9ca3af" 
                      domain={isEmptyPlot ? [0, 10] : ['dataMin', 'dataMax']}
                      type="number"
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
                    <ChartTooltip content={isEmptyPlot ? undefined : <ChartTooltipContent />} />
                    {!isEmptyPlot && (
                      <>
                        <Line 
                          type="monotone" 
                          dataKey="trainAccuracy" 
                          stroke="#10b981" 
                          strokeWidth={2}
                          dot={{ r: trainingData.length === 1 ? 6 : 2 }}
                          name="Training Accuracy"
                          connectNulls={false}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="valAccuracy" 
                          stroke="#f59e0b" 
                          strokeWidth={2}
                          dot={{ r: trainingData.length === 1 ? 6 : 2 }}
                          name="Validation Accuracy"
                          connectNulls={false}
                        />
                      </>
                    )}
                    {/* Overfitting warning markers */}
                    {!isEmptyPlot && trainingData.some(d => d.overfitting) && (
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
              {isEmptyPlot && (
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-secondary/10">
                  <div className="text-center">
                    <p className="text-lg font-medium">No Training Data Yet</p>
                    <p className="text-sm mt-2">Start training to see accuracy curves</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Loss and Weight Distribution - Full Width with Tabs */}
          <div className="glass-panel p-6 rounded-xl">
            <Tabs defaultValue="loss" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="loss">Loss Curves</TabsTrigger>
                <TabsTrigger value="weights">Weight Distribution</TabsTrigger>
              </TabsList>
              
              <TabsContent value="loss" className="mt-6">
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
                <div className="h-80 relative">
                  <ChartContainer config={{ 
                    trainLoss: { label: "Training Loss", color: "#3b82f6" },
                    valLoss: { label: "Validation Loss", color: "#ef4444" }
                  }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={displayData} margin={{ top: 20, right: 30, bottom: 60, left: 60 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis 
                          dataKey="epoch" 
                          stroke="#9ca3af" 
                          domain={isEmptyPlot ? [0, 10] : ['dataMin', 'dataMax']}
                          type="number"
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
                        <ChartTooltip content={isEmptyPlot ? undefined : <ChartTooltipContent />} />
                        {!isEmptyPlot && (
                          <>
                            <Line 
                              type="monotone" 
                              dataKey="trainLoss" 
                              stroke="#3b82f6" 
                              strokeWidth={2}
                              dot={{ r: trainingData.length === 1 ? 6 : 2 }}
                              name="Training Loss"
                              connectNulls={false}
                            />
                            <Line 
                              type="monotone" 
                              dataKey="valLoss" 
                              stroke="#ef4444" 
                              strokeWidth={2}
                              dot={{ r: trainingData.length === 1 ? 6 : 2 }}
                              name="Validation Loss"
                              connectNulls={false}
                            />
                          </>
                        )}
                        {trainingHistory?.earlyStopped && !isEmptyPlot && (
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
                  {isEmptyPlot && (
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-secondary/10">
                      <div className="text-center">
                        <p className="text-lg font-medium">No Training Data Yet</p>
                        <p className="text-sm mt-2">Start training to see loss curves</p>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="weights" className="mt-6">
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
                <div className="h-80 relative">
                  {weightData.length > 0 ? (
                    <ChartContainer config={{ count: { label: "Count", color: "#8b5cf6" } }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={weightData} margin={{ top: 20, right: 30, bottom: 60, left: 60 }}>
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
                    <div className="flex items-center justify-center h-full text-muted-foreground bg-secondary/10">
                      <div className="text-center">
                        <p className="text-lg font-medium">No Weights to Display</p>
                        <p className="text-sm mt-2">Initialize network to see weight distribution</p>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Dataset Validation Summary */}
        {trainingHistory?.datasetValidation && trainingHistory.metrics.length > 0 && (
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
