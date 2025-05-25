import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { performIRLSIteration, calculateMean } from "@/utils/irlsUtils";
import DataVisualization from "./DataVisualization";
import WeightsVisualization from "./WeightsVisualization";
import ConvergenceChart from "./ConvergenceChart";
import HuberControls from "./HuberControls";
import HuberEducationalPanels from "./HuberEducationalPanels";

interface ConvergenceData {
  iteration: number;
  estimate: number;
}

const IRLSVisualizer: React.FC = () => {
  const [dataInput, setDataInput] = useState<string>("1, 1, 2, 3, 2, 3, 50, 100");
  const [data, setData] = useState<number[]>([1, 1, 2, 3, 2, 3, 50, 100]);
  const [initialEstimate, setInitialEstimate] = useState<number>(20);
  const [k, setK] = useState<number>(5);
  const [maxIterations, setMaxIterations] = useState<number>(10);
  const [currentIteration, setCurrentIteration] = useState<number>(0);
  const [currentEstimate, setCurrentEstimate] = useState<number>(20);
  const [weights, setWeights] = useState<number[]>([]);
  const [residuals, setResiduals] = useState<number[]>([]);
  const [isAutoMode, setIsAutoMode] = useState<boolean>(false);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [iterationSpeed, setIterationSpeed] = useState<number>(1000);
  const [convergenceHistory, setConvergenceHistory] = useState<ConvergenceData[]>([{ iteration: 0, estimate: 20 }]);
  const [convergenceThreshold, setConvergenceThreshold] = useState<number>(0.001);
  const [hasConverged, setHasConverged] = useState<boolean>(false);

  useEffect(() => {
    if (data.length > 0) {
      setWeights(Array(data.length).fill(1));
      setResiduals(data.map(val => val - currentEstimate));
      setConvergenceHistory([{ iteration: 0, estimate: initialEstimate }]);
      setCurrentEstimate(initialEstimate);
      setCurrentIteration(0);
      setHasConverged(false);
    }
  }, [data, initialEstimate]);

  const parseDataInput = useCallback(() => {
    try {
      const parsedData = dataInput
        .split(',')
        .map(val => parseFloat(val.trim()))
        .filter(val => !isNaN(val));
      
      if (parsedData.length === 0) {
        toast.error("Please enter valid numeric data separated by commas");
        return;
      }
      
      setData(parsedData);
      resetSimulation();
      toast.success("Data updated successfully");
    } catch (error) {
      toast.error("Error parsing data. Please check your input.");
    }
  }, [dataInput]);

  const performIteration = useCallback(() => {
    if (currentIteration >= maxIterations) {
      setIsRunning(false);
      setIsAutoMode(false);
      toast.info("Maximum iterations reached");
      return;
    }

    const result = performIRLSIteration(data, currentEstimate, k);
    const { newEstimate, weights: newWeights, residuals: newResiduals } = result;
    
    setWeights(newWeights);
    setResiduals(newResiduals);
    setCurrentEstimate(newEstimate);
    setCurrentIteration(prev => prev + 1);
    
    const newHistory = [...convergenceHistory, { iteration: currentIteration + 1, estimate: newEstimate }];
    setConvergenceHistory(newHistory);

    if (Math.abs(newEstimate - currentEstimate) < convergenceThreshold) {
      if (!hasConverged) {
        toast.success("Algorithm has converged!");
        setHasConverged(true);
        if (isAutoMode) {
          setIsRunning(false);
          setIsAutoMode(false);
        }
      }
    }
  }, [currentIteration, maxIterations, data, currentEstimate, k, convergenceHistory, convergenceThreshold, hasConverged, isAutoMode]);

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;
    
    if (isAutoMode && isRunning) {
      intervalId = setInterval(() => {
        performIteration();
      }, iterationSpeed);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isAutoMode, isRunning, performIteration, iterationSpeed]);

  const resetSimulation = () => {
    setCurrentEstimate(initialEstimate);
    setWeights(Array(data.length).fill(1));
    setResiduals(data.map(val => val - initialEstimate));
    setCurrentIteration(0);
    setConvergenceHistory([{ iteration: 0, estimate: initialEstimate }]);
    setIsRunning(false);
    setIsAutoMode(false);
    setHasConverged(false);
    toast.info("Simulation reset");
  };

  const toggleAutoMode = () => {
    if (!isAutoMode) {
      setIsAutoMode(true);
      setIsRunning(true);
      if (currentIteration >= maxIterations) {
        resetSimulation();
      }
    } else {
      setIsAutoMode(false);
      setIsRunning(false);
    }
  };

  const simpleMean = calculateMean(data);

  return (
    

      <div className="container max-w-7xl mx-auto px-4 py-6 space-y-6 animate-fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left side - Visualizations */}
          <div className="lg:col-span-2 space-y-6">
            <ConvergenceChart iterations={convergenceHistory} />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <DataVisualization
                data={data}
                weights={weights}
                currentEstimate={currentEstimate}
                iteration={currentIteration}
                k={k}
              />
              <WeightsVisualization
                data={data}
                weights={weights}
                currentEstimate={currentEstimate}
                k={k}
              />
            </div>
          </div>

          {/* Right side - Controls */}
          <div className="lg:col-span-1">
            <HuberControls
              dataInput={dataInput}
              setDataInput={setDataInput}
              initialEstimate={initialEstimate}
              setInitialEstimate={setInitialEstimate}
              k={k}
              setK={setK}
              maxIterations={maxIterations}
              setMaxIterations={setMaxIterations}
              convergenceThreshold={convergenceThreshold}
              setConvergenceThreshold={setConvergenceThreshold}
              isAutoMode={isAutoMode}
              setIsAutoMode={setIsAutoMode}
              iterationSpeed={iterationSpeed}
              setIterationSpeed={setIterationSpeed}
              currentIteration={currentIteration}
              currentEstimate={currentEstimate}
              simpleMean={simpleMean}
              hasConverged={hasConverged}
              onParseData={parseDataInput}
              onPerformIteration={performIteration}
              onToggleAutoMode={toggleAutoMode}
              onReset={resetSimulation}
              isRunning={isRunning}
            />
          </div>
        </div>

        {/* Educational content panels */}
        <HuberEducationalPanels />
      </div>

      {/* Footer matching the style from second image */}
      <footer className="bg-slate-800 text-center py-4 mt-8">
        <p className="text-slate-300 text-sm">
          Applied Statistical Mathematics • Interactive Visualizations • BITS Pilani, K.K. Birla Goa Campus
        </p>
      </footer>
    </div>
  );
};

export default IRLSVisualizer;
