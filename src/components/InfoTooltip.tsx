// App.tsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

// 1. VAEReconstructionSimulator.ts
class VAEReconstructionSimulator {
  static calculateReconstructionFidelity(epoch: number, totalEpochs: number, regularization: string, lambdaValue: number) {
    const epochProgress = epoch / totalEpochs;
    const sigmoidProgress = 1 / (1 + Math.exp(-6 * (epochProgress - 0.5)));
    const compressionRatio = 0.1;
    let regularizationPenalty = 0;
    
    if (regularization === 'nuc') {
      regularizationPenalty = Math.min(0.6, Math.pow(lambdaValue / 100, 1.2) * 0.3);
    } else if (regularization === 'majorizer') {
      regularizationPenalty = Math.min(0.4, Math.pow(lambdaValue, 1.5) * 0.25);
    }
    
    const baseQuality = 0.15 + (sigmoidProgress * 0.8);
    const finalQuality = Math.max(0.1, baseQuality - compressionRatio - regularizationPenalty);
    
    return {
      reconstructionFidelity: finalQuality,
      blurRadius: (1 - finalQuality) * 3,
      noiseLevel: (1 - finalQuality) * 0.15,
      contrastLoss: (1 - finalQuality) * 0.4,
      artifactStrength: regularizationPenalty * 0.3
    };
  }

  static generateSyntheticDigit(): number[][] {
    return Array(28).fill(0).map(() => 
      Array(28).fill(0).map(() => Math.random() > 0.9 ? 1 : 0)
    );
  }
}

// 2. VAEControlPanel.tsx
const VAEControlPanel = ({ onParamsChange, onStart, onReset, isTraining }) => {
  const [params, setParams] = useState({
    latentDim: 50,
    regularization: 'nuc',
    lambdaNuc: 100,
    lambdaMajor: 0.09,
    epochs: 10
  });

  const handleChange = (key: string, value: any) => {
    const newParams = { ...params, [key]: value };
    setParams(newParams);
    onParamsChange(newParams);
  };

  return (
    <div className="control-panel bg-slate-800 p-6 rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">VAE Controls</h2>
        <button 
          onClick={onReset}
          className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
        >
          Reset All
        </button>
      </div>

      <div className="space-y-6">
        <div className="param-group">
          <label className="text-gray-300">
            Latent Dimension: {params.latentDim}
            <input
              type="range"
              min="10"
              max="100"
              step="10"
              value={params.latentDim}
              onChange={(e) => handleChange('latentDim', parseInt(e.target.value))}
              className="w-full mt-2"
            />
          </label>
        </div>

        <div className="param-group">
          <label className="text-gray-300">
            Regularization:
            <select
              value={params.regularization}
              onChange={(e) => handleChange('regularization', e.target.value)}
              className="w-full mt-2 bg-slate-700 rounded-lg p-2"
            >
              <option value="nuc">Nuclear Norm</option>
              <option value="majorizer">Log-Det Majorizer</option>
              <option value="none">None</option>
            </select>
          </label>
        </div>

        <button
          onClick={() => onStart(params)}
          disabled={isTraining}
          className="w-full py-3 bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
        >
          {isTraining ? 'Training...' : 'Start Training'}
        </button>
      </div>
    </div>
  );
};

// 3. VAEVisualization.tsx
const VAEVisualization = ({ trainingData, epoch, isTraining }) => {
  const canvasRefs = useRef<HTMLCanvasElement[]>([]);
  const chartRef = useRef<Chart>();

  useEffect(() => {
    if (!trainingData) return;

    // Update reconstruction images
    trainingData.reconstructions.forEach((pixels, i) => {
      const canvas = canvasRefs.current[i];
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      const imageData = new ImageData(28, 28);
      
      pixels.flat().forEach((val, idx) => {
        const byteVal = Math.floor(val * 255);
        imageData.data[idx*4] = byteVal;
        imageData.data[idx*4+1] = byteVal;
        imageData.data[idx*4+2] = byteVal;
        imageData.data[idx*4+3] = 255;
      });

      ctx?.putImageData(imageData, 0, 0);
    });

    // Update training chart
    if (!chartRef.current) {
      const ctx = document.getElementById('training-chart').getContext('2d');
      chartRef.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: [],
          datasets: [
            { label: 'Loss', data: [], borderColor: '#3B82F6' },
            { label: 'Quality', data: [], borderColor: '#10B981' }
          ]
        },
        options: {
          responsive: true,
          scales: {
            x: { title: { display: true, text: 'Epochs' } },
            y: { title: { display: true, text: 'Value' } }
          }
        }
      });
    }

    chartRef.current.data.labels.push(epoch);
    chartRef.current.data.datasets[0].data.push(trainingData.loss);
    chartRef.current.data.datasets[1].data.push(trainingData.quality * 100);
    chartRef.current.update();
  }, [trainingData, epoch]);

  return (
    <div className="visualization-container p-6 bg-slate-800 rounded-lg">
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="text-center">
            <canvas 
              ref={el => canvasRefs.current[i] = el}
              width="28"
              height="28"
              className="w-full h-auto border-2 border-blue-500 rounded-lg"
            />
            <span className="text-gray-400 text-sm">Epoch {epoch}</span>
          </div>
        ))}
      </div>
      <canvas id="training-chart" className="w-full h-64" />
    </div>
  );
};

// 4. Main Component
export default function VAEPage() {
  const [params, setParams] = useState(null);
  const [trainingData, setTrainingData] = useState(null);
  const [epoch, setEpoch] = useState(0);
  const [isTraining, setIsTraining] = useState(false);

  const simulateTraining = useCallback(async (params) => {
    setIsTraining(true);
    setEpoch(0);
    
    for (let e = 1; e <= params.epochs; e++) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setEpoch(e);
      
      const qualityParams = VAEReconstructionSimulator.calculateReconstructionFidelity(
        e, params.epochs, params.regularization, params.lambdaNuc
      );
      
      setTrainingData({
        reconstructions: [...Array(4)].map(() => 
          VAEReconstructionSimulator.generateSyntheticDigit()
        ),
        loss: 50 * Math.exp(-e/10) + Math.random() * 2,
        quality: qualityParams.reconstructionFidelity
      });
    }
    
    setIsTraining(false);
  }, []);

  const handleReset = () => {
    setParams(null);
    setTrainingData(null);
    setEpoch(0);
    setIsTraining(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <VAEControlPanel
        onParamsChange={setParams}
        onStart={simulateTraining}
        onReset={handleReset}
        isTraining={isTraining}
      />
      
      <div className="lg:col-span-2">
        <VAEVisualization 
          trainingData={trainingData}
          epoch={epoch}
          isTraining={isTraining}
        />
      </div>
    </div>
  );
}
