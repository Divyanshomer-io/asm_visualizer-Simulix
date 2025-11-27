import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import PairsTradingVisualization from "@/components/PairsTradingVisualization";
import PairsTradingControls, { PairsTradingParams } from "@/components/PairsTradingControls";
import PairsTradingEducation from "@/components/PairsTradingEducation";
import { ThresholdLevels } from "@/utils/pairsTrading";

const DEFAULT_PARAMS: PairsTradingParams = {
  stockA: "CIPLA.NS",
  stockB: "LUPIN.NS",
  rollingWindow: 120,
  lowerQuantile: 0.05,
  upperQuantile: 0.95,
  period: 'training'
};

const PairsTrading: React.FC = () => {
  const [params, setParams] = useState<PairsTradingParams>(DEFAULT_PARAMS);
  const [thresholds, setThresholds] = useState<ThresholdLevels | null>(null);
  const [analysisKey, setAnalysisKey] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleRunAnalysis = () => {
    setIsAnalyzing(true);
    setAnalysisKey(prev => prev + 1);
    toast.success("Analysis updated!");
    setTimeout(() => setIsAnalyzing(false), 500);
  };

  const handleReset = () => {
    setParams(DEFAULT_PARAMS);
    setAnalysisKey(prev => prev + 1);
    toast.info("Parameters reset to default values");
  };

  return (
    <div className="min-h-screen bg-background text-foreground antialiased overflow-x-hidden">
      {/* Header */}
      <header className="w-full glass-panel border-b border-white/5 mb-8">
        <div className="container py-6 px-4 md:px-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-light tracking-tight">
              Pairs Trading
              <span className="text-sm ml-3 opacity-70 font-normal">
                Cointegration Strategy
              </span>
            </h1>
            <p className="text-sm opacity-70">Statistical Arbitrage with Mean-Reverting Spreads</p>
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
            <PairsTradingVisualization 
              key={analysisKey}
              params={params}
              onThresholdsCalculated={setThresholds}
              analysisKey={analysisKey}
            />
          </div>

          {/* Control Panel */}
          <div className="xl:col-span-1">
            <PairsTradingControls
              params={params}
              onParamsChange={setParams}
              onRunAnalysis={handleRunAnalysis}
              onReset={handleReset}
              thresholds={thresholds}
              isAnalyzing={isAnalyzing}
            />
          </div>
        </div>

        {/* Educational Content */}
        <div className="w-full">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">
              Learn About Pairs Trading
            </h2>
            <p className="text-slate-300">
              Understand cointegration, spread construction, and signal generation
            </p>
          </div>
          
          <PairsTradingEducation />
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

export default PairsTrading;
