
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Target, TrendingDown, Award, BookOpen, Lightbulb, Zap, Users, BarChart3, Activity } from "lucide-react";

interface KMeansGameEducationProps {
  k: number;
  cities: {x: number, y: number, name: string, population: number}[];
  clusters: {center: {x: number, y: number}, cities: number[], color: string}[];
  iteration: number;
  convergenceData: {iteration: number, wcss: number}[];
  gameLevel: number;
}

const KMeansGameEducation: React.FC<KMeansGameEducationProps> = ({
  k,
  cities,
  clusters,
  iteration,
  convergenceData,
  gameLevel,
}) => {
  const getGameTip = () => {
    if (cities.length === 0) {
      return {
        icon: <Target className="h-4 w-4" />,
        title: "Getting Started",
        content: "Click on the map to place cities. Try to create interesting patterns!",
        type: "info"
      };
    }
    
    if (cities.length < k) {
      return {
        icon: <Target className="h-4 w-4" />,
        title: "Need More Cities",
        content: `You need at least ${k} cities to run K-means clustering with K=${k}.`,
        type: "warning"
      };
    }
    
    if (clusters.length === 0) {
      return {
        icon: <Zap className="h-4 w-4" />,
        title: "Ready to Cluster",
        content: "Great! You have enough cities. Click 'Start' to begin K-means clustering.",
        type: "success"
      };
    }
    
    if (iteration < 5) {
      return {
        icon: <TrendingDown className="h-4 w-4" />,
        title: "Algorithm Running",
        content: "Watch how centroids move to minimize the distance to their assigned cities.",
        type: "info"
      };
    }
    
    return {
      icon: <Award className="h-4 w-4" />,
      title: "Optimization in Progress",
      content: "The algorithm is converging! Lower WCSS values indicate better clustering quality.",
      type: "success"
    };
  };

  const tip = getGameTip();
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
          <BookOpen className="h-6 w-6 text-blue-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Learn About K-Means</h2>
          <p className="text-muted-foreground">K-means clustering is an unsupervised learning algorithm that partitions data into clusters. In this city builder game, watch how the algorithm groups cities based on proximity.</p>
        </div>
      </div>

      {/* Educational Tabs */}
      <Tabs defaultValue="basics" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="basics">Basics</TabsTrigger>
          <TabsTrigger value="parameters">Parameters</TabsTrigger>
          <TabsTrigger value="algorithm">Algorithm</TabsTrigger>
          <TabsTrigger value="environment">Environment</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basics" className="mt-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="glass-panel">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">The K-Means Formula:</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center p-6 bg-slate-800/50 rounded-lg mb-4">
                    <div className="text-xl font-mono text-blue-400">
                      J = Σ Σ ||x<sub>i</sub> - μ<sub>k</sub>||²
                    </div>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                      <Badge variant="outline" className="text-blue-400 border-blue-400/50">J</Badge>
                      <span>Objective function (WCSS - minimize this)</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Badge variant="outline" className="text-green-400 border-green-400/50">x<sub>i</sub></Badge>
                      <span>Data point (city position)</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Badge variant="outline" className="text-purple-400 border-purple-400/50">μ<sub>k</sub></Badge>
                      <span>Cluster centroid (center of cluster)</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-panel">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Key Concepts:</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 glass-panel rounded-lg">
                      <h4 className="font-medium text-green-400 mb-2">Centroids</h4>
                      <p className="text-sm text-muted-foreground">The center points of clusters, calculated as the mean of all assigned points</p>
                    </div>
                    <div className="p-3 glass-panel rounded-lg">
                      <h4 className="font-medium text-purple-400 mb-2">Within-Cluster Sum of Squares</h4>
                      <p className="text-sm text-muted-foreground">Measures compactness - sum of squared distances from points to their centroids</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="parameters" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="glass-panel">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Target className="h-4 w-4 text-blue-400" />
                  K Value
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-center p-4 glass-panel rounded-lg">
                  <div className="text-3xl font-bold text-blue-400">{k}</div>
                  <div className="text-sm text-muted-foreground">Current K</div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Number of clusters to create. Choose based on data patterns or use the elbow method.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-panel">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Activity className="h-4 w-4 text-green-400" />
                  Max Iterations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-center p-4 glass-panel rounded-lg">
                  <div className="text-3xl font-bold text-green-400">20</div>
                  <div className="text-sm text-muted-foreground">Limit</div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Maximum steps before stopping. Prevents infinite loops in edge cases.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-panel">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Users className="h-4 w-4 text-purple-400" />
                  Data Points
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-center p-4 glass-panel rounded-lg">
                  <div className="text-3xl font-bold text-purple-400">{cities.length}</div>
                  <div className="text-sm text-muted-foreground">Cities</div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Each city is a data point with x,y coordinates to be clustered.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="algorithm" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-accent">Algorithm Steps</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-4 glass-panel rounded-lg">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center text-sm font-bold text-blue-400">1</div>
                  <div>
                    <p className="font-medium">Initialize K Centroids</p>
                    <p className="text-sm text-muted-foreground">Randomly place K centroids in the data space or use smart initialization</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 glass-panel rounded-lg">
                  <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center text-sm font-bold text-green-400">2</div>
                  <div>
                    <p className="font-medium">Assign Points to Clusters</p>
                    <p className="text-sm text-muted-foreground">Each point goes to the nearest centroid based on Euclidean distance</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 glass-panel rounded-lg">
                  <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center text-sm font-bold text-purple-400">3</div>
                  <div>
                    <p className="font-medium">Update Centroids</p>
                    <p className="text-sm text-muted-foreground">Move each centroid to the mean position of its assigned points</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 glass-panel rounded-lg">
                  <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center text-sm font-bold text-orange-400">4</div>
                  <div>
                    <p className="font-medium">Check Convergence</p>
                    <p className="text-sm text-muted-foreground">Repeat steps 2-3 until centroids stop moving significantly</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-accent">Current Status</h3>
              <div className="space-y-3">
                <div className="p-4 glass-panel rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm">Algorithm Progress</span>
                    <span className="text-sm font-mono">{iteration}/20</span>
                  </div>
                  <Progress value={(iteration / 20) * 100} className="h-2" />
                </div>
                
                {convergenceData.length > 1 && (
                  <div className="p-4 glass-panel rounded-lg">
                    <h4 className="text-sm font-medium mb-3">WCSS Over Time</h4>
                    <div className="h-32">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={convergenceData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                          <XAxis dataKey="iteration" stroke="rgba(148, 163, 184, 0.5)" fontSize={10} />
                          <YAxis stroke="rgba(148, 163, 184, 0.5)" fontSize={10} />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                              border: '1px solid rgba(148, 163, 184, 0.2)',
                              borderRadius: '8px',
                              fontSize: '11px'
                            }}
                          />
                          <Line type="monotone" dataKey="wcss" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="environment" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass-panel">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Game Environment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 glass-panel rounded-lg">
                    <div className="text-lg font-bold text-blue-400">800×400</div>
                    <div className="text-xs text-muted-foreground">Map Size</div>
                  </div>
                  <div className="text-center p-3 glass-panel rounded-lg">
                    <div className="text-lg font-bold text-green-400">{cities.length}</div>
                    <div className="text-xs text-muted-foreground">Cities Placed</div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Click anywhere on the map to place cities. Each city has random population data for visualization.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-panel">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Cluster Visualization</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">Cities are colored by cluster assignment</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
                    <span className="text-sm">Centroids shown as larger circles</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-1 bg-gradient-to-r from-blue-500 to-red-500"></div>
                    <span className="text-sm">Lines connect cities to centroids</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="progress" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Current Game Tip */}
            <Card className="glass-panel border-accent/20">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  {tip.icon}
                  {tip.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{tip.content}</p>
              </CardContent>
            </Card>

            {/* Level Progress */}
            <Card className="glass-panel">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Award className="h-4 w-4 text-purple-400" />
                  Level Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Level {gameLevel}</span>
                  <Badge variant="outline" className="text-purple-400 border-purple-400/50">
                    {gameLevel < 5 ? 'Beginner' : gameLevel < 10 ? 'Expert' : 'Master'}
                  </Badge>
                </div>
                <Progress value={(gameLevel % 5) * 20} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  Complete efficient clusterings to level up!
                </p>
              </CardContent>
            </Card>

            {/* Strategy Tips */}
            <Card className="glass-panel">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Lightbulb className="h-4 w-4 text-yellow-400" />
                  Quick Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <span className="text-yellow-400">•</span>
                    <span>Place cities in distinct groups for better clustering</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-yellow-400">•</span>
                    <span>Choose K based on natural city group patterns</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-yellow-400">•</span>
                    <span>Watch centroids move toward cluster centers</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-yellow-400">•</span>
                    <span>Lower WCSS means better clustering quality</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default KMeansGameEducation;
