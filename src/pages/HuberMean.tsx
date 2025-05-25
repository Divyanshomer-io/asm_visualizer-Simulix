import { TooltipProvider } from "@/components/ui/tooltip";
import IRLSVisualizer from "@/components/IRLSVisualizer";

const HuberMean = () => {
  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        <IRLSVisualizer />
        <footer className="container max-w-5xl mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          <p>
            Huber M-Estimator with Iterative Reweighted Least Squares (IRLS) Visualization
          </p>
        </footer>
      </div>
    </TooltipProvider>
  );
};

export default HuberMean;
