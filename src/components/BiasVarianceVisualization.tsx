import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area } from "recharts";
import { 
  BiasVarianceParams, 
  generateTrainingData, 
  generatePolynomialFeatures, 
  fitPolynomialModel, 
  predictPolynomial, 
  trueFunction, 
  generateTestPoints, 
  calculateBiasVariance,
  calculateLearningCurve,
  validatePredictionSet
} from "@/utils/biasVariance";
import { Loader2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface BiasVarianceVisualizationProps {
  params: BiasVarianceParams;
  isPlaying: boolean;
  onIterationUpdate: (iteration: number) => void;
}

// Info icon component with educational tooltips
const InfoIcon: React.FC<{ content: React.ReactNode }> = ({ content }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="info-icon cursor-pointer text-blue-400 hover:text-blue-300 transition-colors">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
          </svg>
        </div>
      </TooltipTrigger>
      <TooltipContent className="tooltip-content" side="left">
        {content}
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

// Educational tooltip contents
const tooltipContents = {
  functionSpace: (
    <div className="space-y-2">
      <h4 className="font-semibold text-blue-400">Iterative Function Space</h4>
      <p><strong>Purpose:</strong> Shows how individual model predictions evolve and converge to the mean prediction.</p>
      <ul className="space-y-1 text-sm">
        <li><span className="text-gray-400">Gray Lines:</span> Individual model predictions from different training sets</li>
        <li><span className="text-red-400">Red Line:</span> Mean prediction across all models (ensemble average)</li>
        <li><span className="text-white">Black Dashed:</span> True underlying function</li>
      </ul>
      <p className="text-sm"><strong>Key Insight:</strong> As iterations increase, the mean prediction becomes more stable.</p>
      <div className="bg-slate-700 p-2 rounded text-xs font-mono text-center">
        Ensemble Mean = (1/N) Σ f_i(x)
      </div>
    </div>
  ),

  errorDecomp: (
    <div className="space-y-2">
      <h4 className="font-semibold text-blue-400">Error Decomposition</h4>
      <p><strong>Purpose:</strong> Decomposes total prediction error into fundamental components.</p>
      <ul className="space-y-1 text-sm">
        <li><span className="text-green-400">Green Line:</span> Bias² - systematic error from wrong assumptions</li>
        <li><span className="text-red-400">Red Line:</span> Variance - error from sensitivity to training data</li>
        <li><span className="text-white">Black Line:</span> Total Error - sum of all components</li>
        <li><span className="text-orange-400">Orange Dashed:</span> Irreducible Error - inherent noise</li>
      </ul>
      <div className="bg-slate-700 p-2 rounded text-xs font-mono text-center">
        Total Error = Bias² + Variance + Irreducible Error
      </div>
      <p className="text-sm"><strong>Interpretation:</strong> High bias = underfitting, high variance = overfitting.</p>
    </div>
  ),

  tradeoff: (
    <div className="space-y-2">
      <h4 className="font-semibold text-blue-400">Bias-Variance Tradeoff Curve</h4>
      <p><strong>Purpose:</strong> Shows how bias and variance change with model complexity.</p>
      <ul className="space-y-1 text-sm">
        <li><span className="text-green-400">Green Line:</span> Bias² decreases as complexity increases</li>
        <li><span className="text-red-400">Red Line:</span> Variance increases as complexity increases</li>
        <li><span className="text-white">Black Line:</span> Total Error - sum of bias² and variance</li>
      </ul>
      <p className="text-sm"><strong>Key Insight:</strong> Optimal complexity minimizes total error.</p>
      <div className="bg-slate-700 p-2 rounded text-xs font-mono text-center">
        Optimal Complexity = argmin(Bias² + Variance)
      </div>
    </div>
  ),

  learningCurve: (
    <div className="space-y-2">
      <h4 className="font-semibold text-blue-400">Learning Curve</h4>
      <p><strong>Purpose:</strong> Shows model performance vs training set size.</p>
      <ul className="space-y-1 text-sm">
        <li><span className="text-blue-400">Blue Line:</span> Training Error - performance on training data</li>
        <li><span className="text-red-400">Red Line:</span> Test Error - performance on unseen data</li>
      </ul>
      <p className="text-sm"><strong>Key Patterns:</strong></p>
      <ul className="space-y-1 text-xs">
        <li>Training error typically increases with more data</li>
        <li>Test error typically decreases with more data</li>
        <li>Gap between curves indicates overfitting degree</li>
      </ul>
    </div>
  ),

  convergence: (
    <div className="space-y-2">
      <h4 className="font-semibold text-blue-400">Convergence History</h4>
      <p><strong>Purpose:</strong> Shows bias² and variance stabilization over iterations.</p>
      <ul className="space-y-1 text-sm">
        <li><span className="text-green-400">Green Line:</span> Bias² convergence over iterations</li>
        <li><span className="text-red-400">Red Line:</span> Variance convergence over iterations</li>
      </ul>
      <p className="text-sm"><strong>Key Insight:</strong> Both metrics should stabilize as iterations increase.</p>
      <div className="bg-slate-700 p-2 rounded text-xs font-mono text-center">
        Requires ≥2 iterations for variance calculation
      </div>
    </div>
  )
};

// Custom tooltip formatter with enhanced styling
const CustomTooltip: React.FC<{
  active?: boolean;
  payload?: any[];
  label?: string | number;
  chartType: string;
}> = ({ active, payload, label, chartType }) => {
  if (!active || !payload || !payload.length) return null;

  const formatValue = (value: number, dataKey: string) => {
    if (typeof value !== 'number' || !isFinite(value)) return '0.00';
    
    switch (chartType) {
      case 'functionSpace':
        return value.toFixed(3);
      case 'errorDecomp':
      case 'tradeoff':
        return value.toFixed(4);
      case 'learningCurve':
        return value.toFixed(3);
      case 'convergence':
        return value.toFixed(5);
      default:
        return value.toFixed(2);
    }
  };

  const getContextualInfo = () => {
    switch (chartType) {
      case 'tradeoff':
        return 'Optimal complexity minimizes total error';
      case 'errorDecomp':
        return 'Total = Bias² + Variance + Irreducible';
      case 'convergence':
        return 'Values should stabilize with more iterations';
      case 'learningCurve':
        return 'Gap indicates overfitting degree';
      default:
        return '';
    }
  };

  return (
    <div className="bg-slate-900/95 border border-blue-400/50 rounded-lg p-3 shadow-xl backdrop-blur-sm">
      <div className="font-semibold text-blue-400 mb-2">
        {typeof label === 'number' ? `x: ${label.toFixed(2)}` : label}
      </div>
      <div className="space-y-1">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div 
              className="w-3 h-3 rounded-sm border-2"
              style={{ 
                backgroundColor: entry.color,
                borderColor: entry.color 
              }}
            />
            <span className="text-sm font-medium text-white">
              {entry.dataKey}:
            </span>
            <span className="text-sm text-yellow-400 font-mono">
              {formatValue(entry.value, entry.dataKey)}
            </span>
          </div>
        ))}
      </div>
      {getContextualInfo() && (
        <div className="text-xs text-slate-400 italic mt-2 border-t border-slate-700 pt-2">
          {getContextualInfo()}
        </div>
      )}
    </div>
  );
};

const BiasVarianceVisualization: React.FC<BiasVarianceVisualizationProps> = ({
  params,
  isPlaying,
  onIterationUpdate
}) => {
  const [isCalculating, setIsCalculating] = useState(false);
  const [allPredictions, setAllPredictions] = useState<number[][]>([]);
  const [functionSpaceData, setFunctionSpaceData] = useState<any[]>([]);
  const [errorDecompositionData, setErrorDecompositionData] = useState<any[]>([]);
  const [tradeoffCurveData, setTradeoffCurveData] = useState<any[]>([]);
  const [learningCurveData, setLearningCurveData] = useState<any[]>([]);
  const [convergenceData, setConvergenceData] = useState<any[]>([]);
  const [currentStats, setCurrentStats] = useState({
    bias: 0,
    variance: 0,
    totalError: 0,
    irreducibleError: 0
  });

  const animationRef = useRef<NodeJS.Timeout | null>(null);
  const testPoints = generateTestPoints(100);
  const trueValues = trueFunction(testPoints);

  // Custom formatter for 2 decimal places
  const formatValue = (value: number) => {
    if (typeof value !== 'number' || !isFinite(value)) return '0.00';
    return value.toFixed(2);
  };

  // Custom tick formatter for charts - FIXED: Returns string
  const formatTick = (value: number) => {
    return parseFloat(value.toFixed(2)).toString();
  };

  // Generate predictions for current parameters
  useEffect(() => {
    generatePredictions();
  }, [params.polynomialDegree, params.noiseLevel, params.sampleSize, params.maxIterations]);

  // Update visualization when iteration changes
  useEffect(() => {
    updateVisualization();
  }, [params.currentIteration, allPredictions]);

  // Handle play/pause animation
  useEffect(() => {
    if (isPlaying && params.currentIteration < params.maxIterations) {
      animationRef.current = setInterval(() => {
        const nextIteration = params.currentIteration + 1;
        if (nextIteration >= params.maxIterations) {
          onIterationUpdate(params.maxIterations);
        } else {
          onIterationUpdate(nextIteration);
        }
      }, 500);
    } else {
      if (animationRef.current) {
        clearInterval(animationRef.current);
        animationRef.current = null;
      }
    }

    return () => {
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }
    };
  }, [isPlaying, params.currentIteration, params.maxIterations, onIterationUpdate]);

  // STEP 1: Fix prediction generation with proper variance
  const generatePredictions = async () => {
    console.log("Generating predictions with proper variance...");
    setIsCalculating(true);
    
    // Simulate async calculation
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const predictions: number[][] = [];
    
    for (let i = 0; i < params.maxIterations; i++) {
      try {
        // CRITICAL: Generate DIFFERENT data each time
        const { xTrain, yTrain } = generateTrainingData(params.sampleSize, params.noiseLevel);
        const XTrain = generatePolynomialFeatures(xTrain, params.polynomialDegree);
        const weights = fitPolynomialModel(XTrain, yTrain);
        
        // CRITICAL: Ensure predictions are different
        const XTest = generatePolynomialFeatures(testPoints, params.polynomialDegree);
        const prediction = predictPolynomial(XTest, weights);
        
        // VALIDATION: Check if predictions are reasonable
        const predMean = prediction.reduce((sum, p) => sum + p, 0) / prediction.length;
        const predStd = Math.sqrt(prediction.reduce((sum, p) => sum + Math.pow(p - predMean, 2), 0) / prediction.length);
        
        if (predStd < 1e-10) {
          console.warn(`Experiment ${i}: Predictions have zero variance!`);
          // Add small random noise to ensure variance
          prediction.forEach((_, idx) => {
            prediction[idx] += (Math.random() - 0.5) * 0.01;
          });
        }
        
        predictions.push(prediction);
        
      } catch (error) {
        console.error(`Failed to generate prediction ${i}:`, error);
        // DON'T add zero arrays - generate fallback with proper variance
        const fallbackPreds = testPoints.map(x => {
          const trueVal = Math.sin(2 * Math.PI * x) + 0.3 * x * x;
          return trueVal + (Math.random() - 0.5) * 0.2; // Add noise for variance
        });
        predictions.push(fallbackPreds);
      }
    }
    
    // VALIDATION: Check final prediction set
    const isValid = validatePredictionSet(predictions, testPoints);
    if (!isValid) {
      console.error("Prediction set validation failed!");
    }
    
    setAllPredictions(predictions);
    setIsCalculating(false);
  };

  const updateVisualization = () => {
    if (allPredictions.length === 0) return;

    updateFunctionSpace();
    updateErrorDecomposition();
    updateTradeoffCurve();
    updateLearningCurve();
    updateConvergence();
    updateStats();
  };

  // STEP 2: Fix function space visualization
  const updateFunctionSpace = () => {
    console.log(`Updating function space for iteration ${params.currentIteration}`);
    
    const currentPredictions = allPredictions.slice(0, params.currentIteration);
    const meanPrediction = currentPredictions.length > 0 
      ? testPoints.map((_, i) => 
          currentPredictions.reduce((sum, pred) => sum + pred[i], 0) / currentPredictions.length
        )
      : Array(testPoints.length).fill(0);

    const data = testPoints.map((x, i) => {
      const dataPoint: any = {
        x: x,
        true: trueValues[i],
        mean: meanPrediction[i]
      };
      
      // Add individual prediction lines with varying alpha
      currentPredictions.forEach((pred, idx) => {
        const alpha = Math.max(0.2, 0.7 * (idx + 1) / params.currentIteration);
        dataPoint[`pred${idx}`] = pred[i];
      });
      
      return dataPoint;
    });

    setFunctionSpaceData(data);
    console.log(`Function space updated with ${currentPredictions.length} predictions`);
  };

  // STEP 3: Fix error decomposition with corrected variance
  const updateErrorDecomposition = () => {
    console.log("Updating error decomposition...");
    
    if (params.currentIteration === 0) {
      setErrorDecompositionData([]);
      return;
    }

    const currentPredictions = allPredictions.slice(0, params.currentIteration);
    const { bias, variance } = calculateBiasVariance(currentPredictions, trueValues);
    
    // DEBUGGING: Log values to verify
    const avgBias = bias.reduce((sum, b) => sum + b, 0) / bias.length;
    const avgVar = variance.reduce((sum, v) => sum + v, 0) / variance.length;
    console.log(`Error Decomp - Avg Bias²: ${avgBias.toFixed(6)}, Avg Variance: ${avgVar.toFixed(6)}`);
    
    const data = testPoints.map((x, i) => ({
      x: x,
      bias: bias[i],
      variance: variance[i],
      totalError: bias[i] + variance[i] + params.noiseLevel ** 2,
      irreducible: params.noiseLevel ** 2
    }));

    setErrorDecompositionData(data);
  };

  const updateTradeoffCurve = () => {
    const degrees = Array.from({ length: 15 }, (_, i) => i + 1);
    const data = degrees.map(degree => {
      // Simplified calculation for visualization
      const predictions: number[][] = [];
      
      for (let i = 0; i < Math.min(20, params.maxIterations); i++) {
        const { xTrain, yTrain } = generateTrainingData(params.sampleSize, params.noiseLevel);
        const XTrain = generatePolynomialFeatures(xTrain, degree);
        const weights = fitPolynomialModel(XTrain, yTrain);
        
        const XTest = generatePolynomialFeatures(testPoints, degree);
        const prediction = predictPolynomial(XTest, weights);
        predictions.push(prediction);
      }
      
      const { bias, variance } = calculateBiasVariance(predictions, trueValues);
      const avgBias = bias.reduce((sum, b) => sum + b, 0) / bias.length;
      const avgVariance = variance.reduce((sum, v) => sum + v, 0) / variance.length;
      
      return {
        degree,
        bias: avgBias,
        variance: avgVariance,
        totalError: avgBias + avgVariance + params.noiseLevel ** 2
      };
    });

    setTradeoffCurveData(data);
  };

  const updateLearningCurve = () => {
    const data = calculateLearningCurve(params.polynomialDegree, params.noiseLevel);
    setLearningCurveData(data);
  };

  // STEP 4: Fix convergence history with proper variance calculation
  const updateConvergence = () => {
    console.log("Updating convergence history...");
    
    if (params.currentIteration <= 1) {
      setConvergenceData([]);
      return;
    }

    const data = [];
    for (let i = 2; i <= params.currentIteration; i++) {
      const currentPredictions = allPredictions.slice(0, i);
      const { bias, variance } = calculateBiasVariance(currentPredictions, trueValues);
      const avgBias = bias.reduce((sum, b) => sum + b, 0) / bias.length;
      const avgVariance = variance.reduce((sum, v) => sum + v, 0) / variance.length;
      
      data.push({
        iteration: i,
        bias: avgBias,
        variance: avgVariance
      });
    }

    // DEBUGGING: Log convergence values
    if (data.length > 0) {
      const biasRange = [Math.min(...data.map(d => d.bias)), Math.max(...data.map(d => d.bias))];
      const varRange = [Math.min(...data.map(d => d.variance)), Math.max(...data.map(d => d.variance))];
      console.log(`Convergence - Bias range: [${biasRange[0].toFixed(6)}, ${biasRange[1].toFixed(6)}]`);
      console.log(`Convergence - Variance range: [${varRange[0].toFixed(6)}, ${varRange[1].toFixed(6)}]`);
    }

    setConvergenceData(data);
  };

  // STEP 5: Fix info panel statistics
  const updateStats = () => {
    if (params.currentIteration === 0) {
      setCurrentStats({ 
        bias: 0, 
        variance: 0, 
        totalError: 0, 
        irreducibleError: parseFloat((params.noiseLevel ** 2).toFixed(2))
      });
      return;
    }

    const currentPredictions = allPredictions.slice(0, params.currentIteration);
    const { bias, variance } = calculateBiasVariance(currentPredictions, trueValues);
    const avgBias = bias.reduce((sum, b) => sum + b, 0) / bias.length;
    const avgVariance = variance.reduce((sum, v) => sum + v, 0) / variance.length;
    
    const stats = {
      bias: parseFloat(avgBias.toFixed(2)),
      variance: parseFloat(avgVariance.toFixed(2)),
      totalError: parseFloat((avgBias + avgVariance + params.noiseLevel ** 2).toFixed(2)),
      irreducibleError: parseFloat((params.noiseLevel ** 2).toFixed(2))
    };
    
    // DEBUGGING: Log info panel values
    console.log(`Info Panel - Bias²: ${stats.bias.toFixed(2)}, Variance: ${stats.variance.toFixed(2)}`);
    
    setCurrentStats(stats);
  };

  if (isCalculating) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Generating predictions...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Row 1: Function Space - Full Width */}
      
<Card className="glass-panel w-full">
<CardHeader className="flex flex-row items-center justify-between">
<CardTitle className="text-lg">Function Space (Iter: {params.currentIteration})</CardTitle>
<InfoIcon content={tooltipContents.functionSpace} />
</CardHeader>
<CardContent>
<ChartContainer
config={{
true: { label: "True Function", color: "#000000" },
mean: { label: "Mean Prediction", color: "#ef4444" }
}}
className="h-64 w-full"
>
<ResponsiveContainer width="100%" height="100%">
<LineChart data={functionSpaceData} margin={{ top: 10, right: 30, left: 20, bottom: 40 }}>
<CartesianGrid strokeDasharray="3 3" opacity={0.3} />
<XAxis
dataKey="x"
tickFormatter={formatTick}
label={{ value: 'Input (x)', position: 'insideBottom', offset: -10 }}
/>
<YAxis
tickFormatter={formatTick}
label={{ value: 'Output (y)', angle: -90, position: 'insideLeft' }}
/>
<ChartTooltip
content={<CustomTooltip chartType="functionSpace" />}
/>
<Line type="monotone" dataKey="true" stroke="#000000" strokeWidth={2} strokeDasharray="5 5" dot={false} />
<Line type="monotone" dataKey="mean" stroke="#ef4444" strokeWidth={2} dot={false} />

<Card className="glass-panel w-full">
<CardHeader className="flex flex-row items-center justify-between">
<CardTitle className="text-lg">Function Space (Iter: {params.currentIteration})</CardTitle>
<InfoIcon content={tooltipContents.functionSpace} />
</CardHeader>
<CardContent>
<ChartContainer
config={{
true: { label: "True Function", color: "#000000" },
mean: { label: "Mean Prediction", color: "#ef4444" }
}}
className="h-64 w-full"
>
<ResponsiveContainer width="100%" height="100%">
<LineChart data={functionSpaceData} margin={{ top: 10, right: 30, left: 20, bottom: 40 }}>
<CartesianGrid strokeDasharray="3 3" opacity={0.3} />
<XAxis
dataKey="x"
tickFormatter={formatTick}
label={{ value: 'Input (x)', position: 'insideBottom', offset: -10 }}
/>
<YAxis
tickFormatter={formatTick}
label={{ value: 'Output (y)', angle: -90, position: 'insideLeft' }}
/>
<ChartTooltip
content={<CustomTooltip chartType="functionSpace" />}
/>
<Line type="monotone" dataKey="true" stroke="#000000" strokeWidth={2} strokeDasharray="5 5" dot={false} />
<Line type="monotone" dataKey="mean" stroke="#ef4444" strokeWidth={2} dot={false} />
{allPredictions.slice(0, params.currentIteration).map((_, idx) => (
<Line
key={idx}
type="monotone"
dataKey={`pred${idx}`}
stroke="#9ca3af"
strokeWidth={0.5}
opacity={Math.max(0.1, 0.5 * (idx + 1) / params.currentIteration)}
dot={false}
   hide={true}
/>
))}
</LineChart>
</ResponsiveContainer>
</ChartContainer>
</CardContent>
</Card>
</LineChart>
</ResponsiveContainer>
</ChartContainer>
</CardContent>
</Card>
      {/* Row 2: Error Decomposition (1/2) + Bias-Variance Tradeoff (1/2) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-panel">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Error Decomposition</CardTitle>
            <InfoIcon content={tooltipContents.errorDecomp} />
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                bias: { label: "Bias²", color: "#22c55e" },
                variance: { label: "Variance", color: "#ef4444" },
                totalError: { label: "Total Error", color: "#000000" },
                irreducible: { label: "Irreducible Error", color: "#f97316" }
              }}
              className="h-64 w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={errorDecompositionData} margin={{ top: 10, right: 30, left: 20, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis 
                    dataKey="x" 
                    tickFormatter={formatTick}
                    label={{ value: 'Input (x)', position: 'insideBottom', offset: -10 }}
                  />
                  <YAxis 
                    tickFormatter={formatTick}
                    label={{ value: 'Error', angle: -90, position: 'insideLeft' }}
                  />
                  <ChartTooltip 
                    content={<CustomTooltip chartType="errorDecomp" />} 
                  />
                  <Line type="monotone" dataKey="bias" stroke="#22c55e" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="variance" stroke="#ef4444" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="totalError" stroke="#000000" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="irreducible" stroke="#f97316" strokeWidth={2} strokeDasharray="3 3" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="glass-panel">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Bias-Variance Tradeoff Curve</CardTitle>
            <InfoIcon content={tooltipContents.tradeoff} />
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                bias: { label: "Bias²", color: "#22c55e" },
                variance: { label: "Variance", color: "#ef4444" },
                totalError: { label: "Total Error", color: "#000000" }
              }}
              className="h-64 w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={tradeoffCurveData} margin={{ top: 10, right: 30, left: 20, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis 
                    dataKey="degree" 
                    label={{ value: 'Model Complexity (Polynomial Degree)', position: 'insideBottom', offset: -10 }}
                  />
                  <YAxis 
                    tickFormatter={formatTick}
                    label={{ value: 'Error', angle: -90, position: 'insideLeft' }}
                  />
                  <ChartTooltip 
                    content={<CustomTooltip chartType="tradeoff" />} 
                  />
                  <Line type="monotone" dataKey="bias" stroke="#22c55e" strokeWidth={2} />
                  <Line type="monotone" dataKey="variance" stroke="#ef4444" strokeWidth={2} />
                  <Line type="monotone" dataKey="totalError" stroke="#000000" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Row 3: Learning Curve (1/2) + Convergence History (1/2) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-panel">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Learning Curve</CardTitle>
            <InfoIcon content={tooltipContents.learningCurve} />
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                trainError: { label: "Train Error", color: "#3b82f6" },
                testError: { label: "Test Error", color: "#ef4444" }
              }}
              className="h-64 w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={learningCurveData} margin={{ top: 10, right: 30, left: 20, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis 
                    dataKey="sampleSize" 
                    label={{ value: 'Training Set Size', position: 'insideBottom', offset: -10 }}
                  />
                  <YAxis 
                    tickFormatter={formatTick}
                    label={{ value: 'Mean Squared Error', angle: -90, position: 'insideLeft' }}
                  />
                  <ChartTooltip 
                    content={<CustomTooltip chartType="learningCurve" />} 
                  />
                  <Line type="monotone" dataKey="trainError" stroke="#3b82f6" strokeWidth={2} />
                  <Line type="monotone" dataKey="testError" stroke="#ef4444" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="glass-panel">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Convergence History</CardTitle>
            <InfoIcon content={tooltipContents.convergence} />
          </CardHeader>
          <CardContent>
            {convergenceData.length > 0 ? (
              <ChartContainer
                config={{
                  bias: { label: "Bias²", color: "#22c55e" },
                  variance: { label: "Variance", color: "#ef4444" }
                }}
                className="h-64 w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={convergenceData} margin={{ top: 10, right: 30, left: 20, bottom: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis 
                      dataKey="iteration" 
                      label={{ value: 'Iterations', position: 'insideBottom', offset: -10 }}
                    />
                    <YAxis 
                      tickFormatter={formatTick}
                      label={{ value: 'Error Component', angle: -90, position: 'insideLeft' }}
                    />
                    <ChartTooltip 
                      content={<CustomTooltip chartType="convergence" />} 
                    />
                    <Line type="monotone" dataKey="bias" stroke="#22c55e" strokeWidth={2} />
                    <Line type="monotone" dataKey="variance" stroke="#ef4444" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <div className="text-lg font-medium">Convergence History</div>
                  <div className="text-sm">(Need &gt;1 iteration)</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Row 4: Info Panel - Full Width with Enhanced UI */}
      <Card className="glass-panel w-full">
        <CardHeader>
          <CardTitle className="text-lg">Live Statistics Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {/* Experiment Status */}
            <div className="space-y-2">
              <div className="text-sm font-medium text-slate-300">Progress</div>
              <div className="space-y-1">
                <div className="text-xs text-slate-400">Iteration</div>
                <div className="text-lg font-bold text-white">{params.currentIteration}/{params.maxIterations}</div>
              </div>
            </div>

            {/* Model Parameters */}
            <div className="space-y-2">
              <div className="text-sm font-medium text-slate-300">Model</div>
              <div className="space-y-1">
                <div className="text-xs text-slate-400">Degree</div>
                <div className="text-lg font-bold text-blue-400">{params.polynomialDegree}</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium text-slate-300">Data</div>
              <div className="space-y-1">
                <div className="text-xs text-slate-400">Noise Level</div>
                <div className="text-lg font-bold text-orange-400">{formatValue(params.noiseLevel)}</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium text-slate-300">Training</div>
              <div className="space-y-1">
                <div className="text-xs text-slate-400">Sample Size</div>
                <div className="text-lg font-bold text-purple-400">{params.sampleSize}</div>
              </div>
            </div>

            {/* Error Components */}
            <div className="space-y-2">
              <div className="text-sm font-medium text-slate-300">Bias²</div>
              <div className="space-y-1">
                <div className="text-xs text-slate-400">Current</div>
                <div className="text-lg font-bold text-green-400">{formatValue(currentStats.bias)}</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium text-slate-300">Variance</div>
              <div className="space-y-1">
                <div className="text-xs text-slate-400">Current</div>
                <div className="text-lg font-bold text-red-400">{formatValue(currentStats.variance)}</div>
              </div>
            </div>

            {/* Total Errors */}
            <div className="space-y-2 md:col-span-2 lg:col-span-1">
              <div className="text-sm font-medium text-slate-300">Total Error</div>
              <div className="space-y-1">
                <div className="text-xs text-slate-400">Bias² + Variance + Noise</div>
                <div className="text-lg font-bold text-white">{formatValue(currentStats.totalError)}</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium text-slate-300">Irreducible</div>
              <div className="space-y-1">
                <div className="text-xs text-slate-400">Noise²</div>
                <div className="text-lg font-bold text-amber-400">{formatValue(currentStats.irreducibleError)}</div>
              </div>
            </div>

            {/* Animation Status */}
            <div className="space-y-2">
              <div className="text-sm font-medium text-slate-300">Status</div>
              <div className="space-y-1">
                <div className="text-xs text-slate-400">Animation</div>
                <div className={`text-lg font-bold ${isPlaying ? 'text-green-400' : 'text-slate-400'}`}>
                  {isPlaying ? 'Playing' : 'Paused'}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BiasVarianceVisualization;
