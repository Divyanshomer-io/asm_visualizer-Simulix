
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
  ComposedChart,
  Area,
  AreaChart,
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
  // Prepare data for bootstrap distribution histogram - following Python logic exactly
  const getBootstrapHistogramData = () => {
    const currentStats = state.currentStatValues.slice(0, state.currentIteration);
    if (currentStats.length === 0) return [];

    const bins = 20;
    const min = Math.min(...currentStats);
    const max = Math.max(...currentStats);
    
    if (min === max) {
      return [{
        x: min,
        count: currentStats.length,
        bin: 0,
        normalFit: 0,
      }];
    }
    
    const binWidth = (max - min) / bins;
    
    const histogram = Array(bins).fill(0).map((_, i) => ({
      x: min + (i + 0.5) * binWidth,
      count: 0,
      bin: i,
      normalFit: 0,
    }));

    currentStats.forEach(value => {
      if (binWidth > 0) {
        const binIndex = Math.min(Math.floor((value - min) / binWidth), bins - 1);
        if (binIndex >= 0 && binIndex < bins) {
          histogram[binIndex].count++;
        }
      }
    });

    // Add normal fit data to each bin - following Python scipy.stats.norm.pdf logic
    if (state.showNormalFit && currentStats.length >= 10) {
      const mean = currentStats.reduce((a, b) => a + b, 0) / currentStats.length;
      const variance = currentStats.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / currentStats.length;
      const std = Math.sqrt(variance);

      histogram.forEach(bin => {
        // Normal PDF calculation
        const normalPdf = (1 / (std * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((bin.x - mean) / std, 2));
        // Scale to match histogram frequency (not density)
        bin.normalFit = normalPdf * currentStats.length * binWidth;
      });
    }

    return histogram;
  };

  // Calculate confidence intervals - following Python percentile logic exactly
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

  // Prepare data for original vs bootstrap comparison - following Python density logic
  const getComparisonData = () => {
    const currentStats = state.currentStatValues.slice(0, state.currentIteration);
    if (currentStats.length === 0) return [];

    // Use same range for both original data and bootstrap stats
    const allValues = [...state.originalData, ...currentStats];
    const min = Math.min(...allValues);
    const max = Math.max(...allValues);
    
    if (min === max) {
      return [{
        x: min,
        original: 1,
        bootstrap: 1,
      }];
    }

    const bins = 15; // Following Python code
    const binWidth = (max - min) / bins;

    const histogram = Array(bins).fill(0).map((_, i) => ({
      x: min + (i + 0.5) * binWidth,
      original: 0,
      bootstrap: 0,
    }));

    // Count original data
    state.originalData.forEach(value => {
      if (binWidth > 0) {
        const binIndex = Math.min(Math.floor((value - min) / binWidth), bins - 1);
        if (binIndex >= 0 && binIndex < bins) {
          histogram[binIndex].original++;
        }
      }
    });

    // Count bootstrap stats
    currentStats.forEach(value => {
      if (binWidth > 0) {
        const binIndex = Math.min(Math.floor((value - min) / binWidth), bins - 1);
        if (binIndex >= 0 && binIndex < bins) {
          histogram[binIndex].bootstrap++;
        }
      }
    });

    // Convert to density following Python logic
    const originalTotal = state.originalData.length;
    const bootstrapTotal = currentStats.length;

    return histogram.map(bin => ({
      ...bin,
      original: (bin.original / originalTotal) / binWidth,
      bootstrap: bootstrapTotal > 0 ? (bin.bootstrap / bootstrapTotal) / binWidth : 0,
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
  const comparisonData = getComparisonData();
  const convergenceData = getConvergenceData();

  // Prepare confidence interval area data for yellow shading
  const getConfidenceIntervalArea = () => {
    if (!state.showCI || !confidenceInterval || histogramData.length === 0) return [];
    
    return histogramData.map(bin => ({
      x: bin.x,
      count: (bin.x >= confidenceInterval.lower && bin.x <= confidenceInterval.upper) ? bin.count : 0,
    }));
  };

  const ciAreaData = getConfidenceIntervalArea();

  return (
    <div className="space-y-6">
      {/* Bootstrap Distribution - Full Width */}
      <Card className="glass-panel">
        <CardHeader>
          <CardTitle className="text-lg">Bootstrap Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={histogramData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444444" />
                <XAxis 
                  dataKey="x" 
                  stroke="#ffffff80"
                  tickFormatter={(value) => value.toFixed(2)}
                  domain={['dataMin', 'dataMax']}
                />
                <YAxis stroke="#ffffff80" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(22, 22, 26, 0.95)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                  formatter={(value: number, name: string) => [
                    name === 'normalFit' ? value.toFixed(3) : value,
                    name === 'normalFit' ? 'Normal Fit' : 'Frequency'
                  ]}
                  labelFormatter={(value) => `Value: ${Number(value).toFixed(3)}`}
                />
                
                {/* Confidence interval yellow area - following Python axvspan logic */}
                {state.showCI && ciAreaData.length > 0 && (
                  <Area 
                    dataKey="count" 
                    fill="#ffff00" 
                    fillOpacity={0.2}
                    stroke="none"
                    data={ciAreaData}
                  />
                )}
                
                <Bar 
                  dataKey="count" 
                  fill="#87CEEB" 
                  stroke="#4682B4" 
                  strokeWidth={1}
                  opacity={0.7}
                />
                
                {/* Normal fit line - following Python plot logic */}
                {state.showNormalFit && (
                  <Line 
                    dataKey="normalFit" 
                    stroke="#9932CC" 
                    strokeWidth={3}
                    dot={false}
                    type="monotone"
                  />
                )}
                
                {/* Confidence Interval lines - following Python axvline logic */}
                {state.showCI && confidenceInterval && (
                  <>
                    <ReferenceLine 
                      x={confidenceInterval.lower} 
                      stroke="#ff0000" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                    />
                    <ReferenceLine 
                      x={confidenceInterval.upper} 
                      stroke="#ff0000" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                    />
                  </>
                )}
                
                {/* Bootstrap mean line - always show like in Python */}
                {confidenceInterval && (
                  <ReferenceLine 
                    x={confidenceInterval.mean} 
                    stroke="#00ff00" 
                    strokeWidth={2}
                  />
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

      {/* Bottom Row: Original vs Bootstrap and Convergence */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Original vs Bootstrap Comparison */}
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle className="text-lg">Original vs Bootstrap</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444444" />
                  <XAxis 
                    dataKey="x" 
                    stroke="#ffffff80"
                    tickFormatter={(value) => value.toFixed(1)}
                  />
                  <YAxis 
                    stroke="#ffffff80"
                    label={{ value: 'Density', angle: -90, position: 'insideLeft', fill: '#ffffff80' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(22, 22, 26, 0.95)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      color: 'white'
                    }}
                    formatter={(value: number, name: string) => [
                      value.toFixed(4),
                      name === 'original' ? `Original Data (n=${state.originalData.length})` : `Bootstrap ${params.statistic}s (n=${state.currentIteration})`
                    ]}
                  />
                  
                  <Bar 
                    dataKey="original" 
                    fill="#808080" 
                    opacity={0.5}
                    name="Original Data"
                  />
                  <Bar 
                    dataKey="bootstrap" 
                    fill="#ffa500" 
                    opacity={0.7}
                    name={`Bootstrap ${params.statistic}s`}
                  />

                  {/* Add mean lines */}
                  <ReferenceLine 
                    x={state.originalData.reduce((a, b) => a + b, 0) / state.originalData.length} 
                    stroke="#000000" 
                    strokeWidth={2}
                  />
                  {confidenceInterval && (
                    <ReferenceLine 
                      x={confidenceInterval.mean} 
                      stroke="#ff8c00" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                    />
                  )}
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Convergence Analysis */}
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
    </div>
  );
};

export default BootstrapVisualization;
