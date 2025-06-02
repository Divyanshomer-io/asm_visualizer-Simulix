
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import BiasVarianceVisualization from "@/components/BiasVarianceVisualization";
import BiasVarianceControls from "@/components/BiasVarianceControls";
import BiasVarianceEducation from "@/components/BiasVarianceEducation";
import { BiasVarianceParams, DEFAULT_PARAMS } from "@/utils/biasVariance";

const BiasVarianceTradeoff: React.FC = () => {
  const [params, setParams] = useState<BiasVarianceParams>(DEFAULT_PARAMS);
  const [visualizationKey, setVisualizationKey] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleUpdate = () => {
    setVisualizationKey(prev => prev + 1);
    toast.success("Bias-Variance visualizer updated successfully!");
  };

  const handleReset = () => {
    setParams(DEFAULT_PARAMS);
    setIsPlaying(false);
    setVisualizationKey(prev => prev + 1);
    toast.info("Parameters reset to default values");
  };

  const handlePlay = () => {
    setIsPlaying(true);
    toast.success("Starting automatic iteration");
  };

  const handlePause = () => {
    setIsPlaying(false);
    toast.info("Animation paused");
  };

  return (
    <div className="min-h-screen bg-background text-foreground antialiased overflow-x-hidden">
      {/* Header */}
      <header className="w-full glass-panel border-b border-white/5 mb-8">
        <div className="container py-6 px-4 md:px-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-light tracking-tight">
              Bias-Variance Tradeoff Visualizer
              <span className="text-sm ml-3 opacity-70 font-normal">
                Interactive Learning
              </span>
            </h1>
            <p className="text-sm opacity-70">Advanced Model Complexity Analysis</p>
          </div>
          <Link to="/" className="control-btn flex items-center gap-2 text-sm">
            <ArrowLeft className="h-4 w-4" />
            Back to Visualizations
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 md:px-8 pb-16">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-8">
          {/* Visualizations */}
          <div className="xl:col-span-3">
            <BiasVarianceVisualization 
              key={visualizationKey}
              params={params}
              isPlaying={isPlaying}
              onIterationUpdate={(iteration) => setParams(prev => ({ ...prev, currentIteration: iteration }))}
            />
          </div>

          {/* Control Panel */}
          <div className="xl:col-span-1">
            <BiasVarianceControls
              params={params}
              onParamsChange={setParams}
              onUpdate={handleUpdate}
              onReset={handleReset}
              onPlay={handlePlay}
              onPause={handlePause}
              isPlaying={isPlaying}
            />
          </div>
        </div>

        {/* Educational Content */}
        <div className="w-full">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">
              Learn About Bias-Variance Tradeoff
            </h2>
            <p className="text-slate-300">
              Understand model complexity, overfitting, and the fundamental tradeoff in machine learning
            </p>
          </div>
          
          <BiasVarianceEducation />
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

export default BiasVarianceTradeoff;
