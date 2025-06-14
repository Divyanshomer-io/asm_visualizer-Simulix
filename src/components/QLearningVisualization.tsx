import React, { useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import InfoTooltip from './InfoTooltip';

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

    // Create gradient backgrounds for more visual appeal
    const wallGradient = ctx.createLinearGradient(0, 0, cellSize, cellSize);
    wallGradient.addColorStop(0, '#1a1a2e');
    wallGradient.addColorStop(1, '#16213e');

    const floorGradient = ctx.createLinearGradient(0, 0, cellSize, cellSize);
    floorGradient.addColorStop(0, '#2d3748');
    floorGradient.addColorStop(1, '#1a202c');

    // Draw grid and maze with enhanced styling
    maze.forEach((row, i) => {
      row.forEach((cell, j) => {
        const x = j * cellSize;
        const y = i * cellSize;

        // Enhanced cell backgrounds
        if (cell === 1) {
          // Wall styling with gradient and shadow effect
          ctx.fillStyle = wallGradient;
          ctx.fillRect(x, y, cellSize, cellSize);
          
          // Add inner shadow effect for walls
          ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
          ctx.fillRect(x + 1, y + 1, cellSize - 2, cellSize - 2);
          
          // Add subtle highlight on walls
          ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
          ctx.fillRect(x, y, cellSize, 2);
          ctx.fillRect(x, y, 2, cellSize);
        } else {
          // Floor styling with subtle gradient
          ctx.fillStyle = floorGradient;
          ctx.fillRect(x, y, cellSize, cellSize);
        }

        // Enhanced grid lines with glow effect
        ctx.strokeStyle = cell === 1 ? '#4a5568' : '#2d3748';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, cellSize, cellSize);
        
        // Add subtle inner glow for floor cells
        if (cell === 0) {
          ctx.strokeStyle = 'rgba(99, 179, 237, 0.1)';
          ctx.lineWidth = 0.5;
          ctx.strokeRect(x + 1, y + 1, cellSize - 2, cellSize - 2);
        }
      });
    });

    // Enhanced start position with glow effect
    const startX = startPos[1] * cellSize + cellSize / 2;
    const startY = startPos[0] * cellSize + cellSize / 2;
    
    // Start position glow
    const startGlow = ctx.createRadialGradient(startX, startY, 0, startX, startY, cellSize * 0.5);
    startGlow.addColorStop(0, 'rgba(34, 197, 94, 0.3)');
    startGlow.addColorStop(1, 'rgba(34, 197, 94, 0)');
    ctx.fillStyle = startGlow;
    ctx.fillRect(startX - cellSize * 0.5, startY - cellSize * 0.5, cellSize, cellSize);
    
    // Start position circle with enhanced styling
    ctx.fillStyle = '#22c55e';
    ctx.shadowColor = '#22c55e';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(startX, startY, cellSize * 0.3, 0, 2 * Math.PI);
    ctx.fill();
    ctx.shadowBlur = 0;
    
    // Start position border
    ctx.strokeStyle = '#16a34a';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Start position text
    ctx.fillStyle = 'white';
    ctx.font = `bold ${cellSize * 0.25}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('S', startX, startY);

    // Enhanced goal position with glow effect
    const goalX = goalPos[1] * cellSize + cellSize / 2;
    const goalY = goalPos[0] * cellSize + cellSize / 2;
    
    // Goal position glow
    const goalGlow = ctx.createRadialGradient(goalX, goalY, 0, goalX, goalY, cellSize * 0.5);
    goalGlow.addColorStop(0, 'rgba(239, 68, 68, 0.3)');
    goalGlow.addColorStop(1, 'rgba(239, 68, 68, 0)');
    ctx.fillStyle = goalGlow;
    ctx.fillRect(goalX - cellSize * 0.5, goalY - cellSize * 0.5, cellSize, cellSize);
    
    // Goal position circle with enhanced styling
    ctx.fillStyle = '#ef4444';
    ctx.shadowColor = '#ef4444';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(goalX, goalY, cellSize * 0.3, 0, 2 * Math.PI);
    ctx.fill();
    ctx.shadowBlur = 0;
    
    // Goal position border
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Goal position text
    ctx.fillStyle = 'white';
    ctx.fillText('G', goalX, goalY);

    // Enhanced policy arrows with glow effects
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
          
          const endX = centerX + dx * cellSize * 0.25;
          const endY = centerY + dy * cellSize * 0.25;
          
          // Arrow glow effect
          ctx.strokeStyle = 'rgba(59, 130, 246, 0.3)';
          ctx.lineWidth = 6;
          ctx.beginPath();
          ctx.moveTo(centerX, centerY);
          ctx.lineTo(endX, endY);
          ctx.stroke();
          
          // Main arrow
          ctx.strokeStyle = '#3b82f6';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(centerX, centerY);
          ctx.lineTo(endX, endY);
          ctx.stroke();
          
          // Enhanced arrow head
          const angle = Math.atan2(dy, dx);
          const headLength = cellSize * 0.1;
          ctx.lineWidth = 2;
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

    // Enhanced path visualization
    if (showPath && path.length > 1) {
      // Path glow effect
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.4)';
      ctx.lineWidth = 8;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(path[0][1] * cellSize + cellSize / 2, 
                path[0][0] * cellSize + cellSize / 2);
      
      path.slice(1).forEach(pos => {
        ctx.lineTo(pos[1] * cellSize + cellSize / 2, pos[0] * cellSize + cellSize / 2);
      });
      ctx.stroke();
      
      // Main path
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(path[0][1] * cellSize + cellSize / 2, 
                path[0][0] * cellSize + cellSize / 2);
      
      path.slice(1).forEach(pos => {
        ctx.lineTo(pos[1] * cellSize + cellSize / 2, pos[0] * cellSize + cellSize / 2);
      });
      ctx.stroke();
      
      // Path highlights
      ctx.strokeStyle = '#f59e0b';
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
        
        // Enhanced heatmap with better color transitions
        const normalized = globalMax > globalMin ? (maxQ - globalMin) / (globalMax - globalMin) : 0;
        
        // Create a more sophisticated color scheme
        let r, g, b;
        if (normalized < 0.5) {
          // Dark blue to cyan transition
          r = Math.floor(20 + normalized * 2 * 40);
          g = Math.floor(30 + normalized * 2 * 100);
          b = Math.floor(60 + normalized * 2 * 140);
        } else {
          // Cyan to bright green transition
          const t = (normalized - 0.5) * 2;
          r = Math.floor(60 - t * 20);
          g = Math.floor(130 + t * 100);
          b = Math.floor(200 - t * 160);
        }
        
        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        ctx.fillRect(x, y, cellSize, cellSize);
        
        // Add subtle gradient overlay for depth
        const gradient = ctx.createLinearGradient(x, y, x + cellSize, y + cellSize);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${normalized * 0.1})`);
        gradient.addColorStop(1, `rgba(0, 0, 0, ${(1 - normalized) * 0.1})`);
        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, cellSize, cellSize);
        
        // Enhanced value text with better contrast
        const textColor = normalized > 0.6 ? 'white' : normalized > 0.3 ? '#e2e8f0' : '#cbd5e1';
        ctx.fillStyle = textColor;
        ctx.font = `bold ${cellSize * 0.18}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Add text shadow for better readability
        ctx.strokeStyle = normalized > 0.5 ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.strokeText(maxQ.toFixed(1), x + cellSize / 2, y + cellSize / 2);
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
      <Card className="glass-panel overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-b border-white/10">
          <CardTitle className="text-lg flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-400 to-blue-500 animate-pulse"></div>
            Interactive Maze
            <InfoTooltip content="<b>Interactive Maze:</b><br>• Click cells to add/remove walls<br>• Green circle = Start position<br>• Red circle = Goal position<br>• Blue arrows show learned policy<br>• Yellow path shows optimal route" />
            <span className="text-sm font-normal opacity-70 ml-auto">
              {isTraining ? `Training Episode ${currentEpisode}` : "Ready to Train"}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="relative">
            <canvas
              ref={mazeCanvasRef}
              className="w-full h-80 border border-white/20 rounded-lg cursor-pointer bg-gradient-to-br from-slate-800 to-slate-900 shadow-2xl"
              onClick={handleMazeClick}
            />
          </div>
          <p className="text-sm opacity-70 mt-3 text-center">
            🎯 Click cells to add/remove walls • 🤖 Blue arrows show learned policy
          </p>
        </CardContent>
      </Card>

      <Card className="glass-panel overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-cyan-500/10 to-green-500/10 border-b border-white/10">
          <CardTitle className="text-lg flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-cyan-400 to-green-500"></div>
            Q-Values Heatmap
            <InfoTooltip content="<b>Q-Values Explained:</b><br>• Color intensity shows expected rewards<br>• Darker = Lower Q-values (worse states)<br>• Brighter = Higher Q-values (better states)<br>• Updated via Q-learning rule: Q(s,a) ← Q(s,a) + α[r + γmax Q(s',a') - Q(s,a)]" />
            <span className="text-sm font-normal opacity-70 ml-auto">Learning Progress</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="relative">
            <canvas
              ref={heatmapCanvasRef}
              className="w-full h-80 border border-white/20 rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 shadow-2xl"
            />
          </div>
          <p className="text-sm opacity-70 mt-3 text-center">
            Darker = Lower Q-values, Brighter = Higher Q-values
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default QLearningVisualization;
