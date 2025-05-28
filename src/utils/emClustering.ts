
export interface EMClusteringParams {
  samplesPerCluster: number;
  nClusters: number;
  maxIterations: number;
  convergenceThreshold: number;
}

export const DEFAULT_EM_PARAMS: EMClusteringParams = {
  samplesPerCluster: 150,
  nClusters: 3,
  maxIterations: 50,
  convergenceThreshold: 1e-4
};

export interface DataPoint {
  x: number;
  y: number;
  cluster: number;
}

export interface ClusterState {
  mean: [number, number];
  covariance: number[][];
}

export interface EMState {
  data: DataPoint[];
  clusters: ClusterState[];
  iteration: number;
  converged: boolean;
  responsibilities: number[][];
}

// Utility functions for matrix operations
export function matrixInverse2x2(matrix: number[][]): number[][] {
  const [[a, b], [c, d]] = matrix;
  const det = a * d - b * c;
  
  if (Math.abs(det) < 1e-10) {
    // Add regularization for singular matrices
    return [[1 + 1e-6, 0], [0, 1 + 1e-6]];
  }
  
  return [
    [d / det, -b / det],
    [-c / det, a / det]
  ];
}

export function matrixMultiply(a: number[][], b: number[][]): number[][] {
  const result: number[][] = [];
  for (let i = 0; i < a.length; i++) {
    result[i] = [];
    for (let j = 0; j < b[0].length; j++) {
      let sum = 0;
      for (let k = 0; k < b.length; k++) {
        sum += a[i][k] * b[k][j];
      }
      result[i][j] = sum;
    }
  }
  return result;
}

export function matrixDeterminant2x2(matrix: number[][]): number {
  const [[a, b], [c, d]] = matrix;
  return a * d - b * c;
}

// Multivariate normal PDF calculation
export function multivariateNormalPdf(
  point: [number, number], 
  mean: [number, number], 
  covariance: number[][]
): number {
  const diff = [point[0] - mean[0], point[1] - mean[1]];
  const invCov = matrixInverse2x2(covariance);
  const det = matrixDeterminant2x2(covariance);
  
  if (det <= 0) return 1e-10;
  
  const quadForm = diff[0] * (invCov[0][0] * diff[0] + invCov[0][1] * diff[1]) +
                   diff[1] * (invCov[1][0] * diff[0] + invCov[1][1] * diff[1]);
  
  const normalizationFactor = 1 / (2 * Math.PI * Math.sqrt(det));
  return normalizationFactor * Math.exp(-0.5 * quadForm);
}

// Generate synthetic data with known clusters
export function generateClusterData(params: EMClusteringParams): DataPoint[] {
  // Use fixed seed for reproducibility (equivalent to np.random.seed(42))
  const random = seedRandom(42);
  const data: DataPoint[] = [];
  
  // Generate true cluster centers
  const trueMeans: [number, number][] = [];
  for (let i = 0; i < params.nClusters; i++) {
    trueMeans.push([
      random() * 8 + 2, // Range 2-10
      random() * 8 + 2  // Range 2-10
    ]);
  }
  
  // Generate data points for each cluster
  for (let cluster = 0; cluster < params.nClusters; cluster++) {
    const mean = trueMeans[cluster];
    const stdX = random() * 0.7 + 0.8; // Range 0.8-1.5
    const stdY = random() * 0.7 + 0.8; // Range 0.8-1.5
    
    for (let i = 0; i < params.samplesPerCluster; i++) {
      // Box-Muller transform for normal distribution
      const u1 = random();
      const u2 = random();
      const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
      const z1 = Math.sqrt(-2 * Math.log(u1)) * Math.sin(2 * Math.PI * u2);
      
      data.push({
        x: mean[0] + z0 * stdX,
        y: mean[1] + z1 * stdY,
        cluster
      });
    }
  }
  
  return data;
}

// Simple linear congruential generator for reproducible randomness
function seedRandom(seed: number) {
  let state = seed;
  return function() {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

// Initialize EM parameters randomly
export function initializeEMParameters(
  data: DataPoint[], 
  nClusters: number
): ClusterState[] {
  const random = seedRandom(123); // Different seed for initialization
  
  const xMin = Math.min(...data.map(p => p.x));
  const xMax = Math.max(...data.map(p => p.x));
  const yMin = Math.min(...data.map(p => p.y));
  const yMax = Math.max(...data.map(p => p.y));
  
  const clusters: ClusterState[] = [];
  
  for (let i = 0; i < nClusters; i++) {
    clusters.push({
      mean: [
        random() * (xMax - xMin) + xMin,
        random() * (yMax - yMin) + yMin
      ],
      covariance: [[1, 0], [0, 1]] // Identity matrix
    });
  }
  
  return clusters;
}

// EM Algorithm implementation
export function performEMStep(
  data: DataPoint[], 
  clusters: ClusterState[]
): { newClusters: ClusterState[], responsibilities: number[][], meanShift: number } {
  const n = data.length;
  const k = clusters.length;
  const responsibilities: number[][] = [];
  
  // E-step: Calculate responsibilities
  for (let i = 0; i < n; i++) {
    responsibilities[i] = [];
    let total = 0;
    
    for (let j = 0; j < k; j++) {
      const prob = multivariateNormalPdf(
        [data[i].x, data[i].y],
        clusters[j].mean,
        clusters[j].covariance
      );
      responsibilities[i][j] = prob + 1e-10; // Add small value to avoid zeros
      total += responsibilities[i][j];
    }
    
    // Normalize responsibilities
    for (let j = 0; j < k; j++) {
      responsibilities[i][j] /= total;
    }
  }
  
  // M-step: Update parameters
  const newClusters: ClusterState[] = [];
  let maxMeanShift = 0;
  
  for (let j = 0; j < k; j++) {
    const totalWeight = responsibilities.reduce((sum, resp) => sum + resp[j], 0);
    
    // Update mean
    const newMeanX = responsibilities.reduce((sum, resp, i) => sum + resp[j] * data[i].x, 0) / totalWeight;
    const newMeanY = responsibilities.reduce((sum, resp, i) => sum + resp[j] * data[i].y, 0) / totalWeight;
    const newMean: [number, number] = [newMeanX, newMeanY];
    
    // Calculate mean shift
    const meanShift = Math.sqrt(
      Math.pow(newMean[0] - clusters[j].mean[0], 2) +
      Math.pow(newMean[1] - clusters[j].mean[1], 2)
    );
    maxMeanShift = Math.max(maxMeanShift, meanShift);
    
    // Update covariance
    let cov00 = 0, cov01 = 0, cov10 = 0, cov11 = 0;
    
    for (let i = 0; i < n; i++) {
      const dx = data[i].x - newMean[0];
      const dy = data[i].y - newMean[1];
      const weight = responsibilities[i][j];
      
      cov00 += weight * dx * dx;
      cov01 += weight * dx * dy;
      cov10 += weight * dy * dx;
      cov11 += weight * dy * dy;
    }
    
    const newCovariance = [
      [cov00 / totalWeight + 1e-6, cov01 / totalWeight],
      [cov10 / totalWeight, cov11 / totalWeight + 1e-6]
    ];
    
    newClusters.push({
      mean: newMean,
      covariance: newCovariance
    });
  }
  
  return { newClusters, responsibilities, meanShift: maxMeanShift };
}

// Generate contour data for 2D visualization
export function generateContourData(
  cluster: ClusterState,
  xRange: [number, number],
  yRange: [number, number],
  resolution: number = 50
): { x: number[], y: number[], z: number[][] } {
  const x: number[] = [];
  const y: number[] = [];
  const z: number[][] = [];
  
  const xStep = (xRange[1] - xRange[0]) / (resolution - 1);
  const yStep = (yRange[1] - yRange[0]) / (resolution - 1);
  
  for (let i = 0; i < resolution; i++) {
    x.push(xRange[0] + i * xStep);
    y.push(yRange[0] + i * yStep);
  }
  
  for (let i = 0; i < resolution; i++) {
    z[i] = [];
    for (let j = 0; j < resolution; j++) {
      const point: [number, number] = [x[j], y[i]];
      z[i][j] = multivariateNormalPdf(point, cluster.mean, cluster.covariance);
    }
  }
  
  return { x, y, z };
}
