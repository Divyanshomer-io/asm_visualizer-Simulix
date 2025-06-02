
import React, { useRef, useEffect, useState, useMemo } from "react";
import { CityCanvasProps } from "@/utils/types";

const CityCanvas: React.FC<CityCanvasProps> = ({ state, onAddCity }) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  
  useEffect(() => {
    const updateCanvasSize = () => {
      if (canvasRef.current) {
        const { width, height } = canvasRef.current.getBoundingClientRect();
        setCanvasSize({ width, height });
      }
    };
    
    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);
    return () => window.removeEventListener("resize", updateCanvasSize);
  }, []);
  
  const handleCanvasClick = (e: React.MouseEvent) => {
    console.log('Canvas clicked, isRunning:', state.isRunning);
    
    if (canvasRef.current && !state.isRunning) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      
      console.log('Calling onAddCity with coordinates:', x, y);
      onAddCity(x, y);
    }
  };
  
  const toPixels = (coord: number, dimension: 'width' | 'height') => {
    return coord * canvasSize[dimension];
  };
  
  // Memoized grid to prevent unnecessary re-renders
  const gridLines = useMemo(() => {
    if (canvasSize.width === 0 || canvasSize.height === 0) return [];
    
    const lines = [];
    const spacing = 0.1; // 10% of canvas
    
    for (let x = 0; x <= 1; x += spacing) {
      lines.push(
        <line
          key={`vline-${x}`}
          x1={toPixels(x, 'width')}
          y1={0}
          x2={toPixels(x, 'width')}
          y2={canvasSize.height}
          stroke="currentColor"
          strokeOpacity={0.3}
          strokeWidth={1}
        />
      );
    }
    
    for (let y = 0; y <= 1; y += spacing) {
      lines.push(
        <line
          key={`hline-${y}`}
          x1={0}
          y1={toPixels(y, 'height')}
          x2={canvasSize.width}
          y2={toPixels(y, 'height')}
          stroke="currentColor"
          strokeOpacity={0.3}
          strokeWidth={1}
        />
      );
    }
    
    return lines;
  }, [canvasSize.width, canvasSize.height]);

  // Memoized paths to prevent unnecessary re-renders
  const pathElements = useMemo(() => {
    if (state.cities.length < 2 || canvasSize.width === 0 || canvasSize.height === 0) return null;
    
    const elements = [];
    
    // Current path
    if (state.currentPath.length > 0 && state.cities[0]) {
      const startX = toPixels(state.cities[0].x, 'width');
      const startY = toPixels(state.cities[0].y, 'height');
      let currentPathData = `M ${startX} ${startY}`;
      
      for (const cityIndex of state.currentPath) {
        const city = state.cities[cityIndex];
        if (city) {
          const x = toPixels(city.x, 'width');
          const y = toPixels(city.y, 'height');
          currentPathData += ` L ${x} ${y}`;
        }
      }
      currentPathData += ` L ${startX} ${startY}`;
      
      elements.push(
        <path 
          key="current-path"
          d={currentPathData} 
          fill="none"
          stroke="#3b82f6"
          strokeWidth={2}
          opacity={1}
        />
      );
    }
    
    // Best path
    if (state.bestPath.length > 0 && state.cities[0]) {
      const startX = toPixels(state.cities[0].x, 'width');
      const startY = toPixels(state.cities[0].y, 'height');
      let bestPathData = `M ${startX} ${startY}`;
      
      for (const cityIndex of state.bestPath) {
        const city = state.cities[cityIndex];
        if (city) {
          const x = toPixels(city.x, 'width');
          const y = toPixels(city.y, 'height');
          bestPathData += ` L ${x} ${y}`;
        }
      }
      bestPathData += ` L ${startX} ${startY}`;
      
      elements.push(
        <path 
          key="best-path"
          d={bestPathData} 
          fill="none"
          stroke="#10b981"
          strokeWidth={3}
          opacity={0.8}
          strokeDasharray={state.isRunning ? "5,5" : "none"}
        />
      );
    }
    
    return elements;
  }, [state.currentPath, state.bestPath, state.cities, state.isRunning, canvasSize.width, canvasSize.height]);
  
  // Memoized cities to prevent unnecessary re-renders
  const cityElements = useMemo(() => {
    if (canvasSize.width === 0 || canvasSize.height === 0) return [];
    
    return state.cities.map((city, index) => {
      const x = toPixels(city.x, 'width');
      const y = toPixels(city.y, 'height');
      
      return (
        <g key={`city-${city.id}`}>
          <circle 
            cx={x} 
            cy={y} 
            r={5} 
            fill={index === 0 ? "#ef4444" : "#3b82f6"}
          />
          
          <text 
            x={x} 
            y={y - 10} 
            fill="white"
            fontSize="12"
            fontWeight="500"
            textAnchor="middle"
          >
            {index === 0 ? "Start" : index}
          </text>
          
          {index === 0 && (
            <circle 
              cx={x} 
              cy={y} 
              r={10} 
              fill="none"
              stroke="#ef4444"
              strokeWidth={2}
              opacity={0.3}
            />
          )}
        </g>
      );
    });
  }, [state.cities, canvasSize.width, canvasSize.height]);
  
  return (
    <div 
      ref={canvasRef}
      className="w-full h-[500px] glass-panel rounded-xl overflow-hidden canvas-container relative cursor-crosshair"
      onClick={handleCanvasClick}
    >
      {state.cities.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center opacity-70">
            <p className="text-xl font-light">Click to add cities</p>
            <p className="text-sm mt-1">The first city will be the starting point</p>
          </div>
        </div>
      )}
      
      {canvasSize.width > 0 && canvasSize.height > 0 && (
        <svg
          width={canvasSize.width}
          height={canvasSize.height}
          className="w-full h-full"
        >
          <g key="grid-layer">
            {gridLines}
          </g>
          
          <g key="path-layer">
            {pathElements}
          </g>
          
          <g key="city-layer">
            {cityElements}
          </g>
        </svg>
      )}
      
      {state.isRunning && (
        <div className="absolute bottom-4 right-4 glass-panel px-3 py-1 rounded-lg text-sm">
          <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
          Optimizing path...
        </div>
      )}
    </div>
  );
};

export default CityCanvas;
