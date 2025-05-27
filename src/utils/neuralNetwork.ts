import { 
  TrainingMetrics, 
  DatasetValidation, 
  EarlyStopping, 
  trainValidationSplit, 
  validateDataset, 
  calculateCrossEntropyLoss, 
  detectOverfitting,
  validateModelQuality 
} from './neuralNetworkValidation';

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
  metrics: TrainingMetrics[];
  datasetValidation: DatasetValidation;
  qualityWarnings: string[];
  earlyStopped: boolean;
  finalEpoch: number;
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

// Generate a more challenging dataset to prevent unrealistic accuracy
export function generateClassificationDataset(
  numSamples: number,
  numFeatures: number,
  randomSeed: number = 42
): { X: number[][], y: number[] } {
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
      sample.push((random() - 0.5) * 6); // Wider range for more complexity
    }
    X.push(sample);
    
    // More complex classification rule to prevent easy separation
    const weightedSum = sample.reduce((acc, val, idx) => {
      const weight = Math.sin(idx + 1) * 0.7; // Non-uniform weights
      return acc + val * weight;
    }, 0);
    
    // Add noise to make classification more challenging
    const noise = (random() - 0.5) * 2;
    const decision = weightedSum + noise;
    
    // Non-linear decision boundary
    const threshold = Math.sin(sample[0] * 0.3) * 0.5;
    y.push(decision > threshold ? 1 : 0);
  }

  return { X, y };
}

// Enhanced MLP with proper validation
export class SimpleMLP {
  private weights: number[][][];
  private biases: number[][];
  private layers: number[];
  private activation: string;
  private learningRate: number;
  private alpha: number;
  private trainingHistory: TrainingHistory;
  private earlyStopping: EarlyStopping;

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
    this.earlyStopping = new EarlyStopping(15, 0.001); // More patient early stopping
    this.trainingHistory = {
      metrics: [],
      datasetValidation: {
        duplicatesFound: 0,
        trainClassDistribution: [],
        valClassDistribution: [],
        datasetTooSimple: false,
        simpleModelAccuracy: 0,
        warnings: []
      },
      qualityWarnings: [],
      earlyStopped: false,
      finalEpoch: 0
    };
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
          // He initialization for ReLU, Xavier for others
          const scale = this.activation === 'relu' ? 
            Math.sqrt(2.0 / this.layers[i]) : 
            Math.sqrt(1.0 / this.layers[i]);
          neuronWeights.push((Math.random() * 2 - 1) * scale);
        }
        layerWeights.push(neuronWeights);
        layerBiases.push((Math.random() - 0.5) * 0.1); // Small random bias
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
          nextActivation.push(activationFunctions.sigmoid(sum));
        } else {
          nextActivation.push(this.applyActivation(sum));
        }
      }
      
      activations.push(nextActivation);
      currentActivation = nextActivation;
    }

    return activations;
  }

  public trainWithValidation(X: number[][], y: number[], maxEpochs: number = 100): TrainingHistory {
    // Reset training state
    this.earlyStopping.reset();
    this.trainingHistory.metrics = [];
    
    // Create train/validation split
    const { XTrain, XVal, yTrain, yVal } = trainValidationSplit(X, y, 0.2, 42);
    
    // Validate dataset
    this.trainingHistory.datasetValidation = validateDataset(XTrain, XVal, yTrain, yVal);
    
    console.log('Dataset Validation Results:', this.trainingHistory.datasetValidation);
    
    // Training loop with validation monitoring
    for (let epoch = 0; epoch < maxEpochs; epoch++) {
      // Training phase
      let trainLoss = 0;
      let trainCorrect = 0;
      
      // Shuffle training data
      const indices = Array.from({ length: XTrain.length }, (_, i) => i);
      for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
      }
      
      for (const idx of indices) {
        const activations = this.forward(XTrain[idx]);
        const prediction = activations[activations.length - 1][0];
        const target = yTrain[idx];

        // Calculate loss
        const sampleLoss = -(target * Math.log(Math.max(prediction, 1e-15)) + 
                            (1 - target) * Math.log(Math.max(1 - prediction, 1e-15)));
        trainLoss += sampleLoss;

        // Check accuracy
        if ((prediction > 0.5 ? 1 : 0) === target) {
          trainCorrect++;
        }

        // Backpropagation
        this.backpropagate(activations, target);
      }
      
      // Validation phase
      let valLoss = 0;
      let valCorrect = 0;
      const valPredictions: number[] = [];
      
      for (let i = 0; i < XVal.length; i++) {
        const activations = this.forward(XVal[i]);
        const prediction = activations[activations.length - 1][0];
        const target = yVal[i];
        
        valPredictions.push(prediction);
        
        const sampleLoss = -(target * Math.log(Math.max(prediction, 1e-15)) + 
                            (1 - target) * Math.log(Math.max(1 - prediction, 1e-15)));
        valLoss += sampleLoss;
        
        if ((prediction > 0.5 ? 1 : 0) === target) {
          valCorrect++;
        }
      }
      
      // Calculate metrics
      const metrics: TrainingMetrics = {
        epoch: epoch + 1,
        trainLoss: trainLoss / XTrain.length,
        valLoss: valLoss / XVal.length,
        trainAccuracy: trainCorrect / XTrain.length,
        valAccuracy: valCorrect / XVal.length,
        overfittingWarning: false,
        earlyStopped: false
      };
      
      // Check for overfitting
      this.trainingHistory.metrics.push(metrics);
      
      if (this.trainingHistory.metrics.length > 5) {
        metrics.overfittingWarning = detectOverfitting(
          this.trainingHistory.metrics.map(m => m.valLoss)
        );
      }
      
      // Early stopping check
      if (this.earlyStopping.check(metrics.valLoss)) {
        metrics.earlyStopped = true;
        this.trainingHistory.earlyStopped = true;
        this.trainingHistory.finalEpoch = epoch + 1;
        console.log(`Early stopping triggered at epoch ${epoch + 1}`);
        break;
      }
      
      this.trainingHistory.finalEpoch = epoch + 1;
      
      // Log progress every 10 epochs
      if ((epoch + 1) % 10 === 0) {
        console.log(`Epoch ${epoch + 1}: Train Acc: ${(metrics.trainAccuracy * 100).toFixed(1)}%, Val Acc: ${(metrics.valAccuracy * 100).toFixed(1)}%, Val Loss: ${metrics.valLoss.toFixed(4)}`);
      }
    }
    
    // Final quality validation
    this.trainingHistory.qualityWarnings = validateModelQuality(this.trainingHistory.metrics);
    
    return this.trainingHistory;
  }

  // Keep existing train method for backward compatibility
  public train(X: number[][], y: number[], epochs: number = 1): void {
    for (let epoch = 0; epoch < epochs; epoch++) {
      for (let i = 0; i < X.length; i++) {
        const activations = this.forward(X[i]);
        const prediction = activations[activations.length - 1][0];
        const target = y[i];
        this.backpropagate(activations, target);
      }
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

  public getTrainingHistory(): TrainingHistory {
    return this.trainingHistory;
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
