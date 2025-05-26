
// Statistical distribution functions
export const normalPdf = (x: number, mean: number = 0, std: number = 1): number => {
  const coefficient = 1 / (std * Math.sqrt(2 * Math.PI));
  const exponent = -0.5 * Math.pow((x - mean) / std, 2);
  return coefficient * Math.exp(exponent);
};

// Target distribution f(x) - standard normal
export const f = (x: number): number => normalPdf(x, 0, 1);

// Function h(x) with scale parameter
export const h = (x: number, scale: number = 0.5): number => Math.exp(scale * x);

// Proposal distribution g(x)
export const g = (x: number, t: number = 1.0): number => normalPdf(x, t, 1);

// Generate normal random samples
export const generateNormalSamples = (n: number, mean: number = 0, std: number = 1): number[] => {
  const samples: number[] = [];
  for (let i = 0; i < n; i++) {
    // Box-Muller transformation
    const u1 = Math.random();
    const u2 = Math.random();
    const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    samples.push(z * std + mean);
  }
  return samples;
};

// Monte Carlo estimate
export const mcEstimate = (n: number, scale: number = 0.5): { estimate: number; error: number } => {
  const samples = generateNormalSamples(n, 0, 1);
  const estimates = samples.map(x => h(x, scale));
  const mean = estimates.reduce((a, b) => a + b, 0) / n;
  const variance = estimates.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / (n - 1);
  return {
    estimate: mean,
    error: Math.sqrt(variance / n)
  };
};

// Importance Sampling estimate
export const isEstimate = (n: number, t: number = 1.0, scale: number = 0.5): { estimate: number; error: number } => {
  const samples = generateNormalSamples(n, t, 1);
  const weights = samples.map(x => f(x) / g(x, t));
  const estimates = samples.map((x, i) => h(x, scale) * weights[i]);
  const mean = estimates.reduce((a, b) => a + b, 0) / n;
  const variance = estimates.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / (n - 1);
  return {
    estimate: mean,
    error: Math.sqrt(variance / n)
  };
};

// Normalized Importance Sampling estimate
export const normalizedIsEstimate = (n: number, t: number = -1.5, scale: number = 0.7): { estimate: number; error: number } => {
  const samples = generateNormalSamples(n, t, 1);
  const weights = samples.map(x => f(x) / g(x, t));
  const weightSum = weights.reduce((a, b) => a + b, 0);
  const normWeights = weights.map(w => w / weightSum);
  const estimates = samples.map((x, i) => h(x, scale) * normWeights[i]);
  const estimate = estimates.reduce((a, b) => a + b, 0);
  const variance = estimates.reduce((a, b) => a + Math.pow(b - estimate, 2), 0) / (n - 1);
  return {
    estimate,
    error: Math.sqrt(variance / n)
  };
};

// Calculate true value (analytical solution)
export const calculateTrueValue = (scale: number = 0.5): number => {
  // For standard normal target and h(x) = exp(scale*x), the integral is exp(scale^2/2)
  return Math.exp((scale * scale) / 2);
};

export interface ImportanceSamplingParams {
  method: 'standard' | 'normalized';
  proposalT: number;
  scaleH: number;
  nDemo: number;
  nTrialsConv: number;
  nTrialsVar: number;
  maxSamples: number;
}

export const DEFAULT_PARAMS: ImportanceSamplingParams = {
  method: 'standard',
  proposalT: 1.0,
  scaleH: 0.6,
  nDemo: 200,
  nTrialsConv: 100,
  nTrialsVar: 80,
  maxSamples: 5000
};

export interface DistributionData {
  x: number;
  target: number;
  proposal: number;
  hScaled: number;
  area: number;
}

export interface SampleData {
  x: number;
  weight: number;
  normWeight: number;
}

export interface ConvergenceData {
  sampleSize: number;
  mcEstimate: number;
  mcError: number;
  isEstimate: number;
  isError: number;
  stdError?: number;
  normError?: number;
}

export interface VarianceData {
  parameter: number;
  variance: number;
  errorRatio?: number;
}
