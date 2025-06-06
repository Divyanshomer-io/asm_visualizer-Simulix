
interface ReconstructionParams {
  reconstructionFidelity: number;
  blurRadius: number;
  noiseLevel: number;
  contrastLoss: number;
  artifactStrength: number;
}

interface TrainingMetrics {
  totalLosses: number[];
  reconstructionLosses: number[];
  klLosses: number[];
  regularizationLosses: number[];
  latentRanks: number[];
  convergenceEpoch: number;
  currentLoss?: number;
  currentRank?: number;
  reconLoss?: number;
  klLoss?: number;
  regLoss?: number;
}

export class RealisticVAEReconstructor {
  static calculateReconstructionFidelity(
    epoch: number,
    totalEpochs: number,
    latentDim: number,
    regularization: string,
    lambdaValue: number
  ): ReconstructionParams {
    
    // Base progression: slow start, rapid middle, plateau end
    const epochProgress = epoch / totalEpochs;
    const sigmoidProgress = 1 / (1 + Math.exp(-6 * (epochProgress - 0.5)));
    
    // Compression penalty based on latent dimension
    const compressionRatio = latentDim / 784; // 784 = 28x28
    const compressionPenalty = Math.max(0, (0.1 - compressionRatio) * 5);
    
    // Regularization-specific quality impact
    let regularizationPenalty = 0;
    if (regularization === 'nuc') {
      // Nuclear norm: Harsh penalty for high lambda
      regularizationPenalty = Math.min(0.6, Math.pow(lambdaValue / 100, 1.2) * 0.3);
    } else if (regularization === 'majorizer') {
      // Log-det: Smoother but still significant penalty
      regularizationPenalty = Math.min(0.4, Math.pow(lambdaValue, 1.5) * 0.25);
    }
    
    // Final quality calculation (0.1 = very poor, 0.95 = excellent)
    const baseQuality = 0.15 + (sigmoidProgress * 0.8);
    const finalQuality = Math.max(0.1, 
      baseQuality - compressionPenalty - regularizationPenalty
    );
    
    return {
      reconstructionFidelity: finalQuality,
      blurRadius: (1 - finalQuality) * 3, // 0-3 pixel blur
      noiseLevel: (1 - finalQuality) * 0.15, // 0-15% noise
      contrastLoss: (1 - finalQuality) * 0.4, // 0-40% contrast reduction
      artifactStrength: regularizationPenalty * 0.3 // Compression artifacts
    };
  }
  
  // Progressive blur with realistic artifacts
  static applyRealisticBlur(
    originalPixels: number[][],
    params: ReconstructionParams,
    epoch: number
  ): number[][] {
    const result = originalPixels.map(row => [...row]);
    const { blurRadius, noiseLevel, contrastLoss, artifactStrength } = params;
    
    // Apply Gaussian blur with varying kernel size
    this.applyGaussianBlur(result, blurRadius);
    
    // Add compression artifacts (blocky patterns)
    if (artifactStrength > 0.1) {
      this.addCompressionArtifacts(result, artifactStrength);
    }
    
    // Reduce contrast (common in VAE reconstructions)
    this.adjustContrast(result, 1 - contrastLoss);
    
    // Add reconstruction noise
    this.addReconstructionNoise(result, noiseLevel);
    
    // Early epoch specific degradation
    if (epoch < 3) {
      this.applyEarlyEpochDegradation(result, 3 - epoch);
    }
    
    return result.map(row => row.map(v => Math.max(0, Math.min(1, v))));
  }
  
  private static applyGaussianBlur(pixels: number[][], radius: number) {
    if (radius < 0.5) return;
    
    const kernelSize = Math.ceil(radius) * 2 + 1;
    const kernel = this.generateGaussianKernel(kernelSize, radius);
    const temp = pixels.map(row => [...row]);
    
    for (let i = 0; i < 28; i++) {
      for (let j = 0; j < 28; j++) {
        let sum = 0;
        let weightSum = 0;
        
        for (let ki = 0; ki < kernelSize; ki++) {
          for (let kj = 0; kj < kernelSize; kj++) {
            const ii = i + ki - Math.floor(kernelSize / 2);
            const jj = j + kj - Math.floor(kernelSize / 2);
            
            if (ii >= 0 && ii < 28 && jj >= 0 && jj < 28) {
              const weight = kernel[ki][kj];
              sum += temp[ii][jj] * weight;
              weightSum += weight;
            }
          }
        }
        
        pixels[i][j] = sum / weightSum;
      }
    }
  }
  
  private static generateGaussianKernel(size: number, sigma: number = 1): number[][] {
    const kernel: number[][] = [];
    const center = Math.floor(size / 2);
    let sum = 0;
    
    for (let i = 0; i < size; i++) {
      kernel[i] = [];
      for (let j = 0; j < size; j++) {
        const x = i - center;
        const y = j - center;
        const value = Math.exp(-(x * x + y * y) / (2 * sigma * sigma));
        kernel[i][j] = value;
        sum += value;
      }
    }
    
    // Normalize
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        kernel[i][j] /= sum;
      }
    }
    
    return kernel;
  }
  
  private static addCompressionArtifacts(pixels: number[][], strength: number) {
    // Add 4x4 block artifacts typical of heavy compression
    const blockSize = 4;
    for (let bi = 0; bi < 28; bi += blockSize) {
      for (let bj = 0; bj < 28; bj += blockSize) {
        let blockAvg = 0;
        let count = 0;
        
        // Calculate block average
        for (let i = bi; i < Math.min(bi + blockSize, 28); i++) {
          for (let j = bj; j < Math.min(bj + blockSize, 28); j++) {
            blockAvg += pixels[i][j];
            count++;
          }
        }
        blockAvg /= count;
        
        // Apply block averaging with strength factor
        for (let i = bi; i < Math.min(bi + blockSize, 28); i++) {
          for (let j = bj; j < Math.min(bj + blockSize, 28); j++) {
            pixels[i][j] = pixels[i][j] * (1 - strength) + blockAvg * strength;
          }
        }
      }
    }
  }
  
  private static adjustContrast(pixels: number[][], factor: number) {
    for (let i = 0; i < 28; i++) {
      for (let j = 0; j < 28; j++) {
        pixels[i][j] = (pixels[i][j] - 0.5) * factor + 0.5;
      }
    }
  }
  
  private static addReconstructionNoise(pixels: number[][], level: number) {
    for (let i = 0; i < 28; i++) {
      for (let j = 0; j < 28; j++) {
        pixels[i][j] += (Math.random() - 0.5) * level;
      }
    }
  }
  
  private static applyEarlyEpochDegradation(pixels: number[][], severity: number) {
    // Very early epochs: Add severe distortions
    const distortionStrength = severity * 0.3;
    
    for (let i = 0; i < 28; i++) {
      for (let j = 0; j < 28; j++) {
        // Random pixel dropout
        if (Math.random() < distortionStrength * 0.1) {
          pixels[i][j] *= Math.random() * 0.5;
        }
        
        // Salt-and-pepper noise
        if (Math.random() < distortionStrength * 0.05) {
          pixels[i][j] = Math.random() > 0.5 ? 1 : 0;
        }
      }
    }
  }
}

export class VAETrainingDynamics {
  static generateRealisticLossCurve(
    epochs: number,
    latentDim: number,
    regularization: string,
    lambdaValue: number
  ): TrainingMetrics {
    
    const losses: number[] = [];
    const reconstructionLosses: number[] = [];
    const klLosses: number[] = [];
    const regularizationLosses: number[] = [];
    const latentRanks: number[] = [];
    
    // Initial loss components
    let baseReconLoss = 45 + Math.random() * 10; // Start high (45-55)
    let baseKLLoss = 15 + Math.random() * 5;     // KL component
    let currentRank = latentDim * 0.9;           // Start near full rank
    
    for (let epoch = 1; epoch <= epochs; epoch++) {
      // Reconstruction loss: Exponential decay with noise
      baseReconLoss = Math.max(8, 
        baseReconLoss * Math.exp(-0.15) + (Math.random() - 0.5) * 2
      );
      
      // KL loss: Faster initial decrease, then plateau
      const klDecayRate = epoch < epochs/3 ? 0.25 : 0.05;
      baseKLLoss = Math.max(2, 
        baseKLLoss * Math.exp(-klDecayRate) + (Math.random() - 0.5) * 0.5
      );
      
      // Regularization loss
      let regLoss = 0;
      if (regularization === 'nuc') {
        regLoss = lambdaValue * Math.exp(-epoch / 10) * (currentRank / latentDim);
      } else if (regularization === 'majorizer') {
        regLoss = lambdaValue * 20 * Math.exp(-epoch / 8) * (currentRank / latentDim);
      }
      
      // Rank evolution (gradual decrease)
      const targetRank = this.calculateTargetRank(regularization, lambdaValue, latentDim);
      const rankProgress = 1 - Math.exp(-epoch / 12);
      currentRank = currentRank - (currentRank - targetRank) * rankProgress * 0.1;
      currentRank += (Math.random() - 0.5) * 0.5; // Add noise
      
      // Store metrics
      reconstructionLosses.push(baseReconLoss);
      klLosses.push(baseKLLoss);
      regularizationLosses.push(regLoss);
      losses.push(baseReconLoss + baseKLLoss + regLoss);
      latentRanks.push(Math.max(1, currentRank));
    }
    
    return {
      totalLosses: losses,
      reconstructionLosses,
      klLosses,
      regularizationLosses,
      latentRanks,
      convergenceEpoch: this.findConvergencePoint(losses)
    };
  }
  
  private static calculateTargetRank(
    regularization: string,
    lambdaValue: number,
    latentDim: number
  ): number {
    if (regularization === 'none') return latentDim * 0.8;
    
    if (regularization === 'nuc') {
      // Nuclear norm: aggressive rank reduction
      const reduction = Math.min(0.95, lambdaValue / 200);
      return Math.max(1, latentDim * (1 - reduction));
    }
    
    if (regularization === 'majorizer') {
      // Log-det: moderate rank reduction
      const reduction = Math.min(0.8, lambdaValue * 0.6);
      return Math.max(2, latentDim * (1 - reduction));
    }
    
    return latentDim;
  }
  
  private static findConvergencePoint(losses: number[]): number {
    if (losses.length < 5) return losses.length;
    
    for (let i = 4; i < losses.length; i++) {
      const recentLosses = losses.slice(i - 4, i + 1);
      const avgLoss = recentLosses.reduce((a, b) => a + b) / recentLosses.length;
      const variance = recentLosses.reduce((sum, loss) => sum + Math.pow(loss - avgLoss, 2), 0) / recentLosses.length;
      
      if (variance < 1.0) { // Converged when variance is low
        return i + 1;
      }
    }
    
    return losses.length;
  }
}

export type { ReconstructionParams, TrainingMetrics };
