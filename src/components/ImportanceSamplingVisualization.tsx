
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ScatterChart, Scatter, BarChart, Bar } from "recharts";
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

  // Generate sample data
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

    // Normalize weights
    const weightSum = gSamples.reduce((sum, sample) => sum + sample.weight, 0);
    gSamples.forEach(sample => {
      sample.normWeight = sample.weight / weightSum * params.nDemo;
    });

    return { fSamples, gSamples };
  };

  // Generate convergence data
  const generateConvergenceData = (): ConvergenceData[] => {
    const sampleSizes = [10, 50, 100, 500, 1000, params.maxSamples];
    const trueVal = calculateTrueValue(params.scaleH);
    
    return sampleSizes.map(n => {
      if (params.method === 'standard') {
        const mc = mcEstimate(n, params.scaleH);
        const is = isEstimate(n, params.proposalT, params.scaleH);
        
        return {
          sampleSize: n,
          mcEstimate: mc.estimate,
          mcError: mc.error,
          isEstimate: is.estimate,
          isError: is.error
        };
      } else {
        // Normalized mode - calculate errors over multiple trials
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

  const distributionData = generateDistributionData();
  const { fSamples, gSamples } = generateSampleData();
  const convergenceData = generateConvergenceData();
  const varianceData = generateVarianceData();
  const trueValue = calculateTrueValue(params.scaleH);

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

  const mcEst = params.method === 'standard' ? mcEstimate(params.nDemo, params.scaleH).estimate : 0;
  const isEst = params.method === 'standard' ? isEstimate(params.nDemo, params.proposalT, params.scaleH).estimate : 0;

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
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
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
                <Line type="monotone" dataKey="target" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="proposal" stroke="hsl(var(--destructive))" strokeWidth={2} dot={false} />
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
                <p>{params.method === 'standard' ? 'Sample histograms and estimates' : 'Weight visualization'}</p>
              </TooltipContent>
            </Tooltip>
            {params.method === 'standard' ? 'Sample Distribution' : 'Weight vs. Sample Value'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {params.method === 'standard' ? (
            <ChartContainer
              config={{
                fCount: { label: "f samples", color: "hsl(var(--primary))" },
                gCount: { label: "g samples", color: "hsl(var(--destructive))" },
              }}
              className="h-[250px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={histogramData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
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
                  <Bar dataKey="fCount" fill="hsl(var(--primary))" fillOpacity={0.5} />
                  <Bar dataKey="gCount" fill="hsl(var(--destructive))" fillOpacity={0.5} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          ) : (
            <ChartContainer
              config={{
                standard: { label: "Standard weights", color: "hsl(var(--primary))" },
                normalized: { label: "Normalized weights", color: "hsl(var(--destructive))" },
              }}
              className="h-[250px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    type="number"
                    dataKey="x"
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
                  <Scatter data={gSamples.map(s => ({ x: s.x + 0.05 * (Math.random() - 0.5), y: s.weight }))} fill="hsl(var(--primary))" fillOpacity={0.6} r={3} />
                  <Scatter data={gSamples.map(s => ({ x: s.x - 0.05 * (Math.random() - 0.5), y: s.normWeight }))} fill="hsl(var(--destructive))" fillOpacity={0.6} r={3} />
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
                <p>Shows how estimates improve with more samples</p>
              </TooltipContent>
            </Tooltip>
            Convergence Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              mc: { label: "Monte Carlo", color: "hsl(var(--primary))" },
              is: { label: "Importance Sampling", color: "hsl(var(--destructive))" },
              std: { label: "Standard IS", color: "hsl(var(--primary))" },
              norm: { label: "Normalized IS", color: "hsl(var(--destructive))" },
              reference: { label: "1/√n reference", color: "hsl(var(--muted-foreground))" },
            }}
            className="h-[250px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={convergenceData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="sampleSize" 
                  scale={params.method === 'normalized' ? 'log' : 'linear'}
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  label={{ value: 'Sample Size', position: 'insideBottom', offset: -10, style: { textAnchor: 'middle', fontWeight: 'bold' } }}
                />
                <YAxis 
                  scale={params.method === 'normalized' ? 'log' : 'linear'}
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  label={{ value: params.method === 'standard' ? 'Estimate' : 'Mean Absolute Error', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontWeight: 'bold' } }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                {params.method === 'standard' ? (
                  <>
                    <Line type="monotone" dataKey="mcEstimate" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="isEstimate" stroke="hsl(var(--destructive))" strokeWidth={2} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey={() => trueValue} stroke="hsl(var(--muted-foreground))" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                  </>
                ) : (
                  <>
                    <Line type="monotone" dataKey="stdError" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="normError" stroke="hsl(var(--destructive))" strokeWidth={2} dot={{ r: 4 }} />
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
              reference: { label: "Equal performance", color: "hsl(var(--muted-foreground))" },
            }}
            className="h-[250px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={varianceData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
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
                    <Line type="monotone" dataKey={() => 1.0} stroke="hsl(var(--muted-foreground))" strokeWidth={2} strokeDasharray="5 5" dot={false} />
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
