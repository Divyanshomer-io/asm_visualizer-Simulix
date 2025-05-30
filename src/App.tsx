import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Simulator from "./pages/Simulator";
import SimulatedAnnealingToy from "./pages/SimulatedAnnealingToy";
import AliasMethod from "./pages/AliasMethod";
import Bootstrapping from "./pages/Bootstrapping";
import HuberMean from "./pages/HuberMean";
import ImportanceSampling from "./pages/ImportanceSampling";
import NeuralNetwork from "./pages/NeuralNetwork";
import RandomForest from "./pages/RandomForest";
import EMClustering from "./pages/EMClustering";
import DeepRL from "./pages/DeepRL";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import { Analytics } from "@vercel/analytics/next"

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/simulator" element={<Simulator />} />
          <Route path="/simulated-annealing-toy" element={<SimulatedAnnealingToy />} />
          <Route path="/alias-method" element={<AliasMethod />} />
          <Route path="/bootstrapping" element={<Bootstrapping />} />
          <Route path="/huber-mean" element={<HuberMean />} />
          <Route path="/importance-sampling" element={<ImportanceSampling />} />
          <Route path="/neural-network" element={<NeuralNetwork />} />
          <Route path="/random-forest" element={<RandomForest />} />
          <Route path="/em-clustering" element={<EMClustering />} />
          <Route path="/deep-rl" element={<DeepRL />} />
          <Route path="/about" element={<About />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
