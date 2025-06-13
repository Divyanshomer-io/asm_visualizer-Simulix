
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Play, Square, RotateCcw, Route, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

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
  alpha: number;      // learning rate
  gamma: number;      // discount factor
  epsilon: number;    // exploration rate
  mazeSize: number;   // maze dimensions
}

const QLearningMaze = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heatmapCanvasRef = useRef<HTMLCanvasElement>(null);
  const rewardsCanvasRef = useRef<HTMLCanvasElement>(null);
  const stepsCanvasRef = useRef<HTMLCanvasElement>(null);
  const epsilonCanvasRef = useRef<HTMLCanvasElement>(null);
  
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
    mazeSize: 6
  });

  // Actions: up, down, left, right
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

      // Q-learning update
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

  const drawMaze = useCallback((canvas: HTMLCanvasElement, currentState: MazeState) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = Math.min(canvas.width, canvas.height) / currentState.maze.length;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid and maze
    currentState.maze.forEach((row, i) => {
      row.forEach((cell, j) => {
        const x = j * cellSize;
        const y = i * cellSize;

        // Draw cell background
        ctx.fillStyle = cell === 1 ? '#1a1a1a' : '#2a2a2a';
        ctx.fillRect(x, y, cellSize, cellSize);

        // Draw grid lines
        ctx.strokeStyle = '#404040';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, cellSize, cellSize);
      });
    });

    // Draw start position
    const startX = currentState.startPos[1] * cellSize + cellSize / 2;
    const startY = currentState.startPos[0] * cellSize + cellSize / 2;
    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.arc(startX, startY, cellSize * 0.3, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = 'white';
    ctx.font = `${cellSize * 0.3}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('S', startX, startY);

    // Draw goal position
    const goalX = currentState.goalPos[1] * cellSize + cellSize / 2;
    const goalY = currentState.goalPos[0] * cellSize + cellSize / 2;
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(goalX, goalY, cellSize * 0.3, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = 'white';
    ctx.fillText('G', goalX, goalY);

    // Draw policy arrows
    currentState.qTable.forEach((row, i) => {
      row.forEach((qValues, j) => {
        if (currentState.maze[i][j] === 0 && 
            (i !== currentState.goalPos[0] || j !== currentState.goalPos[1]) &&
            qValues.some(q => q !== 0)) {
          
          const maxQ = Math.max(...qValues);
          const bestAction = qValues.indexOf(maxQ);
          
          const centerX = j * cellSize + cellSize / 2;
          const centerY = i * cellSize + cellSize / 2;
          const [dy, dx] = actions[bestAction];
          
          const endX = centerX + dx * cellSize * 0.2;
          const endY = centerY + dy * cellSize * 0.2;
          
          ctx.strokeStyle = '#3b82f6';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(centerX, centerY);
          ctx.lineTo(endX, endY);
          ctx.stroke();
          
          // Arrow head
          const angle = Math.atan2(dy, dx);
          const headLength = cellSize * 0.08;
          ctx.beginPath();
          ctx.moveTo(endX, endY);
          ctx.lineTo(endX - headLength * Math.cos(angle - Math.PI / 6), 
                    endY - headLength * Math.sin(angle - Math.PI / 6));
          ctx.moveTo(endX, endY);
          ctx.lineTo(endX - headLength * Math.cos(angle + Math.PI / 6), 
                    endY - headLength * Math.sin(angle + Math.PI / 6));
          ctx.stroke();
        }
      });
    });

    // Draw path if showing
    if (currentState.showPath && currentState.path.length > 1) {
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(currentState.path[0][1] * cellSize + cellSize / 2, 
                currentState.path[0][0] * cellSize + cellSize / 2);
      
      currentState.path.slice(1).forEach(pos => {
        ctx.lineTo(pos[1] * cellSize + cellSize / 2, pos[0] * cellSize + cellSize / 2);
      });
      ctx.stroke();
      
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }, [actions]);

  const drawQValues = useCallback((canvas: HTMLCanvasElement, currentState: MazeState) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = Math.min(canvas.width, canvas.height) / currentState.maze.length;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Get max Q values for each cell
    const maxQValues = currentState.qTable.map(row => 
      row.map(qValues => Math.max(...qValues))
    );
    const globalMax = Math.max(...maxQValues.flat());
    const globalMin = Math.min(...maxQValues.flat());

    maxQValues.forEach((row, i) => {
      row.forEach((maxQ, j) => {
        const x = j * cellSize;
        const y = i * cellSize;
        
        // Color based on Q-value (viridis-like colormap)
        const normalized = globalMax > globalMin ? (maxQ - globalMin) / (globalMax - globalMin) : 0;
        const hue = 240 + normalized * 60; // Blue to green
        const saturation = 70;
        const lightness = 20 + normalized * 60;
        
        ctx.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        ctx.fillRect(x, y, cellSize, cellSize);
        
        // Draw value text
        ctx.fillStyle = normalized > 0.5 ? 'white' : 'black';
        ctx.font = `${cellSize * 0.2}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(maxQ.toFixed(1), x + cellSize / 2, y + cellSize / 2);
      });
    });
  }, []);

  const drawChart = useCallback((canvas: HTMLCanvasElement, data: number[], color: string, label: string) => {
    const ctx = canvas.getContext('2d');
    if (!ctx || data.length === 0) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const margin = 40;
    const width = canvas.width - 2 * margin;
    const height = canvas.height - 2 * margin;
    
    const minVal = Math.min(...data);
    const maxVal = Math.max(...data);
    const range = maxVal - minVal || 1;
    
    // Draw axes
    ctx.strokeStyle = '#404040';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(margin, margin);
    ctx.lineTo(margin, margin + height);
    ctx.lineTo(margin + width, margin + height);
    ctx.stroke();
    
    // Draw data
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    data.forEach((value, index) => {
      const x = margin + (index / (data.length - 1)) * width;
      const y = margin + height - ((value - minVal) / range) * height;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    ctx.stroke();
    
    // Draw title
    ctx.fillStyle = 'white';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(label, canvas.width / 2, 20);
  }, []);

  const findPath = useCallback((currentState: MazeState) => {
    const path: [number, number][] = [currentState.startPos];
    let pos = [...currentState.startPos] as [number, number];
    const visited = new Set<string>();
    const maxSteps = 50;
    let steps = 0;

    while (steps < maxSteps && 
           (pos[0] !== currentState.goalPos[0] || pos[1] !== currentState.goalPos[1])) {
      const posKey = `${pos[0]},${pos[1]}`;
      if (visited.has(posKey)) break;
      visited.add(posKey);

      const validActions = getValidActions(pos, currentState.maze);
      if (validActions.length === 0) break;

      const qValues = currentState.qTable[pos[0]][pos[1]];
      let bestAction = validActions[0];
      let bestValue = qValues[bestAction];

      validActions.forEach(action => {
        if (qValues[action] > bestValue) {
          bestValue = qValues[action];
          bestAction = action;
        }
      });

      const nextPos: [number, number] = [pos[0] + actions[bestAction][0], pos[1] + actions[bestAction][1]];
      if (isValidState(nextPos, currentState.maze)) {
        path.push(nextPos);
        pos = nextPos;
      } else {
        break;
      }
      steps++;
    }

    return path;
  }, [actions, getValidActions, isValidState]);

  // Canvas click handler for maze editing
  const handleMazeClick = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    if (state.isTraining) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const cellSize = Math.min(canvas.width, canvas.height) / state.maze.length;
    const col = Math.floor(x / cellSize);
    const row = Math.floor(y / cellSize);
    
    if (row >= 0 && row < state.maze.length && col >= 0 && col < state.maze[0].length) {
      if ((row !== state.startPos[0] || col !== state.startPos[1]) &&
          (row !== state.goalPos[0] || col !== state.goalPos[1])) {
        setState(prev => {
          const newMaze = prev.maze.map(r => [...r]);
          newMaze[row][col] = 1 - newMaze[row][col];
          return { ...prev, maze: newMaze, showPath: false };
        });
      }
    }
  }, [state.isTraining, state.maze.length, state.startPos, state.goalPos]);

  // Training function
  const startTraining = useCallback(async () => {
    if (state.isTraining) return;
    
    setState(prev => ({ ...prev, isTraining: true, showPath: false }));
    toast.success("Training started!");
    
    let currentState = { ...state };
    const newRewards: number[] = [];
    const newSteps: number[] = [];
    const newEpsilons: number[] = [];
    
    for (let episode = 0; episode < 200; episode++) {
      if (!currentState.isTraining) break;
      
      newEpsilons.push(params.epsilon);
      const result = trainEpisode(currentState, params);
      newRewards.push(result.totalReward);
      newSteps.push(result.steps);
      
      currentState = {
        ...currentState,
        qTable: result.newQTable,
        episodeRewards: newRewards,
        episodeSteps: newSteps,
        episodeEpsilons: newEpsilons,
        currentEpisode: episode + 1
      };
      
      if (episode % 10 === 0) {
        setState(currentState);
        await new Promise(resolve => setTimeout(resolve, 50));
      }
    }
    
    setState(prev => ({ ...prev, isTraining: false }));
    toast.success("Training completed!");
  }, [state, params, trainEpisode]);

  const showOptimalPath = useCallback(() => {
    const path = findPath(state);
    setState(prev => ({ ...prev, showPath: true, path }));
    
    if (path.length > 1) {
      toast.success(`Optimal path found: ${path.length - 1} steps`);
    } else {
      toast.error("No path found!");
    }
  }, [state, findPath]);

  const resetAll = useCallback(() => {
    setState(prev => ({
      ...prev,
      maze: Array(params.mazeSize).fill(null).map(() => Array(params.mazeSize).fill(0)),
      qTable: Array(params.mazeSize).fill(null).map(() => 
        Array(params.mazeSize).fill(null).map(() => Array(4).fill(0))
      ),
      startPos: [0, 0],
      goalPos: [params.mazeSize - 1, params.mazeSize - 1],
      episodeRewards: [],
      episodeSteps: [],
      episodeEpsilons: [],
      currentEpisode: 0,
      isTraining: false,
      showPath: false,
      path: []
    }));
    toast.info("Everything reset");
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
    toast.info("Maze reset");
  }, [params.mazeSize]);

  // Handle maze size change
  const handleMazeSizeChange = useCallback((newSize: number[]) => {
    const size = newSize[0];
    if (size === params.mazeSize) return;
    
    setParams(prev => ({ ...prev, mazeSize: size }));
    
    setState(prev => {
      const newMaze = Array(size).fill(null).map(() => Array(size).fill(0));
      const newQTable = Array(size).fill(null).map(() => 
        Array(size).fill(null).map(() => Array(4).fill(0))
      );
      
      // Copy old maze data where possible
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

  // Drawing effects
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      drawMaze(canvas, state);
    }
  }, [state.maze, state.qTable, state.showPath, state.path, drawMaze, state]);

  useEffect(() => {
    const canvas = heatmapCanvasRef.current;
    if (canvas) {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      drawQValues(canvas, state);
    }
  }, [state.qTable, drawQValues, state]);

  useEffect(() => {
    const canvas = rewardsCanvasRef.current;
    if (canvas && state.episodeRewards.length > 0) {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      drawChart(canvas, state.episodeRewards, '#3b82f6', 'Episode Rewards');
    }
  }, [state.episodeRewards, drawChart]);

  useEffect(() => {
    const canvas = stepsCanvasRef.current;
    if (canvas && state.episodeSteps.length > 0) {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      drawChart(canvas, state.episodeSteps, '#ef4444', 'Steps per Episode');
    }
  }, [state.episodeSteps, drawChart]);

  useEffect(() => {
    const canvas = epsilonCanvasRef.current;
    if (canvas && state.episodeEpsilons.length > 0) {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      drawChart(canvas, state.episodeEpsilons, '#22c55e', 'Exploration Rate (Epsilon)');
    }
  }, [state.episodeEpsilons, drawChart]);

  return (
    <div className="min-h-screen bg-background text-foreground antialiased overflow-x-hidden">
      {/* Header */}
      <header className="w-full glass-panel border-b border-white/5 mb-8">
        <div className="container py-6 px-4 md:px-8">
          <h1 className="text-2xl md:text-3xl font-light tracking-tight">
            Q-Learning Maze Solver
            <span className="text-sm ml-3 opacity-70 font-normal">
              Interactive Reinforcement Learning Visualization
            </span>
          </h1>
        </div>
      </header>

      {/* Main content */}
      <main className="container px-4 md:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Visualizations */}
          <div className="lg:col-span-2 space-y-6">
            {/* Top row - Maze and Q-values */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="glass-panel">
                <CardHeader>
                  <CardTitle className="text-lg">
                    Maze - {state.isTraining ? "TRAINING..." : "READY"} (Episode: {state.currentEpisode})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <canvas
                    ref={canvasRef}
                    className="w-full h-80 border border-white/10 rounded cursor-pointer"
                    onClick={handleMazeClick}
                  />
                  <p className="text-sm opacity-70 mt-2">
                    Click cells to add/remove walls
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-panel">
                <CardHeader>
                  <CardTitle className="text-lg">Q-Values Heatmap</CardTitle>
                </CardHeader>
                <CardContent>
                  <canvas
                    ref={heatmapCanvasRef}
                    className="w-full h-80 border border-white/10 rounded"
                  />
                </CardContent>
              </Card>
            </div>

            {/* Middle row - Rewards and Steps */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="glass-panel">
                <CardContent className="p-4">
                  <canvas
                    ref={rewardsCanvasRef}
                    className="w-full h-48 border border-white/10 rounded"
                  />
                </CardContent>
              </Card>

              <Card className="glass-panel">
                <CardContent className="p-4">
                  <canvas
                    ref={stepsCanvasRef}
                    className="w-full h-48 border border-white/10 rounded"
                  />
                </CardContent>
              </Card>
            </div>

            {/* Bottom row - Epsilon */}
            <Card className="glass-panel">
              <CardContent className="p-4">
                <canvas
                  ref={epsilonCanvasRef}
                  className="w-full h-48 border border-white/10 rounded"
                />
              </CardContent>
            </Card>
          </div>

          {/* Right column - Controls */}
          <div className="space-y-6">
            {/* Control Buttons */}
            <Card className="glass-panel">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={startTraining}
                  disabled={state.isTraining}
                  className="w-full control-btn-primary"
                >
                  <Play className="h-4 w-4" />
                  {state.isTraining ? "TRAINING..." : "START TRAINING"}
                </Button>

                <Button
                  onClick={showOptimalPath}
                  disabled={state.isTraining}
                  className="w-full control-btn"
                >
                  <Route className="h-4 w-4" />
                  SHOW PATH
                </Button>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={resetMaze}
                    disabled={state.isTraining}
                    className="control-btn"
                  >
                    <RotateCcw className="h-4 w-4" />
                    RESET MAZE
                  </Button>

                  <Button
                    onClick={resetAll}
                    disabled={state.isTraining}
                    className="control-btn-secondary"
                  >
                    <Square className="h-4 w-4" />
                    RESET ALL
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Parameters */}
            <Card className="glass-panel">
              <CardHeader>
                <CardTitle className="text-lg">Parameters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Learning Rate (α): {params.alpha.toFixed(2)}
                  </label>
                  <Slider
                    value={[params.alpha]}
                    onValueChange={(value) => setParams(prev => ({ ...prev, alpha: value[0] }))}
                    min={0.1}
                    max={1.0}
                    step={0.1}
                    className="w-full"
                    disabled={state.isTraining}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Exploration Rate (ε): {params.epsilon.toFixed(2)}
                  </label>
                  <Slider
                    value={[params.epsilon]}
                    onValueChange={(value) => setParams(prev => ({ ...prev, epsilon: value[0] }))}
                    min={0.0}
                    max={1.0}
                    step={0.1}
                    className="w-full"
                    disabled={state.isTraining}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Maze Size: {params.mazeSize}x{params.mazeSize}
                  </label>
                  <Slider
                    value={[params.mazeSize]}
                    onValueChange={handleMazeSizeChange}
                    min={5}
                    max={10}
                    step={1}
                    className="w-full"
                    disabled={state.isTraining}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Info Panel */}
            <Card className="glass-panel">
              <CardHeader>
                <CardTitle className="text-lg">Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="space-y-1">
                  <p><strong>Current Episode:</strong> {state.currentEpisode}</p>
                  <p><strong>Maze Size:</strong> {params.mazeSize}×{params.mazeSize}</p>
                  <p><strong>Total Walls:</strong> {state.maze.flat().filter(cell => cell === 1).length}</p>
                </div>
                
                {state.episodeRewards.length > 0 && (
                  <div className="space-y-1">
                    <p><strong>Best Reward:</strong> {Math.max(...state.episodeRewards).toFixed(1)}</p>
                    <p><strong>Avg Steps:</strong> {(state.episodeSteps.reduce((a, b) => a + b, 0) / state.episodeSteps.length).toFixed(1)}</p>
                  </div>
                )}

                <div className="pt-2 border-t border-white/10">
                  <h4 className="font-medium mb-2">Instructions:</h4>
                  <ul className="text-xs space-y-1 opacity-80">
                    <li>• Click maze cells to add/remove walls</li>
                    <li>• Use sliders to adjust parameters</li>
                    <li>• Green circle (S) = Start position</li>
                    <li>• Red circle (G) = Goal position</li>
                    <li>• Blue arrows show learned policy</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full glass-panel border-t border-white/5 mt-auto">
        <div className="container py-4 px-4 md:px-8 text-center">
          <p className="text-sm opacity-70">
            Interactive Q-Learning algorithm visualization for solving maze navigation
          </p>
        </div>
      </footer>
    </div>
  );
};

export default QLearningMaze;
