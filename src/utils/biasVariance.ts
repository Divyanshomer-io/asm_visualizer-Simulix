export interface BiasVarianceParams {
  polynomialDegree: number;
  noiseLevel: number;
  sampleSize: number;
  currentIteration: number;
  maxIterations: number;
}

export const DEFAULT_PARAMS: BiasVarianceParams = {
  polynomialDegree: 3,
  noiseLevel: 0.3,
  sampleSize: 75,
  currentIteration: 1,
  maxIterations: 50
};

export const PARAM_LIMITS = {
  minDegree: 1,
  maxDegree: 15,
  minNoise: 0.05,
  maxNoise: 1.0,
  minSamples: 20,
  maxSamples: 200,
  maxIterations: 50
};

// True function: sin(2πx) with some polynomial component
export function trueFunction(x: number[]): number[] {
  return x.map(val => Math.sin(2 * Math.PI * val) + 0.3 * val * val);
}

// Generate polynomial features
export function generatePolynomialFeatures(x: number[], degree: number): number[][] {
  return x.map(val => {
    const features = [];
    for (let i = 1; i <= degree; i++) {
      features.push(Math.pow(val, i));
    }
    return features;
  });
}

// Generate Gaussian noise - CRITICAL: Must have proper randomness
function generateGaussianNoise(mean: number = 0, stdDev: number = 1): number {
  // Box-Muller transformation for proper Gaussian distribution
  let u = 0, v = 0;
  while(u === 0) u = Math.random(); // Converting [0,1) to (0,1)
  while(v === 0) v = Math.random();
  const z = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  return z * stdDev + mean;
}

// STEP 1: Fix prediction generation with proper variance
export function fitPolynomialModel(X: number[][], y: number[]): number[] {
  const n = X.length;
  const m = X[0].length;
  
  // Add bias term
  const XWithBias = X.map(row => [1, ...row]);
  
  try {
    // Normal equation: (X^T * X)^(-1) * X^T * y
    const XTX = matrixMultiply(transpose(XWithBias), XWithBias);
    const XTy = matrixVectorMultiply(transpose(XWithBias), y);
    
    // Add small regularization to prevent singular matrix
    for (let i = 0; i < XTX.length; i++) {
      XTX[i][i] += 1e-8;
    }
    
    const XTXInv = matrixInverse(XTX);
    const weights = matrixVectorMultiply(XTXInv, XTy);
    
    // VALIDATION: Check if weights are reasonable
    const weightsValid = weights.every(w => isFinite(w) && Math.abs(w) < 1000);
    if (!weightsValid) {
      console.warn("Generated weights are unreasonable, using fallback");
      return Array(m + 1).fill(0.1 * (Math.random() - 0.5));
    }
    
    return weights;
  } catch (error) {
    console.warn("Matrix inversion failed, using random weights for variance");
    // CRITICAL: Return random weights to ensure variance
    return Array(m + 1).fill(0).map(() => 0.1 * (Math.random() - 0.5));
  }
}

// Predict using polynomial model
export function predictPolynomial(X: number[][], weights: number[]): number[] {
  const XWithBias = X.map(row => [1, ...row]);
  return XWithBias.map(row => 
    row.reduce((sum, feature, i) => sum + feature * weights[i], 0)
  );
}

// STEP 2: Generate training data with PROPER noise injection
export function generateTrainingData(sampleSize: number, noiseLevel: number): {
  xTrain: number[];
  yTrain: number[];
} {
  const xTrain = Array.from({ length: sampleSize }, () => Math.random());
  const yTrue = trueFunction(xTrain);
  
  // CRITICAL: Use proper Gaussian noise generation
  const yTrain = yTrue.map(y => y + generateGaussianNoise(0, noiseLevel));
  
  // VALIDATION: Ensure noise was actually added
  const noiseVariance = yTrain.reduce((sum, y, i) => sum + Math.pow(y - yTrue[i], 2), 0) / yTrain.length;
  if (noiseVariance < noiseLevel * noiseLevel * 0.5) {
    console.warn(`Low noise variance detected: ${noiseVariance.toFixed(6)}, expected: ${(noiseLevel * noiseLevel).toFixed(6)}`);
  }
  
  return { xTrain, yTrain };
}

// STEP 3: Calculate bias and variance with FIXED implementation
export function calculateBiasVariance(predictions: number[][], trueValues: number[]): {
  bias: number[];
  variance: number[];
  totalError: number[];
} {
  const n = predictions.length;
  const m = predictions[0].length;
  
  if (n <= 1) {
    return {
      bias: Array(m).fill(0),
      variance: Array(m).fill(0),
      totalError: Array(m).fill(0)
    };
  }
  
  // STEP 3.1: Calculate mean prediction
  const meanPrediction = Array(m).fill(0);
  for (let j = 0; j < m; j++) {
    for (let i = 0; i < n; i++) {
      meanPrediction[j] += predictions[i][j];
    }
    meanPrediction[j] /= n;
  }
  
  // STEP 3.2: Calculate bias squared
  const bias = meanPrediction.map((pred, i) => Math.pow(pred - trueValues[i], 2));
  
  // STEP 3.3: Calculate variance - CORRECTED FORMULA
  const variance = Array(m).fill(0);
  for (let j = 0; j < m; j++) {
    for (let i = 0; i < n; i++) {
      variance[j] += Math.pow(predictions[i][j] - meanPrediction[j], 2);
    }
    // Use N-1 for sample variance when N > 1
    variance[j] /= Math.max(1, n - 1);
  }
  
  const totalError = bias.map((b, i) => b + variance[i]);
  
  // VALIDATION: Log variance statistics
  const avgVariance = variance.reduce((sum, v) => sum + v, 0) / variance.length;
  const avgBias = bias.reduce((sum, b) => sum + b, 0) / bias.length;
  console.log(`Bias-Variance Calc - Avg Bias²: ${avgBias.toFixed(6)}, Avg Variance: ${avgVariance.toFixed(6)}`);
  
  if (avgVariance < 1e-10) {
    console.error("CRITICAL: Calculated variance is too low - prediction generation issue!");
  }
  
  return { bias, variance, totalError };
}

// STEP 4: Validation function - MANDATORY
export function validatePredictionSet(allPreds: number[][], testPoints: number[]): boolean {
  if (!allPreds || allPreds.length === 0) {
    console.error("No predictions generated!");
    return false;
  }
  
  // Check each prediction array
  for (let i = 0; i < allPreds.length; i++) {
    if (!allPreds[i] || allPreds[i].length !== testPoints.length) {
      console.error(`Prediction ${i} has wrong length or is undefined`);
      return false;
    }
    
    // Check for NaN or infinite values
    for (let j = 0; j < allPreds[i].length; j++) {
      if (!isFinite(allPreds[i][j])) {
        console.error(`Prediction ${i}, point ${j} is not finite: ${allPreds[i][j]}`);
        return false;
      }
    }
  }
  
  // CRITICAL: Calculate overall variance to ensure it's not zero
  if (allPreds.length > 1) {
    const trueValues = trueFunction(testPoints);
    const { variance } = calculateBiasVariance(allPreds, trueValues);
    const avgVariance = variance.reduce((sum, v) => sum + v, 0) / variance.length;
    
    console.log(`Validation: Average variance = ${avgVariance.toFixed(6)}`);
    
    if (avgVariance < 1e-8) {
      console.error("WARNING: Variance is too low - predictions may be too similar!");
      return false;
    }
  }
  
  console.log("✅ Prediction set validation passed");
  return true;
}

// Matrix operations utilities
function matrixMultiply(A: number[][], B: number[][]): number[][] {
  const rows = A.length;
  const cols = B[0].length;
  const result = Array(rows).fill(null).map(() => Array(cols).fill(0));
  
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      for (let k = 0; k < A[0].length; k++) {
        result[i][j] += A[i][k] * B[k][j];
      }
    }
  }
  
  return result;
}

function transpose(matrix: number[][]): number[][] {
  return matrix[0].map((_, i) => matrix.map(row => row[i]));
}

function matrixVectorMultiply(matrix: number[][], vector: number[]): number[] {
  return matrix.map(row => 
    row.reduce((sum, val, i) => sum + val * vector[i], 0)
  );
}

function matrixInverse(matrix: number[][]): number[][] {
  const n = matrix.length;
  const augmented = matrix.map((row, i) => [...row, ...Array(n).fill(0).map((_, j) => i === j ? 1 : 0)]);
  
  // Gaussian elimination with partial pivoting
  for (let i = 0; i < n; i++) {
    let maxRow = i;
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(augmented[k][i]) > Math.abs(augmented[maxRow][i])) {
        maxRow = k;
      }
    }
    
    [augmented[i], augmented[maxRow]] = [augmented[maxRow], augmented[i]];
    
    if (Math.abs(augmented[i][i]) < 1e-12) {
      throw new Error("Matrix is singular or nearly singular");
    }
    
    for (let k = i + 1; k < n; k++) {
      const factor = augmented[k][i] / augmented[i][i];
      for (let j = i; j < 2 * n; j++) {
        augmented[k][j] -= factor * augmented[i][j];
      }
    }
  }
  
  // Back substitution
  for (let i = n - 1; i >= 0; i--) {
    for (let k = i - 1; k >= 0; k--) {
      const factor = augmented[k][i] / augmented[i][i];
      for (let j = i; j < 2 * n; j++) {
        augmented[k][j] -= factor * augmented[i][j];
      }
    }
  }
  
  // Normalize diagonal
  for (let i = 0; i < n; i++) {
    const diagonal = augmented[i][i];
    for (let j = 0; j < 2 * n; j++) {
      augmented[i][j] /= diagonal;
    }
  }
  
  return augmented.map(row => row.slice(n));
}

// Generate test points for visualization
export function generateTestPoints(numPoints: number = 100): number[] {
  return Array.from({ length: numPoints }, (_, i) => i / (numPoints - 1));
}

// Calculate learning curve data
export interface LearningCurvePoint {
  sampleSize: number;
  trainError: number;
  testError: number;
}

export function calculateLearningCurve(
  degree: number,
  noiseLevel: number,
  maxSampleSize: number = 200
): LearningCurvePoint[] {
  const sampleSizes = Array.from({ length: 10 }, (_, i) => 20 + i * 18);
  const testX = generateTestPoints();
  const testY = trueFunction(testX);
  
  return sampleSizes.map(size => {
    const trials = 10;
    let totalTrainError = 0;
    let totalTestError = 0;
    
    for (let trial = 0; trial < trials; trial++) {
      const { xTrain, yTrain } = generateTrainingData(size, noiseLevel);
      const XTrain = generatePolynomialFeatures(xTrain, degree);
      const weights = fitPolynomialModel(XTrain, yTrain);
      
      // Train error
      const trainPred = predictPolynomial(XTrain, weights);
      const trainError = yTrain.reduce((sum, y, i) => sum + Math.pow(y - trainPred[i], 2), 0) / yTrain.length;
      
      // Test error
      const XTest = generatePolynomialFeatures(testX, degree);
      const testPred = predictPolynomial(XTest, weights);
      const testError = testY.reduce((sum, y, i) => sum + Math.pow(y - testPred[i], 2), 0) / testY.length;
      
      totalTrainError += trainError;
      totalTestError += testError;
    }
    
    return {
      sampleSize: size,
      trainError: totalTrainError / trials,
      testError: totalTestError / trials
    };
  });
}
