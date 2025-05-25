
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Play, Pause, RotateCcw, ChevronRight } from "lucide-react";
import { performIRLSIteration, calculateMean } from "@/utils/irlsUtils";
import DataVisualization from "./DataVisualization";
import WeightsVisualization from "./WeightsVisualization";
import ConvergenceChart from "./ConvergenceChart";

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
    <div className="container max-w-5xl mx-auto px-4 py-6 space-y-6 animate-fade-in">
      <Card className="glass-panel">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-gradient">
            Huber M-Estimator with IRLS
          </CardTitle>
          <p className="text-muted-foreground">
            Visualizing the Iterative Reweighted Least Squares algorithm using the Huber function
            to obtain robust estimates in the presence of outliers.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="data-input" className="text-sm font-medium">Data (comma separated)</Label>
                <div className="flex gap-2">
                  <Input
                    id="data-input"
                    value={dataInput}
                    onChange={(e) => setDataInput(e.target.value)}
                    placeholder="Enter numeric data separated by commas"
                    className="flex-1 input-field"
                  />
                  <Button onClick={parseDataInput} className="control-btn">Update</Button>
                </div>
              </div>
              
              <div>
                <Label htmlFor="initial-estimate" className="text-sm font-medium">Initial Estimate (μ₀)</Label>
                <Input
                  id="initial-estimate"
                  type="number"
                  value={initialEstimate}
                  onChange={(e) => setInitialEstimate(parseFloat(e.target.value) || 0)}
                  className="w-full input-field"
                />
              </div>
              
              <div>
                <Label htmlFor="k-value" className="text-sm font-medium">Tuning Constant (k)</Label>
                <Input
                  id="k-value"
                  type="number"
                  value={k}
                  onChange={(e) => setK(parseFloat(e.target.value) || 1)}
                  className="w-full input-field"
                />
              </div>

              <div>
                <Label htmlFor="max-iterations" className="text-sm font-medium">Maximum Iterations</Label>
                <Input
                  id="max-iterations"
                  type="number"
                  value={maxIterations}
                  onChange={(e) => setMaxIterations(parseInt(e.target.value) || 10)}
                  className="w-full input-field"
                />
              </div>

              <div>
                <Label htmlFor="convergence-threshold" className="text-sm font-medium">Convergence Threshold</Label>
                <Input
                  id="convergence-threshold"
                  type="number"
                  value={convergenceThreshold}
                  onChange={(e) => setConvergenceThreshold(parseFloat(e.target.value) || 0.001)}
                  step="0.0001"
                  className="w-full input-field"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium mb-1">Auto Mode</h3>
                  <p className="text-sm text-muted-foreground">Run iterations automatically</p>
                </div>
                <Switch checked={isAutoMode} onCheckedChange={toggleAutoMode} />
              </div>
              
              {isAutoMode && (
                <div>
                  <Label htmlFor="iteration-speed" className="text-sm font-medium">Iteration Speed (ms)</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      id="iteration-speed"
                      min={200}
                      max={2000}
                      step={100}
                      value={[iterationSpeed]}
                      onValueChange={(value) => setIterationSpeed(value[0])}
                      className="flex-1"
                    />
                    <span className="text-sm">{iterationSpeed}ms</span>
                  </div>
                </div>
              )}
              
              <div className="flex flex-wrap gap-2 mt-4">
                <Button
                  onClick={performIteration}
                  disabled={isAutoMode || currentIteration >= maxIterations || hasConverged}
                  className="control-btn-primary flex items-center gap-2"
                >
                  <ChevronRight size={18} />
                  Next Iteration
                </Button>
                
                <Button
                  onClick={toggleAutoMode}
                  variant={isAutoMode ? "destructive" : "default"}
                  className="control-btn flex items-center gap-2"
                  disabled={currentIteration >= maxIterations || hasConverged}
                >
                  {isAutoMode ? <Pause size={18} /> : <Play size={18} />}
                  {isAutoMode ? "Pause" : "Auto Run"}
                </Button>
                
                <Button
                  onClick={resetSimulation}
                  variant="outline"
                  className="control-btn flex items-center gap-2"
                >
                  <RotateCcw size={18} />
                  Reset
                </Button>
              </div>

              <Separator className="my-4" />
              
              <div className="space-y-2 p-4 glass-panel rounded-lg">
                <p className="text-sm"><strong>Iteration:</strong> {currentIteration} / {maxIterations}</p>
                <p className="text-sm"><strong>Current Estimate (μ{currentIteration}):</strong> {currentEstimate.toFixed(4)}</p>
                <p className="text-sm"><strong>Simple Mean:</strong> {simpleMean.toFixed(4)}</p>
                <p className="text-sm"><strong>Status:</strong> {hasConverged ? "Converged ✓" : "Running..."}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
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

      <Card className="glass-panel">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">About the IRLS Algorithm</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            The Iterative Reweighted Least Squares (IRLS) algorithm is used to compute M-estimators, which are a class of robust estimators that are less sensitive to outliers.
          </p>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground"><strong>Huber Function (ρ):</strong> Combines the best properties of squared error for normally distributed data and absolute error for outliers.</p>
            <div className="p-3 bg-secondary/20 rounded-md text-sm">
              <p>ρ(x) = x² if |x| ≤ k</p>
              <p>ρ(x) = 2k|x| - k² if |x| &gt; k</p>
            </div>
            <p className="text-sm text-muted-foreground mt-2"><strong>Weight Function (ψ/r):</strong> Determines how much influence each data point has on the final estimate.</p>
            <div className="p-3 bg-secondary/20 rounded-md text-sm">
              <p>ψ(r) = -2k if r &lt; -k</p>
              <p>ψ(r) = 2r if |r| ≤ k</p>
              <p>ψ(r) = 2k if r &gt; k</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IRLSVisualizer;
