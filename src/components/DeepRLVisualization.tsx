import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { TrendingUp, BarChart3, Brain, Target, Activity, Zap, Info } from 'lucide-react';
import { DeepRLState, DeepRLParams } from '@/pages/DeepRL';

interface DeepRLVisualizationProps {
  state: DeepRLState;
  params: DeepRLParams;
}

const DeepRLVisualization: React.FC<DeepRLVisualizationProps> = ({ state, params }) => {
  // Prepare data for charts
  const trainingProgressData = state.episodeRewards.map((reward, index) => ({
    episode: index + 1,
    reward,
    movingAvg: state.movingAvg[index] || reward
  }));

  const qValuesData = [
    { action: 'Left Action', value: state.qValues[0], color: '#ff6b6b' },
    { action: 'Right Action', value: state.qValues[1], color: '#4ecdc4' }
  ];

  const epsilonData = state.epsilonHistory.map((epsilon, index) => ({
    episode: index + 1,
    epsilon
  }));

  const lossData = state.lossHistory.map((loss, index) => ({
    episode: index + 1,
    loss
  }));

  const chartConfig = {
    reward: {
      label: "Episode Reward",
      color: "hsl(var(--primary))",
    },
    movingAvg: {
      label: "Moving Average",
      color: "#f39c12",
    },
    epsilon: {
      label: "Exploration Rate",
      color: "hsl(var(--accent))",
    },
    loss: {
      label: "Training Loss",
      color: "hsl(162, 63%, 41%)",
    },
  };

  return (
    <div className="space-y-4">
      {/* Row 1: Training Progress (Full Width) */}
      <Card className="glass-panel border-white/10">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-400" />
              Training Progress
            </div>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-blue-400 cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="tooltip-content max-w-[280px]" side="left" align="start" >
                  <strong>Training Progress:</strong> Shows how well the agent performs over time. 
                  Blue line = individual episode rewards, Orange line = moving average trend.
                </p>
              </TooltipContent>
            </Tooltip>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <ChartContainer config={chartConfig} className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trainingProgressData} margin={{ left: 10, right: 10, top: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="episode" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line 
                  type="monotone" 
                  dataKey="reward" 
                  stroke="var(--color-reward)" 
                  strokeWidth={2}
                  dot={false}
                  name="Episode Reward"
                />
                <Line 
                  type="monotone" 
                  dataKey="movingAvg" 
                  stroke="var(--color-movingAvg)" 
                  strokeWidth={3}
                  dot={false}
                  name="Moving Average (10)"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Row 2: Q-Value Predictions (1/2) + Exploration Rate (1/2) */}
      <div className="grid grid-cols-2 gap-4">
        {/* Q-Value Predictions */}
        <Card className="glass-panel border-white/10">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-green-400" />
                Q-Value Predictions
              </div>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-green-400 cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="tooltip-content max-w-[280px]" side="left" align="start">
                    <strong>Q-Values:</strong> Current neural network predictions for each action. 
                    Higher values indicate the agent thinks that action will lead to better rewards.
                  </p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <ChartContainer config={chartConfig} className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={qValuesData} margin={{ left: 10, right: 10, top: 10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="action" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <ChartTooltip 
                    content={<ChartTooltipContent />}
                    formatter={(value: number) => [value.toFixed(3), 'Q-Value']}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {qValuesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Exploration Rate (Epsilon) */}
        <Card className="glass-panel border-white/10">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-yellow-400" />
                Exploration Rate (ε)
              </div>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-yellow-400 cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="tooltip-content max-w-[280px]" side="left" align="start" >
                    <strong>Epsilon (ε):</strong> Controls exploration vs exploitation. 
                    Starts high (random actions) and decays over time (learned actions).
                  </p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <ChartContainer config={chartConfig} className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={epsilonData} margin={{ left: 10, right: 10, top: 10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="episode" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis 
                    domain={[0, 1]}
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line 
                    type="monotone" 
                    dataKey="epsilon" 
                    stroke="var(--color-epsilon)" 
                    strokeWidth={2}
                    dot={false}
                    fill="var(--color-epsilon)"
                    fillOpacity={0.1}
                    name="Exploration Rate"
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Row 3: Training Loss (Full Width) */}
      <Card className="glass-panel border-white/10">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-orange-400" />
              Training Loss
            </div>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-orange-400 cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="tooltip-content max-w-[280px]" side="left" align="start">
                  <strong>Training Loss:</strong> Measures how well the neural network is learning. 
                  Lower values indicate better Q-value predictions.
                </p>
              </TooltipContent>
            </Tooltip>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <ChartContainer config={chartConfig} className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lossData} margin={{ left: 10, right: 10, top: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="episode" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line 
                  type="monotone" 
                  dataKey="loss" 
                  stroke="var(--color-loss)" 
                  strokeWidth={2}
                  dot={false}
                  name="Training Loss"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Row 4: Layer 1 Weights (2/3) + Network Architecture (1/3) */}
      <div className="grid grid-cols-3 gap-4">
        {/* Layer 1 Weights Heatmap (2/3 width) */}
        <Card className="glass-panel border-white/10 col-span-2">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-red-400" />
                Layer 1 Weights
              </div>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-red-400 cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="tooltip-content max-w-[280px]" side="left" align="start">
                    <strong>Neural Weights:</strong> Visual representation of the first layer's connection weights. 
                    Colors show how strongly each input feature influences each neuron.
                  </p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-64 relative w-full overflow-hidden">
              <svg viewBox={`0 0 ${params.networkSize} 4`} className="w-full h-full">
                {state.weightsData.map((inputWeights, inputIndex) =>
                  inputWeights.map((weight, neuronIndex) => {
                    const intensity = Math.abs(weight);
                    const color = weight > 0 ? 
                      `rgba(59, 130, 246, ${intensity})` : 
                      `rgba(239, 68, 68, ${intensity})`;
                    
                    return (
                      <rect
                        key={`${inputIndex}-${neuronIndex}`}
                        x={neuronIndex}
                        y={inputIndex}
                        width={1}
                        height={1}
                        fill={color}
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth={0.02}
                      >
                        <title>
                          Input {inputIndex + 1} → Neuron {neuronIndex + 1}: {weight.toFixed(3)}
                        </title>
                      </rect>
                    );
                  })
                )}
              </svg>
              
              {/* Legend */}
              <div className="absolute bottom-2 right-2 text-xs space-y-1">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-blue-400 rounded"></div>
                  <span>Positive</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-red-400 rounded"></div>
                  <span>Negative</span>
                </div>
              </div>
              
              {/* Axis labels */}
              <div className="absolute bottom-0 left-0 text-xs opacity-70">
                Input Features →
              </div>
              <div className="absolute top-0 left-0 text-xs opacity-70 transform -rotate-90 origin-left translate-y-4">
                Neurons →
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Network Architecture (1/3 width) */}
        <Card className="glass-panel border-white/10">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-400" />
                Network Architecture
              </div>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-purple-400 cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="tooltip-content max-w-[280px]" side="left" align="start">
                    <strong>Neural Network:</strong> The DQN architecture with input layer (4 state features), 
                    hidden layers, and output layer (2 Q-values for actions).
                  </p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-64 flex flex-col justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="text-sm font-medium text-blue-400">Input Layer</div>
                <div className="text-xs text-muted-foreground">4 neurons (state features)</div>
              </div>
              
              <div className="flex items-center justify-center">
                <div className="w-8 h-0.5 bg-gradient-to-r from-blue-400 to-green-400"></div>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm font-medium text-green-400">Hidden Layers</div>
                <div className="text-xs text-muted-foreground">
                  {params.networkSize} × 2 neurons<br />
                  (ReLU activation)
                </div>
              </div>
              
              <div className="flex items-center justify-center">
                <div className="w-8 h-0.5 bg-gradient-to-r from-green-400 to-yellow-400"></div>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm font-medium text-yellow-400">Output Layer</div>
                <div className="text-xs text-muted-foreground">2 neurons (Q-values)</div>
              </div>
              
              <div className="pt-2 border-t border-white/10">
                <div className="text-xs text-muted-foreground">
                  <strong>Total Parameters:</strong><br />
                  {(4 * params.networkSize + params.networkSize * params.networkSize + params.networkSize * 2).toLocaleString()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DeepRLVisualization;
