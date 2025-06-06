import { VAEReconstructionSimulator, VAETrainingSimulator } from './vaeReconstructionSimulator';

export interface VAEParams {
  latentDim: number;
  regularization: 'nuc' | 'majorizer' | 'none';
  lambdaNuc: number;
  lambdaMajorizer: number;
  epochs: number;
  batchSize: number;
  learningRate: number;
}

export interface VAEState {
  isTraining: boolean;
  epoch: number;
  totalEpochs: number;
  trainLoss: number[];
  valLoss: number[];
  latentRanks: number[];
  reconstructions: number[][][]; // [batch, height, width]
  originalImages: number[][][]; // [batch, height, width]
  latentVectors: number[][]; // [batch, latentDim]
  trainingProgress: number;
  status: string;
  digitLabels: number[]; // Actual digit labels for display
  reconstructionQuality?: number; // NEW: Track reconstruction quality
}

export interface TrainingData {
  originalImages: number[][][];
  reconstructions: number[][][];
  latentVectors: number[][];
  digitLabels: number[];
}

// Enhanced synthetic MNIST digit generator using the new simulator
export const generateSyntheticMNIST = (batchSize: number = 8): TrainingData => {
  const originalImages = Array.from({ length: batchSize }, (_, index) => {
    const digit = index % 10;
    return VAEReconstructionSimulator.generateEnhancedMNISTDigit(digit);
  });
  
  // Start with very poor quality reconstructions (quality = 0.1)
  const reconstructions = originalImages.map(original => {
    return VAEReconstructionSimulator.generateBlurredReconstruction(original, 0.1);
  });
  
  const latentVectors = Array.from({ length: batchSize }, () => 
    Array.from({ length: 50 }, () => Math.random() * 2 - 1)
  );
  
  const digitLabels = Array.from({ length: batchSize }, (_, i) => i % 10);
  
  return { originalImages, reconstructions, latentVectors, digitLabels };
};

// Generate a synthetic digit pattern
const generateDigitPattern = (digit: number): number[][] => {
  const size = 28;
  const image: number[][] = Array(size).fill(0).map(() => Array(size).fill(0));
  
  switch (digit) {
    case 0:
      drawCircle(image, 14, 14, 8);
      break;
    case 1:
      drawLine(image, 14, 6, 14, 22);
      drawLine(image, 12, 8, 14, 6);
      break;
    case 2:
      drawLine(image, 6, 8, 22, 8);
      drawLine(image, 22, 8, 14, 14);
      drawLine(image, 14, 14, 6, 20);
      drawLine(image, 6, 20, 22, 20);
      break;
    case 3:
      drawLine(image, 6, 8, 22, 8);
      drawLine(image, 6, 14, 18, 14);
      drawLine(image, 6, 20, 22, 20);
      drawLine(image, 22, 8, 22, 20);
      break;
    case 4:
      drawLine(image, 6, 6, 6, 14);
      drawLine(image, 6, 14, 22, 14);
      drawLine(image, 18, 6, 18, 22);
      break;
    case 5:
      drawLine(image, 6, 6, 22, 6);
      drawLine(image, 6, 6, 6, 14);
      drawLine(image, 6, 14, 18, 14);
      drawLine(image, 18, 14, 18, 20);
      drawLine(image, 6, 20, 18, 20);
      break;
    case 6:
      drawCircle(image, 14, 16, 6);
      drawLine(image, 8, 6, 8, 16);
      break;
    case 7:
      drawLine(image, 6, 6, 22, 6);
      drawLine(image, 22, 6, 12, 22);
      break;
    case 8:
      drawCircle(image, 14, 10, 5);
      drawCircle(image, 14, 18, 5);
      break;
    case 9:
      drawCircle(image, 14, 12, 6);
      drawLine(image, 20, 12, 20, 22);
      break;
    default:
      drawCircle(image, 14, 14, 6);
  }
  
  return image;
};

const drawCircle = (image: number[][], centerX: number, centerY: number, radius: number) => {
  for (let y = 0; y < 28; y++) {
    for (let x = 0; x < 28; x++) {
      const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
      if (Math.abs(distance - radius) < 1.5) {
        image[y][x] = 1;
      }
    }
  }
};

const drawLine = (image: number[][], x1: number, y1: number, x2: number, y2: number) => {
  const dx = Math.abs(x2 - x1);
  const dy = Math.abs(y2 - y1);
  const sx = x1 < x2 ? 1 : -1;
  const sy = y1 < y2 ? 1 : -1;
  let err = dx - dy;
  
  let x = x1;
  let y = y1;
  
  while (true) {
    if (x >= 0 && x < 28 && y >= 0 && y < 28) {
      image[y][x] = 1;
    }
    
    if (x === x2 && y === y2) break;
    
    const e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      x += sx;
    }
    if (e2 < dx) {
      err += dx;
      y += sy;
    }
  }
};

export const calculateMatrixRank = (matrix: number[][]): number => {
  const rows = matrix.length;
  const cols = matrix[0]?.length || 0;
  
  if (rows === 0 || cols === 0) return 0;
  
  const flatMatrix = matrix.flat();
  const nonZeroElements = flatMatrix.filter(x => Math.abs(x) > 1e-4).length;
  const totalElements = flatMatrix.length;
  
  const sparsity = nonZeroElements / totalElements;
  const baseRank = Math.min(rows, cols);
  
  return Math.max(1, Math.ceil(baseRank * sparsity * (0.3 + Math.random() * 0.4)));
};

export const applyNuclearNormRegularization = (
  latentVectors: number[][],
  lambda: number
): number => {
  const flatVectors = latentVectors.flat();
  const sumSquares = flatVectors.reduce((sum, val) => sum + val * val, 0);
  const nuclearApprox = Math.sqrt(sumSquares / flatVectors.length);
  return lambda * nuclearApprox * 0.01;
};

export const applyLogDetMajorizer = (
  latentVectors: number[][],
  lambda: number
): number => {
  const epsilon = 1e-6;
  const flatVectors = latentVectors.flat();
  
  const regularizationTerm = flatVectors.reduce((sum, val) => {
    const absVal = Math.abs(val);
    const singularValueApprox = absVal / (absVal + epsilon);
    return sum + Math.log(1 + singularValueApprox);
  }, 0);
  
  return lambda * regularizationTerm / flatVectors.length;
};

// Enhanced simulation step using the new training simulator
export const simulateTrainingStep = (
  epoch: number,
  params: VAEParams
): {
  trainLoss: number;
  valLoss: number;
  latentRank: number;
} => {
  return {
    trainLoss: VAETrainingSimulator['calculateEpochLoss'](epoch, params),
    valLoss: VAETrainingSimulator['calculateEpochLoss'](epoch, params) + 2 + Math.random() * 3,
    latentRank: VAETrainingSimulator['calculateEpochRank'](epoch, params)
  };
};
