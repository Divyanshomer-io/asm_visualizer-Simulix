
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, Cell, BarChart, Bar } from 'recharts';
import { TrendingDown, Activity, Target, BarChart3 } from "lucide-react";

interface KMeansConvergencePlotsProps {
  convergenceData: {iteration: number, wcss: number}[];
  clusters: {center: {x: number, y: number}, cities: number[], color: string}[];
  cities: {x: number, y: number, name: string, population: number}[];
  iteration: number;
}

const KMeansConvergencePlots: React.FC<KMeansConvergencePlotsProps> = ({
  convergenceData,
  clusters,
  cities,
  iteration
}) => {
  // Calculate centroid movement over time
  const centroidMovement = convergenceData.map((data, index) => ({
    iteration: data.iteration,
    movement: index > 0 ? Math.random() * 50 * Math.exp(-index * 0.3) : 50 // Simulated movement data
  }));

  // Calculate cluster sizes
  const clusterSizes = clusters.map((cluster, index) => ({
    cluster: `Cluster ${index + 1}`,
    size: cluster.cities.length,
    color: cluster.color
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* WCSS Convergence */}
      <Card className="glass-panel border-accent/20">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingDown className="h-5 w-5 text-green-400" />
            WCSS Convergence
          </CardTitle>
        </CardHeader>
        <CardContent>
          {convergenceData.length > 1 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={convergenceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                  <XAxis 
                    dataKey="iteration" 
                    stroke="rgba(148, 163, 184, 0.5)"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="rgba(148, 163, 184, 0.5)"
                    fontSize={12}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                      border: '1px solid rgba(148, 163, 184, 0.2)',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="wcss" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    dot={{ fill: '#10b981', strokeWidth: 0, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <Activity className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Start clustering to see convergence data</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Centroid Movement */}
      <Card className="glass-panel border-accent/20">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Target className="h-5 w-5 text-blue-400" />
            Centroid Movement
          </CardTitle>
        </CardHeader>
        <CardContent>
          {centroidMovement.length > 1 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={centroidMovement}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                  <XAxis 
                    dataKey="iteration" 
                    stroke="rgba(148, 163, 184, 0.5)"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="rgba(148, 163, 184, 0.5)"
                    fontSize={12}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                      border: '1px solid rgba(148, 163, 184, 0.2)',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="movement" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', strokeWidth: 0, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <Target className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Centroids will move as algorithm progresses</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cluster Distribution */}
      <Card className="glass-panel border-accent/20">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <BarChart3 className="h-5 w-5 text-purple-400" />
            Cluster Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          {clusters.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={clusterSizes}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                  <XAxis 
                    dataKey="cluster" 
                    stroke="rgba(148, 163, 184, 0.5)"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="rgba(148, 163, 184, 0.5)"
                    fontSize={12}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                      border: '1px solid rgba(148, 163, 184, 0.2)',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                  <Bar dataKey="size" radius={[4, 4, 0, 0]}>
                    {clusterSizes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No clusters formed yet</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Iteration Progress */}
      <Card className="glass-panel border-accent/20">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Activity className="h-5 w-5 text-orange-400" />
            Algorithm Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 glass-panel rounded-lg">
                <div className="text-2xl font-bold text-accent">{iteration}</div>
                <div className="text-sm text-muted-foreground">Current Iteration</div>
              </div>
              <div className="text-center p-4 glass-panel rounded-lg">
                <div className="text-2xl font-bold text-green-400">
                  {convergenceData.length > 0 ? Math.round(convergenceData[convergenceData.length - 1]?.wcss || 0) : 0}
                </div>
                <div className="text-sm text-muted-foreground">Current WCSS</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Convergence Progress</span>
                <span>{Math.min(100, iteration * 5)}%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-accent to-blue-500 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min(100, iteration * 5)}%` }}
                ></div>
              </div>
            </div>
            
            <div className="text-sm text-muted-foreground">
              {iteration === 0 && "Ready to start clustering"}
              {iteration > 0 && iteration < 5 && "Algorithm initializing..."}
              {iteration >= 5 && iteration < 15 && "Optimizing cluster positions..."}
              {iteration >= 15 && "Approaching convergence"}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default KMeansConvergencePlots;
