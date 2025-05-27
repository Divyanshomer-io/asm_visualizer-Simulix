
export interface NeuralNetworkParams {
  inputNeurons: number;
  hiddenLayers: number;
  neuronsPerHidden: number;
  activation: 'relu' | 'sigmoid' | 'tanh';
  alpha: number;
  learningRate: number;
}

export const DEFAULT_PARAMS: NeuralNetworkParams = {
  inputNeurons: 4,
  hiddenLayers: 1,
  neuronsPerHidden: 6,
  activation: 'relu',
  alpha: 0.001,
  learningRate: 0.01
};

export const PARAM_LIMITS = {
  maxInput: 8,
  maxHiddenLayers: 3,
  maxNeurons: 15,
  maxSamples: 500
};

export interface TrainingHistory {
  loss: number[];
  accuracy: number[];
  iteration: number[];
}

export interface NetworkLayer {
  neurons: number;
  activations?: number[];
  weights?: number[][];
  biases?: number[];
}

export interface NeuralNetwork {
  layers: NetworkLayer[];
  weights: number[][][];
  biases: number[][];
  activations: number[][];
}

// Activation functions
export const activationFunctions = {
  relu: (x: number) => Math.max(0, x),
  sigmoid: (x: number) => 1 / (1 + Math.exp(-Math.max(-250, Math.min(250, x)))),
  tanh: (x: number) => Math.tanh(x)
};

// Dataset generation
export function generateClassificationDataset(
  numSamples: number,
  numFeatures: number,
  randomSeed: number = 42
): { X: number[][], y: number[] } {
  // Simple seeded random number generator
  let seed = randomSeed;
  const random = () => {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };

  const X: number[][] = [];
  const y: number[] = [];

  for (let i = 0; i < numSamples; i++) {
    const sample: number[] = [];
    for (let j = 0; j < numFeatures; j++) {
      sample.push((random() - 0.5) * 4); // Range [-2, 2]
    }
    X.push(sample);
    
    // Simple classification rule: sum of features > 0
    const sum = sample.reduce((acc, val) => acc + val, 0);
    y.push(sum > 0 ? 1 : 0);
  }

  return { X, y };
}

// Simple MLP implementation
export class SimpleMLP {
  private weights: number[][][];
  private biases: number[][];
  private layers: number[];
  private activation: string;
  private learningRate: number;
  private alpha: number;
  public loss: number = 0;
  public trainingHistory: TrainingHistory = { loss: [], accuracy: [], iteration: [] };
  private iteration: number = 0;

  constructor(
    layers: number[],
    activation: string = 'relu',
    learningRate: number = 0.01,
    alpha: number = 0.001
  ) {
    this.layers = layers;
    this.activation = activation;
    this.learningRate = learningRate;
    this.alpha = alpha;
    this.initializeWeights();
  }

  private initializeWeights() {
    this.weights = [];
    this.biases = [];

    for (let i = 0; i < this.layers.length - 1; i++) {
      const layerWeights: number[][] = [];
      const layerBiases: number[] = [];

      for (let j = 0; j < this.layers[i + 1]; j++) {
        const neuronWeights: number[] = [];
        for (let k = 0; k < this.layers[i]; k++) {
          // Xavier initialization
          neuronWeights.push((Math.random() - 0.5) * 2 / Math.sqrt(this.layers[i]));
        }
        layerWeights.push(neuronWeights);
        layerBiases.push(0);
      }
      
      this.weights.push(layerWeights);
      this.biases.push(layerBiases);
    }
  }

  private applyActivation(x: number): number {
    switch (this.activation) {
      case 'relu':
        return activationFunctions.relu(x);
      case 'sigmoid':
        return activationFunctions.sigmoid(x);
      case 'tanh':
        return activationFunctions.tanh(x);
      default:
        return x;
    }
  }

  private applyActivationDerivative(x: number): number {
    switch (this.activation) {
      case 'relu':
        return x > 0 ? 1 : 0;
      case 'sigmoid':
        const sig = activationFunctions.sigmoid(x);
        return sig * (1 - sig);
      case 'tanh':
        const tanh_val = Math.tanh(x);
        return 1 - tanh_val * tanh_val;
      default:
        return 1;
    }
  }

  public forward(input: number[]): number[][] {
    const activations: number[][] = [input];
    let currentActivation = input;

    for (let i = 0; i < this.weights.length; i++) {
      const nextActivation: number[] = [];
      
      for (let j = 0; j < this.weights[i].length; j++) {
        let sum = this.biases[i][j];
        for (let k = 0; k < currentActivation.length; k++) {
          sum += currentActivation[k] * this.weights[i][j][k];
        }
        
        if (i === this.weights.length - 1) {
          // Output layer - use sigmoid
          nextActivation.push(activationFunctions.sigmoid(sum));
        } else {
          // Hidden layers - use specified activation
          nextActivation.push(this.applyActivation(sum));
        }
      }
      
      activations.push(nextActivation);
      currentActivation = nextActivation;
    }

    return activations;
  }

  public train(X: number[][], y: number[], epochs: number = 1): void {
    for (let epoch = 0; epoch < epochs; epoch++) {
      let totalLoss = 0;
      let correct = 0;

      for (let i = 0; i < X.length; i++) {
        const activations = this.forward(X[i]);
        const prediction = activations[activations.length - 1][0];
        const target = y[i];

        // Calculate loss (binary cross-entropy)
        const loss = -(target * Math.log(Math.max(prediction, 1e-15)) + 
                       (1 - target) * Math.log(Math.max(1 - prediction, 1e-15)));
        totalLoss += loss;

        // Check accuracy
        if ((prediction > 0.5 ? 1 : 0) === target) {
          correct++;
        }

        // Backpropagation
        this.backpropagate(activations, target);
      }

      this.loss = totalLoss / X.length;
      const accuracy = correct / X.length;
      
      this.iteration++;
      this.trainingHistory.loss.push(this.loss);
      this.trainingHistory.accuracy.push(accuracy);
      this.trainingHistory.iteration.push(this.iteration);
    }
  }

  private backpropagate(activations: number[][], target: number): void {
    const deltas: number[][] = [];
    
    // Output layer delta
    const outputActivation = activations[activations.length - 1][0];
    const outputDelta = outputActivation - target;
    deltas.unshift([outputDelta]);

    // Hidden layer deltas
    for (let i = this.weights.length - 2; i >= 0; i--) {
      const layerDeltas: number[] = [];
      
      for (let j = 0; j < activations[i + 1].length; j++) {
        let error = 0;
        for (let k = 0; k < deltas[0].length; k++) {
          error += deltas[0][k] * this.weights[i + 1][k][j];
        }
        
        const derivative = this.applyActivationDerivative(activations[i + 1][j]);
        layerDeltas.push(error * derivative);
      }
      
      deltas.unshift(layerDeltas);
    }

    // Update weights and biases
    for (let i = 0; i < this.weights.length; i++) {
      for (let j = 0; j < this.weights[i].length; j++) {
        for (let k = 0; k < this.weights[i][j].length; k++) {
          const gradient = deltas[i][j] * activations[i][k];
          this.weights[i][j][k] -= this.learningRate * (gradient + this.alpha * this.weights[i][j][k]);
        }
        this.biases[i][j] -= this.learningRate * deltas[i][j];
      }
    }
  }

  public getWeights(): number[][][] {
    return this.weights;
  }

  public getBiases(): number[][] {
    return this.biases;
  }

  public predict(X: number[][]): number[] {
    return X.map(sample => {
      const activations = this.forward(sample);
      return activations[activations.length - 1][0] > 0.5 ? 1 : 0;
    });
  }

  public score(X: number[][], y: number[]): number {
    const predictions = this.predict(X);
    const correct = predictions.reduce((acc, pred, i) => acc + (pred === y[i] ? 1 : 0), 0);
    return correct / y.length;
  }
}
