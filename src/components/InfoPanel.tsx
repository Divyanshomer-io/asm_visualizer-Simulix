
import React from "react";
import { InfoPanelProps } from "@/utils/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CheckCircle, Circle, Info } from "lucide-react";

const InfoPanel: React.FC<InfoPanelProps> = ({ state, params }) => {
  const formatDistance = (distance: number | undefined) => {
    if (distance === undefined) return "N/A";
    return distance.toFixed(2);
  };
  
  const percentImprovement = () => {
    if (state.distances.length <= 1 || !state.bestDistance) return 0;
    const initialDistance = state.distances[0];
    return ((initialDistance - state.bestDistance) / initialDistance * 100).toFixed(1);
  };
  
  const completionPercent = () => {
    if (state.totalIterations === 0) return 0;
    return (state.iteration / state.totalIterations * 100).toFixed(0);
  };
  
  return (
    <div className="glass-panel rounded-xl p-6 space-y-5">
      <h2 className="text-lg font-medium mb-2">Simulated Annealing Progress</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-panel rounded-lg p-3">
          <h3 className="text-xs uppercase opacity-70 mb-1">Current Distance</h3>
          <p className="text-xl font-light">{formatDistance(state.currentDistance)}</p>
        </div>
        
        <div className="glass-panel rounded-lg p-3">
          <h3 className="text-xs uppercase opacity-70 mb-1">Best Distance</h3>
          <p className="text-xl font-light text-tsp-best">{formatDistance(state.bestDistance)}</p>
        </div>
        
        <div className="glass-panel rounded-lg p-3">
          <h3 className="text-xs uppercase opacity-70 mb-1">Temperature</h3>
          <p className="text-xl font-light">{state.temperature.toFixed(1)}</p>
        </div>
        
        <div className="glass-panel rounded-lg p-3">
          <h3 className="text-xs uppercase opacity-70 mb-1">Improvement</h3>
          <p className="text-xl font-light">{percentImprovement()}%</p>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Progress</span>
          <span>
            {state.iteration} / {state.totalIterations} iterations
          </span>
        </div>
        <div className="w-full h-2 bg-secondary/30 rounded-full overflow-hidden">
          <div 
            className="h-full bg-accent transition-all duration-300"
            style={{ width: `${completionPercent()}%` }}
          ></div>
        </div>
      </div>
      
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="algorithm" className="border-white/10">
          <AccordionTrigger className="py-3 hover:no-underline text-sm font-medium">
            About Simulated Annealing
          </AccordionTrigger>
          <AccordionContent className="text-sm opacity-90 space-y-2">
            <p>
              Simulated Annealing is a probabilistic optimization algorithm inspired by the annealing process in metallurgy, 
              where metals are heated and then slowly cooled to reduce defects.
            </p>
            <p>
              The algorithm accepts worse solutions with a probability that decreases over time, 
              helping it escape local minima and find the global optimum.
            </p>
            <div className="mt-3 space-y-1.5">
              <h4 className="font-medium">Key Parameters:</h4>
              <div className="flex items-start gap-2">
                <Circle size={16} className="min-w-4 mt-0.5 text-tsp-current" />
                <p><span className="font-medium">Initial Temperature</span> - Higher values (1000-5000) increase exploration, allowing the algorithm to accept worse solutions more frequently in early iterations. Lower values (100-500) focus more on immediate improvement.</p>
              </div>
              <div className="flex items-start gap-2">
                <Circle size={16} className="min-w-4 mt-0.5 text-tsp-current" />
                <p><span className="font-medium">Cooling Rate</span> - Controls how quickly temperature decreases. Values closer to 1 (e.g., 0.99) cool slowly, allowing more exploration but requiring more iterations. Lower values (e.g., 0.8) cool quickly, converging faster but potentially missing global optima.</p>
              </div>
              <div className="flex items-start gap-2">
                <Circle size={16} className="min-w-4 mt-0.5 text-tsp-current" />
                <p><span className="font-medium">Iterations</span> - More iterations allow thorough exploration of the solution space but increase computation time. For complex problems, 5000+ iterations may be necessary.</p>
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-white/10">
              <h4 className="font-medium flex items-center gap-1.5">
                <Info size={14} className="text-primary" />
                Mathematical Model:
              </h4>
              <p className="mt-1.5">
                The probability of accepting a worse solution is calculated as: 
                <code className="bg-secondary/50 px-1.5 py-0.5 rounded ml-1 font-mono">
                  P = exp((currentDistance - newDistance) / temperature)
                </code>
              </p>
              <p className="mt-1.5">
                As temperature decreases with each iteration (T = T * coolingRate), the probability of accepting worse solutions diminishes, focusing the search on improvements.
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="tsp" className="border-white/10">
          <AccordionTrigger className="py-3 hover:no-underline text-sm font-medium">
            About the TSP Problem
          </AccordionTrigger>
          <AccordionContent className="text-sm opacity-90 space-y-2">
            <p>
              The Traveling Salesman Problem (TSP) is a classic optimization problem where a 
              salesman must visit a set of cities and return to the starting city, finding the 
              shortest possible route.
            </p>
            <p>
              This is an NP-hard problem, meaning there's no known efficient algorithm to find the 
              exact solution for large numbers of cities.
            </p>
            <div className="mt-3 space-y-1.5">
              <div className="flex items-start gap-2">
                <CheckCircle size={16} className="min-w-4 mt-0.5 text-tsp-start" />
                <p>The blue dot represents the starting city.</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle size={16} className="min-w-4 mt-0.5 text-tsp-current" />
                <p>The orange line shows the current path being tested.</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle size={16} className="min-w-4 mt-0.5 text-tsp-best" />
                <p>The green line shows the best path found so far.</p>
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-white/10">
              <h4 className="font-medium">Technical Details:</h4>
              <p className="mt-1.5">
                For a TSP with n cities, there are (n-1)!/2 possible routes. The algorithm works by randomly swapping cities in the current path and using the temperature parameter to accept or reject changes based on their impact on total distance.
              </p>
              <p className="mt-1.5">
                The solution quality heavily depends on parameter tuning:
              </p>
              <ul className="list-disc list-inside mt-1.5 space-y-1 pl-2">
                <li>For complex city layouts, use higher initial temperatures and slower cooling</li>
                <li>For simple layouts, faster cooling works well</li>
                <li>For near-optimal solutions, increase iterations significantly</li>
              </ul>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default InfoPanel;
