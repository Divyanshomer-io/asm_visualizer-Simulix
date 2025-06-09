export interface MMHistory {
  x: number[];
  f: number[];
  g: number[];
  grad_f_norm: number[];
  grad_g_norm: number[];
  learning_rates: number[];
  iterations: number[];
  lambda_values: number[];
  z_dim_values: number[];
}

export class MMOptimizer {
  private f: (x: number) => number;
  private grad_f: (x: number) => number;
  private L: number;
  private params: { latentDim: number; lambdaNuc: number; lambdaMajorizer: number; regularization: string };
  public history: MMHistory;

  constructor(f: (x: number) => number, grad_f: (x: number) => number, lipschitz_L: number, vaeParams: any) {
    this.f = f;
    this.grad_f = grad_f;
    this.L = lipschitz_L;
    this.params = vaeParams;
    this.history = {
      x: [],
      f: [],
      g: [],
      grad_f_norm: [],
      grad_g_norm: [],
      learning_rates: [],
      iterations: [],
      lambda_values: [],
      z_dim_values: []
    };
  }

  // Parameter-aware surrogate function
  surrogate(x: number, x0: number): number {
    const f_x0 = this.f(x0);
    const f_x = this.f(x);
    
    // λ-dependent scaling factor
    const lambda = this.params.regularization === 'nuc' ? this.params.lambdaNuc : this.params.lambdaMajorizer;
    const reg_scale = 1 + lambda / 100;
    
    // z_dim capacity factor
    const latent_cap = Math.sqrt(this.params.latentDim / 10);
    
    return (Math.log(f_x0 + 1e-8) + 
            (f_x - f_x0) / (f_x0 + 1e-8) * reg_scale * latent_cap);
  }

  // Parameter-aware MM update rule
  step(x: number, x0: number, iteration: number): number {
    const f_x0 = this.f(x0);
    
    // Adaptive learning rate based on λ and z_dim
    const lambda = this.params.regularization === 'nuc' ? this.params.lambdaNuc : this.params.lambdaMajorizer;
    const lr_base = 0.1 / (1 + lambda / 100);
    const lr_scale = Math.sqrt(this.params.latentDim / 50);
    const eta = (f_x0 / this.L) * lr_base * lr_scale;
    
    // Track objectives and gradients with parameter information
    this.history.x.push(x);
    this.history.f.push(Math.log(this.f(x)));
    this.history.g.push(this.surrogate(x, x0));
    this.history.iterations.push(iteration);
    this.history.learning_rates.push(eta);
    this.history.lambda_values.push(lambda);
    this.history.z_dim_values.push(this.params.latentDim);
    
    const grad_f = this.grad_f(x);
    const grad_g = grad_f / (f_x0 + 1e-8); // Scaled gradient with stability
    
    // Parameter-dependent gradient scaling
    const grad_scale = 1 + lambda / 200;
    
    // Log gradient magnitudes
    this.history.grad_f_norm.push(Math.abs(grad_f / (this.f(x) + 1e-8)));
    this.history.grad_g_norm.push(Math.abs(grad_g * grad_scale));
    
    return x - eta * grad_g * grad_scale;
  }

  reset(): void {
    this.history = {
      x: [],
      f: [],
      g: [],
      grad_f_norm: [],
      grad_g_norm: [],
      learning_rates: [],
      iterations: [],
      lambda_values: [],
      z_dim_values: []
    };
  }
}

// Parameter-aware MM optimization simulation
export const simulateMMOptimization = (epochs: number, latentDim: number, vaeParams: any): MMHistory => {
  // Parameter-dependent objective function
  const lambda = vaeParams.regularization === 'nuc' ? vaeParams.lambdaNuc : vaeParams.lambdaMajorizer;
  const complexity_factor = Math.log(latentDim + 1) * (1 + lambda / 300);
  
  const f = (x: number) => {
    const base_loss = Math.exp(-x * x / (latentDim * 0.1)) * (50 + Math.random() * 10);
    return base_loss * complexity_factor;
  };
  
  const grad_f = (x: number) => {
    const base_grad = -2 * x * f(x) / (latentDim * 0.1);
    return base_grad * (1 + lambda / 500); // λ-dependent gradient scaling
  };
  
  const lipschitz_L = 10.0 * (1 + lambda / 100); // Parameter-dependent Lipschitz constant
  const optimizer = new MMOptimizer(f, grad_f, lipschitz_L, vaeParams);
  
  let x = Math.random() * 2 - 1; // Initial point
  
  for (let i = 1; i <= epochs; i++) {
    const x_prev = x;
    x = optimizer.step(x, x_prev, i);
    
    // Parameter-dependent stochasticity
    const noise_scale = 0.1 * Math.sqrt(latentDim / 50) / (1 + lambda / 200);
    x += (Math.random() - 0.5) * noise_scale;
  }
  
  return optimizer.history;
};
