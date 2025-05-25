
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts';

interface DataPoint {
  id: number;
  x: number;
  y: number;
  weight: number;
  value: number;
}

interface DataVisualizationProps {
  data: number[];
  weights: number[];
  currentEstimate: number;
  iteration: number;
  k: number;
}

const DataVisualization: React.FC<DataVisualizationProps> = ({
  data,
  weights,
  currentEstimate,
  iteration,
  k,
}) => {
  // Transform data for visualization
  const formattedData: DataPoint[] = data.map((value, index) => ({
    id: index,
    x: index + 1,
    y: 1,
    weight: weights[index],
    value,
  }));
  
  // Calculate data range for better visualization
  const dataMin = Math.min(...data);
  const dataMax = Math.max(...data);
  
  // Custom tooltip for the scatter chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      return (
        <div className="glass-panel p-2 border border-white/10 shadow-lg rounded-md">
          <p className="font-semibold">Point {dataPoint.id + 1}</p>
          <p>Value: {dataPoint.value}</p>
          <p>Weight: {dataPoint.weight.toFixed(4)}</p>
        </div>
      );
    }
    return null;
  };

  // Generate colors based on residuals
  const getPointColor = (entry: DataPoint) => {
    const residual = Math.abs(entry.value - currentEstimate);
    return residual <= k ? "#3b82f6" : "#ef4444";
  };

  return (
    <Card className="glass-panel">
      <CardHeader>
        <CardTitle className="text-lg font-medium">
          Data Visualization - Iteration {iteration}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 30, bottom: 50, left: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                type="number" 
                dataKey="x" 
                name="Index" 
                domain={[0, data.length + 1]}
                label={{ 
                  value: 'Data Point Index', 
                  position: 'insideBottom', 
                  offset: -10,
                  style: { textAnchor: 'middle', fontWeight: 'bold', fill: 'currentColor' }
                }}
              />
              <YAxis 
                type="number" 
                dataKey="value" 
                name="Value" 
                domain={[Math.min(dataMin - 5, currentEstimate - k * 2), Math.max(dataMax + 5, currentEstimate + k * 2)]}
                label={{ 
                  value: 'Value', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { textAnchor: 'middle', fontWeight: 'bold', fill: 'currentColor' }
                }}
              />
              <ZAxis 
                type="number" 
                dataKey="weight" 
                range={[50, 500]} 
                name="Weight" 
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine 
                y={currentEstimate} 
                stroke="#ef4444" 
                strokeWidth={2}
                strokeDasharray="3 3"
                label={{ 
                  value: `Estimate: ${currentEstimate.toFixed(3)}`, 
                  position: 'insideTopLeft',
                  style: { fontWeight: 'bold', fill: '#ef4444' }
                }}
              />
              <ReferenceLine 
                y={currentEstimate + k} 
                stroke="#3b82f6" 
                strokeDasharray="3 3"
                label={{ 
                  value: `+k (${k})`, 
                  position: 'insideTopRight',
                  style: { fontWeight: 'bold', fill: '#3b82f6' }
                }}
              />
              <ReferenceLine 
                y={currentEstimate - k} 
                stroke="#3b82f6" 
                strokeDasharray="3 3"
                label={{ 
                  value: `-k (${-k})`, 
                  position: 'insideBottomRight',
                  style: { fontWeight: 'bold', fill: '#3b82f6' }
                }}
              />
              <Scatter 
                name="Data Points" 
                data={formattedData} 
                fill="#3b82f6"
                shape={(props: any) => {
                  const { cx, cy, r } = props;
                  const dataPoint = props.payload;
                  const color = getPointColor(dataPoint);
                  
                  return (
                    <circle 
                      cx={cx} 
                      cy={cy} 
                      r={r} 
                      fill={color}
                    />
                  );
                }}
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataVisualization;
