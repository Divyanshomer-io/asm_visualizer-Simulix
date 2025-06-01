
export interface BiasVarianceParams {
  degree: number;    // Polynomial degree (1-15)
  noise: number;     // Noise level (0.05-1.0)
  samples: number;   // Training samples (20-200)
}

export interface BiasVarianceState {
  predictions: number[][];
  currentIteration: number;
  isPlaying: boolean;
  tradeoffData: {
    degrees: number[];
    bias: number[];
    variance: number[];
    total: number[];
  };
  learningCurveData: {
    trainError: number[];
    testError: number[];
  };
  errorDecomposition: {
    bias: number[];
    variance: number[];
    noise: number[];
    total: number[];
  };
  meanPrediction: number[];
  isLoading: boolean;
}

export const DEFAULT_PARAMS: BiasVarianceParams = {
  degree: 3,
  noise: 0.3,
  samples: 75
};

// True function - mirrors Python implementation
export const trueFunction = (x: number): number => {
  return Math.sin(3 * Math.PI * x) * Math.exp(-x);
};

// Generate random data
export const generateData = (samples: number, noise: number) => {
  const X = Array(samples)
    .fill(0)
    .map(() => Math.random() * 2 - 1)
    .sort((a, b) => a - b);
  
  const y = X.map(x => 
    trueFunction(x) + (Math.random() - 0.5) * 2 * noise
  );
  
  return { X, y };
};

// Create Vandermonde matrix for polynomial features
const createVandermondeMatrix = (X: number[], degree: number): number[][] => {
  return X.map(x => 
    Array.from({ length: degree + 1 }, (_, i) => Math.pow(x, i))
  );
};

// Matrix operations
const matrixMultiply = (A: number[][], B: number[][]): number[][] => {
  const result: number[][] = [];
  for (let i = 0; i < A.length; i++) {
    result[i] = [];
    for (let j = 0; j < B[0].length; j++) {
      let sum = 0;
      for (let k = 0; k < B.length; k++) {
        sum += A[i][k] * B[k][j];
      }
      result[i][j] = sum;
    }
  }
  return result;
};

const transpose = (matrix: number[][]): number[][] => {
  return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
};

const matrixInverse = (matrix: number[][]): number[][] => {
  const n = matrix.length;
  const identity = Array(n).fill(0).map((_, i) => 
    Array(n).fill(0).map((_, j) => i === j ? 1 : 0)
  );
  
  const augmented = matrix.map((row, i) => [...row, ...identity[i]]);
  
  // Gaussian elimination
  for (let i = 0; i < n; i++) {
    // Find pivot
    let maxRow = i;
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(augmented[k][i]) > Math.abs(augmented[maxRow][i])) {
        maxRow = k;
      }
    }
    
    // Swap rows
    [augmented[i], augmented[maxRow]] = [augmented[maxRow], augmented[i]];
    
    // Make diagonal 1
    const pivot = augmented[i][i];
    if (Math.abs(pivot) < 1e-10) {
      // Add small regularization
      augmented[i][i] += 1e-6;
    }
    
    for (let j = 0; j < 2 * n; j++) {
      augmented[i][j] /= augmented[i][i];
    }
    
    // Eliminate column
    for (let k = 0; k < n; k++) {
      if (k !== i) {
        const factor = augmented[k][i];
        for (let j = 0; j < 2 * n; j++) {
          augmented[k][j] -= factor * augmented[i][j];
        }
      }
    }
  }
  
  return augmented.map(row => row.slice(n));
};

// Train polynomial model using least squares
export const trainPolynomialModel = (X: number[], y: number[], degree: number): number[] => {
  const vandermonde = createVandermondeMatrix(X, degree);
  const vT = transpose(vandermonde);
  const vTv = matrixMultiply(vT, vandermonde);
  
  try {
    const vTvInv = matrixInverse(vTv);
    const vTy = vT.map(row => 
      row.reduce((sum, val, i) => sum + val * y[i], 0)
    );
    
    return vTvInv.map(row => 
      row.reduce((sum, val, i) => sum + val * vTy[i], 0)
    );
  } catch (error) {
    // Fallback: return simple linear regression
    console.warn('Matrix inversion failed, using fallback');
    return [0, 1]; // Simple linear model
  }
};

// Make predictions
export const predict = (coefficients: number[], X: number[]): number[] => {
  return X.map(x => 
    coefficients.reduce((sum, coef, i) => sum + coef * Math.pow(x, i), 0)
  );
};

// Calculate bias, variance, and noise decomposition
export const calculateErrors = (
  predictions: number[][],
  meanPrediction: number[],
  xPlot: number[],
  noise: number
) => {
  const trueValues = xPlot.map(trueFunction);
  
  const bias = meanPrediction.map((mean, i) => 
    Math.pow(mean - trueValues[i], 2)
  );
  
  const variance = meanPrediction.map((mean, i) => {
    const variance = predictions.reduce((sum, pred) => 
      sum + Math.pow(pred[i] - mean, 2), 0
    ) / predictions.length;
    return variance;
  });
  
  const noiseComponent = Array(xPlot.length).fill(noise * noise);
  
  const total = bias.map((b, i) => b + variance[i] + noiseComponent[i]);
  
  return {
    bias,
    variance,
    noise: noiseComponent,
    total
  };
};

// Generate x values for plotting
export const generatePlotX = (): number[] => {
  return Array.from({ length: 100 }, (_, i) => -1 + (i / 99) * 2);
};

// Calculate MSE
export const calculateMSE = (predictions: number[], targets: number[]): number => {
  return predictions.reduce((sum, pred, i) => 
    sum + Math.pow(pred - targets[i], 2), 0
  ) / predictions.length;
};
