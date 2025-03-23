import { City, SimulationParams, SimulationState } from "./types";

// Haversine formula to calculate distance between two points on Earth
export function distance(city1: City, city2: City): number {
  // Convert normalized coordinates to lon/lat
  const lon1 = -180 + city1.x * 360;
  const lat1 = 90 - city1.y * 180;
  const lon2 = -180 + city2.x * 360;
  const lat2 = 90 - city2.y * 180;
  
  // Earth radius in kilometers
  const R = 6371;
  
  // Convert degrees to radians
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  // Haversine formula
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in kilometers
  
  return distance;
}

export function calculatePathDistance(cities: City[], path: number[]): number {
  if (cities.length < 2 || path.length === 0) return 0;
  
  // Add starting city
  let totalDist = distance(cities[0], cities[path[0]]);
  
  // Add intermediate cities
  for (let i = 0; i < path.length - 1; i++) {
    totalDist += distance(cities[path[i]], cities[path[i + 1]]);
  }
  
  // Return to start
  totalDist += distance(cities[path[path.length - 1]], cities[0]);
  
  return totalDist;
}

export function getInitialState(numCities: number = 0): SimulationState {
  return {
    cities: [],
    currentPath: [],
    bestPath: [],
    distances: [],
    currentDistance: 0,
    bestDistance: 0,
    temperature: 0,
    iteration: 0,
    totalIterations: 0,
    isRunning: false,
    animationSpeed: 1
  };
}

export function createRandomCities(count: number): City[] {
  const cities: City[] = [];
  
  for (let i = 0; i < count; i++) {
    // Generate cities biased towards India for a more realistic distribution
    // Approximate bounds for India
    const indiaLngMin = 68;
    const indiaLngMax = 97;
    const indiaLatMin = 8;
    const indiaLatMax = 37;
    
    // Generate random coordinates within India
    const lng = indiaLngMin + Math.random() * (indiaLngMax - indiaLngMin);
    const lat = indiaLatMin + Math.random() * (indiaLatMax - indiaLatMin);
    
    // Convert to normalized coordinates (0-1 range)
    const normalizedX = (lng + 180) / 360;
    const normalizedY = 1 - ((lat + 90) / 180);
    
    cities.push({
      id: i,
      x: normalizedX,
      y: normalizedY
    });
  }
  
  return cities;
}

export function simulationStep(
  state: SimulationState,
  params: SimulationParams
): SimulationState {
  const { cities, currentPath, bestPath, distances, temperature, iteration, totalIterations } = state;
  
  if (cities.length < 3 || iteration >= totalIterations) {
    return { ...state, isRunning: false };
  }
  
  const numCities = cities.length - 1; // Exclude starting city
  
  // Make a copy of the current path
  const newPath = [...currentPath];
  
  // Randomly select two cities to swap
  const i = Math.floor(Math.random() * numCities);
  const j = Math.floor(Math.random() * numCities);
  
  // Skip if same index
  if (i !== j) {
    // Swap the cities
    [newPath[i], newPath[j]] = [newPath[j], newPath[i]];
    
    const currentDistance = calculatePathDistance(cities, currentPath);
    const newDistance = calculatePathDistance(cities, newPath);
    
    // Accept the new solution if it's better
    // Or accept with a probability based on temperature
    const acceptNewSolution = 
      newDistance < currentDistance || 
      Math.random() < Math.exp((currentDistance - newDistance) / temperature);
    
    if (acceptNewSolution) {
      // Update best path if this is better
      let newBestPath = bestPath;
      let newBestDistance = state.bestDistance;
      
      if (bestPath.length === 0 || newDistance < state.bestDistance) {
        newBestPath = [...newPath];
        newBestDistance = newDistance;
      }
      
      const newDistances = [...distances, newDistance];
      const newTemperature = temperature * params.coolingRate;
      
      return {
        ...state,
        currentPath: newPath,
        bestPath: newBestPath,
        distances: newDistances,
        currentDistance: newDistance,
        bestDistance: newBestDistance,
        temperature: newTemperature,
        iteration: iteration + 1
      };
    }
  }
  
  // If we don't accept the new solution, still increase iteration and log distance
  const currentDistance = calculatePathDistance(cities, currentPath);
  const newDistances = [...distances, currentDistance];
  const newTemperature = temperature * params.coolingRate;
  
  return {
    ...state,
    distances: newDistances,
    temperature: newTemperature,
    iteration: iteration + 1
  };
}

export function initializeSimulation(
  cities: City[],
  params: SimulationParams
): SimulationState {
  if (cities.length < 3) {
    return getInitialState();
  }
  
  // Create initial random path (excluding starting city)
  const pathIndices = Array.from({ length: cities.length - 1 }, (_, i) => i + 1);
  shuffleArray(pathIndices);
  
  const initialDistance = calculatePathDistance(cities, pathIndices);
  
  return {
    cities: [...cities],
    currentPath: [...pathIndices],
    bestPath: [...pathIndices],
    distances: [initialDistance],
    currentDistance: initialDistance,
    bestDistance: initialDistance,
    temperature: params.initialTemperature,
    iteration: 0,
    totalIterations: params.totalIterations,
    isRunning: true,
    animationSpeed: 1
  };
}

function shuffleArray(array: any[]): void {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
