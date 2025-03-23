
import React, { useEffect, useRef } from "react";
import { ChartProps } from "@/utils/types";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const Charts: React.FC<ChartProps> = ({ state }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (chartContainerRef.current) {
      // Scroll to the end when distances update
      if (state.isRunning && state.distances.length > 0) {
        chartContainerRef.current.scrollTo({
          left: chartContainerRef.current.scrollWidth,
          behavior: "smooth",
        });
      }
    }
  }, [state.distances, state.isRunning]);
  
  // Create chart data
  const chartData = state.distances.map((distance, index) => ({
    iteration: index,
    distance,
  }));
  
  // Find min and max distances for chart scaling
  const minDistance = Math.min(...state.distances.filter(Boolean));
  const maxDistance = Math.max(...state.distances.filter(Boolean));
  const yAxisMin = Math.max(0, minDistance * 0.95);
  const yAxisMax = maxDistance * 1.05;
  
  return (
    <div className="glass-panel rounded-xl p-6">
      <h2 className="text-lg font-medium mb-4">Distance Over Iterations</h2>
      
      {state.distances.length > 1 ? (
        <div 
          ref={chartContainerRef} 
          className="w-full h-60 overflow-x-auto scrollbar-none"
        >
          <ResponsiveContainer width={Math.max(600, state.distances.length * 5)} height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <XAxis 
                dataKey="iteration" 
                stroke="#ffffff50"
                tickLine={{ stroke: '#ffffff30' }}
                axisLine={{ stroke: '#ffffff30' }}
              />
              <YAxis 
                stroke="#ffffff50"
                tickLine={{ stroke: '#ffffff30' }}
                axisLine={{ stroke: '#ffffff30' }}
                domain={[yAxisMin, yAxisMax]}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(22, 22, 26, 0.9)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  color: 'white'
                }}
                itemStyle={{ color: 'white' }}
                labelStyle={{ color: 'rgba(255, 255, 255, 0.7)' }}
              />
              <Line 
                type="monotone" 
                dataKey="distance" 
                stroke="rgba(255, 137, 51, 0.9)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, stroke: 'rgba(255, 137, 51, 0.9)', strokeWidth: 2, fill: 'rgba(22, 22, 26, 0.9)' }}
              />
              
              {/* Horizontal line for best distance */}
              {state.bestDistance > 0 && (
                <Line 
                  type="monotone" 
                  data={[
                    { iteration: 0, bestDist: state.bestDistance },
                    { iteration: state.distances.length - 1, bestDist: state.bestDistance }
                  ]}
                  dataKey="bestDist"
                  stroke="rgba(19, 223, 131, 0.9)"
                  strokeWidth={1.5}
                  dot={false}
                  strokeDasharray="5 5"
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-60 flex items-center justify-center opacity-60 animate-pulse-subtle">
          <p>Run the simulation to generate data</p>
        </div>
      )}
      
      {state.distances.length > 1 && (
        <div className="mt-4 flex justify-between text-xs opacity-80">
          <div>
            <span className="inline-block w-3 h-3 bg-tsp-current rounded-full mr-1"></span>
            Current distance path
          </div>
          <div>
            <span className="inline-block w-3 h-3 bg-tsp-best rounded-full mr-1"></span>
            Best distance found ({state.bestDistance.toFixed(2)})
          </div>
        </div>
      )}
    </div>
  );
};

export default Charts;
