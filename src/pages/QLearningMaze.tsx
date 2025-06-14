import React, { useState, useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import QLearningVisualization from '@/components/QLearningVisualization';
import QLearningControls from '@/components/QLearningControls';
import QLearningEducation from '@/components/QLearningEducation';
import QLearningPlots from '@/components/QLearningPlots';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, BookOpen, Target, Zap, Trophy, Timer } from 'lucide-react';

interface MazeState {
  maze: number[][];
  qTable: number[][][];
  startPos: [number, number];
  goalPos: [number, number];
  episodeRewards: number[];
  episodeSteps: number[];
  episodeEpsilons: number[];
  currentEpisode: number;
  isTraining: boolean;
  showPath: boolean;
  path: [number, number][];
}

interface Parameters {
  alpha: number;
  gamma: number;
  epsilon: number;
  mazeSize: number;
  maxEpisodes: number;
  speed: 'slow' | 'medium' | 'fast';
}

const SPEEDS = {
  slow: { plotUpdate: 5, stepDelay: 200 },
  medium: { plotUpdate: 10, stepDelay: 50 },
  fast: { plotUpdate: 20, stepDelay: 10 }
};

const QLearningMaze = () => {
  const [state, setState] = useState<MazeState>(() => {
    const initialSize = 6;
    return {
      maze: Array(initialSize).fill(null).map(() => Array(initialSize).fill(0)),
      qTable: Array(initialSize).fill(null).map(() => 
        Array(initialSize).fill(null).map(() => Array(4).fill(0))
      ),
      startPos: [0, 0],
      goalPos: [initialSize - 1, initialSize - 1],
      episodeRewards: [],
      episodeSteps: [],
      episodeEpsilons: [],
      currentEpisode: 0,
      isTraining: false,
      showPath: false,
      path: []
    };
  });

  const [params, setParams] = useState<Parameters>({
    alpha: 0.3,
    gamma: 0.9,
    epsilon: 0.3,
    mazeSize: 6,
    maxEpisodes: 500,
    speed: 'medium'
  });

  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);

  const actions = [[-1, 0], [1, 0], [0, -1], [0, 1]];

  const isValidState = useCallback((pos: [number, number], maze: number[][]) => {
    const [x, y] = pos;
    return x >= 0 && x < maze.length && y >= 0 && y < maze[0].length && maze[x][y] === 0;
  }, []);

  const getValidActions = useCallback((pos: [number, number], maze: number[][]) => {
    const validActions: number[] = [];
    actions.forEach((action, index) => {
      const nextPos: [number, number] = [pos[0] + action[0], pos[1] + action[1]];
      if (isValidState(nextPos, maze)) {
        validActions.push(index);
      }
    });
    return validActions;
  }, [actions, isValidState]);

  const chooseAction = useCallback((pos: [number, number], qTable: number[][][], epsilon: number, maze: number[][]) => {
    const validActions = getValidActions(pos, maze);
    if (validActions.length === 0) return null;
    
    if (Math.random() < epsilon) {
      return validActions[Math.floor(Math.random() * validActions.length)];
    } else {
      const qValues = qTable[pos[0]][pos[1]];
      let bestAction = validActions[0];
      let bestValue = qValues[bestAction];
      
      validActions.forEach(action => {
        if (qValues[action] > bestValue) {
          bestValue = qValues[action];
          bestAction = action;
        }
      });
      
      return bestAction;
    }
  }, [getValidActions]);

  const getReward = useCallback((pos: [number, number], goalPos: [number, number]) => {
    return (pos[0] === goalPos[0] && pos[1] === goalPos[1]) ? 10 : -0.1;
  }, []);

  const trainEpisode = useCallback((currentState: MazeState, currentParams: Parameters) => {
    let pos = [...currentState.startPos] as [number, number];
    let totalReward = 0;
    let steps = 0;
    const maxSteps = 100;
    const newQTable = currentState.qTable.map(row => row.map(col => [...col]));

    while (steps < maxSteps && (pos[0] !== currentState.goalPos[0] || pos[1] !== currentState.goalPos[1])) {
      const action = chooseAction(pos, newQTable, currentParams.epsilon, currentState.maze);
      if (action === null) break;

      const nextPos: [number, number] = [pos[0] + actions[action][0], pos[1] + actions[action][1]];
      
      if (!isValidState(nextPos, currentState.maze)) {
        continue;
      }

      const reward = getReward(nextPos, currentState.goalPos);
      totalReward += reward;

      const currentQ = newQTable[pos[0]][pos[1]][action];
      const maxNextQ = pos[0] === currentState.goalPos[0] && pos[1] === currentState.goalPos[1] 
        ? 0 
        : Math.max(...newQTable[nextPos[0]][nextPos[1]]);
      
      const newQ = currentQ + currentParams.alpha * (reward + currentParams.gamma * maxNextQ - currentQ);
      newQTable[pos[0]][pos[1]][action] = newQ;

      pos = nextPos;
      steps++;
    }

    return { totalReward, steps, newQTable };
  }, [actions, chooseAction, isValidState, getReward]);

  const startTraining = useCallback(async () => {
    if (state.isTraining) return;
    
    setState(prev => ({ ...prev, isTraining: true, showPath: false }));
    toast.success(`Starting training for ${params.maxEpisodes} episodes!`);
    
    // Reset epsilon to initial value for each training session
    const initialEpsilon = params.epsilon;
    let currentState = { ...state, isTraining: true };
    const newRewards: number[] = [...state.episodeRewards];
    const newSteps: number[] = [...state.episodeSteps];
    const newEpsilons: number[] = [...state.episodeEpsilons];
    
    const startEpisode = state.currentEpisode;
    const endEpisode = startEpisode + params.maxEpisodes;
    const speed = SPEEDS[params.speed];
    
    for (let episode = startEpisode; episode < endEpisode; episode++) {
      if (!document.hasFocus()) {
        await new Promise(resolve => setTimeout(resolve, 100));
        continue;
      }
      
      // Reset epsilon decay for each new training session
      const sessionEpisode = episode - startEpisode;
      const currentEpsilon = Math.max(0.01, initialEpsilon * Math.pow(0.98, sessionEpisode));
      newEpsilons[episode] = currentEpsilon;
      
      const currentParams = { ...params, epsilon: currentEpsilon };
      const result = trainEpisode(currentState, currentParams);
      
      newRewards[episode] = result.totalReward;
      newSteps[episode] = result.steps;
      
      currentState = {
        ...currentState,
        qTable: result.newQTable,
        episodeRewards: [...newRewards],
        episodeSteps: [...newSteps],
        episodeEpsilons: [...newEpsilons],
        currentEpisode: episode + 1
      };
      
      if (episode % speed.plotUpdate === 0 || episode === endEpisode - 1) {
        setState(currentState);
        await new Promise(resolve => setTimeout(resolve, speed.stepDelay));
      }
    }
    
    setState(prev => ({ ...prev, isTraining: false }));
    toast.success(`Training session completed! ${params.maxEpisodes} episodes finished.`);
  }, [state, params, trainEpisode]);

  const findPath = useCallback(() => {
    const path: [number, number][] = [state.startPos];
    let pos = [...state.startPos] as [number, number];
    const visited = new Set<string>();
    const maxSteps = 50;
    let steps = 0;

    while (steps < maxSteps && 
           (pos[0] !== state.goalPos[0] || pos[1] !== state.goalPos[1])) {
      const posKey = `${pos[0]},${pos[1]}`;
      if (visited.has(posKey)) break;
      visited.add(posKey);

      const validActions = getValidActions(pos, state.maze);
      if (validActions.length === 0) break;

      const qValues = state.qTable[pos[0]][pos[1]];
      let bestAction = validActions[0];
      let bestValue = qValues[bestAction];

      validActions.forEach(action => {
        if (qValues[action] > bestValue) {
          bestValue = qValues[action];
          bestAction = action;
        }
      });

      const nextPos: [number, number] = [pos[0] + actions[bestAction][0], pos[1] + actions[bestAction][1]];
      if (isValidState(nextPos, state.maze)) {
        path.push(nextPos);
        pos = nextPos;
      } else {
        break;
      }
      steps++;
    }

    return path;
  }, [state, actions, getValidActions, isValidState]);

  const showOptimalPath = useCallback(() => {
    const path = findPath();
    setState(prev => ({ ...prev, showPath: true, path }));
    
    if (path.length > 1) {
      toast.success(`Optimal path found: ${path.length - 1} steps`);
    } else {
      toast.error("No path found!");
    }
  }, [findPath]);

  const resetAll = useCallback(() => {
    setState(prev => ({
      ...prev,
      qTable: Array(params.mazeSize).fill(null).map(() => 
        Array(params.mazeSize).fill(null).map(() => Array(4).fill(0))
      ),
      episodeRewards: [],
      episodeSteps: [],
      episodeEpsilons: [],
      currentEpisode: 0,
      isTraining: false,
      showPath: false,
      path: []
    }));
    
    setParams(prev => ({
      ...prev,
      alpha: 0.3,
      maxEpisodes: 500
    }));
    
    toast.info("Training progress and parameters reset (maze preserved)");
  }, [params.mazeSize]);

  const resetMaze = useCallback(() => {
    setState(prev => ({
      ...prev,
      maze: Array(params.mazeSize).fill(null).map(() => Array(params.mazeSize).fill(0)),
      startPos: [0, 0],
      goalPos: [params.mazeSize - 1, params.mazeSize - 1],
      showPath: false,
      path: []
    }));
    toast.info("Maze layout reset");
  }, [params.mazeSize]);

  const handleMazeClick = useCallback((row: number, col: number) => {
    setState(prev => {
      const newMaze = prev.maze.map(r => [...r]);
      newMaze[row][col] = 1 - newMaze[row][col];
      return { ...prev, maze: newMaze, showPath: false };
    });
  }, []);

  const handleMazeSizeChange = useCallback((newSize: number[]) => {
    const size = newSize[0];
    if (size === params.mazeSize) return;
    
    setParams(prev => ({ ...prev, mazeSize: size }));
    
    setState(prev => {
      const newMaze = Array(size).fill(null).map(() => Array(size).fill(0));
      const newQTable = Array(size).fill(null).map(() => 
        Array(size).fill(null).map(() => Array(4).fill(0))
      );
      
      const minSize = Math.min(prev.maze.length, size);
      for (let i = 0; i < minSize; i++) {
        for (let j = 0; j < minSize; j++) {
          newMaze[i][j] = prev.maze[i][j];
          newQTable[i][j] = [...prev.qTable[i][j]];
        }
      }
      
      return {
        ...prev,
        maze: newMaze,
        qTable: newQTable,
        startPos: [0, 0],
        goalPos: [size - 1, size - 1],
        episodeRewards: [],
        episodeSteps: [],
        episodeEpsilons: [],
        currentEpisode: 0,
        isTraining: false,
        showPath: false,
        path: []
      };
    });
  }, [params.mazeSize]);

  const totalWalls = useMemo(() => 
    state.maze.flat().filter(cell => cell === 1).length, 
    [state.maze]
  );

  const bestReward = useMemo(() => 
    state.episodeRewards.length > 0 ? Math.max(...state.episodeRewards) : undefined,
    [state.episodeRewards]
  );

  const avgSteps = useMemo(() => 
    state.episodeSteps.length > 0 
      ? state.episodeSteps.reduce((a, b) => a + b, 0) / state.episodeSteps.length
      : undefined,
    [state.episodeSteps]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-foreground antialiased overflow-x-hidden">

      <header className="w-full glass-panel border-b border-blue-500/20 mb-8 bg-gradient-to-r from-blue-900/30 to-purple-900/30">
        <div className="container py-6 px-4 md:px-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-light tracking-tight text-gradient">
              🧩 Q-Learning Maze Navigator
              <span className="text-sm ml-3 opacity-70 font-normal">
                🎯 Intelligent Pathfinding
              </span>
            </h1>
            <p className="text-sm opacity-70">Navigate the digital labyrinth with reinforcement learning</p>
          </div>
          <Link to="/" className="control-btn flex items-center gap-2 text-sm hover:bg-blue-500/20 border-blue-400/30">
            <ArrowLeft className="h-4 w-4" />
            Back to Visualizations
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="container px-4 md:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left column - Visualizations */}
          <div className="lg:col-span-3 space-y-6">
            {/* Maze Display */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg blur opacity-75"></div>
              <div className="relative">
                <QLearningVisualization
                  maze={state.maze}
                  qTable={state.qTable}
                  startPos={state.startPos}
                  goalPos={state.goalPos}
                  currentEpisode={state.currentEpisode}
                  isTraining={state.isTraining}
                  showPath={state.showPath}
                  path={state.path}
                  onMazeClick={handleMazeClick}
                />
              </div>
            </div>

            {/* Dynamic Plots */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-600/20 to-blue-600/20 rounded-lg blur opacity-75"></div>
              <div className="relative">
                <QLearningPlots
                  episodeRewards={state.episodeRewards}
                  episodeSteps={state.episodeSteps}
                  episodeEpsilons={state.episodeEpsilons}
                  isTraining={state.isTraining}
                />
              </div>
            </div>

            {/* Enhanced Training Status */}
            <Card className="glass-panel border-yellow-500/30 bg-gradient-to-r from-yellow-900/10 to-orange-900/10">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="h-5 w-5 text-yellow-400" />
                  🎯 Navigation Progress
                  {state.isTraining && <div className="animate-pulse text-green-400 text-sm ml-2">● LEARNING</div>}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-6 text-sm">
                  <div className="space-y-2 bg-blue-500/10 p-3 rounded-lg border border-blue-500/20">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-blue-400" />
                      <p className="text-xs opacity-70 font-medium">Current Episode</p>
                    </div>
                    <p className="font-bold text-lg text-blue-400">{state.currentEpisode}</p>
                  </div>
                  <div className="space-y-2 bg-purple-500/10 p-3 rounded-lg border border-purple-500/20">
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-purple-400" />
                      <p className="text-xs opacity-70 font-medium">Session Size</p>
                    </div>
                    <p className="font-bold text-lg text-purple-400">{params.maxEpisodes}</p>
                  </div>
                  <div className="space-y-2 bg-cyan-500/10 p-3 rounded-lg border border-cyan-500/20">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-cyan-400 rounded"></div>
                      <p className="text-xs opacity-70 font-medium">Maze Grid</p>
                    </div>
                    <p className="font-bold text-lg text-cyan-400">{params.mazeSize}×{params.mazeSize}</p>
                  </div>
                  <div className="space-y-2 bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-red-400 rounded"></div>
                      <p className="text-xs opacity-70 font-medium">Wall Blocks</p>
                    </div>
                    <p className="font-bold text-lg text-red-400">{totalWalls}</p>
                  </div>
                  {bestReward !== undefined && (
                    <div className="space-y-2 bg-green-500/10 p-3 rounded-lg border border-green-500/20">
                      <div className="flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-green-400" />
                        <p className="text-xs opacity-70 font-medium">Best Score</p>
                      </div>
                      <p className="font-bold text-lg text-green-400">{bestReward.toFixed(1)}</p>
                    </div>
                  )}
                  {avgSteps !== undefined && (
                    <div className="space-y-2 bg-orange-500/10 p-3 rounded-lg border border-orange-500/20">
                      <div className="flex items-center gap-2">
                        <Timer className="h-4 w-4 text-orange-400" />
                        <p className="text-xs opacity-70 font-medium">Avg Steps</p>
                      </div>
                      <p className="font-bold text-lg text-orange-400">{avgSteps.toFixed(1)}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Horizontal Instructions Dropdown */}
            <Card className="glass-panel border-indigo-500/30 bg-gradient-to-r from-indigo-900/10 to-blue-900/10">
              <Collapsible open={isInstructionsOpen} onOpenChange={setIsInstructionsOpen}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-accent/5 transition-colors">
                    <CardTitle className="text-lg flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-indigo-400" />
                        🗺️ Navigation Guide & Instructions
                      </div>
                      <ChevronDown className={`h-4 w-4 transition-transform ${isInstructionsOpen ? 'rotate-180' : ''}`} />
                    </CardTitle>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
                      <div className="bg-blue-500/10 p-4 rounded-lg border border-blue-500/20">
                        <h4 className="font-medium mb-3 text-base flex items-center gap-2">
                          🏗️ Maze Construction
                        </h4>
                        <ul className="text-xs space-y-2">
                          <li className="flex items-start gap-2">
                            <span className="text-blue-400">🖱️</span>
                            <span>Click maze cells to build/remove walls</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-green-400">🟢</span>
                            <span>Green circle (S) = Starting position</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-red-400">🔴</span>
                            <span>Red circle (G) = Goal destination</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-gray-400">⬛</span>
                            <span>Black cells = Wall obstacles</span>
                          </li>
                        </ul>
                      </div>

                      <div className="bg-green-500/10 p-4 rounded-lg border border-green-500/20">
                        <h4 className="font-medium mb-3 text-base flex items-center gap-2">
                          🎯 Training Process
                        </h4>
                        <ul className="text-xs space-y-2">
                          <li className="flex items-start gap-2">
                            <span className="text-blue-400">📊</span>
                            <span>Set episodes per session (100-2000)</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-green-400">⏩</span>
                            <span>Training continues from last episode</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-orange-400">🔄</span>
                            <span>Exploration rate resets each session</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-purple-400">⚡</span>
                            <span>Adjust speed for observation detail</span>
                          </li>
                        </ul>
                      </div>

                      <div className="bg-purple-500/10 p-4 rounded-lg border border-purple-500/20">
                        <h4 className="font-medium mb-3 text-base flex items-center gap-2">
                          🎨 Visual Elements
                        </h4>
                        <ul className="text-xs space-y-2">
                          <li className="flex items-start gap-2">
                            <span className="text-blue-400">➡️</span>
                            <span>Blue arrows show learned policy</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-yellow-400">🔥</span>
                            <span>Heatmap shows Q-value strength</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-yellow-400">🛤️</span>
                            <span>Yellow path shows optimal route</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-gray-400">📈</span>
                            <span>Charts track learning progress</span>
                          </li>
                        </ul>
                      </div>

                      <div className="bg-red-500/10 p-4 rounded-lg border border-red-500/20">
                        <h4 className="font-medium mb-3 text-base flex items-center gap-2">
                          🔄 Reset Options
                        </h4>
                        <ul className="text-xs space-y-2">
                          <li className="flex items-start gap-2">
                            <span className="text-red-400">🗑️</span>
                            <span>"RESET ALL" clears training & parameters</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-orange-400">🧱</span>
                            <span>"RESET MAZE" only clears wall layout</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-blue-400">🗺️</span>
                            <span>"SHOW PATH" displays optimal learned route</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-green-400">⚙️</span>
                            <span>Parameters adjustable during training</span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-accent/20">
                      <h4 className="font-medium mb-3 flex items-center gap-2">🧠 Algorithm Parameters:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                        <div className="bg-blue-500/10 p-3 rounded border border-blue-500/20">
                          <strong className="text-blue-400">Learning Rate (α):</strong> Controls how much new information overrides old. Higher = faster but less stable learning.
                        </div>
                        <div className="bg-green-500/10 p-3 rounded border border-green-500/20">
                          <strong className="text-green-400">Exploration Rate (ε):</strong> Probability of random actions. Resets each session and decays: ε × 0.98^episode.
                        </div>
                        <div className="bg-purple-500/10 p-3 rounded border border-purple-500/20">
                          <strong className="text-purple-400">Discount Factor (γ = 0.9):</strong> Importance of future rewards. Fixed to balance immediate vs long-term gains.
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          </div>

          {/* Right column - Controls */}
          <div className="space-y-6">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg blur opacity-75"></div>
              <div className="relative">
                <QLearningControls
                  isTraining={state.isTraining}
                  currentEpisode={state.currentEpisode}
                  maxEpisodes={params.maxEpisodes}
                  speed={params.speed}
                  mazeSize={params.mazeSize}
                  totalWalls={totalWalls}
                  bestReward={bestReward}
                  avgSteps={avgSteps}
                  alpha={params.alpha}
                  epsilon={params.epsilon}
                  onStartTraining={startTraining}
                  onShowPath={showOptimalPath}
                  onResetMaze={resetMaze}
                  onResetAll={resetAll}
                  onAlphaChange={(value) => setParams(prev => ({ ...prev, alpha: value[0] }))}
                  onEpsilonChange={(value) => setParams(prev => ({ ...prev, epsilon: value[0] }))}
                  onMazeSizeChange={handleMazeSizeChange}
                  onMaxEpisodesChange={(value) => setParams(prev => ({ ...prev, maxEpisodes: value }))}
                  onSpeedChange={(speed) => setParams(prev => ({ ...prev, speed }))}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Educational Content with Horizontal Tabs */}
        <div className="mt-6">
          <QLearningEducation />
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full glass-panel border-t border-blue-500/20 mt-auto bg-gradient-to-r from-slate-900/50 to-blue-900/50">
        <div className="container py-4 px-4 md:px-8 text-center">
          <p className="text-sm opacity-70">
            🧩 Navigate the maze of possibilities with intelligent Q-Learning algorithms
          </p>
        </div>
      </footer>
    </div>
  );
};

export default QLearningMaze;
