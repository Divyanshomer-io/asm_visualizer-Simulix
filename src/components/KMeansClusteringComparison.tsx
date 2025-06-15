
import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Shuffle, Users, Target, Zap } from "lucide-react";

interface KMeansClusteringComparisonProps {
  cities: {x: number, y: number, name: string, population: number}[];
  k: number;
  clusters: {center: {x: number, y: number}, cities: number[], color: string}[];
}

const KMeansClusteringComparison: React.FC<KMeansClusteringComparisonProps> = ({ cities, k, clusters }) => {
  
  const comparisonData = useMemo(() => {
    if (cities.length === 0) return { kmeans: [], hierarchical: [], density: [] };
    
    const colors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
    
    // Use real K-means clustering data from the main visualization
    const kmeansData = cities.map((city, cityIndex) => {
      let clusterIndex = 0;
      let clusterColor = colors[0];
      
      // Find which cluster this city belongs to
      if (clusters.length > 0) {
        for (let i = 0; i < clusters.length; i++) {
          if (clusters[i].cities && clusters[i].cities.includes(cityIndex)) {
            clusterIndex = i;
            // Use the cluster's actual color
            clusterColor = clusters[i].color;
            break;
          }
        }
      }
      
      return {
        x: city.x,
        y: city.y,
        name: city.name,
        population: city.population,
        cluster: clusterIndex,
        color: clusterColor
      };
    });
    
    // Hierarchical clustering simulation (distance-based)
    const hierarchicalData = cities.map((city, index) => {
      const distanceCluster = Math.floor((city.x + city.y) / 200) % k;
      return {
        x: city.x,
        y: city.y,
        name: city.name,
        population: city.population,
        cluster: distanceCluster,
        color: colors[distanceCluster % colors.length]
      };
    });
    
    // Density-based simulation (population-based)
    const densityData = cities.map((city, index) => {
      const popCluster = city.population > 50000 ? 0 : city.population > 30000 ? 1 : 2;
      return {
        x: city.x,
        y: city.y,
        name: city.name,
        population: city.population,
        cluster: popCluster % k,
        color: colors[(popCluster % k) % colors.length]
      };
    });
    
    return { kmeans: kmeansData, hierarchical: hierarchicalData, density: densityData };
  }, [cities, k, clusters]);

  const renderScatterChart = (data: any[], title: string, icon: React.ReactNode) => (
    <Card className="glass-panel border-accent/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                <XAxis 
                  dataKey="x" 
                  type="number"
                  domain={[0, 800]}
                  stroke="rgba(148, 163, 184, 0.5)"
                  fontSize={10}
                />
                <YAxis 
                  dataKey="y" 
                  type="number"
                  domain={[0, 400]}
                  stroke="rgba(148, 163, 184, 0.5)"
                  fontSize={10}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                    border: '1px solid rgba(148, 163, 184, 0.2)',
                    borderRadius: '8px',
                    fontSize: '11px',
                    color: 'white'
                  }}
                  formatter={(value, name, props) => [
                    `${props.payload.name} (${Math.floor(props.payload.population / 1000)}K)`, 
                    'City'
                  ]}
                />
                <Scatter dataKey="population" fill="#8884d8">
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              {icon}
              <p className="mt-2 text-sm">No data to display</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold text-accent">Clustering Algorithm Comparison</h3>
        <p className="text-muted-foreground">See how different clustering algorithms group the same data</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {renderScatterChart(
          comparisonData.kmeans, 
          "K-Means Clustering", 
          <Target className="h-4 w-4 text-blue-400" />
        )}
        
        {renderScatterChart(
          comparisonData.hierarchical, 
          "Hierarchical Clustering", 
          <Shuffle className="h-4 w-4 text-green-400" />
        )}
        
        {renderScatterChart(
          comparisonData.density, 
          "Density-Based Clustering", 
          <Users className="h-4 w-4 text-purple-400" />
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-panel">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Target className="h-4 w-4 text-blue-400" />
              K-Means
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Centroid-based clustering</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>Works well with spherical clusters</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span>Requires predefined K</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
              <span>Fast and scalable</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Shuffle className="h-4 w-4 text-green-400" />
              Hierarchical
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Tree-based clustering</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>No need to specify K</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span>Creates dendrogram</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
              <span>Computationally expensive</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="h-4 w-4 text-purple-400" />
              Density-Based
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Density-based clustering</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>Finds arbitrary shaped clusters</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span>Handles noise and outliers</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
              <span>Sensitive to parameters</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-panel border-accent/20">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Zap className="h-5 w-5 text-accent" />
            When to Use Each Algorithm
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className="space-y-2">
              <h4 className="font-semibold text-blue-400">Use K-Means When:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Clusters are roughly spherical</li>
                <li>• You know the number of clusters</li>
                <li>• Data is not too noisy</li>
                <li>• You need fast results</li>
                <li>• Working with large datasets</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-green-400">Use Hierarchical When:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• You don't know K in advance</li>
                <li>• You want to explore cluster hierarchy</li>
                <li>• Small to medium datasets</li>
                <li>• You need deterministic results</li>
                <li>• Nested clusters are meaningful</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-purple-400">Use Density-Based When:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Clusters have irregular shapes</li>
                <li>• Data contains noise/outliers</li>
                <li>• Cluster sizes vary significantly</li>
                <li>• You want to find core samples</li>
                <li>• Non-convex clusters exist</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default KMeansClusteringComparison;
