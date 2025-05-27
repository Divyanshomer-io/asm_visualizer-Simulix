
import { NeuralNetworkParams } from './neuralNetwork';

export interface TrainingMetrics {
  epoch: number;
  trainLoss: number;
  valLoss: number;
  trainAccuracy: number;
  valAccuracy: number;
  overfittingWarning?: boolean;
  earlyStopped?: boolean;
}

export interface DatasetValidation {
  duplicatesFound: number;
  trainClassDistribution: number[];
  valClassDistribution: number[];
  datasetTooSimple: boolean;
  simpleModelAccuracy: number;
  warnings: string[];
}

export class EarlyStopping {
  private patience: number;
  private minDelta: number;
  private bestLoss: number = Infinity;
  private counter: number = 0;
  private stopped: boolean = false;

  constructor(patience: number = 10, minDelta: number = 0.001) {
    this.patience = patience;
    this.minDelta = minDelta;
  }

  check(valLoss: number): boolean {
    if (valLoss < this.bestLoss - this.minDelta) {
      this.bestLoss = valLoss;
      this.counter = 0;
    } else {
      this.counter++;
    }
    
    this.stopped = this.counter >= this.patience;
    return this.stopped;
  }

  reset() {
    this.bestLoss = Infinity;
    this.counter = 0;
    this.stopped = false;
  }

  get isStopped() {
    return this.stopped;
  }
}

// Stratified train/validation split
export function trainValidationSplit(
  X: number[][],
  y: number[],
  testSize: number = 0.2,
  randomSeed: number = 42
): { XTrain: number[][], XVal: number[][], yTrain: number[], yVal: number[] } {
  // Simple seeded random for consistency
  let seed = randomSeed;
  const random = () => {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };

  // Create indices array
  const indices = Array.from({ length: X.length }, (_, i) => i);
  
  // Separate indices by class for stratification
  const class0Indices = indices.filter(i => y[i] === 0);
  const class1Indices = indices.filter(i => y[i] === 1);
  
  // Shuffle each class separately
  const shuffleArray = (arr: number[]) => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };
  
  shuffleArray(class0Indices);
  shuffleArray(class1Indices);
  
  // Split each class
  const class0Split = Math.floor(class0Indices.length * (1 - testSize));
  const class1Split = Math.floor(class1Indices.length * (1 - testSize));
  
  const trainIndices = [
    ...class0Indices.slice(0, class0Split),
    ...class1Indices.slice(0, class1Split)
  ];
  
  const valIndices = [
    ...class0Indices.slice(class0Split),
    ...class1Indices.slice(class1Split)
  ];
  
  // Create splits
  const XTrain = trainIndices.map(i => X[i]);
  const XVal = valIndices.map(i => X[i]);
  const yTrain = trainIndices.map(i => y[i]);
  const yVal = valIndices.map(i => y[i]);
  
  return { XTrain, XVal, yTrain, yVal };
}

// Validate dataset for common issues
export function validateDataset(
  XTrain: number[][],
  XVal: number[][],
  yTrain: number[],
  yVal: number[]
): DatasetValidation {
  const warnings: string[] = [];
  
  // Check for duplicates (simplified check using string comparison)
  const trainStrings = new Set(XTrain.map(row => row.join(',')));
  const valStrings = new Set(XVal.map(row => row.join(',')));
  const duplicatesFound = [...trainStrings].filter(str => valStrings.has(str)).length;
  
  if (duplicatesFound > 0) {
    warnings.push(`${duplicatesFound} duplicate samples found between train/val sets`);
  }
  
  // Check class distributions
  const trainClassDistribution = [
    yTrain.filter(y => y === 0).length,
    yTrain.filter(y => y === 1).length
  ];
  
  const valClassDistribution = [
    yVal.filter(y => y === 0).length,
    yVal.filter(y => y === 1).length
  ];
  
  // Check if dataset is too simple using simple logistic regression
  const simpleModelAccuracy = evaluateSimpleModel(XTrain, XVal, yTrain, yVal);
  const datasetTooSimple = simpleModelAccuracy > 0.95;
  
  if (datasetTooSimple) {
    warnings.push(`Dataset may be too simple (simple model achieves ${(simpleModelAccuracy * 100).toFixed(1)}% accuracy)`);
  }
  
  // Check class balance
  const trainBalance = Math.min(...trainClassDistribution) / Math.max(...trainClassDistribution);
  const valBalance = Math.min(...valClassDistribution) / Math.max(...valClassDistribution);
  
  if (trainBalance < 0.3 || valBalance < 0.3) {
    warnings.push('Severe class imbalance detected');
  }
  
  return {
    duplicatesFound,
    trainClassDistribution,
    valClassDistribution,
    datasetTooSimple,
    simpleModelAccuracy,
    warnings
  };
}

// Simple logistic regression implementation for dataset validation
function evaluateSimpleModel(
  XTrain: number[][],
  XVal: number[][],
  yTrain: number[],
  yVal: number[]
): number {
  // Simplified logistic regression using gradient descent
  const numFeatures = XTrain[0].length;
  let weights = Array(numFeatures).fill(0);
  let bias = 0;
  const learningRate = 0.01;
  const epochs = 100;
  
  const sigmoid = (z: number) => 1 / (1 + Math.exp(-Math.max(-250, Math.min(250, z))));
  
  // Training
  for (let epoch = 0; epoch < epochs; epoch++) {
    for (let i = 0; i < XTrain.length; i++) {
      const x = XTrain[i];
      const y = yTrain[i];
      
      let z = bias;
      for (let j = 0; j < numFeatures; j++) {
        z += weights[j] * x[j];
      }
      
      const prediction = sigmoid(z);
      const error = prediction - y;
      
      // Update weights
      bias -= learningRate * error;
      for (let j = 0; j < numFeatures; j++) {
        weights[j] -= learningRate * error * x[j];
      }
    }
  }
  
  // Evaluate on validation set
  let correct = 0;
  for (let i = 0; i < XVal.length; i++) {
    const x = XVal[i];
    const y = yVal[i];
    
    let z = bias;
    for (let j = 0; j < numFeatures; j++) {
      z += weights[j] * x[j];
    }
    
    const prediction = sigmoid(z) > 0.5 ? 1 : 0;
    if (prediction === y) correct++;
  }
  
  return correct / XVal.length;
}

// Calculate cross-entropy loss
export function calculateCrossEntropyLoss(predictions: number[], targets: number[]): number {
  let loss = 0;
  for (let i = 0; i < predictions.length; i++) {
    const pred = Math.max(1e-15, Math.min(1 - 1e-15, predictions[i]));
    loss += -(targets[i] * Math.log(pred) + (1 - targets[i]) * Math.log(1 - pred));
  }
  return loss / predictions.length;
}

// Detect overfitting based on recent validation loss trend
export function detectOverfitting(valLosses: number[], windowSize: number = 5): boolean {
  if (valLosses.length < windowSize + 2) return false;
  
  const recentLosses = valLosses.slice(-windowSize);
  const prevLosses = valLosses.slice(-windowSize - windowSize, -windowSize);
  
  const recentAvg = recentLosses.reduce((a, b) => a + b, 0) / recentLosses.length;
  const prevAvg = prevLosses.reduce((a, b) => a + b, 0) / prevLosses.length;
  
  return recentAvg > prevAvg + 0.001; // Validation loss increasing
}

// Quality gates for model validation
export function validateModelQuality(metrics: TrainingMetrics[]): string[] {
  const warnings: string[] = [];
  
  if (metrics.length === 0) return warnings;
  
  const finalMetrics = metrics[metrics.length - 1];
  
  // Check for suspiciously high accuracy
  if (finalMetrics.trainAccuracy > 0.95 || finalMetrics.valAccuracy > 0.95) {
    warnings.push('Suspiciously high accuracy (>95%) - investigate for data leakage');
  }
  
  // Check train/val gap
  const accuracyGap = Math.abs(finalMetrics.trainAccuracy - finalMetrics.valAccuracy);
  if (accuracyGap > 0.1) {
    warnings.push('Large train/validation accuracy gap suggests overfitting');
  }
  
  // Check for too rapid convergence
  if (metrics.length < 10 && finalMetrics.trainAccuracy > 0.9) {
    warnings.push('Suspiciously rapid convergence - check dataset difficulty');
  }
  
  // Check minimum training epochs
  if (metrics.length < 20 && !finalMetrics.earlyStopped) {
    warnings.push('Training ended with fewer than 20 epochs - may need more training');
  }
  
  return warnings;
}
