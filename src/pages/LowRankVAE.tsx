import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Home, Brain, BarChart3, Settings } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LowRankVAEControls from '@/components/LowRankVAEControls';
import LowRankVAEVisualization from '@/components/LowRankVAEVisualization';
import LowRankVAEEducation from '@/components/LowRankVAEEducation';
import { VAEState, VAEParams, generateSyntheticMNIST } from '@/utils/lowRankVAE';
import { VAEReconstructionSimulator } from '@/utils/vaeReconstructionSimulator';
import { toast } from 'sonner';

const LowRankVAE = () => {
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
    epochs: 10, // Increased default to 10
    batchSize: 128,
    learningRate: 0.001
  });

  const trainingRef = useRef<NodeJS.Timeout | null>(null);

  const handleParamsChange = useCallback((newParams: Partial<VAEParams>) => {
    setParams(prev => ({ ...prev, ...newParams }));
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
      status: 'Initializing training with synthetic MNIST data...',
      originalImages: trainingData.originalImages,
      reconstructions: trainingData.reconstructions,
      latentVectors: trainingData.latentVectors,
      digitLabels: trainingData.digitLabels,
      reconstructionQuality: 0.1
    }));

    toast.success('Training started with progressive reconstruction quality!');
    
    // Progressive training simulation
    const epochDuration = isFastRun ? 1000 : 1500;
    let currentEpoch = 0;

    const simulateEpoch = () => {
      if (currentEpoch >= trainingParams.epochs) {
        setState(prev => ({
          ...prev,
          isTraining: false,
          status: '✅ Training completed successfully!',
          trainingProgress: 100
        }));
        toast.success('Training completed! Notice the reconstruction quality improvement.');
        return;
      }

      currentEpoch++;

      // Calculate progressive reconstruction quality
      const quality = VAEReconstructionSimulator.getReconstructionQuality(
        currentEpoch,
        trainingParams.epochs,
        trainingParams.regularization,
        trainingParams.regularization === 'nuc' ? trainingParams.lambdaNuc : trainingParams.lambdaMajorizer
      );

      // Generate progressively better reconstructions
      const updatedReconstructions = trainingData.originalImages.map(original => 
        VAEReconstructionSimulator.generateBlurredReconstruction(original, quality)
      );

      // Simulate realistic training metrics
      const baseTrainLoss = 50 * Math.exp(-currentEpoch / 8);
      const regularizationPenalty = trainingParams.regularization === 'nuc' 
        ? trainingParams.lambdaNuc * Math.exp(-currentEpoch / 10)
        : trainingParams.lambdaMajorizer * 10 * Math.exp(-currentEpoch / 10);
      
      const trainLoss = Math.max(5, baseTrainLoss + regularizationPenalty + Math.random() * 2);
      const valLoss = trainLoss + 2 + Math.random() * 3;

      // Calculate latent rank reduction
      const initialRank = trainingParams.latentDim * 0.8;
      let targetRank = initialRank;
      
      if (trainingParams.regularization === 'nuc') {
        targetRank = Math.max(1, 10 - trainingParams.lambdaNuc / 50);
      } else if (trainingParams.regularization === 'majorizer') {
        targetRank = Math.max(2, 15 - trainingParams.lambdaMajorizer * 20);
      }
      
      const progress = 1 - Math.exp(-currentEpoch / 10);
      const currentRank = initialRank - (initialRank - targetRank) * progress + (Math.random() - 0.5);

      setState(prev => ({
        ...prev,
        epoch: currentEpoch,
        trainLoss: [...prev.trainLoss, trainLoss],
        valLoss: [...prev.valLoss, valLoss],
        latentRanks: [...prev.latentRanks, Math.max(1, currentRank)],
        reconstructions: updatedReconstructions,
        trainingProgress: (currentEpoch / trainingParams.epochs) * 100,
        status: `Training... Epoch ${currentEpoch}/${trainingParams.epochs} (Quality: ${(quality * 100).toFixed(0)}%)`,
        reconstructionQuality: quality
      }));

      trainingRef.current = setTimeout(simulateEpoch, epochDuration);
    };

    setTimeout(simulateEpoch, 500);
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
      <header className="w-full glass-panel border-b border-white/5 sticky top-0 z-50 backdrop-blur-xl">
        <div className="container py-6 px-4 md:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/" className="relative">
                <span
                  className="simulix-logo text-3xl md:text-4xl font-black tracking-tight transition-all duration-500 hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, #fff 0%, #38bdf8 50%, #818cf8 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    filter: 'drop-shadow(0 2px 8px rgba(56, 189, 248, 0.3))',
                  }}
                >
                  Simulix
                </span>
              </Link>
              <div className="hidden md:flex items-center gap-2 px-4 py-2 glass-panel rounded-full">
                <Brain className="h-4 w-4 text-accent animate-pulse" />
                <span className="text-sm font-medium">
                  <span className="text-accent">Low-Rank VAE</span> with Progressive Reconstruction
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link 
                to="/" 
                className="group flex items-center gap-2 px-4 py-2 glass-panel rounded-full hover:border-accent/40 transition-all duration-300 hover:scale-105"
              >
                <Home className="h-4 w-4 text-accent/80 group-hover:text-accent transition-colors" />
                <span className="text-sm font-medium group-hover:text-accent transition-colors">
                  Back to Home
                </span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 md:px-8 py-8">
        <Tabs defaultValue="visualization" className="w-full">
          <TabsList className="grid w-full grid-cols-2 glass-panel mb-8">
            <TabsTrigger value="visualization" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Visualization
            </TabsTrigger>
            <TabsTrigger value="education" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Learn About VAEs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="visualization" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Controls Panel */}
              <div className="lg:col-span-1">
                <LowRankVAEControls
                  params={params}
                  state={state}
                  onParamsChange={handleParamsChange}
                  onStartTraining={startTraining}
                  onStopTraining={stopTraining}
                />
              </div>

              {/* Visualization Panel */}
              <div className="lg:col-span-3">
                <LowRankVAEVisualization state={state} params={params} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="education">
            <LowRankVAEEducation />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="w-full glass-panel border-t border-white/5 mt-auto">
        <div className="container py-4 px-4 md:px-8 text-center">
          <p className="text-sm opacity-70">
            Low-Rank Variational Autoencoder with Progressive Reconstruction Quality
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LowRankVAE;
