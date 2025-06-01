
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  RotateCcw, 
  Info, 
  Target, 
  Brain,
  TrendingUp,
  BarChart3,
  Activity,
  Zap
} from 'lucide-react';
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
import DeepRLControls from '@/components/DeepRLControls';
import DeepRLVisualization from '@/components/DeepRLVisualization';
import DeepRLEducation from '@/components/DeepRLEducation';

export interface DeepRLParams {
  epsilon: number;
  learningRate: number;
  gamma: number;
  batchSize: number;
  memorySize: number;
  epsilonDecay: number;
  networkSize: number;
  updateFrequency: 'Slow' | 'Normal' | 'Fast';
}

export interface DeepRLState {
  episodeRewards: number[];
  movingAvg: number[];
  epsilonHistory: number[];
  lossHistory: number[];
  qValues: [number, number];
  weightsData: number[][];
  isTraining: boolean;
  episodeCount: number;
  currentParams: DeepRLParams;
}

const DeepRL: React.FC = () => {
  const [params, setParams] = useState<DeepRLParams>({
    epsilon: 1.0,
    learningRate: 0.001,
    gamma: 0.95,
    batchSize: 32,
    memorySize: 2000,
    epsilonDecay: 0.995,
    networkSize: 24,
    updateFrequency: 'Normal'
  });

  const [state, setState] = useState<DeepRLState>({
    episodeRewards: [],
    movingAvg: [],
    epsilonHistory: [],
    lossHistory: [],
    qValues: [0, 0],
    weightsData: Array.from({ length: 4 }, () => 
      Array.from({ length: 24 }, () => Math.random() * 2 - 1)
    ),
    isTraining: false,
    episodeCount: 0,
    currentParams: params
  });

  const [trainingInterval, setTrainingInterval] = useState<NodeJS.Timeout | null>(null);

  // Training simulation
  const simulateTrainingStep = useCallback(() => {
    setState(prevState => {
      // Simulate episode completion
      const episodeReward = Math.floor(Math.random() * 150) + 50;
      const newEpisodeRewards = [...prevState.episodeRewards, episodeReward];
      
      // Calculate moving average
      const newMovingAvg = [...prevState.movingAvg];
      if (newEpisodeRewards.length >= 10) {
        const avg = newEpisodeRewards.slice(-10).reduce((a, b) => a + b, 0) / 10;
        newMovingAvg.push(avg);
      } else {
        newMovingAvg.push(episodeReward);
      }

      // Update epsilon with decay
      const newEpsilon = Math.max(0.01, prevState.currentParams.epsilon * prevState.currentParams.epsilonDecay);
      const newEpsilonHistory = [...prevState.epsilonHistory, newEpsilon];

      // Simulate training loss
      const newLoss = Math.random() * 0.1 + 0.01;
      const newLossHistory = [...prevState.lossHistory, newLoss];

      // Update Q-values (simulate network predictions)
      const newQValues: [number, number] = [
        Math.random() * 4 - 2,
        Math.random() * 4 - 2
      ];

      // Update weights periodically
      let newWeightsData = prevState.weightsData;
      if (prevState.episodeCount % 10 === 0) {
        newWeightsData = Array.from({ length: 4 }, () => 
          Array.from({ length: prevState.currentParams.networkSize }, () => Math.random() * 2 - 1)
        );
      }

      // Limit array sizes to prevent memory issues
      const maxLength = 500;
      const limitedRewards = newEpisodeRewards.slice(-maxLength);
      const limitedMovingAvg = newMovingAvg.slice(-maxLength);
      const limitedEpsilonHistory = newEpsilonHistory.slice(-maxLength);
      const limitedLossHistory = newLossHistory.slice(-maxLength);

      return {
        ...prevState,
        episodeRewards: limitedRewards,
        movingAvg: limitedMovingAvg,
        epsilonHistory: limitedEpsilonHistory,
        lossHistory: limitedLossHistory,
        qValues: newQValues,
        weightsData: newWeightsData,
        episodeCount: prevState.episodeCount + 1,
        currentParams: { ...prevState.currentParams, epsilon: newEpsilon }
      };
    });
  }, []);

  // Start training
  const handleStartTraining = useCallback(() => {
    if (state.isTraining) return;

    setState(prev => ({ ...prev, isTraining: true, currentParams: params }));
    
    const getInterval = () => {
      switch (params.updateFrequency) {
        case 'Slow': return 300;
        case 'Fast': return 100;
        default: return 200;
      }
    };

    const interval = setInterval(simulateTrainingStep, getInterval());
    setTrainingInterval(interval);
    toast.success('Training started! Watch the agent learn through trial and error.');
  }, [params, state.isTraining, simulateTrainingStep]);

  // Stop training
  const handleStopTraining = useCallback(() => {
    if (!state.isTraining) return;

    setState(prev => ({ ...prev, isTraining: false }));
    
    if (trainingInterval) {
      clearInterval(trainingInterval);
      setTrainingInterval(null);
    }
    toast.info('Training paused. Click Start to resume.');
  }, [state.isTraining, trainingInterval]);

  // Reset training
  const handleReset = useCallback(() => {
    handleStopTraining();
    
    setState({
      episodeRewards: [],
      movingAvg: [],
      epsilonHistory: [],
      lossHistory: [],
      qValues: [0, 0],
      weightsData: Array.from({ length: 4 }, () => 
        Array.from({ length: params.networkSize }, () => Math.random() * 2 - 1)
      ),
      isTraining: false,
      episodeCount: 0,
      currentParams: { ...params, epsilon: 1.0 }
    });

    setParams(prev => ({ ...prev, epsilon: 1.0 }));
    toast.success('Training reset to initial state.');
  }, [handleStopTraining, params.networkSize]);

  // Update parameters
  const handleParamsChange = useCallback((newParams: DeepRLParams) => {
    setParams(newParams);
    
    // Update weights data if network size changed
    if (newParams.networkSize !== params.networkSize) {
      setState(prev => ({
        ...prev,
        weightsData: Array.from({ length: 4 }, () => 
          Array.from({ length: newParams.networkSize }, () => Math.random() * 2 - 1)
        )
      }));
    }
  }, [params.networkSize]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (trainingInterval) {
        clearInterval(trainingInterval);
      }
    };
  }, [trainingInterval]);

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background text-foreground antialiased">
        {/* Header */}
        <header className="w-full glass-panel border-b border-white/5 mb-8">
          <div className="container py-6 px-4 md:px-8 flex justify-between items-center">
            <div>
              <h1 className="text-2xl md:text-3xl font-light tracking-tight">
                Deep Reinforcement Learning
                <span className="text-sm ml-3 opacity-70 font-normal">
                  Interactive Dashboard
                </span>
              </h1>
              <p className="text-sm opacity-70">
                Q-Learning with Neural Networks and Experience Replay
              </p>
            </div>
            <Link to="/" className="control-btn flex items-center gap-2 text-sm">
              <ArrowLeft className="h-4 w-4" />
              Back to Visualizations
            </Link>
          </div>
        </header>

        {/* Hero Section */}
        <section className="container px-4 md:px-8 mb-8">
          <div className="text-center mb-8">
            <h2 className="text-xl font-light mb-4">
              Watch AI Agents Learn Through Trial and Error
            </h2>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              Experiment with Deep Q-Networks (DQN) hyperparameters and observe how artificial agents balance 
              <strong className="text-accent"> exploration vs exploitation</strong> to master decision-making tasks. 
              See neural network weights evolve in real-time as the agent learns optimal strategies.
            </p>
          </div>

          {/* Key Concepts */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="glass-panel p-4 rounded-lg text-center">
              <Target className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <h3 className="font-medium mb-1">Q-Learning</h3>
              <p className="text-sm text-muted-foreground">
                Agent learns Q(state, action) values representing expected future rewards
              </p>
            </div>
            <div className="glass-panel p-4 rounded-lg text-center">
              <Activity className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <h3 className="font-medium mb-1">Experience Replay</h3>
              <p className="text-sm text-muted-foreground">
                Training on random samples from memory buffer breaks correlation
              </p>
            </div>
            <div className="glass-panel p-4 rounded-lg text-center">
              <Zap className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
              <h3 className="font-medium mb-1">ε-Greedy Strategy</h3>
              <p className="text-sm text-muted-foreground">
                Balance between exploring new actions and exploiting known good ones
              </p>
            </div>
          </div>
        </section>

        {/* Main Dashboard */}
        <main className="container px-4 md:px-8 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Visualization Grid - Left Side (3/4 width) */}
            <div className="lg:col-span-3 space-y-6">
              <DeepRLVisualization state={state} params={params} />
              
              {/* Live Statistics */}
              <Card className="glass-panel border-white/10">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-accent" />
                    Live Training Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">
                        {state.episodeCount}
                      </div>
                      <div className="text-sm text-muted-foreground">Episodes</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">
                        {state.episodeRewards.length > 0 
                          ? (state.episodeRewards.slice(-10).reduce((a, b) => a + b, 0) / Math.min(10, state.episodeRewards.length)).toFixed(1)
                          : '0.0'
                        }
                      </div>
                      <div className="text-sm text-muted-foreground">Avg Reward (10)</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-400">
                        {state.currentParams.epsilon.toFixed(3)}
                      </div>
                      <div className="text-sm text-muted-foreground">Exploration Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400">
                        {Math.min(state.episodeCount * 5, state.currentParams.memorySize)}/{state.currentParams.memorySize}
                      </div>
                      <div className="text-sm text-muted-foreground">Memory Buffer</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Control Panel - Right Side (1/4 width) */}
            <div className="lg:col-span-1">
              <DeepRLControls
                params={params}
                onParamsChange={handleParamsChange}
                isTraining={state.isTraining}
                onStartTraining={handleStartTraining}
                onStopTraining={handleStopTraining}
                onReset={handleReset}
              />
            </div>
          </div>
        </main>

        {/* Educational Content */}
        <DeepRLEducation />

        {/* Footer */}
        <footer className="w-full glass-panel border-t border-white/5 mt-auto">
          <div className="container py-4 px-4 md:px-8 text-center">
            <p className="text-sm opacity-70">
              <span className="inline-block">Applied Statistical Mathematics • Interactive Visualizations</span>
              <span className="mx-2">•</span>
              <span className="inline-block">BITS Pilani, K.K. Birla Goa Campus</span>
            </p>
          </div>
        </footer>
      </div>
    </TooltipProvider>
  );
};

export default DeepRL;
