
/**
 * Bootstrapping utility functions for statistical resampling
 */

export const generateOriginalData = (size: number = 100): number[] => {
  // Generate sample data from normal distribution (mean=50, std=10)
  const data: number[] = [];
  for (let i = 0; i < size; i++) {
    // Box-Muller transform for normal distribution
    const u = Math.random();
    const v = Math.random();
    const z = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
    data.push(50 + 10 * z); // mean=50, std=10
  }
  return data;
};

export const generateBootstrapSamples = (
  originalData: number[],
  sampleSize: number,
  numSamples: number
): number[][] => {
  const bootstrapSamples: number[][] = [];
  
  for (let i = 0; i < numSamples; i++) {
    const sample: number[] = [];
    for (let j = 0; j < sampleSize; j++) {
      const randomIndex = Math.floor(Math.random() * originalData.length);
      sample.push(originalData[randomIndex]);
    }
    bootstrapSamples.push(sample);
  }
  
  return bootstrapSamples;
};

export const computeStatistic = (
  bootstrapSamples: number[][],
  statistic: 'mean' | 'median'
): number[] => {
  return bootstrapSamples.map(sample => {
    if (statistic === 'mean') {
      return sample.reduce((sum, val) => sum + val, 0) / sample.length;
    } else if (statistic === 'median') {
      const sorted = [...sample].sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      return sorted.length % 2 === 0
        ? (sorted[mid - 1] + sorted[mid]) / 2
        : sorted[mid];
    }
    return 0;
  });
};

export const calculateConfidenceInterval = (
  values: number[],
  confidenceLevel: number
): { lower: number; upper: number } => {
  const alpha = 1 - confidenceLevel;
  const sortedValues = [...values].sort((a, b) => a - b);
  const lowerIndex = Math.floor(sortedValues.length * alpha / 2);
  const upperIndex = Math.ceil(sortedValues.length * (1 - alpha / 2)) - 1;
  
  return {
    lower: sortedValues[lowerIndex],
    upper: sortedValues[upperIndex],
  };
};

export const calculateBiasAndMSE = (
  bootstrapStats: number[],
  trueValue: number
): { bias: number; mse: number } => {
  const mean = bootstrapStats.reduce((sum, val) => sum + val, 0) / bootstrapStats.length;
  const bias = Math.abs(mean - trueValue);
  const mse = bootstrapStats.reduce((acc, val) => acc + Math.pow(val - trueValue, 2), 0) / bootstrapStats.length;
  
  return { bias, mse };
};

export const generateNormalData = (mean: number, std: number, size: number): number[] => {
  const data: number[] = [];
  for (let i = 0; i < size; i++) {
    // Box-Muller transform
    const u = Math.random();
    const v = Math.random();
    const z = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
    data.push(mean + std * z);
  }
  return data;
};
