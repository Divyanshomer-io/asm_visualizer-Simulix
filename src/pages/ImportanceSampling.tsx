
import React, { useState } from "react";
import { toast } from "sonner";
import ImportanceSamplingVisualization from "@/components/ImportanceSamplingVisualization";
import ImportanceSamplingControls from "@/components/ImportanceSamplingControls";
import ImportanceSamplingEducation from "@/components/ImportanceSamplingEducation";
import { ImportanceSamplingParams, DEFAULT_PARAMS } from "@/utils/importanceSampling";

const ImportanceSampling: React.FC = () => {
  const [params, setParams] = useState<ImportanceSamplingParams>(DEFAULT_PARAMS);
  const [visualizationKey, setVisualizationKey] = useState(0);

  const handleUpdate = () => {
    setVisualizationKey(prev => prev + 1);
    toast.success("Visualizations updated successfully!");
  };

  const handleReset = () => {
    setParams(DEFAULT_PARAMS);
    setVisualizationKey(prev => prev + 1);
    toast.info("Parameters reset to default values");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="container max-w-7xl mx-auto px-4 py-6">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Importance Sampling Visualization
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Explore Standard and Normalized Importance Sampling techniques with interactive visualizations and parameter controls
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-8">
          {/* Visualizations */}
          <div className="xl:col-span-3">
            <ImportanceSamplingVisualization 
              key={visualizationKey}
              params={params}
            />
          </div>

          {/* Control Panel */}
          <div className="xl:col-span-1">
            <ImportanceSamplingControls
              params={params}
              onParamsChange={setParams}
              onUpdate={handleUpdate}
              onReset={handleReset}
            />
          </div>
        </div>

        {/* Educational Content */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">
              Learn About Importance Sampling
            </h2>
            <p className="text-slate-300">
              Understand the theory, parameters, and practical applications
            </p>
          </div>
          
          <ImportanceSamplingEducation />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-800 text-center py-4 mt-8">
        <p className="text-slate-300 text-sm">
          Applied Statistical Mathematics • Interactive Visualizations • Advanced Monte Carlo Methods
        </p>
      </footer>
    </div>
  );
};

export default ImportanceSampling;
