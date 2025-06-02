
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ErrorBoundary from "@/components/ErrorBoundary";
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
import BiasVarianceTradeoff from "./pages/BiasVarianceTradeoff";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import { Analytics } from "@vercel/analytics/next"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ErrorBoundary>
      <TooltipProvider>
        <ErrorBoundary>
          <Toaster />
          <Sonner />
        </ErrorBoundary>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/simulator" element={
              <ErrorBoundary>
                <Simulator />
              </ErrorBoundary>
            } />
            <Route path="/simulated-annealing-toy" element={
              <ErrorBoundary>
                <SimulatedAnnealingToy />
              </ErrorBoundary>
            } />
            <Route path="/alias-method" element={
              <ErrorBoundary>
                <AliasMethod />
              </ErrorBoundary>
            } />
            <Route path="/bootstrapping" element={
              <ErrorBoundary>
                <Bootstrapping />
              </ErrorBoundary>
            } />
            <Route path="/huber-mean" element={
              <ErrorBoundary>
                <HuberMean />
              </ErrorBoundary>
            } />
            <Route path="/importance-sampling" element={
              <ErrorBoundary>
                <ImportanceSampling />
              </ErrorBoundary>
            } />
            <Route path="/neural-network" element={
              <ErrorBoundary>
                <NeuralNetwork />
              </ErrorBoundary>
            } />
            <Route path="/random-forest" element={
              <ErrorBoundary>
                <RandomForest />
              </ErrorBoundary>
            } />
            <Route path="/em-clustering" element={
              <ErrorBoundary>
                <EMClustering />
              </ErrorBoundary>
            } />
            <Route path="/deep-rl" element={
              <ErrorBoundary>
                <DeepRL />
              </ErrorBoundary>
            } />
            <Route path="/bias-variance" element={
              <ErrorBoundary>
                <BiasVarianceTradeoff />
              </ErrorBoundary>
            } />
            <Route path="/about" element={
              <ErrorBoundary>
                <About />
              </ErrorBoundary>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={
              <ErrorBoundary>
                <NotFound />
              </ErrorBoundary>
            } />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ErrorBoundary>
  </QueryClientProvider>
);

export default App;
