import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Play, Pause, RefreshCw, BarChart3, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TooltipProvider } from "@/components/ui/tooltip";
import { generateOriginalData, generateBootstrapSamples, computeStatistic, calculateConfidenceInterval, calculateBiasAndMSE, generateNormalData } from "@/utils/bootstrapping";
import BootstrapVisualization from "@/components/BootstrapVisualization";
import BootstrapControls from "@/components/BootstrapControls";
import BootstrapEducationalPanels from "@/components/BootstrapEducationalPanels";

export interface BootstrapState {
  originalData: number[];
  currentStatValues: number[];
  currentIteration: number;
  isRunning: boolean;
  animationSpeed: number;
  showCI: boolean;
  showNormalFit: boolean;
  useIntegerData: boolean;
  integerDataRange: { min: number; max: number; step: number };
}

export interface BootstrapParams {
  sampleSize: number;
  numBootstrapSamples: number;
  statistic: 'mean' | 'median';
  confidenceLevel: number;
  forceIntegerData: boolean;
  dataGenerationMode: 'manual' | 'integer-sequence';
}

const Bootstrapping: React.FC = () => {
  const [state, setState] = useState<BootstrapState>({
    originalData: generateNormalData(50, 10, 50),
    currentStatValues: [],
    currentIteration: 0,
    isRunning: false,
    animationSpeed: 50,
    showCI: true,
    showNormalFit: false,
    useIntegerData: false,
    integerDataRange: { min: 1, max: 10, step: 1 },
  });

  const [params, setParams] = useState<BootstrapParams>({
    sampleSize: 30,
    numBootstrapSamples: 500,
    statistic: 'mean',
    confidenceLevel: 0.95,
    forceIntegerData: false,
    dataGenerationMode: 'manual',
  });

  // Enhanced input validation state
  const [inputValues, setInputValues] = useState({
    min: state.integerDataRange.min.toString(),
    max: state.integerDataRange.max.toString(),
  });
  const [inputErrors, setInputErrors] = useState({ min: '', max: '' });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const performBootstrapSample = (originalData: number[], statistic: string): number => {
    const bootstrapSample = Array.from({ length: originalData.length }, () => {
      const randomIndex = Math.floor(Math.random() * originalData.length);
      return originalData[randomIndex];
    });
    
    if (statistic === 'mean') {
      return bootstrapSample.reduce((a, b) => a + b, 0) / bootstrapSample.length;
    } else if (statistic === 'median') {
      const sorted = [...bootstrapSample].sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      return sorted.length % 2 === 0 
        ? (sorted[mid - 1] + sorted[mid]) / 2 
        : sorted[mid];
    }
    return 0;
  };

  const generateIntegerSequenceData = () => {
    const { min, max } = state.integerDataRange;
    const sequenceData = Array.from({ length: max - min + 1 }, (_, i) => min + i);
    setState(prev => ({ ...prev, originalData: sequenceData }));
    resetBootstrap();
  };

  const getClassicMeanMSE = (): number => {
    const trueMean = state.originalData.reduce((a, b) => a + b, 0) / state.originalData.length;
    const sampleVariance = state.originalData.reduce((acc, val) => 
      acc + Math.pow(val - trueMean, 2), 0) / state.originalData.length;
    
    return sampleVariance / state.originalData.length;
  };

  const generateNewData = () => {
    let newData: number[];
    
    if (params.forceIntegerData) {
      const { min, max } = state.integerDataRange;
      newData = Array.from({ length: 50 }, () => 
        Math.floor(Math.random() * (max - min + 1)) + min
      );
    } else {
      newData = generateNormalData(50, 10, 50);
    }
    
    setState(prev => ({ 
      ...prev, 
      originalData: newData,
      currentStatValues: [],
      currentIteration: 0
    }));
  };

  const resetBootstrap = () => {
    setState(prev => ({
      ...prev,
      currentStatValues: [],
      currentIteration: 0,
      isRunning: false
    }));
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const performBootstrapIteration = () => {
    if (state.currentIteration >= params.numBootstrapSamples) {
      setState(prev => ({ ...prev, isRunning: false }));
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    const newStat = performBootstrapSample(state.originalData, params.statistic);
    
    setState(prev => ({
      ...prev,
      currentStatValues: [...prev.currentStatValues, newStat],
      currentIteration: prev.currentIteration + 1
    }));
  };

  const startStop = () => {
    if (state.isRunning) {
      setState(prev => ({ ...prev, isRunning: false }));
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    } else {
      setState(prev => ({ ...prev, isRunning: true }));
    }
  };

  // Animation loop
  useEffect(() => {
    if (state.isRunning && !intervalRef.current) {
      intervalRef.current = setInterval(() => {
        performBootstrapIteration();
      }, state.animationSpeed);
    } else if (!state.isRunning && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [state.isRunning, state.animationSpeed, state.currentIteration, params.numBootstrapSamples]);

  const handleParamsChange = (newParams: Partial<BootstrapParams>) => {
    setParams(prev => ({ ...prev, ...newParams }));
    if (newParams.statistic || newParams.sampleSize || newParams.numBootstrapSamples) {
      resetBootstrap();
    }
  };

  const handleStateChange = (newState: Partial<BootstrapState>) => {
    setState(prev => ({ ...prev, ...newState }));
  };

  const reset = () => {
    generateNewData();
    resetBootstrap();
  };

  const handleMinInputChange = (value: string) => {
    setInputValues(prev => ({ ...prev, min: value }));
    
    if (value === '') {
      setInputErrors(prev => ({ ...prev, min: '' }));
      return;
    }
    
    const numValue = parseInt(value);
    if (isNaN(numValue) || numValue < 1 || numValue > 100) {
      setInputErrors(prev => ({ 
        ...prev, 
        min: 'Must be integer between 1-100' 
      }));
    } else if (numValue >= parseInt(inputValues.max)) {
      setInputErrors(prev => ({ 
        ...prev, 
        min: 'Must be less than max value' 
      }));
    } else {
      setInputErrors(prev => ({ ...prev, min: '' }));
      setState(prev => ({
        ...prev,
        integerDataRange: { ...prev.integerDataRange, min: numValue }
      }));
    }
  };

  const handleMaxInputChange = (value: string) => {
    setInputValues(prev => ({ ...prev, max: value }));
    
    if (value === '') {
      setInputErrors(prev => ({ ...prev, max: '' }));
      return;
    }
    
    const numValue = parseInt(value);
    if (isNaN(numValue) || numValue < 1 || numValue > 100) {
      setInputErrors(prev => ({ 
        ...prev, 
        max: 'Must be integer between 1-100' 
      }));
    } else if (numValue <= parseInt(inputValues.min)) {
      setInputErrors(prev => ({ 
        ...prev, 
        max: 'Must be greater than min value' 
      }));
    } else {
      setInputErrors(prev => ({ ...prev, max: '' }));
      setState(prev => ({
        ...prev,
        integerDataRange: { ...prev.integerDataRange, max: numValue }
      }));
    }
  };

  const handleMinKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (inputErrors.min || inputValues.min === '') {
        setInputValues(prev => ({ ...prev, min: '1' }));
        setInputErrors(prev => ({ ...prev, min: '' }));
        setState(prev => ({
          ...prev,
          integerDataRange: { ...prev.integerDataRange, min: 1 }
        }));
      }
    }
  };

  const handleMaxKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (inputErrors.max || inputValues.max === '') {
        setInputValues(prev => ({ ...prev, max: '10' }));
        setInputErrors(prev => ({ ...prev, max: '' }));
        setState(prev => ({
          ...prev,
          integerDataRange: { ...prev.integerDataRange, max: 10 }
        }));
      }
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background text-foreground antialiased overflow-x-hidden">
        {/* Header */}
        <header className="w-full glass-panel border-b border-white/5 mb-8">
          <div className="container py-6 px-4 md:px-8 flex justify-between items-center">
            <div>
              <h1 className="text-2xl md:text-3xl font-light tracking-tight">
                Bootstrapping Visualization
              </h1>
              <p className="text-sm opacity-70 mt-1">
                Understanding Statistical Inference Through Resampling
              </p>
            </div>
            <Link to="/" className="control-btn flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Visualizations
            </Link>
          </div>
        </header>

        <div className="container px-4 md:px-8 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Visualization Area */}
            <div className="lg:col-span-2 space-y-6">
              <BootstrapVisualization 
                state={state} 
                params={params}
                getClassicMeanMSE={getClassicMeanMSE}
              />
            </div>

            {/* Controls and Information */}
            <div className="space-y-6">
              <BootstrapControls
                state={state}
                params={params}
                onParamsChange={handleParamsChange}
                onStateChange={handleStateChange}
                onStartStop={startStop}
                onReset={reset}
              />
              
              {/* Integer Data Controls with Enhanced Validation */}
              <Card className="glass-panel">
                <CardHeader>
                  <CardTitle className="text-lg">Data Generation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Data Type</label>
                    <button
                      onClick={() => setParams(prev => ({ 
                        ...prev, 
                        forceIntegerData: !prev.forceIntegerData 
                      }))}
                      className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                        params.forceIntegerData 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                      disabled={state.isRunning}
                    >
                      {params.forceIntegerData ? 'Integer Only' : 'Any Numeric'}
                    </button>
                  </div>

                  {params.forceIntegerData && (
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-white">Integer Range</label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <div>
                            <input
                              type="text"
                              placeholder="Min"
                              value={inputValues.min}
                              onChange={(e) => handleMinInputChange(e.target.value)}
                              onKeyPress={handleMinKeyPress}
                              className={`w-full px-2 py-1 text-xs rounded border bg-gray-800 text-white ${
                                inputErrors.min ? 'border-red-500' : 'border-gray-600'
                              }`}
                              disabled={state.isRunning}
                            />
                            {inputErrors.min && (
                              <p className="text-red-400 text-xs mt-1">{inputErrors.min}</p>
                            )}
                          </div>
                          <div>
                            <input
                              type="text"
                              placeholder="Max"
                              value={inputValues.max}
                              onChange={(e) => handleMaxInputChange(e.target.value)}
                              onKeyPress={handleMaxKeyPress}
                              className={`w-full px-2 py-1 text-xs rounded border bg-gray-800 text-white ${
                                inputErrors.max ? 'border-red-500' : 'border-gray-600'
                              }`}
                              disabled={state.isRunning}
                            />
                            {inputErrors.max && (
                              <p className="text-red-400 text-xs mt-1">{inputErrors.max}</p>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <button
                        onClick={generateIntegerSequenceData}
                        className="w-full px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                        disabled={state.isRunning}
                      >
                        Generate Integer Sequence Data
                      </button>
                    </div>
                  )}
                  
                  <button
                    onClick={generateNewData}
                    className="w-full px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                    disabled={state.isRunning}
                  >
                    Generate New Random Data
                  </button>
                </CardContent>
              </Card>

              {/* Real-time Statistics */}
              <Card className="glass-panel">
                <CardHeader>
                  <CardTitle className="text-lg">Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="opacity-80">Bootstrap Samples:</span>
                    <span className="font-mono">{state.currentIteration}/{params.numBootstrapSamples}</span>
                  </div>
                  {state.currentStatValues.length > 0 && (
                    <>
                      <div className="flex justify-between">
                        <span className="opacity-80">Bootstrap {params.statistic}:</span>
                        <span className="font-mono">
                          {(state.currentStatValues.slice(0, state.currentIteration).reduce((a, b) => a + b, 0) / 
                            Math.max(state.currentIteration, 1)).toFixed(3)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="opacity-80">Original {params.statistic}:</span>
                        <span className="font-mono">
                          {params.statistic === 'mean' 
                            ? (state.originalData.reduce((a, b) => a + b, 0) / state.originalData.length).toFixed(3)
                            : state.originalData.sort((a, b) => a - b)[Math.floor(state.originalData.length / 2)].toFixed(3)
                          }
                        </span>
                      </div>
                      {state.currentIteration > 10 && (
                        <div className="flex justify-between">
                          <span className="opacity-80">Bootstrap SE:</span>
                          <span className="font-mono">
                            {Math.sqrt(
                              state.currentStatValues.slice(0, state.currentIteration)
                                .reduce((acc, val, _, arr) => {
                                  const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
                                  return acc + Math.pow(val - mean, 2);
                                }, 0) / (state.currentIteration - 1)
                            ).toFixed(3)}
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Educational Content */}
          <div className="mt-12">
            <BootstrapEducationalPanels />
          </div>
        </div>

        {/* Footer */}
        <footer className="w-full glass-panel border-t border-white/5 mt-16">
          <div className="container py-4 px-4 md:px-8 text-center">
            <p className="text-sm opacity-70">
              Bootstrap Visualization • Statistical Resampling • BITS Pilani, K.K. Birla Goa Campus
            </p>
          </div>
        </footer>
      </div>
    </TooltipProvider>
  );
};

export default Bootstrapping;
