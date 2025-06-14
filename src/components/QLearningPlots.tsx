
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import QLearningTooltip from './QLearningTooltip';

interface QLearningPlotsProps {
  episodeRewards: number[];
  episodeSteps: number[];
  episodeEpsilons: number[];
  isTraining: boolean;
}

const QLearningPlots: React.FC<QLearningPlotsProps> = ({
  episodeRewards,
  episodeSteps,
  episodeEpsilons,
  isTraining
}) => {
  const rewardsData = episodeRewards.map((reward, index) => ({
    episode: index + 1,
    value: reward
  }));

  const stepsData = episodeSteps.map((steps, index) => ({
    episode: index + 1,
    value: steps
  }));

  const epsilonData = episodeEpsilons.map((epsilon, index) => ({
    episode: index + 1,
    value: epsilon
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 border border-blue-500/50 rounded p-2 text-xs">
          <p className="text-blue-300">{`Episode: ${label}`}</p>
          <p className="text-green-300">{`Value: ${payload[0].value.toFixed(3)}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="glass-panel col-span-full">
      <CardHeader className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border-b border-white/10">
        <CardTitle className="text-lg flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-400 to-blue-500"></div>
          Training Analytics
          <span className="text-sm font-normal opacity-70 ml-auto">
            Real-time Learning Metrics
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs defaultValue="rewards" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="rewards" className="flex items-center gap-2">
              Rewards
              <QLearningTooltip
                content="🏆 Cumulative Reward Progress
• Y-axis: Total reward accumulated per episode
• Shows learning progress over time
• Initial volatility normal (random exploration)
• Should stabilize and increase as policy improves
• Plateaus indicate convergence to optimal policy"
              />
            </TabsTrigger>
            <TabsTrigger value="steps" className="flex items-center gap-2">
              Steps
              <QLearningTooltip
                content="👣 Steps per Episode
• Number of actions taken to reach goal
• Decreasing trend = more efficient pathfinding
• Spikes indicate exploration of new paths
• Optimal path length depends on maze layout
• Measures policy efficiency improvement"
              />
            </TabsTrigger>
            <TabsTrigger value="exploration" className="flex items-center gap-2">
              Exploration
              <QLearningTooltip
                content="🔍 Exploration Rate Decay
• Shows ε-greedy exploration probability over time
• Typically starts high (0.9) and decays to low (0.01)
• Exponential decay: ε = ε₀ × decay^episode
• High early: Discover environment
• Low later: Exploit learned knowledge"
              />
            </TabsTrigger>
          </TabsList>

          <TabsContent value="rewards" className="space-y-4">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={rewardsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="episode" 
                    stroke="#9ca3af"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#9ca3af"
                    fontSize={12}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, stroke: '#10b981', strokeWidth: 2 }}
                  />
                  <CustomTooltip />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="text-sm opacity-70 text-center">
              Episode Rewards - Higher values indicate better performance
            </p>
          </TabsContent>

          <TabsContent value="steps" className="space-y-4">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stepsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="episode" 
                    stroke="#9ca3af"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#9ca3af"
                    fontSize={12}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, stroke: '#3b82f6', strokeWidth: 2 }}
                  />
                  <CustomTooltip />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="text-sm opacity-70 text-center">
              Steps per Episode - Lower values indicate more efficient paths
            </p>
          </TabsContent>

          <TabsContent value="exploration" className="space-y-4">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={epsilonData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="episode" 
                    stroke="#9ca3af"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#9ca3af"
                    fontSize={12}
                    domain={[0, 1]}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#f59e0b" 
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, stroke: '#f59e0b', strokeWidth: 2 }}
                  />
                  <CustomTooltip />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="text-sm opacity-70 text-center">
              Exploration Rate - Shows the balance between exploration and exploitation
            </p>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default QLearningPlots;
