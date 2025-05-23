
export interface ToySimulationParams {
  r: number;
  maxIterations: number;
  initialTemperature: number;
  coolingRate: number;
  neighborType: 'Single Bit Flip' | 'Two Bit Flip' | 'Random Walk';
  coolingSchedule: 'Geometric' | 'Linear' | 'Logarithmic';
  coefficients: number[];
}

export interface IterationData {
  iteration: number;
  state: number;
  value: number;
  bestValue: number;
  temperature: number;
  acceptanceProbability: number;
  binaryRepresentation: number[];
}

export interface SimulatedAnnealingToyState {
  history: IterationData[];
  bestState: number;
  bestValue: number;
  acceptedWorse: number;
  currentIteration: number;
  searchSpace: { state: number; value: number }[];
}

// Core mathematical functions
export function evaluatePolynomial(n: number, coefficients: number[]): number {
  return coefficients.reduce((sum, coef, i) => sum + coef * Math.pow(n, i), 0);
}

export function intToBinaryArray(n: number, r: number): number[] {
  const clamped = Math.max(0, Math.min(n, Math.pow(2, r) - 1));
  if (r <= 0) return [];
  
  return n.toString(2)
    .padStart(r, '0')
    .split('')
    .map(bit => parseInt(bit));
}

export function binaryArrayToInt(binaryArray: number[]): number {
  if (binaryArray.length === 0) return 0;
  return parseInt(binaryArray.join(''), 2);
}

// Neighbor generation functions
export function singleBitFlipNeighbor(state: number, r: number): number {
  if (r <= 0) return state;
  
  const binaryArray = intToBinaryArray(state, r);
  const flipIndex = Math.floor(Math.random() * r);
  binaryArray[flipIndex] = 1 - binaryArray[flipIndex];
  
  return binaryArrayToInt(binaryArray);
}

export function twoBitFlipNeighbor(state: number, r: number): number {
  if (r < 2) return state;
  
  const binaryArray = intToBinaryArray(state, r);
  const indices = [];
  
  // Select two different random indices
  while (indices.length < 2) {
    const index = Math.floor(Math.random() * r);
    if (!indices.includes(index)) {
      indices.push(index);
    }
  }
  
  // Flip both bits
  indices.forEach(index => {
    binaryArray[index] = 1 - binaryArray[index];
  });
  
  return binaryArrayToInt(binaryArray);
}

export function randomWalkNeighbor(state: number, r: number): number {
  if (r <= 0) return 0;
  return Math.floor(Math.random() * Math.pow(2, r));
}

export function generateNeighbor(
  state: number, 
  r: number, 
  neighborType: ToySimulationParams['neighborType']
): number {
  switch (neighborType) {
    case 'Single Bit Flip':
      return singleBitFlipNeighbor(state, r);
    case 'Two Bit Flip':
      return twoBitFlipNeighbor(state, r);
    case 'Random Walk':
      return randomWalkNeighbor(state, r);
    default:
      return singleBitFlipNeighbor(state, r);
  }
}

// Temperature calculation
export function calculateTemperature(
  iteration: number,
  initialTemp: number,
  coolingRate: number,
  maxIterations: number,
  coolingSchedule: ToySimulationParams['coolingSchedule']
): number {
  switch (coolingSchedule) {
    case 'Geometric':
      return initialTemp * Math.pow(coolingRate, iteration);
    
    case 'Linear':
      const linearTemp = initialTemp - (initialTemp / maxIterations) * iteration;
      return Math.max(linearTemp, 0.001);
    
    case 'Logarithmic':
      const logTemp = initialTemp / (1 + Math.log(1 + iteration + 1));
      return Math.max(logTemp, 0.001);
    
    default:
      return initialTemp * Math.pow(coolingRate, iteration);
  }
}

// Acceptance probability calculation
export function calculateAcceptanceProbability(
  currentValue: number,
  neighborValue: number,
  temperature: number
): number {
  if (neighborValue >= currentValue) {
    return 1.0;
  }
  
  if (temperature <= 0) {
    return 0.0;
  }
  
  const delta = neighborValue - currentValue;
  return Math.exp(delta / temperature);
}

// Main simulation function
export function runToySimulation(params: ToySimulationParams): SimulatedAnnealingToyState {
  const { r, maxIterations, initialTemperature, coolingRate, neighborType, coolingSchedule, coefficients } = params;
  
  if (r <= 0) {
    return getInitialToyState();
  }
  
  // Initialize
  let currentState = Math.floor(Math.random() * Math.pow(2, r));
  let currentValue = evaluatePolynomial(currentState, coefficients);
  
  let bestState = currentState;
  let bestValue = currentValue;
  let acceptedWorse = 0;
  
  const history: IterationData[] = [];
  
  // Generate full search space if feasible (for visualization)
  const searchSpace: { state: number; value: number }[] = [];
  if (r <= 8) {
    for (let state = 0; state < Math.pow(2, r); state++) {
      searchSpace.push({
        state,
        value: evaluatePolynomial(state, coefficients)
      });
    }
  }
  
  // Initial entry
  const initialTemp = calculateTemperature(0, initialTemperature, coolingRate, maxIterations, coolingSchedule);
  history.push({
    iteration: 0,
    state: currentState,
    value: currentValue,
    bestValue: bestValue,
    temperature: initialTemp,
    acceptanceProbability: 1.0,
    binaryRepresentation: intToBinaryArray(currentState, r)
  });
  
  // Main simulation loop
  for (let iteration = 1; iteration <= maxIterations; iteration++) {
    const temperature = calculateTemperature(iteration, initialTemperature, coolingRate, maxIterations, coolingSchedule);
    
    // Generate neighbor
    const neighborState = generateNeighbor(currentState, r, neighborType);
    const neighborValue = evaluatePolynomial(neighborState, coefficients);
    
    // Calculate acceptance probability
    const acceptanceProbability = calculateAcceptanceProbability(currentValue, neighborValue, temperature);
    
    // Decide whether to accept the neighbor
    const shouldAccept = Math.random() < acceptanceProbability;
    
    if (shouldAccept) {
      currentState = neighborState;
      currentValue = neighborValue;
      
      if (acceptanceProbability < 1.0) {
        acceptedWorse++;
      }
    }
    
    // Update best solution
    if (currentValue > bestValue) {
      bestState = currentState;
      bestValue = currentValue;
    }
    
    // Record iteration data
    history.push({
      iteration,
      state: currentState,
      value: currentValue,
      bestValue: bestValue,
      temperature,
      acceptanceProbability,
      binaryRepresentation: intToBinaryArray(currentState, r)
    });
  }
  
  return {
    history,
    bestState,
    bestValue,
    acceptedWorse,
    currentIteration: maxIterations,
    searchSpace
  };
}

export function getInitialToyState(): SimulatedAnnealingToyState {
  return {
    history: [],
    bestState: 0,
    bestValue: 0,
    acceptedWorse: 0,
    currentIteration: 0,
    searchSpace: []
  };
}
