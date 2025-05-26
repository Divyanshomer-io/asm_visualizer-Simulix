
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ScatterChart, Scatter, BarChart, Bar, ErrorBar, ReferenceLine } from "recharts";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  ImportanceSamplingParams, 
  DistributionData, 
  SampleData, 
  ConvergenceData, 
  VarianceData,
  f, g, h, calculateTrueValue, generateNormalSamples, mcEstimate, isEstimate, normalizedIsEstimate
} from "@/utils/importanceSampling";

interface ImportanceSamplingVisualizationProps {
  params: ImportanceSamplingParams;
}

const ImportanceSamplingVisualization: React.FC<ImportanceSamplingVisualizationProps> = ({ params }) => {
  // Generate distribution data
  const generateDistributionData = (): DistributionData[] => {
    const xVals = [];
    for (let i = -5; i <= 7; i += 0.1) {
      xVals.push(i);
    }
    
    return xVals.map(x => {
      const target = f(x);
      const proposal = g(x, params.proposalT);
      const hVal = h(x, params.scaleH);
      const maxH = Math.max(...xVals.map(xi => h(xi, params.scaleH)));
      const area = hVal * target;
      const maxArea = Math.max(...xVals.map(xi => h(xi, params.scaleH) * f(xi)));
      
      return {
        x,
        target,
        proposal,
        hScaled: hVal / maxH,
        area: area / maxArea
      };
    });
  };

  // Generate sample data with proper jitter for normalized mode
  const generateSampleData = (): { fSamples: number[]; gSamples: SampleData[] } => {
    const fSamples = generateNormalSamples(params.nDemo, 0, 1);
    const gSamplesRaw = generateNormalSamples(params.nDemo, params.proposalT, 1);
    
    const gSamples = gSamplesRaw.map(x => {
      const weight = f(x) / g(x, params.proposalT);
      return {
        x,
        weight,
        normWeight: weight // Will be normalized later
      };
    });

    // Normalize weights for normalized IS
    const weightSum = gSamples.reduce((sum, sample) => sum + sample.weight, 0);
    gSamples.forEach(sample => {
      sample.normWeight = sample.weight / weightSum * params.nDemo;
    });

    return { fSamples, gSamples };
  };

  // Generate convergence data with proper error calculations
  const generateConvergenceData = (): ConvergenceData[] => {
    const sampleSizes = [10, 50, 100, 500, 1000, params.maxSamples];
    const trueVal = calculateTrueValue(params.scaleH);
    
    return sampleSizes.map(n => {
      if (params.method === 'standard') {
        // Standard IS - collect multiple trials for error bars
        const mcTrials = [];
        const isTrials = [];
        
        for (let trial = 0; trial < params.nTrialsConv; trial++) {
          const mcResult = mcEstimate(n, params.scaleH);
          const isResult = isEstimate(n, params.proposalT, params.scaleH);
          mcTrials.push(mcResult.estimate);
          isTrials.push(isResult.estimate);
        }
        
        const mcMean = mcTrials.reduce((a, b) => a + b, 0) / mcTrials.length;
        const isMean = isTrials.reduce((a, b) => a + b, 0) / isTrials.length;
        const mcStdErr = Math.sqrt(mcTrials.reduce((a, b) => a + Math.pow(b - mcMean, 2), 0) / (mcTrials.length - 1)) / Math.sqrt(mcTrials.length);
        const isStdErr = Math.sqrt(isTrials.reduce((a, b) => a + Math.pow(b - isMean, 2), 0) / (isTrials.length - 1)) / Math.sqrt(isTrials.length);
        
        return {
          sampleSize: n,
          mcEstimate: mcMean,
          mcError: mcStdErr,
          isEstimate: isMean,
          isError: isStdErr
        };
      } else {
        // Normalized mode - calculate mean absolute errors
        let stdErrors = 0;
        let normErrors = 0;
        
        for (let trial = 0; trial < params.nTrialsConv; trial++) {
          const samples = generateNormalSamples(n, params.proposalT, 1);
          const weights = samples.map(x => f(x) / g(x, params.proposalT));
          const weightSum = weights.reduce((a, b) => a + b, 0);
          
          const stdEst = samples.reduce((sum, x, i) => sum + h(x, params.scaleH) * weights[i], 0) / n;
          const normEst = samples.reduce((sum, x, i) => sum + h(x, params.scaleH) * weights[i] / weightSum, 0);
          
          stdErrors += Math.abs(stdEst - trueVal);
          normErrors += Math.abs(normEst - trueVal);
        }
        
        return {
          sampleSize: n,
          mcEstimate: 0,
          mcError: 0,
          isEstimate: 0,
          isError: 0,
          stdError: stdErrors / params.nTrialsConv,
          normError: normErrors / params.nTrialsConv
        };
      }
    });
  };

  // Generate variance data
  const generateVarianceData = (): VarianceData[] => {
    if (params.method === 'standard') {
      const tValues = [-2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2, 2.5, 3];
      
      return tValues.map(t => {
        const trials = params.nTrialsVar;
        const estimates: number[] = [];
        
        for (let trial = 0; trial < trials; trial++) {
          const result = isEstimate(1000, t, params.scaleH);
          estimates.push(result.estimate);
        }
        
        const mean = estimates.reduce((a, b) => a + b, 0) / estimates.length;
        const variance = estimates.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / (estimates.length - 1);
        
        return {
          parameter: t,
          variance
        };
      });
    } else {
      // Normalized mode - error ratios
      const tValues = [-3, -2.5, -2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2];
      const trueVal = calculateTrueValue(params.scaleH);
      
      return tValues.map(t => {
        let stdErrors = 0;
        let normErrors = 0;
        
        for (let trial = 0; trial < params.nTrialsVar; trial++) {
          const samples = generateNormalSamples(200, t, 1);
          const weights = samples.map(x => f(x) / g(x, t));
          const weightSum = weights.reduce((a, b) => a + b, 0);
          
          const stdEst = samples.reduce((sum, x, i) => sum + h(x, params.scaleH) * weights[i], 0) / 200;
          const normEst = samples.reduce((sum, x, i) => sum + h(x, params.scaleH) * weights[i] / weightSum, 0);
          
          stdErrors += Math.abs(stdEst - trueVal);
          normErrors += Math.abs(normEst - trueVal);
        }
        
        const avgStdError = stdErrors / params.nTrialsVar;
        const avgNormError = normErrors / params.nTrialsVar;
        const errorRatio = avgNormError > 0 ? avgStdError / avgNormError : 1;
        
        return {
          parameter: t,
          variance: 0,
          errorRatio
        };
      });
    }
  };

  // Generate jittered scatter data for normalized mode
  const generateJitteredScatterData = () => {
    if (params.method !== 'normalized') return [];
    
    const { gSamples } = generateSampleData();
    return gSamples.map(sample => ({
      // Standard weights with positive jitter
      xStd: sample.x + 0.05 * (Math.random() - 0.5),
      yStd: sample.weight,
      // Normalized weights with negative jitter  
      xNorm: sample.x - 0.05 * (Math.random() - 0.5),
      yNorm: sample.normWeight,
      originalX: sample.x
    }));
  };

  const distributionData = generateDistributionData();
  const { fSamples, gSamples } = generateSampleData();
  const convergenceData = generateConvergenceData();
  const varianceData = generateVarianceData();
  const trueValue = calculateTrueValue(params.scaleH);
  const jitteredData = generateJitteredScatterData();

  // Prepare histogram data for standard mode
  const histogramData = params.method === 'standard' ? (() => {
    const bins = 20;
    const minVal = Math.min(...fSamples, ...gSamples.map(s => s.x));
    const maxVal = Math.max(...fSamples, ...gSamples.map(s => s.x));
    const binWidth = (maxVal - minVal) / bins;
    
    const fBins = Array(bins).fill(0);
    const gBins = Array(bins).fill(0);
    
    fSamples.forEach(x => {
      const binIndex = Math.min(Math.floor((x - minVal) / binWidth), bins - 1);
      fBins[binIndex]++;
    });
    
    gSamples.forEach(sample => {
      const binIndex = Math.min(Math.floor((sample.x - minVal) / binWidth), bins - 1);
      gBins[binIndex]++;
    });
    
    return Array.from({ length: bins }, (_, i) => ({
      x: minVal + i * binWidth + binWidth / 2,
      fCount: fBins[i] / fSamples.length / binWidth,
      gCount: gBins[i] / gSamples.length / binWidth
    }));
  })() : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Distribution Comparison */}
      <Card className="glass-panel border-white/10">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 opacity-70" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Compare target f(x), proposal g(x), and function h(x) distributions</p>
              </TooltipContent>
            </Tooltip>
            Distribution Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              target: { label: "Target f(x)", color: "hsl(var(--primary))" },
              proposal: { label: "Proposal g(x)", color: "hsl(var(--destructive))" },
              hScaled: { label: "h(x) (scaled)", color: "hsl(var(--accent))" },
              area: { label: "h(x)f(x) (area)", color: "hsl(var(--muted))" },
            }}
            className="h-[250px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={distributionData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(68,68,68,0.5)" />
                <XAxis 
                  dataKey="x" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  label={{ value: 'x', position: 'insideBottom', offset: -10, style: { textAnchor: 'middle', fontWeight: 'bold' } }}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  label={{ value: 'Density', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontWeight: 'bold' } }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="target" stroke="#3b82f6" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="proposal" stroke="#ef4444" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="hScaled" stroke="hsl(var(--accent))" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="area" stroke="hsl(var(--muted))" strokeWidth={2} fill="hsl(var(--muted))" fillOpacity={0.3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Sample Distribution / Weight Visualization */}
      <Card className="glass-panel border-white/10">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 opacity-70" />
              </TooltipTrigger>
              <TooltipContent>
                <p>{params.method === 'standard' ? 'Sample histograms and estimates' : 'Weight vs. Sample Value with jitter'}</p>
              </TooltipContent>
            </Tooltip>
            {params.method === 'standard' ? 'Sample Distribution' : 'Weight vs. Sample Value'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {params.method === 'standard' ? (
            <ChartContainer
              config={{
                fCount: { label: "f samples", color: "#3b82f6" },
                gCount: { label: "g samples", color: "#ef4444" },
              }}
              className="h-[250px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={histogramData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(68,68,68,0.5)" />
                  <XAxis 
                    dataKey="x" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    label={{ value: 'x', position: 'insideBottom', offset: -10, style: { textAnchor: 'middle', fontWeight: 'bold' } }}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    label={{ value: 'Density', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontWeight: 'bold' } }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="fCount" fill="#3b82f6" fillOpacity={0.5} />
                  <Bar dataKey="gCount" fill="#ef4444" fillOpacity={0.5} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          ) : (
            <ChartContainer
              config={{
                standard: { label: "Standard weights", color: "#3b82f6" },
                normalized: { label: "Normalized weights (scaled)", color: "#ef4444" },
              }}
              className="h-[250px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(68,68,68,0.5)" />
                  <XAxis 
                    type="number"
                    dataKey="originalX"
                    domain={[params.proposalT - 3, params.proposalT + 3]}
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    label={{ value: 'x', position: 'insideBottom', offset: -10, style: { textAnchor: 'middle', fontWeight: 'bold' } }}
                  />
                  <YAxis 
                    type="number"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    label={{ value: 'Weight', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontWeight: 'bold' } }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Scatter 
                    data={jitteredData.map(d => ({ x: d.xStd, y: d.yStd }))} 
                    fill="#3b82f6" 
                    fillOpacity={0.6} 
                    r={3}
                    name="Standard weights"
                  />
                  <Scatter 
                    data={jitteredData.map(d => ({ x: d.xNorm, y: d.yNorm }))} 
                    fill="#ef4444" 
                    fillOpacity={0.6} 
                    r={3}
                    name="Normalized weights (scaled)"
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </ChartContainer>
          )}
        </CardContent>
      </Card>

      {/* Convergence Analysis */}
      <Card className="glass-panel border-white/10">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 opacity-70" />
              </TooltipTrigger>
              <TooltipContent>
                <p>{params.method === 'standard' ? 'Estimate convergence with error bars' : 'Mean absolute error on log-log scale'}</p>
              </TooltipContent>
            </Tooltip>
            {params.method === 'standard' ? 'Convergence Comparison' : 'Convergence Analysis (Normalized IS)'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              mc: { label: "Monte Carlo", color: "#3b82f6" },
              is: { label: "Importance Sampling", color: "#ef4444" },
              std: { label: "Standard IS", color: "#3b82f6" },
              norm: { label: "Normalized IS", color: "#ef4444" },
              reference: { label: "1/√n reference", color: "#000000" },
              trueValue: { label: "True Value", color: "#000000" },
            }}
            className="h-[250px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart 
                data={convergenceData} 
                margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(68,68,68,0.5)" />
                <XAxis 
                  dataKey="sampleSize" 
                  scale={params.method === 'normalized' ? 'log' : 'log'}
                  domain={params.method === 'normalized' ? [10, 10000] : [10, 5000]}
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  label={{ value: 'Number of samples', position: 'insideBottom', offset: -10, style: { textAnchor: 'middle', fontWeight: 'bold' } }}
                />
                <YAxis 
                  scale={params.method === 'normalized' ? 'log' : 'linear'}
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  label={{ value: params.method === 'standard' ? 'Estimate' : 'Mean Absolute Error (log scale)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontWeight: 'bold' } }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                {params.method === 'standard' ? (
                  <>
                    <Line 
                      type="monotone" 
                      dataKey="mcEstimate" 
                      stroke="#3b82f6" 
                      strokeWidth={2} 
                      dot={{ r: 6 }}
                      name="Monte Carlo"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="isEstimate" 
                      stroke="#ef4444" 
                      strokeWidth={2} 
                      dot={{ r: 6 }}
                      name="Importance Sampling"
                    />
                    <ReferenceLine 
                      y={trueValue} 
                      stroke="#000000" 
                      strokeWidth={2} 
                      strokeDasharray="5 5"
                      label={{ value: "True Value", position: "insideTopLeft" }}
                    />
                  </>
                ) : (
                  <>
                    <Line 
                      type="monotone" 
                      dataKey="stdError" 
                      stroke="#3b82f6" 
                      strokeWidth={2} 
                      dot={{ r: 6 }}
                      name="Standard IS"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="normError" 
                      stroke="#ef4444" 
                      strokeWidth={2} 
                      dot={{ r: 6 }}
                      name="Normalized IS"
                    />
                    <Line 
                      type="monotone" 
                      dataKey={(entry) => {
                        const firstNormError = convergenceData[0]?.normError || 1;
                        const firstSampleSize = convergenceData[0]?.sampleSize || 10;
                        const refScale = firstNormError * Math.sqrt(firstSampleSize);
                        return refScale / Math.sqrt(entry.sampleSize);
                      }}
                      stroke="#000000" 
                      strokeWidth={2} 
                      strokeDasharray="5 5"
                      dot={false}
                      name="1/√n reference"
                    />
                  </>
                )}
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Variance/Error Analysis */}
      <Card className="glass-panel border-white/10">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 opacity-70" />
              </TooltipTrigger>
              <TooltipContent>
                <p>{params.method === 'standard' ? 'Effect of proposal distribution on variance' : 'Efficiency gain from normalized IS'}</p>
              </TooltipContent>
            </Tooltip>
            {params.method === 'standard' ? 'Effect of Proposal Distribution' : 'Efficiency Gain from Normalized IS'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              variance: { label: "Variance", color: "hsl(var(--accent))" },
              errorRatio: { label: "Error Ratio", color: "hsl(var(--accent))" },
              reference: { label: "Equal performance", color: "#000000" },
            }}
            className="h-[250px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={varianceData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(68,68,68,0.5)" />
                <XAxis 
                  dataKey="parameter" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  label={{ value: params.method === 'standard' ? 'Shift parameter t' : 'Proposal shift parameter t', position: 'insideBottom', offset: -10, style: { textAnchor: 'middle', fontWeight: 'bold' } }}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  label={{ value: params.method === 'standard' ? 'Variance' : 'Error Ratio (Standard IS / Normalized IS)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontWeight: 'bold' } }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                {params.method === 'standard' ? (
                  <Line type="monotone" dataKey="variance" stroke="hsl(var(--accent))" strokeWidth={2} dot={{ r: 4 }} />
                ) : (
                  <>
                    <Line type="monotone" dataKey="errorRatio" stroke="hsl(var(--accent))" strokeWidth={2} dot={{ r: 4 }} />
                    <ReferenceLine 
                      y={1.0} 
                      stroke="#000000" 
                      strokeWidth={2} 
                      strokeDasharray="5 5"
                      label={{ value: "Equal performance", position: "insideTopLeft" }}
                    />
                  </>
                )}
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImportanceSamplingVisualization;
