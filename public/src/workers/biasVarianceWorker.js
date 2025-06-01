
// Web Worker for computationally intensive bias-variance calculations

// True function implementation
const trueFunction = (x) => {
  return Math.sin(3 * Math.PI * x) * Math.exp(-x);
};

// Generate random data
const generateData = (samples, noise) => {
  const X = Array(samples)
    .fill(0)
    .map(() => Math.random() * 2 - 1)
    .sort((a, b) => a - b);
  
  const y = X.map(x => 
    trueFunction(x) + (Math.random() - 0.5) * 2 * noise
  );
  
  return { X, y };
};

// Matrix operations
const createVandermondeMatrix = (X, degree) => {
  return X.map(x => 
    Array.from({ length: degree + 1 }, (_, i) => Math.pow(x, i))
  );
};

const matrixMultiply = (A, B) => {
  const result = [];
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

const transpose = (matrix) => {
  return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
};

const matrixInverse = (matrix) => {
  const n = matrix.length;
  const identity = Array(n).fill(0).map((_, i) => 
    Array(n).fill(0).map((_, j) => i === j ? 1 : 0)
  );
  
  const augmented = matrix.map((row, i) => [...row, ...identity[i]]);
  
  // Gaussian elimination with partial pivoting
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
      // Add regularization
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

// Train polynomial model
const trainPolynomialModel = (X, y, degree) => {
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
    // Fallback to simple model
    return [0, 1];
  }
};

// Make predictions
const predict = (coefficients, X) => {
  return X.map(x => 
    coefficients.reduce((sum, coef, i) => sum + coef * Math.pow(x, i), 0)
  );
};

// Calculate errors
const calculateErrors = (predictions, meanPrediction, xPlot, noise) => {
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
  
  return { bias, variance, noise: noiseComponent, total };
};

// Main computation function
const calculateTradeoffCurve = (params) => {
  const degrees = Array.from({ length: 15 }, (_, i) => i + 1);
  const biasData = [];
  const varianceData = [];
  const totalData = [];

  const xPlot = Array.from({ length: 100 }, (_, i) => -1 + (i / 99) * 2);

  degrees.forEach(degree => {
    const predictions = [];
    
    // Generate multiple predictions for this degree
    for (let i = 0; i < 30; i++) { // Reduced for worker performance
      const { X, y } = generateData(params.samples, params.noise);
      const model = trainPolynomialModel(X, y, degree);
      const pred = predict(model, xPlot);
      predictions.push(pred);
    }

    // Calculate mean prediction
    const meanPred = xPlot.map((_, i) => 
      predictions.reduce((sum, pred) => sum + pred[i], 0) / predictions.length
    );

    // Calculate errors
    const errors = calculateErrors(predictions, meanPred, xPlot, params.noise);
    
    // Average over x values
    biasData.push(errors.bias.reduce((sum, val) => sum + val, 0) / errors.bias.length);
    varianceData.push(errors.variance.reduce((sum, val) => sum + val, 0) / errors.variance.length);
    totalData.push(errors.total.reduce((sum, val) => sum + val, 0) / errors.total.length);
  });

  return {
    degrees,
    bias: biasData,
    variance: varianceData,
    total: totalData
  };
};

// Worker message handler
self.addEventListener('message', (e) => {
  const { type, params } = e.data;
  
  if (type === 'CALCULATE_TRADEOFF') {
    try {
      const result = calculateTradeoffCurve(params);
      
      self.postMessage({
        type: 'TRADEOFF_COMPLETE',
        data: result
      });
    } catch (error) {
      self.postMessage({
        type: 'TRADEOFF_ERROR',
        error: error.message
      });
    }
  }
});
