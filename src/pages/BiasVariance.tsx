
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
  trueFunction,
  generatePlotX
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

  // Generate all 50 predictions at once when parameters change
  const generateAllPredictions = useCallback(() => {
    console.log('Generating all 50 predictions with params:', params);
    
    const allPredictions: number[][] = [];
    const xPlot = generatePlotX();
    
    for (let i = 0; i < 50; i++) {
      const { X, y } = generateData(params.samples, params.noise);
      const model = trainPolynomialModel(X, y, params.degree);
      const pred = predict(model, xPlot);
      allPredictions.push(pred);
    }

    // Calculate mean prediction for all 50 predictions
    const meanPred = xPlot.map((_, i) => 
      allPredictions.reduce((sum, pred) => sum + pred[i], 0) / allPredictions.length
    );

    // Calculate error decomposition for all predictions
    const errors = calculateErrors(allPredictions, meanPred, xPlot, params.noise);

    setState(prev => ({
      ...prev,
      predictions: allPredictions,
      meanPrediction: meanPred,
      errorDecomposition: errors,
      currentIteration: 1,
      isPlaying: false
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
        const xPlot = generatePlotX();
        
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
      
      // Schedule next frame with 500ms delay
      setTimeout(() => {
        if (prev.isPlaying) {
          animationRef.current = requestAnimationFrame(animationLoop);
        }
      }, 500);
      
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

  const handleIterationChange = useCallback((newIteration: number) => {
    setState(prev => ({
      ...prev,
      currentIteration: Math.max(1, Math.min(newIteration, 50)),
      isPlaying: false
    }));
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  }, []);

  const handleStepForward = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentIteration: Math.min(prev.currentIteration + 1, 50),
      isPlaying: false
    }));
  }, []);

  const handleStepBackward = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentIteration: Math.max(prev.currentIteration - 1, 1),
      isPlaying: false
    }));
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
    generateAllPredictions();
  }, [generateAllPredictions]);

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
        <div className="bias-variance-container">
          {/* Visualizations Grid - Now on LEFT */}
          <BiasVarianceVisualization 
            params={params}
            state={state}
          />

          {/* Control Panel - Now on RIGHT */}
          <div className="control-panel">
            <BiasVarianceControls
              params={params}
              state={state}
              onParamChange={handleParamChange}
              onIterationChange={handleIterationChange}
              onStepForward={handleStepForward}
              onStepBackward={handleStepBackward}
              onPlayPause={handlePlayPause}
              onReset={handleReset}
              onResetAll={handleResetAll}
              onGenerate={generateAllPredictions}
            />
          </div>
        </div>

        {/* Educational Content */}
        <div className="w-full mt-16">
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

      <style>
        {`
        .bias-variance-container {
          display: grid;
          grid-template-columns: 1fr 300px;
          gap: 20px;
          min-height: 80vh;
        }

        .control-panel {
          position: sticky;
          top: 20px;
          height: fit-content;
        }

        .visualization-grid {
          display: grid;
          grid-template-areas: 
            "plot-1 plot-2"
            "plot-3 plot-3"
            "plot-4 plot-5"
            "plot-6 plot-6";
          grid-template-rows: 350px 280px 230px;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          height: fit-content;
        }

        .plot-1 { grid-area: plot-1; }
        .plot-2 { grid-area: plot-2; }
        .plot-3 { grid-area: plot-3; }
        .plot-4 { grid-area: plot-4; }
        .plot-5 { grid-area: plot-5; }
        .plot-6 { grid-area: plot-6; }

        @media (max-width: 1200px) {
          .bias-variance-container {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          
          .control-panel {
            position: static;
          }
        }
        `}
      </style>
    </div>
  );
};

export default BiasVariance;
