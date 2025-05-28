
import React, { useEffect, useRef, useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { EMClusteringParams, generateClusterData, initializeEMParameters, performEMStep, generateContourData, ClusterState, DataPoint } from "@/utils/emClustering";

interface EMClusteringVisualizationProps {
  params: EMClusteringParams;
  isRunning: boolean;
  onConvergence: () => void;
  onMaxIterations: () => void;
}

const EMClusteringVisualization: React.FC<EMClusteringVisualizationProps> = ({
  params,
  isRunning,
  onConvergence,
  onMaxIterations
}) => {
  const canvas3DRef = useRef<HTMLCanvasElement>(null);
  const canvas2DRef = useRef<HTMLCanvasElement>(null);
  const [data, setData] = useState<DataPoint[]>([]);
  const [clusters, setClusters] = useState<ClusterState[]>([]);
  const [iteration, setIteration] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffa500', '#800080'];
  const surfaceColors = ['viridis', 'plasma', 'coolwarm', 'spring', 'winter'];

  // Initialize data and clusters
  useEffect(() => {
    const newData = generateClusterData(params);
    const newClusters = initializeEMParameters(newData, params.nClusters);
    setData(newData);
    setClusters(newClusters);
    setIteration(0);
  }, [params.samplesPerCluster, params.nClusters]);

  // Draw 3D visualization
  const draw3D = useCallback((ctx: CanvasRenderingContext2D, data: DataPoint[], clusters: ClusterState[], title: string) => {
    const canvas = ctx.canvas;
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, width, height);

    // Draw title
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(title, width / 2, 30);

    // Simple 3D projection for data points
    const scale = Math.min(width, height) * 0.3;
    const centerX = width / 2;
    const centerY = height / 2 + 20;

    // Find data bounds
    const xMin = Math.min(...data.map(p => p.x));
    const xMax = Math.max(...data.map(p => p.x));
    const yMin = Math.min(...data.map(p => p.y));
    const yMax = Math.max(...data.map(p => p.y));
    const xRange = xMax - xMin;
    const yRange = yMax - yMin;

    // Draw data points at z=0 level
    data.forEach(point => {
      const projX = centerX + ((point.x - xMin) / xRange - 0.5) * scale;
      const projY = centerY + ((point.y - yMin) / yRange - 0.5) * scale;

      ctx.fillStyle = colors[point.cluster % colors.length];
      ctx.globalAlpha = 0.8;
      ctx.beginPath();
      ctx.arc(projX, projY, 3, 0, 2 * Math.PI);
      ctx.fill();
    });

    // Draw simplified Gaussian surfaces as ellipses
    ctx.globalAlpha = 0.6;
    clusters.forEach((cluster, i) => {
      const projX = centerX + ((cluster.mean[0] - xMin) / xRange - 0.5) * scale;
      const projY = centerY + ((cluster.mean[1] - yMin) / yRange - 0.5) * scale;

      // Draw ellipse representing covariance
      const a = Math.sqrt(cluster.covariance[0][0]) * scale * 0.5;
      const b = Math.sqrt(cluster.covariance[1][1]) * scale * 0.5;

      ctx.strokeStyle = colors[i % colors.length];
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(projX, projY, a, b, 0, 0, 2 * Math.PI);
      ctx.stroke();

      // Draw cluster center
      ctx.fillStyle = colors[i % colors.length];
      ctx.globalAlpha = 1;
      ctx.beginPath();
      ctx.arc(projX, projY, 6, 0, 2 * Math.PI);
      ctx.fill();
    });

    // Draw axes labels
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Feature 1', 10, height - 40);
    ctx.fillText('Feature 2', 10, height - 25);
    ctx.fillText('Density', 10, height - 10);
  }, [colors]);

  // Draw 2D visualization
  const draw2D = useCallback((ctx: CanvasRenderingContext2D, data: DataPoint[], clusters: ClusterState[], title: string) => {
    const canvas = ctx.canvas;
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, width, height);

    // Draw title
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(title, width / 2, 30);

    const scale = Math.min(width, height) * 0.35;
    const centerX = width / 2;
    const centerY = height / 2 + 20;

    // Find data bounds
    const xMin = Math.min(...data.map(p => p.x));
    const xMax = Math.max(...data.map(p => p.x));
    const yMin = Math.min(...data.map(p => p.y));
    const yMax = Math.max(...data.map(p => p.y));
    const xRange = xMax - xMin;
    const yRange = yMax - yMin;

    // Draw grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 10; i++) {
      const x = centerX - scale/2 + (i/10) * scale;
      const y = centerY - scale/2 + (i/10) * scale;
      
      ctx.beginPath();
      ctx.moveTo(x, centerY - scale/2);
      ctx.lineTo(x, centerY + scale/2);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(centerX - scale/2, y);
      ctx.lineTo(centerX + scale/2, y);
      ctx.stroke();
    }

    // Draw data points
    data.forEach(point => {
      const projX = centerX + ((point.x - xMin) / xRange - 0.5) * scale;
      const projY = centerY + ((point.y - yMin) / yRange - 0.5) * scale;

      ctx.fillStyle = colors[point.cluster % colors.length];
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 0.5;
      ctx.globalAlpha = 0.7;
      ctx.beginPath();
      ctx.arc(projX, projY, 4, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
    });

    // Draw contours and cluster centers
    clusters.forEach((cluster, i) => {
      const projX = centerX + ((cluster.mean[0] - xMin) / xRange - 0.5) * scale;
      const projY = centerY + ((cluster.mean[1] - yMin) / yRange - 0.5) * scale;

      // Draw simplified contours as ellipses
      ctx.globalAlpha = 0.8;
      ctx.strokeStyle = colors[i % colors.length];
      ctx.lineWidth = 2;
      
      for (let level = 1; level <= 3; level++) {
        const a = Math.sqrt(cluster.covariance[0][0]) * scale * 0.3 * level;
        const b = Math.sqrt(cluster.covariance[1][1]) * scale * 0.3 * level;
        
        ctx.beginPath();
        ctx.ellipse(projX, projY, a, b, 0, 0, 2 * Math.PI);
        ctx.stroke();
      }

      // Draw cluster center as X
      ctx.globalAlpha = 1;
      ctx.strokeStyle = colors[i % colors.length];
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(projX - 8, projY - 8);
      ctx.lineTo(projX + 8, projY + 8);
      ctx.moveTo(projX + 8, projY - 8);
      ctx.lineTo(projX - 8, projY + 8);
      ctx.stroke();
    });

    // Draw axes labels
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Feature 1', width / 2, height - 10);
    ctx.textAlign = 'left';
    ctx.save();
    ctx.translate(20, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Feature 2', 0, 0);
    ctx.restore();
  }, [colors]);

  // Update visualizations
  useEffect(() => {
    if (data.length === 0 || clusters.length === 0) return;

    const canvas3D = canvas3DRef.current;
    const canvas2D = canvas2DRef.current;
    
    if (!canvas3D || !canvas2D) return;

    const ctx3D = canvas3D.getContext('2d');
    const ctx2D = canvas2D.getContext('2d');
    
    if (!ctx3D || !ctx2D) return;

    const title3D = iteration === 0 ? '3D Gaussian Distributions (Initial)' : `3D Gaussian Distributions (Iteration ${iteration})`;
    const title2D = iteration === 0 ? '2D Clustering Evolution (Initial)' : `2D Clustering Evolution (Iteration ${iteration})`;

    draw3D(ctx3D, data, clusters, title3D);
    draw2D(ctx2D, data, clusters, title2D);
  }, [data, clusters, iteration, draw3D, draw2D]);

  // EM algorithm runner
  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    setIteration(0);
    let currentClusters = [...clusters];
    let currentIteration = 0;

    intervalRef.current = setInterval(() => {
      if (currentIteration >= params.maxIterations) {
        console.log(`Reached maximum iterations (${params.maxIterations})`);
        onMaxIterations();
        return;
      }

      const { newClusters, responsibilities, meanShift } = performEMStep(data, currentClusters);
      currentClusters = newClusters;
      currentIteration++;

      setClusters(currentClusters);
      setIteration(currentIteration);

      if (meanShift < params.convergenceThreshold) {
        console.log(`🎉 SUCCESS! Converged at iteration ${currentIteration}`);
        console.log(`Maximum mean shift: ${meanShift.toExponential(2)}`);
        onConvergence();
        return;
      }
    }, 300); // 300ms interval as specified

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, data, clusters, params.maxIterations, params.convergenceThreshold, onConvergence, onMaxIterations]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 3D Visualization */}
      <Card className="glass-panel border-white/10 p-4">
        <canvas
          ref={canvas3DRef}
          width={600}
          height={400}
          className="w-full h-auto max-w-full border border-white/20 rounded"
          style={{ background: '#0a0a0a' }}
        />
      </Card>

      {/* 2D Visualization */}
      <Card className="glass-panel border-white/10 p-4">
        <canvas
          ref={canvas2DRef}
          width={600}
          height={400}
          className="w-full h-auto max-w-full border border-white/20 rounded"
          style={{ background: '#0a0a0a' }}
        />
      </Card>
    </div>
  );
};

export default EMClusteringVisualization;
