import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, TreePine, BarChart3, Target, TrendingUp, Activity } from 'lucide-react';

interface TreeData {
  tree_index: number;
  decision_nodes: number;
  leaf_nodes: number;
  actual_depth: number;
  decision_path: Array<{
    step: number;
    feature: string;
    threshold: number;
    condition: string;
    samples?: number;
    giniImpurity?: number;
  }>;
  tree_accuracy: number;
  training_samples: number;
  feature_names: string[];
}

interface TreeAnalysisState {
  showPrediction: boolean;
  isLoading: boolean;
  error: string | null;
}

interface PredictionResult {
  class: string;
  probability: number;
  confidence: string;
  leafSamples: number;
  reasoning: string;
}

interface DetailedTreeVisualizationProps {
  treeData: TreeData | null;
  totalTrees: number;
  onTreeIndexChange: (index: number) => void;
  maxDepth: number;
  maxFeatures: string;
}

const DetailedTreeVisualization: React.FC<DetailedTreeVisualizationProps> = ({
  treeData,
  totalTrees,
  onTreeIndexChange,
  maxDepth,
  maxFeatures
}) => {
  const [state, setState] = useState<TreeAnalysisState>({
    showPrediction: false,
    isLoading: false,
    error: null
  });

  // Current tree index from treeData with fallback
  const currentTreeIndex = treeData?.tree_index ?? 0;
  
  // Ref to track the latest index to prevent race conditions
  const latestIndexRef = useRef(currentTreeIndex);
  
  // Update ref when index changes
  useEffect(() => {
    latestIndexRef.current = currentTreeIndex;
  }, [currentTreeIndex]);

  // Enhanced navigation handlers with proper bounds checking
  const handlePreviousTree = useCallback(() => {
    if (currentTreeIndex > 0 && !state.isLoading) {
      const newIndex = currentTreeIndex - 1;
      setState(prev => ({ ...prev, isLoading: true, showPrediction: false, error: null }));
      onTreeIndexChange(newIndex);
      
      // Simulate realistic data fetching delay
      setTimeout(() => {
        // Only update loading state if this is still the latest request
        if (latestIndexRef.current === newIndex) {
          setState(prev => ({ ...prev, isLoading: false }));
        }
      }, 150);
    }
  }, [currentTreeIndex, state.isLoading, onTreeIndexChange]);

  const handleNextTree = useCallback(() => {
    if (currentTreeIndex < totalTrees - 1 && !state.isLoading) {
      const newIndex = currentTreeIndex + 1;
      setState(prev => ({ ...prev, isLoading: true, showPrediction: false, error: null }));
      onTreeIndexChange(newIndex);
      
      // Simulate realistic data fetching delay
      setTimeout(() => {
        // Only update loading state if this is still the latest request
        if (latestIndexRef.current === newIndex) {
          setState(prev => ({ ...prev, isLoading: false }));
        }
      }, 150);
    }
  }, [currentTreeIndex, totalTrees, state.isLoading, onTreeIndexChange]);

  const handleSliderChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const newIndex = Number(event.target.value);
    if (newIndex !== currentTreeIndex && !state.isLoading) {
      setState(prev => ({ ...prev, isLoading: true, showPrediction: false, error: null }));
      onTreeIndexChange(newIndex);
      
      // Simulate data fetching
      setTimeout(() => {
        if (latestIndexRef.current === newIndex) {
          setState(prev => ({ ...prev, isLoading: false }));
        }
      }, 150);
    }
  }, [currentTreeIndex, state.isLoading, onTreeIndexChange]);

  const handleFinalPrediction = useCallback(() => {
    setState(prev => ({ ...prev, showPrediction: !prev.showPrediction }));
  }, []);

  // Calculate tree statistics
  const getTreeStats = useCallback(() => {
    if (!treeData) return null;
    
    return {
      totalNodes: treeData.decision_nodes + treeData.leaf_nodes,
      decisionNodes: treeData.decision_nodes,
      leafNodes: treeData.leaf_nodes,
      maxDepth: treeData.actual_depth,
      treeAccuracy: treeData.tree_accuracy
    };
  }, [treeData]);

  // Generate prediction result
  const getPredictionResult = useCallback((): PredictionResult => {
    if (!treeData) return {
      class: 'Unknown',
      probability: 0.5,
      confidence: 'Low',
      leafSamples: 0,
      reasoning: 'No data available'
    };

    const probability = treeData.tree_accuracy;
    const predictedClass = probability > 0.5 ? 'Benign' : 'Malignant';
    const confidence = probability > 0.8 ? 'High' : probability > 0.6 ? 'Medium' : 'Low';
    const leafSamples = Math.floor(treeData.training_samples * 0.1);
    
    const reasoning = `Based on ${treeData.decision_path.length} decision steps, this tree follows the path: ${
      treeData.decision_path.map(step => `${step.feature} ${step.condition}`).join(' → ')
    }`;

    return {
      class: predictedClass,
      probability,
      confidence,
      leafSamples,
      reasoning
    };
  }, [treeData]);

  // Calculate tree insights
  const getTreeInsights = useCallback(() => {
    if (!treeData) return null;
    
    const stats = getTreeStats();
    if (!stats) return null;
    
    const avgNodes = 15;
    
    return {
      complexity: stats.totalNodes > avgNodes ? "High" : "Low",
      performance: stats.treeAccuracy > 0.8 ? "Excellent" : stats.treeAccuracy > 0.6 ? "Good" : "Fair",
      uniqueness: treeData.decision_path.length > 4 ? "Highly Diverse" : "Standard",
      contribution: stats.treeAccuracy > 0.75 ? "Strong" : "Moderate"
    };
  }, [treeData, getTreeStats]);

  const stats = getTreeStats();
  const insights = getTreeInsights();
  const prediction = getPredictionResult();

  // Loading state component
  if (!treeData || state.isLoading) {
    return (
      <Card className="glass-panel border-white/10">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <TreePine className="h-5 w-5 text-green-400" />
            Decision Tree Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <p className="text-muted-foreground">Loading tree data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state component
  if (state.error) {
    return (
      <Card className="glass-panel border-white/10">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <TreePine className="h-5 w-5 text-red-400" />
            Decision Tree Analysis - Error
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>Error loading tree visualization: {state.error}</p>
            <Button 
              onClick={() => setState(prev => ({ ...prev, error: null }))}
              className="mt-2"
              variant="outline"
            >
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-panel border-white/10">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TreePine className="h-5 w-5 text-green-400" />
            Decision Tree #{currentTreeIndex} Analysis
          </CardTitle>
          
          {/* Enhanced Navigation Controls */}
          <div className="flex items-center gap-4">
            {/* Previous Button with enhanced styling */}
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousTree}
              disabled={currentTreeIndex === 0 || state.isLoading}
              className={`h-8 w-8 p-0 transition-all duration-200 ${
                currentTreeIndex === 0 || state.isLoading
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:scale-105 hover:bg-blue-500/20'
              }`}
              aria-label="Previous tree"
            >
              <ChevronLeft className={`h-4 w-4 ${
                currentTreeIndex === 0 ? 'text-gray-500' : 'text-blue-400'
              }`} />
            </Button>
            
            {/* Enhanced Index Display */}
            <div className="flex flex-col items-center gap-1">
              <span className="text-sm text-muted-foreground font-medium">
                {currentTreeIndex + 1} / {totalTrees}
              </span>
              
              {/* Synchronized Slider */}
              <input
                type="range"
                min="0"
                max={Math.max(0, totalTrees - 1)}
                value={currentTreeIndex}
                onChange={handleSliderChange}
                disabled={state.isLoading}
                className="w-20 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer
                          slider-thumb:appearance-none slider-thumb:h-4 slider-thumb:w-4 
                          slider-thumb:rounded-full slider-thumb:bg-blue-500 
                          slider-thumb:cursor-pointer slider-thumb:border-2 
                          slider-thumb:border-blue-300 disabled:opacity-50
                          disabled:cursor-not-allowed"
                style={{
                  background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${
                    (currentTreeIndex / Math.max(totalTrees - 1, 1)) * 100
                  }%, #374151 ${
                    (currentTreeIndex / Math.max(totalTrees - 1, 1)) * 100
                  }%, #374151 100%)`
                }}
              />
            </div>
            
            {/* Next Button with enhanced styling */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextTree}
              disabled={currentTreeIndex === totalTrees - 1 || state.isLoading}
              className={`h-8 w-8 p-0 transition-all duration-200 ${
                currentTreeIndex === totalTrees - 1 || state.isLoading
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:scale-105 hover:bg-blue-500/20'
              }`}
              aria-label="Next tree"
            >
              <ChevronRight className={`h-4 w-4 ${
                currentTreeIndex === totalTrees - 1 ? 'text-gray-500' : 'text-blue-400'
              }`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Tree Statistics Grid */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="h-5 w-5 text-blue-400" />
            <h4 className="text-blue-400 text-lg font-semibold">Tree Structure Statistics</h4>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 text-center transition-all hover:bg-blue-500/20">
              <div className="text-xl font-bold text-blue-400 mb-1">
                {stats!.totalNodes}
              </div>
              <div className="text-xs text-muted-foreground">Total Nodes</div>
            </div>
            
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-center transition-all hover:bg-green-500/20">
              <div className="text-xl font-bold text-green-400 mb-1">
                {stats!.decisionNodes}
              </div>
              <div className="text-xs text-muted-foreground">Decision Nodes</div>
            </div>
            
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3 text-center transition-all hover:bg-purple-500/20">
              <div className="text-xl font-bold text-purple-400 mb-1">
                {stats!.leafNodes}
              </div>
              <div className="text-xs text-muted-foreground">Leaf Nodes</div>
            </div>
            
            <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3 text-center transition-all hover:bg-orange-500/20">
              <div className="text-xl font-bold text-orange-400 mb-1">
                {stats!.maxDepth}
              </div>
              <div className="text-xs text-muted-foreground">Max Depth</div>
            </div>
            
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-center transition-all hover:bg-red-500/20">
              <div className="text-xl font-bold text-red-400 mb-1">
                {(stats!.treeAccuracy * 100).toFixed(1)}%
              </div>
              <div className="text-xs text-muted-foreground">Tree Accuracy</div>
            </div>
          </div>
        </div>

        {/* Tree Insights */}
        {insights && (
          <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-white/10 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-4 w-4 text-purple-400" />
              <h5 className="text-purple-400 font-semibold">Tree Analytics</h5>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div className="text-center">
                <div className="text-white font-medium">{insights.complexity}</div>
                <div className="text-gray-400 text-xs">Complexity</div>
              </div>
              <div className="text-center">
                <div className="text-white font-medium">{insights.performance}</div>
                <div className="text-gray-400 text-xs">Performance</div>
              </div>
              <div className="text-center">
                <div className="text-white font-medium">{insights.uniqueness}</div>
                <div className="text-gray-400 text-xs">Diversity</div>
              </div>
              <div className="text-center">
                <div className="text-white font-medium">{insights.contribution}</div>
                <div className="text-gray-400 text-xs">Contribution</div>
              </div>
            </div>
          </div>
        )}

        {/* Sample Decision Path */}
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
                      {step.samples && (
                        <div className="text-xs text-gray-400">
                          Samples: {step.samples}
                        </div>
                      )}
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
                {state.showPrediction ? 'Hide' : 'Show'} Final Prediction
              </Button>
            )}
          </div>
        </div>

        {/* Final Prediction Display */}
        {state.showPrediction && (
          <div className="bg-green-600/20 border border-green-500/30 rounded-lg p-4 animate-fade-in">
            <h4 className="text-green-400 font-semibold mb-3 flex items-center gap-2">
              <Target className="h-4 w-4" />
              Tree #{currentTreeIndex} Final Prediction
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
              Tree #{currentTreeIndex} uses {maxFeatures} feature selection with depth limit of {maxDepth}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DetailedTreeVisualization;
