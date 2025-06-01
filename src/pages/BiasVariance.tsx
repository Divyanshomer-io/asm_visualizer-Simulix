
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import BiasVarianceControls from '@/components/BiasVarianceControls';
import BiasVarianceVisualization from '@/components/BiasVarianceVisualization';
import BiasVarianceEducation from '@/components/BiasVarianceEducation';
import { 
  BiasVarianceState, 
  BiasVarianceParams, 
  DEFAULT_PARAMS,
  generateData,
  trainPolynomialModel,
  predict,
  calculateErrors,
  trueFunction
} from '@/utils/biasVariance';

const BiasVariance: React.FC = () => {
  const [params, setParams] = useState<BiasVarianceParams>(DEFAULT_PARAMS);
  const [state, setState] = useState<BiasVarianceState>({
    predictions: [],
    currentIteration: 1,
    isPlaying: false,
    tradeoffData: { degrees: [], bias: [], variance: [], total: [] },
    learningCurveData: { trainError: [], testError: [] },
    errorDecomposition: { bias: [], variance: [], noise: [], total: [] },
    meanPrediction: [],
    isLoading: false
  });

  const workerRef = useRef<Worker | null>(null);
  const animationRef = useRef<number | null>(null);

  // Initialize web worker
  useEffect(() => {
    try {
      workerRef.current = new Worker('/src/workers/biasVarianceWorker.js');
      workerRef.current.onmessage = (e) => {
        const { type, data } = e.data;
        if (type === 'TRADEOFF_COMPLETE') {
          setState(prev => ({
            ...prev,
            tradeoffData: data,
            isLoading: false
          }));
        }
      };
    } catch (error) {
      console.warn('Web Worker not available, using main thread calculations');
    }

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Generate predictions - mirrors Python's _generate_predictions
  const generatePredictions = useCallback(() => {
    const predictions: number[][] = [];
    const xPlot = Array.from({ length: 100 }, (_, i) => -1 + (i / 99) * 2);
    
    for (let i = 0; i < 50; i++) {
      const { X, y } = generateData(params.samples, params.noise);
      const model = trainPolynomialModel(X, y, params.degree);
      const pred = predict(model, xPlot);
      predictions.push(pred);
    }

    // Calculate mean prediction
    const meanPred = xPlot.map((_, i) => 
      predictions.reduce((sum, pred) => sum + pred[i], 0) / predictions.length
    );

    // Calculate error decomposition
    const errors = calculateErrors(predictions, meanPred, xPlot, params.noise);

    setState(prev => ({
      ...prev,
      predictions,
      meanPrediction: meanPred,
      errorDecomposition: errors,
      currentIteration: 1
    }));

    // Trigger tradeoff curve calculation
    calculateTradeoffCurve();
  }, [params]);

  // Calculate bias-variance tradeoff curve
  const calculateTradeoffCurve = useCallback(() => {
    if (workerRef.current) {
      setState(prev => ({ ...prev, isLoading: true }));
      workerRef.current.postMessage({
        type: 'CALCULATE_TRADEOFF',
        params: { samples: params.samples, noise: params.noise }
      });
    } else {
      // Fallback to main thread
      const degrees = Array.from({ length: 15 }, (_, i) => i + 1);
      const biasData: number[] = [];
      const varianceData: number[] = [];
      const totalData: number[] = [];

      degrees.forEach(degree => {
        const predictions: number[][] = [];
        const xPlot = Array.from({ length: 100 }, (_, i) => -1 + (i / 99) * 2);
        
        for (let i = 0; i < 20; i++) { // Reduced for performance
          const { X, y } = generateData(params.samples, params.noise);
          const model = trainPolynomialModel(X, y, degree);
          const pred = predict(model, xPlot);
          predictions.push(pred);
        }

        const meanPred = xPlot.map((_, i) => 
          predictions.reduce((sum, pred) => sum + pred[i], 0) / predictions.length
        );

        const errors = calculateErrors(predictions, meanPred, xPlot, params.noise);
        
        biasData.push(errors.bias.reduce((sum, val) => sum + val, 0) / errors.bias.length);
        varianceData.push(errors.variance.reduce((sum, val) => sum + val, 0) / errors.variance.length);
        totalData.push(errors.total.reduce((sum, val) => sum + val, 0) / errors.total.length);
      });

      setState(prev => ({
        ...prev,
        tradeoffData: {
          degrees,
          bias: biasData,
          variance: varianceData,
          total: totalData
        }
      }));
    }
  }, [params.samples, params.noise]);

  // Animation loop
  const animationLoop = useCallback(() => {
    setState(prev => {
      if (!prev.isPlaying || prev.currentIteration >= 50) {
        return { ...prev, isPlaying: false };
      }
      
      const newIteration = prev.currentIteration + 1;
      
      // Schedule next frame
      animationRef.current = requestAnimationFrame(animationLoop);
      
      return {
        ...prev,
        currentIteration: newIteration
      };
    });
  }, []);

  // Control handlers
  const handleParamChange = useCallback((newParams: Partial<BiasVarianceParams>) => {
    setParams(prev => ({ ...prev, ...newParams }));
  }, []);

  const handlePlayPause = useCallback(() => {
    setState(prev => {
      const newPlaying = !prev.isPlaying;
      
      if (newPlaying && prev.currentIteration < 50) {
        animationRef.current = requestAnimationFrame(animationLoop);
      } else if (!newPlaying && animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      
      return { ...prev, isPlaying: newPlaying };
    });
  }, [animationLoop]);

  const handleReset = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentIteration: 1,
      isPlaying: false
    }));
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  }, []);

  const handleResetAll = useCallback(() => {
    setParams(DEFAULT_PARAMS);
    setState({
      predictions: [],
      currentIteration: 1,
      isPlaying: false,
      tradeoffData: { degrees: [], bias: [], variance: [], total: [] },
      learningCurveData: { trainError: [], testError: [] },
      errorDecomposition: { bias: [], variance: [], noise: [], total: [] },
      meanPrediction: [],
      isLoading: false
    });
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    
    toast.info('Parameters reset to default values');
  }, []);

  // Generate initial predictions
  useEffect(() => {
    generatePredictions();
  }, [generatePredictions]);

  return (
    <div className="min-h-screen bg-background text-foreground antialiased overflow-x-hidden">
      {/* Header */}
      <header className="w-full glass-panel border-b border-white/5 mb-8">
        <div className="container py-6 px-4 md:px-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-light tracking-tight">
              Bias-Variance Tradeoff
              <span className="text-sm ml-3 opacity-70 font-normal">
                Interactive Learning
              </span>
            </h1>
            <p className="text-sm opacity-70">Explore the fundamental tradeoff in machine learning</p>
          </div>
          <Link to="/" className="control-btn flex items-center gap-2 text-sm">
            <ArrowLeft className="h-4 w-4" />
            Back to Visualizations
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 md:px-8 pb-16">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-8">
          {/* Visualizations */}
          <div className="xl:col-span-3">
            <BiasVarianceVisualization 
              params={params}
              state={state}
            />
          </div>

          {/* Control Panel */}
          <div className="xl:col-span-1">
            <BiasVarianceControls
              params={params}
              state={state}
              onParamChange={handleParamChange}
              onPlayPause={handlePlayPause}
              onReset={handleReset}
              onResetAll={handleResetAll}
              onGenerate={generatePredictions}
            />
          </div>
        </div>

        {/* Educational Content */}
        <div className="w-full">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">
              Understanding Bias-Variance Tradeoff
            </h2>
            <p className="text-slate-300">
              Learn about the fundamental concepts in machine learning model complexity
            </p>
          </div>
          
          <BiasVarianceEducation />
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full glass-panel border-t border-white/5 mt-auto">
        <div className="container py-4 px-4 md:px-8 text-center">
          <p className="text-sm opacity-70">
            <span className="inline-block">Applied Statistical Mathematics • Interactive Visualizations</span>
            <span className="mx-2">•</span>
            <span className="inline-block">BITS Pilani, K.K. Birla Goa Campus</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default BiasVariance;
