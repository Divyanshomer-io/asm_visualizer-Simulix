
import React from "react";
import { InfoPanelProps } from "@/utils/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CheckCircle, Circle } from "lucide-react";

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
              <h4 className="font-medium">Key Concepts:</h4>
              <div className="flex items-start gap-2">
                <Circle size={16} className="min-w-4 mt-0.5 text-tsp-current" />
                <p><span className="font-medium">Temperature</span> - Controls the probability of accepting worse solutions.</p>
              </div>
              <div className="flex items-start gap-2">
                <Circle size={16} className="min-w-4 mt-0.5 text-tsp-current" />
                <p><span className="font-medium">Cooling Rate</span> - How quickly the temperature decreases.</p>
              </div>
              <div className="flex items-start gap-2">
                <Circle size={16} className="min-w-4 mt-0.5 text-tsp-current" />
                <p><span className="font-medium">Iterations</span> - Number of solution attempts.</p>
              </div>
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
                <CheckCircle size={16} className="min-w-4 mt-0.5 text-tsp-best" />
                <p>The blue dot represents the starting city.</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle size={16} className="min-w-4 mt-0.5 text-tsp-best" />
                <p>The orange line shows the current path being tested.</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle size={16} className="min-w-4 mt-0.5 text-tsp-best" />
                <p>The green line shows the best path found so far.</p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default InfoPanel;
