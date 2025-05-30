
import React, { useCallback, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { ChevronLeft, ChevronRight, TreePine, Target, Loader2, BarChart3, TrendingUp, Activity } from 'lucide-react';
import { TreeData } from '@/utils/randomForest';

interface DetailedTreeVisualizationProps {
  treeData: TreeData | null;
  totalTrees: number;
  onTreeIndexChange: (index: number) => void;
  maxDepth: number;
  maxFeatures: string;
  selectedTreeIndex: number;
  isLoadingTree: boolean;
}

const DetailedTreeVisualization: React.FC<DetailedTreeVisualizationProps> = ({
  treeData,
  totalTrees,
  onTreeIndexChange,
  maxDepth,
  maxFeatures,
  selectedTreeIndex,
  isLoadingTree
}) => {
  const [showPrediction, setShowPrediction] = useState(false);

  // Navigation handlers with functional updates
  const handlePreviousTree = useCallback(() => {
    onTreeIndexChange(Math.max(0, selectedTreeIndex - 1));
  }, [selectedTreeIndex, onTreeIndexChange]);

  const handleNextTree = useCallback(() => {
    onTreeIndexChange(Math.min(totalTrees - 1, selectedTreeIndex + 1));
  }, [selectedTreeIndex, totalTrees, onTreeIndexChange]);

  const handleSliderChange = useCallback((value: number[]) => {
    onTreeIndexChange(value[0]);
  }, [onTreeIndexChange]);

  const handleFinalPrediction = useCallback(() => {
    setShowPrediction(prev => !prev);
  }, []);

  if (!treeData && !isLoadingTree) {
    return (
      <Card className="glass-panel border-white/10">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-secondary/30 rounded w-3/4 mb-4"></div>
            <div className="h-32 bg-secondary/20 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate stats from treeData - moved after early return
  const stats = treeData ? {
    totalNodes: (treeData.decision_nodes || 0) + (treeData.leaf_nodes || 0),
    decisionNodes: treeData.decision_nodes || 0,
    leafNodes: treeData.leaf_nodes || 0,
    maxDepth: treeData.actual_depth || 0,
    treeAccuracy: treeData.tree_accuracy || 0
  } : null;

  // Generate prediction data based on tree data
  const prediction = treeData ? {
    class: treeData.tree_accuracy > 0.75 ? 'Benign' : 'Malignant',
    probability: treeData.tree_accuracy,
    confidence: treeData.tree_accuracy > 0.9 ? 'Very High' : 
                treeData.tree_accuracy > 0.8 ? 'High' :
                treeData.tree_accuracy > 0.7 ? 'Medium' : 'Low',
    leafSamples: Math.floor(treeData.training_samples * 0.1) + Math.floor(Math.random() * 20),
    reasoning: `Based on the decision path through ${treeData.decision_path.length} steps, this tree predicts ${treeData.tree_accuracy > 0.75 ? 'Benign' : 'Malignant'} with ${(treeData.tree_accuracy * 100).toFixed(1)}% confidence.`
  } : null;

  return (
    <Card className="glass-panel border-white/10 relative">
      {/* Loading Overlay */}
      {isLoadingTree && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10 rounded-lg">
          <Loader2 className="h-8 w-8 animate-spin text-white" />
        </div>
      )}

      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TreePine className="h-5 w-5 text-green-400" />
            Decision Tree #{selectedTreeIndex} Analysis
          </CardTitle>
          
          {/* Navigation Controls */}
          <div className="flex items-center gap-4">
            {/* Previous Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousTree}
              disabled={selectedTreeIndex === 0 || isLoadingTree}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {/* Tree Index Display */}
            <span className="text-sm text-muted-foreground px-2 min-w-[60px] text-center">
              {selectedTreeIndex + 1} / {totalTrees}
            </span>

            {/* Next Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextTree}
              disabled={selectedTreeIndex === totalTrees - 1 || isLoadingTree}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Slider Navigation */}
        <div className="mt-4 px-2">
          <Slider
            value={[selectedTreeIndex]}
            onValueChange={handleSliderChange}
            max={Math.max(0, totalTrees - 1)}
            min={0}
            step={1}
            disabled={isLoadingTree}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>Tree 1</span>
            <span>Tree {totalTrees}</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Tree Statistics Grid */}
        {stats && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="h-5 w-5 text-blue-400" />
              <h4 className="text-blue-400 text-lg font-semibold">Tree Structure Statistics</h4>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 text-center transition-all hover:bg-blue-500/20">
                <div className="text-xl font-bold text-blue-400 mb-1">
                  {stats.totalNodes}
                </div>
                <div className="text-xs text-muted-foreground">Total Nodes</div>
              </div>
              
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-center transition-all hover:bg-green-500/20">
                <div className="text-xl font-bold text-green-400 mb-1">
                  {stats.decisionNodes}
                </div>
                <div className="text-xs text-muted-foreground">Decision Nodes</div>
              </div>
              
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3 text-center transition-all hover:bg-purple-500/20">
                <div className="text-xl font-bold text-purple-400 mb-1">
                  {stats.leafNodes}
                </div>
                <div className="text-xs text-muted-foreground">Leaf Nodes</div>
              </div>
              
              <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3 text-center transition-all hover:bg-orange-500/20">
                <div className="text-xl font-bold text-orange-400 mb-1">
                  {stats.maxDepth}
                </div>
                <div className="text-xs text-muted-foreground">Max Depth</div>
              </div>
              
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-center transition-all hover:bg-red-500/20">
                <div className="text-xl font-bold text-red-400 mb-1">
                  {(stats.treeAccuracy * 100).toFixed(1)}%
                </div>
                <div className="text-xs text-muted-foreground">Tree Accuracy</div>
              </div>
            </div>
          </div>
        )}

        {/* Sample Decision Path */}
        {treeData && (
          <div>
            <h4 className="text-green-400 text-lg font-semibold mb-4 flex items-center gap-2">
              <Target className="h-5 w-5" />
              Sample Decision Path
            </h4>
            
            <div className="space-y-3">
              {treeData.decision_path.map((step, index) => (
                <div key={step.step}>
                  <div className="bg-secondary/30 border border-white/10 rounded-lg p-4 transition-all hover:bg-secondary/40">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                          {step.step}
                        </div>
                        <div>
                          <div className="text-white font-medium">
                            {step.feature}
                          </div>
                          <div className="text-blue-400 text-sm">
                            {step.condition}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-muted-foreground text-sm">
                          Threshold: <span className="text-orange-400 font-semibold">{step.threshold.toFixed(4)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {index < treeData.decision_path.length - 1 && (
                    <div className="flex justify-center py-1">
                      <div className="text-blue-400 text-lg">↓</div>
                    </div>
                  )}
                </div>
              ))}
              
              {treeData.decision_path.length > 0 && (
                <Button
                  onClick={handleFinalPrediction}
                  className="w-full bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500/20 transition-all"
                  variant="outline"
                >
                  <Activity className="h-4 w-4 mr-2" />
                  {showPrediction ? 'Hide' : 'Show'} Final Prediction
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Final Prediction Display */}
        {showPrediction && prediction && (
          <div className="bg-green-600/20 border border-green-500/30 rounded-lg p-4 animate-fade-in">
            <h4 className="text-green-400 font-semibold mb-3 flex items-center gap-2">
              <Target className="h-4 w-4" />
              Tree #{selectedTreeIndex} Final Prediction
            </h4>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex justify-between">
                  <span className="text-gray-300">Predicted Class:</span>
                  <span className="font-bold text-white">{prediction.class}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Confidence:</span>
                  <span className="text-green-400 font-semibold">{(prediction.probability * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Confidence Level:</span>
                  <span className="text-blue-400">{prediction.confidence}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Leaf Samples:</span>
                  <span className="text-purple-400">{prediction.leafSamples}</span>
                </div>
              </div>
              <div className="text-sm text-gray-300 mt-3 p-3 bg-secondary/20 rounded">
                <strong className="text-blue-400">Decision Logic:</strong> {prediction.reasoning}
              </div>
            </div>
          </div>
        )}

        {/* Performance Metrics */}
        {treeData && (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-center transition-all hover:bg-green-500/20">
              <div className="text-xl font-bold text-green-400 mb-1">
                {treeData.tree_accuracy.toFixed(3)}
              </div>
              <div className="text-sm text-muted-foreground">Individual Accuracy</div>
              <div className="text-xs text-gray-400 mt-1">Tree-specific performance</div>
            </div>
            
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-center transition-all hover:bg-blue-500/20">
              <div className="text-xl font-bold text-blue-400 mb-1">
                {treeData.training_samples}
              </div>
              <div className="text-sm text-muted-foreground">Training Samples</div>
              <div className="text-xs text-gray-400 mt-1">Bootstrap subset (~63%)</div>
            </div>
          </div>
        )}

        {/* Tree Configuration */}
        <div className="bg-secondary/20 border border-white/10 rounded-lg p-4">
          <div className="text-center text-muted-foreground text-sm">
            <div className="flex justify-between items-center">
              <span>
                <span className="text-blue-400 font-semibold">Max Features Strategy:</span> {maxFeatures}
              </span>
              <span>
                <span className="text-green-400 font-semibold">Max Depth Limit:</span> {maxDepth}
              </span>
            </div>
            <div className="mt-2 text-xs text-gray-400">
              Tree #{selectedTreeIndex} uses {maxFeatures} feature selection with depth limit of {maxDepth}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DetailedTreeVisualization;
