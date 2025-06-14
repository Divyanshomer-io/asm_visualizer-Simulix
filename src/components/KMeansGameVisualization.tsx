
import React, { useEffect, useRef } from "react";

interface KMeansGameVisualizationProps {
  cities: {x: number, y: number, name: string, population: number}[];
  setCities: React.Dispatch<React.SetStateAction<{x: number, y: number, name: string, population: number}[]>>;
  clusters: {center: {x: number, y: number}, cities: number[], color: string}[];
  setClusters: React.Dispatch<React.SetStateAction<{center: {x: number, y: number}, cities: number[], color: string}[]>>;
  k: number;
  isRunning: boolean;
  iteration: number;
  setIteration: React.Dispatch<React.SetStateAction<number>>;
  convergenceData: {iteration: number, wcss: number}[];
  setConvergenceData: React.Dispatch<React.SetStateAction<{iteration: number, wcss: number}[]>>;
  showCentroids: boolean;
  showConnections: boolean;
  animationSpeed: number;
  maxIterations: number;
  gameScore: number;
  setGameScore: React.Dispatch<React.SetStateAction<number>>;
  gameLevel: number;
  setGameLevel: React.Dispatch<React.SetStateAction<number>>;
}

const KMeansGameVisualization: React.FC<KMeansGameVisualizationProps> = ({
  cities,
  setCities,
  clusters,
  setClusters,
  k,
  isRunning,
  iteration,
  setIteration,
  convergenceData,
  setConvergenceData,
  showCentroids,
  showConnections,
  animationSpeed,
  maxIterations,
  gameScore,
  setGameScore,
  gameLevel,
  setGameLevel,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    draw();
  }, [cities, clusters, showCentroids, showConnections]);

  useEffect(() => {
    if (isRunning && iteration < maxIterations) {
      const timer = setTimeout(() => {
        runKMeansStep();
      }, animationSpeed);
      
      return () => clearTimeout(timer);
    }
  }, [isRunning, iteration, clusters, animationSpeed, maxIterations]);

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

    // Store previous centroids for convergence check
    const prevCentroids = clusters.map(cluster => ({ ...cluster.center }));

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

    // Calculate WCSS
    let wcss = 0;
    newClusters.forEach(cluster => {
      cluster.cities.forEach(cityIndex => {
        const city = cities[cityIndex];
        wcss += Math.pow(city.x - cluster.center.x, 2) + Math.pow(city.y - cluster.center.y, 2);
      });
    });

    // Check for convergence
    const converged = prevCentroids.every((prev, index) => {
      const curr = newClusters[index].center;
      const distance = Math.sqrt(Math.pow(prev.x - curr.x, 2) + Math.pow(prev.y - curr.y, 2));
      return distance < 1; // Convergence threshold
    });

    setClusters(newClusters);
    setIteration(prev => prev + 1);
    setConvergenceData(prev => [...prev, { iteration: iteration + 1, wcss }]);

    // Update game score
    const efficiency = Math.max(0, 100 - wcss / 1000);
    setGameScore(prev => prev + Math.floor(efficiency * gameLevel));

    // Check for level up
    if (converged && gameScore > gameLevel * 1000) {
      setGameLevel(prev => prev + 1);
    }

    // Stop if converged or max iterations reached
    if (converged || iteration >= maxIterations - 1) {
      // Bonus points for early convergence
      if (converged && iteration < maxIterations - 1) {
        setGameScore(prev => prev + (maxIterations - iteration) * 50);
      }
    }
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (isRunning) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const cityNames = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Echo', 'Foxtrot', 'Golf', 'Hotel', 'India', 'Juliet', 'Kilo', 'Lima', 'Mike', 'November', 'Oscar'];
    const newCity = {
      x,
      y,
      name: cityNames[cities.length % cityNames.length] + (Math.floor(cities.length / cityNames.length) + 1),
      population: Math.floor(Math.random() * 90000) + 10000
    };

    setCities(prev => [...prev, newCity]);
    
    // Reset clustering when adding new cities
    setClusters([]);
    setIteration(0);
    setConvergenceData([]);
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= canvas.width; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }
    for (let i = 0; i <= canvas.height; i += 40) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }

    // Draw connections between cities and centroids
    if (showConnections && clusters.length > 0) {
      clusters.forEach(cluster => {
        ctx.strokeStyle = cluster.color + '40';
        ctx.lineWidth = 1;
        cluster.cities.forEach(cityIndex => {
          const city = cities[cityIndex];
          ctx.beginPath();
          ctx.moveTo(city.x, city.y);
          ctx.lineTo(cluster.center.x, cluster.center.y);
          ctx.stroke();
        });
      });
    }

    // Draw cluster areas (Voronoi regions)
    if (clusters.length > 0) {
      clusters.forEach(cluster => {
        cluster.cities.forEach(cityIndex => {
          const city = cities[cityIndex];
          
          // Draw city with cluster color
          ctx.fillStyle = cluster.color + '60';
          ctx.beginPath();
          ctx.arc(city.x, city.y, Math.sqrt(city.population) / 100 + 8, 0, 2 * Math.PI);
          ctx.fill();
          
          // City border
          ctx.strokeStyle = cluster.color;
          ctx.lineWidth = 2;
          ctx.stroke();
        });
      });
    } else {
      // Draw cities without clustering
      cities.forEach(city => {
        ctx.fillStyle = 'rgba(56, 189, 248, 0.6)';
        ctx.beginPath();
        ctx.arc(city.x, city.y, Math.sqrt(city.population) / 100 + 8, 0, 2 * Math.PI);
        ctx.fill();
        
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.stroke();
      });
    }

    // Draw city labels
    ctx.fillStyle = 'white';
    ctx.font = '12px monospace';
    ctx.textAlign = 'center';
    cities.forEach(city => {
      ctx.fillText(city.name, city.x, city.y - 15);
      ctx.fillText(Math.floor(city.population / 1000) + 'K', city.x, city.y + 20);
    });

    // Draw centroids
    if (showCentroids && clusters.length > 0) {
      clusters.forEach((cluster, index) => {
        // Centroid shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.arc(cluster.center.x + 2, cluster.center.y + 2, 12, 0, 2 * Math.PI);
        ctx.fill();
        
        // Centroid
        ctx.fillStyle = cluster.color;
        ctx.beginPath();
        ctx.arc(cluster.center.x, cluster.center.y, 12, 0, 2 * Math.PI);
        ctx.fill();
        
        // Centroid border
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // Centroid label
        ctx.fillStyle = 'white';
        ctx.font = 'bold 14px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`C${index + 1}`, cluster.center.x, cluster.center.y + 4);
      });
    }

    // Draw instructions when no cities
    if (cities.length === 0) {
      ctx.fillStyle = 'rgba(148, 163, 184, 0.7)';
      ctx.font = '20px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('Click anywhere to place cities!', canvas.width / 2, canvas.height / 2);
      ctx.font = '14px monospace';
      ctx.fillText('Build your city network and watch K-means clustering group them', canvas.width / 2, canvas.height / 2 + 30);
    }

    // Draw game level indicator
    if (gameLevel > 1) {
      ctx.fillStyle = 'rgba(139, 92, 246, 0.9)';
      ctx.fillRect(canvas.width - 120, 10, 100, 30);
      ctx.fillStyle = 'white';
      ctx.font = 'bold 14px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`Level ${gameLevel}`, canvas.width - 70, 30);
    }
  };

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={800}
        height={400}
        className="border border-white/10 rounded-lg cursor-crosshair bg-gradient-to-br from-slate-900 to-slate-800"
        onClick={handleCanvasClick}
        style={{ maxWidth: '100%', height: 'auto' }}
      />
      
      {/* Iteration Counter */}
      {iteration > 0 && (
        <div className="absolute top-4 left-4 glass-panel px-3 py-2 rounded-lg">
          <div className="text-sm font-medium text-accent">
            Iteration: {iteration} / {maxIterations}
          </div>
        </div>
      )}
      
      {/* Convergence Indicator */}
      {convergenceData.length > 1 && (
        <div className="absolute top-4 right-4 glass-panel px-3 py-2 rounded-lg">
          <div className="text-sm font-medium text-green-400">
            WCSS: {Math.round(convergenceData[convergenceData.length - 1]?.wcss || 0)}
          </div>
        </div>
      )}
    </div>
  );
};

export default KMeansGameVisualization;
