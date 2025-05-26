mport React from "react";
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

  // Generate sample data for standard IS histogram with vertical lines
  const generateSampleHistogramData = () => {
    if (params.method !== 'standard') return { histogramData: [], mcEstimateValue: 0, isEstimateValue: 0 };
    
    // Generate samples exactly as in Python
    const fSamples = generateNormalSamples(params.nDemo, 0, 1);
    const gSamples = generateNormalSamples(params.nDemo, params.proposalT, 1);
    
    // Calculate weights: f(g_samples) / g(g_samples, proposal_t)
    const weights = gSamples.map(x => {
      const numerator = f(x);
      const denominator = g(x, params.proposalT);
      return denominator > 1e-10 ? numerator / denominator : 0;
    });
    
    // Handle invalid weights (equivalent to np.nan_to_num)
    const validWeights = weights.map(w => {
      if (!isFinite(w) || isNaN(w)) return 0;
      return Math.max(0, Math.min(w, 1e10));
    });
    
    // Calculate estimates exactly as in Python code
    // MC estimate: np.mean(h(f_samples, scale_h))
    const mcEstimateValue = fSamples.reduce((sum, x) => sum + h(x, params.scaleH), 0) / fSamples.length;
    
    // IS estimate: np.mean(h(g_samples, scale_h) * weights)
    const isEstimateValue = gSamples.reduce((sum, x, i) => sum + h(x, params.scaleH) * validWeights[i], 0) / gSamples.length;
    
    // Create histogram bins (15 bins as specified)
    const allSamples = [...fSamples, ...gSamples];
    const minVal = Math.min(...allSamples) - 1;
    const maxVal = Math.max(...allSamples) + 1;
    const binWidth = (maxVal - minVal) / 15;
    
    const histogramData = Array.from({ length: 15 }, (_, i) => {
      const binStart = minVal + i * binWidth;
      const binEnd = binStart + binWidth;
      const binCenter = binStart + binWidth / 2;
      
      // Count samples in each bin
      const fCount = fSamples.filter(x => x >= binStart && x < binEnd).length;
      const gCount = gSamples.filter(x => x >= binStart && x < binEnd).length;
      
      // Convert to density (count / (total * binWidth))
      const fDensity = fCount / (fSamples.length * binWidth);
      const gDensity = gCount / (gSamples.length * binWidth);
      
      return {
        x: parseFloat(binCenter.toFixed(2)),
        fDensity: parseFloat(fDensity.toFixed(4)),
        gDensity: parseFloat(gDensity.toFixed(4))
      };
    });
    
    return { 
      histogramData, 
      mcEstimateValue: parseFloat(mcEstimateValue.toFixed(2)), 
      isEstimateValue: parseFloat(isEstimateValue.toFixed(2)) 
    };
  };

  // Generate sample data with proper validation for normalized mode
  const generateSampleData = (): { fSamples: number[]; gSamples: SampleData[] } => {
    const fSamples = generateNormalSamples(params.nDemo, 0, 1);
    const gSamplesRaw = generateNormalSamples(Math.min(500, params.nDemo), params.proposalT, 1);
    
    const gSamples = gSamplesRaw.map(x => {
      const weight = Math.max(1e-10, Math.min(1e10, f(x) / g(x, params.proposalT)));
      return {
        x,
        weight,
        normWeight: weight
      };
    });

    // Normalize weights for normalized IS
    const weightSum = gSamples.reduce((sum, sample) => sum + sample.weight, 0);
    if (weightSum > 0) {
      gSamples.forEach(sample => {
        sample.normWeight = (sample.weight / weightSum) * gSamples.length;
      });
    }

    return { fSamples, gSamples };
  };

  // Generate convergence data with proper error calculations
  const generateConvergenceData = (): ConvergenceData[] => {
    const sampleSizes = [10, 50, 100, 500, 1000, Math.min(5000, params.maxSamples)];
    const trueVal = calculateTrueValue(params.scaleH);
    
    return sampleSizes.map(n => {
      if (params.method === 'standard') {
        // Standard IS - collect multiple trials for error bars
        const mcTrials = [];
        const isTrials = [];
        
        for (let trial = 0; trial < Math.min(50, params.nTrialsConv); trial++) {
          // Monte Carlo with target distribution
          const mcSamples = generateNormalSamples(n, 0, 1);
          const mcEst = mcSamples.reduce((sum, x) => sum + h(x, params.scaleH), 0) / n;
          mcTrials.push(mcEst);
          
          // Importance Sampling with proposal distribution
          const isSamples = generateNormalSamples(n, params.proposalT, 1);
          const weights = isSamples.map(x => f(x) / g(x, params.proposalT));
          const isEst = isSamples.reduce((sum, x, i) => sum + h(x, params.scaleH) * weights[i], 0) / n;
          isTrials.push(isEst);
        }
        
        const mcMean = mcTrials.reduce((a, b) => a + b, 0) / mcTrials.length;
        const isMean = isTrials.reduce((a, b) => a + b, 0) / isTrials.length;
        const mcStdErr = Math.sqrt(mcTrials.reduce((a, b) => a + Math.pow(b - mcMean, 2), 0) / Math.max(1, mcTrials.length - 1)) / Math.sqrt(mcTrials.length);
        const isStdErr = Math.sqrt(isTrials.reduce((a, b) => a + Math.pow(b - isMean, 2), 0) / Math.max(1, isTrials.length - 1)) / Math.sqrt(isTrials.length);
        
        return {
          sampleSize: n,
          mcEstimate: parseFloat(mcMean.toFixed(2)),
          mcError: parseFloat(mcStdErr.toFixed(2)),
          isEstimate: parseFloat(isMean.toFixed(2)),
          isError: parseFloat(isStdErr.toFixed(2))
        };
      } else {
        // Normalized mode - calculate mean absolute errors properly
        let stdErrors = 0;
        let normErrors = 0;
        const nTrials = Math.min(100, params.nTrialsConv);
        
        for (let trial = 0; trial < nTrials; trial++) {
          const samples = generateNormalSamples(n, params.proposalT, 1);
          const weights = samples.map(x => Math.max(1e-10, f(x) / g(x, params.proposalT)));
          const weightSum = weights.reduce((a, b) => a + b, 0);
          
          // Standard IS estimate
          const stdEst = samples.reduce((sum, x, i) => sum + h(x, params.scaleH) * weights[i], 0) / n;
          
          // Normalized IS estimate
          const normEst = weightSum > 0 ? 
            samples.reduce((sum, x, i) => sum + h(x, params.scaleH) * weights[i] / weightSum, 0) : 0;
          
          stdErrors += Math.abs(stdEst - trueVal);
          normErrors += Math.abs(normEst - trueVal);
        }
        
        return {
          sampleSize: n,
          mcEstimate: 0,
          mcError: 0,
          isEstimate: 0,
          isError: 0,
          stdError: parseFloat((stdErrors / nTrials).toFixed(2)),
          normError: parseFloat((normErrors / nTrials).toFixed(2))
        };
      }
    });
  };

  // Generate variance data
  const generateVarianceData = (): VarianceData[] => {
    if (params.method === 'standard') {
      const tValues = [-2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2, 2.5, 3];
      
      return tValues.map(t => {
        const trials = Math.min(50, params.nTrialsVar);
        const estimates: number[] = [];
        
        for (let trial = 0; trial < trials; trial++) {
          const samples = generateNormalSamples(1000, t, 1);
          const weights = samples.map(x => f(x) / g(x, t));
          const estimate = samples.reduce((sum, x, i) => sum + h(x, params.scaleH) * weights[i], 0) / 1000;
          estimates.push(estimate);
        }
        
        const mean = estimates.reduce((a, b) => a + b, 0) / estimates.length;
        const variance = estimates.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / Math.max(1, estimates.length - 1);
        
        return {
          parameter: t,
          variance: Math.max(0, variance)
        };
      });
    } else {
      // Normalized mode - error ratios
      const tValues = [-3, -2.5, -2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2];
      const trueVal = calculateTrueValue(params.scaleH);
      
      return tValues.map(t => {
        let stdErrors = 0;
        let normErrors = 0;
        const nTrials = Math.min(50, params.nTrialsVar);
        
        for (let trial = 0; trial < nTrials; trial++) {
          const samples = generateNormalSamples(200, t, 1);
          const weights = samples.map(x => Math.max(1e-10, f(x) / g(x, t)));
          const weightSum = weights.reduce((a, b) => a + b, 0);
          
          const stdEst = samples.reduce((sum, x, i) => sum + h(x, params.scaleH) * weights[i], 0) / 200;
          const normEst = weightSum > 0 ? 
            samples.reduce((sum, x, i) => sum + h(x, params.scaleH) * weights[i] / weightSum, 0) : 0;
          
          stdErrors += Math.abs(stdEst - trueVal);
          normErrors += Math.abs(normEst - trueVal);
        }
        
        const avgStdError = stdErrors / nTrials;
        const avgNormError = normErrors / nTrials;
        const errorRatio = avgNormError > 1e-10 ? avgStdError / avgNormError : 1;
        
        return {
          parameter: t,
          variance: 0,
          errorRatio: Math.max(0.1, Math.min(10, errorRatio))
        };
      });
    }
  };

  // Generate proper jittered scatter data for normalized mode
  const generateJitteredScatterData = () => {
    if (params.method !== 'normalized') return [];
    
    // CRITICAL: Fixed sample size for visualization
    const nSamples = 500;
    const samples = generateNormalSamples(nSamples, params.proposalT, 1);
    
    // Ensure non-zero denominators
    const weights = samples.map(x => {
      const denominator = g(x, params.proposalT);
      return denominator > 1e-10 ? f(x) / denominator : 0;
    }).map(w => Math.max(1e-10, Math.min(1e10, w))); // Prevent extreme values
    
    // Normalized weights
    const weightSum = weights.reduce((a, b) => a + b, 0);
    const normWeights = weightSum > 0 ? weights.map(w => w / weightSum) : weights;
    
    // CRITICAL: Subsampling for performance
    const nDisplay = Math.min(200, samples.length);
    const indices = Array.from({length: samples.length}, (_, i) => i)
      .sort(() => Math.random() - 0.5)
      .slice(0, nDisplay);
    
    return indices.map(i => {
      const stdJitter = (Math.random() - 0.5) * 0.1;
      const normJitter = (Math.random() - 0.5) * 0.1;
      
      return {
        xStd: samples[i] + stdJitter,
        yStd: weights[i],
        xNorm: samples[i] + normJitter,
        yNorm: normWeights[i] * nSamples, // Scale for visibility
        originalX: samples[i]
      };
    });
  };

  const distributionData = generateDistributionData();
  const { fSamples, gSamples } = generateSampleData();
  const convergenceData = generateConvergenceData();
  const varianceData = generateVarianceData();
  const trueValue = parseFloat(calculateTrueValue(params.scaleH).toFixed(2));
  const jitteredData = generateJitteredScatterData();
  const { histogramData, mcEstimateValue, isEstimateValue } = generateSampleHistogramData();

  return (
    <div className="space-y-6">
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
                    tickFormatter={(value) => parseFloat(value).toFixed(2)}
                    label={{ value: 'x', position: 'insideBottom', offset: -10, style: { textAnchor: 'middle', fontWeight: 'bold' } }}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickFormatter={(value) => parseFloat(value).toFixed(2)}
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
                  <p>{params.method === 'standard' ? 'Sample histograms with MC/IS estimates and true value' : 'Weight vs. Sample Value with jitter'}</p>
                </TooltipContent>
              </Tooltip>
              {params.method === 'standard' ? 'Sample Distribution' : 'Weight vs. Sample Value'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {params.method === 'standard' ? (
              <ChartContainer
                config={{
                  fDensity: { label: "f samples", color: "#87CEEB" },
                  gDensity: { label: "g samples", color: "#FF6B6B" },
                }}
                className="h-[250px] w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={histogramData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(68,68,68,0.3)" />
                    <XAxis 
                      dataKey="x" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickFormatter={(value) => parseFloat(value).toFixed(2)}
                      label={{ value: 'x', position: 'insideBottom', offset: -10, style: { textAnchor: 'middle', fontWeight: 'bold' } }}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickFormatter={(value) => parseFloat(value).toFixed(2)}
                      label={{ value: 'Density', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontWeight: 'bold' } }}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="fDensity" fill="#87CEEB" fillOpacity={0.4} />
                    <Bar dataKey="gDensity" fill="#FF6B6B" fillOpacity={0.4} />
                    
                    {/* MC Estimate Line - Blue Dashed */}
                    <ReferenceLine 
                      x={mcEstimateValue} 
                      stroke="#3b82f6" 
                      strokeWidth={2} 
                      strokeDasharray="5 5"
                      label={{ value: `MC: ${mcEstimateValue}`, position: "top" }}
                    />
                    
                    {/* IS Estimate Line - Red Dashed */}
                    <ReferenceLine 
                      x={isEstimateValue} 
                      stroke="#ef4444" 
                      strokeWidth={2} 
                      strokeDasharray="5 5"
                      label={{ value: `IS: ${isEstimateValue}`, position: "top" }}
                    />
                    
                    {/* True Value Line - Black Solid */}
                    <ReferenceLine 
                      x={trueValue} 
                      stroke="#2d2d2d" 
                      strokeWidth={2}
                      label={{ value: `True: ${trueValue}`, position: "top" }}
                    />
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
                  <ScatterChart 
                    data={jitteredData} 
                    margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(68,68,68,0.5)" />
                    <XAxis 
                      type="number"
                      dataKey="originalX"
                      domain={jitteredData.length > 0 ? [
                        Math.min(...jitteredData.map(d => d.originalX)) - 1,
                        Math.max(...jitteredData.map(d => d.originalX)) + 1
                      ] : [-3, 3]}
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      label={{ value: 'x', position: 'insideBottom', offset: -10, style: { textAnchor: 'middle', fontWeight: 'bold' } }}
                    />
                    <YAxis 
                      type="number"
                      domain={jitteredData.length > 0 ? [
                        0,
                        Math.max(...jitteredData.map(d => Math.max(d.yStd, d.yNorm))) * 1.1
                      ] : [0, 1]}
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
                reference: { label: "1/√n reference", color: "#8B5CF6" },
                trueValue: { label: "True Value", color: "#10b981" },
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
                    tickFormatter={(value) => value.toString()}
                    label={{ value: 'Number of samples (log scale)', position: 'insideBottom', offset: -10, style: { textAnchor: 'middle', fontWeight: 'bold' } }}
                  />
                  <YAxis 
                    scale={params.method === 'normalized' ? 'log' : 'linear'}
                    domain={params.method === 'normalized' ? ['auto', 'auto'] : (() => {
                      const estimates = convergenceData.flatMap(d => [d.mcEstimate, d.isEstimate]).filter(e => e > 0);
                      const errors = convergenceData.flatMap(d => [d.mcError, d.isError]).filter(e => e > 0);
                      if (estimates.length === 0) return ['auto', 'auto'];
                      const minEst = Math.min(...estimates) - Math.max(...errors);
                      const maxEst = Math.max(...estimates) + Math.max(...errors);
                      return [minEst * 0.8, maxEst * 1.2];
                    })()}
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickFormatter={(value) => parseFloat(value).toFixed(2)}
                    label={{ value: params.method === 'standard' ? 'Estimate' : 'Mean Absolute Error (log scale)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontWeight: 'bold' } }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  {params.method === 'standard' ? (
                    <>
                      <Line 
                        type="monotone" 
                        dataKey="mcEstimate" 
                        stroke="#3b82f6" 
                        strokeWidth={3} 
                        dot={{ r: 6 }}
                        name="Monte Carlo"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="isEstimate" 
                        stroke="#ef4444" 
                        strokeWidth={3} 
                        dot={{ r: 6 }}
                        name="Importance Sampling"
                      />
                      <ReferenceLine 
                        y={trueValue} 
                        stroke="#10b981" 
                        strokeWidth={3} 
                        strokeDasharray="5 5"
                        label={{ value: "True Value", position: "top" }}
                      />
                    </>
                  ) : (
                    <>
                      <Line 
                        type="monotone" 
                        dataKey="stdError" 
                        stroke="#3b82f6" 
                        strokeWidth={3} 
                        dot={{ r: 6 }}
                        name="Standard IS"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="normError" 
                        stroke="#ef4444" 
                        strokeWidth={3} 
                        dot={{ r: 6 }}
                        name="Normalized IS"
                      />
                      {convergenceData.length > 0 && convergenceData[0]?.normError && (
                        <Line 
                          type="monotone" 
                          dataKey={(entry) => {
                            const firstNormError = convergenceData[0]?.normError || 1;
                            const firstSampleSize = convergenceData[0]?.sampleSize || 10;
                            const refScale = firstNormError * Math.sqrt(firstSampleSize);
                            return parseFloat((refScale / Math.sqrt(entry.sampleSize)).toFixed(2));
                          }}
                          stroke="#8B5CF6" 
                          strokeWidth={3} 
                          strokeDasharray="5 5"
                          dot={false}
                          name="1/√n reference"
                        />
                      )}
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
                reference: { label: "Equal performance", color: "#10b981" },
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
                        stroke="#10b981" 
                        strokeWidth={2} 
                        strokeDasharray="5 5"
                        label={{ value: "Equal performance", position: "top" }}
                      />
                    </>
                  )}
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Current Parameters Display */}
      <Card className="glass-panel border-white/10 mt-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Current Parameters</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 text-sm">
            <div className="space-y-1">
              <p className="text-muted-foreground">Method</p>
              <p className="font-medium">{params.method === 'standard' ? 'Standard IS' : 'Normalized IS'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">Proposal t</p>
              <p className="font-medium">{params.proposalT.toFixed(1)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">Scale h</p>
              <p className="font-medium">{params.scaleH.toFixed(1)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">Demo samples</p>
              <p className="font-medium">{params.nDemo}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">Conv. trials</p>
              <p className="font-medium">{params.nTrialsConv}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">True value</p>
              <p className="font-medium">{trueValue.toFixed(4)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImportanceSamplingVisualization;
