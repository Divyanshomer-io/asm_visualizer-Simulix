
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
} from 'recharts';

interface ConvergenceData {
  iteration: number;
  estimate: number;
}

interface ConvergenceChartProps {
  iterations: ConvergenceData[];
  isLogScale: boolean;
  yAxisDecimals: number;
}

const ConvergenceChart: React.FC<ConvergenceChartProps> = ({ 
  iterations, 
  isLogScale, 
  yAxisDecimals 
}) => {
  // Validate if log scale is safe (no zero or negative values)
  const safeLogScale = isLogScale && iterations.every(item => item.estimate > 0);

  return (
    <Card className="glass-panel">
      <CardHeader>
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          Convergence Path
          <Tooltip>
            <TooltipTrigger>
              <Info size={16} className="text-muted-foreground hover:text-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs text-xs">
                Shows how the parameter estimate evolves over iterations. Horizontal convergence indicates successful estimation.
              </p>
            </TooltipContent>
          </Tooltip>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={iterations}
              margin={{ top: 20, right: 30, bottom: 50, left: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="iteration" 
                label={{ 
                  value: 'Iteration', 
                  position: 'insideBottom', 
                  offset: -10,
                  style: { textAnchor: 'middle', fontWeight: 'bold', fill: 'currentColor' }
                }}
              />
              <YAxis 
                scale={safeLogScale ? "log" : "linear"}
                domain={safeLogScale ? ['auto', 'auto'] : ['dataMin - 1', 'dataMax + 1']}
                tickFormatter={(value) => Number(value).toFixed(yAxisDecimals)}
                label={{ 
                  value: 'Estimate', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { textAnchor: 'middle', fontWeight: 'bold', fill: 'currentColor' }
                }}
              />
              <RechartsTooltip  
                formatter={(value: number) => [value.toFixed(yAxisDecimals), 'Estimate']}
                labelFormatter={(label) => `Iteration ${label}`}
                contentStyle={{ 
                  backgroundColor: 'rgba(0,0,0,0.8)', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="estimate"
                name="Parameter Estimate"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 4, fill: "#3b82f6" }}
                activeDot={{ r: 6, fill: "#3b82f6" }}
                isAnimationActive={true}
                animationDuration={800}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConvergenceChart;
