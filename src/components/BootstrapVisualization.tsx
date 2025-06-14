
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
  ReferenceArea,
} from "recharts";
import { BootstrapState, BootstrapParams } from "@/pages/Bootstrapping";
import InfoTooltip from "@/components/InfoTooltip";

interface BootstrapVisualizationProps {
  state: BootstrapState;
  params: BootstrapParams;
  getClassicMeanMSE: () => number;
}

const BootstrapVisualization: React.FC<BootstrapVisualizationProps> = ({
  state,
  params,
  getClassicMeanMSE,
}) => {
  // Safe number formatter
  const formatNumber = (value: any, decimals: number = 2): string => {
    if (typeof value === 'number' && !isNaN(value) && isFinite(value)) {
      return value.toFixed(decimals);
    }
    return '0';
  };

  // Prepare data for bootstrap distribution histogram
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

    // Add normal fit data to each bin
    if (state.showNormalFit && currentStats.length >= 10) {
      const mean = currentStats.reduce((a, b) => a + b, 0) / currentStats.length;
      const variance = currentStats.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / currentStats.length;
      const std = Math.sqrt(variance);

      histogram.forEach(bin => {
        const normalPdf = (1 / (std * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((bin.x - mean) / std, 2));
        bin.normalFit = normalPdf * currentStats.length * binWidth;
      });
    }

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

  // FIXED: Original vs Bootstrap Comparison Data with Integer Mode Support
  const getComparisonData = () => {
    const currentStats = state.currentStatValues.slice(0, state.currentIteration);
    if (currentStats.length === 0) return [];

    if (params.forceIntegerData) {
      // Create histogram with EXACT integer x-values
      const uniqueIntegers = Array.from(new Set(state.originalData)).sort((a, b) => a - b);
      const histogram = uniqueIntegers.map(value => ({
        x: Math.round(value), // FORCE integer x-values
        original: 0,
        bootstrap: 0,
      }));

      // Count original data at exact integer positions
      state.originalData.forEach(val => {
        const intVal = Math.round(val);
        const bin = histogram.find(b => b.x === intVal);
        if (bin) bin.original++;
      });

      // For bootstrap stats, map to nearest histogram bins
      currentStats.forEach(statValue => {
        const closestBin = histogram.reduce((closest, bin) => 
          Math.abs(bin.x - statValue) < Math.abs(closest.x - statValue) ? bin : closest
        );
        if (closestBin) closestBin.bootstrap++;
      });

      return histogram.map(bin => ({
        x: bin.x, // Clean integer
        original: bin.original / state.originalData.length,
        bootstrap: bin.bootstrap / (currentStats.length || 1),
      }));
    } else {
      // CONTINUOUS BINS FOR NON-INTEGER MODE
      const originalRange = { min: Math.min(...state.originalData), max: Math.max(...state.originalData) };
      const statsRange = { min: Math.min(...currentStats), max: Math.max(...currentStats) };
      
      const globalMin = Math.min(originalRange.min, statsRange.min);
      const globalMax = Math.max(originalRange.max, statsRange.max);
      
      if (globalMin === globalMax) {
        return [{ x: globalMin, original: 1.0, bootstrap: 1.0 }];
      }

      const bins = 15;
      const binWidth = (globalMax - globalMin) / bins;

      const histogram = Array(bins).fill(0).map((_, i) => ({
        x: globalMin + (i + 0.5) * binWidth,
        original: 0,
        bootstrap: 0,
      }));

      // Count ORIGINAL DATA values
      state.originalData.forEach(value => {
        const binIndex = Math.min(Math.floor((value - globalMin) / binWidth), bins - 1);
        if (binIndex >= 0 && binIndex < bins) {
          histogram[binIndex].original++;
        }
      });

      // Count BOOTSTRAP STATISTICS
      currentStats.forEach(statValue => {
        const binIndex = Math.min(Math.floor((statValue - globalMin) / binWidth), bins - 1);
        if (binIndex >= 0 && binIndex < bins) {
          histogram[binIndex].bootstrap++;
        }
      });

      // Convert to density
      return histogram.map(bin => ({
        x: bin.x,
        original: bin.original / (state.originalData.length * binWidth),
        bootstrap: bin.bootstrap / (currentStats.length * binWidth),
      }));
    }
  };

  // Calculate bias and MSE convergence with MSE baseline
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

  return (
    <div className="space-y-6">
      {/* Row 1: Bootstrap Distribution - Full Width */}
      <Card className="glass-panel">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-white flex items-center">
            Bootstrap Distribution
            <InfoTooltip 
              side="left"
              content={
                <div className="space-y-2">
                  <p><strong>Bootstrap Distribution:</strong></p>
                  <p>Shows the histogram of bootstrap statistics (means/medians) computed from {state.currentIteration} bootstrap samples.</p>
                  <p><strong>Key Elements:</strong></p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Sky blue bars: Frequency of bootstrap statistics</li>
                    <li>Purple curve: Normal distribution fit</li>
                    <li>Red dashed lines: 95% confidence interval bounds</li>
                    <li>Green line: Bootstrap mean estimate</li>
                    <li>Red shaded area: Confidence interval region</li>
                  </ul>
                  <p>As sample size increases, this distribution approaches normality (Central Limit Theorem).</p>
                </div>
              }
            />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={histogramData} margin={{ top: 20, right: 30, left: 60, bottom: 80 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444444" />
                
                {/* Confidence interval highlighting */}
                {state.showCI && confidenceInterval && (
                  <ReferenceArea 
                    x1={confidenceInterval.lower} 
                    x2={confidenceInterval.upper} 
                    fill="#ff0000" 
                    fillOpacity={0.2}
                    stroke="none"
                  />
                )}
                
                <XAxis 
                  dataKey="x" 
                  stroke="#ffffff"
                  fontSize={14}
                  fontWeight="bold"
                  tickFormatter={(value) => typeof value === 'number' ? formatNumber(value, 2) : '0'}
                  domain={['dataMin', 'dataMax']}
                  type="number"
                  scale="linear"
                  label={{ 
                    value: 'Bootstrap Statistic Value', 
                    position: 'insideBottom', 
                    offset: -20, 
                    style: { textAnchor: 'middle', fill: '#ffffff', fontSize: '14px', fontWeight: 'bold' } 
                  }}
                />

                <YAxis 
                  stroke="#ffffff"
                  fontSize={14}
                  fontWeight="bold"
                  label={{ 
                    value: 'Frequency', 
                    angle: -90, 
                    position: 'insideLeft', 
                    offset: 10,
                    style: { textAnchor: 'middle', fill: '#ffffff', fontSize: '14px', fontWeight: 'bold' } 
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(22, 22, 26, 0.95)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                  formatter={(value: number, name: string) => [
                    name === 'normalFit' ? formatNumber(value, 3) : value,
                    name === 'normalFit' ? 'Normal Fit' : 'Frequency'
                  ]}
                  labelFormatter={(value) => `Value: ${typeof value === 'number' ? formatNumber(value, 3) : '0'}`}
                />
                
                <Bar 
                  dataKey="count" 
                  fill="#87CEEB" 
                  stroke="#4682B4" 
                  strokeWidth={1}
                  opacity={0.7}
                />
                
                {/* Normal fit line */}
                {state.showNormalFit && (
                  <Line 
                    dataKey="normalFit" 
                    stroke="#9932CC" 
                    strokeWidth={3}
                    dot={false}
                    type="monotone"
                  />
                )}
                
                {/* Confidence Interval vertical lines */}
                {state.showCI && confidenceInterval && (
                  <>
                    <ReferenceLine 
                      x={confidenceInterval.lower} 
                      stroke="#ff0000" 
                      strokeWidth={3}
                      strokeDasharray="8 4"
                      label={{
                        value: `CI Lower: ${formatNumber(confidenceInterval.lower, 3)}`,
                        position: "top",
                        offset: 10,
                        style: { fill: "#ff0000", fontSize: "12px", fontWeight: "bold" }
                      }}
                    />
                   
                    <ReferenceLine 
                      x={confidenceInterval.upper} 
                      stroke="#ff0000" 
                      strokeWidth={3}
                      strokeDasharray="8 4"
                      label={{
                        value: `CI Upper: ${formatNumber(confidenceInterval.upper, 3)}`,
                        position: "top",
                        offset: 10,
                        style: { fill: "#ff0000", fontSize: "12px", fontWeight: "bold" }
                      }}
                    />
                  </>
                )}

                {/* Bootstrap mean line */}
                {confidenceInterval && (
                  <ReferenceLine 
                    x={confidenceInterval.mean} 
                    stroke="#00ff00" 
                    strokeWidth={2}
                    label={{
                      value: `Bootstrap Mean: ${formatNumber(confidenceInterval.mean, 3)}`,
                      position: "top",
                      offset: 10,
                      style: { fill: "#00ff00", fontSize: "12px", fontWeight: "bold" }
                    }}
                  />
                )}

              </ComposedChart>
            </ResponsiveContainer>
          </div>
          
          {/* Confidence interval display */}
          {state.showCI && confidenceInterval && (
            <div className="mt-4 p-3 bg-white/5 rounded-lg">
              <p className="text-sm text-white">
                <strong>{(params.confidenceLevel * 100).toFixed(0)}% Confidence Interval:</strong>
                <span className="ml-2 font-mono">
                  [{formatNumber(confidenceInterval.lower, 3)}, {formatNumber(confidenceInterval.upper, 3)}]
                </span>
              </p>
            </div>
          )}
        </CardContent>
      </Card>

{/* Row 2: Original Data vs Bootstrap Statistics - Full Width */}
<Card className="glass-panel border-white/10">
<CardHeader>
<CardTitle className="text-lg font-semibold text-white flex items-center">
Original Data vs Bootstrap Statistics
<InfoTooltip
side="left"
content={
<div className="space-y-2">
<p><strong>Comparison Chart:</strong></p>
<p>Compares the distribution of original raw data with computed bootstrap statistics.</p>
<p><strong>Key Insights:</strong></p>
<ul className="list-disc list-inside space-y-1">
<li>Gray bars: Original data distribution (discrete if integer mode)</li>
<li>Orange bars: Bootstrap statistics distribution (continuous)</li>
<li>Different supports are expected - bootstrap statistics are computed means</li>
<li>Bootstrap distribution is typically more concentrated around the true parameter</li>
</ul>
<p>This demonstrates how bootstrap statistics converge to the sampling distribution of the estimator.</p>
</div>
}
/>
</CardTitle>
</CardHeader>
<CardContent>
<div className="h-[300px] w-full">
<ResponsiveContainer width="100%" height="100%">
<BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
<CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
<XAxis
dataKey="x"
stroke="rgba(255,255,255,0.8)"
fontSize={12}
tickFormatter={(value) => formatNumber(value, params.forceIntegerData ? 0 : 2)}
label={{
value: 'Value',
position: 'insideBottom',
offset: -20,
style: { textAnchor: 'middle', fill: '#ffffff', fontSize: '14px', fontWeight: 'bold' }
}}
/>
<YAxis
stroke="rgba(255,255,255,0.8)"
fontSize={12}
tickFormatter={(value) => formatNumber(value, 3)}
label={{
value: 'Density',
angle: -90,
position: 'insideLeft',
offset: 10,
style: { textAnchor: 'middle', fill: '#ffffff', fontSize: '14px', fontWeight: 'bold' }
}}
/>
<Tooltip
formatter={(value, name) => [
formatNumber(value as number, 4),
name === 'original' ? 'Original Data' : 'Bootstrap Statistics'
]}
labelFormatter={(label) => `Value: ${formatNumber(label, params.forceIntegerData ? 0 : 3)}`}
contentStyle={{
backgroundColor: 'rgba(0,0,0,0.8)',
border: '1px solid rgba(255,255,255,0.1)',
borderRadius: '8px'
}}
/>
<Bar dataKey="original" fill="rgba(156, 163, 175, 0.6)" name="Original Data" />
<Bar dataKey="bootstrap" fill="rgba(251, 146, 60, 0.7)" name="Bootstrap Statistics" />
{confidenceInterval && (
<ReferenceLine
x={confidenceInterval.mean}
stroke="#ff8c00"
strokeWidth={2}
strokeDasharray="6 6"
label={{
value: `Bootstrap Mean: ${formatNumber(confidenceInterval.mean, 2)}`,
position: "top",
offset: 10,
style: { fill: "#ff8c00", fontSize: "10px", fontWeight: "bold" }
}}
/>
)}
</BarChart>
</ResponsiveContainer>
</div>
</CardContent>
</Card>

      {/* Row 3: Bias and MSE Convergence - Full Width */}
      <Card className="glass-panel">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-white flex items-center">
            Bias and MSE Convergence
            <InfoTooltip 
              side="left"
              content={
                <div className="space-y-2">
                  <p><strong>Convergence Analysis:</strong></p>
                  <p>Tracks how bias and MSE of bootstrap estimates change with increasing bootstrap samples.</p>
                  <p><strong>Key Elements:</strong></p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Blue line: Bootstrap bias over iterations</li>
                    <li>Red line: Bootstrap MSE over iterations</li>
                    <li>Yellow dashed line: Classical MSE baseline for comparison</li>
                  </ul>
                  <p><strong>Expected Behavior:</strong></p>
                  <p>Both bias and MSE should stabilize as bootstrap samples increase, with MSE approaching the classical estimator's MSE.</p>
                </div>
              }
            />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={convergenceData} margin={{ top: 20, right: 30, left: 60, bottom: 80 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444444" />
                <XAxis 
                  dataKey="samples" 
                  stroke="#ffffff"
                  fontSize={14}
                  fontWeight="bold"
                  label={{ 
                    value: 'Number of Bootstrap Samples', 
                    position: 'insideBottom', 
                    offset: -20, 
                    style: { textAnchor: 'middle', fill: '#ffffff', fontSize: '14px', fontWeight: 'bold' } 
                  }}
                />
                <YAxis 
                  stroke="#ffffff"
                  fontSize={14}
                  fontWeight="bold"
                  label={{ 
                    value: 'Error Value', 
                    angle: -90, 
                    position: 'insideLeft', 
                    offset: 10,
                    style: { textAnchor: 'middle', fill: '#ffffff', fontSize: '14px', fontWeight: 'bold' } 
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(22, 22, 26, 0.95)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                  formatter={(value: number, name: string) => [formatNumber(value, 4), name === 'bias' ? '|Bias|' : 'MSE']}
                />
                
                {/* MSE BASELINE REFERENCE LINE */}
                <ReferenceLine 
                  y={getClassicMeanMSE()} 
                  stroke="#FFD700" 
                  strokeWidth={2}
                  strokeDasharray="8 4"
                  label={{
                    value: `Classic MSE: ${formatNumber(getClassicMeanMSE(), 4)}`,
                    position: "top",
                    offset: 10,
                    style: { fill: "#FFD700", fontSize: "12px", fontWeight: "bold" }
                  }}
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
           {/* Convergence statistics display */}
            {convergenceData.length > 0 && (
              <div className="mt-4 p-3 bg-white/5 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm text-white">
                  <div>
                    <p><strong>Current Bias:</strong></p>
                    <p className="font-mono text-blue-400">
                      {formatNumber(convergenceData[convergenceData.length - 1]?.bias || 0, 4)}
                    </p>
                  </div>
                  <div>
                    <p><strong>Current MSE:</strong></p>
                    <p className="font-mono text-red-400">
                      {formatNumber(convergenceData[convergenceData.length - 1]?.mse || 0, 4)}
                    </p>
                  </div>
                </div>
              </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BootstrapVisualization;
