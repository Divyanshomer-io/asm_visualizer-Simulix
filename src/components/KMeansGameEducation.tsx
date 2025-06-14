import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Target, TrendingDown, Award, BookOpen, Lightbulb, Zap, Users, BarChart3, Activity, Brain, Calculator } from "lucide-react";

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
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
          <BookOpen className="h-6 w-6 text-blue-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Understanding K-Means Clustering</h2>
          <p className="text-muted-foreground">Learn how this powerful algorithm groups data points together</p>
        </div>
      </div>

      {/* Educational Tabs */}
      <Tabs defaultValue="basics" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="basics">What is K-Means?</TabsTrigger>
          <TabsTrigger value="math">The Math Behind It</TabsTrigger>
          <TabsTrigger value="steps">How It Works</TabsTrigger>
          <TabsTrigger value="tips">Pro Tips</TabsTrigger>
          <TabsTrigger value="realworld">Real Applications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basics" className="mt-6">
          <div className="space-y-6">
            <Card className="glass-panel">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Brain className="h-6 w-6 text-accent" />
                  What is K-Means Clustering?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-lg leading-relaxed">
                  Imagine you're organizing a city planning meeting and need to group neighborhoods by their characteristics. 
                  K-means clustering does exactly this - it's like an intelligent assistant that automatically groups similar things together!
                </p>
                <div className="bg-accent/10 p-4 rounded-lg border-l-4 border-accent">
                  <p className="font-medium text-accent mb-2">Think of it this way:</p>
                  <p className="text-sm">
                    You have a bunch of cities scattered on a map. K-means finds the best way to group them into K districts, 
                    where each district has a central point (like a town hall) and all nearby cities belong to that district.
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="glass-panel">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Why K-Means is Special</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium text-green-400">Automatic Grouping</p>
                        <p className="text-sm text-muted-foreground">No need to manually decide which cities go together</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium text-blue-400">Finds Natural Patterns</p>
                        <p className="text-sm text-muted-foreground">Discovers hidden structures in your data</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium text-purple-400">Works with Any Data</p>
                        <p className="text-sm text-muted-foreground">Cities, customers, genes, or any data with features</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-panel">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">In Your Game</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 glass-panel rounded-lg">
                      <p className="font-medium text-accent mb-2">Current Setup</p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>K Value: <span className="font-mono text-blue-400">{k}</span></div>
                        <div>Cities: <span className="font-mono text-green-400">{cities.length}</span></div>
                        <div>Steps: <span className="font-mono text-purple-400">{iteration}</span></div>
                        <div>Level: <span className="font-mono text-orange-400">{gameLevel}</span></div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Each city you place becomes a data point that the algorithm will group into {k} clusters. 
                      Watch how the centroids (cluster centers) move to find the best grouping!
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="math" className="mt-6">
          <div className="space-y-6">
            <Card className="glass-panel">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Calculator className="h-6 w-6 text-accent" />
                  The Mathematical Foundation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-accent mb-3">The Core Formula</h3>
                    <div className="bg-slate-800/50 p-6 rounded-lg border border-accent/20">
                      <div className="text-center text-2xl font-mono text-accent mb-4">
                        J = Σ<sub>i=1</sub><sup>k</sup> Σ<sub>x∈C<sub>i</sub></sub> ||x - μ<sub>i</sub>||²
                      </div>
                      <p className="text-sm text-center text-muted-foreground">
                        This formula measures how "tight" our clusters are
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="glass-panel p-4 rounded-lg border border-blue-400/30">
                      <h4 className="font-semibold text-blue-400 mb-2">J (Objective)</h4>
                      <p className="text-sm text-muted-foreground">
                        The total "cost" we want to minimize. Lower is better!
                      </p>
                    </div>
                    <div className="glass-panel p-4 rounded-lg border border-green-400/30">
                      <h4 className="font-semibold text-green-400 mb-2">x (Data Point)</h4>
                      <p className="text-sm text-muted-foreground">
                        Each city's position (x, y coordinates)
                      </p>
                    </div>
                    <div className="glass-panel p-4 rounded-lg border border-purple-400/30">
                      <h4 className="font-semibold text-purple-400 mb-2">μ<sub>i</sub> (Centroid)</h4>
                      <p className="text-sm text-muted-foreground">
                        The center point of cluster i
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-accent">Why This Formula Works</h3>
                  <div className="bg-blue-500/10 p-4 rounded-lg border border-blue-500/20">
                    <p className="text-sm leading-relaxed">
                      The formula calculates the sum of squared distances from each city to its cluster center. 
                      By minimizing this sum, we ensure that cities in the same cluster are as close together as possible, 
                      while clusters themselves are well-separated.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="glass-panel">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Distance Calculation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="bg-slate-800/50 p-4 rounded-lg">
                    <div className="text-center font-mono text-lg text-green-400 mb-2">
                      d = √[(x₁-x₂)² + (y₁-y₂)²]
                    </div>
                    <p className="text-xs text-center text-muted-foreground">
                      Euclidean distance between two points
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    This is the same as measuring the straight-line distance between two cities on your map. 
                    The algorithm uses this to decide which cluster each city should belong to.
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-panel">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Centroid Update</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="bg-slate-800/50 p-4 rounded-lg">
                    <div className="text-center font-mono text-lg text-purple-400 mb-2">
                      μ = (Σx) / n
                    </div>
                    <p className="text-xs text-center text-muted-foreground">
                      Average position of all points in cluster
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    After assigning cities to clusters, we move each centroid to the average position 
                    of all cities in that cluster. This is like finding the "center of mass" of each group.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="steps" className="mt-6">
          <div className="space-y-6">
            <Card className="glass-panel">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Activity className="h-6 w-6 text-accent" />
                  How K-Means Works Step by Step
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg mb-6 text-muted-foreground">
                  Think of K-means as a dance between cities and district centers, where everyone tries to find their perfect match!
                </p>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 glass-panel rounded-lg border-l-4 border-blue-500">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center text-lg font-bold text-blue-400">1</div>
                  <div>
                    <h3 className="font-semibold text-blue-400 mb-2">Random Initialization</h3>
                    <p className="text-sm text-muted-foreground">
                      Place {k} centroids randomly on the map. These are like temporary district centers - 
                      they'll move to better positions as the algorithm learns.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 glass-panel rounded-lg border-l-4 border-green-500">
                  <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center text-lg font-bold text-green-400">2</div>
                  <div>
                    <h3 className="font-semibold text-green-400 mb-2">Assign Cities to Clusters</h3>
                    <p className="text-sm text-muted-foreground">
                      Each city "looks around" and joins the district center that's closest to it. 
                      It's like choosing the nearest town hall for city services.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 glass-panel rounded-lg border-l-4 border-purple-500">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center text-lg font-bold text-purple-400">3</div>
                  <div>
                    <h3 className="font-semibold text-purple-400 mb-2">Update Centroids</h3>
                    <p className="text-sm text-muted-foreground">
                      Each district center moves to the geographic center of all its cities. 
                      This ensures the center is optimally placed to serve all its cities.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 glass-panel rounded-lg border-l-4 border-orange-500">
                  <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center text-lg font-bold text-orange-400">4</div>
                  <div>
                    <h3 className="font-semibold text-orange-400 mb-2">Repeat Until Stable</h3>
                    <p className="text-sm text-muted-foreground">
                      Go back to step 2 and repeat. Eventually, cities stop switching districts and 
                      centers stop moving - that's convergence!
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Card className="glass-panel">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">What You'll See</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white"></div>
                        <span className="text-sm">Centroids (large circles with borders)</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-sm">Cities colored by their cluster</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-1 bg-gradient-to-r from-blue-500/50 to-red-500/50"></div>
                        <span className="text-sm">Lines connecting cities to centroids</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-panel">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Current Progress</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Algorithm Steps</span>
                      <span className="font-mono text-accent">{iteration} / {20}</span>
                    </div>
                    <Progress value={(iteration / 20) * 100} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      {iteration === 0 ? 'Click Start to begin the algorithm' :
                       iteration < 5 ? 'Algorithm is finding initial groupings' :
                       iteration < 15 ? 'Refining cluster assignments' :
                       'Converging to final solution'}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="tips" className="mt-6">
          <div className="space-y-6">
            <Card className="glass-panel">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Lightbulb className="h-6 w-6 text-accent" />
                  Pro Tips for Better Clustering
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg mb-6 text-muted-foreground">
                  Master these techniques to become a K-means clustering expert!
                </p>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Card className="glass-panel border border-blue-400/30">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-blue-400">Choosing the Right K</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start gap-2">
                        <span className="text-green-400">✓</span>
                        <span>Look for natural groupings in your city placement</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-green-400">✓</span>
                        <span>Use the Elbow Method to find optimal K value</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-green-400">✓</span>
                        <span>Start small (K=2-3) and increase gradually</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-red-400">✗</span>
                        <span>Don't choose K > number of cities</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-panel border border-green-400/30">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-green-400">City Placement Strategy</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start gap-2">
                        <span className="text-green-400">✓</span>
                        <span>Create distinct groups with clear separation</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-green-400">✓</span>
                        <span>Place cities in patterns (circles, lines, clusters)</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-green-400">✓</span>
                        <span>Experiment with different densities</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-red-400">✗</span>
                        <span>Avoid placing all cities in a single line</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <Card className="glass-panel border border-purple-400/30">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-purple-400">Interpreting Results</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-3">
                      <div className="p-3 glass-panel rounded-lg">
                        <h4 className="font-medium text-sm text-blue-400 mb-1">Low WCSS</h4>
                        <p className="text-xs text-muted-foreground">Tight, well-separated clusters</p>
                      </div>
                      <div className="p-3 glass-panel rounded-lg">
                        <h4 className="font-medium text-sm text-orange-400 mb-1">High WCSS</h4>
                        <p className="text-xs text-muted-foreground">Loose clusters, may need different K</p>
                      </div>
                      <div className="p-3 glass-panel rounded-lg">
                        <h4 className="font-medium text-sm text-green-400 mb-1">Quick Convergence</h4>
                        <p className="text-xs text-muted-foreground">Good initial centroid placement</p>
                      </div>
                      <div className="p-3 glass-panel rounded-lg">
                        <h4 className="font-medium text-sm text-red-400 mb-1">Slow Convergence</h4>
                        <p className="text-xs text-muted-foreground">Complex data or poor K choice</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-panel border border-orange-400/30">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-orange-400">Common Mistakes</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start gap-2">
                        <span className="text-red-400">⚠</span>
                        <span>Using too many clusters for few data points</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-red-400">⚠</span>
                        <span>Ignoring the elbow method results</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-red-400">⚠</span>
                        <span>Expecting perfect clusters with random data</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-red-400">⚠</span>
                        <span>Not considering the domain knowledge</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="realworld" className="mt-6">
          <div className="space-y-6">
            <Card className="glass-panel">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Target className="h-6 w-6 text-accent" />
                  Real-World Applications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg mb-6 text-muted-foreground">
                  K-means clustering is everywhere! Here's how companies and researchers use it daily.
                </p>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="glass-panel border border-blue-400/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-blue-400">🛒 Customer Segmentation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground mb-3">
                    E-commerce companies group customers by shopping behavior
                  </p>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span>Big spenders vs budget shoppers</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span>Frequent buyers vs occasional buyers</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      <span>Product category preferences</span>
                    </div>
                  </div>
                  <div className="mt-3 p-2 bg-blue-400/10 rounded text-xs">
                    Result: Personalized marketing campaigns
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-panel border border-green-400/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-green-400">🏥 Medical Diagnosis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground mb-3">
                    Doctors use clustering to identify disease patterns
                  </p>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                      <span>Gene expression patterns</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                      <span>Patient symptom groups</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      <span>Drug response clusters</span>
                    </div>
                  </div>
                  <div className="mt-3 p-2 bg-green-400/10 rounded text-xs">
                    Result: Better treatment targeting
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-panel border border-purple-400/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-purple-400">📱 Image Recognition</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground mb-3">
                    Apps use clustering to organize and search photos
                  </p>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                      <span>Color palette extraction</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                      <span>Face grouping in galleries</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                      <span>Object detection training</span>
                    </div>
                  </div>
                  <div className="mt-3 p-2 bg-purple-400/10 rounded text-xs">
                    Result: Smart photo organization
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-panel border border-orange-400/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-orange-400">🌍 City Planning</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground mb-3">
                    Urban planners group neighborhoods and services
                  </p>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                      <span>School district boundaries</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                      <span>Emergency service zones</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      <span>Public transport routes</span>
                    </div>
                  </div>
                  <div className="mt-3 p-2 bg-orange-400/10 rounded text-xs">
                    Result: Efficient city services
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-panel border border-cyan-400/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-cyan-400">🎵 Music Streaming</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground mb-3">
                    Spotify and others group songs and users
                  </p>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                      <span>Musical genres and moods</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span>Listener preference groups</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      <span>Similar artist discovery</span>
                    </div>
                  </div>
                  <div className="mt-3 p-2 bg-cyan-400/10 rounded text-xs">
                    Result: Better recommendations
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-panel border border-pink-400/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-pink-400">💰 Finance & Banking</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground mb-3">
                    Banks detect fraud and assess risk patterns
                  </p>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                      <span>Fraudulent transaction patterns</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span>Credit risk assessment</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span>Investment portfolio grouping</span>
                    </div>
                  </div>
                  <div className="mt-3 p-2 bg-pink-400/10 rounded text-xs">
                    Result: Safer banking for everyone
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="glass-panel bg-accent/5 border border-accent/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-accent">Why K-Means is So Popular</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl mb-2">🚀</div>
                    <h4 className="font-semibold text-sm">Fast &amp; Efficient</h4>
                    <p className="text-xs text-muted-foreground">Works quickly even with large datasets</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl mb-2">🎯</div>
                    <h4 className="font-semibold text-sm">Easy to Understand</h4>
                    <p className="text-xs text-muted-foreground">Results are intuitive and interpretable</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl mb-2">🔧</div>
                    <h4 className="font-semibold text-sm">Widely Applicable</h4>
                    <p className="text-xs text-muted-foreground">Works across many different domains</p>
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
