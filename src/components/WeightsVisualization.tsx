
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Cell,
} from 'recharts';

interface WeightData {
  index: number;
  weight: number;
  value: number;
}

interface WeightsVisualizationProps {
  data: number[];
  weights: number[];
  currentEstimate: number;
  k: number;
  isLogScale: boolean;
  yAxisDecimals: number;
}

const WeightsVisualization: React.FC<WeightsVisualizationProps> = ({
  data,
  weights,
  currentEstimate,
  k,
  isLogScale,
  yAxisDecimals,
}) => {
  // Transform data for visualization
  const formattedData: WeightData[] = data.map((value, index) => ({
    index: index + 1,
    weight: weights[index],
    value,
  }));

  // Validate if log scale is safe (no zero or negative weights)
  const safeLogScale = isLogScale && weights.every(w => w > 0);

  // Custom tooltip for the bar chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      const residual = Math.abs(dataPoint.value - currentEstimate);
      return (
        <div className="glass-panel p-2 border border-white/10 shadow-lg rounded-md">
          <p className="font-semibold">Point {dataPoint.index}</p>
          <p>Value: {dataPoint.value}</p>
          <p>Weight: {dataPoint.weight.toFixed(Math.min(yAxisDecimals, 2))}</p>
          <p>Residual: {residual.toFixed(4)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="glass-panel">
      <CardHeader>
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          Weights Visualization
          <Tooltip>
            <TooltipTrigger>
              <Info size={16} className="text-muted-foreground hover:text-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs text-xs">
                Bar chart showing weights assigned to each data point. Lower weights (shorter bars) indicate outliers being downweighted.
              </p>
            </TooltipContent>
          </Tooltip>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={formattedData}
              margin={{ top: 20, right: 30, bottom: 50, left: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="index" 
                label={{ 
                  value: 'Data Point Index', 
                  position: 'insideBottom', 
                  offset: -10,
                  style: { textAnchor: 'middle', fontWeight: 'bold', fill: 'currentColor' }
                }}
              />
              <YAxis 
                scale={safeLogScale ? "log" : "linear"}
                domain={safeLogScale ? [0.001, 'dataMax + 0.1'] : [0, 'dataMax + 0.1']}
                tickFormatter={(value) => Number(value).toFixed(Math.min(yAxisDecimals, 2))}
                label={{ 
                  value: 'Weight', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { textAnchor: 'middle', fontWeight: 'bold', fill: 'currentColor' }
                }}
              />
              <RechartsTooltip content={<CustomTooltip />} />
              <Bar dataKey="weight" name="Weight">
                {formattedData.map((entry, index) => {
                  const residual = Math.abs(entry.value - currentEstimate);
                  return (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={residual <= k ? "#3b82f6" : "#ef4444"} 
                    />
                  );
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeightsVisualization;
