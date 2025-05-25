import { TooltipProvider } from "@/components/ui/tooltip";
import IRLSVisualizer from "@/components/IRLSVisualizer";

const HuberMean = () => {
  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        <IRLSVisualizer />
      </div>
    </TooltipProvider>
  );
};

export default HuberMean;
