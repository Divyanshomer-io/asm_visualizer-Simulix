
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Play, Square, RotateCcw, Settings } from "lucide-react";
import { EMClusteringParams } from "@/utils/emClustering";

interface EMClusteringControlsProps {
  params: EMClusteringParams;
  onParamsChange: (params: EMClusteringParams) => void;
  onUpdate: () => void;
  onReset: () => void;
  onStartEM: () => void;
  onStopEM: () => void;
  isRunning: boolean;
}

const EMClusteringControls: React.FC<EMClusteringControlsProps> = ({
  params,
  onParamsChange,
  onUpdate,
  onReset,
  onStartEM,
  onStopEM,
  isRunning
}) => {
  const handleSamplesChange = (value: number[]) => {
    onParamsChange({ ...params, samplesPerCluster: value[0] });
  };

  const handleClustersChange = (value: number[]) => {
    onParamsChange({ ...params, nClusters: value[0] });
  };

  const handleIterationsChange = (value: number[]) => {
    onParamsChange({ ...params, maxIterations: value[0] });
  };

  return (
    <Card className="glass-panel border-white/10 h-fit">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Settings className="h-5 w-5" />
          EM Algorithm Controls
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Control Buttons */}
        <div className="space-y-3">
          <Button
            onClick={isRunning ? onStopEM : onStartEM}
            className={`w-full ${isRunning ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
            disabled={false}
          >
            {isRunning ? (
              <>
                <Square className="h-4 w-4 mr-2" />
                Stop EM
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Start EM
              </>
            )}
          </Button>

          <Button
            onClick={onReset}
            variant="destructive"
            className="w-full bg-red-500 hover:bg-red-600"
            disabled={isRunning}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>

        <Separator className="bg-white/10" />

        {/* Parameter Controls */}
        <div className="space-y-6">
          {/* Samples per Cluster */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-white">
                Samples/Cluster
              </label>
              <span className="text-sm text-accent font-mono">
                {params.samplesPerCluster}
              </span>
            </div>
            <Slider
              value={[params.samplesPerCluster]}
              onValueChange={handleSamplesChange}
              min={50}
              max={300}
              step={25}
              disabled={isRunning}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>50</span>
              <span>300</span>
            </div>
          </div>

          {/* Number of Clusters */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-white">
                Clusters
              </label>
              <span className="text-sm text-accent font-mono">
                {params.nClusters}
              </span>
            </div>
            <Slider
              value={[params.nClusters]}
              onValueChange={handleClustersChange}
              min={2}
              max={5}
              step={1}
              disabled={isRunning}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>2</span>
              <span>5</span>
            </div>
          </div>

          {/* Max Iterations */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-white">
                Max Iterations
              </label>
              <span className="text-sm text-accent font-mono">
                {params.maxIterations}
              </span>
            </div>
            <Slider
              value={[params.maxIterations]}
              onValueChange={handleIterationsChange}
              min={10}
              max={100}
              step={5}
              disabled={isRunning}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>10</span>
              <span>100</span>
            </div>
          </div>
        </div>

        <Separator className="bg-white/10" />

        {/* Status Information */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-white">Algorithm Status</h4>
          <div className="text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-muted-foreground">State:</span>
              <span className={isRunning ? "text-green-400" : "text-gray-400"}>
                {isRunning ? "Running" : "Stopped"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Convergence:</span>
              <span className="text-accent font-mono">{params.convergenceThreshold.toExponential(0)}</span>
            </div>
          </div>
        </div>

        {/* Update Button */}
        <Button
          onClick={onUpdate}
          variant="outline"
          className="w-full border-accent/50 hover:bg-accent/10"
          disabled={isRunning}
        >
          Update Visualization
        </Button>
      </CardContent>
    </Card>
  );
};

export default EMClusteringControls;
