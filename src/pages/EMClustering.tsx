
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Home } from "lucide-react";
import EMClusteringVisualization from "@/components/EMClusteringVisualization";
import EMClusteringControls from "@/components/EMClusteringControls";
import EMClusteringEducation from "@/components/EMClusteringEducation";
import { EMClusteringParams, DEFAULT_EM_PARAMS } from "@/utils/emClustering";

const EMClustering: React.FC = () => {
  const [params, setParams] = useState<EMClusteringParams>(DEFAULT_EM_PARAMS);
  const [visualizationKey, setVisualizationKey] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const handleUpdate = () => {
    setVisualizationKey(prev => prev + 1);
    toast.success("EM clustering parameters updated successfully!");
  };

  const handleReset = () => {
    setParams(DEFAULT_EM_PARAMS);
    setIsRunning(false);
    setVisualizationKey(prev => prev + 1);
    toast.info("Parameters reset to default values");
  };

  const handleStartEM = () => {
    setIsRunning(true);
    console.log(`🚀 Starting EM algorithm with ${params.maxIterations} max iterations...`);
    toast.success("EM algorithm started!");
  };

  const handleStopEM = () => {
    setIsRunning(false);
    toast.info("EM algorithm stopped");
  };

  return (
    <div className="min-h-screen bg-background text-foreground antialiased overflow-x-hidden">
      {/* Header */}
      <header className="w-full glass-panel border-b border-white/5 mb-8">
        <div className="container py-6 px-4 md:px-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-light tracking-tight">
              EM Clustering Visualization
              <span className="text-sm ml-3 opacity-70 font-normal">
                3D Distributions & 2D Convergence
              </span>
            </h1>
            <p className="text-sm opacity-70">Expectation-Maximization Algorithm Training & Visualization</p>
          </div>
          <Link to="/" className="control-btn flex items-center gap-2 text-sm">
            <Home className="h-4 w-4" />
            Back to Visualizations
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 md:px-8 pb-16">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-8">
          {/* Visualizations */}
          <div className="xl:col-span-3">
            <EMClusteringVisualization 
              key={visualizationKey}
              params={params}
              isRunning={isRunning}
              onConvergence={() => setIsRunning(false)}
              onMaxIterations={() => setIsRunning(false)}
            />
          </div>

          {/* Control Panel */}
          <div className="xl:col-span-1">
            <EMClusteringControls
              params={params}
              onParamsChange={setParams}
              onUpdate={handleUpdate}
              onReset={handleReset}
              onStartEM={handleStartEM}
              onStopEM={handleStopEM}
              isRunning={isRunning}
            />
          </div>
        </div>

        {/* Educational Content */}
        <div className="w-full">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">
              Learn About EM Clustering
            </h2>
            <p className="text-slate-300">
              Understand the Expectation-Maximization algorithm, Gaussian mixture models, and clustering convergence
            </p>
          </div>
          
          <EMClusteringEducation />
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full glass-panel border-t border-white/5 mt-auto">
        <div className="container py-4 px-4 md:px-8 text-center">
          <p className="text-sm opacity-70">
            <span className="inline-block">Applied Statistical Mathematics • Interactive Visualizations</span>
            <span className="mx-2">•</span>
            <span className="inline-block">BITS Pilani, K.K. Birla Goa Campus</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default EMClustering;
