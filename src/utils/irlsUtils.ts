/**
 * Calculate the derivative of the Huber function (psi function)
 * @param r Residual value
 * @param k Tuning constant for the Huber function
 */
export const psiFunction = (r: number, k: number): number => {
  if (r < -k) return -2 * k;
  if (r > k) return 2 * k;
  return 2 * r;
};

/**
 * Calculate the weight for a data point based on its residual
 * @param r Residual value
 * @param k Tuning constant for the Huber function
 */
export const calculateWeight = (r: number, k: number): number => {
  // Avoid division by zero
  if (Math.abs(r) < 0.000001) return 1;
  
  const psiValue = psiFunction(r, k);
  return psiValue / r;
};

/**
 * Perform a single iteration of the IRLS algorithm
 * @param data Array of data points
 * @param currentEstimate Current estimate of the parameter
 * @param k Tuning constant for the Huber function
 */
export const performIRLSIteration = (
  data: number[],
  currentEstimate: number,
  k: number
): { 
  newEstimate: number; 
  weights: number[]; 
  residuals: number[];
  weightedSum: number;
  weightSum: number;
} => {
  // Calculate residuals
  const residuals = data.map(x => x - currentEstimate);
  
  // Calculate weights
  const weights = residuals.map(r => calculateWeight(r, k));
  
  // Calculate weighted sum of data points
  let weightedSum = 0;
  let weightSum = 0;
  
  for (let i = 0; i < data.length; i++) {
    weightedSum += weights[i] * data[i];
    weightSum += weights[i];
  }
  
  // Calculate new estimate
  const newEstimate = weightSum !== 0 ? weightedSum / weightSum : currentEstimate;
  
  return {
    newEstimate,
    weights,
    residuals,
    weightedSum,
    weightSum
  };
};

/**
 * Calculate the Huber function value
 * @param x Input value
 * @param k Tuning constant for the Huber function
 */
export const huberFunction = (x: number, k: number): number => {
  const absX = Math.abs(x);
  if (absX <= k) {
    return x * x;
  } else {
    return 2 * k * absX - k * k;
  }
};

/**
 * Calculate the mean of an array of numbers
 */
export const calculateMean = (data: number[]): number => {
  return data.reduce((sum, val) => sum + val, 0) / data.length;
};
