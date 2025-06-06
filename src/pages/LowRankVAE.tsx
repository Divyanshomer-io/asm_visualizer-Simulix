
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Home, Brain, ArrowLeft } from 'lucide-react';
import LowRankVAEControls from '@/components/LowRankVAEControls';
import EnhancedVAEVisualization from '@/components/EnhancedVAEVisualization';
import LowRankVAEEducation from '@/components/LowRankVAEEducation';
import { VAEState, VAEParams, generateSyntheticMNIST } from '@/utils/lowRankVAE';
import { RealisticVAEReconstructor } from '@/utils/realisticVAEReconstructor';
import { toast } from 'sonner';

const LowRankVAE = () => {
  const [resetKey, setResetKey] = useState(0);
  
  const [state, setState] = useState<VAEState>({
    isTraining: false,
    epoch: 0,
    totalEpochs: 5,
    trainLoss: [],
    valLoss: [],
    latentRanks: [],
    reconstructions: [],
    originalImages: [],
    latentVectors: [],
    trainingProgress: 0,
    status: 'Ready',
    digitLabels: [],
    reconstructionQuality: 0
  });

  const [params, setParams] = useState<VAEParams>({
    latentDim: 50,
    regularization: 'nuc',
    lambdaNuc: 100,
    lambdaMajorizer: 0.09,
    epochs: 10,
    batchSize: 128,
    learningRate: 0.001
  });

  const trainingRef = useRef<NodeJS.Timeout | null>(null);

  const handleParamsChange = useCallback((newParams: Partial<VAEParams>) => {
    setParams(prev => ({ ...prev, ...newParams }));
  }, []);

  const handleTrainingUpdate = useCallback((epoch: number, quality: number, metrics: any) => {
    setState(prev => ({
      ...prev,
      epoch,
      reconstructionQuality: quality,
      trainingProgress: (epoch / params.epochs) * 100,
      status: `Training... Epoch ${epoch}/${params.epochs} (Quality: ${(quality * 100).toFixed(0)}%)`,
      trainLoss: metrics.totalLosses ? metrics.totalLosses.slice(0, epoch) : prev.trainLoss,
      valLoss: metrics.totalLosses ? metrics.totalLosses.slice(0, epoch).map((loss: number) => loss + 2 + Math.random() * 3) : prev.valLoss,
      latentRanks: metrics.latentRanks ? metrics.latentRanks.slice(0, epoch) : prev.latentRanks
    }));
  }, [params.epochs]);

  // Enhanced reset function
  const handleReset = useCallback(() => {
    // Stop any ongoing training
    if (trainingRef.current) {
      clearTimeout(trainingRef.current);
      trainingRef.current = null;
    }

    // Reset all state to initial values
    setState({
      isTraining: false,
      epoch: 0,
      totalEpochs: 10,
      trainLoss: [],
      valLoss: [],
      latentRanks: [],
      reconstructions: [],
      originalImages: [],
      latentVectors: [],
      trainingProgress: 0,
      status: 'Ready - Interface Reset',
      digitLabels: [],
      reconstructionQuality: 0
    });

    // Reset parameters to defaults
    setParams({
      latentDim: 50,
      regularization: 'nuc',
      lambdaNuc: 100,
      lambdaMajorizer: 0.09,
      epochs: 10,
      batchSize: 128,
      learningRate: 0.001
    });

    // Force component re-render with new key
    setResetKey(prev => prev + 1);

    toast.success('🔄 Interface reset to default state');
  }, []);

  const startTraining = useCallback(async (isFastRun: boolean = false) => {
    if (state.isTraining) {
      toast.error('Training is already in progress');
      return;
    }

    let trainingParams = params;
    if (isFastRun) {
      trainingParams = {
        ...params,
        latentDim: 10,
        lambdaNuc: 10,
        lambdaMajorizer: 0.01,
        epochs: 3
      };
      toast.info('⚡ Fast Run: Training with reduced parameters');
    }

    // Generate synthetic MNIST data at start
    const trainingData = generateSyntheticMNIST(8);

    setState(prev => ({
      ...prev,
      isTraining: true,
      epoch: 0,
      totalEpochs: trainingParams.epochs,
      trainLoss: [],
      valLoss: [],
      latentRanks: [],
      trainingProgress: 0,
      status: 'Initializing enhanced training with realistic VAE dynamics...',
      originalImages: trainingData.originalImages,
      reconstructions: trainingData.reconstructions,
      latentVectors: trainingData.latentVectors,
      digitLabels: trainingData.digitLabels,
      reconstructionQuality: 0.1
    }));

    toast.success('Enhanced training started with realistic parameter dynamics!');
  }, [params, state.isTraining]);

  const stopTraining = useCallback(() => {
    if (trainingRef.current) {
      clearTimeout(trainingRef.current);
      trainingRef.current = null;
    }
    setState(prev => ({
      ...prev,
      isTraining: false,
      status: 'Training stopped'
    }));
    toast.info('Training stopped');
  }, []);

  useEffect(() => {
    return () => {
      if (trainingRef.current) {
        clearTimeout(trainingRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground antialiased overflow-x-hidden">
          {/* Header */}
      <header className="w-full glass-panel border-b border-white/5 mb-8">
        <div className="container py-6 px-4 md:px-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-light tracking-tight">
              Low-Rank VAE Visualization
              <span className="text-sm ml-3 opacity-70 font-normal">
                Enhanced Low-Rank VAE with Synthetic Training Dynamics
              </span>
            </h1>
            <p className="text-sm opacity-70"></p>
          </div>
          <Link to="/" className="control-btn flex items-center gap-2 text-sm">
            <ArrowLeft className="h-4 w-4" />
            Back to Visualizations
          </Link>
        </div>
      </header>
    

      {/* Main Content - Single Page Layout */}
      <main className="container px-4 md:px-8 py-8">
        {/* Top Section: Controls and Visualization */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-12">
          {/* Controls Panel - Right Side */}
          <div className="lg:col-span-1 lg:order-2">
            <LowRankVAEControls
              params={params}
              state={state}
              onParamsChange={handleParamsChange}
              onStartTraining={startTraining}
              onStopTraining={stopTraining}
              onReset={handleReset}
            />
          </div>

          {/* Visualization Panel - Left Side */}
          <div className="lg:col-span-3 lg:order-1">
            <EnhancedVAEVisualization 
              state={state} 
              params={params}
              isTraining={state.isTraining}
              onTrainingUpdate={handleTrainingUpdate}
              resetKey={resetKey}
            />
          </div>
        </div>

        {/* Educational Content Section */}
        <div className="border-t border-white/10 pt-12">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-center mb-4">
              <span className="text-accent">Learn About</span> Variational Autoencoders
            </h2>
            <p className="text-center text-muted-foreground max-w-2xl mx-auto">
              Understand the theory, mathematics, and practical applications of Low-Rank VAEs 
              with our comprehensive educational content below.
            </p>
          </div>
          
          <LowRankVAEEducation />
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full glass-panel border-t border-white/5 mt-auto">
        <div className="container py-4 px-4 md:px-8 text-center">
          <p className="text-sm opacity-70">
            Enhanced Low-Rank Variational Autoencoder with Realistic Training Dynamics and Parameter Impact Analysis
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LowRankVAE;
