
import { TooltipProvider } from "@/components/ui/tooltip";
import IRLSVisualizer from "@/components/IRLSVisualizer";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";

const HuberMean = () => {
  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background text-foreground antialiased overflow-x-hidden">
        {/* Header */}
        <header className="w-full glass-panel border-b border-white/5 mb-8">
          <div className="container py-6 px-4 md:px-8 flex justify-between items-center">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                Huber M-Estimator
                <span className="text-sm ml-3 opacity-70 font-normal">
                  Visualization
                </span>
              </h1>
              <p className="text-sm opacity-70">Iteratively Reweighted Least Squares (IRLS) Demo</p>
            </div>
            <Link to="/" className="control-btn flex items-center gap-2 text-sm">
              <Home className="h-4 w-4" />
              Back to Visualizations
            </Link>
          </div>
        </header>

        {/* Main content */}
        <main className="container px-4 md:px-8 pb-16">
          <IRLSVisualizer />
        </main>
      </div>
    </TooltipProvider>
  );
};

export default HuberMean;
