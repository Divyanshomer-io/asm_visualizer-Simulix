import React, { useState, useCallback, useRef, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { VAEState, VAEParams } from '@/utils/lowRankVAE';
import { ImageReconstructionGrid } from './MNISTImageRenderer';
import { RealisticVAEReconstructor, VAETrainingDynamics, TrainingMetrics } from '@/utils/realisticVAEReconstructor';
import InfoTooltip, { VAETooltips } from '@/components/InfoTooltip';

interface EnhancedVAEVisualizationProps {
  state: VAEState;
  params: VAEParams;
  isTraining: boolean;
  onTrainingUpdate: (epoch: number, quality: number, metrics: any) => void;
  resetKey?: number;
}

const EnhancedVAEVisualization: React.FC<EnhancedVAEVisualizationProps> = ({ 
  state, 
  params, 
  isTraining,
  onTrainingUpdate,
  resetKey = 0
}) => {
  const [currentEpoch, setCurrentEpoch] = useState(0);
  const [reconstructionQuality, setReconstructionQuality] = useState(0.1);
  const [liveMetrics, setLiveMetrics] = useState<TrainingMetrics | null>(null);
  const [currentReconstructions, setCurrentReconstructions] = useState<number[][][]>([]);
  const trainingRef = useRef<NodeJS.Timeout | null>(null);

  // Reset state when resetKey changes
  useEffect(() => {
    if (resetKey > 0) {
      setCurrentEpoch(0);
      setReconstructionQuality(0.1);
      setLiveMetrics(null);
      setCurrentReconstructions([]);
      if (trainingRef.current) {
        clearTimeout(trainingRef.current);
        trainingRef.current = null;
      }
    }
  }, [resetKey]);

  // Generate enhanced training dynamics when training starts
  useEffect(() => {
    if (isTraining && currentEpoch === 0) {
      startEnhancedTraining();
    }
  }, [isTraining]);

  const startEnhancedTraining = useCallback(async () => {
    const dynamics = VAETrainingDynamics.generateRealisticLossCurve(
      params.epochs,
      params.latentDim,
      params.regularization,
      params.regularization === 'nuc' ? params.lambdaNuc : params.lambdaMajorizer
    );

    for (let epoch = 1; epoch <= params.epochs; epoch++) {
      if (!isTraining) break;

      setCurrentEpoch(epoch);
      
      // Calculate current reconstruction parameters using corrected logic
      const reconParams = RealisticVAEReconstructor.calculateReconstructionFidelity(
        epoch,
        params.epochs,
        params.latentDim,
        params.regularization,
        params.regularization === 'nuc' ? params.lambdaNuc : params.lambdaMajorizer
      );
      
      setReconstructionQuality(reconParams.reconstructionFidelity);
      
      // Update live metrics
      const currentMetrics = {
        ...dynamics,
        currentLoss: dynamics.totalLosses[epoch - 1],
        currentRank: dynamics.latentRanks[epoch - 1],
        reconLoss: dynamics.reconstructionLosses[epoch - 1],
        klLoss: dynamics.klLosses[epoch - 1],
        regLoss: dynamics.regularizationLosses[epoch - 1]
      };
      
      setLiveMetrics(currentMetrics);
      
      // Generate progressive reconstructions with corrected quality
      if (state.originalImages.length > 0) {
        const progressiveReconstructions = state.originalImages.map(digitPixels =>
          RealisticVAEReconstructor.applyRealisticBlur(digitPixels, reconParams, epoch)
        );
        setCurrentReconstructions(progressiveReconstructions);
      }

      // Notify parent component
      onTrainingUpdate(epoch, reconParams.reconstructionFidelity, currentMetrics);
      
      // Realistic epoch timing with faster updates for better real-time feel
      const epochDuration = params.epochs <= 5 ? 600 : 
                           params.epochs <= 15 ? 900 : 1200;
      await new Promise(resolve => setTimeout(resolve, epochDuration));
    }
  }, [params, isTraining, state.originalImages, onTrainingUpdate]);

  // Prepare data for charts with enhanced metrics
  const enhancedTrainingData = liveMetrics ? liveMetrics.totalLosses.map((loss, index) => ({
    epoch: index + 1,
    totalLoss: Number(loss.toFixed(2)),
    reconLoss: Number((liveMetrics.reconstructionLosses[index] || 0).toFixed(2)),
    klLoss: Number((liveMetrics.klLosses[index] || 0).toFixed(2)),
    regLoss: Number((liveMetrics.regularizationLosses[index] || 0).toFixed(2)),
    latentRank: Math.round(liveMetrics.latentRanks[index] || 0)
  })).slice(0, currentEpoch) : [];

  const qualityHistory = enhancedTrainingData.map((data, index) => ({
    epoch: data.epoch,
    quality: RealisticVAEReconstructor.calculateReconstructionFidelity(
      index + 1,
      params.epochs,
      params.latentDim,
      params.regularization,
      params.regularization === 'nuc' ? params.lambdaNuc : params.lambdaMajorizer
    ).reconstructionFidelity * 100
  }));

  const getQualityColor = (quality: number) => {
    if (quality < 30) return 'text-red-400';
    if (quality < 60) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getQualityLabel = (quality: number) => {
    if (quality < 30) return 'Poor';
    if (quality < 60) return 'Medium';
    return 'Good';
  };

  // Get expected results for current parameters (for display when not training)
  const getExpectedResults = () => {
    if (!isTraining && currentEpoch === 0) {
      const finalEpochParams = RealisticVAEReconstructor.calculateReconstructionFidelity(
        params.epochs,
        params.epochs,
        params.latentDim,
        params.regularization,
        params.regularization === 'nuc' ? params.lambdaNuc : params.lambdaMajorizer
      );
      return {
        expectedQuality: finalEpochParams.reconstructionFidelity * 100,
        expectedRank: finalEpochParams.expectedRank
      };
    }
    return null;
  };

  const expectedResults = getExpectedResults();

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 border border-gray-600 rounded-lg p-3 shadow-lg">
          <p className="text-gray-300 font-medium">{`Epoch ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.dataKey}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Parameter Preview (when not training) */}
      {!isTraining && expectedResults && (
        <div className="glass-panel p-6 rounded-xl">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-lg font-semibold text-accent">Expected Results Preview</h3>
            <InfoTooltip 
              content="Preview of expected training results based on current parameter configuration. Start training to see actual progression."
              variant="info"
            />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-background/20 p-4 rounded-lg text-center">
              <div className="text-xs text-muted-foreground">Expected Quality</div>
              <div className={`text-2xl font-mono ${getQualityColor(expectedResults.expectedQuality)}`}>
                {expectedResults.expectedQuality.toFixed(0)}%
              </div>
              <div className="text-xs text-muted-foreground">
                {getQualityLabel(expectedResults.expectedQuality)}
              </div>
            </div>
            <div className="bg-background/20 p-4 rounded-lg text-center">
              <div className="text-xs text-muted-foreground">Expected Rank</div>
              <div className="text-2xl font-mono text-red-400">
                {expectedResults.expectedRank}
              </div>
              <div className="text-xs text-muted-foreground">
                of {params.latentDim}
              </div>
            </div>
            <div className="bg-background/20 p-4 rounded-lg text-center">
              <div className="text-xs text-muted-foreground">Compression</div>
              <div className="text-2xl font-mono text-blue-400">
                {((params.latentDim / 784) * 100).toFixed(1)}%
              </div>
              <div className="text-xs text-muted-foreground">
                {params.latentDim}/784 dims
              </div>
            </div>
            <div className="bg-background/20 p-4 rounded-lg text-center">
              <div className="text-xs text-muted-foreground">Regularization</div>
              <div className="text-2xl font-mono text-orange-400">
                {params.regularization === 'nuc' ? params.lambdaNuc : 
                 params.regularization === 'majorizer' ? params.lambdaMajorizer.toFixed(2) : 'None'}
              </div>
              <div className="text-xs text-muted-foreground">
                {params.regularization}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Real-time Quality Indicator (during training) */}
      {isTraining && (
        <div className="glass-panel p-6 rounded-xl">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-lg font-semibold text-accent">Real-time Training Progress</h3>
            <InfoTooltip 
              content="Live metrics updating every epoch showing reconstruction quality, loss components, and training progression in real-time."
              variant="info"
            />
          </div>
          
          <div className="space-y-4">
            {/* Quality Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Reconstruction Quality</span>
                <span className={`text-sm font-mono ${getQualityColor(reconstructionQuality * 100)}`}>
                  {(reconstructionQuality * 100).toFixed(1)}% ({getQualityLabel(reconstructionQuality * 100)})
                </span>
              </div>
              <div className="w-full bg-background/30 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-500 ${
                    reconstructionQuality < 0.3 ? 'bg-red-500' :
                    reconstructionQuality < 0.6 ? 'bg-yellow-500' :
                    'bg-green-500'
                  }`}
                  style={{ width: `${reconstructionQuality * 100}%` }}
                />
              </div>
            </div>

            {/* Live Metrics Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="bg-background/20 p-3 rounded-lg text-center">
                <div className="text-xs text-muted-foreground">Total Loss</div>
                <div className="text-lg font-mono text-blue-400">
                  {liveMetrics?.currentLoss?.toFixed(2) || '--'}
                </div>
              </div>
              <div className="bg-background/20 p-3 rounded-lg text-center">
                <div className="text-xs text-muted-foreground">Latent Rank</div>
                <div className="text-lg font-mono text-red-400">
                  {liveMetrics?.currentRank?.toFixed(1) || '--'}
                </div>
              </div>
              <div className="bg-background/20 p-3 rounded-lg text-center">
                <div className="text-xs text-muted-foreground">Recon Loss</div>
                <div className="text-lg font-mono text-green-400">
                  {liveMetrics?.reconLoss?.toFixed(2) || '--'}
                </div>
              </div>
              <div className="bg-background/20 p-3 rounded-lg text-center">
                <div className="text-xs text-muted-foreground">Reg Loss</div>
                <div className="text-lg font-mono text-orange-400">
                  {liveMetrics?.regLoss?.toFixed(2) || '--'}
                </div>
              </div>
            </div>

            {/* Epoch Progress */}
            <div className="text-center">
              <span className="text-sm text-muted-foreground">
                Epoch {currentEpoch}/{params.epochs}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Image Reconstruction */}
      <div className="glass-panel p-6 rounded-xl">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-lg font-semibold text-accent">
            Progressive MNIST Reconstruction
            {isTraining && (
              <span className="ml-2 text-sm text-muted-foreground">
                (Live Updates - Epoch {currentEpoch})
              </span>
            )}
          </h3>
          <InfoTooltip {...VAETooltips.mnistReconstruction} side="right"/>
        </div>
        
        <ImageReconstructionGrid
          originalImages={state.originalImages}
          reconstructions={currentReconstructions.length > 0 ? currentReconstructions : state.reconstructions}
          labels={state.digitLabels}
        />
      </div>

      {/* Enhanced Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Loss Components Chart */}
        <div className="glass-panel p-6 rounded-xl">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-lg font-semibold text-accent">Loss Components</h3>
            <InfoTooltip {...VAETooltips.lossComponents} side="right"/>
          </div>
          {enhancedTrainingData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={enhancedTrainingData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="epoch" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="totalLoss" 
                  stroke="#3B82F6" 
                  strokeWidth={2} 
                  name="Total Loss"
                  dot={{ r: 3, fill: '#3B82F6' }}
                  connectNulls={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="reconLoss" 
                  stroke="#10B981" 
                  strokeWidth={2} 
                  name="Reconstruction"
                  dot={{ r: 3, fill: '#10B981' }}
                  connectNulls={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="klLoss" 
                  stroke="#8B5CF6" 
                  strokeWidth={2} 
                  name="KL Divergence"
                  dot={{ r: 3, fill: '#8B5CF6' }}
                  connectNulls={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="regLoss" 
                  stroke="#F59E0B" 
                  strokeWidth={2} 
                  name="Regularization"
                  dot={{ r: 3, fill: '#F59E0B' }}
                  connectNulls={false}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-muted-foreground">
              Start training to see loss components
            </div>
          )}
        </div>

        {/* Quality Evolution Chart */}
        <div className="glass-panel p-6 rounded-xl">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-lg font-semibold text-accent">Quality Evolution</h3>
            <InfoTooltip {...VAETooltips.qualityEvolution} />
          </div>
          {qualityHistory.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={qualityHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="epoch" stroke="#9CA3AF" />
                <YAxis domain={[0, 100]} stroke="#9CA3AF" />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="quality" 
                  stroke="#EF4444" 
                  strokeWidth={3}
                  name="Reconstruction Quality (%)"
                  dot={{ r: 3, fill: '#EF4444' }}
                  connectNulls={false}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-muted-foreground">
              Start training to see quality evolution
            </div>
          )}
        </div>
      </div>

      {/* Parameter Impact Summary */}
      <div className="glass-panel p-6 rounded-xl">
        <h3 className="text-lg font-semibold mb-4 text-accent">Parameter Impact Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-background/20 p-4 rounded-lg">
            <h4 className="font-medium text-blue-400 mb-2">Compression Ratio</h4>
            <p className="text-2xl font-mono text-blue-400">
              {((params.latentDim / 784) * 100).toFixed(1)}%
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {params.latentDim}/784 dimensions
            </p>
          </div>
          <div className="bg-background/20 p-4 rounded-lg">
            <h4 className="font-medium text-orange-400 mb-2">Regularization Impact</h4>
            <p className="text-2xl font-mono text-orange-400">
              {params.regularization === 'none' ? 'None' : 
               params.regularization === 'nuc' ? (params.lambdaNuc <= 100 ? 'Low' : params.lambdaNuc <= 300 ? 'Medium' : 'High') : 
               params.lambdaMajorizer <= 0.1 ? 'Low' : params.lambdaMajorizer <= 0.5 ? 'Medium' : 'High'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {params.regularization === 'nuc' ? `λ=${params.lambdaNuc}` :
               params.regularization === 'majorizer' ? `λ=${params.lambdaMajorizer}` : 'No penalty'}
            </p>
          </div>
          <div className="bg-background/20 p-4 rounded-lg">
            <h4 className="font-medium text-green-400 mb-2">Expected Quality</h4>
            <p className="text-2xl font-mono text-green-400">
              {expectedResults ? `${expectedResults.expectedQuality.toFixed(0)}%` : 
               isTraining ? `${(reconstructionQuality * 100).toFixed(0)}%` : 'Start Training'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {expectedResults ? getQualityLabel(expectedResults.expectedQuality) : 
               isTraining ? getQualityLabel(reconstructionQuality * 100) : 'Based on parameters'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedVAEVisualization;
