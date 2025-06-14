
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Home, MapPin, Users, Target, Brain, BarChart3 } from "lucide-react";
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
      <header className="w-full glass-panel border-b border-white/5 sticky top-0 z-50 backdrop-blur-xl">
        <div className="container py-6 px-4 md:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-4">
                {/* Logo */}
                <div className="relative group">
                  <div className="absolute -inset-2 bg-gradient-to-r from-accent/20 via-blue-500/20 to-purple-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                  <img 
                    src="/social-preview.png" 
                    alt="Simulix Logo" 
                    className="relative h-12 w-12 md:h-14 md:w-14 object-contain transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 filter drop-shadow-lg group-hover:drop-shadow-2xl group-hover:brightness-110"
                    style={{
                      filter: 'drop-shadow(0 4px 12px rgba(56, 189, 248, 0.3)) brightness(1.1)'
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-accent/10 to-blue-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
                </div>
                
                {/* Simulix Text */}
                <div className="relative">
                  <span
                    className="simulix-logo text-3xl md:text-4xl font-black tracking-tight transition-all duration-500 hover:scale-105"
                    style={{
                      background: 'linear-gradient(135deg, #fff 0%, #38bdf8 50%, #818cf8 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      filter: 'drop-shadow(0 2px 8px rgba(56, 189, 248, 0.3))',
                    }}
                  >
                    Simulix
                  </span>
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
                </div>
              </div>
              
              {/* Game Title */}
              <div className="hidden md:flex items-center gap-3 px-4 py-2 glass-panel rounded-full">
                <MapPin className="h-5 w-5 text-accent" />
                <span className="text-lg font-semibold bg-gradient-to-r from-accent via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  K-Means City Builder
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="control-btn flex items-center gap-2 text-sm hover:border-accent/40"
              >
                <Home className="h-4 w-4" />
                Home
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 container px-4 md:px-8 py-8">
        {/* City Builder Map and Control Panel Row */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* City Builder Map - Left 3 columns */}
          <div className="lg:col-span-3">
            <div className="glass-panel p-6 rounded-xl">
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
          </div>

          {/* Control Panel - Right 1 column */}
          <div className="space-y-6">
            <div className="glass-panel p-6 rounded-xl">
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
            </div>
          </div>
        </div>

        {/* K-Means Learning Center and Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-0 mb-8">
          {/* K-Means Learning Center - Left 3 columns */}
          <div className="lg:col-span-3">
            <div className="glass-panel p-6 rounded-xl">
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

          {/* Additional Info Panel - Right 1 column */}
          <div className="space-y-6">
            <div className="glass-panel p-6 rounded-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500/20 to-cyan-500/20 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-green-400" />
                </div>
                <h3 className="text-xl font-semibold">Quick Stats</h3>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  <div className="bg-accent/10 p-3 rounded-lg">
                    <div className="text-2xl font-bold text-accent">{gameScore}</div>
                    <div className="text-xs text-muted-foreground">Total Score</div>
                  </div>
                  <div className="bg-blue-500/10 p-3 rounded-lg">
                    <div className="text-2xl font-bold text-blue-400">{gameLevel}</div>
                    <div className="text-xs text-muted-foreground">Current Level</div>
                  </div>
                  <div className="bg-green-500/10 p-3 rounded-lg">
                    <div className="text-2xl font-bold text-green-400">{cities.length}</div>
                    <div className="text-xs text-muted-foreground">Cities Placed</div>
                  </div>
                  <div className="bg-purple-500/10 p-3 rounded-lg">
                    <div className="text-2xl font-bold text-purple-400">{iteration}</div>
                    <div className="text-xs text-muted-foreground">Algorithm Steps</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Educational Content - Full Width */}
        <div className="glass-panel p-6 rounded-xl">
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
