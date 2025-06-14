import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Home, MapPin, Users, Target, Brain, BarChart3, ArrowLeft } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import KMeansGameControls from "@/components/KMeansGameControls";
import KMeansGameVisualization from "@/components/KMeansGameVisualization";
import KMeansGameEducation from "@/components/KMeansGameEducation";
import KMeansConvergencePlots from "@/components/KMeansConvergencePlots";
import KMeansElbowPlot from "@/components/KMeansElbowPlot";
import KMeansClusteringComparison from "@/components/KMeansClusteringComparison";

const KMeansGame = () => {
  // Game state
  const [cities, setCities] = useState<{x: number, y: number, name: string, population: number}[]>([]);
  const [k, setK] = useState(3);
  const [clusters, setClusters] = useState<{center: {x: number, y: number}, cities: number[], color: string}[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [iteration, setIteration] = useState(0);
  const [gameScore, setGameScore] = useState(0);
  const [gameLevel, setGameLevel] = useState(1);
  const [convergenceData, setConvergenceData] = useState<{iteration: number, wcss: number}[]>([]);
  const [showCentroids, setShowCentroids] = useState(true);
  const [showConnections, setShowConnections] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState(500);
  const [maxIterations, setMaxIterations] = useState(20);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="w-full glass-panel border-b border-white/5 mb-8">
        <div className="container py-6 px-4 md:px-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-light tracking-tight">
              K-Means City Builder
              <span className="text-sm ml-3 opacity-70 font-normal">
                Interactive Learning
              </span>
            </h1>
            <p className="text-sm opacity-70">Interactive clustering algorithm exploration with cities</p>
          </div>
          <Link to="/" className="control-btn flex items-center gap-2 text-sm">
            <ArrowLeft className="h-4 w-4" />
            Back to Visualizations
          </Link>
        </div>
      </header>

      {/* Main Content with Grid Layout */}
      <div className="flex-1 container px-4 md:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
          {/* Left Column - City Builder Map and Learning Center */}
          <div className="lg:col-span-3 space-y-0">
            {/* City Builder Map */}
            <div className="glass-panel p-6 rounded-xl rounded-b-none">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-accent/20 to-blue-500/20 rounded-lg flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">City Builder Map</h2>
                    <p className="text-muted-foreground">Click to place cities and watch K-means clustering in action</p>
                  </div>
                </div>
                
                {/* Game Stats */}
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent">{gameScore}</div>
                    <div className="text-sm text-muted-foreground">Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">{gameLevel}</div>
                    <div className="text-sm text-muted-foreground">Level</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">{cities.length}</div>
                    <div className="text-sm text-muted-foreground">Cities</div>
                  </div>
                </div>
              </div>
              
              <KMeansGameVisualization
                cities={cities}
                setCities={setCities}
                clusters={clusters}
                setClusters={setClusters}
                k={k}
                isRunning={isRunning}
                iteration={iteration}
                setIteration={setIteration}
                convergenceData={convergenceData}
                setConvergenceData={setConvergenceData}
                showCentroids={showCentroids}
                showConnections={showConnections}
                animationSpeed={animationSpeed}
                maxIterations={maxIterations}
                gameScore={gameScore}
                setGameScore={setGameScore}
                gameLevel={gameLevel}
                setGameLevel={setGameLevel}
              />
            </div>

            {/* K-Means Learning Center - Connected without gap */}
            <div className="glass-panel p-6 rounded-xl rounded-t-none border-t-0">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-accent/20 to-blue-500/20 rounded-lg flex items-center justify-center">
                  <Brain className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">K-Means Learning Center</h2>
                  <p className="text-muted-foreground">Explore different aspects of K-means clustering</p>
                </div>
              </div>

              <Tabs defaultValue="convergence" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="convergence">Convergence Analysis</TabsTrigger>
                  <TabsTrigger value="elbow">Elbow Method</TabsTrigger>
                  <TabsTrigger value="comparison">Algorithm Comparison</TabsTrigger>
                  <TabsTrigger value="metrics">Performance Metrics</TabsTrigger>
                </TabsList>
                
                <TabsContent value="convergence" className="mt-6">
                  <KMeansConvergencePlots
                    convergenceData={convergenceData}
                    clusters={clusters}
                    cities={cities}
                    iteration={iteration}
                  />
                </TabsContent>
                
                <TabsContent value="elbow" className="mt-6">
                  <KMeansElbowPlot
                    cities={cities}
                    currentK={k}
                  />
                </TabsContent>
                
                <TabsContent value="comparison" className="mt-6">
                  <KMeansClusteringComparison
                    cities={cities}
                    k={k}
                    clusters={clusters}
                  />
                </TabsContent>
                
                <TabsContent value="metrics" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="glass-panel p-6 rounded-lg">
                      <h3 className="text-xl font-semibold text-accent mb-4">Current Metrics</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">WCSS Score:</span>
                          <span className="font-mono text-accent">
                            {convergenceData.length > 0 ? Math.round(convergenceData[convergenceData.length - 1]?.wcss || 0) : 'N/A'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Iterations:</span>
                          <span className="font-mono text-blue-400">{iteration}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Clusters:</span>
                          <span className="font-mono text-green-400">{k}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Data Points:</span>
                          <span className="font-mono text-purple-400">{cities.length}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="glass-panel p-6 rounded-lg">
                      <h3 className="text-xl font-semibold text-accent mb-4">Quality Assessment</h3>
                      <div className="space-y-3">
                        <div className="p-3 glass-panel rounded-lg">
                          <p className="font-medium text-sm text-blue-400">Convergence Status</p>
                          <p className="text-xs text-muted-foreground">
                            {iteration === 0 ? 'Not started' : 
                             iteration < 5 ? 'In progress' : 
                             'Likely converged'}
                          </p>
                        </div>
                        <div className="p-3 glass-panel rounded-lg">
                          <p className="font-medium text-sm text-green-400">Cluster Quality</p>
                          <p className="text-xs text-muted-foreground">
                            {convergenceData.length > 1 && convergenceData[convergenceData.length - 1]?.wcss < 50000 ? 'Good' :
                             convergenceData.length > 1 ? 'Fair' : 'Unknown'}
                          </p>
                        </div>
                        <div className="p-3 glass-panel rounded-lg">
                          <p className="font-medium text-sm text-purple-400">Efficiency</p>
                          <p className="text-xs text-muted-foreground">
                            {iteration < 10 ? 'Fast convergence' : 
                             iteration < 20 ? 'Normal convergence' : 
                             'Slow convergence'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Right Column - Game Controls */}
          <div className="lg:col-span-1">
            <div className="glass-panel p-6 rounded-xl h-fit sticky top-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center">
                  <Target className="h-5 w-5 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold">Game Controls</h3>
              </div>
              
              <KMeansGameControls
                cities={cities}
                setCities={setCities}
                k={k}
                setK={setK}
                clusters={clusters}
                setClusters={setClusters}
                isRunning={isRunning}
                setIsRunning={setIsRunning}
                iteration={iteration}
                setIteration={setIteration}
                convergenceData={convergenceData}
                setConvergenceData={setConvergenceData}
                showCentroids={showCentroids}
                setShowCentroids={setShowCentroids}
                showConnections={showConnections}
                setShowConnections={setShowConnections}
                animationSpeed={animationSpeed}
                setAnimationSpeed={setAnimationSpeed}
                maxIterations={maxIterations}
                setMaxIterations={setMaxIterations}
                gameScore={gameScore}
                setGameScore={setGameScore}
                gameLevel={gameLevel}
                setGameLevel={setGameLevel}
              />

              {/* Quick Stats in Control Panel */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500/20 to-cyan-500/20 rounded-lg flex items-center justify-center">
                    <BarChart3 className="h-4 w-4 text-green-400" />
                  </div>
                  <h4 className="text-lg font-semibold">Quick Stats</h4>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-accent/10 p-3 rounded-lg">
                    <div className="text-xl font-bold text-accent">{gameScore}</div>
                    <div className="text-xs text-muted-foreground">Score</div>
                  </div>
                  <div className="bg-blue-500/10 p-3 rounded-lg">
                    <div className="text-xl font-bold text-blue-400">{gameLevel}</div>
                    <div className="text-xs text-muted-foreground">Level</div>
                  </div>
                  <div className="bg-green-500/10 p-3 rounded-lg">
                    <div className="text-xl font-bold text-green-400">{cities.length}</div>
                    <div className="text-xs text-muted-foreground">Cities</div>
                  </div>
                  <div className="bg-purple-500/10 p-3 rounded-lg">
                    <div className="text-xl font-bold text-purple-400">{iteration}</div>
                    <div className="text-xs text-muted-foreground">Steps</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Educational Content - Full Width */}
        <div className="glass-panel p-6 rounded-xl mt-6">
          <KMeansGameEducation
            k={k}
            cities={cities}
            clusters={clusters}
            iteration={iteration}
            convergenceData={convergenceData}
            gameLevel={gameLevel}
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full glass-panel border-t border-white/5 mt-auto">
        <div className="container py-4 px-4 md:px-8 text-center opacity-70">
          <p className="text-sm">
            K-Means Clustering City Builder • Interactive Machine Learning Game • Simulix
          </p>
        </div>
      </footer>
    </div>
  );
};

export default KMeansGame;
