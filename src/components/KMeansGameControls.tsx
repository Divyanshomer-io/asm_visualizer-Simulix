import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Play, Pause, RotateCcw, Shuffle, Zap, Settings } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface KMeansGameControlsProps {
  cities: {x: number, y: number, name: string, population: number}[];
  setCities: React.Dispatch<React.SetStateAction<{x: number, y: number, name: string, population: number}[]>>;
  k: number;
  setK: React.Dispatch<React.SetStateAction<number>>;
  clusters: {center: {x: number, y: number}, cities: number[], color: string}[];
  setClusters: React.Dispatch<React.SetStateAction<{center: {x: number, y: number}, cities: number[], color: string}[]>>;
  isRunning: boolean;
  setIsRunning: React.Dispatch<React.SetStateAction<boolean>>;
  iteration: number;
  setIteration: React.Dispatch<React.SetStateAction<number>>;
  convergenceData: {iteration: number, wcss: number}[];
  setConvergenceData: React.Dispatch<React.SetStateAction<{iteration: number, wcss: number}[]>>;
  showCentroids: boolean;
  setShowCentroids: React.Dispatch<React.SetStateAction<boolean>>;
  showConnections: boolean;
  setShowConnections: React.Dispatch<React.SetStateAction<boolean>>;
  animationSpeed: number;
  setAnimationSpeed: React.Dispatch<React.SetStateAction<number>>;
  maxIterations: number;
  setMaxIterations: React.Dispatch<React.SetStateAction<number>>;
  gameScore: number;
  setGameScore: React.Dispatch<React.SetStateAction<number>>;
  gameLevel: number;
  setGameLevel: React.Dispatch<React.SetStateAction<number>>;
}

const KMeansGameControls: React.FC<KMeansGameControlsProps> = ({
  cities,
  setCities,
  k,
  setK,
  clusters,
  setClusters,
  isRunning,
  setIsRunning,
  iteration,
  setIteration,
  convergenceData,
  setConvergenceData,
  showCentroids,
  setShowCentroids,
  showConnections,
  setShowConnections,
  animationSpeed,
  setAnimationSpeed,
  maxIterations,
  setMaxIterations,
  gameScore,
  setGameScore,
  gameLevel,
  setGameLevel,
}) => {
  const [cityCount, setCityCount] = useState(20);
  const [cityCountError, setCityCountError] = useState("");

  const validateCityCount = (value: string) => {
    const num = parseInt(value);
    if (isNaN(num)) {
      setCityCountError("Please enter a valid number");
      return false;
    }
    if (num < 10) {
      setCityCountError("Minimum 10 cities required");
      return false;
    }
    if (num > 70) {
      setCityCountError("Maximum 70 cities allowed");
      return false;
    }
    setCityCountError("");
    return true;
  };

  const handleCityCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Allow empty input for user to type freely
    if (value === "") {
      setCityCount(0);
      setCityCountError("");
      return;
    }
    
    const num = parseInt(value);
    setCityCount(num);
    validateCityCount(value);
  };

  const generateRandomCities = () => {
    // Use the current cityCount value, but validate it first
    const finalCityCount = cityCount || 20; // Default to 20 if empty
    
    if (!validateCityCount(finalCityCount.toString())) {
      return; // Don't generate if invalid
    }

    const cityNames = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Echo', 'Foxtrot', 'Golf', 'Hotel', 'India', 'Juliet'];
    const newCities = [];
    
    for (let i = 0; i < finalCityCount; i++) {
      newCities.push({
        x: Math.random() * 760 + 20, // Keep within canvas bounds
        y: Math.random() * 360 + 20,
        name: cityNames[i % cityNames.length] + (Math.floor(i / cityNames.length) + 1),
        population: Math.floor(Math.random() * 90000) + 10000
      });
    }
    
    setCities(newCities);
    resetClustering();
  };

  const resetClustering = () => {
    setClusters([]);
    setIteration(0);
    setConvergenceData([]);
    setIsRunning(false);
  };

  const clearCities = () => {
    setCities([]);
    resetClustering();
  };

  const startClustering = () => {
    if (cities.length < k) {
      return; // Need at least k cities
    }
    setIsRunning(true);
    runKMeansStep();
  };

  const runKMeansStep = () => {
    if (cities.length < k) return;

    // Initialize clusters if needed
    if (clusters.length === 0) {
      const colors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
      const initialClusters = [];
      
      for (let i = 0; i < k; i++) {
        initialClusters.push({
          center: {
            x: Math.random() * 760 + 20,
            y: Math.random() * 360 + 20
          },
          cities: [],
          color: colors[i % colors.length]
        });
      }
      
      setClusters(initialClusters);
      return;
    }

    // Assign cities to closest centroids
    const newClusters = clusters.map(cluster => ({
      ...cluster,
      cities: []
    }));

    cities.forEach((city, cityIndex) => {
      let closestCluster = 0;
      let minDistance = Infinity;
      
      clusters.forEach((cluster, clusterIndex) => {
        const distance = Math.sqrt(
          Math.pow(city.x - cluster.center.x, 2) + 
          Math.pow(city.y - cluster.center.y, 2)
        );
        
        if (distance < minDistance) {
          minDistance = distance;
          closestCluster = clusterIndex;
        }
      });
      
      newClusters[closestCluster].cities.push(cityIndex);
    });

    // Update centroids
    newClusters.forEach(cluster => {
      if (cluster.cities.length > 0) {
        const sumX = cluster.cities.reduce((sum, cityIndex) => sum + cities[cityIndex].x, 0);
        const sumY = cluster.cities.reduce((sum, cityIndex) => sum + cities[cityIndex].y, 0);
        
        cluster.center.x = sumX / cluster.cities.length;
        cluster.center.y = sumY / cluster.cities.length;
      }
    });

    // Calculate WCSS (Within-Cluster Sum of Squares)
    let wcss = 0;
    newClusters.forEach(cluster => {
      cluster.cities.forEach(cityIndex => {
        const city = cities[cityIndex];
        wcss += Math.pow(city.x - cluster.center.x, 2) + Math.pow(city.y - cluster.center.y, 2);
      });
    });

    setClusters(newClusters);
    setIteration(prev => prev + 1);
    setConvergenceData(prev => [...prev, { iteration: iteration + 1, wcss }]);

    // Update game score
    const efficiency = Math.max(0, 100 - wcss / 1000);
    setGameScore(prev => prev + Math.floor(efficiency));

    // Check for level up
    if (iteration > 0 && wcss < 50000 && gameScore > gameLevel * 1000) {
      setGameLevel(prev => prev + 1);
    }
  };

  return (
    <div className="space-y-6">
      {/* City Count Input */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Number of Cities</Label>
          <span className="text-xs text-muted-foreground">10-70</span>
        </div>
        <Input
          type="number"
          value={cityCount || ""}
          onChange={handleCityCountChange}
          placeholder="20"
          min={10}
          max={70}
          className={`w-full ${cityCountError ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
          disabled={isRunning}
        />
        {cityCountError && (
          <p className="text-xs text-red-500 mt-1">{cityCountError}</p>
        )}
      </div>

      <Separator />

      {/* Game Actions */}
      <div className="space-y-4">
        <div className="flex gap-2">
          <Button
            onClick={isRunning ? () => setIsRunning(false) : startClustering}
            disabled={cities.length < k}
            className="flex-1"
            variant={isRunning ? "destructive" : "default"}
          >
            {isRunning ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
            {isRunning ? 'Pause' : 'Start'}
          </Button>
          
          <Button
            onClick={resetClustering}
            variant="outline"
            size="icon"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={generateRandomCities}
            variant="outline"
            className="flex-1"
            disabled={!!cityCountError && cityCount !== 0}
          >
            <Shuffle className="h-4 w-4 mr-2" />
            New Level
          </Button>
          
          <Button
            onClick={clearCities}
            variant="outline"
            className="flex-1"
          >
            Clear All
          </Button>
        </div>
      </div>

      <Separator />

      {/* K Value */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Number of Clusters (K)</Label>
          <span className="text-sm font-mono bg-secondary px-2 py-1 rounded">{k}</span>
        </div>
        <Slider
          value={[k]}
          onValueChange={(value) => {
            setK(value[0]);
            resetClustering();
          }}
          min={2}
          max={6}
          step={1}
          className="w-full"
          disabled={isRunning}
        />
      </div>

      <Separator />

      {/* Animation Settings */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Settings className="h-4 w-4 text-muted-foreground" />
          <Label className="text-sm font-medium">Animation Settings</Label>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm">Speed (ms)</Label>
            <span className="text-sm font-mono bg-secondary px-2 py-1 rounded">{animationSpeed}</span>
          </div>
          <Slider
            value={[animationSpeed]}
            onValueChange={(value) => setAnimationSpeed(value[0])}
            min={100}
            max={2000}
            step={100}
            className="w-full"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm">Max Iterations</Label>
            <span className="text-sm font-mono bg-secondary px-2 py-1 rounded">{maxIterations}</span>
          </div>
          <Slider
            value={[maxIterations]}
            onValueChange={(value) => setMaxIterations(value[0])}
            min={5}
            max={50}
            step={5}
            className="w-full"
          />
        </div>
      </div>

      <Separator />

      {/* Display Options */}
      <div className="space-y-4">
        <Label className="text-sm font-medium">Display Options</Label>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm">Show Centroids</Label>
            <Switch
              checked={showCentroids}
              onCheckedChange={setShowCentroids}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label className="text-sm">Show Connections</Label>
            <Switch
              checked={showConnections}
              onCheckedChange={setShowConnections}
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Game Stats */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Game Progress</Label>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-accent/10 p-3 rounded-lg">
            <div className="text-lg font-bold text-accent">{gameScore}</div>
            <div className="text-xs text-muted-foreground">Total Score</div>
          </div>
          <div className="bg-blue-500/10 p-3 rounded-lg">
            <div className="text-lg font-bold text-blue-400">{iteration}</div>
            <div className="text-xs text-muted-foreground">Iterations</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KMeansGameControls;
