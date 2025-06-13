
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Timer, Search } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState('rewards');

  // Prepare data for charts
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
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium">{`Episode: ${label}`}</p>
          <p className="text-sm text-primary">
            {`${getYAxisLabel(activeTab)}: ${payload[0].value.toFixed(3)}`}
          </p>
        </div>
      );
    }
    return null;
  };

  const getYAxisLabel = (tab: string) => {
    switch (tab) {
      case 'rewards':
        return 'Cumulative Reward';
      case 'steps':
        return 'Steps Taken';
      case 'exploration':
        return 'Exploration Rate (ε)';
      default:
        return 'Value';
    }
  };

  const getChartColor = (tab: string) => {
    switch (tab) {
      case 'rewards':
        return '#3b82f6'; // Blue
      case 'steps':
        return '#ef4444'; // Red
      case 'exploration':
        return '#22c55e'; // Green
      default:
        return '#3b82f6';
    }
  };

  const getChartData = (tab: string) => {
    switch (tab) {
      case 'rewards':
        return rewardsData;
      case 'steps':
        return stepsData;
      case 'exploration':
        return epsilonData;
      default:
        return [];
    }
  };

  const getIcon = (tab: string) => {
    switch (tab) {
      case 'rewards':
        return <TrendingUp className="h-4 w-4" />;
      case 'steps':
        return <Timer className="h-4 w-4" />;
      case 'exploration':
        return <Search className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <Card className="glass-panel">
      <CardHeader>
        <CardTitle className="text-lg">
          Training Progress {isTraining && <span className="text-sm opacity-70 ml-2">(LIVE)</span>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="rewards" className="flex items-center gap-2">
              {getIcon('rewards')}
              Rewards
            </TabsTrigger>
            <TabsTrigger value="steps" className="flex items-center gap-2">
              {getIcon('steps')}
              Steps
            </TabsTrigger>
            <TabsTrigger value="exploration" className="flex items-center gap-2">
              {getIcon('exploration')}
              Exploration
            </TabsTrigger>
          </TabsList>

          <div className="h-64 w-full">
            <TabsContent value="rewards" className="h-full mt-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={rewardsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="episode" 
                    stroke="#9ca3af"
                    label={{ value: 'Training Episode', position: 'insideBottom', offset: -5 }}
                  />
                  <YAxis 
                    stroke="#9ca3af"
                    label={{ value: 'Cumulative Reward', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke={getChartColor('rewards')} 
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, stroke: getChartColor('rewards'), strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>

            <TabsContent value="steps" className="h-full mt-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stepsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="episode" 
                    stroke="#9ca3af"
                    label={{ value: 'Training Episode', position: 'insideBottom', offset: -5 }}
                  />
                  <YAxis 
                    stroke="#9ca3af"
                    label={{ value: 'Steps Taken', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke={getChartColor('steps')} 
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, stroke: getChartColor('steps'), strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>

            <TabsContent value="exploration" className="h-full mt-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={epsilonData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="episode" 
                    stroke="#9ca3af"
                    label={{ value: 'Training Episode', position: 'insideBottom', offset: -5 }}
                  />
                  <YAxis 
                    stroke="#9ca3af"
                    label={{ value: 'Exploration Rate (ε)', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke={getChartColor('exploration')} 
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, stroke: getChartColor('exploration'), strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
          </div>
        </Tabs>

        {episodeRewards.length > 0 && (
          <div className="mt-4 text-xs opacity-70 text-center">
            Total Episodes: {episodeRewards.length} | 
            Best Reward: {Math.max(...episodeRewards).toFixed(2)} | 
            Avg Steps: {(episodeSteps.reduce((a, b) => a + b, 0) / episodeSteps.length).toFixed(1)}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QLearningPlots;
