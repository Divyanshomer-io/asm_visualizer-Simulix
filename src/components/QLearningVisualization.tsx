
import React, { useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface QLearningVisualizationProps {
  maze: number[][];
  qTable: number[][][];
  startPos: [number, number];
  goalPos: [number, number];
  currentEpisode: number;
  isTraining: boolean;
  showPath: boolean;
  path: [number, number][];
  onMazeClick: (row: number, col: number) => void;
}

const QLearningVisualization: React.FC<QLearningVisualizationProps> = ({
  maze,
  qTable,
  startPos,
  goalPos,
  currentEpisode,
  isTraining,
  showPath,
  path,
  onMazeClick
}) => {
  const mazeCanvasRef = useRef<HTMLCanvasElement>(null);
  const heatmapCanvasRef = useRef<HTMLCanvasElement>(null);

  const actions = [[-1, 0], [1, 0], [0, -1], [0, 1]];

  const drawMaze = useCallback((canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = Math.min(canvas.width, canvas.height) / maze.length;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid and maze
    maze.forEach((row, i) => {
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
    const startX = startPos[1] * cellSize + cellSize / 2;
    const startY = startPos[0] * cellSize + cellSize / 2;
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
    const goalX = goalPos[1] * cellSize + cellSize / 2;
    const goalY = goalPos[0] * cellSize + cellSize / 2;
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(goalX, goalY, cellSize * 0.3, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = 'white';
    ctx.fillText('G', goalX, goalY);

    // Draw policy arrows
    qTable.forEach((row, i) => {
      row.forEach((qValues, j) => {
        if (maze[i][j] === 0 && 
            (i !== goalPos[0] || j !== goalPos[1]) &&
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
    if (showPath && path.length > 1) {
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(path[0][1] * cellSize + cellSize / 2, 
                path[0][0] * cellSize + cellSize / 2);
      
      path.slice(1).forEach(pos => {
        ctx.lineTo(pos[1] * cellSize + cellSize / 2, pos[0] * cellSize + cellSize / 2);
      });
      ctx.stroke();
      
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }, [maze, qTable, startPos, goalPos, showPath, path, actions]);

  const drawQValues = useCallback((canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = Math.min(canvas.width, canvas.height) / maze.length;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Get max Q values for each cell
    const maxQValues = qTable.map(row => 
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
  }, [maze, qTable]);

  const handleMazeClick = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    if (isTraining) return;
    
    const canvas = mazeCanvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const cellSize = Math.min(canvas.width, canvas.height) / maze.length;
    const col = Math.floor(x / cellSize);
    const row = Math.floor(y / cellSize);
    
    if (row >= 0 && row < maze.length && col >= 0 && col < maze[0].length) {
      if ((row !== startPos[0] || col !== startPos[1]) &&
          (row !== goalPos[0] || col !== goalPos[1])) {
        onMazeClick(row, col);
      }
    }
  }, [isTraining, maze.length, startPos, goalPos, onMazeClick]);

  // Canvas drawing effects
  useEffect(() => {
    const canvas = mazeCanvasRef.current;
    if (canvas) {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      drawMaze(canvas);
    }
  }, [maze, qTable, showPath, path, drawMaze]);

  useEffect(() => {
    const canvas = heatmapCanvasRef.current;
    if (canvas) {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      drawQValues(canvas);
    }
  }, [qTable, drawQValues]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="glass-panel">
        <CardHeader>
          <CardTitle className="text-lg">
            Maze - {isTraining ? "TRAINING..." : "READY"} (Episode: {currentEpisode})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <canvas
            ref={mazeCanvasRef}
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
          <p className="text-sm opacity-70 mt-2">
            Darker = Lower Q-values, Brighter = Higher Q-values
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default QLearningVisualization;
