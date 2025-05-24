
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  ComposedChart,
} from "recharts";
import { BootstrapState, BootstrapParams } from "@/pages/Bootstrapping";

interface BootstrapVisualizationProps {
  state: BootstrapState;
  params: BootstrapParams;
}

const BootstrapVisualization: React.FC<BootstrapVisualizationProps> = ({
  state,
  params,
}) => {
  // Prepare data for bootstrap distribution histogram
  const getBootstrapHistogramData = () => {
    const currentStats = state.currentStatValues.slice(0, state.currentIteration);
    if (currentStats.length === 0) return [];

    const bins = 20;
    const min = Math.min(...currentStats);
    const max = Math.max(...currentStats);
    
    // Handle edge case where all values are the same
    if (min === max) {
      return [{
        x: min,
        count: currentStats.length,
        bin: 0,
      }];
    }
    
    const binWidth = (max - min) / bins;
    
    const histogram = Array(bins).fill(0).map((_, i) => ({
      x: min + (i + 0.5) * binWidth,
      count: 0,
      bin: i,
    }));

    currentStats.forEach(value => {
      // Ensure binIndex is valid
      if (binWidth > 0) {
        const binIndex = Math.min(Math.floor((value - min) / binWidth), bins - 1);
        if (binIndex >= 0 && binIndex < bins && histogram[binIndex]) {
          histogram[binIndex].count++;
        }
      }
    });

    return histogram;
  };

  // Calculate confidence intervals
  const getConfidenceInterval = () => {
    const currentStats = state.currentStatValues.slice(0, state.currentIteration);
    if (currentStats.length < 10) return null;

    const alpha = 1 - params.confidenceLevel;
    const sortedStats = [...currentStats].sort((a, b) => a - b);
    const lowerIndex = Math.floor(sortedStats.length * alpha / 2);
    const upperIndex = Math.ceil(sortedStats.length * (1 - alpha / 2)) - 1;

    return {
      lower: sortedStats[lowerIndex],
      upper: sortedStats[upperIndex],
      mean: currentStats.reduce((a, b) => a + b, 0) / currentStats.length,
    };
  };

  // Generate normal distribution data for overlay
  const getNormalFitData = () => {
    const currentStats = state.currentStatValues.slice(0, state.currentIteration);
    if (currentStats.length < 10) return [];

    const mean = currentStats.reduce((a, b) => a + b, 0) / currentStats.length;
    const variance = currentStats.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / currentStats.length;
    const std = Math.sqrt(variance);

    const min = Math.min(...currentStats);
    const max = Math.max(...currentStats);
    const range = max - min;
    
    const normalData = [];
    for (let i = 0; i <= 100; i++) {
      const x = min - range * 0.2 + (range * 1.4 * i) / 100;
      const y = (1 / (std * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - mean) / std, 2));
      // Scale to match histogram
      const scaledY = y * currentStats.length * (range / 20); // approximate bin width
      normalData.push({ x, normalFit: scaledY });
    }

    return normalData;
  };

  // Prepare data for original vs bootstrap comparison
  const getComparisonData = () => {
    const originalBins = 15;
    const originalMin = Math.min(...state.originalData);
    const originalMax = Math.max(...state.originalData);
    
    // Handle edge case where all original values are the same
    if (originalMin === originalMax) {
      return [{
        x: originalMin,
        original: state.originalData.length,
        bootstrap: 0,
      }];
    }
    
    const originalBinWidth = (originalMax - originalMin) / originalBins;

    const originalHistogram = Array(originalBins).fill(0).map((_, i) => ({
      x: originalMin + (i + 0.5) * originalBinWidth,
      original: 0,
      bootstrap: 0,
    }));

    // Fill original data histogram
    state.originalData.forEach(value => {
      if (originalBinWidth > 0) {
        const binIndex = Math.min(Math.floor((value - originalMin) / originalBinWidth), originalBins - 1);
        if (binIndex >= 0 && binIndex < originalBins && originalHistogram[binIndex]) {
          originalHistogram[binIndex].original++;
        }
      }
    });

    // Fill bootstrap statistics histogram (scaled to same range)
    const currentStats = state.currentStatValues.slice(0, state.currentIteration);
    if (currentStats.length > 0) {
      currentStats.forEach(value => {
        if (originalBinWidth > 0) {
          const binIndex = Math.min(Math.floor((value - originalMin) / originalBinWidth), originalBins - 1);
          if (binIndex >= 0 && binIndex < originalBins && originalHistogram[binIndex]) {
            originalHistogram[binIndex].bootstrap++;
          }
        }
      });
    }

    // Normalize to density
    const originalTotal = state.originalData.length;
    const bootstrapTotal = currentStats.length;

    return originalHistogram.map(bin => ({
      ...bin,
      original: (bin.original / originalTotal) / originalBinWidth,
      bootstrap: bootstrapTotal > 0 ? (bin.bootstrap / bootstrapTotal) / originalBinWidth : 0,
    }));
  };

  // Calculate bias and MSE convergence
  const getConvergenceData = () => {
    const trueValue = params.statistic === 'mean' 
      ? state.originalData.reduce((a, b) => a + b, 0) / state.originalData.length
      : [...state.originalData].sort((a, b) => a - b)[Math.floor(state.originalData.length / 2)];

    const data = [];
    const stepSize = Math.max(1, Math.floor(state.currentIteration / 50));

    for (let i = 10; i <= state.currentIteration; i += stepSize) {
      const currentStats = state.currentStatValues.slice(0, i);
      if (currentStats.length > 0) {
        const mean = currentStats.reduce((a, b) => a + b, 0) / currentStats.length;
        const bias = Math.abs(mean - trueValue);
        const mse = currentStats.reduce((acc, val) => acc + Math.pow(val - trueValue, 2), 0) / currentStats.length;

        data.push({
          samples: i,
          bias,
          mse,
        });
      }
    }

    return data;
  };

  const histogramData = getBootstrapHistogramData();
  const confidenceInterval = getConfidenceInterval();
  const normalFitData = getNormalFitData();
  const comparisonData = getComparisonData();
  const convergenceData = getConvergenceData();

  return (
    <div className="space-y-6">
      {/* Top Row: Bootstrap Distribution and Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bootstrap Distribution */}
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle className="text-lg">Bootstrap Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={histogramData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444444" />
                  <XAxis 
                    dataKey="x" 
                    stroke="#ffffff80"
                    tickFormatter={(value) => value.toFixed(2)}
                  />
                  <YAxis stroke="#ffffff80" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(22, 22, 26, 0.95)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      color: 'white'
                    }}
                    formatter={(value: number, name: string) => [value, 'Frequency']}
                    labelFormatter={(value) => `Value: ${Number(value).toFixed(3)}`}
                  />
                  
                  <Bar 
                    dataKey="count" 
                    fill="#87CEEB" 
                    stroke="#4682B4" 
                    strokeWidth={1}
                    opacity={0.7}
                  />
                  
                  {/* Normal Fit Line */}
                  {state.showNormalFit && normalFitData.length > 0 && (
                    <Line 
                      dataKey="normalFit" 
                      stroke="#9932CC" 
                      strokeWidth={3}
                      dot={false}
                      data={normalFitData}
                      type="monotone"
                    />
                  )}
                  
                  {/* Confidence Interval */}
                  {state.showCI && confidenceInterval && (
                    <>
                      <ReferenceLine 
                        x={confidenceInterval.lower} 
                        stroke="#ff4444" 
                        strokeWidth={2}
                        strokeDasharray="5 5"
                      />
                      <ReferenceLine 
                        x={confidenceInterval.upper} 
                        stroke="#ff4444" 
                        strokeWidth={2}
                        strokeDasharray="5 5"
                      />
                      <ReferenceLine 
                        x={confidenceInterval.mean} 
                        stroke="#00ff00" 
                        strokeWidth={2}
                      />
                    </>
                  )}
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            
            {confidenceInterval && (
              <div className="mt-2 text-xs space-y-1">
                <div className="flex justify-between">
                  <span>Bootstrap Mean:</span>
                  <span className="font-mono">{confidenceInterval.mean.toFixed(3)}</span>
                </div>
                {state.showCI && (
                  <div className="flex justify-between">
                    <span>{(params.confidenceLevel * 100).toFixed(0)}% CI:</span>
                    <span className="font-mono">
                      [{confidenceInterval.lower.toFixed(3)}, {confidenceInterval.upper.toFixed(3)}]
                    </span>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Original vs Bootstrap Comparison */}
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle className="text-lg">Original vs Bootstrap</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444444" />
                  <XAxis 
                    dataKey="x" 
                    stroke="#ffffff80"
                    tickFormatter={(value) => value.toFixed(1)}
                  />
                  <YAxis stroke="#ffffff80" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(22, 22, 26, 0.95)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      color: 'white'
                    }}
                  />
                  
                  <Bar 
                    dataKey="original" 
                    fill="#808080" 
                    opacity={0.6}
                    name="Original Data"
                  />
                  <Bar 
                    dataKey="bootstrap" 
                    fill="#ffa500" 
                    opacity={0.8}
                    name={`Bootstrap ${params.statistic}s`}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row: Convergence Analysis */}
      <Card className="glass-panel">
        <CardHeader>
          <CardTitle className="text-lg">Bias and MSE Convergence</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={convergenceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444444" />
                <XAxis 
                  dataKey="samples" 
                  stroke="#ffffff80"
                  label={{ value: 'Number of Bootstrap Samples', position: 'insideBottom', offset: -10, fill: '#ffffff80' }}
                />
                <YAxis 
                  stroke="#ffffff80"
                  label={{ value: 'Value', angle: -90, position: 'insideLeft', fill: '#ffffff80' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(22, 22, 26, 0.95)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                  formatter={(value: number, name: string) => [value.toFixed(4), name === 'bias' ? '|Bias|' : 'MSE']}
                />
                
                <Line 
                  type="monotone" 
                  dataKey="bias" 
                  stroke="#4169E1"
                  strokeWidth={2}
                  dot={false}
                  name="|Bias|"
                />
                <Line 
                  type="monotone" 
                  dataKey="mse" 
                  stroke="#DC143C"
                  strokeWidth={2}
                  dot={false}
                  name="MSE"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          {convergenceData.length > 0 && (
            <div className="mt-2 text-xs flex justify-between">
              <div>
                <span className="inline-block w-3 h-3 bg-[#4169E1] rounded-full mr-1"></span>
                |Bias|: {convergenceData[convergenceData.length - 1]?.bias.toFixed(4)}
              </div>
              <div>
                <span className="inline-block w-3 h-3 bg-[#DC143C] rounded-full mr-1"></span>
                MSE: {convergenceData[convergenceData.length - 1]?.mse.toFixed(4)}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BootstrapVisualization;
