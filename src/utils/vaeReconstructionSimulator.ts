export class VAEReconstructionSimulator {
  
  // Calculate reconstruction quality based on training progress
  static getReconstructionQuality(
    currentEpoch: number, 
    totalEpochs: number, 
    regularization: string,
    lambdaValue: number
  ): number {
    // Base quality improves with epochs (0.1 to 0.9)
    const epochProgress = currentEpoch / totalEpochs;
    const baseQuality = 0.1 + (epochProgress * 0.8);
    
    // Regularization penalty reduces quality
    let regularizationPenalty = 0;
    if (regularization === 'nuc') {
      regularizationPenalty = Math.min(0.4, lambdaValue / 1000); // 0-0.4 penalty
    } else if (regularization === 'majorizer') {
      regularizationPenalty = Math.min(0.3, lambdaValue * 0.3); // 0-0.3 penalty
    }
    
    // Final quality (higher = better reconstruction)
    return Math.max(0.1, baseQuality - regularizationPenalty);
  }
  
  // Generate realistic blurred reconstruction
  static generateBlurredReconstruction(
    originalPixels: number[][], 
    quality: number
  ): number[][] {
    const blurredPixels = originalPixels.map(row => [...row]);
    const blurStrength = 1 - quality; // Higher blur for lower quality
    
    // Apply Gaussian-like blur
    for (let i = 1; i < 27; i++) {
      for (let j = 1; j < 27; j++) {
        // Average with neighboring pixels
        let sum = 0;
        let count = 0;
        
        for (let di = -1; di <= 1; di++) {
          for (let dj = -1; dj <= 1; dj++) {
            const ni = i + di;
            const nj = j + dj;
            if (ni >= 0 && ni < 28 && nj >= 0 && nj < 28) {
              sum += originalPixels[ni][nj];
              count++;
            }
          }
        }
        
        const avgValue = sum / count;
        
        // Blend original with blurred based on quality
        blurredPixels[i][j] = originalPixels[i][j] * quality + avgValue * (1 - quality);
        
        // Add noise based on blur strength
        blurredPixels[i][j] += (Math.random() - 0.5) * blurStrength * 0.1;
        
        // Clamp to valid range
        blurredPixels[i][j] = Math.max(0, Math.min(1, blurredPixels[i][j]));
      }
    }
    
    return blurredPixels;
  }
  
  // Enhanced MNIST digit generation with better patterns
  static generateEnhancedMNISTDigit(digitType: number): number[][] {
    const pixels: number[][] = Array(28).fill(0).map(() => Array(28).fill(0));
    
    switch (digitType) {
      case 0:
        this.drawCircle(pixels, 14, 14, 8);
        break;
      case 1:
        this.drawVerticalLine(pixels);
        break;
      case 2:
        this.drawTwo(pixels);
        break;
      case 3:
        this.drawThree(pixels);
        break;
      case 4:
        this.drawFour(pixels);
        break;
      case 5:
        this.drawFive(pixels);
        break;
      case 6:
        this.drawSix(pixels);
        break;
      case 7:
        this.drawSeven(pixels);
        break;
      case 8:
        this.drawEight(pixels);
        break;
      case 9:
        this.drawNine(pixels);
        break;
    }
    
    // Add slight handwriting variation
    this.addHandwritingNoise(pixels);
    
    return pixels;
  }
  
  private static drawCircle(pixels: number[][], centerX: number, centerY: number, radius: number) {
    for (let i = 0; i < 28; i++) {
      for (let j = 0; j < 28; j++) {
        const dist = Math.sqrt((i - centerX) ** 2 + (j - centerY) ** 2);
        if (Math.abs(dist - radius) < 1.5) {
          pixels[i][j] = 1;
        }
      }
    }
  }
  
  private static drawVerticalLine(pixels: number[][]) {
    for (let i = 6; i < 22; i++) {
      pixels[i][13] = 1;
      pixels[i][14] = 1;
    }
    // Add diagonal stroke at top
    for (let i = 6; i < 10; i++) {
      pixels[i][10 + i - 6] = 1;
    }
  }
  
  private static drawTwo(pixels: number[][]) {
    // Top horizontal line
    for (let j = 8; j < 20; j++) {
      pixels[8][j] = 1;
    }
    // Diagonal down
    for (let i = 8; i < 15; i++) {
      pixels[i][20 - (i - 8)] = 1;
    }
    // Bottom horizontal line
    for (let j = 8; j < 20; j++) {
      pixels[20][j] = 1;
    }
  }
  
  private static drawThree(pixels: number[][]) {
    // Top horizontal
    for (let j = 8; j < 18; j++) {
      pixels[8][j] = 1;
    }
    // Middle horizontal
    for (let j = 10; j < 16; j++) {
      pixels[14][j] = 1;
    }
    // Bottom horizontal
    for (let j = 8; j < 18; j++) {
      pixels[20][j] = 1;
    }
    // Right vertical
    for (let i = 8; i < 21; i++) {
      pixels[i][18] = 1;
    }
  }
  
  private static drawFour(pixels: number[][]) {
    // Left vertical
    for (let i = 6; i < 15; i++) {
      pixels[i][8] = 1;
    }
    // Horizontal
    for (let j = 8; j < 20; j++) {
      pixels[14][j] = 1;
    }
    // Right vertical
    for (let i = 6; i < 22; i++) {
      pixels[i][18] = 1;
    }
  }
  
  private static drawFive(pixels: number[][]) {
    // Top horizontal
    for (let j = 8; j < 18; j++) {
      pixels[8][j] = 1;
    }
    // Left vertical (top)
    for (let i = 8; i < 14; i++) {
      pixels[i][8] = 1;
    }
    // Middle horizontal
    for (let j = 8; j < 16; j++) {
      pixels[14][j] = 1;
    }
    // Right vertical (bottom)
    for (let i = 14; i < 20; i++) {
      pixels[i][16] = 1;
    }
    // Bottom horizontal
    for (let j = 8; j < 16; j++) {
      pixels[20][j] = 1;
    }
  }
  
  private static drawSix(pixels: number[][]) {
    this.drawCircle(pixels, 14, 16, 6);
    // Left vertical extending up
    for (let i = 8; i < 16; i++) {
      pixels[i][8] = 1;
    }
  }
  
  private static drawSeven(pixels: number[][]) {
    // Top horizontal
    for (let j = 8; j < 20; j++) {
      pixels[8][j] = 1;
    }
    // Diagonal line down
    for (let i = 8; i < 22; i++) {
      pixels[i][20 - Math.floor((i - 8) * 0.6)] = 1;
    }
  }
  
  private static drawEight(pixels: number[][]) {
    this.drawCircle(pixels, 14, 10, 5);
    this.drawCircle(pixels, 14, 18, 5);
  }
  
  private static drawNine(pixels: number[][]) {
    this.drawCircle(pixels, 14, 12, 6);
    // Right vertical extending down
    for (let i = 12; i < 22; i++) {
      pixels[i][20] = 1;
    }
  }
  
  private static addHandwritingNoise(pixels: number[][]) {
    for (let i = 0; i < 28; i++) {
      for (let j = 0; j < 28; j++) {
        if (pixels[i][j] > 0 && Math.random() < 0.1) {
          pixels[i][j] += (Math.random() - 0.5) * 0.3;
          pixels[i][j] = Math.max(0, Math.min(1, pixels[i][j]));
        }
      }
    }
  }
}

export interface EpochData {
  originalDigits: number[][][];
  reconstructions: number[][][];
  currentLoss: number;
  currentRank: number;
  quality: number;
}

export interface TrainingData {
  originalDigits: number[][][];
  finalReconstructions: number[][][];
  losses: number[];
  ranks: number[];
  reconstructionHistory: number[][][][];
}

export class VAETrainingSimulator {
  static async simulateTraining(
    params: any,
    onEpochComplete: (epoch: number, data: EpochData) => void,
    onTrainingComplete: (finalData: TrainingData) => void
  ) {
    const originalDigits = [0, 1, 2, 3, 4, 5, 6, 7].map(digit => 
      VAEReconstructionSimulator.generateEnhancedMNISTDigit(digit)
    );
    
    const losses: number[] = [];
    const ranks: number[] = [];
    const reconstructionHistory: number[][][][] = [];
    
    for (let epoch = 1; epoch <= params.epochs; epoch++) {
      // Calculate current reconstruction quality
      const quality = VAEReconstructionSimulator.getReconstructionQuality(
        epoch, 
        params.epochs, 
        params.regularization,
        params.regularization === 'nuc' ? params.lambdaNuc : params.lambdaMajorizer
      );
      
      // Generate progressively better reconstructions
      const reconstructions = originalDigits.map(pixels =>
        VAEReconstructionSimulator.generateBlurredReconstruction(pixels, quality)
      );
      
      // Simulate realistic loss curves
      const epochLoss = this.calculateEpochLoss(epoch, params);
      const epochRank = this.calculateEpochRank(epoch, params);
      
      losses.push(epochLoss);
      ranks.push(epochRank);
      reconstructionHistory.push(reconstructions);
      
      // Callback for real-time updates
      onEpochComplete(epoch, {
        originalDigits,
        reconstructions,
        currentLoss: epochLoss,
        currentRank: epochRank,
        quality
      });
      
      // Simulate training time
      await new Promise(resolve => setTimeout(resolve, 800));
    }
    
    onTrainingComplete({
      originalDigits,
      finalReconstructions: reconstructionHistory[reconstructionHistory.length - 1],
      losses,
      ranks,
      reconstructionHistory
    });
  }
  
  private static calculateEpochLoss(epoch: number, params: any): number {
    const baseDecay = 50 * Math.exp(-epoch / 8); // Base VAE loss decay
    const klPenalty = 5 * Math.exp(-epoch / 5);  // KL divergence term
    
    let regularizationPenalty = 0;
    if (params.regularization === 'nuc') {
      regularizationPenalty = params.lambdaNuc * Math.exp(-epoch / 10);
    } else if (params.regularization === 'majorizer') {
      regularizationPenalty = params.lambdaMajorizer * 10 * Math.exp(-epoch / 10);
    }
    
    const totalLoss = baseDecay + klPenalty + regularizationPenalty + Math.random() * 2;
    return Math.max(5, totalLoss); // Minimum loss threshold
  }
  
  private static calculateEpochRank(epoch: number, params: any): number {
    const initialRank = params.latentDim * 0.8;
    let targetRank = initialRank;
    
    if (params.regularization === 'nuc') {
      targetRank = Math.max(1, 10 - params.lambdaNuc / 50);
    } else if (params.regularization === 'majorizer') {
      targetRank = Math.max(2, 15 - params.lambdaMajorizer * 20);
    }
    
    const progress = 1 - Math.exp(-epoch / 10);
    const currentRank = initialRank - (initialRank - targetRank) * progress;
    
    return currentRank + (Math.random() - 0.5);
  }
}
