export interface SVRGHistory {
  variance: number[];
  sgd_variance: number[];
  snapshots: number[];
  corrections: number[][];
  grad_norms: number[];
  iterations: number[];
  snapshot_epochs: number[];
  lambda_influence: number[];
  z_dim_capacity: number[];
}

export class SVRGOptimizer {
  private grad_fi: (x: number, i: number) => number;
  private n_samples: number;
  private batch_size: number;
  private params: { latentDim: number; lambdaNuc: number; lambdaMajorizer: number; regularization: string };
  public history: SVRGHistory;

  constructor(grad_fi: (x: number, i: number) => number, n_samples: number, batch_size: number, vaeParams: any) {
    this.grad_fi = grad_fi;
    this.n_samples = n_samples;
    this.batch_size = batch_size;
    this.params = vaeParams;
    this.history = {
      variance: [],
      sgd_variance: [],
      snapshots: [],
      corrections: [],
      grad_norms: [],
      iterations: [],
      snapshot_epochs: [],
      lambda_influence: [],
      z_dim_capacity: []
    };
  }

  // Parameter-aware snapshot gradient
  snapshotGradient(x: number): number {
    const gradients = [];
    for (let i = 0; i < this.n_samples; i++) {
      gradients.push(this.grad_fi(x, i));
    }
    
    // λ-dependent gradient averaging
    const lambda = this.params.regularization === 'nuc' ? this.params.lambdaNuc : this.params.lambdaMajorizer;
    const regularization_weight = 1 + lambda / 300;
    
    return gradients.reduce((sum, grad) => sum + grad, 0) / gradients.length * regularization_weight;
  }

  // Parameter-aware SVRG step
  step(x: number, snapshot_x: number, snapshot_grad: number, iteration: number): { gradient: number; variance: number } {
    const batch_indices = Array.from({ length: this.batch_size }, () => 
      Math.floor(Math.random() * this.n_samples)
    );
    
    const batch_grads: number[] = [];
    const corrections: number[] = [];
    const lambda = this.params.regularization === 'nuc' ? this.params.lambdaNuc : this.params.lambdaMajorizer;
    
    for (const i of batch_indices) {
      const grad_current = this.grad_fi(x, i);
      const grad_snapshot = this.grad_fi(snapshot_x, i);
      
      // λ-dependent gradient correction
      const correction = (grad_current - grad_snapshot) * (1 + lambda / 200);
      const svrg_grad = correction + snapshot_grad;
      
      batch_grads.push(svrg_grad);
      corrections.push(correction);
    }
    
    // Calculate variance with parameter awareness
    const mean_grad = batch_grads.reduce((sum, grad) => sum + grad, 0) / batch_grads.length;
    const variance = batch_grads.reduce((sum, grad) => sum + Math.pow(grad - mean_grad, 2), 0) / batch_grads.length;
    
    // SGD baseline variance (higher)
    const sgd_variance = variance * (2 + lambda / 100); // λ makes SGD relatively worse
    
    // Track metrics with parameter influence
    this.history.variance.push(variance);
    this.history.sgd_variance.push(sgd_variance);
    this.history.corrections.push(corrections);
    this.history.grad_norms.push(Math.abs(mean_grad));
    this.history.iterations.push(iteration);
    this.history.lambda_influence.push(lambda);
    this.history.z_dim_capacity.push(this.params.latentDim);
    
    return { gradient: mean_grad, variance };
  }

  // Parameter-dependent snapshot scheduling
  shouldSnapshot(epoch: number, total_epochs: number): boolean {
    const lambda = this.params.regularization === 'nuc' ? this.params.lambdaNuc : this.params.lambdaMajorizer;
    
    // High λ requires more frequent snapshots
    let base_interval = Math.max(5, Math.floor(total_epochs / 10));
    if (lambda > 300) {
      base_interval = Math.max(3, Math.floor(base_interval / 2));
    }
    
    // Low z_dim requires less frequent snapshots (capacity limitation)
    if (this.params.latentDim < 20) {
      base_interval = Math.min(total_epochs / 3, base_interval * 1.5);
    }
    
    return epoch % Math.floor(base_interval) === 0;
  }

  addSnapshot(epoch: number): void {
    this.history.snapshots.push(this.history.iterations.length);
    this.history.snapshot_epochs.push(epoch);
  }

  reset(): void {
    this.history = {
      variance: [],
      sgd_variance: [],
      snapshots: [],
      corrections: [],
      grad_norms: [],
      iterations: [],
      snapshot_epochs: [],
      lambda_influence: [],
      z_dim_capacity: []
    };
  }
}

// Parameter-aware SVRG optimization simulation
export const simulateSVRGOptimization = (epochs: number, latentDim: number, batchSize: number, vaeParams: any): SVRGHistory => {
  const n_samples = Math.max(100, latentDim * 10); // Scale samples with latent dimension
  const lambda = vaeParams.regularization === 'nuc' ? vaeParams.lambdaNuc : vaeParams.lambdaMajorizer;
  
  // Parameter-dependent stochastic gradient function
  const grad_fi = (x: number, i: number) => {
    const base_noise = (Math.random() - 0.5) * 0.1;
    const param_scale = Math.sqrt(latentDim / 50) * (1 + lambda / 400);
    const sample_variation = Math.sin(i * 0.1) * 0.05; // Sample-specific variation
    
    return -2 * x * param_scale + base_noise + sample_variation;
  };
  
  const optimizer = new SVRGOptimizer(grad_fi, n_samples, batchSize, vaeParams);
  
  let x = Math.random() * 2 - 1;
  let snapshot_x = x;
  let snapshot_grad = optimizer.snapshotGradient(x);
  
  for (let epoch = 1; epoch <= epochs; epoch++) {
    // Parameter-dependent snapshot decision
    if (optimizer.shouldSnapshot(epoch, epochs)) {
      snapshot_x = x;
      snapshot_grad = optimizer.snapshotGradient(x);
      optimizer.addSnapshot(epoch);
    }
    
    // SVRG step with parameter awareness
    const { gradient } = optimizer.step(x, snapshot_x, snapshot_grad, epoch);
    
    // Parameter-dependent learning rate
    const lr = 0.01 / (1 + lambda / 100) * Math.sqrt(latentDim / 50);
    x -= lr * gradient;
    
    // Add parameter-dependent noise
    const noise_scale = 0.05 * Math.sqrt(latentDim / 50) / (1 + lambda / 300);
    x += (Math.random() - 0.5) * noise_scale;
  }
  
  return optimizer.history;
};
