interface ReconstructionParams {
  reconstructionFidelity: number;
  blurRadius: number;
  noiseLevel: number;
  contrastLoss: number;
  artifactStrength: number;
  expectedRank: number;
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

interface QualityMetrics {
  quality: number;
  expectedRank: number;
  blurLevel: number;
  artifacts: number;
}

// Enhanced realistic quality calculation based on research literature
class RealisticVAECalculator {
  static calculateReconstructionQuality(
    epoch: number,
    totalEpochs: number,
    latentDim: number,
    regularization: string,
    lambdaValue: number
  ): QualityMetrics {
    
    // Base progression: sigmoid curve for realistic training
    const epochProgress = Math.min(epoch / totalEpochs, 1);
    const baseQuality = 0.2 + (0.7 * (1 / (1 + Math.exp(-8 * (epochProgress - 0.5)))));
    
    // Latent dimension impact (based on MNIST research - optimal around 15-50)
    const latentOptimal = 25; // Sweet spot for MNIST
    const latentPenalty = Math.abs(latentDim - latentOptimal) / 100;
    const latentFactor = Math.max(0.7, 1 - latentPenalty);
    
    // Regularization-specific quality impact (calibrated to research)
    let regPenalty = 0;
    if (regularization === 'nuc') {
      // Nuclear norm: Gentle degradation up to λ=200, then steeper
      if (lambdaValue <= 100) {
        regPenalty = lambdaValue * 0.001; // 0-10% penalty
      } else if (lambdaValue <= 300) {
        regPenalty = 0.1 + (lambdaValue - 100) * 0.002; // 10-50% penalty
      } else {
        regPenalty = 0.5 + (lambdaValue - 300) * 0.001; // 50-70% penalty
      }
    } else if (regularization === 'majorizer') {
      // Log-det majorizer: More gradual degradation with calibrated mapping
      const majorizerQualityMap: { [key: number]: { quality: number; rank: number } } = {
        0.01: { quality: 0.85, rank: 0.9 },
        0.05: { quality: 0.75, rank: 0.7 },
        0.1: { quality: 0.65, rank: 0.5 },
        0.3: { quality: 0.45, rank: 0.3 },
        0.5: { quality: 0.35, rank: 0.2 },
        1.0: { quality: 0.25, rank: 0.1 }
      };
      
      const keys = Object.keys(majorizerQualityMap).map(k => parseFloat(k));
      const closestKey = keys.reduce((prev, curr) => 
        Math.abs(curr - lambdaValue) < Math.abs(prev - lambdaValue) ? curr : prev
      );
      
      regPenalty = 1 - majorizerQualityMap[closestKey].quality;
    }
    
    // Final quality with realistic bounds
    const finalQuality = Math.max(0.05, 
      baseQuality * latentFactor * (1 - regPenalty)
    );
    
    return {
      quality: finalQuality,
      expectedRank: this.calculateExpectedRank(latentDim, regularization, lambdaValue),
      blurLevel: (1 - finalQuality) * 0.8,
      artifacts: regPenalty * 0.5
    };
  }
  
  // Realistic rank calculation based on regularization strength
  static calculateExpectedRank(latentDim: number, regularization: string, lambdaValue: number): number {
    if (regularization === 'none') {
      return Math.floor(latentDim * 0.85); // High rank without regularization
    }
    
    if (regularization === 'nuc') {
      // Nuclear norm aggressively reduces rank
      const reductionFactor = Math.min(0.95, lambdaValue / 250);
      return Math.max(1, Math.floor(latentDim * (1 - reductionFactor)));
    }
    
    if (regularization === 'majorizer') {
      // Log-det majorizer: More gradual rank reduction with calibrated mapping
      const majorizerQualityMap: { [key: number]: { quality: number; rank: number } } = {
        0.01: { quality: 0.85, rank: 0.9 },
        0.05: { quality: 0.75, rank: 0.7 },
        0.1: { quality: 0.65, rank: 0.5 },
        0.3: { quality: 0.45, rank: 0.3 },
        0.5: { quality: 0.35, rank: 0.2 },
        1.0: { quality: 0.25, rank: 0.1 }
      };
      
      const keys = Object.keys(majorizerQualityMap).map(k => parseFloat(k));
      const closestKey = keys.reduce((prev, curr) => 
        Math.abs(curr - lambdaValue) < Math.abs(prev - lambdaValue) ? curr : prev
      );
      
      return Math.max(2, Math.floor(latentDim * majorizerQualityMap[closestKey].rank));
    }
    
    return latentDim;
  }
}

// Corrected loss calculation matching research patterns
class VAELossCalculator {
  static calculateRealisticLosses(
    epoch: number,
    totalEpochs: number,
    latentDim: number,
    regularization: string,
    lambdaNuc: number,
    lambdaMajorizer: number
  ): { total: number; reconstruction: number; kl: number; regularization: number } {
    
    // Base reconstruction loss (MSE) - starts high, decreases exponentially
    const reconLoss = Math.max(5, 35 * Math.exp(-epoch / 8) + Math.random() * 2);
    
    // KL divergence loss - starts moderate, stabilizes
    const klLoss = Math.max(0.5, 8 * Math.exp(-epoch / 12) + Math.random() * 0.5);
    
    // Regularization loss based on actual penalty strength
    let regLoss = 0;
    if (regularization === 'nuc') {
      // Nuclear norm penalty decreases as rank stabilizes
      const rankStabilization = Math.min(1, epoch / (totalEpochs * 0.7));
      regLoss = (lambdaNuc / 50) * Math.exp(-epoch / 15) * (1 - rankStabilization);
    } else if (regularization === 'majorizer') {
      // Log-det majorizer penalty
      const rankStabilization = Math.min(1, epoch / (totalEpochs * 0.8));
      regLoss = (lambdaMajorizer * 25) * Math.exp(-epoch / 12) * (1 - rankStabilization);
    }
    
    return {
      total: reconLoss + klLoss + regLoss,
      reconstruction: reconLoss,
      kl: klLoss,
      regularization: regLoss
    };
  }
}

export class RealisticVAEReconstructor {
  static calculateReconstructionFidelity(
    epoch: number,
    totalEpochs: number,
    latentDim: number,
    regularization: string,
    lambdaValue: number
  ): ReconstructionParams {
    
    const qualityMetrics = RealisticVAECalculator.calculateReconstructionQuality(
      epoch, totalEpochs, latentDim, regularization, lambdaValue
    );
    
    return {
      reconstructionFidelity: qualityMetrics.quality,
      blurRadius: qualityMetrics.blurLevel * 3, // 0-2.4 pixel blur
      noiseLevel: (1 - qualityMetrics.quality) * 0.15, // 0-15% noise
      contrastLoss: (1 - qualityMetrics.quality) * 0.4, // 0-40% contrast reduction
      artifactStrength: qualityMetrics.artifacts * 0.3, // Compression artifacts
      expectedRank: qualityMetrics.expectedRank
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
    
    // Ensure digits remain recognizable unless extremely over-regularized
    if (params.reconstructionFidelity > 0.15) {
      this.preserveStructure(result, originalPixels, params.reconstructionFidelity);
    }
    
    return result.map(row => row.map(v => Math.max(0, Math.min(1, v))));
  }
  
  private static preserveStructure(
    blurred: number[][], 
    original: number[][], 
    quality: number
  ): void {
    // Preserve key structural elements even in degraded reconstructions
    for (let i = 0; i < 28; i++) {
      for (let j = 0; j < 28; j++) {
        if (original[i][j] > 0.7) { // Strong original pixels
          blurred[i][j] = Math.max(blurred[i][j], original[i][j] * quality * 0.8);
        }
      }
    }
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
    
    // Get target rank for this configuration
    const targetRank = RealisticVAECalculator.calculateExpectedRank(latentDim, regularization, lambdaValue);
    let currentRank = latentDim * 0.9; // Start near full rank
    
    for (let epoch = 1; epoch <= epochs; epoch++) {
      // Use the corrected loss calculation
      const lossComponents = VAELossCalculator.calculateRealisticLosses(
        epoch, epochs, latentDim, regularization, 
        regularization === 'nuc' ? lambdaValue : 100,
        regularization === 'majorizer' ? lambdaValue : 0.09
      );
      
      // Rank evolution (gradual decrease towards target)
      const rankProgress = 1 - Math.exp(-epoch / 12);
      currentRank = currentRank - (currentRank - targetRank) * rankProgress * 0.1;
      currentRank += (Math.random() - 0.5) * 0.5; // Add noise
      
      // Store metrics
      reconstructionLosses.push(lossComponents.reconstruction);
      klLosses.push(lossComponents.kl);
      regularizationLosses.push(lossComponents.regularization);
      losses.push(lossComponents.total);
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
