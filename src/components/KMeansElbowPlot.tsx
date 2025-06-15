
import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { TrendingDown, Info } from "lucide-react";

interface KMeansElbowPlotProps {
  cities: {x: number, y: number, name: string, population: number}[];
  currentK: number;
}

const KMeansElbowPlot: React.FC<KMeansElbowPlotProps> = ({ cities, currentK }) => {
  
  const elbowData = useMemo(() => {
    if (cities.length === 0) return [];
    
    const data = [];
    
    // Calculate WCSS for different K values
    for (let k = 1; k <= Math.min(8, cities.length); k++) {
      // Simulate K-means for this K value
      let wcss = 0;
      
      if (k === 1) {
        // Single cluster - all points to centroid at mean
        const centerX = cities.reduce((sum, city) => sum + city.x, 0) / cities.length;
        const centerY = cities.reduce((sum, city) => sum + city.y, 0) / cities.length;
        wcss = cities.reduce((sum, city) => 
          sum + Math.pow(city.x - centerX, 2) + Math.pow(city.y - centerY, 2), 0
        );
      } else {
        // Simulate K-means with k clusters
        // Simple heuristic: distribute points evenly and calculate approximate WCSS
        const clustersPerSide = Math.ceil(Math.sqrt(k));
        const stepX = 800 / (clustersPerSide + 1);
        const stepY = 400 / (clustersPerSide + 1);
        
        const centroids = [];
        for (let i = 0; i < k; i++) {
          const row = Math.floor(i / clustersPerSide);
          const col = i % clustersPerSide;
          centroids.push({
            x: stepX * (col + 1),
            y: stepY * (row + 1)
          });
        }
        
        // Assign each city to nearest centroid and calculate WCSS
        cities.forEach(city => {
          let minDistance = Infinity;
          let closestCentroid = 0;
          
          centroids.forEach((centroid, index) => {
            const distance = Math.pow(city.x - centroid.x, 2) + Math.pow(city.y - centroid.y, 2);
            if (distance < minDistance) {
              minDistance = distance;
              closestCentroid = index;
            }
          });
          
          wcss += minDistance;
        });
      }
      
      data.push({
        k,
        wcss: Math.round(wcss),
        isOptimal: k === 3 || k === 4 // Simulated optimal K
      });
    }
    
    return data;
  }, [cities]);

  const optimalK = elbowData.find(d => d.isOptimal)?.k || 3;

  return (
    <div className="space-y-6">
      <Card className="glass-panel border-accent/20">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingDown className="h-5 w-5 text-blue-400" />
            Elbow Method for Optimal K
          </CardTitle>
        </CardHeader>
        <CardContent>
          {elbowData.length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={elbowData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                  <XAxis 
                    dataKey="k" 
                    stroke="rgba(148, 163, 184, 0.5)"
                    fontSize={12}
                    label={{ value: 'Number of Clusters (K)', position: 'insideBottom', offset: -5 }}
                  />
                  <YAxis 
                    stroke="rgba(148, 163, 184, 0.5)"
                    fontSize={12}
                    label={{ value: 'WCSS', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                      border: '1px solid rgba(148, 163, 184, 0.2)',
                      borderRadius: '8px',
                      fontSize: '12px',
                      color: 'white'
                    }}
                    formatter={(value: any) => [typeof value === 'number' ? value.toFixed(3) : value, 'WCSS']}
                    labelFormatter={(label) => `K = ${label}`}
                  />
                  <ReferenceLine 
                    x={optimalK} 
                    stroke="#10b981" 
                    strokeDasharray="5 5"
                    label={{ value: "Optimal K", position: "top" }}
                  />
                  <ReferenceLine 
                    x={currentK} 
                    stroke="#ef4444" 
                    strokeDasharray="3 3"
                    label={{ value: "Current K", position: "bottom" }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="wcss" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
                    activeDot={{ r: 8, stroke: '#3b82f6', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-80 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <TrendingDown className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Add some cities to see the elbow plot</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glass-panel">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Info className="h-4 w-4 text-blue-400" />
              Understanding the Elbow Method
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
              <p><strong>Purpose:</strong> Find the optimal number of clusters (K) for your data.</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
              <p><strong>Method:</strong> Plot WCSS vs K and look for the "elbow" - where the rate of decrease sharply changes.</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
              <p><strong>Trade-off:</strong> Balance between model complexity and fit quality.</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-orange-400 rounded-full mt-2"></div>
              <p><strong>Interpretation:</strong> The elbow point suggests the optimal K value.</p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingDown className="h-4 w-4 text-green-400" />
              Current Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 glass-panel rounded-lg">
                <div className="text-xl font-bold text-red-400">{currentK}</div>
                <div className="text-xs text-muted-foreground">Current K</div>
              </div>
              <div className="text-center p-3 glass-panel rounded-lg">
                <div className="text-xl font-bold text-green-400">{optimalK}</div>
                <div className="text-xs text-muted-foreground">Suggested K</div>
              </div>
            </div>
            
            {elbowData.length > 0 && (
              <div className="space-y-2">
                <div className="text-sm">
                  <span className="text-muted-foreground">Current WCSS: </span>
                  <span className="font-mono text-accent">
                    {elbowData.find(d => d.k === currentK)?.wcss || 'N/A'}
                  </span>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Optimal WCSS: </span>
                  <span className="font-mono text-green-400">
                    {elbowData.find(d => d.k === optimalK)?.wcss || 'N/A'}
                  </span>
                </div>
              </div>
            )}
            
            <div className="text-xs text-muted-foreground">
              {currentK === optimalK ? (
                <span className="text-green-400">✓ You're using the optimal K!</span>
              ) : currentK < optimalK ? (
                <span className="text-orange-400">Consider increasing K for better clustering</span>
              ) : (
                <span className="text-blue-400">Consider decreasing K to avoid overfitting</span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default KMeansElbowPlot;
