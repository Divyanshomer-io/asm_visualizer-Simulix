
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ScatterChart, Scatter } from "recharts";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { SimulatedAnnealingToyState, ToySimulationParams } from "@/utils/simulatedAnnealingToy";

interface ToyVisualizationPanelProps {
  state: SimulatedAnnealingToyState;
  params: ToySimulationParams;
}

const ToyVisualizationPanel: React.FC<ToyVisualizationPanelProps> = ({ state, params }) => {
  const [binaryViewRange, setBinaryViewRange] = useState([0, Math.min(50, state.history.length)]);
  
  // Prepare data for charts
  const functionValueData = state.history.map(entry => ({
    iteration: entry.iteration,
    currentValue: entry.value,
    bestValue: entry.bestValue
  }));
  
  const acceptanceProbData = state.history.slice(1).map(entry => ({
    iteration: entry.iteration,
    probability: entry.acceptanceProbability
  }));
  
  const stateSpaceData = state.history.map(entry => ({
    state: entry.state,
    value: entry.value,
    iteration: entry.iteration
  }));
  
  // Binary representation heatmap data with slider control
  const maxIterationsToShow = 50;
  const totalIterations = state.history.length;
  const startIndex = binaryViewRange[0];
  const endIndex = Math.min(binaryViewRange[1], totalIterations);
  
  const visibleHistorySlice = state.history.slice(startIndex, endIndex);
  
  // Calculate block size to fill the graph properly
  const graphWidth = maxIterationsToShow;
  const graphHeight = params.r;
  const blockWidth = Math.max(1, graphWidth / Math.min(maxIterationsToShow, Math.max(1, visibleHistorySlice.length)));
  const blockHeight = Math.max(1, graphHeight / Math.max(1, params.r));
  
  const binaryHeatmapData = visibleHistorySlice.length > 0 && params.r > 0 ? 
    Array.from({ length: params.r }, (_, bitIndex) => ({
      bitIndex,
      data: visibleHistorySlice.map((entry, sliceIndex) => ({
        iteration: startIndex + sliceIndex,
        value: entry.binaryRepresentation[bitIndex] || 0
      }))
    })) : [];
  
  const handleBinaryRangeChange = (value: number[]) => {
    const start = value[0];
    const end = Math.min(start + maxIterationsToShow, totalIterations);
    setBinaryViewRange([start, end]);
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Function Value Evolution */}
      <Card className="glass-panel border-white/10">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 opacity-70" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Tracks the optimization progress. Blue line shows current value, dashed line shows best value found.</p>
              </TooltipContent>
            </Tooltip>
            Function Value Evolution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              currentValue: {
                label: "Current Value",
                color: "hsl(var(--primary))",
              },
              bestValue: {
                label: "Best Value",
                color: "hsl(var(--accent))",
              },
            }}
            className="h-[250px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={functionValueData} margin={{ left: 30, right: 30, top: 20, bottom: 50 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="iteration" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  fontWeight="bold"
                  fontFamily="Inter, system-ui, sans-serif"
                  label={{ 
                    value: 'Iteration', 
                    position: 'insideBottom', 
                    offset: -30, 
                    style: { 
                      textAnchor: 'middle', 
                      fill: 'hsl(var(--muted-foreground))',
                      fontWeight: 'bold',
                      fontSize: '12px'
                    } 
                  }}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  fontWeight="bold"
                  fontFamily="Inter, system-ui, sans-serif"
                  label={{ 
                    value: 'Function Value', 
                    angle: -90, 
                    position: 'insideLeft', 
                    style: { 
                      textAnchor: 'middle', 
                      fill: 'hsl(var(--muted-foreground))',
                      fontWeight: 'bold',
                      fontSize: '12px'
                    } 
                  }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line 
                  type="monotone" 
                  dataKey="currentValue" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="bestValue" 
                  stroke="hsl(var(--accent))" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
      
      {/* Binary State Representation with Slider */}
      <Card className="glass-panel border-white/10">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 opacity-70" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Visualizes how each bit in the solution changes over time. Dark = 0, Light = 1. Use slider to navigate through iterations.</p>
              </TooltipContent>
            </Tooltip>
            Binary State Representation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-[200px] w-full">
              {state.history.length > 0 && params.r > 0 ? (
                <div className="relative h-full w-full bg-secondary/20 rounded border border-white/10">
                  <svg viewBox={`0 0 ${maxIterationsToShow} ${params.r}`} className="w-full h-full">
                    {binaryHeatmapData.map((bit, bitIndex) => 
                      bit.data.map((point, iterIndex) => (
                        <rect
                          key={`${bitIndex}-${iterIndex}`}
                          x={iterIndex * blockWidth}
                          y={bitIndex * blockHeight}
                          width={blockWidth}
                          height={blockHeight}
                          fill={point.value === 1 ? "hsl(var(--accent))" : "hsl(var(--secondary))"}
                          opacity={0.8}
                          stroke="hsl(var(--border))"
                          strokeWidth={0.1}
                        />
                      ))
                    )}
                  </svg>
                  {/* Axes labels */}
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-6 text-sm font-bold opacity-90">
                    Iteration →
                  </div>
                  <div className="absolute top-1/2 left-0 text-sm font-bold opacity-90 transform -rotate-90 origin-left -translate-x-6 -translate-y-1/2">
                    ← Bit Index
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  <div className="relative w-full h-full bg-secondary/20 rounded border border-white/10">
                    <svg viewBox={`0 0 ${maxIterationsToShow} ${Math.max(1, params.r)}`} className="w-full h-full">
                      {/* Show empty grid structure */}
                      {Array.from({ length: Math.max(1, params.r) }, (_, bitIndex) => 
                        Array.from({ length: maxIterationsToShow }, (_, iterIndex) => (
                          <rect
                            key={`empty-${bitIndex}-${iterIndex}`}
                            x={iterIndex}
                            y={bitIndex}
                            width={1}
                            height={1}
                            fill="hsl(var(--secondary))"
                            opacity={0.3}
                            stroke="hsl(var(--border))"
                            strokeWidth={0.1}
                          />
                        ))
                      )}
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground font-mono">
                      Click start to begin visualization
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Slider for navigation - moved below the plot */}
            {totalIterations > maxIterationsToShow && (
              <div className="space-y-2">
                <Label className="text-sm font-bold">
                  Viewing iterations {startIndex} - {endIndex - 1} of {totalIterations - 1}
                </Label>
                <Slider
                  value={[binaryViewRange[0]]}
                  onValueChange={(value) => handleBinaryRangeChange(value)}
                  min={0}
                  max={Math.max(0, totalIterations - maxIterationsToShow)}
                  step={1}
                  className="w-full"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Acceptance Probability */}
      <Card className="glass-panel border-white/10">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 opacity-70" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Shows how likely the algorithm is to accept a worse solution. Decreases as temperature cools.</p>
              </TooltipContent>
            </Tooltip>
            Acceptance Probability
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              probability: {
                label: "Acceptance Probability",
                color: "hsl(var(--destructive))",
              },
            }}
            className="h-[250px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={acceptanceProbData} margin={{ left: 30, right: 30, top: 20, bottom: 50 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="iteration" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  fontWeight="bold"
                  fontFamily="Inter, system-ui, sans-serif"
                  label={{ 
                    value: 'Iteration', 
                    position: 'insideBottom', 
                    offset: -30, 
                    style: { 
                      textAnchor: 'middle', 
                      fill: 'hsl(var(--muted-foreground))',
                      fontWeight: 'bold',
                      fontSize: '12px'
                    } 
                  }}
                />
                <YAxis 
                  domain={[0, 1]}
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  fontWeight="bold"
                  fontFamily="Inter, system-ui, sans-serif"
                  label={{ 
                    value: 'Probability', 
                    angle: -90, 
                    position: 'insideLeft', 
                    style: { 
                      textAnchor: 'middle', 
                      fill: 'hsl(var(--muted-foreground))',
                      fontWeight: 'bold',
                      fontSize: '12px'
                    } 
                  }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line 
                  type="monotone" 
                  dataKey="probability" 
                  stroke="hsl(var(--destructive))" 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
      
      {/* State Space Exploration */}
      <Card className="glass-panel border-white/10">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 opacity-70" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Displays which solutions were explored and how the search focused over time.</p>
              </TooltipContent>
            </Tooltip>
            State Space Exploration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              exploration: {
                label: "SA Path",
                color: "hsl(var(--accent))",
              },
              searchSpace: {
                label: "Search Space",
                color: "hsl(var(--muted-foreground))",
              },
            }}
            className="h-[250px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ left: 30, right: 30, top: 20, bottom: 50 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  type="number"
                  dataKey="state"
                  name="State"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  fontWeight="bold"
                  fontFamily="Inter, system-ui, sans-serif"
                  label={{ 
                    value: 'State (Decimal)', 
                    position: 'insideBottom', 
                    offset: -30, 
                    style: { 
                      textAnchor: 'middle', 
                      fill: 'hsl(var(--muted-foreground))',
                      fontWeight: 'bold',
                      fontSize: '12px'
                    } 
                  }}
                />
                <YAxis 
                  type="number"
                  dataKey="value"
                  name="Function Value"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  fontWeight="bold"
                  fontFamily="Inter, system-ui, sans-serif"
                  label={{ 
                    value: 'Function Value', 
                    angle: -90, 
                    position: 'insideLeft', 
                    style: { 
                      textAnchor: 'middle', 
                      fill: 'hsl(var(--muted-foreground))',
                      fontWeight: 'bold',
                      fontSize: '12px'
                    } 
                  }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                
                {/* Search space background (if small enough) */}
                {state.searchSpace.length > 0 && state.searchSpace.length <= 256 && (
                  <Scatter
                    data={state.searchSpace}
                    fill="hsl(var(--muted-foreground))"
                    fillOpacity={0.2}
                    strokeOpacity={0}
                    r={2}
                  />
                )}
                
                {/* SA exploration path */}
                <Scatter
                  data={stateSpaceData}
                  fill="hsl(var(--accent))"
                  fillOpacity={0.6}
                  strokeOpacity={0}
                  r={3}
                />
                
                {/* Best solution highlight */}
                {state.bestState !== undefined && (
                  <Scatter
                    data={[{ state: state.bestState, value: state.bestValue }]}
                    fill="hsl(var(--primary))"
                    stroke="hsl(var(--ring))"
                    strokeWidth={2}
                    r={6}
                  />
                )}
              </ScatterChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default ToyVisualizationPanel;
